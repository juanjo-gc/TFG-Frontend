<template>
    <SidebarFinal></SidebarFinal>
    <div class="container">
        <div class="row">
            <div class="col-md-3">
                <h2 class="mt-4 fw-formal">Explorar eventos</h2>
            </div>
            <div class="col-md-7 mt-4">
                <div class="row">
                    <div class="col-md-8">
                        <p class="fw-light mt-2 text-end">¿No encuentras ningún evento que te interese? ¡Crea tú uno
                            mismo!</p>
                    </div>
                    <div class="col-md-4">
                        <button type="button" class="btn btn-outline-primary" @click="router.push('/newEvent')">Crear
                            evento</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="row mt-4 ms-1">
            <div class="col-sm-3">
                <h5 class="fw-bold">Filtros</h5>
                <div class="mt-3">
                    <p class="fw-bold">Intereses del evento</p>
                    <ul class="list-unstyled">
                        <li v-for="interest in asInterests">
                            <input type="checkbox" :value="interest" v-model="aCheckedInterests"> <span
                                class="small text-muted">{{ interest }}</span>
                        </li>
                    </ul>
                    <!-- <div class="col-6" v-else>
                        <p class="text-muted">Selecciona al menos un interés para poder usar el filtro</p>
                    </div> -->
                    <div class="mt-3">
                        <input type="checkbox" id="checkbox" v-model="bIsOnline">
                        <label for="checkbox">
                            <p class="ms-2 fw-bold">Evento online</p>
                        </label>
                    </div>
                    <div class="mt-2" v-if="!bIsOnline">
                        <p class="fw-bold">País</p>
                        <select class="form-select w-75" v-model="sSelectedCountry">
                            <option :value="null">Cualquiera</option>
                            <option v-for="country in aCountries" :value="country._sName">{{ country._sName }}</option>
                        </select>
                        <p class="mt-3 fw-bold">Comunidad Autónoma</p>
                        <select class="form-select w-75" v-model="sSelectedRegion">
                            <option :value="null">Cualquiera</option>
                            <option v-for="region in aRegions" :value="region._sName">{{ region._sName }}</option>
                        </select>
                        <p class="mt-3 fw-bold">Provincia</p>
                        <select class="form-select w-75" v-model="sSelectedProvince">
                            <option :value="null">Cualquiera</option>
                            <option v-for="province in aProvinces" :value="province._sName">{{ province._sName }}
                            </option>
                        </select>
                    </div>
                </div>
                <button type="button" class="btn btn-primary mt-3" @click="sendFilter">Filtrar</button>
            </div>
            <div class="col-md-9">
                <div class="row mt-2">
                    <div class="col-md-8">
                        <p class="fw-bold">Buscar por título:</p>
                        <!-- <label for="title" class="form-label">Título del evento</label> -->
                        <input type="text" class="mb-3 form-control" id="title" v-model="sEventTitle"
                            @keyup="filterByName">
                    </div>
                </div>
                <div class="row mt-3">
                    <h5 class="fw-formal">Resultados de la búsqueda:</h5>
                    <ul class="list-unstyled" v-if="aEvents.length != 0">
                        <li v-for="event in aEvents">
                            <div class="row mt-2 p-2 grey-border clickable"
                                @click="router.push('/events/' + event._iId)" v-if="event._tDeleteDate === null">
                                <div class="row">
                                    <div class="col-md-7">
                                        <h6 class="ms-2 fw-bold">{{ event._sTitle }}</h6>
                                        <p class="ms-2 small"><strong>Organizado por:</strong> {{
                            event._organizer._sUsername }}</p>
                                    </div>
                                    <div class="col-md-4">
                                        <p class="text-muted" v-if="event._location != null">
                                            <strong>Celebrado en: </strong>{{ event._location._province._sName }}, {{
                            event._location._province._region._sName }},
                                            {{ event._location._province._region._country._sName }}
                                        </p>
                                        <p class="text-muted float-end" v-else><strong>Evento online</strong></p>
                                    </div>
                                </div>
                                <p class="ms-2 mt-1">{{ event._sDescription }}</p>
                                <p class="mt-2 fw-bold" v-if="event._setInterest.length != 0">Intereses relacionados:
                                </p>
                                <ul class="list-group list-group-horizontal">
                                    <li v-for="interest in event._setInterest">
                                        <p class="interest-item ms-3">{{ interest._sName }}</p>
                                    </li>
                                </ul>
                            </div>
                        </li>
                    </ul>
                    <div class="col-md-8 border rounded m-4" v-else>
                        <h4 class="text-center mt-5">No hay eventos disponibles para mostrar :&#40;</h4>
                        <div class="row">
                            <div class="col-sm-1"></div>
                            <div class="col-sm-10">
                                <div class="text-center">
                                    <img src="@/assets/img/nothing-found.png" class="event-img img-fluid rounded m-3"
                                        alt="">
                                </div>
                            </div>
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
import axios from 'axios';
import { onMounted, ref, watch, nextTick } from 'vue';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();
let bIsFetching = ref(true);
let bIsOnline = ref(false);
let aEvents = ref([]);
let aEventsBackup = [];
let sEventTitle = ref("");
let aCheckedInterests = ref([]);
let asInterests = ref([]);
let aCountries = ref([]);
let aRegions = ref([]);
let aProvinces = ref([]);
let sSelectedCountry = ref(userStore.person._province != null ? userStore.person._province._region._country._sName : null);
let sSelectedRegion = ref(userStore.person._province != null ? userStore.person._province._region._sName : null);
let sSelectedProvince = ref(userStore.person._province != null ? userStore.person._province._sName : null);
let aInterests = ref(null);
let iPageNumber = 0;
let iTotalPages = 0;
let currentSearch = {};

