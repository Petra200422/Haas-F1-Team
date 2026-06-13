<template>
  <q-page class="articles-page">
    <div class="artices-header">
      <!-- naslov koji se nalazi lijevo -->
      <div class="header-left">
        <h1>ALL THE LATEST</h1>
        <h2>BREAKING NEWS</h2>
      </div>

      <!-- tekst koji je desno od naslova -->
      <div class="header-right">
        <p>
          The Haas F1 Team competes at the highest level of motorsport, constantly pushing for
          stronger performances and better results. Stay up to date with the latest news, race
          updates, and team insights as Haas takes on the challenges of Formula 1 and fights for
          every point on the grid.
        </p>
      </div>
    </div>

    <!-- crta izmedu sekcija -->
    <div class="divider"></div>

    <!-- filter za odabir godine vijesti -->
    <div class="filter-row">
      <!-- sve vijesti -->
      <div class="year-box" :class="{ active: selectedYear === null }" @click="setYear(null)">
        ALL
      </div>

      <!-- samo 2026 godina -->
      <div class="year-box" :class="{ active: selectedYear === 2026 }" @click="setYear(2026)">
        2026
      </div>

      <!-- samo 2025 godina -->
      <div class="year-box" :class="{ active: selectedYear === 2025 }" @click="setYear(2025)">
        2025
      </div>

      <!-- samo 2024 godina -->
      <div class="year-box" :class="{ active: selectedYear === 2024 }" @click="setYear(2024)">
        2024
      </div>
    </div>

    <!-- gumb za dodati novu vijest kojeg mođe vidjeti samo admin -->
    <div v-if="isAdmin" class="add-new-wrap">
      <router-link to="/newArticle" class="add-new-btn"> + ADD NEW </router-link>
    </div>

    <!-- dio sa svim vijestima -->
    <div class="articles-grid">
      <!-- za svaku vijest u bazi podataka se radi kartica sa njezinim podatcima i klik vodi na nju -->
      <router-link
        v-for="article in visibleArticles"
        :key="article.id_article"
        :to="`/article/${article.id_article}`"
        class="article-card"
      >
        <img :src="getImage(article.image_profile)" class="article-img" />

        <!-- datum objavljivanja vijesti -->
        <div class="article-date">
          {{ formatDate(article.published_at) }}
        </div>

        <div class="article-title">
          {{ article.long_title }}
        </div>
      </router-link>
    </div>

    <!-- gumb za učitavanje više vijesti -->
    <div class="load-more-wrap" v-if="canLoadMore">
      <button class="load-more" @click="loadMore">LOAD MORE</button>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

// url backend apija koji se dohvaća iz .env datoteke
const api_url = import.meta.env.VITE_API_URL

const articles = ref([]) //sprema sve članke koji su dostupni
const selectedYear = ref(null) // sprema odabranu godinu za filter, ako je null onda se prikazuju svi
const visibleCount = ref(9) // broj vijesti koji se prikazuje na stranici

// funkcija koja dohvaća sve vijesti iz tablice baze podataka
const loadArticles = async () => {
  const res = await axios.get(`${api_url}/articles`)

  // vijesti se sortiraju od najnovije, datumi se pretvaraju u Date objekt koji se onda uspoređuju
  articles.value = res.data.sort((a, b) => new Date(b.published_at) - new Date(a.published_at))
}

// funkcija koja prima putanju slike i vraća sliku koja se nalazi na toj likaciji
const getImage = (path) => {
  if (!path) return ''
  return `${api_url}/${encodeURI(path)}`
}

// datum iz baze podatak se pretvara u hrvatski formati datuma
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('hr-HR')
}

// computed vrijednsot vraća filtrirane članke
const filteredArticles = computed(() => {
  if (!selectedYear.value) return articles.value

  return articles.value.filter((a) => new Date(a.published_at).getFullYear() === selectedYear.value)
})

// computed vrijednost koja određujue koje vijesti su prikazane 
const visibleArticles = computed(() => {
  return filteredArticles.value.slice(0, visibleCount.value)
})

