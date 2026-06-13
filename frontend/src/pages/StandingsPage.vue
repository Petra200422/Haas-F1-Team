<template>
  <q-page class="standings-page">
    <!-- naslov lijevo, tekst desno -->
    <div class="standings-header">
      <div class="header-left">
        <h1>STANDINGS</h1>
        <h2>2026</h2>
      </div>

      <div class="header-right">
        <p>
          The 2026 Formula 1 season is heating up, and the Haas F1 Team is pushing hard to make their mark on the standings.
          Every race challenges the drivers and engineers to extract maximum performance, and Haas continues to fight for every point
          against some of the strongest competitors on the grid. Follow the team’s progress as they navigate the highs and lows of the
          championship, aiming to climb the leaderboard with determination and precision.
        </p>
      </div>
    </div>

    <!-- crta za razdvojiti sekcije -->
    <div class="divider"></div>

    <!-- sekcija sa filterom gdje se odabiru vozači ili timovi -->
    <div class="filter-row">
      <div
        class="filter-box"
        :class="{ active: selectedType === 'drivers' }"
        @click="selectedType = 'drivers'"
      >
        DRIVERS
      </div>

      <div
        class="filter-box"
        :class="{ active: selectedType === 'teams' }"
        @click="selectedType = 'teams'"
      >
        TEAMS
      </div>
    </div>

<!-- tablica poretka vozača koje s eprikazuje kada su izabrani drivers -->
 <table v-if="selectedType === 'drivers'" class="standings-table">
  <thead>
    <tr>
      <th>Position</th>
      <th>Driver</th>
      <th class="points-cell">Points</th>
    </tr>
  </thead>

  <tbody>
    <!-- ako je id tima 8 (Haas) -->
    <tr
      v-for="driver in drivers"
  :key="driver.id_driver"
  :class="{ 'haas-row': Number(driver.id_team) === 8 }" 
    >
      <td>
        <span class="position-badge">
          {{ driver.position }}
        </span>
      </td>

      <td>{{ driver.name }} {{ driver.surname }}</td>
      <td class="points-cell">{{ driver.points }} PTS</td>
    </tr>
  </tbody>
</table>

<!-- tablica poretka timova kada je odabrano teams -->
<table v-if="selectedType === 'teams'" class="standings-table">
  <thead>
    <tr>
      <th>Position</th>
      <th>Team</th>
      <th class="points-cell">Points</th>
    </tr>
  </thead>

  <tbody>
    <!-- ako je id tima 8 (Haas) -->
    <tr
      v-for="team in teams"
      :key="team.id_team"
      :class="{ 'haas-row': Number(team.id_team) === 8 }"
    >
      <td>
        <span class="position-badge">
          {{ team.position }}
        </span>
      </td>

      <td>{{ team.team_name }}</td>
      <td class="points-cell">{{ team.points }} PTS</td>
    </tr>
  </tbody>
</table>

  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const api_url = import.meta.env.VITE_API_URL // url backend apija u .env datoteci

const selectedType = ref('drivers') // određuje prikazuju li se vozači ili timovi

const drivers = ref([]) // sprema podatke vozača iz baze
const teams = ref([]) // sprema podatke timova iz baze

// funkcija dohvaća poredak vozača iz backenda
const loadDrivers = async () => {
  const res = await axios.get(`${api_url}/driver-standings`)
  drivers.value = res.data
}

// funklcija dohvaća poredak timova iz backenda
const loadTeams = async () => {
  const res = await axios.get(`${api_url}/team-standings`)
  teams.value = res.data
}

// kada se stranicu učita dohvaća oba poretka
onMounted(() => {
  loadDrivers()
  loadTeams()
})
</script>

<style scoped>
.standings-page {
  padding: 80px 70px;
}

/* dio sa naslovom lijevo a tekstom desno */
.standings-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 80px;
  padding-top: 120px;
}

.header-left h1 {
  color: black;
  margin: 0;
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
  margin-left: calc(-50vw + 50%); /* da izađe iz paddinga */
  margin-right: calc(-50vw + 50%);
}

/* dio sa filterom */
.filter-row {
  display: flex;
  gap: 10px;
  margin: 70px 0 40px;
}

/* zasebni filter */
.filter-box {
  padding: 8px 14px;
  border: 1px solid var(--q-primary);
  cursor: pointer;
}

.filter-box.active {
  background: var(--q-primary);
  color: white;
}

/* tablica poretka */
.standings-table {
  width: 80%;
  border-collapse: collapse;
  background: white;
  box-shadow: 0 4px 25px rgba(0,0,0,0.12);
  margin: 0 auto;
}

/* zaglavlje tablice */
.standings-table th {
  background: var(--q-secondary);
  color: black;
  padding: 16px;
  text-align: left;
  font-weight: 700;
  font-size: 16px;
}

/* ćelije u tablici */
.standings-table td {
  padding: 16px;
  border-bottom: 1px solid rgba(0,0,0,0.12);
  color: black;
  font-size: 16px;
}

/* oznaka za broj pozicije */
.position-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 38px;
  height: 30px;
  background: #e5e5e5;
  font-weight: 700;
}

/* stupac sa bodovima ide desno */
.standings-table th.points-cell {
  text-align: right;
  padding-right: 30px;
}

.standings-table td.points-cell {
  text-align: right;
  font-weight: 700;
}

/* za Haas vozače i Haas tim */
.haas-row {
  background: #fff !important;
  box-shadow: 0 4px 18px rgba(0,0,0,0.18);
  position: relative;
  z-index: 2;
}

/* crveno na lijevom rubu */
.haas-row td:first-child {
  border-left: 6px solid var(--q-primary);
}

/* crvena pozicija */
.haas-row .position-badge {
  background: var(--q-primary);
  color: white;
}

/* tekst u Haas redovima */
.haas-row td {
  font-weight: 700;
}
</style>