<template>
    <header-component></header-component> 
    <div class="container" v-if="!bIsFetching">
        <div v-if="event._iId === 0">
            <h2 class="mt-4 ms-2 fw-formal">El evento no existe</h2>
        </div>
        <div v-else>
            <div class="row mt-4">
                <h3 class="fw-formal fw-bold">{{ event._sTitle }}</h3>
                <div class="hline"></div>
                <div class="row">
                    <div class="col-md-3 bg-contrast p-2 m-2 blackb">
                        <div class="row mt-2">
                            <div class="col-md-4 mt-1">
                                <router-link :to="'/profile/' + event._organizer._sUsername" style="text-decoration: none; color: inherit;">
                                    <img class="avatar ms-4" :src="'http://localhost:8000/api/getProfileImage/' + event._organizer._iId"/>
                                </router-link>
                            </div>
                            <div class="col-md-8 mt-2">
                                <div class="row">
                                    Organizador:
                                </div>
                                <div class="row">
                                    <p class="fw-bold">{{ event._organizer._sUsername }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                <div class="col-md-8 d-flex align-items-center justify-content-end" v-if="userStore.person._iId != event._organizer._iId">
                    <button type="button" class="btn btn-outline-primary me-5" v-if="!bIsAssistant" @click="setAssist">Participar</button>
                    <button type="button" class="btn btn-primary me-5" v-else @click="setAssist">No participar</button>
                </div>
            </div>
        </div>
        <div class="row mt-4">
            <div class="col-md-7 p-3 bg-contrast">
                <img class="event-img" v-if="eventImage != null" :src="'http://localhost:8000/api/getEventHeaderImage/' + event._iId">
                <h5 class="fw-formal">Descripción</h5>
                <div class="hline"></div>
                <p class="mt-3 text-block">{{ event._sDescription }}</p>
            </div>
            <div class="col-md-1"></div>
            <div class="col-md-4">
                <div class="row p-2 bg-contrast">
                    <h5 class="fw-formal">Datos del evento</h5>
                    <div class="hline"></div>
                    <div class="row mt-4">
                        <div class="d-flex justify-content-start">
                            <font-awesome-icon icon="fa-solid fa-calendar" class="mt-1"/>
                            <p class="ms-2">{{ event._tCelebrationHour }}</p>
                        </div>
                    </div>
                    <div class="row mt-2">
                        <div class="d-flex justify-content-start">
                            <font-awesome-icon icon="fa-solid fa-clock" class="mt-1"/>
                            <p class="ms-2">{{ moment(event._tCelebratedAt).format('D-M-YYYY') }}</p>
                        </div>
                    </div>
                    <div class="row mt-2">
                        <div class="d-flex justify-content-start">
                            <font-awesome-icon icon="fa-solid fa-location-dot" class="mt-1"/>
                            <!-- <router-link :to="'https://maps.google.com/?q=' + event._location._latitude + ',' + event._location._longitude">
                                <p class="ms-2 location-link">{{ event._location._sName }}</p>
                            </router-link> -->
                            <a class="ms-2"
                            target="_blank"
                            :href="'https://maps.google.com/?q=' + event._location._fLatitude + ',' + event._location._fLongitude">{{ event._location._sName }}
                        </a>
                    </div>
                </div>
            </div>
            <div class="row mt-5 p-2 bg-contrast clickable" @click="router.push('/events/' + event._iId + '/assistants')">
                <h5 class="fw-formal">Asistentes</h5>
                <div class="hline"></div>
                <div class="row">
                    <ul class="list-unstyled mt-2">
                        <li v-for="url in aAssistantProfileImages" style="display: inline" class="ms-2">
                            <img :src="url" alt="" class="avatar" />
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</div>
</div>
</template>


<script setup>

import HeaderComponent from '@/components/HeaderComponent.vue';
import { useUserStore } from '@/store/UserStore';
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from "vue-router";
import moment from 'moment';

const userStore = useUserStore();
const route = useRoute();
const router = useRouter();
const event = ref(null);
let bIsFetching = ref(true);
let eventHeaderImage = ref(null);
let aAssistantIds = ref([]);
let aAssistantProfileImages = ref([]);
let bIsAssistant = ref(false);

onMounted(() => {
    axios.get("http://localhost:8000/api/getEvent/" + route.params.eventId)
    .then(response => {
        event.value = response.data;
        console.log(response.data)
        bIsFetching.value = false;
        console.log(event.value._tCelebrationHour)
        axios.get("http://localhost:8000/api/getEventAssistantIds/" + event.value._iId)
        .then(response => {
            aAssistantIds.value = response.data.slice(0, 5); // 5 primeros usuarios
            aAssistantIds.value.forEach(iId => aAssistantProfileImages.value.push("http://localhost:8000/api/getProfileImage/" + iId));
            if(response.data.some((iId) => iId === userStore.person._iId))
                bIsAssistant.value = true;
        }) 
    })

})



function setAssist() {
    axios.patch("http://localhost:8000/api/setAssist/" + event.value._iId + "/" + userStore.person._iId)
    .then(response => {
        bIsAssistant.value = response.data;
        if(bIsAssistant.value == false) {
            let iIndex = aAssistantProfileImages.value.indexOf("http://localhost:8000/api/getProfileImage/" + userStore.person._iId);
            aAssistantProfileImages.value.splice(iIndex, 1);
        } else {
            aAssistantProfileImages.value.push("http://localhost:8000/api/getProfileImage/" + userStore.person._iId);
        }
    })
}

</script>

<style scoped>

.hline {
    border-bottom: solid 1px #777;
}

.text-block {
    white-space: pre; 
}

.clickable:hover {
    cursor: pointer;
}

.event-img {
    max-height: 400px;
    min-height: 400px;
    width: auto;
    height: 100%;
    object-fit: contain;
}

.avatar {
    border-radius: 50%;
    width: 50px;
    height: 50px;
}

.bg-contrast {
    background-color: rgb(245, 245, 245);
}

.location-link {
    color: blue;
}

.blackb {
    border: solid 1px black;
}

</style>