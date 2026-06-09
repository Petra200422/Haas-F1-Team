<template>
  <q-page v-if="race" class="race-page">
    <!-- HERO -->
    <div class="hero-section">
      <img :src="getImage(race.image_header)" class="hero-image" />

      <div class="hero-overlay"></div>

      <div class="hero-text">
        <h1>{{ race.race_name }}</h1>
        <h2>ROUND {{ race.round }}</h2>
      </div>
    </div>

    <!-- TRACK SECTION -->
    <section class="track-section">
      <div class="track-header">
        <h4>{{ race.race_name }}</h4>
        <h3>{{ race.name || race.circuit_name }}</h3>
      </div>

      <div class="track-content">
        <!-- MAP IMAGE -->
        <div class="track-map-wrap">
          <img
            :src="getImage(showSectors ? race.image_sectors : race.image_track)"
            class="track-map"
          />
        </div>

        <!-- SESSIONS -->
        <div class="sessions-card">
          <div class="timezone-toggle">
            <button
              class="timezone-btn"
              :class="{ active: useMyTimezone }"
              @click="useMyTimezone = !useMyTimezone"
            >
              {{ useMyTimezone ? 'SHOW LOCAL TIME' : 'SHOW MY TIME' }}
            </button>
          </div>
          <table>
            <tbody>
              <tr v-for="session in sessions" :key="session.session_key">
                <td>{{ session.session_name }}</td>
                <td>{{ formatSessionDate(session.date_start) }}</td>
                <td>{{ formatSessionTime(session) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- INFO BAR -->
      <div class="info-bar">
        <div class="sector-toggle">
          <span>SECTORS</span>

          <label>
            <input type="checkbox" v-model="showSectors" />
            {{ showSectors ? 'ON' : 'OFF' }}
          </label>
        </div>

        <div>
          <span>COUNTRY</span>
          <strong>{{ race.country }}</strong>
        </div>

        <div>
          <span>CITY</span>
          <strong>{{ race.city }}</strong>
        </div>

        <div>
          <span>FIRST GP</span>
          <strong>{{ race.first_gp }}</strong>
        </div>

        <div>
          <span>LAPS</span>
          <strong>{{ race.laps }}</strong>
        </div>

        <div>
          <span>TURNS</span>
          <strong>{{ race.turns }}</strong>
        </div>

        <div>
          <span>LENGTH</span>
          <strong>{{ race.length_km }} KM</strong>
        </div>

        <div>
          <span>RACE DISTANCE</span>
          <strong>{{ race.race_distance_km }} KM</strong>
        </div>
      </div>
    </section>

    <!-- DESCRIPTION -->
    <section class="description-section">
      <h4>EXPLORE THE TRACK</h4>
      <h3>EVERY CORNER TELLS A STORY</h3>

      <p>{{ race.description }}</p>
    </section>

    <section class="more-section">
      <h4>BEHIND THE TRACK</h4>
      <h3>GET TO KNOW MORE</h3>

      <div class="more-grid">
        <!-- FUN FACT -->
        <div class="accordion-item" :class="{ open: showFunFact }">
          <div class="accordion-header" @click="showFunFact = !showFunFact">
            <span>FUN FACT</span>
            <span>{{ showFunFact ? '-' : '+' }}</span>
          </div>

          <div v-if="showFunFact" class="accordion-body">
            <p>{{ race.fun_fact }}</p>
          </div>
        </div>

        <!-- TRACK FEATURES -->
        <div class="accordion-item" :class="{ open: showTrackFeatures }">
          <div class="accordion-header" @click="showTrackFeatures = !showTrackFeatures">
            <span>TRACK FEATURES</span>
            <span>{{ showTrackFeatures ? '-' : '+' }}</span>
          </div>

          <div v-if="showTrackFeatures" class="accordion-body">
            <p>{{ race.track_features }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- GALLERY -->

    <div class="gallery-section" v-if="circuitGallery.length">
      <h4 class="gallery-subtitle">THROUGH THE CIRCUIT</h4>

      <h3 class="gallery-title">GALLERY</h3>

      <div class="gallery-arrows">
        <div class="gallery-arrow" @click="prevGallery">
          <i class="fas fa-chevron-left"></i>
        </div>

        <div class="gallery-arrow" @click="nextGallery">
          <i class="fas fa-chevron-right"></i>
        </div>
      </div>

      <div class="gallery-wrapper">
        <div
          class="gallery-track"
          :style="{
            transform: `translateX(-${galleryIndex * 100}%)`,
          }"
        >
          <div class="gallery-group" v-for="(group, gIndex) in groupedGallery" :key="gIndex">
            <div class="gallery-item" v-for="img in group" :key="img.id_image">
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
const api_url = import.meta.env.VITE_API_URL

const race = ref(null)
const sessions = ref([])
const showSectors = ref(false)

const showFunFact = ref(false)
const showTrackFeatures = ref(false)

const circuitGallery = ref([])
const galleryIndex = ref(0)

const getImage = (path) => {
  if (!path) return ''
  return `${api_url}/${encodeURI(path)}`
}

const loadRace = async () => {
  try {
    const res = await axios.get(`${api_url}/race-details/${route.params.id}`)

    race.value = res.data

    await loadSessions()
    await loadCircuitGallery()
  } catch (err) {
    console.error(err)
  }
}

const loadSessions = async () => {
  const res = await axios.get(`${api_url}/race-sessions/${route.params.id}`)
  sessions.value = res.data
}

const formatSessionDate = (date) => {
  if (!date) return ''

  return new Date(date)
    .toLocaleDateString('en-GB', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
    })
    .toUpperCase()
}

const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone

const useMyTimezone = ref(false)

const formatSessionTime = (session) => {
  if (!session?.date_start) return ''

  const date = new Date(session.date_start)

  // MY TIMEZONE
  if (useMyTimezone.value) {
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: userTimezone,
    })
  }

  // LOCAL RACE TIME
  const offset = session.gmt_offset || '00:00:00'

  const sign = offset.startsWith('-') ? -1 : 1

  const cleanOffset = offset.replace('-', '')

  const [hours, minutes] = cleanOffset.split(':').map(Number)

  const offsetMs = sign * ((hours * 60 + minutes) * 60 * 1000)

  const localRaceDate = new Date(date.getTime() + offsetMs)

  return localRaceDate.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
  })
}

