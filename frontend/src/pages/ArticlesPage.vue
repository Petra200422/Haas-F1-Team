<template>
  <q-page class="articles-page">

    <!-- HEADER (ISTO KAO PARTNERS) -->
    <div class="partners-header">

      <div class="header-left">
        <h1>ALL THE LATEST</h1>
        <h2>BREAKING NEWS</h2>
      </div>

      <div class="header-right">
        <p>The Haas F1 Team competes at the highest level of motorsport, constantly pushing for stronger performances and better results.
        Stay up to date with the latest news, race updates, and team insights as Haas takes on the challenges of Formula 1 and fights for every point on the grid.
      </p>
      </div>

    </div>

    <!-- DIVIDER -->
    <div class="divider"></div>

    <!-- FILTER -->
    <div class="filter-row">

      <div
        class="year-box"
        :class="{ active: selectedYear === null }"
        @click="setYear(null)"
      >
        ALL
      </div>

      <div
        class="year-box"
        :class="{ active: selectedYear === 2026 }"
        @click="setYear(2026)"
      >
        2026
      </div>

      <div
        class="year-box"
        :class="{ active: selectedYear === 2025 }"
        @click="setYear(2025)"
      >
        2025
      </div>

      <div
        class="year-box"
        :class="{ active: selectedYear === 2024 }"
        @click="setYear(2024)"
      >
        2024
      </div>

    </div>

    <!-- ADD NEW BUTTON (ADMIN ONLY) -->
<div v-if="isAdmin" class="add-new-wrap">

  <router-link
    to="/newArticle"
    class="add-new-btn"
  >
    + ADD NEW
  </router-link>

</div>

   <!-- ARTICLES -->
<div class="articles-grid">

  <router-link
    v-for="article in visibleArticles"
    :key="article.id_article"
    :to="`/article/${article.id_article}`"
    class="article-card"
  >

    <img
      :src="getImage(article.image_profile)"
      class="article-img"
    />

    <div class="article-date">
      {{ formatDate(article.published_at) }}
    </div>

    <div class="article-title">
      {{ article.long_title }}
    </div>

  </router-link>

</div>

    <!-- LOAD MORE -->
    <div class="load-more-wrap" v-if="canLoadMore">
      <button class="load-more" @click="loadMore">
        LOAD MORE
      </button>
    </div>

  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'


const api_url = import.meta.env.VITE_API_URL

const articles = ref([])
const selectedYear = ref(null)
const visibleCount = ref(9)

const loadArticles = async () => {
  const res = await axios.get(`${api_url}/articles`)

  // SORTIRANJE OD NAJNOVIJEG
  articles.value = res.data.sort(
    (a, b) => new Date(b.published_at) - new Date(a.published_at)
  )
}

const getImage = (path) => {
  if (!path) return ''
  return `${api_url}/${encodeURI(path)}`
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('hr-HR')
}

/* FILTER */
const filteredArticles = computed(() => {
  if (!selectedYear.value) return articles.value

  return articles.value.filter(a =>
    new Date(a.published_at).getFullYear() === selectedYear.value
  )
})

/* VISIBLE */
const visibleArticles = computed(() => {
  return filteredArticles.value.slice(0, visibleCount.value)
})

const canLoadMore = computed(() => {
  return visibleCount.value < filteredArticles.value.length
})

const loadMore = () => {
  visibleCount.value += 3
}

const setYear = (year) => {
  selectedYear.value = year
  visibleCount.value = 9
}

const isAdmin = ref(false)

const checkAdmin = () => {
  const user = JSON.parse(localStorage.getItem('user'))
  if (user && user.role === 'admin') {
    isAdmin.value = true
  }
}

onMounted(() => {
  loadArticles()
  checkAdmin()
})
</script>

<style scoped>

/* HEADER (KAO PARTNERS) */
.articles-page {
  padding: 80px 70px;
}

.partners-header {
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

/* DIVIDER FULL WIDTH */
.divider {
  height: 30px;
  background: var(--q-primary);
  margin: 60px 0 60px 0;
  margin-left: calc(-50vw + 50%);
  margin-right: calc(-50vw + 50%);
}

/* FILTER BOXES */
.filter-row {
  display: flex;
  gap: 10px;
  margin-bottom: 40px;
}

.year-box {
  padding: 8px 14px;
  border: 1px solid var(--q-primary);
  cursor: pointer;
  transition: 0.2s;
  font-size: 14px;
}

.year-box:hover {
  background: rgba(0,0,0,0.05);
}

.year-box.active {
  background: var(--q-primary);
  color: white;
}

.add-new-wrap {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 25px;
}

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

/* GRID 3 KARTICE */
.articles-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
}

.article-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-decoration: none;   /* 🔥 uklanja underline */
  color: black;            /* 🔥 da izgleda kao tekst, ne link */
  cursor: pointer;
  transition: transform 0.25s ease;
}

/* hover efekt da se vidi klik */
.article-card:hover {
  transform: translateY(-5px);
}

.article-card:hover .article-title {
  color: var(--q-primary);
}

/* DATE */
.article-date {
  font-size: 13px;
  color: #777;
  font-family: "IBM Plex Sans", sans-serif; /* 🔥 isti font kao ostatak */
  font-weight: 400;
}

/* TITLE */
.article-title {
  font-size: 18px;
  font-weight: 500;
  font-family: "IBM Plex Sans", sans-serif; /* 🔥 ujednačeno */
  line-height: 1.4;
}

/* ORIGINAL IMAGE SIZE (NO CROPPING) */
.article-img {
  width: 100%;
  height: auto;
  object-fit: contain;
  box-shadow: 0 4px 25px rgba(0,0,0,0.1);
}

/* LOAD MORE */
.load-more-wrap {
  display: flex;
  justify-content: center;
  margin-top: 60px;
}

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