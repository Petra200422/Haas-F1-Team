<template>
  <q-page class="team-page">
  <div class="page-header">
        <h1>
          TEAM MEMBERS
        </h1>

        <h2>
          OFFICIAL TEAM MEMBERS
        </h2>
      </div>

    <!-- DRIVERS -->
    <section v-if="drivers.length" class="team-section">

      <div class="team-header">
        <div>
          <h4>MEET OUR</h4>
          <h3>FORMULA 1 DRIVERS</h3>

          <p>
            The main drivers of TGR Haas F1 Team represent the team on the Formula 1 grid, competing at the highest level of motorsport with skill, determination, and precision. 
As the faces of the team on race weekends, they play a key role in delivering performance on track while working closely with engineers.
          </p>
        </div>
      </div>

      <div class="team-grid">

        <router-link
          v-for="member in drivers"
          :key="member.id_member"
          :to="`/member/${member.id_member}`"
          class="team-card"
        >
          <img
            :src="getImage(member.image_profile)"
            :alt="member.name"
          >

          <div class="member-name">
            {{ member.name }} {{ member.surname }}
          </div>

        </router-link>

      </div>

    </section>

    <!-- LEADERSHIP -->
    <section v-if="leadership.length" class="team-section">

      <div class="team-header">
        <div>
          <h4>MEET OUR</h4>
          <h3>FORMULA 1 LEADERS</h3>

          <p>
            The leadership of TGR Haas F1 Team plays a vital role in guiding the team both on and off the track. Responsible for strategy, development, and overall team direction, Formula 1 leaders ensure that every department works together toward a common goal.
          </p>
        </div>
      </div>

      <div class="team-grid">

        <router-link
          v-for="member in leadership"
          :key="member.id_member"
          :to="`/member/${member.id_member}`"
          class="team-card"
        >
          <img
            :src="getImage(member.image_profile)"
            :alt="member.name"
          >

          <div class="member-name">
            {{ member.name }} {{ member.surname }}
          </div>

        </router-link>

      </div>

    </section>

    <!-- RESERVE -->
    <section v-if="reserveDrivers.length" class="team-section">

      <div class="team-header">
        <div>
          <h4>MEET OUR</h4>
          <h3>FORMULA 1 RESERVE DRIVERS</h3>

          <p>
            Reserve drivers play an important role within TGR Haas F1 Team, supporting race drivers and contributing to car development throughout the season. By participating in simulator work, testing sessions, and race weekend preparations, they help the team stay ready for every challenge.
          </p>
        </div>
      </div>

      <div class="team-grid">

        <router-link
          v-for="member in reserveDrivers"
          :key="member.id_member"
          :to="`/member/${member.id_member}`"
          class="team-card"
        >
          <img
            :src="getImage(member.image_profile)"
            :alt="member.name"
          >

          <div class="member-name">
            {{ member.name }} {{ member.surname }}
          </div>

        </router-link>

      </div>

    </section>

    <!-- ACADEMY -->
    <section v-if="academyDrivers.length" class="team-section">

      <div class="team-header">
        <div>
          <h4>MEET OUR</h4>
          <h3>F1 ACADEMY DRIVER</h3>

          <p>
            The F1 Academy driver represents the next generation of racing talent within TGR Haas F1 Team. Competing in the F1 Academy series, she continues to develop her skills, gain valuable racing experience, and inspire future drivers while building a path toward the highest levels of motorsport.
          </p>
        </div>
      </div>

      <div class="team-grid">

        <router-link
          v-for="member in academyDrivers"
          :key="member.id_member"
          :to="`/member/${member.id_member}`"
          class="team-card"
        >
          <img
            :src="getImage(member.image_profile)"
            :alt="member.name"
          >

          <div class="member-name">
            {{ member.name }} {{ member.surname }}
          </div>

        </router-link>

      </div>

    </section>

  </q-page>
</template>


<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const api_url = import.meta.env.VITE_API_URL

const members = ref([])

const getImage = (path) => {
  if (!path) return ''
  return `${api_url}/${encodeURI(path)}`
}

const loadMembers = async () => {
  const res = await axios.get(`${api_url}/haas-team`)
  members.value = res.data
}

const drivers = computed(() =>
  members.value.filter(m => m.role === 'driver')
)

const leadership = computed(() =>
  members.value.filter(m => m.role === 'leadership')
)

const reserveDrivers = computed(() =>
  members.value.filter(m => m.role === 'reserve_driver')
)

const academyDrivers = computed(() =>
  members.value.filter(m => m.role === 'academy_driver')
)

onMounted(loadMembers)
</script>

<style>

.team-page {
  padding: 80px 70px;
}

.page-header {
  padding-top: 120px;
}

.page-header h1{
  color: black;
}

.team-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 100px;
  padding-top: 180px;
}

.team-info {
  width: 35%;
}

.team-header {
  margin-bottom: 50px;
}

.team-header p {
  max-width: 600px;
}

.team-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
}

.team-card {
  width: auto;
  text-decoration: none;
}

.team-card img {
  display: block;

  /* ORIGINALNA VELIČINA */
  width: auto;
  height: auto;

  box-shadow: 0 4px 25px rgba(0,0,0,0.10);

  transition: transform .3s ease;
}

.team-card:hover img {
  transform: scale(1.03);
}

.member-name {
  margin-top: 15px;
  color: black;
  font-size: 18px;
  font-weight: 400;
}
</style>