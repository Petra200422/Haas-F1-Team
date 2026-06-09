<template>
  <q-page class="schedule-page">
    <div class="partners-header">
      <div class="header-left">
        <h1>SCHEDULE</h1>
        <h2>2026</h2>
      </div>

      <div class="header-right">
        <p>
          Find out where TGR Haas F1 Team will be racing during the 2026 Formula 1 season, as a new
          era of the sport begins with revised aerodynamic and power unit regulations. The updated
          rules introduce smaller, lighter cars powered by advanced hybrid technology and 100%
          sustainable fuels, marking an exciting step forward for performance and sustainability in
          Formula 1.
        </p>
      </div>
    </div>

    <div class="divider"></div>

    <div class="races-grid">
      <router-link
        v-for="race in races"
        :key="race.id_race"
        :to="`/race/${race.id_race}`"
        class="race-card"
        :class="{ finished: isFinishedRace(race.date_end) }"
      >
        <img :src="getImage(race.image_profile)" class="race-img" />

        <div class="race-date">
          {{ formatRaceDate(race.date_start, race.date_end) }}
        </div>

        <div class="race-title">
          {{ race.race_name }}
        </div>
      </router-link>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const api_url = import.meta.env.VITE_API_URL

const races = ref([])

const getImage = (path) => {
  if (!path) return ''
  return `${api_url}/${encodeURI(path)}`
}

// 👇 OVDJE DODAJ
const formatRaceDate = (start, end) => {
  const startDate = new Date(start)
  const endDate = new Date(end)

  const months = [
    'JAN',
    'FEB',
    'MAR',
    'APR',
    'MAY',
    'JUN',
    'JUL',
    'AUG',
    'SEP',
    'OCT',
    'NOV',
    'DEC',
  ]

  const startDay = String(startDate.getDate()).padStart(2, '0')
  const endDay = String(endDate.getDate()).padStart(2, '0')

  const startMonth = months[startDate.getMonth()]
  const endMonth = months[endDate.getMonth()]

  if (startMonth === endMonth) {
    return `${startDay} - ${endDay} ${startMonth}`
  }

  return `${startDay} ${startMonth} - ${endDay} ${endMonth}`
}

const isFinishedRace = (dateEnd) => {
  if (!dateEnd) return false

  const today = new Date()

  today.setHours(0, 0, 0, 0)

  const raceEnd = new Date(dateEnd)

  return raceEnd < today
}

const loadRaces = async () => {
  const res = await axios.get(`${api_url}/schedule-races`)
  races.value = res.data
}

onMounted(loadRaces)
</script>

<style scoped>
.schedule-page {
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

.divider {
  height: 30px;
  background: var(--q-primary);
  margin: 60px 0 60px 0;
  margin-left: calc(-50vw + 50%);
  margin-right: calc(-50vw + 50%);
}

.races-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
}

.race-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-decoration: none;
  color: black;
  cursor: pointer;
  transition: transform 0.25s ease;
}

.race-card:hover {
  transform: translateY(-5px);
}

.race-card:hover .race-title {
  color: var(--q-primary);
}

.race-img {
  width: 100%;
  height: auto;
  object-fit: contain;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.1);
}

.race-date {
  font-size: 14px;
  color: black;
  font-weight: 700;
}

.race-title {
  font-size: 18px;
  font-weight: 500;
  line-height: 1.4;
}

.finished .race-img {
  filter: brightness(50%);
}
</style>
