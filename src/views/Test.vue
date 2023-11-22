<template>
    <SidebarFinal></SidebarFinal>
</template>

<script setup>
import SidebarFinal from '@/components/SidebarFinal.vue'
</script>

<!-- 
    VERSION ANTIGUA SIDEBAR

    <template>
        <div id="sidebar" class="sidebar" @mouseenter="waitForRender" @mouseleave="bShow = false">
            <font-awesome-icon icon="fa-solid fa-bars" size="2xl" color="white" class="m-2 p-2"/>
            <ul class="list-unstyled m-2 mt-4" v-show="bShow">
                <li v-for="route in userRoutes">
                    <div class="row mt-2 p-2 option" @mouseenter="route.color = 'rgb(103, 73, 238)'" @mouseleave="route.color = 'white'"
                    @click="router.push(route.route)">
                        <div class="col-md-2">
                            <font-awesome-icon :icon="route.icon" size="xl" :color="route.color"/>
                        </div>
                        <div class="col-md-10">
                            {{ route.name }}
                        </div>
                    </div>
                </li>
            </ul>
            <div class="row mt-4 option p-1" v-show="bShow"
             @mouseenter="logoutColor = 'rgb(103, 73, 238)'" @mouseleave="logoutColor = 'white'" @click="userStore.logout">
             <div class="row d-flex justify-content-center">
                 <font-awesome-icon icon="fa-solid fa-right-from-bracket" size="xl" :color="logoutColor" class="ms-2"/>
                </div>
                <div class="row d-flex justify-content-center">
                    Cerrar sesión
                </div>
            </div>
        </div>
</template>
    
<script setup>

import { useUserStore } from '@/store/UserStore.js';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();

let userRoutes = ref([
  {name: 'Inicio', route: '/timeline', icon: "fa-solid fa-house", color: 'white'},
  {name: 'Ver perfil', route: '/profile/' + userStore.person._sUsername, icon: "fa-solid fa-user", color: 'white'},
  {name: 'Explorar eventos', route: '/events/explore', icon: "fa-solid fa-calendar", color: 'white'},
  {name: 'Descubrir personas', route: '/discover', icon: "fa-solid fa-people-robbery", color: 'white'},
  {name: 'Mensajes privados', route: '/messages', icon: "fa-solid fa-message", color: 'white'},

]);

let logoutColor = ref('white');

let bTriggerLogoutPopup = ref(false);
let bShow = ref(false);

function waitForRender() {
    setTimeout(() => {
        bShow.value = true;
    }, 500);
}
</script>

<style scoped>

.blackb {
    border: solid 3px black;
}

.sidebar {
    position: absolute;
    left: 0;
    top: 0;
    height: 100vh;
    width: 75px;
    background-color: rgb(103, 73, 238);
    transition-duration: 500ms;
    transition-property: width;
    transition-timing-function: ease-out;
    color: white;
    opacity: 0.4;
    z-index: 98;
}


.sidebar:hover {
    width: 350px;
    opacity: 1;
}

.option:hover {
    background-color: white;
    color: rgb(103, 73, 238);
    cursor: pointer;
}

.btn-logout {
    border: solid 1px white;
    background-color: white;
    border-radius: 5px;
}
</style>
 -->