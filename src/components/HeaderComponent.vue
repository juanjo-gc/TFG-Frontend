<template>
<!-- <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
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
        <span class="navbar-text"> Navbar text with an inline element </span>
        <router-link to="/" tag="button">
          <button class="btn btn-outline-danger" @click="userStore.logout">Logout</button>
        </router-link>
      </div>
    </div>
  </nav> -->
  
<!-- 
<div class="hamburger-menu">
    <input id="menu__toggle" type="checkbox" />
    <label class="menu__btn mt-4" for="menu__toggle" @click="bDeploy = true">
      <span></span>
    </label>

    <ul class="menu__box">
      <li><a class="menu__item" href="#">Home</a></li>
      <li><a class="menu__item" href="#">About</a></li>
      <li><a class="menu__item" href="#">Team</a></li>
      <li><a class="menu__item" href="#">Contact</a></li>
      <li><a class="menu__item" href="#">Twitter</a></li>
    </ul>
  </div> -->

  <!-- <div class="navigation blackb">
        <button class="hamburger" @click="show()">
            <div id="bar1" class="bar"></div>
            <div id="bar2" class="bar"></div>
            <div id="bar3" class="bar"></div>
        </button>

        <nav>
            <ul>
                <li><a>Home</a></li>
                <li><a>About</a></li>
                <li><a>Blog</a></li>
                <li><a>Contact</a></li>
            </ul>
        </nav>

    </div> -->
    <!-- <button type="button" class="btn btn-primary" @click="show = !show" v-if="!show">Abrir</button>
    <transition name="slide-menu">
    <div v-show="show" class="slideLayer">
      <div class="side_menu">
        <h3>Hello Menu</h3>
        <button type="button" class="btn btn-primary" @click="show = !show" v-if="show">Cerrar</button>
        <ul>
          <li>one</li>
          <li>two</li>
          <li>three</li>
        </ul>
      </div>
    </div>
  </transition> -->




  

<div class="page">
  <!-- <header tabindex="0">Header</header> -->
  <div id="nav-container">
    <div class="bg"></div>
    <div class="row">
        <div class="button" tabindex="0">
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </div>
    </div>
    <div id="nav-content" tabindex="0">
      <ul class="list-unstyled">
        <li v-for="link in userRoutes">
          <div class="link mt-2">
            <p class="p-2 fs-light">{{ link.name }}</p>
          </div>
        </li>
        <!-- <li><a href="#0">Home</a></li>
        <li><a href="#0">Services</a></li>
        <li><a href="#0">Blog</a></li>
        <li><a href="#0">About</a></li>
        <li><a href="#0">Contact</a></li> -->
        <div class="small" @click="userStore.logout">
          <p class="p-2">Cerrar sesión</p>
        </div>
      </ul>
    </div>
  </div>
  </div>




</template>

<script setup>
import { useUserStore } from '@/store/UserStore.js';
import { ref } from 'vue';

const userStore = useUserStore();
const userRoutes = [
  {name: 'Inicio', route: '/timeline'},
  {name: 'Ver perfil', route: '/profile/' + userStore.person._sUsername},
  {name: 'Explorar eventos', route: '/events/explore'},
  {name: 'Explorar eventos', route: '/events/explore'},
  {name: 'Descubrir personas', route: '/discover'},
  {name: 'Mensajes privados', route: '/messages'},
]

// function show(){
//     document.querySelector('.hamburger').classList.toggle('open')
//     document.querySelector('.navigation').classList.toggle('active')
// }

</script>

<style scoped>

.blueb {
  border: solid 5px blue;
}

.link:hover {
  background-color: #000;
  color: white;
  cursor: pointer;
  transition: 0.2s ease-out;
}

.logout:hover {
  cursor: pointer;
  background-color: rgb(136, 1, 1);
  width: 50%;
  height: 50px;
}

/* .slide-menu-enter-active {
  transform: translate(275px, 0);
  -webkit-transform: translate(275px, 0);
  transform: translate(0, 0);
  -webkit-transform: translate(0, 0);
}

.slide-menu-leave-active {
  transform: translate(275px, 0);
  -webkit-transform: translate(275px, 0);
} */

