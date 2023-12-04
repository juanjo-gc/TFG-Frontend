<template>
    <div id="header" class="row header">
        <!-- Logo pagina centrado -->
    </div>
        <font-awesome-icon icon="fa-solid fa-bars" size="2xl" color="black" class="m-2 p-2 hamburger"/>
    <div id="sidebar" class="sidebar">
        <font-awesome-icon icon="fa-solid fa-bars" size="2xl" color="white" class="m-2 p-2" style="cursor: pointer" id="togglerIn"/>
        <ul class="list-unstyled m-2 mt-4" v-show="bShow">
            <li v-for="route in aFinalRoutes">
                <div class="row mt-2 py-2 option" @mouseenter="route.color = 'rgb(103, 73, 238)'"
                    @mouseleave="route.color = 'white'" @click="router.push(route.route)">
                    <div class="col-md-2">
                        <font-awesome-icon :icon="route.icon" size="xl" :color="route.color" />
                    </div>
                    <div class="col-md-10">
                        {{ route.name }}
                    </div>
                </div>
            </li>
        </ul>
        <div class="row mt-4 option p-1" v-show="bShow" @mouseenter="logoutColor = 'rgb(103, 73, 238)'"
            @mouseleave="logoutColor = 'white'" @click="userStore.logout">
            <div class="row">
                <font-awesome-icon icon="fa-solid fa-right-from-bracket" size="xl" :color="logoutColor" style="justify-self: center;" />
            </div>
            <div class="row">
                <p class="text-center ms-2">Cerrar sesión</p>
            </div>
        </div>
    </div>
    <div id="bg" class="bg-dark-lowop"></div>
</template>

<script setup>

import { useUserStore } from '@/store/UserStore.js';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();

let togglerIn = null;
let sidebar = null;
let bg = null;


let aUserRoutes = ref([
    { name: 'Inicio', route: '/timeline', icon: "fa-solid fa-house", color: 'white' },
    { name: 'Ver perfil', route: '/profile/' + userStore.person._sUsername, icon: "fa-solid fa-user", color: 'white' },
    { name: 'Explorar eventos', route: '/events/explore', icon: "fa-solid fa-calendar", color: 'white' },
    { name: 'Descubrir personas', route: '/discover', icon: "fa-solid fa-people-robbery", color: 'white' },
    { name: 'Mensajes privados', route: '/messages', icon: "fa-solid fa-message", color: 'white' },
    {name: 'Ayuda', route: '/help', icon:'fa-regular fa-circle-question', color: 'white'}
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

let bTriggerLogoutPopup = ref(false);
let bShow = ref(false);
let bToggleSidebar = ref(false);

onMounted(() => {
    togglerIn = document.getElementById('togglerIn');
    sidebar = document.getElementById('sidebar');
    bg = document.getElementById('bg');
    togglerIn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        bg.classList.toggle('bg-appear');
        setTimeout(() => {
            bShow.value = !bShow.value;
        }, 100);
    })
    bg.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        bg.classList.toggle('bg-appear');
        setTimeout(() => {
            bShow.value = !bShow.value;
        }, 100);
    })
})

// function waitForRender() {
//     // bToggleSidebar.value = !bToggleSidebar.value;
//     document.getElementById('sidebar').style;
//     setTimeout(() => {
//         bShow.value = !bShow.value;
//         console.log(bShow.value)
//     }, 500);
// }
</script>

<style scoped>
.blackb {
    border: solid 3px black;
}

.hamburger {
    position: fixed;
    left: 0;
    top: 0;
    cursor: pointer;
    z-index: 98;
}

.sidebar {
    position: fixed;
    padding: 0px;
    margin: 0px;
    left: 0;
    top: 0;
    height: 100vh;
    width: 0px;
    background-color: rgb(103, 73, 238);
    transition-duration: 400ms;
    transition-property: width, opacity;
    transition-timing-function: ease-out;
    /* transition: width, opacity 200ms;
transition-timing-function: ease-out; */
    color: white;
    opacity: 0;
    z-index: 98;
}

.open {
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
    background-color: rgb(103, 73, 238);
    z-index: 98;
}

.option:hover {
    background-color: white;
    max-width: 375px;
    color: rgb(103, 73, 238);
    cursor: pointer;
}
</style>