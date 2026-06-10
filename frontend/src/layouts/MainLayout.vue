<template>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
  />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,100..700;1,100..700&display=swap"
    rel="stylesheet"
  />

  <q-layout view="hhh Lpr lff">
    <!-- NAVIGACIJA koja je fiksna na stranici, logo i linkovi na sve glavne stranice -->
    <q-header class="nav">
      <div class="nav-inner">
        <router-link to="/">
          <img :src="logo" class="logo" /> <!-- vodi na početnu stranicu -->
        </router-link>
        
        <!-- linkovi na ostakle glavne stranice -->
        <div class="links">
          <q-btn flat to="/team" label="Team" class="nav-text" />
          <q-btn flat to="/car" label="Car" class="nav-text" />
          <q-btn flat to="/standings" label="Standings" class="nav-text" />
          <q-btn flat to="/schedule" label="Schedule" class="nav-text" />
          <q-btn flat to="/articles" label="Articles" class="nav-text" />
          <q-btn flat to="/partners" label="Partners" class="nav-text" />
          <q-btn flat to="/contact" label="Contact" class="nav-text" />

          <!-- logout koji se prikazuje ako je prijavljen admin-->
          <q-btn v-if="isAdmin" flat class="logout-btn" @click="logout">
            <i class="fa-solid fa-right-from-bracket"></i>
          </q-btn>
        </div>
      </div>
    </q-header>

    <!-- učitavanje stranice koje se prikazuje prije samog sadržaja -->
    <div v-if="loading" class="global-loader">
      <div class="spinner"></div>
    </div>

    <!-- mjesto gdje se učitava stranica -->
    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- FOOTER -->
    <div class="footer">
      <div class="footer-inner">
        <!-- stupac gdje je logo i tekst o timu -->
        <div class="footer-col footer-about">
          <router-link to="/">
            <img :src="logo" class="logo-footer" />
          </router-link>

          <p class="footer-text">
            Haas F1 Team is focused on continuous development, teamwork, and improving performance
            both on and off the track. With a strong engineering base and clear long-term vision,
            the team is committed to building a more competitive future in Formula 1.
          </p>
        </div>

        <!-- stpac gdje su linkovi tj. navigacija-->
        <div class="footer-col footer-nav">
          <div class="footer-nav-col">
            <router-link to="/team">Team</router-link>
            <router-link to="/car">Car</router-link>
            <router-link to="/standings">Standings</router-link>
            <router-link to="/schedule">Schedule</router-link>
          </div>

          <div class="footer-nav-col">
            <router-link to="/articles">Articles</router-link>
            <router-link to="/partners">Partners</router-link>
            <router-link to="/contact">Contact</router-link>
            <router-link v-if="!isAdmin" to="/adminLogin"> Admin </router-link> <!-- admin se prikazuje samo ako već nije prijavljen -->
          </div>
        </div>

        <!-- stupac gdje su društvene mreže-->
        <div class="footer-col footer-social">
          <a href="https://www.instagram.com/haasf1team/" target="_blank"
            ><i class="fa-brands fa-instagram"></i>Instagram</a
          >
          <a href="https://www.facebook.com/haasf1team/" target="_blank"
            ><i class="fa-brands fa-facebook"></i>Facebook</a
          >
          <a href="https://x.com/HaasF1Team" target="_blank"
            ><i class="fa-brands fa-x-twitter"></i>Twitter</a
          >
          <a href="https://www.tiktok.com/@haasf1official" target="_blank"
            ><i class="fa-brands fa-tiktok"></i>TikTok</a
          >
          <a href="https://www.youtube.com/c/haasf1team" target="_blank"
            ><i class="fa-brands fa-youtube"></i>YouTube</a
          >
        </div>
      </div>
    </div>
  </q-layout>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import logo from 'src/assets/Logo-Navigacija.png'

const router = useRouter()

const loading = ref(false) // prikaz učitavanja

const isAdmin = ref(false) //provjerava se je li admin prijavljen


// pokreće učitavanje prije svake promjene stranice dok s ene učita sadržaj
router.beforeEach(() => {
  loading.value = true
})

