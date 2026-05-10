const express = require('express')
const cors = require('cors')
const path = require('path')
const mysql = require('mysql2')

const app = express()

app.use(cors())

// 🔥 static folder za slike
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// 🔥 MySQL konekcija
const db = mysql.createConnection({
  host: 'ucka.veleri.hr',
  user: 'pgrgic',
  password: '11',
  database: 'pgrgic'
})

db.connect((err) => {
  if (err) {
    console.log('Greška spajanja:', err)
  } else {
    console.log('Spojeno na bazu ✅')
  }
})

// 🔥 API ruta
app.get('/team-gallery', (req, res) => {

  const sql = 'SELECT image FROM Team_gallery'

  db.query(sql, (err, results) => {

    if (err) {
      return res.status(500).json(err)
    }

    res.json(results)
  })
})

app.get('/haas-team', (req, res) => {

  const sql = 'SELECT id_member, image_header FROM Haas_team'

  db.query(sql, (err, results) => {

    if (err) {
      return res.status(500).json(err)
    }

    res.json(results)

  })

})

const PORT = 3000

app.listen(PORT, () => {
  console.log(`Server radi na http://localhost:${PORT}`)
})