// computed vrijednsot provjerava ako ima još vijesti za prikazati, ako nema onda se ne prikazuje gumb LOAD MORE
const canLoadMore = computed(() => {
  return visibleCount.value < filteredArticles.value.length
})

// funkcija povećava broj vidljivih članaka za 3
const loadMore = () => {
  visibleCount.value += 3
}

// postavlja odabranu godinu filtera i vraća broj vijesti koje se mogu vidjeti na 9 
const setYear = (year) => {
  selectedYear.value = year
  visibleCount.value = 9
}

const isAdmin = ref(false) //označava je li admin prijavljen

// ako postoji korisnik sa rolom admin, prikazuje gumb za dodavanje novog članka
const checkAdmin = () => {
  const user = JSON.parse(localStorage.getItem('user'))
  if (user && user.role === 'admin') {
    isAdmin.value = true
  }
}

// nakon učitavanja stranice dohvaća vijesti i provjerava se admin
onMounted(() => {
  loadArticles()
  checkAdmin()
})
</script>

<style scoped>
.articles-page {
  padding: 80px 70px;
}

/* dio sa naslovom i tekstom podijeljen u dva dijela */
.artices-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 80px;
  padding-top: 120px;
}

.header-left h1 {
  margin: 0;
  color: black;
}

.header-left h2 {
  margin-top: 5px;
}

.header-right {
  max-width: 600px;
  text-align: justify;
}

/* crta koja razvaja sekcije, negativni margin se koristi kako bi izašao iz paddinga stranice i bio od ruba do ruba */
.divider {
  height: 30px;
  background: var(--q-primary);
  margin: 60px 0 60px 0;
  margin-left: calc(-50vw + 50%);
  margin-right: calc(-50vw + 50%);
}

/* filteri sa godinama */
.filter-row {
  display: flex;
  gap: 10px;
  margin-bottom: 40px;
}

/* izgled zabenog filtera za godinu */
.year-box {
  padding: 8px 14px;
  border: 1px solid var(--q-primary);
  cursor: pointer;
  transition: 0.2s;
  font-size: 14px;
}

.year-box:hover {
  background: rgba(0, 0, 0, 0.05);
}

.year-box.active {
  background: var(--q-primary);
  color: white;
}

/* gumb za dodvanaje nove vijesti poravnanje */
.add-new-wrap {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 25px;
}

/* gumb za dodavanje nove vijesti */
.add-new-btn {
  background: var(--q-primary);
  color: white;
  padding: 10px 18px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: 0.2s;
  border: none;
}

.add-new-btn:hover {
  opacity: 0.85;
}

/* grid sa 3 kartice vijesti */
.articles-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
}

/* kartica za svaku zabenu vijesti */
.article-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-decoration: none;
  color: black;
  cursor: pointer;
  transition: transform 0.25s ease;
}

/* hover efekt podiže karticu */
.article-card:hover {
  transform: translateY(-5px);
}

/* naslov kartice posatje primary boja */
.article-card:hover .article-title {
  color: var(--q-primary);
}

/* datum na kartici */
.article-date {
  font-size: 13px;
  color: #777;
  font-family: 'IBM Plex Sans', sans-serif; /* 🔥 isti font kao ostatak */
  font-weight: 400;
}

/* naslov vijesti na kartici */
.article-title {
  font-size: 18px;
  font-weight: 500;
  font-family: 'IBM Plex Sans', sans-serif; /* 🔥 ujednačeno */
  line-height: 1.4;
}

/* skika članka */
.article-img {
  width: 400px;
  height: 400px;
  object-fit: cover;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.1);
}

/* centriranje gumba load more ispod kartica */
.load-more-wrap {
  display: flex;
  justify-content: center;
  margin-top: 60px;
}

/* gumb za prikaz još vijesti */
.load-more {
  padding: 12px 30px;
  background: var(--q-primary);
  color: white;
  font-weight: 500;
  border: none;
  cursor: pointer;
}

.load-more:hover {
  opacity: 0.85;
}
</style>
