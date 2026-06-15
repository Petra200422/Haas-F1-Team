require("dotenv").config(); //učitava varijable iz .env datoteke (za bazu, token i port)
const express = require("express"); //framework za izradu backenda i api ruta
const cors = require("cors"); //potrebanm za komunkaciju frontenda i backenda
const path = require("path"); //rad sa putanjama i datotekama
const mysql = require("mysql2"); //povezaivanje sa bazom podataka
const bcrypt = require("bcrypt"); //sigurna provjera lozinki
const multer = require("multer"); //za upload datoteke (slike)
const jwt = require("jsonwebtoken"); //izrada i provjera tokena
const fs = require("fs"); //rad s daotetkama na serveru
const cron = require("node-cron"); //automatkso pokretanje zadataka u određeno vrijeme
const axios = require("axios"); //slanje HTTP zahtjeva prema vanjskim apijima

const JWT_SECRET = process.env.JWT_SECRET; //ključ za popisivanje tokena
const app = express(); //kreiranje express aplikacije

app.use(cors()); //omogućuje cors, forntend ne bi mogao slati zahtejev bez ovoga
app.use(express.json()); //omogućuje čitanje JSON podataka

app.use("/uploads", express.static("uploads")); //posluživanje slika iz uploads foldera

// MySQL spajanje na bazu
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.log("Database connection error:", err);
  } else {
    console.log("Successfully connected to the database");
  }
});


//funkcija za brisanje datoteke iz uploads foldera
//prima putanju datoteke premljenu u bazu, pretvara putanju u potpunu i onda je fs.unlink pokušava obrisati
//više pokušaja ako je EPERM greška, može se pojaviti na windowsu
const deleteFile = (filePath) => {
  if (!filePath) return;

  const fullPath = path.join(__dirname, filePath);

  const tryDelete = (attempt = 1) => {
    fs.unlink(fullPath, (err) => {
      if (!err) return;

      if (err.code === "EPERM" && attempt < 3) {
        setTimeout(() => tryDelete(attempt + 1), 300);
      } else {
        console.log("File delete error:", err.message);
      }
    });
  };

  tryDelete();
};


//provjera administracijskog tokena
//na rutama koje može korisiti samo admin
//ako je tonek ispravan, podatci se spremaju u req.admin, a ako nije onda se javlja greška
const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};


//funkcija dohvaća najnoviji poredak vozača iz OpenF1 apija
//za svakog vozača ažuriraju se points i position
//u bazi se vozač pronalazi pomoću driver_number
async function updateDriverStandings() {
  try {
    const response = await axios.get(
      "https://api.openf1.org/v1/championship_drivers?session_key=latest",
    );

    const drivers = response.data;

    for (const driver of drivers) {
      db.query(
        `UPDATE Drivers SET
          points = ?,
          position = ?
        WHERE driver_number = ?`,
        [driver.points_current, driver.position_current, driver.driver_number],
      );
    }

    console.log("Driver standings updated");
  } catch (err) {
    console.error("Driver update error:", err);
  }
}


//funkcija dohvaća najnoviji poredak timova iz OpenF1 apija
//ažuriraju se points i position
//tim se pronalazi prema team_name
async function updateTeamStandings() {
  try {
    const response = await axios.get(
      "https://api.openf1.org/v1/championship_teams?session_key=latest",
    );

    const teams = response.data;

    for (const team of teams) {
      db.query(
        `UPDATE Teams SET
          points = ?,
          position = ?
        WHERE team_name = ?`,
        [team.points_current, team.position_current, team.team_name],
      );
    }

    console.log("Team standings updated");
  } catch (err) {
    console.error("Team update error:", err);
  }
}


