<template>
  <q-page class="contact-page">

    <!-- HERO -->
    <section class="hero-section">

      <h4>HOW TO GET IN TOUCH WITH</h4>
      <h3>TGR HAAS F1 TEAM</h3>

      <p class="intro-text">
        TGR Haas F1 Team operates across multiple international locations,
        bringing together engineering, management, and race operations.
        Each facility plays an important role in supporting the team
        throughout the Formula 1 season.
      </p>

    </section>

    <q-separator color="primary" />

    <!-- HEADQUARTERS -->
    <section class="section">

      <h4>HEADQUARTERS</h4>
      <h3>ADDRESSES</h3>

      <div class="address-grid">

        <q-card flat class="address-card">
          <q-card-section>

            <h5>America</h5>

            <p>
              4001 Haas Way<br>
              Kannapolis<br>
              28081, NC, USA
            </p>

          </q-card-section>
        </q-card>

        <q-card flat class="address-card">
          <q-card-section>

            <h5>United Kingdom</h5>

            <p>
              Haas Racing<br>
              Overthorpe Road<br>
              Banbury<br>
              OX16 4PN, UK
            </p>

          </q-card-section>
        </q-card>

        <q-card flat class="address-card">
          <q-card-section>

            <h5>Italy</h5>

            <p>
              43040 Varano de' Melegari (PR)<br>
              Via Papa Giovanni XXIII 2/d, IT
            </p>

          </q-card-section>
        </q-card>

      </div>

    </section>

    <q-separator color="primary" />

    <!-- PARTNERSHIPS -->
    <section class="section alternate">

      <h4>NEW</h4>
      <h3>PARTNERSHIPS</h3>

      <p>
        For queries about becoming a partner of TGR Haas F1 Team,
        please contact our Business Development team:
      </p>

      <a
        class="contact-link"
      >
        partnerships@haas.com
      </a>

    </section>

  </q-page>
</template>

<style scoped>

.contact-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 140px 40px 80px;
}

.hero-section {
  margin-bottom: 60px;
  margin-top: 80px;
}

h4 {
  margin-bottom: 10px;
}

h3 {
  margin-top: 0;
  margin-bottom: 40px;
  color: black;
}

.intro-text {
  max-width: 800px;
  font-size: 18px;
  line-height: 1.7;
}

/* PRIMARY SEPARATOR */
.q-separator {
  height: 3px;
}

/* SECTIONS */
.section {
  padding: 60px 0;
}

/* SECONDARY BACKGROUND */
.alternate {
  padding: 80px 40px 60px 40px;
  color: white;
}

.address-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
  margin-top: 30px;
}

/* SECONDARY CARDS */
.address-card {
  background: var(--q-accent);
  height: 100%;
  box-shadow: 0 4px 25px rgba(0,0,0,0.1);
}

/* DRŽAVA */
.address-card h5 {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 15px;
  color: rgb(0, 0, 0);
}

.faq-item {
  margin-bottom: 40px;
}

.faq-item h5 {
  margin-bottom: 10px;
}

p {
  line-height: 1.7;
}

.contact-link {
  color: var(--q-primary);
  text-decoration: none;
  font-weight: 600;
}

</style>