.slide-menu-enter-from {
  -webkit-transform: translateX(275px);
  transform: translateX(275px);

}

.slideLayer {
  position: fixed;
  top: 0;
  left: 0;
  width: 275px;
  height: 100%;
  z-index: 98;
  background-color: #eef0f3;
  transition: all 0.2s ease-in-out 0s;
  -webkit-transition: all 0.2s ease-in-out 0s;
}







.dark {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 98;
  background-color: #000000;
  opacity: 0.5;
}

.menu {
  background-color: rgb(51, 51, 51);
  width: 450px;
  height: 20px;
}

.v-enter-active, .v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}


@import url('https://fonts.googleapis.com/css?family=Encode+Sans+Condensed:400,600');

* {
  outline: none;
}

strong {
  font-weight: 600;
}

.page {
  /* width: 100%;
  height: 100vh; */
  background: #fdfdfd;
  font-weight: 600;
  letter-spacing: .03em;
  color: #212121;
  z-index: 100;
}

/* header {
  display: flex;
  position: fixed;
  width: 100%;
  height: 70px;
  background: #212121;
  color: #fff;
  justify-content: center;
  align-items: center;
  -webkit-tap-highlight-color: rgba(0,0,0,0);
} */

main {
  padding: 70px 20px 0;
  display: flex;
  flex-direction: column;
  height: 100%;
}

main > div {
  margin: auto;
  max-width: 600px;
}

main h2 span {
  color: #BF7497;
}

main p {
  line-height: 1.5;
  font-weight: 200;
  margin: 20px 0;
}

main small {
  font-weight: 300;
  color: #888;
}

#nav-container {
  position: fixed;
  height: 100vh;
  width: 100%;
  pointer-events: none;
  z-index: 100;

}
#nav-container .bg {
  position: absolute;
  top: 70px;
  left: 0;
  width: 100%;
  height: calc(100% - 70px);
  visibility: hidden;
  opacity: 0;
  transition: .3s;
  background: #000;
  
}
#nav-container:focus-within .bg {
  visibility: visible;
  opacity: .6;
}
#nav-container * {
  visibility: visible;
}

.button {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  z-index: 100;
  -webkit-appearance: none;
  border: 0;
  background: transparent;
  border-radius: 0;
  height: 70px;
  width: 60px;
  cursor: pointer;
  pointer-events: auto;
  margin-left: 25px;
  touch-action: manipulation;
  -webkit-tap-highlight-color: rgba(0,0,0,0);
}
.icon-bar {
  display: block;
  width: 100%;
  height: 3px;
  background: #aaa;
  transition: .3s;
}
.icon-bar + .icon-bar {
  margin-top: 5px;
}

#nav-container:focus-within .button {
  pointer-events: none;
}
#nav-container:focus-within .icon-bar:nth-of-type(1) {
  transform: translate3d(0,8px,0) rotate(45deg);
}
#nav-container:focus-within .icon-bar:nth-of-type(2) {
  opacity: 0;
}
#nav-container:focus-within .icon-bar:nth-of-type(3) {
  transform: translate3d(0,-8px,0) rotate(-45deg);
}

#nav-content {
  margin-top: 70px;
  padding: 20px;
  width: 90%;
  max-width: 300px;
  position: absolute;
  top: 0;
  left: 0;
  height: calc(100% - 70px);
  background: #ececec;
  pointer-events: auto;
  -webkit-tap-highlight-color: rgba(0,0,0,0);
  transform: translateX(-100%);
  transition: transform .3s;
  will-change: transform;
  contain: paint;
}

#nav-content ul {
  height: 100%;
  display: flex;
  flex-direction: column;
}

#nav-content li a {
  padding: 10px 5px;
  display: block;
  text-transform: uppercase;
  transition: color .1s;
}

#nav-content li a:hover {
  color: #BF7497;
}

#nav-content li:not(.small) + .small {
  margin-top: auto;
}

.small {
  display: flex;
  align-self: center;
}

.small a {
  font-size: 12px;
  font-weight: 400;
  color: #888;
}
.small a + a {
  margin-left: 15px;
}

#nav-container:focus-within #nav-content {
  transform: none;
}

</style>