const loadCircuitGallery = async () => {
  try {
    const res = await axios.get(`${api_url}/circuit-gallery/${race.value.id_circuit}`)

    circuitGallery.value = res.data
  } catch (err) {
    console.error(err)
  }
}

const groupedGallery = computed(() => {
  const groups = []

  for (let i = 0; i < circuitGallery.value.length; i += 2) {
    groups.push(circuitGallery.value.slice(i, i + 2))
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

onMounted(() => {
  loadRace()
})
</script>

<style scoped>
/* HERO */
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
    rgba(0, 0, 0, 0.85) 0%,
    rgba(0, 0, 0, 0.55) 35%,
    rgba(0, 0, 0, 0) 65%
  );
}

.hero-text {
  position: absolute;
  left: 60px;
  bottom: 60px;
  z-index: 2;
  text-transform: uppercase;
}

/* TRACK AREA */
.track-section {
  margin: 110px 0px;
  padding: 45px 45px 70px;
  background: #eeeeee;
}

.track-header h4 {
  margin-bottom: 10px;
  text-transform: uppercase;
}

.track-header h3 {
  color: black;
  margin-top: 0;
  text-transform: uppercase;
}

.track-content {
  display: grid;
  grid-template-columns: 1fr 430px;
  gap: 60px;
  align-items: center;
  margin-top: 40px;
}

.track-map {
  width: auto;
  display: block;
}

.sessions-card {
  background: white;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.15);
  padding: 20px;
}

.sessions-card table {
  width: 100%;
  border-collapse: collapse;
}

.sessions-card td {
  padding: 13px 8px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  font-size: 14px;
}

.sessions-card td:first-child {
  font-weight: 700;
}

.sessions-card td:nth-child(2),
.sessions-card td:nth-child(3) {
  text-align: right;
  white-space: nowrap;
}

/* INFO BAR */
.info-bar {
  margin: 60px auto 0;
  background: white;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.18);
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  padding: 15px 25px;
  gap: 20px;
}

.info-bar span {
  display: block;
  font-size: 14px;
  font-weight: 700;
  color: #777;
  margin-bottom: 4px;
}

.info-bar strong {
  font-size: 14px;
  color: black;
}

.sector-toggle label {
  font-size: 14px;
}

/* DESCRIPTION */
.description-section {
  max-width: 650px;
  margin: 0 auto 120px;
  text-align: justify;
}

.description-section h4 {
  margin-bottom: 10px;
}

.description-section h3 {
  color: black;
  margin-top: 0;
}

.description-section p {
  line-height: 1.8;
}

.more-section {
  padding: 0 70px 130px;
}

.more-section h4 {
  margin-bottom: 10px;
}

.more-section h3 {
  color: black;
  margin-top: 0;
  margin-bottom: 60px;
}

.more-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 90px;
  align-items: start;
}

.accordion-item {
  width: 100%;
  background: var(--q-primary);
  color: white;
}

/* sjena samo na otvorenoj kartici */
.accordion-item.open {
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.15);
}

.accordion-header {
  height: 70px;
  padding: 0 30px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  cursor: pointer;
  font-weight: 700;

  background: var(--q-primary);
  color: white;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.15);
}

/* kada je otvoreno, sjena se miče s headera i ostaje samo na parentu */
.accordion-item.open .accordion-header {
  box-shadow: none;
}

.accordion-body {
  background: var(--q-primary);
  color: white;

  padding: 30px;
  line-height: 1.8;
  text-align: justify;

  border-top: 1px solid rgba(255, 255, 255, 0.15);
}

.accordion-body p {
  margin: 0;
  color: white;
}

.accordion-header span:last-child {
  font-size: 24px;
  font-weight: 300;
}

.gallery-section {
  padding: 80px 70px 120px;
}

.gallery-title {
  margin-top: 10px;
}

.gallery-arrows {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin: 20px 0 40px;
}

.gallery-arrow {
  width: 55px;
  height: 32px;
  background: var(--q-primary);
  border: 1px solid var(--q-primary);

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
  transition: 0.25s ease;
}

.gallery-arrow:hover {
  background: transparent;
}

.gallery-arrow i {
  color: white;
  transition: 0.25s ease;
}

.gallery-arrow:hover i {
  color: var(--q-primary);
}

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

.gallery-item {
  width: calc((100% - 40px) / 2);
}

.gallery-item img {
  width: 100%;
  display: block;
  object-fit: contain;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.1);
}

.timezone-toggle {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 15px;
}

.timezone-btn {
  background: var(--q-primary);
  color: white;
  border: 1px solid var(--q-primary);
  padding: 8px 14px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  transition: 0.25s ease;
}

.timezone-btn:hover {
  background: transparent;
  color: var(--q-primary);
}

.timezone-btn.active {
  background: transparent;
  color: var(--q-primary);
}
</style>
