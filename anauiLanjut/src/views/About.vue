<template>
  <div class="about-page">
    <div class="about-header">
      <h1>About Gatherly</h1>
      <p>Building the future of event experiences, one community at a time.</p>
    </div>

    <div class="mission-block">
      <h2>Our Mission</h2>
      <p>
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem
        accusantium doloremque laudantium.
      </p>
    </div>
  </div>
</template>

<style scoped>
.about-page {
  max-width: 900px;
  margin: 0 auto;
  padding-top: 2.5rem;
  color: var(--text-dark, #1d1d3b);
}

.about-header {
  background: rgba(255, 255, 255, 0.96);
  border-radius: 20px;
  padding: 4.5rem 2.5rem 4rem;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

.about-header h1 {
  font-size: clamp(2.8rem, 4vw, 5rem);
  letter-spacing: -0.05em;
  color: #1d1d3b;
  font-weight: 400;
  margin: 0 0 1.5rem;
  line-height: 1.12;
}

.about-header p {
  font-size: clamp(1.05rem, 1.5vw, 1.5rem);
  color: #4f5369;
  line-height: 1.6;
  max-width: 760px;
  margin: 0 auto;
}

.mission-block {
  margin-top: 3.2rem;
  padding: 0 0.2rem;
}

.mission-block h2 {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #1d1d3b;
  font-size: clamp(1.8rem, 2vw, 2.4rem);
  font-weight: 500;
  margin-bottom: 1.2rem;
}

.mission-block h2::before {
  content: '';
  display: inline-block;
  width: 22px;
  height: 4px;
  border-radius: 2px;
  background: #6c63ff;
}

.mission-block p {
  color: rgba(29, 29, 59, 0.8);
  line-height: 1.9;
  font-size: 1.1rem;
  max-width: 800px;
}
</style>