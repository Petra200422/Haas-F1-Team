<template>
  <q-page class="partners-page">

    <!-- HEADER -->
    <div class="page-header partners-header">

      <div class="header-left">
        <h1>PARTNERS</h1>
        <h2>2026</h2>
      </div>

      <div class="header-right">
        <p>
          The Haas F1 Team partners with leading global brands to compete at the highest level of motorsport, combining engineering innovation, performance, and teamwork in the pursuit of stronger results. Through collaboration and shared ambition, these partnerships help drive continuous development both on and off the track.
        </p>
      </div>

    </div>

    <div class="divider"></div>

    <div class="partners-section">

  <div
    class="partner-row"
    v-for="(row, index) in groupedPartners"
    :key="index"
  >
    <router-link
      v-for="partner in row"
      :key="partner.id_partner"
      :to="`/partner/${partner.id_partner}`"
      class="partner-card"
    >
      <img :src="getImage(partner.logo)" />
    </router-link>
  </div>

</div>

  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

const api_url = import.meta.env.VITE_API_URL
const partners = ref([])

const getImage = (path) => {
  if (!path) return ''
  return `${api_url}/${encodeURI(path)}`
}

const loadPartners = async () => {
  const res = await axios.get(`${api_url}/partners`)
  partners.value = res.data
}

/* 🔥 GROUPING: 1 → 2 → 6 */
const groupedPartners = computed(() => {
  const groups = []

  let i = 0

  // 1. red
  if (partners.value.length > 0) {
    groups.push(partners.value.slice(0, 1))
    i = 1
  }

  // 2. red
  if (partners.value.length > 1) {
    groups.push(partners.value.slice(i, i + 3))
    i += 3
  }

  // ostali redovi (6 po redu)
  while (i < partners.value.length) {
    groups.push(partners.value.slice(i, i + 6))
    i += 6
  }

  return groups
})

onMounted(loadPartners)


</script>

<style scoped>
.partners-page {
  padding: 80px 70px;
}

/* HEADER */
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

/* DIVIDER */
.divider {
  height: 30px;
  background: var(--q-primary);
  margin: 60px 0 100px 0;
  margin-left: calc(-50vw + 50%); /* da izađe iz container paddinga */
  margin-right: calc(-50vw + 50%); /* da izađe iz container paddinga */
}

.partners-section {
  display: flex;
  flex-direction: column;
  gap: 60px;
}

/* svaki red */
.partner-row {
  display: flex;
  justify-content: center;
  gap: 40px;
}

/* da se prvi i drugi red centriraju ljepše */
.partner-row:first-child {
  justify-content: center; /* 1 partner */
}

.partner-row:nth-child(2) {
  justify-content: center; /* 2 partnera */
}

/* svi ostali redovi (6 po redu) */
.partner-row:nth-child(n+3) {
  flex-wrap: wrap;
}

/* kartica */
.partner-card img {
  width: 140px;
  height: auto;
  object-fit: contain;
}
</style>