<template>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">


  <q-page class="home-page">

    <div class="hero-section">

      <img src="src/assets/Header-Home.jpg" class="hero-image" />

      <div class="hero-overlay"></div>

      <div class="hero-text">

        <h1>TGR HAAS F1 TEAM</h1>

        <h2>FORMULA 1 TEAM</h2>

      </div>

    </div>

  
      <div class="about-card">

        <h3>
          An American Formula 1 team driven by engineering excellence.
        </h3>

        <p>
          TGR Haas F1 Team represents American determination and engineering excellence at the highest level of motorsport – Formula 1. Founded by entrepreneur Gene Haas, the team made its debut in 2016 and quickly became part of the competitive Formula 1 paddock.
        </p>

        <p>
          Today, the team enters a new chapter as TGR Haas F1 Team through a major partnership with Toyota and its motorsport division Toyota Gazoo Racing. This collaboration strengthens the team’s technical capabilities and supports its ongoing pursuit of performance and innovation.
        </p>

      </div>

<!-- DRIVERS SECTION -->
<div class="drivers-section">

  <!-- NASLOVI -->
  <div class="drivers-header">

    <h4>GET TO KNOW</h4>
    <h3>OUR FORMULA 1 DRIVERS</h3>

  </div>

  <!-- DRIVERS GRID -->
  <div class="drivers-grid">

    <!-- DRIVER 1 -->
    <div class="driver-card">

      <img src="src/assets/Profile-Ollie.jpg" class="driver-img" />

      <div class="driver-text">
        <p>#87</p>
        <p>Ollie Bearman</p>
      </div>

    </div>

    <!-- DRIVER 2 -->
    <div class="driver-card">

      <img src="src/assets/Profile-Esteban.jpg" class="driver-img" />

      <div class="driver-text">
        <p>#31</p>
        <p>Esteban Ocon</p>
      </div>

    </div>

  </div>

</div>

  </q-page>

</template>

<script setup>
</script>

<style scoped>

/* stranica */
.home-page {
  background: #ffffff;
}

/* dio sa slikom na vrhu */
.hero-section {
  position: relative;
  width: 100%;
  margin-top: -90px;
}

.hero-image {
  display: block;
  width: 100%;
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


/* naslovi na slici*/
.hero-text {
  position: absolute;
  z-index: 2;
  left: 60px;
  bottom: 60px;
}

.hero-text h1 {
  margin-bottom: 0;
  line-height: 1;
}

.hero-text h2 {
  margin-top: 10px;
  line-height: 1;
}

/* odlomak sa tekstom */
.about-card {
  padding: 150px 430px;
  justify-content: center;
  text-align: justify;
}

/* dio za vozacima */

.drivers-header {
  margin-left: 55px;
}

.drivers-header h4 {
  margin-bottom: 0;
  line-height: 1;
}

.drivers-header h3 {
  margin-top: 10px;
  line-height: 1;
}


.drivers-grid {
  display: flex;
  margin: 70px 200px;
}

.driver-card {
  position: relative;
  flex: 1;
}

.driver-img {
  width: 80%;
  display: block;
}

.driver-text {
  position: absolute;
  top: 20px;
  left: 20px;
  color: white;
}

</style>