//funkcija dohvača datume utrka za sezonu 2026 iz OpenF1 apija
//vraća datume u ISO formatu, pretvaramo ih u samo datum
//utrka se pronalazi prema openf1_meeting_key
async function updateRaceDates() {
  try {
    const response = await axios.get(
      "https://api.openf1.org/v1/meetings?year=2026",
    );

    const meetings = response.data;

    for (const meeting of meetings) {
      const dateStart = meeting.date_start
        ? meeting.date_start.split("T")[0]
        : null;

      const dateEnd = meeting.date_end ? meeting.date_end.split("T")[0] : null;

      db.query(
        `UPDATE Race SET
          date_start = ?,
          date_end = ?
        WHERE openf1_meeting_key = ?`,
        [dateStart, dateEnd, meeting.meeting_key],
      );
    }

    console.log("Race dates updated");
  } catch (err) {
    console.error("Race dates update error:", err);
  }
}


// GET ADMIN
//dohvaća popis admina iz tablice Admin
app.get("/admin", (req, res) => {
  db.query(
    `SELECT 
      id_admin,
      name,
      surname,
      email,
      username
    FROM Admin`,
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    },
  );
});


// POST ADMIN
//za prijavu administratora
//frontend šalje username i password, backend provjerava podatke, bcrypt uspoređuje lozinke i ako odgovaraju, frontendu se vraća token i podatci
app.post("/admin/login", (req, res) => {
  const { username, password } = req.body;

  db.query(
    `SELECT
      id_admin,
      name,
      surname,
      email,
      username,
      password
    FROM Admin
    WHERE username = ?`,
    [username],
    async (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Database error",
        });
      }

      if (result.length === 0) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      try {
        const admin = result[0];

        const match = await bcrypt.compare(password, admin.password);

        if (!match) {
          return res.status(401).json({
            success: false,
            message: "Invalid credentials",
          });
        }

        //izrada tokena
        const token = jwt.sign(
          {
            id_admin: admin.id_admin,
            role: "admin",
          },
          JWT_SECRET,
          { expiresIn: "7d" },
        );

        res.json({
          success: true,
          token,
          admin: {
            id_admin: admin.id_admin,
            name: admin.name,
            surname: admin.surname,
            email: admin.email,
            username: admin.username,
            role: "admin",
          },
        });
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: "Server error",
        });
      }
    },
  );
});


// GET HAAS TEAM
//dohvaća sve članove iz tablice Haas_team
//na Team Page i Index Page
app.get("/haas-team", (req, res) => {
  db.query(
    `SELECT 
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
    FROM Haas_team`,
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    },
  );
});


// GET HAAS TEAM ID
//dohvaća jednog člana tima prema id_member
//na Team Member Page
app.get("/haas-team/:id", (req, res) => {
  db.query(
    `SELECT 
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
    WHERE id_member = ?`,
    [req.params.id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result[0]);
    },
  );
});


// CAREER HISTORY MEMBER ID
//dohvaća povijest određenog člana tima, id dolazi iz url
//od najnovije godine prema najstarijoj
app.get("/career-history/:id", (req, res) => {
  const memberId = req.params.id;

  db.query(
    `SELECT 
      id_career AS id,
      id_member,
      year,
      content AS description
    FROM Career_history
    WHERE id_member = ?
    ORDER BY year DESC`,
    [memberId],
    (err, result) => {
      if (err) {
        console.error("Career history error:", err);
        return res.status(500).json({ error: "Database error" });
      }

      res.json(result);
    },
  );
});


// GET SCHEDULE 
//dohvaća sve utrke za 2026
//podatci iz tablice Race, a slike i lokacija iz tablice Circuits
app.get("/schedule-races", (req, res) => {
  db.query(
    `SELECT 
      r.id_race,
      r.id_circuit,
      r.race_name,
      r.season_year,
      r.round,
      r.openf1_meeting_key,
      r.date_start,
      r.date_end,
      c.name AS circuit_name,
      c.city,
      c.country,
      c.image_profile
    FROM Race r
    JOIN Circuits c
      ON r.id_circuit = c.id_circuit
    WHERE r.season_year = 2026
    ORDER BY r.round ASC`,
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    },
  );
});


