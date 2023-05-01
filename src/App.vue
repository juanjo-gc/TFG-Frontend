<script setup>
  import { ref } from 'vue';
import HeaderComponent from './components/HeaderComponent.vue';
  let auth = ref(false)

</script>

<template>
  <div class="main">
    <header-component v-if="auth"></header-component>
    <RouterView />
  </div>
</template>

<style>
#app {
  /* font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center; */
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
