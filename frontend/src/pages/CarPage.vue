<template>
  <q-page class="car-page">

    <!-- HERO -->
    <div class="car-hero">

      <img src="src/assets/Header-Car.jpg" class="car-hero-img" />

        <div class="hero-overlay"></div>
      <div class="car-hero-text">
        <h1>VF-26</h1>
        <h2>DESIGNED FOR SPEED</h2>
      </div>

    </div>

    <!-- SPECS TABLE -->
    <div class="car-specs">

      <div
        class="spec-row"
        v-for="(item, index) in specs"
        :key="index"
        :class="{ alt: index % 2 === 1 }"
      >

        <div class="spec-left">
          {{ item.label }}
        </div>

        <div class="spec-right">
          {{ item.value }}
        </div>

      </div>

    </div>

    <!-- GALLERY -->
<section class="team-gallery">

  <h4 class="gallery-subtitle">GET A CLOSER LOOK</h4>
  <h3 class="gallery-title">AT OUR CAR</h3>

  <!-- ARROWS -->
  <div class="gallery-arrows">

    <div class="arrow-box" @click="prevGallery">
      <i class="fas fa-chevron-left"></i>
    </div>

    <div class="arrow-box" @click="nextGallery">
      <i class="fas fa-chevron-right"></i>
    </div>

  </div>

  <!-- SLIDER -->
  <div class="gallery-wrapper">

    <div class="gallery-track"
         :style="{ transform: `translateX(-${galleryIndex * 100}%)` }">

      <div class="gallery-group"
           v-for="(group, gIndex) in groupedGallery"
           :key="gIndex">

        <div class="gallery-item" v-for="img in group" :key="img">

          <img :src="getAssetImage(img)" />

        </div>

      </div>

    </div>

  </div>

</section>

  </q-page>
</template>

<script setup>
import { ref, computed  } from 'vue'

const galleryIndex = ref(0)

const gallery = [
  '01-Car.jpg',
  '02-Car.jpg',
  '03-Car.jpg',
  '04-Car.jpg',
  '05-Car.jpg',
  '06-Car.jpg',
  '07-Car.jpg',
  '08-Car.jpg'
]

// assets loader
const getAssetImage = (file) => {
  return new URL(`../assets/${file}`, import.meta.url).href
}

// grupiranje po 2
const groupedGallery = computed(() => {
  const groups = []
  for (let i = 0; i < gallery.length; i += 2) {
    groups.push(gallery.slice(i, i + 2))
  }
  return groups
})

const nextGallery = () => {
  if (galleryIndex.value < groupedGallery.value.length - 1) {
    galleryIndex.value++
  }
}

const prevGallery = () => {
  if (galleryIndex.value > 0) {
    galleryIndex.value--
  }
}

const specs = [
  { label: 'Power Unit', value: 'Ferrari O67, turbocharged 1.6 liter V-6 Hybrid' },
  { label: 'Chassis Material', value: 'Carbon-fiber and honeycomb composite structure' },
  { label: 'Bodywork Material', value: 'Carbon-fiber' },
  { label: 'Front & Rear Suspension', value: 'Independent suspension' },
  { label: 'Dampers', value: 'ZF Sachs / Öhlins' },
  { label: 'Steering', value: 'Ferrari' },
  { label: 'Transmission', value: 'Ferrari servo-controlled hydraulic limited-slip differential with semi-automatic sequential and electronically-controlled gearbox, quick shift (eight gears, plus reverse)' },
  { label: 'Clutch', value: 'AP Racing' },
  { label: 'Brake System', value: 'Carbon self-ventilating Brembo brake discs (front and rear), monobloc calipers in nickel-plated aluminum alloy (front and rear) and Brembo tandem master cylinder (with action on front and rear). Electronic control hydraulic system for the rear brakes (Brake by Wire).' },
  { label: 'Cockpit Instrumentation', value: 'Ferrari' },
  { label: 'Seatbelts', value: 'Sabelt' },
  { label: 'Steering Wheel', value: 'Ferrari' },
  { label: 'Driver’s Seat', value: 'Carbon-fiber construction, molded to driver’s contours' },
  { label: 'Wheels', value: 'BBS' },
  { label: 'Tires', value: 'Pirelli P-ZERO' },
  { label: 'Fuel Cell', value: 'ATL' },
  { label: 'Fuel Provider', value: 'Shell' },
  { label: 'Overall Width', value: '1,900 mm' },
  { label: 'Weight', value: '770 kg (with driver)' }
]
</script>

<style>
.car-hero {
  position: relative;
  width: 100%;
  margin-top: -90px;
}

.car-hero-img {
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

.car-hero-text {
  position: absolute;
  right: 55px;
  bottom: 60px;
  text-align: right;
  z-index: 2;
}

.car-hero-text h1 {
  margin: 0;
}


/* TABLE */
.car-specs {
  padding: 120px 220px;
}

.spec-row {
  display: flex;
  justify-content: space-between;
  padding: 18px 25px;
}

.spec-row.alt {
  background: var(--q-secondary);
}

.spec-left {
  font-weight: 600;
  font-size: 16px;
}

.spec-right {
  max-width: 60%;
  text-align: left;
  font-size: 16px;
  flex: 1;
}

.team-gallery {
  padding: 80px 70px;
}

.gallery-subtitle {
  margin: 0;
}

.gallery-title {
  margin-top: 5px;
}

/* ARROWS */
.gallery-arrows {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin: 20px 0 40px 0;
}

/* STRELICA - pravokutna */
.arrow-box {
  width: 55px;
  height: 32px;
  background: var(--q-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 0.25s ease;
  border: 1px solid var(--q-primary);
}

/* hover efekt */
.arrow-box:hover {
  background: transparent;
  border: 1px solid var(--q-primary);
}

.arrow-box i {
  color: white;
  transition: 0.25s ease;
}

/* hover -> strelica postaje primary */
.arrow-box:hover i {
  color: var(--q-primary);
}

/* WRAPPER */
.gallery-wrapper {
  overflow: hidden;
}

/* TRACK */
.gallery-track {
  display: flex;
  transition: transform 0.5s ease;
}

/* GROUP */
.gallery-group {
  display: flex;
  gap: 40px;
  min-width: 100%;
}

/* 2 slike */
.gallery-item {
  width: calc((100% - 40px) / 2);
}

.gallery-item img {
  width: 100%;
  height: auto;
  object-fit: contain;
  display: block;
  box-shadow: 0 4px 25px rgba(0,0,0,0.10);
}
</style>