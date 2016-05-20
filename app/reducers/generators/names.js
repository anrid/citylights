'use strict'

import Moment from 'moment'

export function getRandomAvatar (createdDate) {
  const avatarUrls = [
    'https://c2.staticflickr.com/8/7234/7300036942_c1679ee443_t.jpg',
    'https://c2.staticflickr.com/8/7218/7402376150_6b508dff90_t.jpg',
    'https://c1.staticflickr.com/7/6192/6123912393_46a4da7795_t.jpg',
    'https://c1.staticflickr.com/9/8464/8415646985_f10e90b893_q.jpg',
    'https://c1.staticflickr.com/7/6162/6199777163_17d444259b_t.jpg',
    'https://c2.staticflickr.com/6/5185/5771365116_86fed7a801_q.jpg',
    'https://c2.staticflickr.com/6/5253/5416395598_cf8b3890c9_q.jpg'
  ]
  const avatarIndex = (Moment(createdDate).unix() % avatarUrls.length)
  return avatarUrls[avatarIndex]
}

export function getRandomFirstName (createdDate) {
  // Given names taken from a popular babyname website.
  const firstNames = [
    'Elsa', 'Alice', 'Maja', 'Agnes', 'Lilly', 'Olivia', 'Julia', 'Ebba', 'Linnea', 'Molly', 'Ella', 'Wilma', 'Klara',
    'Stella', 'Freja', 'Alicia', 'Alva', 'Alma', 'Isabelle', 'Ellen', 'Saga', 'Ellie', 'Astrid', 'Emma', 'Nellie', 'Emilia',
    'Vera', 'Signe', 'Elvira', 'Nova', 'Selma', 'Ester', 'Leah', 'Felicia', 'Sara', 'Sofia', 'Elise', 'Ines', 'Tyra', 'Amanda',
    'Elin', 'Ida', 'Moa', 'Meja', 'Isabella', 'Tuva', 'Nora', 'Siri', 'Matilda', 'Sigrid', 'Edith', 'Lovisa', 'Juni', 'Liv',
    'Lova', 'Hanna', 'Tilde', 'Iris', 'Thea', 'Emelie', 'Melissa', 'Cornelia', 'Leia', 'Ingrid', 'Livia', 'Jasmine', 'Nathalie',
    'Greta', 'Stina', 'Joline', 'Filippa', 'Emmy', 'Svea', 'Marta', 'Tilda', 'Hilda', 'Majken', 'Celine', 'Ellinor', 'Lykke',
    'Novalie', 'Linn', 'Tindra', 'My', 'Mira', 'Rut', 'Ronja', 'Hilma', 'Lisa', 'Maria', 'Elina', 'Lovis', 'Minna', 'Hedda',
    'Amelia', 'Sally', 'Nicole', 'Victoria', 'Luna', 'Anna'
  ]
  const nameIndex = (Moment(createdDate).unix() % firstNames.length)
  return firstNames[nameIndex]
}

let _lastNames
export function getRandomLastName (email) {
  if (!_lastNames) {
    _lastNames = getLastNamesTable()
  }
  // Use the email hashcode to offset within the statistical spread of Swedish surnames.
  // We do this to;
  // A) always point a given email address to the same surname.
  // B) favor the common surnames, to keep things realistic.
  const nameIndex = (getHashCode(email) % _lastNames.total)
  const lastName = Object.keys(_lastNames.names).find((name) => {
    const { from, to } = _lastNames.names[name]
    return from <= nameIndex && nameIndex <= to
  })
  return lastName
}

// Returns a basic hashcode as a positive integer.
function getHashCode (str) {
  let hash = 0
  let i
  let chr
  let len
  if (str.length === 0) return hash
  for (i = 0, len = str.length; i < len; i++) {
    chr = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + chr
    hash |= 0 // Convert to 32bit integer
  }
  return Math.abs(hash)
}

