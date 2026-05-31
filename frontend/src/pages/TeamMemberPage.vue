<template>

  <q-page v-if="member">
    <div class="hero-section">

      <img
        :src="getImage(member.image_header)"
        class="hero-image"
      />

      <div class="hero-overlay"></div>
      <div class="hero-text">
        <h1>
          {{ member.name }} {{ member.surname }}
        </h1>

        <h2>
          OFFICIAL TEAM MEMBER
        </h2>
      </div>

    </div>
    <div class="member-content">
      <div class="member-description">

  <p
    v-for="(paragraph, index) in firstParagraphs"
    :key="'first-' + index"
  >
    {{ paragraph }}
  </p>

  <template v-if="showFullText">

    <p
      v-for="(paragraph, index) in remainingParagraphs"
      :key="'rest-' + index"
    >
      {{ paragraph }}
    </p>

  </template>

  <q-btn
    v-if="remainingParagraphs.length && !showFullText"
    flat
    style="color:var(--q-primary);"
    label="Read full bio"
    class="load-more-btn"
    @click="showFullText = true"
  />

</div>

      <!-- RIGHT -->
      <div class="member-info">

          <div class="info-row">
          <span>Date of Birth</span>
          <strong>{{ formatDate(member.birth_date) }}</strong>
        </div>

        <div class="info-row">
          <span>Nationality</span>
          <strong>{{ member.nationality }}</strong>
        </div>

       <div v-if="member.role === 'driver' || member.role === 'reserve_driver'" class="info-row" >
  <span>Driver Number</span>
  <strong>#{{ member.driver_number }}</strong>
</div>

      </div>

    </div>

    <!-- RACING HISTORY -->
<div class="racing-section" v-if="racingHistory.length">

  <h3 class="racing-title">EVERY YEAR IN RACING</h3>

  <!-- ARROWS -->
  <div class="racing-arrows">

    <div class="arrow-box" @click="prev">
      <i class="fas fa-chevron-left"></i>
    </div>

    <div class="arrow-box" @click="next">
      <i class="fas fa-chevron-right"></i>
    </div>

  </div>

  <!-- CARDS -->
  <div class="racing-wrapper">

    <div class="racing-track" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">

      <div class="racing-group" v-for="(group, gIndex) in groupedHistory" :key="gIndex">

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


<!-- GALLERY -->
<div class="gallery-section" v-if="teamGallery.length">

  <h4 class="gallery-subtitle">THROUGH THE YEARS</h4>
  <h3 class="gallery-title">ON THE GRID</h3>

  <!-- ARROWS (iste kao gore) -->
  <div class="gallery-arrows">

    <div class="arrow-box" @click="prevGallery">
      <i class="fas fa-chevron-left"></i>
    </div>

    <div class="arrow-box" @click="nextGallery">
      <i class="fas fa-chevron-right"></i>
    </div>

  </div>

  <!-- SLIDER -->
  <div class="gallery-wrapper">

    <div class="gallery-track"
         :style="{ transform: `translateX(-${galleryIndex * 100}%)` }">

      <div class="gallery-group"
           v-for="(group, gIndex) in groupedGallery"
           :key="gIndex">

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

const route = useRoute()

const member = ref(null)
const showFullText = ref(false)

const racingHistory = ref([])
const currentIndex = ref(0)

const api_url = import.meta.env.VITE_API_URL

const getImage = (path) => {
  if (!path) return ''
  return `${api_url}/${encodeURI(path)}`
}

const loadMember = async () => {
  const res = await axios.get(
    `${api_url}/haas-team/${route.params.id}`
  )

  member.value = res.data
}

const paragraphs = computed(() => {
  if (!member.value?.description) return []

  return member.value.description
    .split('\n')
    .filter(p => p.trim() !== '')
})

/* PRIKAŽI PRVA 3 ODLOMKA */
const firstParagraphs = computed(() => {
  return paragraphs.value.slice(0, 2)
})

/* OSTATAK TEKSTA */
const remainingParagraphs = computed(() => {
  return paragraphs.value.slice(2)
})

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('hr-HR')
}

onMounted(loadMember)

/* dio za kartice sa povijesti */
const loadRacingHistory = async () => {
  const res = await axios.get(`${api_url}/career-history/${route.params.id}`)
  racingHistory.value = res.data
}

/* 3 kartice po slide-u */
const groupedHistory = computed(() => {
  const groups = []
  for (let i = 0; i < racingHistory.value.length; i += 3) {
    groups.push(racingHistory.value.slice(i, i + 3))
  }
  return groups
})

const next = () => {
  if (currentIndex.value < groupedHistory.value.length - 1) {
    currentIndex.value++
  }
}

const prev = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}

onMounted(() => {
  loadMember()
  loadRacingHistory()
})


const teamGallery = ref([])
const galleryIndex = ref(0)

