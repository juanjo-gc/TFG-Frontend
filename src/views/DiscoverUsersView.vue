<template>
<SidebarFinal></SidebarFinal>
<div class="container" v-if="!bIsFetching">

        <div class="mt-3 text-center">
            <h3>Descubrir personas</h3>
        </div>
        <div class="row mt-3">
            <div class="col-md-3 ms-5">
                <h5 class="fw-bold">Filtros</h5>
                <div class="mt-3">
                    <p>Intereses en común</p>
                    <ul class="list-unstyled" v-if="userStore.person._setInterests.length != 0">
                        <li v-for="interest in userStore.person._setInterests">
                            <input type="checkbox" :value="interest._sName" v-model="aCheckedInterests"> <span
                                class="small text-muted">{{ interest._sName }}</span>
                        </li>
                    </ul>
                    <div class="col-6" v-else>
                        <p class="text-muted">Selecciona al menos un interés para poder usar el filtro</p>
                    </div>
                    <p>País</p>
                    <select v-model="sSelectedCountry">
                        <option :value="null">Cualquiera</option>
                        <option v-for="country in aCountries" :value="country._sName">{{ country._sName }}</option>
                    </select>
                    <p class="mt-3">Comunidad Autónoma</p>
                    <select v-model="sSelectedRegion">
                        <option :value="null">Cualquiera</option>
                        <option v-for="region in aRegions" :value="region._sName">{{ region._sName }}</option>
                    </select>
                    <p class="mt-3">Provincia</p>
                    <select v-model="sSelectedProvince">
                        <option :value="null">Cualquiera</option>
                        <option v-for="province in aProvinces" :value="province._sName">{{ province._sName }}</option>
                    </select>
                </div>
                <button type="button" class="btn btn-primary mt-3" @click="sendInterestsFilter">Filtrar</button>
            </div>
            <div class="col-md-6 rounded-border m-4" v-if="aiUserIds.length != 0 || currentPerson != null">
                <div class="text-center" v-if="aPhotos.length === 0">
                    <img class="user-img img-fluid rounded m-3"
                        src="https://icon-library.com/images/no-photo-available-icon/no-photo-available-icon-20.jpg">
                </div>
                <Swiper :modules="[Navigation, Pagination, Scrollbar, A11y]" :slides-per-view="1" :space-between="700"
                    :centered-slides="true" :loop="true" :pagination="{ clickable: true }" :navigation="{ enabled: true }"
                    v-else>
                    <SwiperSlide v-for="photo in aPhotos">
                        <div class="text-center">
                            <img :src="photo" class="user-img img-fluid rounded m-3" :alt="photo">
                        </div>
                    </SwiperSlide>
                </Swiper>

                <div class="card mt-2 mb-2">
                    <div class="card-body">
                        <div class="row">
                            <h4 class="card-title">{{ currentPerson._sName }}</h4>
                        </div>
                        <div class="row">
                            <p class="card-text">@{{ currentPerson._sUsername }}</p>
                            <ul class="list-group list-group-horizontal" style="list-style-type: none">
                                <li class="litem" v-for="interest in currentPerson._setInterests" :key="interest._iId">
                                    {{ interest._sName }}
                                </li>
                            </ul>
                        </div>
                        <p class="card-text small text-muted mt-3">{{ currentPerson._sDescription }}</p>
                        <div class="row">
                            <div class="col-sm-4 text-center">
                                <button type="button" class="btn btn-outline-danger" title="Descartar" @click="proccessDiscardOrFollow(false)">
                                    <font-awesome-icon icon="fa-solid fa-xmark" size="2xl" />
                                </button>
                            </div>
                            <div class="col-sm-4 text-center">
                                <router-link :to="`/profile/${currentPerson._sUsername}`" tag="button">
                                    <button type="button" class="btn btn-outline-dark" title="Ver perfil">
                                        <font-awesome-icon icon="fa-solid fa-eye" size="2xl" />
                                    </button>
                                </router-link>
                                
                            </div>
                            <div class="col-sm-4 text-center">
                                <button type="button" class="btn btn-outline-primary" title="Seguir" @click="proccessDiscardOrFollow(true)">
                                    <font-awesome-icon icon="fa-solid fa-user-plus" size="2xl" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-6 rounded-border m-4" v-else>
                <h4 class="text-center mt-5">No hay nuevos usuarios disponibles ahora mismo :&#40;</h4>
                <p class="text-center">Prueba a cambiar el filtro o espera unos días.</p>
                <div class="row">
                    <div class="col-sm-1"></div>
                    <div class="col-sm-10">
                        <div class="text-center">
                            <img src="https://img.freepik.com/premium-vector/sad-dog_161669-74.jpg?w=2000" class="user-img img-fluid rounded m-3" alt="">
                        </div>
                    </div>
                </div>
            </div>

            <div class="col md-3">
                <p class="small text-muted mt-5 text-center">¿No aparece ningún resultado? Pulsa aquí para que vuelvan a
                    aparecer usuarios que ya se han mostrado</p>
                <div class="text-center">
                    <button type="button" class="btn btn-primary mt-2 float-center"
                        @click="userStore.aiShownUserIds = []">Limpiar</button>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
