<template>
    <SidebarFinal></SidebarFinal>
    <div class="container" v-if="!bIsFetching">
        <div class="mt-3 ms-3">
            <h3>Descubrir personas</h3>
        </div>
        <div class="row mt-4">
            <div class="col-md-3 ms-4">
                <h5 class="fw-bold mt-4">Filtros</h5>
                <div class="mt-3">
                    <p>Intereses</p>
                    <ul class="list-unstyled">
                        <li v-for="interest in aInterests">
                            <input type="checkbox" :value="interest._sName" v-model="aCheckedInterests"> <span
                                class="small text-muted">{{ interest._sName }}</span>
                        </li>
                    </ul>
                    <p>País</p>
                    <select class="form-select w-75" v-model="sSelectedCountry">
                        <option :value="null">Cualquiera</option>
                        <option v-for="country in aCountries" :value="country._sName">{{ country._sName }}</option>
                    </select>
                    <p class="mt-3">Comunidad Autónoma</p>
                    <select class="form-select w-75" v-model="sSelectedRegion">
                        <option :value="null">Cualquiera</option>
                        <option v-for="region in aRegions" :value="region._sName">{{ region._sName }}</option>
                    </select>
                    <p class="mt-3">Provincia</p>
                    <select class="form-select w-75" v-model="sSelectedProvince">
                        <option :value="null">Cualquiera</option>
                        <option v-for="province in aProvinces" :value="province._sName">{{ province._sName }}</option>
                    </select>
                </div>
                <button type="button" class="btn btn-primary mt-3" @click="setUsers(true)">Filtrar</button>
            </div>
            <div class="col-md-8 m-4" v-if="aUsers.length != 0">
                <h5 class="fw-light ms-4">Resultados de la búsqueda:</h5>
                <div class="row mt-4 mx-4 p-2 border rounded user-card" v-for="user in aUsers" @click="router.push('/profile/' + user._sUsername)">
                    <div class="row p-2">
                        <div class="col-md-1 d-flex align-items-center">
                            <img :src="userStore.baseAPIurl + 'getProfileImage/' + user._iId" class="avatar" alt="">
                        </div>
                        <div class="col-md-11">
                            <div class="row">
                                <div class="col-md-8">
                                    <span class="ms-2 mt-1 fw-bold fw-light">{{ user._sName }}</span>
                                    <span class="text-muted ms-2 fw-light">@{{ user._sUsername }}</span>
                                    <p class="mt-2 ms-3 small text-break" v-if="sDescription != null">{{ truncateDescription(user._sDescription) }}</p>
                                </div>
                                <div class="col-md-4">
                                    <p class="fw-light small text-end">{{ user._province._sName }}, {{ user._province._region._sName }}, {{ user._province._region._country._sName }}</p>
                                    <div class="float-end">
                                        <span class="p-2 border rounded-pill small" v-for="interest in user._setInterests">{{ interest._sName }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <div class="col-md-8 border rounded m-4" v-else>
                <h4 class="text-center mt-5">No hay usuarios disponibles para mostrar :&#40;</h4>
                <div class="row">
                    <div class="col-sm-1"></div>
                    <div class="col-sm-10">
                        <div class="text-center">
                            <img src="@/assets/img/nothing-found.png"
                                class="user-img img-fluid rounded m-3" alt="">
                        </div>
                    </div>
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
import moment from 'moment';

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
let aInterests = ref([]);
let aUsers = ref([]);
let aFollowing = ref([]);
let sSelectedProvince = ref(userStore.person._province !== null ? userStore.person._province._sName : null);
let sSelectedRegion = ref(userStore.person._province !== null ? userStore.person._province._region._sName : null);
let sSelectedCountry = ref(userStore.person._province !== null ? userStore.person._province._region._country._sName : null);
let iShownUsers = 0;
let iPageNumber = 0;
let iTotalPages = 1;


onMounted(() => {
    axios.get(userStore.baseAPIurl + "getAllCountries")
        .then(response => aCountries.value = response.data);
    setUsers(true);
    axios.get(userStore.baseAPIurl + "getFollowing/" + userStore.person._sUsername)
        .then(response => aFollowing.value = response.data);

    axios.get(userStore.baseAPIurl + "getAllInterests")
        .then(response => aInterests.value = response.data);

    if (userStore.person._province != null) {
        axios.get(userStore.baseAPIurl + "getCountryRegions/" + userStore.person._province._region._country._iId)
            .then(response => aRegions.value = response.data)
            .catch(error => console.log(error));

        axios.get(userStore.baseAPIurl + "getRegionProvinces/" + userStore.person._province._region._iId)
            .then(response => aProvinces.value = response.data)
            .catch(error => console.log(error));
    }

    setTimeout(() => {
        bIsFetching.value = false;

    }, 750);
})



function setUsers(bNewFilter) {
    bNewFilter ? iPageNumber = 0 : iPageNumber++;
    aUsers.value = [];
    axios.post(userStore.baseAPIurl + "filterUsers/" + userStore.person._iId + "/" + iPageNumber, {
        asInterests: [],
        sCountry: sSelectedCountry.value,
        sRegion: sSelectedRegion.value,
        sProvince: sSelectedProvince.value
    })
        .then(response => {
            iTotalPages = response.data.totalPages;
            aUsers.value = response.data.content;
        })
}

function truncateDescription(sDescription) {
    return sDescription.length > 120 ? sDescription.slice(0, 120) + "..." : sDescription;
}


watch(sSelectedCountry, (newsSelectedCountry, oldsSelectedCountry) => {
    nextTick(() => {
        sSelectedRegion.value = null;
        if (newsSelectedCountry != null) {
            const foundCountry = aCountries.value.find(country => newsSelectedCountry === country._sName);
            axios.get(userStore.baseAPIurl + "getCountryRegions/" + foundCountry._iId)
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
            axios.get(userStore.baseAPIurl + "getRegionProvinces/" + foundRegion._iId)
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
    max-height: 600px;
    min-height: 600px;
    width: auto;
    height: 100%;
    object-fit: contain;
}

.avatar {
    height: 50px;
    width: 50px;
    object-fit: contain;
    border-radius: 50%;
}

.litem {
    border: solid 2px #d9d9d9;
    color: black;
    border-radius: 15px;
    padding: 5px;
    margin-left: 4px;
    margin-right: 2px;
}

.user-card:hover {
    background-color: #e2e2e2;
    cursor: pointer;
}

.blackb {
    border: solid 1px black;
}
</style>