<template>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
  />

  <q-page class="home-page">

    <!-- dio sa slikom i tekstom na vrhu -->
    <div class="hero-section">
      <img src="src/assets/Header-Home.jpg" class="hero-image" />

      <div class="hero-overlay"></div> <!-- tamni overlay na sloci -->

      <div class="hero-text">
        <h1>TGR HAAS F1 TEAM</h1>

        <h2>FORMULA 1 TEAM</h2>
      </div>
    </div>

    <!-- sekcija sa kratkim teksom o timu -->
    <div class="about-card">
      <h3>An American Formula 1 team driven by engineering excellence.</h3>

      <p>
        TGR Haas F1 Team represents American determination and engineering excellence at the highest
        level of motorsport – Formula 1. Founded by entrepreneur Gene Haas, the team made its debut
        in 2016 and quickly became part of the competitive Formula 1 paddock.
      </p>

      <p>
        Today, the team enters a new chapter as TGR Haas F1 Team through a major partnership with
        Toyota and its motorsport division Toyota Gazoo Racing. This collaboration strengthens the
        team’s technical capabilities and supports its ongoing pursuit of performance and
        innovation.
      </p>
    </div>

    <!-- sekcija sa vozačima tima -->
    <div class="drivers-section">
      <div class="drivers-header">
        <h4>GET TO KNOW</h4>
        <h3>OUR FORMULA 1 DRIVERS</h3>
      </div>

      <!-- prikazuje dva člana tima koji imaju rolu driver u bazi podataka i vodi na stranicu o njima -->
      <div class="drivers-grid">
        <router-link
          v-for="driver in drivers"
          :key="driver.id_member"
          :to="`/member/${driver.id_member}`"
          class="driver-card"
        >
          <img :src="getImage(driver.image_profile)" class="driver-img" />

          <!-- tekst na kratici vozača -->
          <div class="driver-text">
            <p>#{{ driver.driver_number }}</p>
            <p>{{ driver.name }} {{ driver.surname }}</p>
          </div>
        </router-link>
      </div>
    </div>

    <!-- sekcija najnovijih vijesti -->
    <div class="news-section">
      <div class="news-header">
        <h4>FIND OUT</h4>
        <h3>LATEST NEWS</h3>
      </div>

      <!-- prikaz 3 najnovije vijesti, vodi na tu vijest -->
      <div class="news-grid">
        <router-link
          v-for="article in latestArticles"
          :key="article.id_article"
          :to="`/article/${article.id_article}`"
          class="news-card"
        >
          <img :src="getImage(article.image_profile)" class="news-image" />

          <!-- datum objave vijesti -->
          <div class="news-date">
            {{ new Date(article.published_at).toLocaleDateString('en-GB') }}
          </div>

          <div class="news-title">
            {{ article.long_title }}
          </div>
        </router-link>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const drivers = ref([]) // sprema dva vozača koji se prikazuju
const latestArticles = ref([]) // sprema 3 najnovije vijesti koje se prikazuju

const api_url = import.meta.env.VITE_API_URL // ulr backend apija iz .env datoteke

// funkcija prima putanju slike iz backenda i vraća potpuni url za sliku
const getImage = (path) => {
  if (!path) return ''

  return `${api_url}/${encodeURI(path)}`
}

// funkcija dohvaća sve članove tima i filtrira ih an samo one koji imaju rolu driver
const loadDrivers = async () => {
  try {
    const res = await axios.get(`${api_url}/haas-team`)

    console.log(res.data)

    drivers.value = res.data.filter((driver) => driver.role === 'driver').slice(0, 2)
  } catch (err) {
    console.error('LOADING DRIVERS ERROR:', err)
  }
}

// funklcija dohvaća sve članke, sortiraju se od najnovijeg i prikazuju se prva 
const loadLatestArticles = async () => {
  try {
    const res = await axios.get(`${api_url}/articles`)

    latestArticles.value = res.data
      .sort((a, b) => new Date(b.published_at) - new Date(a.published_at))
      .slice(0, 3)
  } catch (err) {
    console.error('LOADING ARTICLES ERROR:', err)
  }
}

// nakon učitavanja prikazuju se vozači i članci
onMounted(() => {
  loadDrivers()
  loadLatestArticles()
})
</script>

<style scoped>
/* stranica */
.home-page {
  background: #ffffff;
}

/* dio sa slikom na vrhu */
.hero-section {
  position: relative;
  width: 100%;
  margin-top: -90px;
}

.hero-image {
  display: block;
  width: 100%;
}

/* tamni prijelaz na slici */
.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.85) 0%,
    rgba(0, 0, 0, 0.55) 35%,
    rgba(0, 0, 0, 0) 65%
  );
}

/* naslovi na slici*/
.hero-text {
  position: absolute;
  z-index: 2;
  left: 60px;
  bottom: 60px;
}

/* dio sa tekstom */
.about-card {
  padding: 150px 430px;
  justify-content: center;
  margin: 0 auto;
}

/* tekst */
.about-card p {
  max-width: 900px;
  text-align: justify;
}

/* dio za vozacima */
.drivers-header {
  margin-left: 55px;
}

/* grid sa karticama vozača, flex za raspred na dva dijela */
.drivers-grid {
  display: flex;
  justify-content: center;
  gap: 60px;
  margin: 70px 200px;
}

/* zasebna kartica vozača */
.driver-card {
  position: relative;
  width: 50%;
  max-width: 500px;
  overflow: hidden; /* sakrije rubove kod zooma */
}

/* slika vozača na kartici */
.driver-img {
  width: 100%;
  height: auto;
  display: block;
  transition: transform 0.5s ease;
}

/* povećavanje slike unutar kartice */
.driver-card:hover .driver-img {
  transform: scale(1.05);
}

/* tekst na kartici */
.driver-text {
  position: absolute;
  top: 30px;
  left: 25px;
}

.driver-text p {
  color: white;
  font-weight: 400;
  font-size: 18px;
  margin-bottom: 10px;
  line-height: 1;
  letter-spacing: 1px;
}

/* najnovije vijesti */
.news-header {
  margin-left: 55px;
  margin-bottom: 60px;
}

/* grid sa 3 vijesti, kao na stranici articles */
.news-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  margin: 0 55px;
  padding: 20px 70px 120px 70px;
}

/* kartica vijesti */
.news-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-decoration: none;
  color: black;
  transition: transform 0.25s ease;
}

/* hover podiže karticu */
.news-card:hover {
  transform: translateY(-5px);
}

.news-card:hover .news-title {
  color: var(--q-primary);
}

/* slika vijesti */
.news-image {
  width: 400px;
  height: 400px;
  object-fit: cover;
  display: block;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.1);
}

/* datum vijesti */
.news-date {
  font-size: 13px;
  color: #777;
  font-family: 'IBM Plex Sans', sans-serif;
  font-weight: 400;
}

/* naslov vijesti */
.news-title {
  font-size: 18px;
  font-weight: 500;
  font-family: 'IBM Plex Sans', sans-serif;
  line-height: 1.4;
  /* da ne izlazi iz kartice */
  width: 100%;
  overflow-wrap: break-word;
  word-break: break-word;
}
</style>