// učitavanje se miče nakon 300 ms
router.afterEach(() => {
  setTimeout(() => {
    loading.value = false
  }, 300)
})


// funkcija provjerava je li admin prijavljen iz local storage
const checkAdmin = () => {
  const user = JSON.parse(localStorage.getItem('user'))

  isAdmin.value = user && user.role === 'admin'
}


// kada se stranica učita, provjerava je li admin prijavljen i prikazuje ono što treba
onMounted(() => {
  checkAdmin()

  window.addEventListener('admin-login', checkAdmin)

  window.addEventListener('admin-logout', checkAdmin)
})


// kada je stranica promijeni, briše event listener da se ne gomilaju
onUnmounted(() => {
  window.removeEventListener('admin-login', checkAdmin)

  window.removeEventListener('admin-logout', checkAdmin)
})

// funkcija za logout admina, briše korisnika iz locak storage i vraća na početnu stranicu
const logout = () => {
  localStorage.removeItem('user')

  window.dispatchEvent(new Event('admin-logout'))

  router.push('/')
}
</script>

<style scoped>

/* overlay koji se prikazuje tijekom učitavanja */
.global-loader {
  position: fixed;
  inset: 0;
  background: rgb(255, 255, 255);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999; /* da bude iznad svih elemanata */
}

/* krug koji se vrti */
.spinner {
  width: 45px;
  height: 45px;
  border: 4px solid #ddd;
  border-top: 4px solid var(--q-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite; /* neprekidna rotacija */
}

/* animacija rotacije */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* navigacija */
.nav {
  background: white;
  position: fixed; /* stoji na vrhu dok se scrola */
  top: 15px;
  margin: 15px 55px 0 55px;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.12);
  z-index: 9999;
}

/* raspored unutar navigacije */
.nav-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 30px;
}

/* mjesto gdje su svi linkovi */
.links {
  display: flex;
  gap: 5px;
}

/* izgled linkova */
.nav-text {
  text-transform: none;
  font-size: medium;
  color: black;
  font-weight: 600;
}

.nav-text:hover {
  color: var(--q-primary);
}

/* miče focus efetk */
:deep(.q-focus-helper) {
  display: none;
}

/* logo u navigaciji */
.logo {
  height: 55px;
  width: auto;
  cursor: pointer;
  padding: 5px;
  margin-top: 5px;
}

/* logout ikona */
.logout-btn {
  color: black;
  font-size: 18px;
}

.logout-btn:hover {
  color: var(--q-primary);
}

/* miče automatki razmak iznad sadržaja */
.q-page-container {
  padding-top: 0 !important;
}

/* footer */
.footer {
  background: var(--q-secondary);
  color: black;
  padding: 50px 100px;
  border-top: 30px solid var(--q-primary);
  margin-top: auto;
}

/* raspored unutar footera */
.footer-inner {
  display: flex;
  justify-content: space-between;
  gap: 60px;
  padding: 50px 60px 20px 10px;
  align-items: stretch;
}

/* stupac sa opisom tima */
.footer-about {
  flex: 2; /* više prostora nego drugi */
}

/* stil za sve stupce */
.footer-col {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 0 20px;
}

/* linija između stupaca */
.footer-col:not(:last-child) {
  border-right: 1px solid rgba(0, 0, 0, 0.3);
}

/* tekst opisa u footeru */
.footer-text {
  font-size: 14px;
  line-height: 1.5;
  color: black;
  max-width: 550px;
  font-weight: 400;
}

/* kontenjer sa linkovima navigacije */
.footer-nav {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 40px;
}

/* stupac sa linkovima navigacije */
.footer-nav-col {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 120px;
}

/* stil linkova u footeru */
.footer a {
  text-decoration: none;
  color: black;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
}

.footer a:hover {
  color: var(--q-primary);
}

/* ikone za društvene mreže */
.footer i {
  font-size: 20px;
  margin-right: 8px;
}

/* logo u footeru */
.logo-footer {
  height: 60px;
  width: 200px;
  margin-bottom: 10px;
  cursor: pointer;
}
</style>
