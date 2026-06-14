<template>
  <q-page v-if="member">
    <div class="hero-section">
      <img :src="getImage(member.image_header)" class="hero-image" /> <!-- slika tog člana -->

      <div class="hero-overlay"></div> <!-- tamni prijelaz preko slike -->

      <!-- ime i prezime člana -->
      <div class="hero-text">
        <h1>{{ member.name.toUpperCase() }} {{ member.surname.toUpperCase() }}</h1>

        <h2>OFFICIAL TEAM MEMBER</h2>
      </div>
    </div>
    <!-- skekcija sa tekstom o članu tima, 2 odlomka -->
    <div class="member-content">
      <div class="member-description">
        <p v-for="(paragraph, index) in firstParagraphs" :key="'first-' + index">
          {{ paragraph }}
        </p>

        <!-- dio gdje se prikazuje ostatak teksta kada se stisne gumb -->
        <template v-if="showFullText">
          <p v-for="(paragraph, index) in remainingParagraphs" :key="'rest-' + index">
            {{ paragraph }}
          </p>
        </template>

        <!-- gumb za prikaz ostatka teksta, prikazuje se samo ako ima još teksta koji nije priazan -->
        <q-btn
          v-if="remainingParagraphs.length && !showFullText"
          flat
          style="color: var(--q-primary)"
          label="Read full bio"
          class="load-more-btn"
          @click="showFullText = true"
        />
      </div>

      <!-- kartica sa informacijama koja se nalazi desno -->
      <div class="member-info">
        <div class="info-row">
          <span>Date of Birth</span>
          <strong>{{ formatDate(member.birth_date) }}</strong>
        </div>

        <div class="info-row">
          <span>Nationality</span>
          <strong>{{ member.nationality }}</strong>
        </div>

        <!-- ako je driver ili reserve driver mu se prikazuje broj -->
        <div v-if="member.role === 'driver' || member.role === 'reserve_driver'" class="info-row">
          <span>Driver Number</span>
          <strong>#{{ member.driver_number }}</strong>
        </div>
      </div>
    </div>

    <!-- dio sa karticama koje prikazuju povijesti u sportu -->
    <div class="racing-section" v-if="racingHistory.length">
      <h3 class="racing-title">EVERY YEAR IN RACING</h3>

      <!-- strelice za pomicanje -->
      <div class="racing-arrows">
        <div class="arrow-box" @click="prev">
          <i class="fas fa-chevron-left"></i>
        </div>

        <div class="arrow-box" @click="next">
          <i class="fas fa-chevron-right"></i>
        </div>
      </div>

      <!-- kartica sa povijesti u sportu -->
      <div class="racing-wrapper">
        <div class="racing-track" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
          <div class="racing-group" v-for="(group, gIndex) in groupedHistory" :key="gIndex"> <!-- svaka grupa ima 3 kartice -->
            <div class="racing-card" v-for="item in group" :key="item.id">
              <div class="racing-card-inner">
                <div class="year-bar">
                  <span>{{ item.year }}</span>
                </div>

                <p class="race-text">
                  {{ item.description }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- galerija sa slikama člana -->
    <div class="gallery-section" v-if="teamGallery.length">
      <h4 class="gallery-subtitle">THROUGH THE YEARS</h4>
      <h3 class="gallery-title">ON THE GRID</h3>

      <!-- strelice za pomicanje -->
      <div class="gallery-arrows">
        <div class="arrow-box" @click="prevGallery">
          <i class="fas fa-chevron-left"></i>
        </div>

        <div class="arrow-box" @click="nextGallery">
          <i class="fas fa-chevron-right"></i>
        </div>
      </div>

      <!-- slider galerije -->
      <div class="gallery-wrapper">
        <div class="gallery-track" :style="{ transform: `translateX(-${galleryIndex * 100}%)` }">
          <div class="gallery-group" v-for="(group, gIndex) in groupedGallery" :key="gIndex"> <!-- svaka grupa ima 2 slike -->
            <div class="gallery-item" v-for="img in group" :key="img.id">
              <img :src="getImage(img.image)" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute() // dohvaća id člana iz urla

const member = ref(null) // sprema podatke trenutnog člana
const showFullText = ref(false) // određuje prikazuje li se cijeli tekst ili samo dio

const racingHistory = ref([]) //sprema povijest člana
const currentIndex = ref(0) // trenutni indeks za slider u povijesti vozača

const api_url = import.meta.env.VITE_API_URL // url backend apija u .env datoteci

// funkcija prima putanju slike iz baze i pretvara je u potpuni url do slike
const getImage = (path) => {
  if (!path) return ''
  return `${api_url}/${encodeURI(path)}`
}

// funkcija dohvaća podatke o članu tima čiji je id u url
const loadMember = async () => {
  const res = await axios.get(`${api_url}/haas-team/${route.params.id}`)
  member.value = res.data
}

// computed vrijednost dijeli opis u odlomke
const paragraphs = computed(() => {
  if (!member.value?.description) return []
  return member.value.description.split('\n').filter((p) => p.trim() !== '') //ako je razdvojen novim redom ond aje to novi odlomak
})

// prikazuje prva 2 odlomka teksta
const firstParagraphs = computed(() => {
  return paragraphs.value.slice(0, 2)
})

// sprema ostale odlomke koji se prikazuju kada se stisne gumb
const remainingParagraphs = computed(() => {
  return paragraphs.value.slice(2)
})

// funkcija formatira doatum u hrvatski format
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('hr-HR')
}


// funkcija dohvaća povijest člana tima
const loadRacingHistory = async () => {
  const res = await axios.get(`${api_url}/career-history/${route.params.id}`)
  racingHistory.value = res.data
}

