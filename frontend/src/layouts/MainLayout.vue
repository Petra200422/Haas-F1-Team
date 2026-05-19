<template>
  
  <q-layout view="lHh Lpr lFf">

    <q-header class="nav">

      <div class="nav-inner">

        <router-link to="/">
        <img :src="logo" class="logo"/>
        </router-link>

        <div class="links">
          <q-btn flat to="/team" label="Team" class="nav-text"/>
          <q-btn flat to="/car" label="Car" class="nav-text"/>
          <q-btn flat to="/standings" label="Standings" class="nav-text"/>
          <q-btn flat to="/schedule" label="Schedule" class="nav-text"/>
          <q-btn flat to="/articles" label="Articles" class="nav-text"/>
          <q-btn flat to="/partners" label="Partners" class="nav-text"/>
          <q-btn flat to="/contact" label="Contact" class="nav-text"/>
        </div>

      </div>

    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer class="footer">

    <div class="footer-inner">
    <div class="footer-col footer-about">

        <router-link to="/">
        <img :src="logo" class="logo-footer"/>
        </router-link>

      <p class="footer-text">
        Haas F1 Team is focused on continuous development, teamwork, and improving performance both on and off the track. With a strong engineering base and clear long-term vision, the team is committed to building a more competitive future in Formula 1.
      </p>

    </div>

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
    <router-link to="/adminLogin">Admin</router-link>
  </div>

</div>

    <div class="footer-col footer-social">

      <a href="https://www.instagram.com/haasf1team/" target="_blank"><i class="fa-brands fa-instagram"></i>Instagram</a>
      <a href="https://www.facebook.com/haasf1team/" target="_blank"><i class="fa-brands fa-facebook"></i>Facebook</a>
      <a href="https://x.com/HaasF1Team" target="_blank"><i class="fa-brands fa-x-twitter"></i>Twitter</a>
      <a href="https://www.tiktok.com/@haasf1official" target="_blank"><i class="fa-brands fa-tiktok"></i>TikTok</a>
      <a href="https://www.youtube.com/c/haasf1team" target="_blank"><i class="fa-brands fa-youtube"></i>YouTube</a>

    </div>

  </div>

</q-footer>

  </q-layout>
</template>


<script setup>

import logo from 'src/assets/Logo-Navigacija.png'

</script>

<style scoped> 

/* navigacija */
.nav {
  background: white;
  position: sticky;
  top: 15px;
  margin: 15px 55px 0 55px;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.12);
}

.nav-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 30px;
}

.links {
  display: flex;
  gap: 5px;
}

.nav-text {
  text-transform: none;
  font-size: medium;
  color: black;
  font-weight: 600;
}

.nav-text:hover {
  color: var(--q-primary);
}

:deep(.q-focus-helper) {
  display: none;
}

.logo {
  height: 55px;
  width: auto;
  cursor: pointer;
  padding: 5px;
}


/* footer */
.footer {
  background: var(--q-secondary);
  color: black;
  padding: 50px 100px;
  border-top: 30px solid var(--q-primary);
}

.footer-inner {
  display: flex;
  justify-content: space-between;
  gap: 60px;
  padding: 50px 40px 20px 40px;
  align-items: stretch;
}

.footer-about {
  flex: 2;
}

.footer-col {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 0 20px;
}

.footer-col:not(:last-child) {
  border-right: 1px solid rgba(0, 0, 0, 0.3);
}

.footer-text {
  font-size: 14px;
  line-height: 1.5;
  color: black;
  max-width: 550px;
}

.footer-nav {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 40px;
}

.footer-nav-col {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 120px;
}

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

.footer i {
  font-size: 20px; 
  margin-right: 8px;
}

.logo-footer {
  height: 60px;
  width: 200px;
  margin-bottom: 10px;
  cursor: pointer;
}
</style>