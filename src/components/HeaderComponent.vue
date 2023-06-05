<template>
<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <router-link to="/timeline" class="navbar-brand">Inicio</router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarText"
        aria-controls="navbarText"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarText">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link class="nav-link active" :to="`/profile/${userStore.person._sUsername}`">Perfil</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link active" to="/about">About</router-link>
          </li>
        </ul>
        <!-- <span class="navbar-text"> Navbar text with an inline element </span> -->
        <router-link to="/" tag="button">
          <button class="btn btn-outline-danger" @click="userStore.logout">Logout</button>
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useUserStore } from '@/store/UserStore.js';

const userStore = useUserStore();

</script>

<style scoped>



</style>