// GET RACE DETAILS
//detalji jedne utrke
//spaja tablice Race i Circuit
app.get("/race-details/:id", (req, res) => {
  db.query(
    `SELECT 
      r.id_race,
      r.id_circuit,
      r.race_name,
      r.season_year,
      r.round,
      r.openf1_meeting_key,
      r.date_start,
      r.date_end,
      c.name AS circuit_name,
      c.city,
      c.country,
      c.first_gp,
      c.laps,
      c.turns,
      c.length_km,
      c.race_distance_km,
      c.description,
      c.fun_fact,
      c.track_features,
      c.image_header,
      c.image_profile,
      c.image_track,
      c.image_sectors
    FROM Race r
    JOIN Circuits c
      ON r.id_circuit = c.id_circuit
    WHERE r.id_race = ?`,
    [req.params.id],
    (err, result) => {
      if (err) return res.status(500).json(err);

      if (result.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Race not found",
        });
      }

      res.json(result[0]);
    },
  );
});


// GET RACE SESSIONS
//dohvaća sesije iz OpenF1 apija
//iz baze se prema id_race dohvaća openf1_meeting_key koji se koristi u nedpointu
//sortiraju se prema vremenu početka
app.get("/race-sessions/:id", (req, res) => {
  db.query(
    `SELECT openf1_meeting_key
    FROM Race
    WHERE id_race = ?`,
    [req.params.id],
    async (err, result) => {
      if (err) return res.status(500).json(err);

      if (result.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Race not found",
        });
      }

      try {
        const meetingKey = result[0].openf1_meeting_key;
        const response = await axios.get(
          `https://api.openf1.org/v1/sessions?meeting_key=${meetingKey}`,
        );

        const sessions = response.data.sort(
          (a, b) => new Date(a.date_start) - new Date(b.date_start),
        );

        res.json(sessions);
      } catch (error) {
        console.error(error);

        res.status(500).json({
          success: false,
          message: "Sessions load failed",
        });
      }
    },
  );
});


// GET ARTICLES
//dohvaća sve članke iz teblice Articles
app.get("/articles", (req, res) => {
  db.query(
    `SELECT 
      id_article,
      short_title,
      long_title,
      text,
      image_profile,
      image_header,
      published_at,
      id_admin
    FROM Articles`,
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    },
  );
});


//multer za upload slike članka
//diskStorage određuje gdje se sprema datoteka i kako će se zvati
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "image_profile") {
      cb(null, "uploads/Article/Profile/");
    } else if (file.fieldname === "image_header") {
      cb(null, "uploads/Article/Header/");
    } else {
      cb(null, "uploads/Article");
    }
  },

  //naziv se generiraj pomoću Date.new da ne postoje dvije slike sa istim nazivom
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

//provjerava je li uploadana datoteka slika, ako nije image odbija se
const fileFilter = (req, file, cb) => {
  //samo slike
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only images allowed"), false);
  }
};

//kreira multer instance, korisi se u post i put rutama
const upload = multer({
  storage,
  fileFilter,
});


