'use strict'

const AWS = require('aws-sdk')
const P = require('bluebird')
const Zlib = require('zlib')
const Fs = require('fs')
const Path = require('path')
const Hoek = require('hoek')
const Boom = require('boom')
const T = require('tcomb')
const Mimer = require('mimer')

Hoek.assert(process.env.CITYLIGHTS_AWS_BUCKET, 'Missing env `CITYLIGHTS_AWS_BUCKET`')
Hoek.assert(process.env.CITYLIGHTS_AWS_REGION, 'Missing env `CITYLIGHTS_AWS_REGION`')
Hoek.assert(process.env.CITYLIGHTS_AWS_KEY, 'Missing env `CITYLIGHTS_AWS_KEY`')
Hoek.assert(process.env.CITYLIGHTS_AWS_SECRET, 'Missing env `CITYLIGHTS_AWS_SECRET`')
Hoek.assert(process.env.npm_package_version, 'Missing env `npm_package_version`')

AWS.config.region = process.env.CITYLIGHTS_AWS_REGION

const S3 = new AWS.S3({
  accessKeyId: process.env.CITYLIGHTS_AWS_KEY,
  secretAccessKey: process.env.CITYLIGHTS_AWS_SECRET
})
P.promisifyAll(S3)

function createNewRelease (_manifestFile) {
  return P.try(() => {
    const manifestFile = Path.resolve(Path.join(__dirname, _manifestFile))
    console.log('Reading assets manifest file:', manifestFile)

    const assetsDir = Path.dirname(manifestFile)
    const version = process.env.npm_package_version
    const assets = JSON.parse(Fs.readFileSync(manifestFile))
    const files = Object.keys(assets).map((x) => (
      Path.join(assetsDir, Path.basename(assets[x].js))
    ))
    Hoek.assert(files && files.length, 'No files found!')

    console.log(`
    Creating new release.
    Version: ${version}
    Files:   ${files.length}
    `)

    const items = createItems(files)
    items.push(createReleaseManifest(version, items, assets))

    // Check if items are already on our CDN.
    return checkItems(items)
    .then((newItems) => {
      if (!newItems.length) {
        console.log('Everything’s already up there !')
        return
      }
      console.log(`Will upload the following items:\n`, newItems)
      return s3Uploader(newItems)
    })
  })
  .then(() => console.log('Done deal.'))
}

const checkItems = P.coroutine(function * (items) {
  const newItems = []
  for (const item of items) {
    const md = yield getMetadata(item.key)
    if (md === false) {
      newItems.push(item)
    } else {
      const info = `${md.LastModified} / ${md.ContentType} / ${md.ContentLength}`
      console.log('Found:', info)
    }
  }
  return newItems
})

function getMetadata (key) {
  const params = {
    Bucket: process.env.CITYLIGHTS_AWS_BUCKET,
    Key: key
  }
  console.log(`Fetching metadata -> ${params.Bucket}:${params.Key}`)
  return S3.headObjectAsync(params)
  .catch(() => false)
}

function isBlacklisted (x) {
  return x.match(/index\.html/)
}

// S3 uploader.
const s3Uploader = P.coroutine(function * _co (items) {
  let promises = []
  for (const item of items) {
    promises.push(_uploadItem(item))
    if (promises.length >= 5) {
      // Wait a bit.
      yield P.all(promises)
      promises = []
    }
  }

  if (promises.length) {
    // Wait for any remaining promises to fulfill.
    console.log(`Waiting for ${promises.length} last uploads to complete ..`)
    yield P.all(promises)
  }
  return 'OK'
})

function _uploadItem (item) {
  return P.try(() => {
    T.String(item.bucket)
    T.String(item.key)
    T.String(item.path)

    const gzip = Zlib.createGzip({ level: 9 })
    const params = {
      Bucket: item.bucket,
      Key: item.key,
      Body: Fs.createReadStream(item.path).pipe(gzip),
      StorageClass: 'REDUCED_REDUNDANCY',
      ACL: 'public-read',
      ContentEncoding: 'gzip',
      ContentType: Mimer(item.key)
    }
    console.log(`Uploading -> ${params.Bucket}:${params.Key}`)
    return S3.uploadAsync(params)
  })
}

function createItems (files) {
  return files.map((file) => {
    const stats = Fs.statSync(file)
    if (!stats.size) {
      throw Boom.notFound('File is empty: ' + file)
    }
    return createItem(file, stats.size)
  })
}

function createItem (file, size, prefix) {
  const p = prefix || 'assets'
  return {
    bucket: process.env.CITYLIGHTS_AWS_BUCKET,
    key: `${p}/${Path.basename(file)}`,
    path: file,
    size
  }
}

function createReleaseManifest (version, items, assets) {
  const manifestFile = `/tmp/release-manifest-${version}.json`
  const manifest = {
    version,
    date: new Date(),
    items: items.map((x) => x.key),
    assets
  }
  Fs.writeFileSync(manifestFile, JSON.stringify(manifest, false, 2))
  return createItem(manifestFile, 1000)
}

module.exports = {
  createNewRelease
}

if (require.main === module) {
  Hoek.assert(process.argv[2], 'Missing argument, usage "node s3.js /path/to/manifest.json"')
  createNewRelease(process.argv[2])
}
