<template>
  <q-page class="standings-page">

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

    <!-- DIVIDER -->
    <div class="divider"></div>

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

 <table v-if="selectedType === 'drivers'" class="standings-table">
  <thead>
    <tr>
      <th>Position</th>
      <th>Driver</th>
      <th class="points-cell">Points</th>
    </tr>
  </thead>

  <tbody>
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

    <table v-if="selectedType === 'teams'" class="standings-table">
  <thead>
    <tr>
      <th>Position</th>
      <th>Team</th>
      <th class="points-cell">Points</th>
    </tr>
  </thead>

  <tbody>
    <tr
      v-for="team in teams"
      :key="team.id_team"
      :class="{ 'haas-row': team.id_team === 8 }"
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

const api_url = import.meta.env.VITE_API_URL

const selectedType = ref('drivers')

const drivers = ref([])
const teams = ref([])

const loadDrivers = async () => {
  const res = await axios.get(`${api_url}/driver-standings`)
  drivers.value = res.data
}

const loadTeams = async () => {
  const res = await axios.get(`${api_url}/team-standings`)
  teams.value = res.data
}

onMounted(() => {
  loadDrivers()
  loadTeams()
})
</script>

<style scoped>
.standings-page {
  padding: 80px 70px;
}

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

/* DIVIDER FULL WIDTH */
.divider {
  height: 30px;
  background: var(--q-primary);
  margin: 60px 0 60px 0;
  margin-left: calc(-50vw + 50%);
  margin-right: calc(-50vw + 50%);
}

.filter-row {
  display: flex;
  gap: 10px;
  margin: 70px 0 40px;
}

.filter-box {
  padding: 8px 14px;
  border: 1px solid var(--q-primary);
  cursor: pointer;
}

.filter-box.active {
  background: var(--q-primary);
  color: white;
}

.standings-table {
  width: 80%;
  border-collapse: collapse;
  background: white;
  box-shadow: 0 4px 25px rgba(0,0,0,0.12);
  margin: 0 auto;
}

.standings-table th {
  background: var(--q-secondary);
  color: black;
  padding: 16px;
  text-align: left;
  font-weight: 700;
  font-size: 16px;
}

.standings-table td {
  padding: 16px;
  border-bottom: 1px solid rgba(0,0,0,0.12);
  color: black;
  font-size: 16px;
}

.position-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 38px;
  height: 30px;
  background: #e5e5e5;
  font-weight: 700;
}

.standings-table th.points-cell {
  text-align: right;
  padding-right: 30px;
}

.standings-table td.points-cell {
  text-align: right;
  font-weight: 700;
}

/* HAAS highlight */
.haas-row {
  background: #fff !important;
  box-shadow: 0 4px 18px rgba(0,0,0,0.18);
  position: relative;
  z-index: 2;
}

.haas-row td:first-child {
  border-left: 6px solid var(--q-primary);
}

.haas-row .position-badge {
  background: var(--q-primary);
  color: white;
}

.haas-row td {
  font-weight: 700;
}
</style>