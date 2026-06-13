<template>
  <q-page v-if="partner">

    <!-- dio sa slikom partnera -->
    <div class="hero-section">
      <img
        :src="getImage(partner.image_header)"
        class="hero-image"
      />
    </div>

    <!-- sadržaj strancie -->
    <div class="partner-section">

      <!-- gornji red sa naslovom i karticom -->
      <div class="partner-top">

        <!-- naslkov partnera -->
        <div class="partner-title">
          <h1>{{ partner.name }}</h1>
          <h2>OFFICIAL PARTNER</h2>
        </div>

        <!-- kartica sa društvenim mrežama -->
        <div class="partner-info">
          <div class="info-title">
            CONNECT WITH {{ partner.name }}
          </div>

          <!-- web stranica se prikazuje ako postoji u bazi --> 
          <a
            v-if="partner.website"
            :href="partner.website"
            target="_blank"
            class="info-row">
            <i class="fas fa-globe"></i> Website
          </a>

          <!-- instagram se prikazuje ako postoji u bazi --> 
          <a
            v-if="partner.instagram"
            :href="formatSocial('instagram', partner.instagram)"
            target="_blank"
            class="info-row">
            <i class="fab fa-instagram"></i> Instagram
          </a>

          <!-- twitter se prikazuje ako postoji u bazi --> 
          <a
            v-if="partner.twitter"
            :href="formatSocial('twitter', partner.twitter)"
            target="_blank"
            class="info-row">
            <i class="fab fa-x-twitter"></i> Twitter
          </a>

          <!-- facebook se prikazuje ako postoji u bazi --> 
          <a
            v-if="partner.facebook"
            :href="formatSocial('facebook', partner.facebook)"
            target="_blank"
            class="info-row">
            <i class="fab fa-facebook"></i> Facebook
          </a>
        </div>
      </div>

      <!-- tekst partnera -->
      <div class="partner-description">
        <p v-for="(p, index) in descriptionParagraphs" :key="index">
          {{ p }}
        </p>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute() // dohvaćanje id partnera iz url
const partner = ref(null) // sprema podatke o partneru

const api_url = import.meta.env.VITE_API_URL //url backend apija u .env datoteci

// funkcija prima putanju slike iz baze i varća potpuni je u url 
const getImage = (path) => {
  if (!path) return ''
  return `${api_url}/${encodeURI(path)}`
}

/* dijeli opis u više odlomaka */
const descriptionParagraphs = computed(() => {
  if (!partner.value?.description) return []

  return partner.value.description
    .split('\n')   // svaki novi red je novi paragraf
    .filter(p => p.trim() !== '')
})

// funkcija formatira linkove društvenih mreža
const formatSocial = (type, value) => {
  if (!value) return ''
  if (value.startsWith('http')) return value

  if (type === 'instagram') return `https://instagram.com/${value}`
  if (type === 'twitter') return `https://twitter.com/${value}`
  if (type === 'facebook') return `https://facebook.com/${value}`

  return value
}

// funlcija dohvaća podatke o partneru prema id iz url
const loadPartner = async () => {
  try {
    const res = await axios.get(
      `${api_url}/partners/${route.params.id}`
    )
    partner.value = res.data
  } catch (err) {
    console.error(err)
  }
}

// prikazuju se podatci o partneru
onMounted(loadPartner)
</script>

<style scoped>
.hero-section {
  width: 100%;
  margin-top: 70px;
}

.hero-image {
  width: 100%;
  display: block;
}

/* sadržaj stranice */
.partner-section {
  padding: 60px 70px 120px 70px;
}

/* gornji red sa naslovom i karticom */
.partner-top {
  display: grid;
  grid-template-columns: 1fr 280px;
  align-items: start;
  column-gap: 60px;
}

/* naslov */
.partner-title h1 {
  margin: 0;
  color:black;
  text-transform: uppercase;
}

.partner-title h2 {
  margin-top: 10px;
}

/* kartica */
.partner-info {
  width: 280px;
  background: var(--q-accent);
  padding: 30px;
  box-shadow: 0 4px 25px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* naslov u karticis */
.info-title {
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 10px;
}

/* red u kartici */
.info-row {
  text-decoration: none;
  color: black;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  margin: 0;
  line-height: 1.2;
}

/* ikona za društvenu mrežu */
.info-row i {
  font-size: 18px;
}

.info-row:hover {
  color: var(--q-primary);
}

/* dio sa tekstom */
.partner-description {
  max-width: 750px;
  text-align: justify;
  line-height: 1.6;
  margin-top: -40px;
}

.partner-description p {
  margin-bottom: 20px;
}

</style>