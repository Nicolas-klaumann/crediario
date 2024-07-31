<template>
  <HomeView />
</template>

<script>
import HomeView from './views/HomeView.vue'

export default {
  name: 'App',
  components: {
    HomeView
  }
}
</script>

<style>
#app {
  font-family: Open Sans  (800);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  background-color: rgb(0, 97, 81);
  overflow-y: auto; /* Permite rolagem vertical */
}
</style>
