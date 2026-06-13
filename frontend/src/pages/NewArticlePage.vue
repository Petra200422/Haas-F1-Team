<template>
  <q-page class="article-page">
    <div class="article-background"></div>

    <!-- sekcija sa formom --> 
    <div class="article-container">
      <div class="article-content">
        <h3>NEW ARTICLE</h3>
        <h4>INSERT INFORMATION</h4>

        <!-- forma za unos nove vijesti --> 
        <q-form @submit.prevent="submitArticle" class="article-form">

          <!-- kratki naslov --> 
          <q-input v-model="form.short_title" label="Short title" outlined class="article-input" />

          <!-- duži naslov --> 
          <q-input v-model="form.long_title" label="Long title" outlined class="article-input" />

          <!-- sadržaj vijesti --> 
          <q-input
            v-model="form.text"
            type="textarea"
            label="Text"
            outlined
            class="article-input"
          />

          <!-- datum vijesti --> 
          <q-input
            v-model="form.published_at"
            type="date"
            label="Published date"
            outlined
            class="article-input"
            :max="today"
          />

          <!-- slika profila -->
          <q-file
            v-model="imageProfile"
            label="Profile image"
            outlined
            accept="image/*"
            class="article-input"
          />

          <!-- header slika -->
          <q-file
            v-model="imageHeader"
            label="Header image"
            outlined
            accept="image/*"
            class="article-input"
          />

          <div v-if="error" class="article-error">
            {{ error }}
          </div>

          <!-- gumb za kreiranje nove vijesti -->
          <q-btn
            type="submit"
            label="Create Article"
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
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter() // za preusmjeravanje nakon kreiranja vijesti
const api_url = import.meta.env.VITE_API_URL // url backedn apija iz .env datoteke

const loading = ref(false) //označava ako traja slanje forme
const error = ref('') //sprema poruku greške

// varijable za slike koje admin unosi
const imageProfile = ref(null)
const imageHeader = ref(null)

// token koji provjerava admina
const token = localStorage.getItem('token')

// današnji datum se koristi kao maksimalan dopušten datum objave
const today = new Date().toISOString().split('T')[0]

// objekt forme sa podatcima nove vijesti
const form = ref({
  short_title: '',
  long_title: '',
  text: '',
  published_at: '',
})

// funkcija kreira novu vijesti, formData se kroisti jer se šalju i slike
const submitArticle = async () => {
  loading.value = true
  error.value = ''

  try {
    const fd = new FormData()

    fd.append('short_title', form.value.short_title)
    fd.append('long_title', form.value.long_title)
    fd.append('text', form.value.text)
    fd.append('published_at', form.value.published_at)

    // slike se dodaju samo ih je admin odabrao
    if (imageProfile.value) {
      fd.append('image_profile', imageProfile.value)
    }

    if (imageHeader.value) {
      fd.append('image_header', imageHeader.value)
    }

    // post zahtjev šalje novu vijest na backend
    await axios.post(`${api_url}/articles`, fd, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    // nakon unosa vijesti vodi na stranicu sa svim vijestima
    router.push('/articles')
  } catch (err) {
    console.error(err)
    error.value = err.response?.data?.message || 'Error creating article'
  } finally {
    loading.value = false
  }
}
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

/* dio sa formom koji ide iznad pozadine */
.article-container {
  position: relative;
  z-index: 2;
  min-height: calc(100vh - 100px);
  display: flex;
  align-items: center;

  padding-left: 10%;
}

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

/* forma, flex da idu polja jedno ispod drugog */
.article-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* polje za unos */
.article-input {
  background: white;
}

/* gumb za unos */
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
