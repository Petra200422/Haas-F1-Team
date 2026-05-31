const express = require('express')
const cors = require('cors')
const path = require('path')
const mysql = require('mysql2')

const app = express()

app.use(cors())

app.use('/uploads', express.static('uploads'))

// MySQL spajanje
const db = mysql.createConnection({
  host: 'ucka.veleri.hr',
  user: 'pgrgic',
  password: '11',
  database: 'pgrgic'
})

db.connect((err) => {
  if (err) {
    console.log('Greška prilikom spajanja:', err)
  } else {
    console.log('Uspješno spajanje na bazu')
  }
})

// GET ADMIN
app.get('/admin', (req, res) => {
  db.query(`
    SELECT 
      id_admin,
      name,
      surname,
      email,
      username
    FROM Admin
  `, (err, result) => {
    if (err) return res.status(500).json(err)
    res.json(result)
  })
})


// POST ADMIN
app.post('/admin/login', (req, res) => {

  const { username, password } = req.body

  db.query(`
    SELECT 
      id_admin,
      name,
      surname,
      email,
      username
    FROM Admin
    WHERE username = ? AND password = ?
  `, [username, password], (err, result) => {

    if (err) return res.status(500).json(err)

    if (result.length > 0) {
      res.json({
        success: true,
        admin: result[0]
      })
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      })
    }

  })
})


// GET HAAS TEAM
app.get('/haas-team', (req, res) => {
  db.query(`
    SELECT 
      id_member,
      name,
      surname,
      role,
      nationality,
      birth_date,
      driver_number,
      description,
      image_header,
      image_profile
    FROM Haas_team
  `, (err, result) => {
    if (err) return res.status(500).json(err)
    res.json(result)
  })
})


// GET HAAS TEAM ID
app.get('/haas-team/:id', (req, res) => {
  db.query(`
    SELECT 
      id_member,
      name,
      surname,
      role,
      nationality,
      birth_date,
      driver_number,
      description,
      image_header,
      image_profile
    FROM Haas_team
    WHERE id_member = ?
  `, [req.params.id], (err, result) => {
    if (err) return res.status(500).json(err)
    res.json(result[0])
  })
})


// CAREER HISTORY BY MEMBER ID
app.get('/career-history/:id', (req, res) => {
  const memberId = req.params.id

  db.query(`
    SELECT 
      id_career AS id,
      id_member,
      year,
      content AS description
    FROM Career_history
    WHERE id_member = ?
    ORDER BY year DESC
    `,
    [memberId],
    (err, result) => {
      if (err) {
        console.error('Career history error:', err)
        return res.status(500).json({ error: 'Database error' })
      }

      res.json(result)
    }
  )
})


// GET CIRCUITS
app.get('/circuits', (req, res) => {
  db.query(`
    SELECT 
      id_circuit,
      name,
      city,
      country,
      first_gp,
      laps,
      turns,
      length_km,
      race_distance_km,
      description,
      fun_fact,
      track_features,
      image_header,
      image_profile,
      image_track,
      image_sectors
    FROM Circuits
  `, (err, result) => {
    if (err) return res.status(500).json(err)
    res.json(result)
  })
})



// GET CIRCUITS ID
app.get('/circuits/:id', (req, res) => {
  db.query(`
    SELECT 
      id_circuit,
      name,
      city,
      country,
      first_gp,
      laps,
      turns,
      length_km,
      race_distance_km,
      description,
      fun_fact,
      track_features,
      image_header,
      image_profile,
      image_track,
      image_sectors
    FROM Circuits
    WHERE id_circuit = ?
  `, [req.params.id], (err, result) => {
    if (err) return res.status(500).json(err)
    res.json(result[0])
  })
})



// GET RACE
app.get('/race', (req, res) => {
  db.query(`
    SELECT 
      id_race,
      id_circuit,
      race_name,
      season_year,
      round,
      openf1_meeting_key
    FROM Race
  `, (err, result) => {
    if (err) return res.status(500).json(err)
    res.json(result)
  })
})


// GET RACE ID
app.get('/race/:id', (req, res) => {
  db.query(`
    SELECT 
      id_race,
      id_circuit,
      race_name,
      season_year,
      round,
      openf1_meeting_key
    FROM Race
    WHERE id_race = ?
  `, [req.params.id], (err, result) => {
    if (err) return res.status(500).json(err)
    res.json(result[0])
  })
})



// GET ARTICLES
app.get('/articles', (req, res) => {
  db.query(`
    SELECT 
      id_article,
      short_title,
      long_title,
      text,
      image_profile,
      image_header,
      published_at,
      id_admin
    FROM Articles
  `, (err, result) => {
    if (err) return res.status(500).json(err)
    res.json(result)
  })
})


// GET ARTICLES ID
app.get('/articles/:id', (req, res) => {
  db.query(`
    SELECT 
      id_article,
      short_title,
      long_title,
      text,
      image_profile,
      image_header,
      published_at,
      id_admin
    FROM Articles
    WHERE id_article = ?
  `, (err, result) => {
    if (err) return res.status(500).json(err)
    res.json(result)
  })
})



// UPDATE ARTICLES
app.put('/articles/:id', (req, res) => {

  const {
    short_title,
    long_title,
    text,
    image_profile,
    image_header
  } = req.body

  db.query(`
    UPDATE Articles
    SET 
      short_title = ?,
      long_title = ?,
      text = ?,
      image_profile = ?,
      image_header = ?
    WHERE id_article = ?
  `, [
    short_title,
    long_title,
    text,
    image_profile,
    image_header,
    req.params.id
  ], (err, result) => {

    if (err) return res.status(500).json(err)

    res.json({
      success: true,
      message: 'Article updated'
    })

  })
})



// DELETE ARTICLES
app.delete('/articles/:id', (req, res) => {

  db.query(`
    DELETE FROM Articles 
    WHERE id_article = ?
  `, [req.params.id], (err, result) => {

    if (err) return res.status(500).json(err)

    res.json({
      success: true,
      message: 'Article deleted'
    })

  })
})


// GET PARTNERS
app.get('/partners', (req, res) => {
  db.query(`
    SELECT 
      id_partner,
      name,
      description,
      website,
      instagram,
      twitter,
      facebook,
      logo,
      image_header
    FROM Partners
  `, (err, result) => {
    if (err) return res.status(500).json(err)
    res.json(result)
  })
})



// GET PARTNERS ID
app.get('/partners/:id', (req, res) => {
  db.query(`
    SELECT 
      id_partner,
      name,
      description,
      website,
      instagram,
      twitter,
      facebook,
      logo,
      image_header
    FROM Partners
    WHERE id_partner = ?
  `, (err, result) => {
    if (err) return res.status(500).json(err)
    res.json(result)
  })
})


// GET TEAM GALLERY ID
app.get('/team-gallery/:id', (req, res) => {
  db.query(`
    SELECT 
      id_image,
      id_member,
      image,
      description
    FROM Team_gallery
    WHERE id_member = ?
  `, [req.params.id], (err, result) => {
    if (err) return res.status(500).json(err)
    res.json(result)
  })
})


// GET CIRCUIT GALLERY ID
app.get('/circuit-gallery/:id', (req, res) => {
  db.query(`
    SELECT 
      id_image,
      id_circuit,
      image,
      description
    FROM Circuit_gallery
    WHERE id_circuit = ?
  `, [req.params.id], (err, result) => {
    if (err) return res.status(500).json(err)
    res.json(result)
  })
})


const PORT = 3000

app.listen(PORT, () => {
  console.log(`Server radi na portu ${PORT}`)
})