onMounted(() => {
    axios.get(userStore.baseAPIurl + "getAllInterestNames")
        .then(response => asInterests = response.data)

    axios.get(userStore.baseAPIurl + "getAllCountries")
        .then(response => aCountries.value = response.data)

    if (userStore.person._province != null) {
        axios.get(userStore.baseAPIurl + "getCountryRegions/" + userStore.person._province._region._country._iId)
            .then(response => aRegions.value = response.data)

        axios.get(userStore.baseAPIurl + "getRegionProvinces/" + userStore.person._province._region._iId)
            .then(response => aProvinces.value = response.data)
    }
    axios.post(userStore.baseAPIurl + "getFilteredEvents/" + iPageNumber, {
        sTitle: "",
        asInterests: [],
        sProvince: sSelectedProvince.value,
        sRegion: sSelectedRegion.value,
        sCountry: sSelectedCountry.value
    })
        .then(response => {
            aEvents.value = response.data.content;
            aEventsBackup = aEvents.value;
            iTotalPages = response.data.totalPages;
            currentSearch = {
                sTitle: sEventTitle.value,
                asInterests: aCheckedInterests.value,
                sProvince: sSelectedProvince.value,
                sRegion: sSelectedRegion.value,
                sCountry: sSelectedCountry.value
            }
        })
})

function filterByName() {
    aEvents.value = aEventsBackup.filter((event) => {
        let regEx = new RegExp(sEventTitle.value, 'gi');
        if (event._sTitle.match(regEx))
            return event;
    });
    if (sEventTitle.length === 0) {
        aEvents.value = aEventsBackup;
    }
}


function sendFilter() {
    iPageNumber = 0;
    axios.post(userStore.baseAPIurl + "getFilteredEvents/" + 0, {
        sTitle: sEventTitle.value,
        asInterests: aCheckedInterests.value,
        sProvince: sSelectedProvince.value,
        sRegion: sSelectedRegion.value,
        sCountry: sSelectedCountry.value,
        bIsOnline: bIsOnline.value
    })
        .then(response => {
            aEvents.value = response.data.content;
            aEventsBackup = aEvents.value;
            iTotalPages = response.data.totalPages;
            currentSearch = {
                sTitle: sEventTitle.value,
                asInterests: aCheckedInterests.value,
                sProvince: sSelectedProvince.value,
                sRegion: sSelectedRegion.value,
                sCountry: sSelectedCountry.value
            }
        })
}

window.onscroll = () => {
    //Cuando el número de píxeles que hay en el scroll sumado al número de píxeles de la pantalla sean 
    //iguales al nº de píxeles del elemento del documento habremos llegado al final
    let bottomOfWindow = document.documentElement.scrollTop + window.innerHeight === document.documentElement.offsetHeight;
    if (bottomOfWindow && iPageNumber < iTotalPages) {
        iPageNumber++;
        axios.post(userStore.baseAPIurl + "getFilteredEvents/" + iPageNumber, {
            bIsOnline: currentSearch.bIsOnline,
            asInterests: currentSearch.asInterests,
            sProvince: currentSearch.sProvince,
            sRegion: currentSearch.sRegion,
            sCountry: currentSearch.sCountry
        })
            .then(response => {
                aEvents.value = aEvents.value.concat(response.data.content)
                aEventsBackup = aEvents.value;

            })
    }
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
                    aProvinces.value = response.data;
                })
                .catch(error => console.log(error));
        } else {
            aProvinces.value = [];
        }
    })
})

</script>

<style scoped>

.event-img {
    max-height: 400px;
    min-height: 400px;
    width: auto;
    height: 100%;
    object-fit: contain;
}

.interest-item {
    padding: 5px;
    border: solid 1px black;
    border-radius: 5px;
}

.grey-border {
    border: solid 1px #909090;
}

.clickable:hover {
    cursor: pointer;
    background-color: #e4e4e4;
}

.hline {
    border-bottom: solid 1px black;
}

.blackb {
    border: solid 1px black;
}

/*
input[type=text] {
    border: 0;
    border-bottom: 1px solid black;
    width: 100%;
}

input[type=text]:focus {
    border: 0;
    outline: 0;
    border-bottom: solid 1px black;
    width: 100%;
}
*/
</style>