import SidebarFinal from '@/components/SidebarFinal.vue'
import { useUserStore } from '@/store/UserStore';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { nextTick, onMounted, ref, watch } from 'vue';

import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

const userStore = useUserStore();
const router = useRouter();
let bIsFetching = ref(true);
let currentPerson = ref(null);
let currentId = ref(-1);
let aCheckedInterests = ref([]);
let aCountries = ref([]);
let aRegions = ref([]);
let aProvinces = ref([]);
let aPhotos = ref([]);
let aiUserIds = ref([]);
// let sSelectedProvince = ref(userStore.person._province._sName);
// let sSelectedRegion = ref(userStore.person._province._region._sName);
// let sSelectedCountry = ref(userStore.person._province._region._country._sName);
let sSelectedProvince = ref(null);
let sSelectedRegion = ref(null);
let sSelectedCountry = ref(null);
let iShownUsers = 0;
let iPageNumber = 0;
let iTotalPages = 1;


onMounted(() => {
    aCountries.value.push(userStore.person._province._region._country); //findall para este valor inicial
    setUserIds();
    axios.get("http://localhost:8000/api/getCountryRegions/" + userStore.person._province._region._country._iId)
        .then(response => aRegions.value = response.data)
        .catch(error => console.log(error));

    axios.get("http://localhost:8000/api/getRegionProvinces/" + userStore.person._province._region._iId)
        .then(response => aProvinces.value = response.data)
        .catch(error => console.log(error));

    
    while(currentId === -1)
        bIsFetching.value = true;
    bIsFetching.value = false;
})

function setUserIds() {
    axios.post("http://localhost:8000/api/filterUsers/" + userStore.person._iId + "/" + iPageNumber, {
        asInterests: [],
        sCountry: sSelectedCountry.value,
        sRegion: sSelectedRegion.value,
        sProvince: sSelectedProvince.value
    })
        .then(response => {
            console.log(response.data)
            iTotalPages = response.data.totalPages;
            aiUserIds.value = response.data.content;
            const tDateToday = new Date();
            if (Math.abs(tDateToday - userStore.tUpdatedUsersToShow) / 1000 * 60 * 60 * 24 * 7 >= 1) { // Si la diferencia entre dos fechas es mayor o igual a una semana, refresca
                userStore.tUpdatedUsersToShow = tDateToday;
                userStore.aiShownUserIds = [];
                aiUserIds.value = response.data;
            } else {
                aiUserIds.value.filter(iId => !userStore.aiShownUserIds.some(iExcludedId => iExcludedId === iId));
            }
            if (aiUserIds.value.length != 0) {
                do {
                    currentId.value = aiUserIds.value[Math.floor(Math.random() * aiUserIds.value.length)];
                } while (currentId.value === userStore.person._iId);
                setCurrentPersonData();
            }
        })
}



