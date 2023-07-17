<template>
    <HeaderComponent></HeaderComponent>
    <div class="container">
        <!-- <input type="text" v-model="sLocationToSearch" @keyup="searchAndGetResults">
        <ul class="list-unstyled">
            <li v-for="location in aLocations">
                {{ location.display_name }}
            </li>
        </ul>
        <div class="m-5">
            Buscando: {{ sLocationToSearch.replace(' ', '+') }}
        </div> -->
        <div class="mt-4">
            <!-- <h3 class="fw-bold">Inicia un nuevo evento</h3> -->
            <h3 class="fw-bold ">Conviértete en el anfitrión de un evento para conocer nuevas personas.</h3>
            <div class="hline mt-2"></div>
        </div>
        <div class="row mt-4">
            <div class="col-md-6">
                <h6 class="mt-2">Título del evento</h6>
                <label for="inp" class="inp">
                    <input type="text" id="inp" placeholder="&nbsp;" v-model="sTitle">
                    <span class="label">Título</span>
                    <span class="focus-bg"></span>
                </label>
            </div>
            <div class="col-md-6 d-flex align-items-center">
                <p class="fw-formal text-muted small">
                    <strong>AVISO:</strong> Cualquier persona que vea el evento podrá ver que eres el organizador.
                </p>
            </div>
        </div>
        <div class="row mt-4">
            <h6 class="mt-2">Descripción</h6>
            <textarea class="m-2" maxlength="5000" v-model="sDescription"></textarea>
            <p class="text-muted small">Caracteres restantes: {{ 5000 - sDescription.length }}</p>
        </div>
        <div class="row mt-4">
            <div class="col-md-6">
                <h6 class="mt-2">Localización del evento</h6>
                <!-- TODO: poner links a cada sitio para buscar y establecerlo como localización -->
                <!-- <input type="text" class="w-100" v-model="sLocationToSearch" @keyup="searchAndGetResults"> -->
                <label for="inp" class="inp">
                    <input type="text" id="inp" placeholder="&nbsp;" v-model="sLocationToSearch" @keyup="searchAndGetResults">
                    <span class="label">Localización</span>
                    <span class="focus-bg"></span>
                </label>
                <ul class="list-unstyled">
                    <li v-for="location in aLocations" @click="selectLocation(location)">
                        <div class="row location-data">
                            <p>{{ location.display_name }}</p>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="col-md-6">
                <!-- TODO: poner fecha con input bonito -->
                <h6 class="mt-2">Fecha de celebración</h6>
                <input type="date" v-model="tCelebrationDate">
            </div>
        </div>
        <div class="row">
            <h6 class="mt-2">Intereses del evento</h6>
              <ul class="ks-cboxtags">
                <li>
                  <input type="checkbox" id="checkboxOne" value="Música" v-model="aCheckedInterests" /><label
                    for="checkboxOne">Música</label>
                </li>
                <li>
                  <input type="checkbox" id="checkboxTwo" value="Videojuegos" v-model="aCheckedInterests" /><label
                    for="checkboxTwo">Videojuegos</label>
                </li>
                <li>
                  <input type="checkbox" id="checkboxThree" value="Deportes" v-model="aCheckedInterests" /><label
                    for="checkboxThree">Deportes</label>
                </li>
              </ul>
            </div>
    </div>
</template>


<script setup>
import axios from 'axios';
import { ref } from 'vue';
import HeaderComponent from '@/components/HeaderComponent.vue';
let sLocationToSearch = ref('');
let aLocations = ref(null);
let sTitle = ref("");
let sDescription = ref("");
let selectedLocation = ref(null);
let aCheckedInterests = ref(null);
let tCelebrationDate = ref(new Date());
let timeout = null;



function searchAndGetResults() {
    if(sLocationToSearch.value.length > 3) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            axios.get("https://nominatim.openstreetmap.org/search?q=" + sLocationToSearch.value.replace(' ', '+') + "&format=json&limit=3&countrycodes=es")
            .then(response => {
                aLocations.value = response.data;
                console.log(response.data);
            })
        }, 400)
    }
}

function selectLocation(location) {
    selectedLocation.value = location;
    sLocationToSearch.value = "";
    aLocations.value = [];
}

</script>

<style scoped>
body {
    height: 100vh;
    display: grid;
    font-family: Roboto;
    -webkit-text-size-adjust: 100%;
    -webkit-font-smoothing: antialiased;
}

