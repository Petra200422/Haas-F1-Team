<template>
  <q-page v-if="partner">

    <!-- HERO -->
    <div class="hero-section">
      <img
        :src="getImage(partner.image_header)"
        class="hero-image"
      />
    </div>

    <!-- WRAPPER -->
    <div class="partner-section">

      <!-- TOP ROW -->
      <div class="partner-top">

        <!-- TITLE -->
        <div class="partner-title">
          <h1>{{ partner.name }}</h1>
          <h2>OFFICIAL PARTNER</h2>
        </div>

        <!-- SOCIAL CARD -->
        <div class="partner-info">

          <div class="info-title">
            CONNECT WITH {{ partner.name }}
          </div>

          <a
            v-if="partner.website"
            :href="partner.website"
            target="_blank"
            class="info-row"
          >
            <i class="fas fa-globe"></i> Website
          </a>

          <a
            v-if="partner.instagram"
            :href="formatSocial('instagram', partner.instagram)"
            target="_blank"
            class="info-row"
          >
            <i class="fab fa-instagram"></i> Instagram
          </a>

          <a
            v-if="partner.twitter"
            :href="formatSocial('twitter', partner.twitter)"
            target="_blank"
            class="info-row"
          >
            <i class="fab fa-x-twitter"></i> Twitter
          </a>

          <a
            v-if="partner.facebook"
            :href="formatSocial('facebook', partner.facebook)"
            target="_blank"
            class="info-row"
          >
            <i class="fab fa-facebook"></i> Facebook
          </a>

        </div>

      </div>

      <!-- DESCRIPTION (SVE PARAGRAFE) -->
      <div class="partner-description">

        <p
          v-for="(p, index) in descriptionParagraphs"
          :key="index"
        >
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

const route = useRoute()
const partner = ref(null)

const api_url = import.meta.env.VITE_API_URL

const getImage = (path) => {
  if (!path) return ''
  return `${api_url}/${encodeURI(path)}`
}

/* 🔥 SPLITAJ TEKST IZ BAZE U VIŠE ODLOMAKA */
const descriptionParagraphs = computed(() => {
  if (!partner.value?.description) return []

  return partner.value.description
    .split('\n')   // 👈 svaki novi red = novi paragraf
    .filter(p => p.trim() !== '')
})

const formatSocial = (type, value) => {
  if (!value) return ''
  if (value.startsWith('http')) return value

  if (type === 'instagram') return `https://instagram.com/${value}`
  if (type === 'twitter') return `https://twitter.com/${value}`
  if (type === 'facebook') return `https://facebook.com/${value}`

  return value
}

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

onMounted(loadPartner)
</script>

<style scoped>

/* HERO */
.hero-section {
  width: 100%;
  margin-top: 70px;
}

.hero-image {
  width: 100%;
  display: block;
}

/* WRAPPER */
.partner-section {
  padding: 60px 70px 120px 70px;
}

/* TOP ROW */
.partner-top {
  display: grid;
  grid-template-columns: 1fr 280px;
  align-items: start;
  column-gap: 60px;
}

/* TITLE */
.partner-title h1 {
  margin: 0;
  color:black;
}

.partner-title h2 {
  margin-top: 10px;
}

/* CARD */
.partner-info {
  width: 280px;
  background: var(--q-accent);
  padding: 30px;
  box-shadow: 0 4px 25px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-title {
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 10px;
}

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

.info-row i {
  font-size: 18px;
}

.info-row:hover {
  color: var(--q-primary);
}

/* DESCRIPTION */
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