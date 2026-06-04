const express = require('express')
const cors = require('cors')
const path = require('path')
const mysql = require('mysql2')
const bcrypt = require('bcrypt')
const multer = require('multer')
const jwt = require('jsonwebtoken')
const fs = require('fs')

const JWT_SECRET = 'super_secret_key_change_this'
const UPLOAD_DIR = path.join(__dirname, 'uploads')
const app = express()

app.use(cors())
app.use(express.json())

app.use('/uploads', express.static('uploads'))

const getImage = (path) => {
  if (!path) return ''
  return `${api_url}${path}`
}

const deleteFile = (filePath) => {
  if (!filePath) return

  const fullPath = path.join(__dirname, filePath)

  const tryDelete = (attempt = 1) => {
    fs.unlink(fullPath, (err) => {
      if (!err) return

      if (err.code === 'EPERM' && attempt < 3) {
        setTimeout(() => tryDelete(attempt + 1), 300)
      } else {
        console.log('File delete error:', err.message)
      }
    })
  }

  tryDelete()
}

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

const verifyAdmin = (req, res, next) => {

  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' })
  }

  const token = authHeader.substring(7)

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.admin = decoded
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}

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


app.post('/admin/login', (req, res) => {

  const { username, password } = req.body

  db.query(`
    SELECT
      id_admin,
      name,
      surname,
      email,
      username,
      password
    FROM Admin
    WHERE username = ?
  `, [username], async (err, result) => {

    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Database error'
      })
    }

    if (result.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      })
    }

    try {

      const admin = result[0]

      const match = await bcrypt.compare(password, admin.password)

      if (!match) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        })
      }

      // 🔥 TOKEN
      const token = jwt.sign(
        {
          id_admin: admin.id_admin,
          role: 'admin'
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      )

      res.json({
        success: true,
        token, // 👈 OVO JE BITNO
        admin: {
          id_admin: admin.id_admin,
          name: admin.name,
          surname: admin.surname,
          email: admin.email,
          username: admin.username,
          role: 'admin'
        }
      })

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Server error'
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



// =========================
// MULTER CONFIG (kao ostali API-i)
// =========================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {

    if (file.fieldname === 'image_profile') {
      cb(null, 'uploads/Article/Profile/')
    }

    else if (file.fieldname === 'image_header') {
      cb(null, 'uploads/Article/Header/')
    }

    else {
      cb(null, 'uploads/Article')
    }
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname))
  }
})

const fileFilter = (req, file, cb) => {
  // dopuštamo samo slike
  if (file.mimetype.startsWith('image/')) {
    cb(null, true)
  } else {
    cb(new Error('Only images allowed'), false)
  }
}

const upload = multer({
  storage,
  fileFilter
})


// =========================
// CREATE ARTICLE
// =========================
app.post('/articles',
  verifyAdmin, // 🔥 DODANO
  upload.fields([
    { name: 'image_profile', maxCount: 1 },
    { name: 'image_header', maxCount: 1 }
  ]),
  (req, res) => {

    const {
      short_title,
      long_title,
      text,
      published_at
    } = req.body

    if (!short_title || !long_title || !text) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      })
    }

   const image_profile =
  req.files?.image_profile?.[0]
    ? `uploads/Article/Profile/${req.files.image_profile[0].filename}`
    : null

const image_header =
  req.files?.image_header?.[0]
    ? `uploads/Article/Header/${req.files.image_header[0].filename}`
    : null

    const date =
      published_at || new Date().toISOString().split('T')[0]

    const id_admin = req.admin.id_admin // 🔥 IZ TOKENA

    db.query(`
      INSERT INTO Articles (
        short_title,
        long_title,
        text,
        image_profile,
        image_header,
        published_at,
        id_admin
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [
      short_title,
      long_title,
      text,
      image_profile,
      image_header,
      date,
      id_admin
    ],
    (err, result) => {

      if (err) {
        console.error(err)
        return res.status(500).json({
          success: false,
          message: 'Database error'
        })
      }

      res.json({
        success: true,
        id: result.insertId
      })

    })
  }
)


// GET PARTNERS ID
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
  `, [req.params.id], (err, result) => {
    if (err) return res.status(500).json(err)
    res.json(result[0])
  })
})




app.put(
  '/articles/:id',
  verifyAdmin,
  upload.fields([
    { name: 'image_profile', maxCount: 1 },
    { name: 'image_header', maxCount: 1 }
  ]),
  (req, res) => {

    const articleId = req.params.id

    const {
      short_title,
      long_title,
      text,
      published_at
    } = req.body

    if (!short_title || !long_title || !text) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      })
    }

    // 🔥 NEW FILE PATHS (ako postoje)
    const newProfile = req.files?.image_profile?.[0]
      ? `uploads/Article/Profile/${req.files.image_profile[0].filename}`
      : null

    const newHeader = req.files?.image_header?.[0]
      ? `uploads/Article/Header/${req.files.image_header[0].filename}`
      : null

    // 🔥 get old data
    db.query(
      `SELECT image_profile, image_header FROM Articles WHERE id_article = ?`,
      [articleId],
      (err, result) => {

        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Database error'
          })
        }

        if (!result.length) {
          return res.status(404).json({
            success: false,
            message: 'Article not found'
          })
        }

        const old = result[0]

        if (newProfile && old.image_profile) {
  deleteFile(old.image_profile)
}

if (newHeader && old.image_header) {
  deleteFile(old.image_header)
}

        // 🔥 FINAL VALUES (keep old if no new upload)
        const finalProfile = newProfile || old.image_profile
        const finalHeader = newHeader || old.image_header

        // 🔥 DELETE OLD FILES IF REPLACED
        if (newProfile && old.image_profile) {
          deleteFile(old.image_profile)
        }

        if (newHeader && old.image_header) {
          deleteFile(old.image_header)
        }

        // 🔥 UPDATE DB
        db.query(
          `
          UPDATE Articles
          SET
            short_title = ?,
            long_title = ?,
            text = ?,
            image_profile = ?,
            image_header = ?,
            published_at = ?
          WHERE id_article = ?
          `,
          [
            short_title,
            long_title,
            text,
            finalProfile,
            finalHeader,
            published_at,
            articleId
          ],
          (err2) => {

            if (err2) {
              console.error(err2)
              return res.status(500).json({
                success: false,
                message: 'Update failed'
              })
            }

            res.json({
              success: true,
              message: 'Article updated'
            })
          }
        )
      }
    )
  }
)



// DELETE ARTICLES
app.delete('/articles/:id', (req, res) => {

  const id = req.params.id

  db.query(
    `SELECT image_profile, image_header FROM Articles WHERE id_article = ?`,
    [id],
    (err, result) => {

      if (err) return res.status(500).json(err)

      if (!result.length) {
        return res.status(404).json({ message: 'Not found' })
      }

      const article = result[0]

      // 🔥 DELETE FILES
      deleteFile(article.image_profile)
      deleteFile(article.image_header)

      // 🔥 DELETE DB
      db.query(
        `DELETE FROM Articles WHERE id_article = ?`,
        [id],
        (err2) => {
          if (err2) return res.status(500).json(err2)

          res.json({
            success: true,
            message: 'Article + images deleted'
          })
        }
      )
    }
  )
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
  `, [req.params.id], (err, result) => {
    if (err) return res.status(500).json(err)
    res.json(result[0])
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