// POST ARTICLES
//kreira novi članak, samo za admina
//moguće dvije slike dodati
app.post(
  "/articles",
  verifyAdmin, 
  upload.fields([
    { name: "image_profile", maxCount: 1 },
    { name: "image_header", maxCount: 1 },
  ]),
  (req, res) => {
    const { short_title, long_title, text, published_at } = req.body;

    if (!short_title || !long_title || !text) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const image_profile = req.files?.image_profile?.[0]
      ? `uploads/Article/Profile/${req.files.image_profile[0].filename}`
      : null;

    const image_header = req.files?.image_header?.[0]
      ? `uploads/Article/Header/${req.files.image_header[0].filename}`
      : null;

    const date = published_at || new Date().toISOString().split("T")[0];

    const id_admin = req.admin.id_admin; 

    db.query(
      `INSERT INTO Articles (
        short_title,
        long_title,
        text,
        image_profile,
        image_header,
        published_at,
        id_admin
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        short_title,
        long_title,
        text,
        image_profile,
        image_header,
        date,
        id_admin,
      ],
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({
            success: false,
            message: "Database error",
          });
        }

        res.json({
          success: true,
          id: result.insertId,
        });
      },
    );
  },
);


// PUT ARTICLES
//uređuje postojeće vijesti
//samo za admina
//ako se odaberu nove slike, stare se brišu, nova ptanja ide u bazu
app.put(
  "/articles/:id",
  verifyAdmin,
  upload.fields([
    { name: "image_profile", maxCount: 1 },
    { name: "image_header", maxCount: 1 },
  ]),
  (req, res) => {
    const articleId = req.params.id;

    //datum objave se ne dohvaća jer se ne mijenja prilikom uređivanja članka
    const { short_title, long_title, text } = req.body;

    if (!short_title || !long_title || !text) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    //putanje novih slika, ako su nove slike odabrane u formi
    const newProfile = req.files?.image_profile?.[0]
      ? `uploads/Article/Profile/${req.files.image_profile[0].filename}`
      : null;

    const newHeader = req.files?.image_header?.[0]
      ? `uploads/Article/Header/${req.files.image_header[0].filename}`
      : null;

    //dohvaćaju se stare slike kako bi se mogle zadržati ili obrisati ako su zamijenjene
    db.query(
      `SELECT image_profile, image_header FROM Articles WHERE id_article = ?`,
      [articleId],
      (err, result) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: "Database error",
          });
        }

        if (!result.length) {
          return res.status(404).json({
            success: false,
            message: "Article not found",
          });
        }

        const old = result[0];

        //ako je učitana nova profile slika, stara se briše iz uploads foldera
        if (newProfile && old.image_profile) {
          deleteFile(old.image_profile);
        }

        //ako je učitana nova header slika, stara se briše iz uploads foldera
        if (newHeader && old.image_header) {
          deleteFile(old.image_header);
        }

        //ako nova slika nije učitana, zadržava se postojeća putanja stare slike
        const finalProfile = newProfile || old.image_profile;
        const finalHeader = newHeader || old.image_header;

        //ažuriraju se samo podaci koji se smiju mijenjati
        db.query(
          `UPDATE Articles
          SET
            short_title = ?,
            long_title = ?,
            text = ?,
            image_profile = ?,
            image_header = ?
          WHERE id_article = ?`,
          [
            short_title,
            long_title,
            text,
            finalProfile,
            finalHeader,
            articleId,
          ],
          (err2) => {
            if (err2) {
              console.error(err2);
              return res.status(500).json({
                success: false,
                message: "Update failed",
              });
            }

            res.json({
              success: true,
              message: "Article updated",
            });
          },
        );
      },
    );
  },
);


// GET ARTICLES ID
//dohvaća jedan članak prema id_article
app.get("/articles/:id", (req, res) => {
  db.query(
    `SELECT 
      id_article,
      short_title,
      long_title,
      text,
      image_profile,
      image_header,
      published_at,
      id_admin
    FROM Articles
    WHERE id_article = ?`,
    [req.params.id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result[0]);
    },
  );
});


// DELETE ARTICLES
//briše vijest i njegove slike
//samo za admina
app.delete("/articles/:id", (req, res) => {
  const id = req.params.id;

  db.query(
    `SELECT image_profile, image_header FROM Articles WHERE id_article = ?`,
    [id],
    (err, result) => {
      if (err) return res.status(500).json(err);

      if (!result.length) {
        return res.status(404).json({ message: "Not found" });
      }

      const article = result[0];

      deleteFile(article.image_profile);
      deleteFile(article.image_header);

      db.query(`DELETE FROM Articles WHERE id_article = ?`, [id], (err2) => {
        if (err2) return res.status(500).json(err2);

        res.json({
          success: true,
          message: "Article + images deleted",
        });
      });
    },
  );
});


// GET PARTNERS
//dohvaća sve partnere iz teblice Partners
app.get("/partners", (req, res) => {
  db.query(
    `SELECT 
      id_partner,
      name,
      description,
      website,
      instagram,
      twitter,
      facebook,
      logo,
      image_header
    FROM Partners`,
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    },
  );
});


// GET PARTNERS ID
//dohvaća jednog partnera prema id_partner
app.get("/partners/:id", (req, res) => {
  db.query(
    `SELECT 
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
    WHERE id_partner = ?`,
    [req.params.id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result[0]);
    },
  );
});


// GET TEAM GALLERY ID
//dohvaća galeriju slika za određenog člana tima prema id iz url
app.get("/team-gallery/:id", (req, res) => {
  db.query(
    `SELECT 
      id_image,
      id_member,
      image,
      description
    FROM Team_gallery
    WHERE id_member = ?`,
    [req.params.id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    },
  );
});


// GET CIRCUIT GALLERY ID
//dohvaća galeriju slika za određenu satzu prema id iz url
app.get("/circuit-gallery/:id", (req, res) => {
  db.query(
    `SELECT 
      id_image,
      id_circuit,
      image,
      description
    FROM Circuit_gallery
    WHERE id_circuit = ?`,
    [req.params.id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    },
  );
});


// GET DRIVERS STANDINGS
//dohvaća poredak vozača iz baze koji su ažurirani iz OpenF1
app.get("/driver-standings", (req, res) => {
  db.query(
    `SELECT
      id_driver,
      name,
      surname,
      driver_number,
      id_team,
      points,
      position
    FROM Drivers
    ORDER BY position ASC`,
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    },
  );
});


// GET TEAMS STANDINGS
//dohvaća poredak timova iz baze, sortiraju se prema poziciji
app.get("/team-standings", (req, res) => {
  db.query(
    `SELECT
      id_team,
      team_name,
      points,
      position
    FROM Teams
    ORDER BY position ASC`,
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    },
  );
});


//datoteka u koju se sprema vrijeme zadnjeg ažuriranja podataka
const UPDATE_FILE = "lastUpdate.json";

const updateIfNeeded = async () => {
  try {
    const now = new Date();

    let lastUpdate = null;

    //učitavanje vremena zadnjeg updatea
    if (fs.existsSync(UPDATE_FILE)) {
      const data = JSON.parse(fs.readFileSync(UPDATE_FILE, "utf8"));
      lastUpdate = new Date(data.lastUpdate);
    }

    // 12 sati u milisekundama
    const twelveHours = 12 * 60 * 60 * 1000;

    //preskoči update ako nije prošlo 12 sati
    if (
      lastUpdate &&
      now.getTime() - lastUpdate.getTime() < twelveHours
    ) {
      console.log("Update skipped - less than 12 hours since last update.");
      return;
    }

    console.log("Automatic update started");

    await updateDriverStandings();
    await updateTeamStandings();
    await updateRaceDates();

    //spremanje vremena uspješnog updatea
    fs.writeFileSync(
      UPDATE_FILE,
      JSON.stringify({
        lastUpdate: now.toISOString(),
      })
    );

    console.log("Automatic update finished");
  } catch (err) {
    console.error("Automatic update failed:", err);
  }
};


//corn se pokreće svaki dan u 00:00
//ažurira poredak vozača, poredak timova i datume utrka ako je prošlo više od 24 sata od prošlod updatea
cron.schedule("0 0 * * *", async () => {
  console.log("Daily standings update started");
await updateIfNeeded();

  console.log("Daily standings update finished");
});

//port na kojem backend server radi
const PORT = process.env.PORT;

//pokretanje express servera i updatea boodva ako je potrebno
app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);

   updateIfNeeded().catch((err) => {
    console.error("Startup update failed:", err);
  });
});