// computed vrijednost grupira povijest u grupe po 3 kartice
const groupedHistory = computed(() => {
  const groups = []
  for (let i = 0; i < racingHistory.value.length; i += 3) {
    groups.push(racingHistory.value.slice(i, i + 3))
  }
  return groups
})

// pomicanje slidera povijesti naprijed
const next = () => {
  if (currentIndex.value < groupedHistory.value.length - 1) {
    currentIndex.value++
  }
}

// pomicanje slidera povijest nazad
const prev = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}

const teamGallery = ref([]) // sprema slike galerije
const galleryIndex = ref(0) // trenutni indeks slidera galerije

// funkcija dohvaća slike za galeriju
const loadTeamGallery = async () => {
  const res = await axios.get(`${api_url}/team-gallery/${route.params.id}`)
  teamGallery.value = res.data
}

// compud+ted vrijednost grupira galeriju po dvije slike
const groupedGallery = computed(() => {
  const groups = []
  for (let i = 0; i < teamGallery.value.length; i += 2) {
    groups.push(teamGallery.value.slice(i, i + 2))
  }
  return groups
})

// pomicanje galerije naprijed
const nextGallery = () => {
  if (galleryIndex.value < groupedGallery.value.length - 1) {
    galleryIndex.value++
  }
}

// pomicanje galerije nazad
const prevGallery = () => {
  if (galleryIndex.value > 0) {
    galleryIndex.value--
  }
}

// nakon učitavanja dohvaćaju se podatci člana tima, povijest i galerija
onMounted(() => {
  loadMember()
  loadRacingHistory()
  loadTeamGallery()
})
</script>

<style scoped>
.hero-section {
  position: relative;
  width: 100%;
  margin-top: -90px;
}

.hero-image {
  width: 100%;
  display: block;
}

/* tamno na slici */
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

/* tekst preko slike */
.hero-text {
  position: absolute;
  z-index: 2;
  left: 60px;
  bottom: 60px;
}

/* dio sa tekstom i karticom */
.member-content {
  display: flex;
  gap: 400px; /* razmak između teksta i kartice */
  padding: 150px 70px 70px 70px;
}

.member-description {
  flex: 1;
}

/* odlomak teksta */
.member-description p {
  margin-bottom: 25px;
  text-align: justify;
}

/* kartica sa informacijama */
.member-info {
  width: 320px; 
  flex-shrink: 0;
  background: var(--q-accent);
  padding: 35px;
  padding-bottom: 20px;
  height: fit-content;
  margin-left: auto; /* gura karticu skroz desno */
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.1);
}

/* miče doni razmak na zadnjem redu u kartici */
.info-row:last-child {
  margin-bottom: 0;
}

.info-row {
  margin-bottom: 25px;
}

/* naziv podataka */
.info-row span {
  display: block;
  font-weight: 700; 
  color: #000000;
  margin-bottom: 8px;
}

/* vrijednost podatka ispod naziva */
.info-row strong {
  display: block;
  font-weight: 400; 
  color: #000000;
  line-height: 1.5;
}

/* gumb za prikaz vise teksta */
.load-more-btn {
  padding-left: 0;
}

/* dio sa povijesti */
.racing-section {
  padding: 80px 70px;
  position: relative;
}

/* dio za strelice */
.racing-arrows {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-bottom: 30px; 
}

/* strelice */
.arrow-box {
  width: 55px;
  height: 32px;
  background: var(--q-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 0.25s ease;
  border: 1px solid var(--q-primary);
}

.arrow-box:hover {
  background: transparent;
  border: 1px solid var(--q-primary);
}

/* ikona strelice */
.arrow-box i {
  color: white;
  transition: 0.25s ease;
}

.arrow-box:hover i {
  color: var(--q-primary);
}

/* skriva kartice koje nisu u prikazu */
.racing-wrapper {
  overflow: hidden;
}

/* sve grupe kartica */
.racing-track {
  display: flex;
  transition: transform 0.5s ease;
}

/* jedna grupa kartica */
.racing-group {
  display: flex;
  gap: 50px;
  min-width: 100%;
}

/* jedna kartica */
.racing-card {
  width: calc((100% - 100px) / 3);
  flex-shrink: 0;
  background: var(--q-accent);
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.1);
}

/* unutarnji dio kartice */
.racing-card-inner {
  display: flex;
  flex-direction: column;
}

/* traka sa godinom */
.year-bar {
  width: 25%;
  height: 34px;
  background: var(--q-primary);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 12px;
  margin-top: 20px;
}

/* godina */
.year-bar span {
  color: white;
  font-weight: 600;
  font-size: 16px; /* manji tekst */
}

/* tekst u kartici */
.race-text {
  font-size: 16px;
  line-height: 1.5;
  text-align: left;
  padding: 20px 20px 20px 20px;
}

.gallery-section {
  padding: 80px 70px;
}

.gallery-title {
  margin-top: 10px;
}

/* strelice */
.gallery-arrows {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin: 20px 0 40px 0;
}

/* vanjski dio, skriva slike koje nisu prikazane */
.gallery-wrapper {
  overflow: hidden;
}

.gallery-track {
  display: flex;
  transition: transform 0.5s ease;
}

/* jedna grupa slikas */
.gallery-group {
  display: flex;
  gap: 40px;
  min-width: 100%;
}

/* 2 slike po redu */
.gallery-item {
  width: calc((100% - 40px) / 2);
}

/* slika */
.gallery-item img {
  width: 100%;
  height: auto;
  object-fit: contain;
  display: block;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.1);
}
</style>
