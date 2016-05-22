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
    'https://c2.staticflickr.com/6/5253/5416395598_cf8b3890c9_q.jpg',
    'https://c2.staticflickr.com/6/5093/5457465126_109b8f663d_q.jpg',
    'https://c2.staticflickr.com/8/7473/15983789842_e0354c90ac_q.jpg',
    'https://c2.staticflickr.com/4/3834/11994460066_c9395b2eab_q.jpg',
    'https://c1.staticflickr.com/5/4053/5122105075_f1260e024f_q.jpg',
    'https://c2.staticflickr.com/8/7456/15884442613_356a458922_q.jpg',
    'https://c2.staticflickr.com/8/7413/11977563774_aa31eb350d_q.jpg',
    'https://c1.staticflickr.com/3/2629/3834455942_158f670dd3_q.jpg',
    'https://c2.staticflickr.com/4/3399/4651044764_47516fe827_q.jpg',
    'https://c2.staticflickr.com/8/7425/12362769364_b7bdb84d57_q.jpg',
    'https://c1.staticflickr.com/5/4013/4356500957_1799d0ef86_q.jpg',
    'https://c2.staticflickr.com/6/5565/14522163340_586eaf45a2_q.jpg',
    'https://c1.staticflickr.com/9/8423/7573671046_a816fd649d_q.jpg',
    'https://c1.staticflickr.com/1/772/23028118211_c1bd042de4_q.jpg',
    'https://c1.staticflickr.com/3/2105/5718669801_53257818b5_q.jpg',
    'https://c1.staticflickr.com/9/8406/8683564555_0d877ffa5c_q.jpg',
    'https://c1.staticflickr.com/9/8613/16274653845_a6e2e0c9fb_q.jpg',
    'https://c1.staticflickr.com/7/6137/5964490044_fc1278801f_q.jpg',
    'https://c1.staticflickr.com/3/2945/15494531826_69619b0f6e_q.jpg',
    'https://c2.staticflickr.com/8/7308/16431022125_2fa9bc29fc_q.jpg',
    'https://c1.staticflickr.com/9/8063/8190641738_53f22905c7_q.jpg',
    'https://c2.staticflickr.com/8/7306/16555071181_aecc3ec49b_q.jpg',
    'https://c2.staticflickr.com/8/7455/11505850665_3a59f13dc5_q.jpg',
    'https://c1.staticflickr.com/3/2947/15460908505_5bb616050b_q.jpg',
    'https://c2.staticflickr.com/8/7447/12389509955_9ef5d35a96_q.jpg',
    'https://c2.staticflickr.com/8/7395/9765251713_f0176f78ae_q.jpg',
    'https://c1.staticflickr.com/9/8606/15847044565_b89c612ed5_q.jpg',
    'https://c1.staticflickr.com/3/2922/14190330207_e72b130597_q.jpg',
    'https://c2.staticflickr.com/4/3928/15444165866_05516d064e_q.jpg',
    'https://c2.staticflickr.com/8/7552/15760059165_f8d43250fd_q.jpg',
    'https://c2.staticflickr.com/6/5579/14939862299_a8f8fb9c90_q.jpg',
    'https://c1.staticflickr.com/3/2679/4297616433_94222466f4_q.jpg',
    'https://c1.staticflickr.com/3/2679/4297616433_94222466f4_q.jpg',
    'https://c1.staticflickr.com/5/4102/5409879573_3be6931ef3_q.jpg',
    'https://c2.staticflickr.com/2/1408/1311336545_2690b02252_q.jpg',
    'https://c2.staticflickr.com/8/7381/9743878242_c912c5983a_q.jpg',
    'https://c2.staticflickr.com/8/7017/6578339495_b09dac4a67_q.jpg'
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
  /*
    Real surname occurrence stats a bit too high for my liking.
    'Andersson', '241854', 'Johansson', '241685', 'Karlsson', '214920', 'Nilsson', '165106', 'Eriksson', '143219', 'Larsson', '120795',
    'Olsson', '109964', 'Persson', '104111', 'Svensson', '97761', 'Gustafsson', '94403', 'Pettersson', '92275', 'Jonsson', '71774',
  */

  const lastNames = [
    'Andersson', '75000', 'Johansson', '75000', 'Karlsson', '75000', 'Nilsson', '75000', 'Eriksson', '75000', 'Larsson', '75000',
    'Olsson', '75000', 'Persson', '75000', 'Svensson', '75000', 'Gustafsson', '75000', 'Pettersson', '75000', 'Jonsson', '71774',
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
