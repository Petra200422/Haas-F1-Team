<template>
  <q-page class="schedule-page">
    <div class="schedule-header">
      <!-- naslov lijevo --> 
      <div class="header-left">
        <h1>SCHEDULE</h1>
        <h2>2026</h2>
      </div>

      <!-- tekst desno --> 
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

    <div class="divider"></div> <!-- crta za razdvajanje sekcija --> 

    <!-- grid sa karticama utrka --> 
    <div class="races-grid">
      
      <!-- vodi na stranicu te utrke --> 
      <router-link
        v-for="race in races"
        :key="race.id_race"
        :to="`/race/${race.id_race}`"
        class="race-card"
        :class="{ finished: isFinishedRace(race.date_end) }"
      >
        <img :src="getImage(race.image_profile)" class="race-img" /> <!-- slika --> 

        <!-- datum trajanaj --> 
        <div class="race-date">
          {{ formatRaceDate(race.date_start, race.date_end) }}
        </div>

        <!-- ime --> 
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

const api_url = import.meta.env.VITE_API_URL // url backend apija u .env datoteci

const races = ref([]) // sprema sve utrke iz baze

// prima outanju slike iz baze i pretvara u url na backendu
const getImage = (path) => {
  if (!path) return ''
  return `${api_url}/${encodeURI(path)}`
}

// funkcija formatira datum utrke, uzima originalni datum i pretvara ga u kreći sa riječima
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

  // ako je isti mjesec
  if (startMonth === endMonth) {
    return `${startDay} - ${endDay} ${startMonth}`
  }

  // ako je različiti mjesec
  return `${startDay} ${startMonth} - ${endDay} ${endMonth}`
}

// funkcija koja provjerava je li utrka završila i ako je označava se kao finished
const isFinishedRace = (dateEnd) => {
  if (!dateEnd) return false

  const today = new Date()

  today.setHours(0, 0, 0, 0) //postavlja vrijeme na 0,0,0,0 pa se gleda samo datum

  const raceEnd = new Date(dateEnd)

  return raceEnd < today
}

// funkcija dohvaća sev utrke iz baze podataka
const loadRaces = async () => {
  const res = await axios.get(`${api_url}/schedule-races`)
  races.value = res.data
}

// nakon učitavanja prikazuju se utrke
onMounted(loadRaces)
</script>

<style scoped>
.schedule-page {
  padding: 80px 70px;
}

/* sekcija sa naslovom lijevo i tekson desno */
.schedule-header {
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

/* crta */
.divider {
  height: 30px;
  background: var(--q-primary);
  margin: 60px 0 60px 0;
  margin-left: calc(-50vw + 50%);
  margin-right: calc(-50vw + 50%);
}

/* grid kartica utrka, 4 u redu */
.races-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
}

/* zasebna kartica */
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

/* slika utrke u punoj širini */
.race-img {
  width: 100%;
  height: auto;
  object-fit: contain;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.1);
}

/* datum */
.race-date {
  font-size: 14px;
  color: black;
  font-weight: 700;
}

/* naslov */
.race-title {
  font-size: 18px;
  font-weight: 500;
  line-height: 1.4;
}

/* ako je utrka prošla */
.finished .race-img {
  filter: brightness(50%);
}
</style>
