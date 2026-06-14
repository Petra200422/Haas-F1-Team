<template>
  <q-page v-if="race" class="race-page">
    <div class="hero-section">
      <img :src="getImage(race.image_header)" class="hero-image" />

      <div class="hero-overlay"></div> <!-- tamni prijelaz preko slike -->

      <div class="hero-text">
        <h1>{{ race.race_name }}</h1>
        <h2>ROUND {{ race.round }}</h2>
      </div>
    </div>

    <!-- sekcija sa stazom i informacijama -->
    <section class="track-section">
      <div class="track-header">
        <h4>{{ race.race_name }}</h4>
        <h3>{{ race.circuit_name }}</h3>
      </div>

      <div class="track-content">
        <!-- mapa starze, ako je upaljeno showSectors onda se prikazuje slika sa sektorima, ako nije onda obična -->
        <div class="track-map-wrap">
          <img
            :src="getImage(showSectors ? race.image_sectors : race.image_track)"
            class="track-map"
          />
        </div>

        <!-- kartica sa terminima svih sesija -->
        <div class="sessions-card">
          <!-- gumb mijenja prikaz vremen po vremenskoj zoni staze i korisnikovoj vremenskoj zoni-->
          <div class="timezone-toggle">
            <button
              class="timezone-btn"
              :class="{ active: useMyTimezone }"
              @click="useMyTimezone = !useMyTimezone"
            >
              {{ useMyTimezone ? 'SHOW LOCAL TIME' : 'SHOW MY TIME' }}
            </button>
          </div>

          <!-- tablica svih sesija -->
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

      <!-- dio sa informacijama -->
      <div class="info-bar">
        <!-- za prikaz sekcija na mapi staze -->
        <div class="sector-toggle">
          <span>SECTORS</span>

          <label class="custom-checkbox">
            <input type="checkbox" v-model="showSectors" />
            <span class="checkmark"></span>
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

    <!-- opis staze -->
    <section class="description-section">
      <h4>EXPLORE THE TRACK</h4>
      <h3>EVERY CORNER TELLS A STORY</h3>

      <p>{{ race.description }}</p>
    </section>

    <!-- dio sa dodatnim informacijam -->
    <section class="more-section">
      <h4>BEHIND THE TRACK</h4>
      <h3>GET TO KNOW MORE</h3>

      <div class="more-grid">
        <!-- fun fact dio -->
        <div class="accordion-item" :class="{ open: showFunFact }">
          <div class="accordion-header" @click="showFunFact = !showFunFact">
            <span>FUN FACT</span>
            <span>{{ showFunFact ? '-' : '+' }}</span>
          </div>

          <div v-if="showFunFact" class="accordion-body">
            <p>{{ race.fun_fact }}</p>
          </div>
        </div>

        <!-- karakteristike staze -->
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

    <!-- galerija -->
    <div class="gallery-section" v-if="circuitGallery.length">
      <h4 class="gallery-subtitle">MEMORIES FROM</h4>

      <h3 class="gallery-title">THE TRACK</h3>

      <!-- strelice -->
      <div class="gallery-arrows">
        <div class="gallery-arrow" @click="prevGallery">
          <i class="fas fa-chevron-left"></i>
        </div>

        <div class="gallery-arrow" @click="nextGallery">
          <i class="fas fa-chevron-right"></i>
        </div>
      </div>

      <!-- slider galerije -->
      <div class="gallery-wrapper">
        <div
          class="gallery-track"
          :style="{
            transform: `translateX(-${galleryIndex * 100}%)`,
          }"
        >
          <div class="gallery-group" v-for="(group, gIndex) in groupedGallery" :key="gIndex"> <!-- svaka grupa iam 2 slike -->
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

const route = useRoute() //dohvaća id utrke iz url
const api_url = import.meta.env.VITE_API_URL // url backend apija u .env datoteci

const race = ref(null) // sprema osnovne podatek u satzi i utrci
const sessions = ref([]) //sprema tremine sesija
const showSectors = ref(false) // određuje prikazuje li se mapa ili sektori

// kontorlira je li accordion otvoren
const showFunFact = ref(false) 
const showTrackFeatures = ref(false) 

const circuitGallery = ref([]) // sprema galeriju slika 
const galleryIndex = ref(0) // trenutni indeks galerije

const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone // dohvaća vremensku zoni korisnika iz preglednika
const useMyTimezone = ref(false) // određuje prikazuje li se vrijeme lokalno ili u korisnkovoj zoni

// prima putanju slike iz baze i pretvara je u puni url
const getImage = (path) => {
  if (!path) return ''
  return `${api_url}/${encodeURI(path)}`
}

// funkcija dohvaća detalje utrkle prema id iz url
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

// funkcija dohvaća sve sesije za utrku
const loadSessions = async () => {
  const res = await axios.get(`${api_url}/race-sessions/${route.params.id}`)
  sessions.value = res.data
}

// formatira datum, prkazuje samo kraće ime dana, dan i kreći mjesec
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

