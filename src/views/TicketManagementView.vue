<template>
    <SidebarFinal></SidebarFinal>
    <div class="container">
        <h2 class="mt-4">Gestionar tickets</h2>
        <div class="hline"></div>
        <div class="row mt-4">
            <div class="col-md-6 select-box justify-content-center d-flex" :class="{ selected: bIsOpen }"
                @click="toggleSelectedOpen">
                <p class="mt-2">Abiertos</p>
            </div>
            <div class="col-md-6 select-box justify-content-center d-flex" :class="{ selected: !bIsOpen }"
                @click="toggleSelectedClose">
                <p class="mt-2">Cerrados</p>
            </div>
        </div>
        <div class="row mt-4">
            <h4 class="mb-4">Filtros</h4>
            <div class="col-md-4">
                <div class="mb-3">
                    <input type="text" class="form-control form-control-lg" id="ticketSubject" placeholder="Buscar por asunto..."
                        v-model="sSubjectToSearch" @keyup="findTicketsBySubject" @click="sSubjectToSearch = ''">
                </div>
            </div>
            <div class="col-md-2"></div>
            <div class="col-md-2">
                <div class="row clickable" @click="orderAscDesc">
                    <div class="col-md-6">
                        <p class="fs-5 float-end" style="margin-top: 6px;">Fecha</p>
                    </div>
                    <div class="col-md-6">
                        <font-awesome-icon icon="fa-solid fa-arrow-up" class="float-start mt-3"
                            v-if="bTicketsOrderedByDateAsc" />
                        <font-awesome-icon icon="fa-solid fa-arrow-down" class="float-start mt-3" v-else />
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <select class="form-select mt-1" aria-label="Default select example" v-model="sSelectedCategory" @change="filterByCategory">
                    <option>Seleccionar categoría</option>
                    <option v-for="category in aCategories" :value="category._sName">{{ category._sName }}</option>
                </select>
            </div>
            <div class="row mt-4">
                <h4>Resultados:</h4>
                <ul class="list-unstyled mt-4" v-if="bIsOpen">
                    <li v-for="ticket in aOpenedTickets">
                        <div class="row p-3 ticket-box mt-3" @click="router.push('/help/tickets/' + ticket._iId)">
                            <div class="row">
                                <div class="col-md-7">
                                    <h5 class="fw-bold">{{ ticket._sSubject }}</h5>
                                    <p class="mt-2 small">Denunciante: <strong>@{{ ticket._issuer._sUsername }}</strong></p>
                                </div>
                                <div class="col-md-4">
                                    <p>Categoría: <strong>{{ ticket._category._sName }}</strong></p>
                                    <p>
                                        {{ moment(ticket._tCreationDate).format("DD/MM/YYYY") }}
                                    </p>
                                </div>
                            </div>
                            <p>{{ proccessDescription(ticket._sDescription) }}</p>
                        </div>
                    </li>
                </ul>
                <ul class="list-unstyled mt-4" v-else>
                    <li v-for="ticket in aClosedTickets">
                        <div class="row p-3 ticket-box mt-3" @click="router.push('/help/tickets/' + ticket._iId)">
                            <div class="row">
                                <div class="col-md-7">
                                    <h5 class="fw-bold">{{ ticket._sSubject }}</h5>
                                    <p class="mt-2 small">Denunciante: <strong>@{{ ticket._issuer._sUsername }}</strong></p>
                                </div>
                                <div class="col-md-4">
                                    <p>Categoría: <strong>{{ ticket._category._sName }}</strong></p>
                                    <p>
                                        {{ moment(ticket._tCreationDate).format("DD/MM/YYYY") }}
                                    </p>
                                </div>
                            </div>
                            <p>{{ proccessDescription(ticket._sDescription) }}</p>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>


<script setup>
import { useUserStore } from '@/store/UserStore';
import SidebarFinal from '@/components/SidebarFinal.vue'
import axios from 'axios';
import moment from 'moment';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const userStore = useUserStore();
let aCategories = ref([]);
let aOpenedTicketsBackup = [];
let aClosedTicketsBackup = [];
let aOpenedTickets = ref([]);
let aClosedTickets = ref([]);
let bIsOpen = ref(true);
let bTicketsOrderedByDateAsc = ref(true);
let sSubjectToSearch = ref('');
let sSelectedCategory = ref('Seleccionar categoría');

onMounted(() => {
    let sLink = userStore.person._sRole === 'Admin' ? "http://localhost:8000/api/getAdminTickets/" + userStore.person._iId : "http://localhost:8000/api/getUserTickets/" + userStore.person._iId;
    axios.get(sLink)
        .then(response => {
            response.data.forEach(ticket => {
                ticket._bIsOpen ? aOpenedTickets.value.push(ticket) : aClosedTickets.value.push(ticket);
            })
            aOpenedTicketsBackup = aOpenedTickets.value;
            aClosedTicketsBackup = aClosedTickets.value;
        });

    axios.get("http://localhost:8000/api/getAllCategories")
        .then(response => {
            aCategories.value = response.data;
            aCategories.value = aCategories.value.filter(category => category._sName != "Borrada previamente")
        });


})

