<script setup lang="ts">
import Header from '../components/HeaderComponent.vue';
</script>

<template>
  <div class="header-wrapper"><Header /></div>
  <main>
    123
  </main>
</template>

<style scoped lang="scss">
.header-wrapper {
  display: flex;
  justify-content: center;
}

main {
  display: flex;
  justify-content: center;
}

.label-wrapper {
  display: flex;
  justify-content: center;
  flex-direction: column;
  max-width: 1200px;
  margin-bottom: 140px;
}
</style>
