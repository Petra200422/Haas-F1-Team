<template>
  <q-page class="login-page">
    <!-- pozadina sa dijegonalnom crtom -->
    <div class="background-split"></div>

      <!-- glavni dio gdje se nalazi forma -->
    <div class="login-container">
      <div class="login-content">
        <h3>EDIT THE HAAS GRID</h3>
        <h4>ADMINISTRATION PANEL</h4>

        <!-- forma za prijavu admina -->
        <q-form @submit.prevent="submitForm" class="login-form">
          <!-- korisničko ime -->
          <q-input v-model="username" label="Username" outlined class="form-input" />
          
          <!-- lozinka -->
          <q-input v-model="password" label="Password" type="password" outlined class="form-input" />

          <!-- poruka za grešku koja se prikazuje ako prijava nije uspješna -->
          <div v-if="error" class="error-message">
            {{ error }}
          </div>

          <!-- gumb za slanje podataka forme -->
          <q-btn type="submit" label="Login" color="primary" unelevated  :loading="loading" class="login-btn" />
        </q-form>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()

const api_url = import.meta.env.VITE_API_URL //url apija se dohvaća iz .evn datoteke

// rekativne varijable za unos korisničkog imena i lozinke
const username = ref('')
const password = ref('')

const loading = ref(false)
const error = ref('') //sprema poruku greške

//funkcija za prijavu, poziva se nakon slanja forme
const submitForm = async () => {
  loading.value = true
  error.value = ''

  // šalje se post zahtjev backendu koji provjerava podatke
  try {
    const res = await axios.post(`${api_url}/admin/login`, {
      username: username.value,
      password: password.value,
    })

    // token se sprema u locak storage, kasnije se koristi za prikaz dijelova koje samo admin vidi
    localStorage.setItem('token', res.data.token)

    // podatci o adminu se spremaju u local storage, role admin se koristi za prikaz admin opcija
    localStorage.setItem(
      'user',
      JSON.stringify({
        id: res.data.admin.id_admin,
        username: res.data.admin.username,
        role: 'admin',
      }),
    )

    // šalje se event kako bi aplikacija znala da je admin prijavljen
    window.dispatchEvent(new Event('admin-login'))

    // nakon uspješne prijave, preusmjerava se na početnu stranicu
    router.push('/')
  } catch (err) {
    // ako prijava nije uspješna ide poruka o grešci
    error.value = err.response?.data?.message || 'Login failed'
  } finally {
    loading.value = false //loading se gasi bez obzira je li prijava uspjela ili ne
  }
}
</script>

<style scoped>
/* cijela stranica */
.login-page {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

/* dijagonalna podjela pozadine, lijevo bijelo a desno crveno */
.background-split {
  position: absolute;
  inset: 0;

  background: linear-gradient(
    115deg,
    white 0%,
    white 55%,
    var(--q-primary) 55%,
    var(--q-primary) 100%
  );
}

/* dio sa formom */
.login-container {
  position: relative;
  z-index: 2;
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding-left: 10%;
}

/* šiirna sadržaja forme */
.login-content {
  width: 450px;
}

/* naslov */
.login-content h3 {
  color: black;
  margin-bottom: 10px;
}

/* podnaslov */
.login-content h4 {
  margin-top: 0;
  margin-bottom: 50px;
}

/* flex kako bi polja bila jedno ispod drugog */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-input {
  background: white;
}

/* stil gumba za prijavu */
.login-btn {
  width: 180px;
  height: 45px;
  margin-top: 10px;
}

/* poruka greške */
.error-message {
  color: #d32f2f;
  font-size: 14px;
}
</style>