function orderAscDesc(bToggled) {
    if (bToggled)
        bTicketsOrderedByDateAsc.value = !bTicketsOrderedByDateAsc.value;
    aOpenedTickets.value = aOpenedTickets.value.reverse();
    aClosedTickets.value = aClosedTickets.value.reverse();
}

function filterByCategory() {
    if (sSelectedCategory.value != 'Seleccionar categoría') {
        aOpenedTickets.value = aOpenedTicketsBackup;
        aClosedTickets = aClosedTicketsBackup;
        aOpenedTickets.value = aOpenedTicketsBackup.filter(ticket => ticket._category._sName === sSelectedCategory.value);
        aClosedTickets.value = aClosedTicketsBackup.filter(ticket => ticket._category._sName === sSelectedCategory.value);
    } else {
        aOpenedTickets.value = aOpenedTicketsBackup;
        aClosedTickets.value = aClosedTicketsBackup;
    }
}

function proccessDescription(sDescription) {
    if (sDescription.length > 150)
        return sDescription.slice(0, 150);
    else
        return sDescription;
}

function toggleSelectedOpen() {
    bIsOpen.value = true;
    aOpenedTicketsBackup = aOpenedTickets.value;
}

function toggleSelectedClose() {
    bIsOpen.value = false;
    aClosedTicketsBackup = aClosedTickets.value;

}

function findTicketsBySubject() {
    if (sSubjectToSearch.value.length > 3) {
        if (bIsOpen.value)
            aOpenedTickets.value = aOpenedTickets.value.filter(ticket => {
                let regEx = new RegExp('^.*' +sSubjectToSearch.value + '.*$');
                if (ticket._sSubject.match(regEx))
                    return ticket;
            })
    } else {
        if (bIsOpen.value)
            aOpenedTickets.value = aOpenedTicketsBackup;
        else
            aClosedTickets.value = aClosedTicketsBackup;
    }
}

</script>


<style scoped>
.hline {
    border-bottom: solid black 1px;
}

.clickable:hover {
    cursor: pointer;
}

.selected {
    background-color: rgb(224, 240, 255);
    font-weight: bold;
}

.blackb {
    border: solid 1px black;
}

.ticket-box {
    border: solid 1px rgb(201, 201, 201);
}

.ticket-box:hover {
    background-color: rgb(224, 240, 255);
    cursor: pointer;
}

.select-box {
    height: 50px;
}

.select-box:hover {
    background-color: rgb(224, 240, 255);
    cursor: pointer;
}


.form-group {
    position: relative;
    padding: 15px 0 0;
    margin-top: 10px;
    width: 50%;
}

.form-field {
    font-family: inherit;
    width: 100%;
    border: 0;
    border-bottom: 2px solid #9b9b9b;
    outline: 0;
    font-size: 1.3rem;
    color: #000000;
    padding: 7px 0;
    background: transparent;
    transition: border-color 0.2s;
}

.form-field::placeholder {
    color: transparent;
}


.form-label {
    position: absolute;
    top: 0;
    display: block;
    transition: 0.2s;
    font-size: 1rem;
    color: #9b9b9b;
}

.form-field:focus {
    padding-bottom: 6px;
    font-weight: 700;
    border-width: 3px;
    border-image: linear-gradient(to right, #000000, #16b1a4);
    border-image-slice: 1;
}

.form-field:focus~.form-label {
    position: absolute;
    top: 0;
    display: block;
    transition: 0.2s;
    font-size: 1rem;
    color: #11998e;
    font-weight: 700;
}

/* reset input */
.form-field:required,
.form-field:invalid {
    box-shadow: none;
}


/* select {
    -webkit-appearance: none;
    -moz-appearance: none;
    -ms-appearance: none;
    appearance: none;
    outline: 0;
    box-shadow: none;
    border: 0 !important;
    background: rgb(224, 240, 255);
    background-image: none;
    flex: 1;
    padding: 0 .5em;
    color: #000000;
    cursor: pointer;
    font-size: 1em;
    font-family: 'Open Sans', sans-serif;
}

select::-ms-expand {
    display: none;
} */

.select {
    position: relative;
    display: flex;
    width: 20em;
    height: 3em;
    line-height: 3;
    background: #3d3d3d;
    overflow: hidden;
    border-radius: .25em;
}

.select::after {
    content: '\25BC';
    position: absolute;
    top: 0;
    right: 0;
    padding: 0 1em;
    background: #a0a0a0;
    cursor: pointer;
    pointer-events: none;
    transition: .25s all ease;
}

.select:hover::after {
    color: #23b499;
}
</style>