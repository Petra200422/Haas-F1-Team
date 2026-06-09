<template>
  <q-page class="login-page">
    <div class="background-split"></div>

    <div class="login-container">
      <div class="login-content">
        <h3>EDIT THE HAAS GRID</h3>
        <h4>ADMINISTRATION PANEL</h4>

        <q-form @submit.prevent="submitForm" class="login-form">
          <q-input v-model="username" label="Username" outlined class="form-input" />

          <q-input
            v-model="password"
            label="Password"
            type="password"
            outlined
            class="form-input"
          />

          <div v-if="error" class="error-message">
            {{ error }}
          </div>

          <q-btn
            type="submit"
            label="Login"
            color="primary"
            unelevated
            :loading="loading"
            class="login-btn"
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

const username = ref('')
const password = ref('')

const loading = ref(false)
const error = ref('')

const submitForm = async () => {
  loading.value = true
  error.value = ''

  try {
    const res = await axios.post(`${api_url}/admin/login`, {
      username: username.value,
      password: password.value,
    })

    // 🔥 SPREMI TOKEN (OVO TI FALI)
    localStorage.setItem('token', res.data.token)

    // SPREMI USER
    localStorage.setItem(
      'user',
      JSON.stringify({
        id: res.data.admin.id_admin,
        username: res.data.admin.username,
        role: 'admin',
      }),
    )

    // obavijesti app
    window.dispatchEvent(new Event('admin-login'))

    router.push('/')
  } catch (err) {
    error.value = err.response?.data?.message || 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

/* dijagonalna podjela */
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

.login-container {
  position: relative;
  z-index: 2;

  min-height: 100vh;

  display: flex;
  align-items: center;

  padding-left: 10%;
}

.login-content {
  width: 450px;
}

.login-content h3 {
  color: black;
  margin-bottom: 10px;
}

.login-content h4 {
  margin-top: 0;
  margin-bottom: 50px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-input {
  background: white;
}

.login-btn {
  width: 180px;
  height: 45px;
  margin-top: 10px;
}

.error-message {
  color: #d32f2f;
  font-size: 14px;
}
</style>