function setCurrentPersonData() {
    iShownUsers++;
    console.log("CurrentId en setperson: " + currentId.value)
    userStore.aiShownUserIds.push(currentId.value)
    aiUserIds.value.splice(aiUserIds.value.indexOf(currentId.value), 1);
    axios.get("http://localhost:8000/api/getUser/" + currentId.value)
        .then(response => {
            currentPerson.value = response.data;
            console.log(currentPerson.value)
            axios.get("http://localhost:8000/api/getImageNames/" + currentPerson.value._iId)
                .then(response => {
                    response.data.forEach(userImage => {
                        aPhotos.value.push("http://localhost:8000/api/getImage/" + userImage._sName);
                    })
                })
                .catch(error => console.log(error));
            axios.get("http://localhost:8000/api/getUserInterests/" + currentId.value)
                .then(response => currentPerson._setInterests = response.data)
                .catch(error => console.log(error))
        })
        .catch(error => console.log(error));
    if(iShownUsers >= 10) {
        iPageNumber++;
        setUserIds();
    }
}

function proccessDiscardOrFollow(bWantToFollow) {
    if(bWantToFollow) 
        axios.patch("http://localhost:8000/api/setFollow/" + userStore.person._iId + "/" + currentPerson.value._iId)
    currentPerson.value = null;
    aPhotos.value = [];
    if(aiUserIds.value.length != 0) {
        currentId.value = aiUserIds.value[Math.floor(Math.random() * aiUserIds.value.length)];
        setCurrentPersonData();
    }

}

function sendInterestsFilter() {
    iPageNumber = 0;
    axios.post("http://localhost:8000/api/filterUsers/" + userStore.person._iId + "/" + iPageNumber, {
        asInterests: aCheckedInterests.value,
        sCountry: sSelectedCountry.value,
        sRegion: sSelectedRegion.value,
        sProvince: sSelectedProvince.value
    })
        .then(response => {
            if (response.data.length != 0) {
                aiUserIds.value = response.data.content;
                iTotalPages = response.data.totalPages;
                aiUserIds.value = aiUserIds.value.filter(iId => !userStore.aiShownUserIds.some(iExcludedId => iId === iExcludedId));    // Elimina las ocurrencias de las ids filtradas con las que se han mostrado recientemente
                if(aiUserIds.value.length != 0) {
                    do {
                        currentId.value = aiUserIds.value[Math.floor(Math.random() * aiUserIds.value.length)];
                    } while (currentId.value === userStore.person._iId);
                    console.log("A la hora de filtrar: " + currentId.value)
                    setCurrentPersonData();
                }
            }
        })
}

watch(sSelectedCountry, (newsSelectedCountry, oldsSelectedCountry) => {
    nextTick(() => {
        sSelectedRegion.value = null;
        if (newsSelectedCountry != null) {
            const foundCountry = aCountries.value.find(country => newsSelectedCountry === country._sName);
            axios.get("http://localhost:8000/api/getCountryRegions/" + foundCountry._iId)
                .then(response => {
                    aRegions.value = response.data;
                })
                .catch(error => console.log(error));
        } else {
            aRegions.value = [];
        }
    })
})

watch(sSelectedRegion, (newsSelectedRegion, oldsSelectedRegion) => {
    nextTick(() => {
        sSelectedProvince.value = null;
        if (newsSelectedRegion != null) {
            const foundRegion = aRegions.value.find(region => newsSelectedRegion == region._sName);
            axios.get("http://localhost:8000/api/getRegionProvinces/" + foundRegion._iId)
                .then(response => {
                    aProvinces.value = response.data
                })
                .catch(error => console.log(error));
        } else {
            aProvinces.value = [];
        }
    })
})
</script>

<style scoped>
.user-img {
    max-height: 400px;
    min-height: 400px;
    width: auto;
    height: 100%;
    object-fit: contain;
}

.litem {
    border: solid 2px #d9d9d9;
  color: black;
  border-radius: 15px;
  padding: 5px;
  margin-left: 4px;
  margin-right: 2px;
}

.rounded-border {
    border: solid 4px #777;
    border-radius: 10px;
}

.blackb {
    border: solid 1px black;
}
</style>