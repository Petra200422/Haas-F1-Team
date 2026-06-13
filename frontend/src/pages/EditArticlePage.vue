<template>
  <q-page class="article-page">
    <!-- pozadina sa dijegonalnom crtom -->
    <div class="article-background"></div>

    <!-- sekcija sa formom -->
    <div class="article-container">

      <!-- naslovi -->
      <div class="article-content">
        <h3>EDIT ARTICLE</h3>
        <h4>UPDATE INFORMATION</h4>

        <!-- forma za uređivanje sadržaja vijesti -->
        <q-form @submit.prevent="updateArticle" class="article-form">
          
          <!-- kratki naslvo -->
          <q-input v-model="form.short_title" label="Short title" outlined class="article-input" />

          <!-- dugi naslov -->
          <q-input v-model="form.long_title" label="Long title" outlined class="article-input" />

          <!-- sadržaj vijesti -->
          <q-input
            v-model="form.text"
            type="textarea"
            label="Text"
            outlined
            class="article-input"
          />

          <!-- slika profila -->
          <q-file
            v-model="imageProfile"
            label="Profile image"
            outlined
            accept="image/*"
            class="article-input"
            :display-value="form.image_profile || 'No file selected'"
          />

          <!-- header slika -->
          <q-file
            v-model="imageHeader"
            label="Header image"
            outlined
            accept="image/*"
            class="article-input"
            :display-value="form.image_header || 'No file selected'"
          />

          <!-- greška koja se prikazuje ako je problem kod učitavanja ili spremanja podataka -->
          <div v-if="error" class="article-error">
            {{ error }}
          </div>

          <!-- gumb za spremanje izmjena -->
          <q-btn
            type="submit"
            label="Update Article"
            color="primary"
            unelevated
            :loading="loading"
            class="article-btn"
          />
        </q-form>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute() // dohvaćanje trenutne rute izbog id article
const router = useRouter() // preusmjeravanje nakon uređivanja

const api_url = import.meta.env.VITE_API_URL // url backenda se dohvaća iz .env datoteke
const articleId = route.params.id // dohvaćanje id article iz rute

const token = localStorage.getItem('token') // token da se vidi je li admin prijavljen

const loading = ref(false)
const error = ref('') //spremanje poruke greške

// spremanje novih slika
const imageProfile = ref(null)
const imageHeader = ref(null)

// forma sa podatcima 
const form = ref({
  short_title: '',
  long_title: '',
  text: '',
  image_profile: '',
  image_header: '',
})

// Lfunkcija dohvaća postojeće podatke iz baze, upisuje ih u formu
const loadArticle = async () => {
  try {
    const res = await axios.get(`${api_url}/articles/${articleId}`)
    const data = res.data

    form.value.short_title = data.short_title
    form.value.long_title = data.long_title
    form.value.text = data.text
    form.value.image_profile = data.image_profile
    form.value.image_header = data.image_header
  } catch (err) {
    err.value = 'Error loading article'
  }
}

// funkcija šalje promijenjene podatke na backend, formData je zato sto forma ne može sadržavati slike
const updateArticle = async () => {
  loading.value = true
  error.value = ''

  try {
    const fd = new FormData()

    fd.append('short_title', form.value.short_title)
    fd.append('long_title', form.value.long_title)
    fd.append('text', form.value.text)

    // ako su odabne nove slike, mijenjaju se ako ako ne onda ostaju stare
    if (imageProfile.value) {
      fd.append('image_profile', imageProfile.value)
    }

    if (imageHeader.value) {
      fd.append('image_header', imageHeader.value)
    }

    // put ažurira podatke, šalje se token da se zna da je admin
    await axios.put(`${api_url}/articles/${articleId}`, fd, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    // vraćanje na popis svih vijesti
    router.push('/articles')
  } catch (err) {
    err.value = 'Update failed'
  } finally {
    loading.value = false
  }
}

// kada se učitava stranica, prikazuju se podatci o vijesti
onMounted(loadArticle)
</script>

<style scoped>
.article-page {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  padding-top: 150px;
}

/* dijegonalna pozadina */
.article-background {
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

/* dio sa formom da ide iznad pozadine */
.article-container {
  position: relative;
  z-index: 2;
  min-height: calc(100vh - 100px);
  display: flex;
  align-items: center;
  padding-left: 10%;
}

/* šiirna forme */
.article-content {
  width: 450px;
}

.article-content h3 {
  color: black;
  margin-bottom: 10px;
}

.article-content h4 {
  margin-top: 0;
  margin-bottom: 40px;
}

/* flex da bi polja bila jedno ispod druguog */
.article-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* boja polja */
.article-input {
  background: white;
}

/* gumb za spremanje */
.article-btn {
  width: 200px;
  height: 45px;
  margin-top: 10px;
  margin-bottom: 100px;
}

.article-error {
  color: #d32f2f;
  font-size: 14px;
}
</style>