function getLastNamesTable () {
  // Surname stats taken from Statistiska centralbyrån (www.scb.se).
  const lastNames = [
    'Andersson', '241854', 'Johansson', '241685', 'Karlsson', '214920', 'Nilsson', '165106', 'Eriksson', '143219', 'Larsson', '120795',
    'Olsson', '109964', 'Persson', '104111', 'Svensson', '97761', 'Gustafsson', '94403', 'Pettersson', '92275', 'Jonsson', '71774',
    'Jansson', '48437', 'Hansson', '42569', 'Bengtsson', '33196', 'Jönsson', '30925', 'Lindberg', '27602', 'Jakobsson', '26381',
    'Magnusson', '26099', 'Olofsson', '25761', 'Lindström', '24917', 'Lindqvist', '22917', 'Lindgren', '22801', 'Axelsson', '22452',
    'Berg', '21672', 'Bergström', '21166', 'Lundberg', '21102', 'Lundgren', '20453', 'Lind', '20181', 'Lundqvist', '20114',
    'Mattsson', '19686', 'Berglund', '19160', 'Fredriksson', '18203', 'Sandberg', '17697', 'Henriksson', '17458', 'Forsberg', '16629',
    'Sjöberg', '16421', 'Wallin', '15890', 'Engström', '15491', 'Danielsson', '15335', 'Eklund', '15315', 'Håkansson', '15231', 'Lundin',
    '15059', 'Gunnarsson', '14389', 'Bergman', '14239', 'Björk', '14217', 'Holm', '14215', 'Samuelsson', '14108', 'Fransson', '14048',
    'Wikström', '13913', 'Isaksson', '13781', 'Bergqvist', '13458', 'Arvidsson', '13317', 'Nyström', '13292', 'Holmberg', '13162', 'Löfgren',
    '12847', 'Söderberg', '12693', 'Nyberg', '12587', 'Blomqvist', '12546', 'Claesson', '12544', 'Mårtensson', '12303', 'Nordström', '12134',
    'Lundström', '11863', 'Ali', '11576', 'Mohamed', '11574', 'Eliasson', '11527', 'Pålsson', '11514', 'Viklund', '11416', 'Björklund', '11362',
    'Berggren', '11171', 'Sandström', '10793', 'Lund', '10779', 'Nordin', '10698', 'Ström', '10577', 'Åberg', '10504', 'Hermansson', '10431',
    'Ekström', '10285', 'Holmgren', '10182', 'Hedlund', '10023', 'Sundberg', '9990', 'Dahlberg', '9890', 'Falk', '9870', 'Hellström', '9864',
    'Sjögren', '9796', 'Abrahamsson', '9607', 'Martinsson', '9519', 'Ek', '9454', 'Blom', '9449', 'Öberg', '9439', 'Andreasson', '9345',
    'Månsson', '9205', 'Strömberg', '9113', 'Åkesson', '9010', 'Jonasson', '8862', 'Hansen', '8830', 'Norberg', '8780', 'Åström', '8760',
    'Sundström', '8711', 'Lindholm', '8707', 'Holmqvist', '8650'
  ]

  // Not very fancy, but does the trick.
  return lastNames.reduce((acc, name, i) => {
    if (i % 2 === 0) {
      acc.last = name
    } else {
      const count = parseInt(name)
      const from = acc.total
      const to = from + count
      acc.total = to
      acc.names[acc.last] = { from, to }
    }
    return acc
  }, { total: 0, names: { }, last: null })
}

// Give it a whirl.
// console.log('anri@taskworld.com ->', getRandomLastName('anri@taskworld.com'))
// console.log('anri1@taskworld.com ->', getRandomLastName('anri1@taskworld.com'))
// console.log('anri2@taskworld.com ->', getRandomLastName('anri2@taskworld.com'))
// console.log('anri@taskworld.com ->', getRandomLastName('anri@taskworld.com'))
