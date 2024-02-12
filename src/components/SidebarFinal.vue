<template>
    <div id="header" class="row header" v-if="userStore.person._sRole === 'User'">
        <!-- Logo pagina centrado -->
        <!-- <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYPDUsQO5SwBdbNHuK3C68gjESyeNFGie1xg&usqp=CAU" class="logo" alt=""> -->
        <img src="https://static.vecteezy.com/system/resources/previews/009/343/883/original/half-orange-orange-free-png.png" alt="" class="logo mt-1 clickable" @click="router.push('/timeline')">
    </div>
    <div class="hamburger-wrapper">
        <font-awesome-icon icon="fa-solid fa-bars" size="2xl" color="black" class="m-2 p-2 pe-3 pb-3" />
    </div>
    <div id="sidebar" class="sidebar">
        <font-awesome-icon icon="fa-solid fa-bars" size="2xl" color="white" class="m-2 p-2" style="cursor: pointer"
            id="togglerIn" />
        <ul class="list-unstyled me-0 ms-2 mt-4" v-show="bShow">
            <li v-for="route in aFinalRoutes">
                <div class="row mt-2 py-2 option" @mouseenter="route.color = '#FF8C00'"
                    @mouseleave="route.color = 'white'" @click="router.push(route.route)">
                    <div class="col-md-2">
                        <font-awesome-icon :icon="route.icon" size="xl" :color="route.color" />
                    </div>
                    <div class="col-md-10">
                        <span> {{ route.name }}</span>
                        <!-- <div class="new-notif-wrapper" v-if="route.name === 'Notificaciones' && iNewNotifications > 0"> -->
                        <span class="bg-light px-2 ms-2 rounded" style="color: #FF8C00;"
                            v-if="route.name === 'Notificaciones' && iNewNotifications > 0">{{ iNewNotifications }}</span>
                        <!-- </div> -->
                    </div>
                </div>
            </li>
        </ul>
        <div class="row mt-4 option p-1" v-show="bShow" @mouseenter="logoutColor = '#FF8C00'"
            @mouseleave="logoutColor = 'white'" @click="setLogout">
            <div class="row">
                <font-awesome-icon icon="fa-solid fa-right-from-bracket" size="xl" :color="logoutColor"
                    style="justify-self: center;" />
            </div>
            <div class="row">
                <p class="text-center ms-2">Cerrar sesión</p>
            </div>
        </div>
    </div>
    <div id="bg" class="bg-dark-lowop"></div>
    <Popup v-if="bTriggerLogout">
        <div class="d-flex justify-content-center">
            <div class="w-50">
                <h5 class="text-center mb-2">Estás a punto de desconectarte</h5>
                <p class="fw-light text-center">Estás seguro/a de que quieres cerrar sesión?</p>
                <div class="row">
                    <div class="col-md-6">
                        <button type="button" class="btn btn-danger float-end" @click="userStore.logout()">
                            Cerrar sesión
                        </button>
                    </div>
                    <div class="col-md-6">
                        <button type="button" class="btn btn-primary float-start ms-4" @click="bTriggerLogout = false;">
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </Popup>
</template>

<script setup>

import { useUserStore } from '@/store/UserStore.js';
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Popup from './Popup.vue';

const userStore = useUserStore();
const router = useRouter();

let togglerIn = null;
let sidebar = null;
let bg = null;


let aUserRoutes = ref([
    { name: 'Inicio', route: '/timeline', icon: "fa-solid fa-house", color: 'white' },
    { name: 'Ver perfil', route: '/profile/' + userStore.person._sUsername, icon: "fa-solid fa-user", color: 'white' },
    { name: 'Notificaciones', route: '/notifications', icon: "fa-solid fa-bell", color: 'white' },
    { name: 'Explorar eventos', route: '/events/explore', icon: "fa-solid fa-calendar", color: 'white' },
    { name: 'Descubrir personas', route: '/users/explore', icon: "fa-solid fa-people-robbery", color: 'white' },
    { name: 'Mensajes privados', route: '/messages', icon: "fa-solid fa-message", color: 'white' },
    { name: 'Ayuda', route: '/help', icon: 'fa-regular fa-circle-question', color: 'white' }
]);

