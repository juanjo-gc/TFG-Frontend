<template>
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
                <input type="input" class="form-field ms-2" :placeholder="'Buscar por asunto'" name="name" id='name'
                    v-model="sSubjectToSearch" @keyup="findTicketsBySubject" @click="sSubjectToSearch = ''" />
            </div>
            <div class="col-md-2"></div>
            <div class="col-md-2">
                <div class="row clickable" @click="bTicketsOrderedByDateAsc = !bTicketsOrderedByDateAsc">
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
                <!-- <p class="fs-5 mt-1" style="margin-top: 6px;">Categoría</p> -->
                <div class="select">
                    <select name="format" id="format">
                        <option selected disabled>Categoría</option>
                        <option v-for="category in aCategories" :value="category._sName">{{ proccessCategoryName(category._sName) }}</option>
                    </select>
                </div>
            </div>
            <div class="row mt-4">
                <h4>Resultados:</h4>
                <ul class="list-unstyled mt-4" v-if="bIsOpen">
                    <li v-for="ticket in aOpenedTickets">
                        <div class="row p-2 ticket-box mt-3">
                            <div class="row">
                                <div class="col-md-7">
                                    <h5 class="fw-bold">{{ ticket.sSubject }}</h5>
                                    <p class="mt-2 small">{{ ticket.user }}</p>
                                </div>
                                <div class="col-md-2">
                                    <p>Categoría: <strong>{{ ticket.category }}</strong></p>
                                    <p>
                                        {{ moment(ticket.date).format("DD/MM/YYYY") }}
                                    </p>
                                </div>
                            </div>
                            <p>{{ ticket.sInfo }}</p>
                        </div>
                    </li>
                </ul>
                <ul class="list-unstyled mt-4" v-else>
                    <li v-for="ticket in aClosedTickets">
                        <div class="row p-2 ticket-box mt-3">
                            <div class="row">
                                <div class="col-md-7">
                                    <h5 class="fw-bold">{{ ticket.sSubject }}</h5>
                                    <p class="mt-2 small">{{ ticket.user }}</p>
                                </div>
                                <div class="col-md-2">
                                    <p>Categoría: <strong>{{ ticket.category }}</strong></p>
                                    <p>
                                        {{ moment(ticket.date).format("DD/MM/YYYY") }}
                                    </p>
                                </div>
                            </div>
                            <p>{{ ticket.sInfo }}</p>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>


<script setup>
import moment from 'moment';
import { ref } from 'vue';

const aTickets = [{ sSubject: "ticket 1", sInfo: "Info del ticket 1", date: Date.now(), user: "pericopalotes", category: "Bug" },
{ sSubject: "ticket 2", sInfo: "Info del ticket 2", date: Date.now(), user: "pericopalotes2", category: "Denuncia" }];
const aCategories = [{ _sName: "Bug" }, { _sName: "Denuncia" }]
let bIsOpen = ref(true);
let bTicketsOrderedByDateAsc = ref(true);
let sSubjectToSearch = ref("Buscar por asunto...");


function toggleSelectedOpen() {
    bIsOpen.value = true;
}

function toggleSelectedClose() {
    bIsOpen.value = false;
}

function findTicketsBySubject() {

}

function proccessCategoryName(category) {
    //devolver categoria traducida
    return category
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

.form-field:placeholder-shown~.form-label {
    font-size: 1.3rem;
    cursor: text;
    top: 20px;
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
    /* border-image: linear-gradient(to right, #11998e, #38ef7d); */
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


select {
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
}

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
}</style>