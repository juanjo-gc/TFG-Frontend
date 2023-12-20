<template>
<div class="col-links">
<ul class="list-unstyled" style="margin-top: 100px;">
    <li v-for="route in aUserRoutes">
        <div class="row mt-2 ms-1 me-1 px-4 border rounded-pill">
            <span class="py-1 px-2">{{ route.name }}</span>
        </div>
    </li>
</ul>
</div>
</template>
    

<script setup>
import { useUserStore } from '@/store/UserStore';
import { ref } from 'vue';

const userStore = useUserStore();

let aUserRoutes = ref([
    { name: 'Inicio', route: '/timeline', icon: "fa-solid fa-house", color: 'white' },
    { name: 'Ver perfil', route: '/profile/' + userStore.person._sUsername, icon: "fa-solid fa-user", color: 'white' },
    { name: 'Explorar eventos', route: '/events/explore', icon: "fa-solid fa-calendar", color: 'white' },
    { name: 'Descubrir personas', route: '/discover', icon: "fa-solid fa-people-robbery", color: 'white' },
    { name: 'Mensajes privados', route: '/messages', icon: "fa-solid fa-message", color: 'white' },
    {name: 'Ayuda', route: '/help', icon:'fa-regular fa-circle-question', color: 'white'}
]);

</script>


<style scoped>

.col-links {
    /* position: fixed; */
    /* min-height: 100vh; */
    /* width: 15vw; */
}

</style>