<script setup>
import MiniaturesList from '../components/MiniatureList.vue'
</script>

<script>
export default {
  components: {
    MiniaturesList,
  },
}
</script>

<template>
  <div>
    <h1 class="welcome-text">Welcome to Pathfinder3D!</h1>
    <div class="welcome-description">Here you can buy various miniatures for Pathfinder TTRPG</div>
    <MiniaturesList />
  </div>
</template>

<style scoped>
.welcome-text,
.welcome-description {
  width: 100%;
  text-align: center;
}

.welcome-description {
  font-size: 1.3rem;
  margin-bottom: 1rem;
}
</style>
