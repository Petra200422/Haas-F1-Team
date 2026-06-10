<template>
  <q-page v-if="article">
    <div class="hero-section">
     <!-- slika na vrhu stranice --> 
      <img :src="getImage(article.image_header)" class="hero-image" />

      <div class="hero-overlay"></div> <!-- tamni prijelaz preko slike --> 

      <!-- kratki naslov i podnaslov na slici --> 
      <div class="hero-text">
        <h1>{{ article.short_title }}</h1>
        <h2>LATEST NEWS</h2>
      </div>
    </div>

    <!-- sadržaj vijesti -->
    <div class="article-content">
      <h4>FIND OUT MORE</h4> <!-- podnaslov vijesti --> 

      <!-- dugačak naslov vijesti --> 
      <h3>
        {{ article.long_title }}
      </h3>

      <!-- datum objavljivanja u europskom formatu --> 
      <div class="article-date">
        {{ new Date(article.published_at).toLocaleDateString('en-GB') }}
      </div>

      <!-- tekst vijesti --> 
      <div class="article-text">
        <p>{{ article.text }}</p>
      </div>

       <!-- ako je admin prikazuju se ove opcije -->  
      <div v-if="isAdmin" class="admin-actions">
        <!-- gumb za uređivanje vijesti koji vodi na stranicu sa formom za uređivanje --> 
        <router-link :to="`/editArticle/${article.id_article}`" class="admin-btn">
          EDIT ARTICLE
        </router-link>

        <!-- gumb za brisanje vijsti --> 
        <button @click="deleteArticle" class="admin-btn">DELETE ARTICLE</button>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute() //dohvaćanje ruta
const router = useRouter() //preusmjeravanje korisnika

const article = ref(null) // sprema podatke dohvaćene vijesti

const api_url = import.meta.env.VITE_API_URL //url backend apija iz .env datoteke

// funkcija koja prima putanju slike iz baze i ako postoji vraća popunjeni url do slike
const getImage = (path) => {
  if (!path) return ''
  return `${api_url}/${encodeURI(path)}`
}

// funkcija dohvaća članak prema ID iz url-a, ID dolazi iz rute.params.id
const loadArticle = async () => {
  try {
    const res = await axios.get(`${api_url}/articles/${route.params.id}`)

    article.value = res.data
  } catch (err) {
    console.error(err)
  }
}

// označava je li admin trenutno prijavljen
const isAdmin = ref(false)

// provjerava ako postoji u local storage korisnik sa rolom admin i ako da prikazuju se gumbi za uređivanje i brisanje
const checkAdmin = () => {
  const user = JSON.parse(localStorage.getItem('user'))

  if (user && user.role === 'admin') {
    isAdmin.value = true
  }
}

// funkcija briše članak iz baze podataka, prije brisanja pokazuje potvrdu
const deleteArticle = async () => {
  if (!confirm('Delete this article?')) return

  try {
    await axios.delete(`${api_url}/articles/${route.params.id}`)

    // nakon brisanja se vraća na popis vijesti
    router.push('/articles')
  } catch (err) {
    console.error(err)
  }
}

// nakon učitavanja stranice dohvaća se vijesti i provjerava se je li admin prijavljen
onMounted(() => {
  loadArticle()
  checkAdmin()
})
</script>

<style scoped>
/* prikaz naslovne slike na vrhu */
.hero-section {
  position: relative;
  width: 100%;
  margin-top: -90px;
}

/* naslovna slika */
.hero-image {
  width: 100%;
  display: block;
}

/* gradien na naslovnoj slici */
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

/* tekst na slici */
.hero-text {
  position: absolute;
  left: 60px;
  bottom: 60px;
  z-index: 2;
  text-transform: uppercase;
}

/* dio sa tekstom */
.article-content {
  max-width: 900px;
  margin: 120px auto;
  padding: 0 30px;
}

/* manji naslov iznad glavnog naslova vijesti */
.article-content h4 {
  margin-bottom: 10px;
}

/* naslov vijesti */
.article-content h3 {
  margin-bottom: 15px;
  color: black;
}

/* datum objave vijesti */
.article-date {
  font-size: 14px;
  color: #777;
  margin-bottom: 50px;
}

/* sadržaj vijesti */
.article-text {
  text-align: justify;
  line-height: 1.8;
  white-space: pre-line;
}

/* dio za admin gumbe */
.admin-actions {
  display: flex;
  gap: 15px;
  margin-top: 50px;
  margin-bottom: 50px;
}

/* stil za oba gumba */
.admin-btn {
  padding: 12px 22px;
  border: none;
  text-decoration: none;
  cursor: pointer;
  color: white;
  background: var(--q-primary);
  font-size: 14px;
  font-weight: 500;
  transition: 0.2s;
}

.admin-btn:hover {
  opacity: 0.85;
}
</style>