/*
  Funkcija formatira vrijeme sesije.

  Ima dva načina rada:

  1. SHOW MY TIME:
     Vrijeme se prikazuje u vremenskoj zoni korisnika.
     Preglednik automatski prepoznaje korisnikovu vremensku zonu
     pomoću Intl.DateTimeFormat().resolvedOptions().timeZone.

  2. SHOW LOCAL TIME:
     Vrijeme se prikazuje kao lokalno vrijeme države u kojoj se utrka vozi.
     Za to se koristi gmt_offset iz baze, npr. "02:00:00" ili "-05:00:00".

  Kod lokalnog vremena:
  - uzima se početni UTC datum sesije
  - iz gmt_offset vrijednosti se izračuna pomak u milisekundama
  - taj pomak se doda na originalni datum
  - zatim se vrijeme formatira kao UTC kako bi se prikazao već izračunati lokalni sat
*/
const formatSessionTime = (session) => {
  if (!session?.date_start) return ''

  const date = new Date(session.date_start)

  // korsnikova zona
  if (useMyTimezone.value) {
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: userTimezone,
    })
  }

  // lokalno vrijeme
  const offset = session.gmt_offset || '00:00:00'

  // provjerava se je li pomak pozitvan ili negativan
  const sign = offset.startsWith('-') ? -1 : 1

  // miče se minus
  const cleanOffset = offset.replace('-', '')

  // Iz gmt_offset vrijednosti dohvaćaju se sati i minute
  const [hours, minutes] = cleanOffset.split(':').map(Number)

   // Vremenski pomak pretvara se u milisekunde
  const offsetMs = sign * ((hours * 60 + minutes) * 60 * 1000)

  // Na UTC vrijeme dodaje se pomak lokalne vremenske zone utrke
  const localRaceDate = new Date(date.getTime() + offsetMs)

  // Vrijeme se formatira kao UTC jer je pomak već ručno uračunat
  return localRaceDate.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
  })
}

// funkcija dohvaća gerliju slika za id utrke iz urla
const loadCircuitGallery = async () => {
  try {
    const res = await axios.get(`${api_url}/circuit-gallery/${race.value.id_circuit}`)

    circuitGallery.value = res.data
  } catch (err) {
    console.error(err)
  }
}

// computed grupira slike galerije po dvije
const groupedGallery = computed(() => {
  const groups = []

  for (let i = 0; i < circuitGallery.value.length; i += 2) {
    groups.push(circuitGallery.value.slice(i, i + 2))
  }

  return groups
})

// pomiče galeriju naprijed
const nextGallery = () => {
  if (galleryIndex.value < groupedGallery.value.length - 1) {
    galleryIndex.value++
  }
}

// pomiče galeriju nazad
const prevGallery = () => {
  if (galleryIndex.value > 0) {
    galleryIndex.value--
  }
}

// nakon učitavanja prikazuje podatke utrke
onMounted(() => {
  loadRace()
})
</script>

<style scoped>
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

/* dio sa informacijama o stazi */
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

/* grid raspored, staza i tablica sesija */
.track-content {
  display: grid;
  grid-template-columns: 1fr 430px;
  gap: 60px;
  align-items: center;
  margin-top: 40px;
}

/* slika staze ili sektora */
.track-map {
  width: auto;
  display: block;
}

/* kartica sa rasporedom sesija */
.sessions-card {
  background: white;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.15);
  padding: 20px;
}

/* tablica */
.sessions-card table {
  width: 100%;
  border-collapse: collapse;
}

/* ćelije tablice */
.sessions-card td {
  padding: 13px 8px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  font-size: 14px;
}

/* ime sesije */
.sessions-card td:first-child {
  font-weight: 700;
}

/* datum i vrijeme */
.sessions-card td:nth-child(2),
.sessions-card td:nth-child(3) {
  text-align: right;
  white-space: nowrap;
}

/* traka sa podatcima */
.info-bar {
  margin: 60px auto 0;
  background: white;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.18);
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  padding: 15px 25px;
  gap: 20px;
}

/* naslov podatka */
.info-bar span {
  display: block;
  font-size: 14px;
  font-weight: 700;
  color: #777;
  margin-bottom: 4px;
}

/* vrijednost */
.info-bar strong {
  font-size: 14px;
  color: black;
}

/* dio sa checboxom */
.sector-toggle label {
  font-size: 14px;
}

.custom-checkbox {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.custom-checkbox input {
  display: none;
}

.checkmark {
  width: 14px;
  height: 14px;
  border: 1px solid var(--q-primary);
  background: white;
}

.custom-checkbox input:checked + .checkmark {
  background: var(--q-primary);
}

/* opis staze */
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

/* accordion sekcije */
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

/* dva accordiona jedna pored drugog */
.more-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 90px;
  align-items: start;
}

/* accordion kartici */
.accordion-item {
  width: 100%;
  background: var(--q-primary);
  color: white;
}

/* sjena samo na otvorenoj kartici */
.accordion-item.open {
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.15);
}

/* zaglavlje */
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

/* sadržaj */
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

/* plus/minus ikona */
.accordion-header span:last-child {
  font-size: 24px;
  font-weight: 300;
}

/* galerija */
.gallery-section {
  padding: 80px 70px 120px;
}

.gallery-title {
  margin-top: 10px;
}

/* strlice */
.gallery-arrows {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin: 20px 0 40px;
}

/* strelica */
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

/* ikona strelice */
.gallery-arrow i {
  color: white;
  transition: 0.25s ease;
}

.gallery-arrow:hover i {
  color: var(--q-primary);
}

/* sakriva sadržaj izvan slidera */
.gallery-wrapper {
  overflow: hidden;
}

.gallery-track {
  display: flex;
  transition: transform 0.5s ease;
}

/* jedna grupa */
.gallery-group {
  display: flex;
  gap: 40px;
  min-width: 100%;
}

/* jedna slika */
.gallery-item {
  width: calc((100% - 40px) / 2);
}

.gallery-item img {
  width: 100%;
  display: block;
  object-fit: contain;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.1);
}

/* vremenska zona */
.timezone-toggle {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 15px;
}

/* gumb za vremensku zonu */
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
