<template>
  <div class="q-pa-md">

    <h3>Team Gallery</h3>

    <div v-for="(img, index) in images" :key="'gallery-' + index">

      <p>PUTANJA: {{ img.image }}</p>

      <img
        :src="`http://localhost:3000/${img.image}`"
        width="300"
      />

    </div>

    <hr style="margin: 40px 0">

    <h3>Haas Team Header Images</h3>

    <div v-for="(item) in teamMembers" :key="item.id_member">

      <img
        :src="`http://localhost:3000/${item.image_header}`"
        style="max-width: 400px; margin-bottom: 20px"
      />

    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const images = ref([])
const teamMembers = ref([])

onMounted(async () => {

  try {

    const galleryRes = await axios.get('http://localhost:3000/team-gallery')
    images.value = galleryRes.data

    const teamRes = await axios.get('http://localhost:3000/haas-team')
    teamMembers.value = teamRes.data

  } catch (err) {
    console.log(err)
  }

})
</script>