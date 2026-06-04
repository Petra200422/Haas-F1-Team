const bcrypt = require('bcrypt')

async function generateHash() {
  const password = 'Petra123' // ovdje stavi svoju lozinku

  const hash = await bcrypt.hash(password, 10)

  console.log(hash)
}

generateHash()