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

    <hr style="margin: 40px 0">

    <h3>Partners</h3>

    <div v-for="partner in partners" :key="partner.id_partner">

      <img
        :src="`http://localhost:3000/${partner.image_header}`"
        style="max-width: 300px; margin-bottom: 20px"
      />

    </div>

    <hr style="margin: 40px 0">

    <h3>Circuit Sector Images</h3>

    <div v-for="circuit in circuits" :key="circuit.id_circuit">

      <img
        :src="`http://localhost:3000/${circuit.image_sectors}`"
        style="max-width: 500px; margin-bottom: 30px"
      />

    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const images = ref([])
const teamMembers = ref([])
const partners = ref([])
const circuits = ref([])

onMounted(async () => {

  try {

    const galleryRes = await axios.get('http://localhost:3000/team-gallery')
    images.value = galleryRes.data

    const teamRes = await axios.get('http://localhost:3000/haas-team')
    teamMembers.value = teamRes.data

    const PartnerRes = await axios.get('http://localhost:3000/partners')
    console.log(PartnerRes.data)
    partners.value = PartnerRes.data


    const SectorsRes = await axios.get('http://localhost:3000/circuits-sectors')
    console.log(SectorsRes.data)
    circuits.value = SectorsRes.data


  } catch (err) {
    console.log(err)
  }

})
</script>