<template>
  <q-page v-if="article">

    <!-- HERO -->
    <div class="hero-section">

      <img
        :src="getImage(article.image_header)"
        class="hero-image"
      />

      <div class="hero-overlay"></div>

      <div class="hero-text">
        <h1>{{ article.short_title }}</h1>
        <h2>LATEST NEWS</h2>
      </div>

    </div>

    <!-- ARTICLE -->
    <div class="article-content">

      <h4>FIND OUT MORE</h4>

      <h3>
        {{ article.long_title }}
      </h3>

      <div class="article-date">
        {{
          new Date(article.published_at)
            .toLocaleDateString('en-GB')
        }}
      </div>

      <div class="article-text">
       <p> {{ article.text }} </p>
      </div>

       <div
  v-if="isAdmin"
  class="admin-actions"
>

  <router-link
    :to="`/editArticle/${article.id_article}`"
    class="admin-btn edit-btn"
  >
    EDIT ARTICLE
  </router-link>

  <button
    @click="deleteArticle"
    class="admin-btn delete-btn"
  >
    DELETE ARTICLE
  </button>

</div>

    </div>

    


  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()

const article = ref(null)

const api_url = import.meta.env.VITE_API_URL

const getImage = (path) => {
  if (!path) return ''
  return `${api_url}/${encodeURI(path)}`
}

const loadArticle = async () => {
  try {

    const res = await axios.get(
      `${api_url}/articles/${route.params.id}`
    )

    article.value = res.data

  } catch (err) {
    console.error(err)
  }
}


const isAdmin = ref(false)

const checkAdmin = () => {
  const user = JSON.parse(localStorage.getItem('user'))

  if (user && user.role === 'admin') {
    isAdmin.value = true
  }
}

const deleteArticle = async () => {

  if (!confirm('Delete this article?')) return

  try {

    await axios.delete(
      `${api_url}/articles/${route.params.id}`
    )

    // nakon brisanja → redirect
    router.push('/articles')

  } catch (err) {
    console.error(err)
  }
}

onMounted(() => {
  loadArticle()
  checkAdmin()
})
</script>

<style scoped>

/* HERO */
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
    rgba(0,0,0,0.85) 0%,
    rgba(0,0,0,0.55) 35%,
    rgba(0,0,0,0) 65%
  );
}

.hero-text {
  position: absolute;
  left: 60px;
  bottom: 60px;
  z-index: 2;
  text-transform: uppercase;
}


/* CONTENT */
.article-content {
  max-width: 900px;
  margin: 120px auto;
  padding: 0 30px;
}

.article-content h4 {
  margin-bottom: 10px;
}

.article-content h3 {
  margin-bottom: 15px;
  color: black;
}

.article-date {
  font-size: 14px;
  color: #777;
  margin-bottom: 50px;
}

.article-text {
  text-align: justify;
  line-height: 1.8;
  white-space: pre-line;
}

.admin-actions {
  display: flex;
  gap: 15px;
  margin-top: 50px;
  margin-bottom: 50px;
}

.admin-btn {
  padding: 12px 22px;
  border: none;
  text-decoration: none;
  cursor: pointer;
  color: white;
  background: var(--q-primary);
  font-size: 14px;
  font-weight: 500;
  transition: 0.2s;
}

.admin-btn:hover {
  opacity: 0.85;
}

</style>