/* LOAD GALLERY */
const loadTeamGallery = async () => {
  const res = await axios.get(`${api_url}/team-gallery/${route.params.id}`)
  teamGallery.value = res.data
}

/* grupiranje po 3 slike */
const groupedGallery = computed(() => {
  const groups = []
  for (let i = 0; i < teamGallery.value.length; i += 2) {
    groups.push(teamGallery.value.slice(i, i + 2))
  }
  return groups
})

const nextGallery = () => {
  if (galleryIndex.value < groupedGallery.value.length - 1) {
    galleryIndex.value++
  }
}

const prevGallery = () => {
  if (galleryIndex.value > 0) {
    galleryIndex.value--
  }
}

/* dodaj u onMounted */
onMounted(() => {
  loadTeamGallery()
})
</script>


<style>

.hero-section {
  position: relative;
  width: 100%;
  margin-top: -90px;
}

.hero-image {
  width: 100%;
  display: block;
}

.hero-overlay {
  position: absolute;
  inset: 0;

  background: linear-gradient(
    to top,
    rgba(0,0,0,0.85) 0%,
    rgba(0,0,0,0.55) 35%,
    rgba(0,0,0,0) 65%
  );
}

.hero-text {
  position: absolute;
  z-index: 2;
  left: 60px;
  bottom: 60px;
}

.hero-text h1 {
  margin-bottom: 0;
  line-height: 1;
}

.hero-text h2 {
  margin-top: 10px;
  line-height: 1;
}

.member-content {
  display: flex;
  gap: 180px; /* razmak između teksta i kartice */
  padding: 150px 70px 70px 70px;
}

.member-description {
  flex: 1;
}

.member-description p {
  margin-bottom: 25px;
  text-align: justify;
}


.member-info {
  width: 320px; /* fiksna uža širina */
  flex-shrink: 0;
  background: var(--q-accent);
  padding: 35px;
   padding-bottom: 20px;
  height: fit-content;
  margin-left: auto; /* gura karticu skroz desno */
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.10);
}

.info-row:last-child {
  margin-bottom: 0;
}

.info-row {
  margin-bottom: 25px;
}

.info-row span {
  display: block;
  font-weight: 700; /* naslov podebljan */
  color: #000000;
  margin-bottom: 8px;
}

.info-row strong {
  display: block;
  font-weight: 400; /* podatak normalan */
  color: #000000;
  line-height: 1.5;
}

.load-more-btn {
  padding-left: 0;
}

.racing-section {
  padding: 80px 70px;
  position: relative;
}

/* NASLOV */
.racing-title {
  margin-bottom: 10px;
}

/* PROSTOR IZMEĐU NASLOVA I KARTICA (OVDJE SU STRELICE) */
.racing-arrows {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-bottom: 30px; /* KLJUČNO: razmak do kartica */
}

/* STRELICA - pravokutna */
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

/* hover efekt */
.arrow-box:hover {
  background: transparent;
  border: 1px solid var(--q-primary);
}

.arrow-box i {
  color: white;
  transition: 0.25s ease;
}

/* hover -> strelica postaje primary */
.arrow-box:hover i {
  color: var(--q-primary);
}

/* WRAPPER */
.racing-wrapper {
  overflow: hidden;
}

/* TRACK */
.racing-track {
  display: flex;
  transition: transform 0.5s ease;
}

/* GRUPE */
.racing-group {
  display: flex;
  gap: 50px;
  min-width: 100%;
}

/* KARTICA */
.racing-card {
  width: calc((100% - 100px) / 3);
  flex-shrink: 0;
  background: var(--q-accent);
  box-shadow: 0 4px 25px rgba(0,0,0,0.10);

}

/* UNUTRAŠNJOST */
.racing-card-inner {
  display: flex;
  flex-direction: column;
}

/* YEAR BAR - LIJEVO, KRATKO */
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

/* TEKST ISPOD */
.race-text {
  font-size: 16px;  
  line-height: 1.5;
  text-align: left;
  padding: 20px 20px 20px 20px;
}


.gallery-section {
  padding: 80px 70px 250px 70px;

}

.gallery-subtitle {
  margin: 0;
  line-height: 1;
}

.gallery-title {
  margin-top: 10px;
  margin-bottom: 10px;
  line-height: 1;
}

/* ARROWS */
.gallery-arrows {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin: 20px 0 40px 0;
}

/* SLIDER */
.gallery-wrapper {
  overflow: hidden;
}

.gallery-track {
  display: flex;
  transition: transform 0.5s ease;
}

.gallery-group {
  display: flex;
  gap: 40px;
  min-width: 100%;
}

/* 2 slike po redu */
.gallery-item {
  width: calc((100% - 40px) / 2);
}

.gallery-item img {
  width: 100%;
  height: auto;
  object-fit: contain;
  display: block;
  box-shadow: 0 4px 25px rgba(0,0,0,0.10);
}
</style>