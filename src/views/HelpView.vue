<template>
    <SidebarFinal v-if="userStore.person._iId != null"></SidebarFinal>
    <div class="container">
        <h3 class="mt-4">Ayuda</h3>
        <div class="hline"></div>
        <div class="row mt-4">
            <h4 class="mt-2 text-center">Preguntas frecuentes</h4>
            <p class="mt-2 text-center">A continuación se describen las preguntas y respuestas a las dudas más frecuentes que les surgen a nuestros usuarios.</p>
                <MDBAccordion v-model="activeItem" class="mt-2">
                    <MDBAccordionItem v-for="(FAQ, index) in aFAQs" :headerTitle="FAQ._sQuestion" :collapseId="'faq' + index">
                        <strong>{{ FAQ._sAnswer }}</strong>
                    </MDBAccordionItem>
                </MDBAccordion>
        </div>
        <div class="row mt-4" v-if="userStore.person._sRole === 'User'">
            <div class="row">
                <p class="fs-6 text-center">¿No encuentras solución a tu problema? Ponte en contacto con nuestro soporte técnico e intentaremos ayudarte de la mejor manera posible.</p>
                <div class="col-md-4"></div>
                <div class="col-md-4 d-flex justify-content-center">
                    <button type="button" class="btn btn-primary w-75 p-2" @click="router.push('/help/newTicket')">Contactar</button>
                </div>
                <div class="col-md-4"></div>
            </div>
            <div class="row">
                <p class="fs-6 text-center mt-4">Para ver las consultas activas con alguno de nuestros administradores, pulsa en el botón de abajo.</p>
                <div class="col-md-4"></div>
                <div class="col-md-4 d-flex justify-content-center">
                    <button type="button" class="btn btn-primary w-75 p-2" @click="router.push('/help/myTickets')">Tickets</button>
                </div>
                <div class="col-md-4"></div>
            </div>
        </div>
    </div>
</template>

<script setup>

import SidebarFinal from '@/components/SidebarFinal.vue';
import { useUserStore } from '@/store/UserStore';
import axios from 'axios';
import { MDBAccordion, MDBAccordionItem } from "mdb-vue-ui-kit";
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();
let activeItem = ref('');
let aFAQs = ref([]);

onMounted(() => {
    axios.get(userStore.baseAPIurl + "getAllFAQs")
    .then(response => aFAQs.value = response.data);
})

</script>


<style scoped>

.blackb { border: solid 1px black; }
.hline {
    border-bottom: solid 1px black;
}
</style>