let aAdminRoutes = ref([
    { name: 'Panel de administración', route: '/admin/dashboard', icon: "fa-solid fa-table-columns", color: 'white' },
    { name: 'Gestión de contenido', route: '/admin/manage/content', icon: "fa-solid fa-plus-minus", color: 'white' },
    { name: 'Gestión de usuarios', route: '/admin/manage/users', icon: "fa-solid fa-user", color: 'white' },
    { name: 'Gestión de tickets', route: '/admin/tickets', icon: "fa-solid fa-ticket", color: 'white' },
    { name: 'Ver operaciones', route: '/adminOperations', icon: "fa-solid fa-list", color: 'white' },
])

let aFinalRoutes = ref(userStore.person._sRole === 'User' ? aUserRoutes.value : aAdminRoutes.value);

let logoutColor = ref('white');

let bShow = ref(false);
let bToggleSidebar = ref(false);
let bTriggerLogout = ref(false);

let iNewNotifications = ref(0);

onMounted(() => {
    
    togglerIn = document.getElementById('togglerIn');
    sidebar = document.getElementById('sidebar');
    bg = document.getElementById('bg');
    togglerIn.addEventListener('click', () => {
        sidebar.classList.toggle('open-h');
        sidebar.classList.toggle('open-w');
        bg.classList.toggle('bg-appear');
        setTimeout(() => {
            bShow.value = !bShow.value;
        }, 100);
    })
    bg.addEventListener('click', () => {
        sidebar.classList.toggle('open-h');
        sidebar.classList.toggle('open-w');
        bg.classList.toggle('bg-appear');
        setTimeout(() => {
            bShow.value = !bShow.value;
        }, 100);
    })
    axios.get("http://localhost:8000/api/countNewNotifications/" + userStore.person._iId)
        .then(response => iNewNotifications.value = response.data);
})

function updateUsername(sUsername) {
    console.log("Se cambia username")
    aUserRoutes.value[1].route = '/profile/' + sUsername;
}

function setLogout() {
    sidebar.classList.remove('open-h');
    sidebar.classList.remove('open-w');
    bg.classList.remove('bg-appear');
    bShow.value = !bShow.value;
    bTriggerLogout.value = true;
}

defineExpose({setLogout})

</script>

<style scoped>
.blackb {
    border: solid 3px black;
}

.popup-logout {
    position: absolute;
    background-color: white;
    top: 50%;
    height: 20vh;
    width: 50vw;
}

.hamburger-wrapper {
    position: fixed;
    left: 0;
    top: 0;
    cursor: pointer;
    z-index: 98;
    background-color: #FF8C00;
    /* background-color: rgb(103, 73, 238); */
    border-bottom-right-radius: 50%;
    /* width: 3vw; */
}

.sidebar {
    position: fixed;
    padding: 0px;
    margin: 0px;
    left: 0;
    top: 0;
    /* height: 100vh; */
    height: 0px;
    width: 0px;
    /* background-color: rgb(103, 73, 238); */
    background-color: #FF8C00;
    transition-duration: 400ms;
    transition-property: width, height opacity;
    transition-timing-function: ease-out;
    /* transition: width, opacity 200ms;
transition-timing-function: ease-out; */
    color: white;
    opacity: 0;
    z-index: 98;
    border-bottom-right-radius: 50%;
}

.open-h {
    height: 100vh;
    opacity: 1;
    border-bottom-right-radius: 0;
}

.open-w {
    width: 375px;
    opacity: 1;
}

.bg-dark-lowop {
    position: fixed;
    left: 0;
    top: 0;
    background-color: black;
    opacity: 0;
    width: 0px;
    height: 100vh;
    transition-duration: fade 400ms;
    transition-property: width, opacity;
    z-index: 50;
}

.bg-appear {
    opacity: 0.4;
    width: 100%;
}

.header {
    position: static;
    top: 0;
    width: 100%;
    height: 65px;
    /* background-color: rgb(103, 73, 238); */
    z-index: 98;
    justify-content: center;
}

.new-notif-wrapper {
    border: solid 1px white;
    margin-left: 5px;
    padding: 3px;
}

.option:hover {
    background-color: white;
    max-width: 375px;
    color: #FF8C00;
    /* color: rgb(103, 73, 238); */
    cursor: pointer;
}

.logo {
    object-fit: contain;
    height: 65px;
    max-height: 65px;
    width: auto;
}

</style>