* {
    box-sizing: border-box;
}

.hline {
    border-bottom: solid 2px black;
}

.inp {
    position: relative;
    margin: auto;
    width: 100%;
    max-width: 280px;
    border-radius: 3px;
    overflow: hidden;
}

.inp .label {
    position: absolute;
    top: 20px;
    left: 12px;
    font-size: 16px;
    color: rgba(0, 0, 0, 0.5);
    font-weight: 500;
    transform-origin: 0 0;
    transform: translate3d(0, 0, 0);
    transition: all 0.2s ease;
    pointer-events: none;
}

.inp .focus-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.05);
    z-index: -1;
    transform: scaleX(0);
    transform-origin: left;
}

.inp input {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    width: 100%;
    border: 0;
    font-family: inherit;
    padding: 16px 12px 0 12px;
    height: 56px;
    font-size: 16px;
    font-weight: 400;
    background: rgba(0, 0, 0, 0.02);
    box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.3);
    color: #000;
    transition: all 0.15s ease;
}

.inp input:hover {
    background: rgba(0, 0, 0, 0.04);
    box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.5);
}

.inp input:not(:-moz-placeholder-shown)+.label {
    color: rgba(0, 0, 0, 0.5);
    transform: translate3d(0, -12px, 0) scale(0.75);
}

.inp input:not(:-ms-input-placeholder)+.label {
    color: rgba(0, 0, 0, 0.5);
    transform: translate3d(0, -12px, 0) scale(0.75);
}

.inp input:not(:placeholder-shown)+.label {
    color: rgba(0, 0, 0, 0.5);
    transform: translate3d(0, -12px, 0) scale(0.75);
}

.inp input:focus {
    background: rgba(0, 0, 0, 0.05);
    outline: none;
    box-shadow: inset 0 -2px 0 #0077FF;
}

.inp input:focus+.label {
    color: #0077FF;
    transform: translate3d(0, -12px, 0) scale(0.75);
}


.inp input:focus+.label+.focus-bg {
    transform: scaleX(1);
    transition: all 0.1s ease;
}

ul.ks-cboxtags {
  list-style: none;
  padding: 20px;
}

ul.ks-cboxtags li {
  display: inline;
}

ul.ks-cboxtags li label {
  display: inline-block;
  background-color: rgba(255, 255, 255, 0.9);
  border: 2px solid rgba(139, 139, 139, 0.3);
  color: #adadad;
  border-radius: 25px;
  white-space: nowrap;
  margin: 3px 0px;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  transition: all 0.2s;
}

ul.ks-cboxtags li label {
  padding: 8px 12px;
  cursor: pointer;
}

ul.ks-cboxtags li label::before {
  display: inline-block;
  font-style: normal;
  font-variant: normal;
  text-rendering: auto;
  -webkit-font-smoothing: antialiased;
  font-family: "Font Awesome 5 Free";
  font-weight: 900;
  font-size: 12px;
  padding: 2px 6px 2px 2px;
  content: "\f067";
  transition: transform 0.3s ease-in-out;
}

ul.ks-cboxtags li input[type="checkbox"]:checked+label::before {
  content: "\f00c";
  transform: rotate(-360deg);
  transition: transform 0.3s ease-in-out;
}

ul.ks-cboxtags li input[type="checkbox"]:checked+label {
  border: 2px solid #1b61f8;
  background-color: #1b61f8;
  color: #fff;
  transition: all 0.2s;
}

ul.ks-cboxtags li input[type="checkbox"] {
  display: absolute;
}

ul.ks-cboxtags li input[type="checkbox"] {
  position: absolute;
  opacity: 0;
}

ul.ks-cboxtags li input[type="checkbox"]:focus+label {
  border: 2px solid #e9a1ff;
}

textarea {
    width: 80%;
    height: 100px;
    padding: 7px 10px;
    box-sizing: border-box;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #f8f8f8;
    font-size: 12px;
    resize: none;
    font-family: Arial, Helvetica, sans-serif;
}

.location-data {
    border: solid 1px #e5e5e5;
    margin: 7px;
    border-radius: 10px;
    padding: 5px;
}

.location-data:hover {
    cursor: pointer;
    background-color: #e0e0e0;}

.blackb {
    border: solid 1px black;
}
</style>