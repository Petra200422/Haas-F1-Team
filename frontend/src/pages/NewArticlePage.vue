<template>
  <q-page class="article-page">

    <div class="article-background"></div>

    <div class="article-container">

      <div class="article-content">

        <h3>NEW ARTICLE</h3>
        <h4>INSERT INFORMATIONS</h4>

        <q-form @submit.prevent="submitArticle" class="article-form">

          <q-input
            v-model="form.short_title"
            label="Short title"
            outlined
            class="article-input"
          />

          <q-input
            v-model="form.long_title"
            label="Long title"
            outlined
            class="article-input"
          />

          <q-input
            v-model="form.text"
            type="textarea"
            label="Text"
            outlined
            class="article-input"
          />

          <q-input
            v-model="form.published_at"
            type="date"
            label="Published date"
            outlined
            class="article-input"
          />

          <q-file
            v-model="imageProfile"
            label="Profile image"
            outlined
            accept="image/*"
            class="article-input"
          />

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

const router = useRouter()
const api_url = import.meta.env.VITE_API_URL

const loading = ref(false)
const error = ref('')

const imageProfile = ref(null)
const imageHeader = ref(null)

// 🔐 TOKEN IZ LOCALSTORAGE
const token = localStorage.getItem('token')

// FORM DATA
const form = ref({
  short_title: '',
  long_title: '',
  text: '',
  published_at: ''
})


// SUBMIT
const submitArticle = async () => {
  loading.value = true
  error.value = ''

  try {
    const fd = new FormData()

    fd.append('short_title', form.value.short_title)
    fd.append('long_title', form.value.long_title)
    fd.append('text', form.value.text)
    fd.append('published_at', form.value.published_at)

    if (imageProfile.value) {
      fd.append('image_profile', imageProfile.value)
    }

    if (imageHeader.value) {
      fd.append('image_header', imageHeader.value)
    }

    await axios.post(`${api_url}/articles`, fd, {
      headers: {
        'Authorization': `Bearer ${token}` // 🔥 BITNO
        // ❗ NE STAVLJAJ Content-Type RUČNO - axios to sam riješi za FormData
      }
    })

    router.push('/articles')

  } catch (err) {
    console.error(err)
    error.value =
      err.response?.data?.message || 'Error creating article'
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

.article-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.article-input {
  background: white;
}

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