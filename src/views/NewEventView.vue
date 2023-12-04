<template>
<SidebarFinal></SidebarFinal>
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
            <h3 class="fw-bold ">Conviértete en el anfitrión de un evento para reunir personas con tus mismos gustos.</h3>
            <div class="hline mt-2"></div>
        </div>
        <form @submit.prevent="submitEvent">
            <div class="row mt-4">
                <div class="col-md-6">
                <h6 class="mt-2 fw-bold">Título del evento*</h6>
                <label for="inp" class="inp">
                    <input type="text" id="inp" placeholder="&nbsp;" v-model="sTitle" required>
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
            <h6 class="mt-2 fw-bold">Descripción</h6>
            <textarea class="m-2" maxlength="5000" v-model="sDescription"></textarea>
            <p class="text-muted small">Caracteres restantes: {{ 5000 - sDescription.length }}</p>
        </div>
        <div class="row mt-4">
            <div class="col-md-3">

                <input type="checkbox" id="checkbox" v-model="bIsOnline" />
                <label for="checkbox">
                    <p class="ms-2 fw-bold">Evento online</p>
                </label>
            </div>
        </div>
        <div class="row mt-4">
            <div class="col-md-6" v-if="!bIsOnline">
                <h6 class="mt-2 fw-bold">Localización del evento*</h6>
                <!-- TODO: poner links a cada sitio para buscar y establecerlo como localización -->
                <!-- <input type="text" class="w-100" v-model="sLocationToSearch" @keyup="searchAndGetResults"> -->
                <label for="inp" class="inp">
                    <input type="text" id="inp" placeholder="&nbsp;" v-model="sLocationToSearch"
                    @keyup="searchAndGetResults">
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
                <p v-if="selectedLocation != null"><strong>Ubicación seleccionada:</strong> {{ selectedLocation.display_name }}</p>
            </div>
            <div class="col-md-6" v-else>
                <p><strong>IMPORTANTE: </strong>Has indicado que el evento es online. Incluye información relevante en la descripción
                para que los demás usuarios puedan comunicarse contigo, o con los demás participantes del evento.</p>
            </div>
            <div class="col-md-6">
                <!-- TODO: poner fecha con input bonito -->
                <h6 class="mt-2 fw-bold">Hora del evento*</h6>
                <input type="time" v-model="tCelebrationHour" required>
                <h6 class="mt-4 fw-bold">Fecha de celebración*</h6>
                <input type="date" v-model="tCelebrationDate" required>
            </div>
        </div>
        <div class="row">
            <div class="col-md-6">

                <h6 class="mt-2 fw-bold">Intereses del evento</h6>
                <!-- <ul class="ks-cboxtags">
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
            </ul> -->
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
            <div class="col-md-6">
                <div class="row mt-3">
                    <div class="col-md-3 mt-2">
                        <h6 class="mt-4 fw-bold">Foto de portada</h6>
                    </div>
                    <div class="col-md-5">
                        <button type="button" class="upload-transparent ps-3 pe-3 mt-3" onclick="document.getElementById('imgUpload').click();">
                            <div class="row">
                                <div class="col-sm-1 mt-3">
                                    <font-awesome-icon icon="fa-solid fa-upload" />
                                </div>
                                <div class="col-sm-10 mt-3">
                                    <p>Subir imagen</p>
                                </div>
                            </div>
                        </button>
                </div>
                <input type="file"  id="imgUpload" ref="imgUpload" @change="onImageUpload" name="image" style="display: none;"
                        accept="image/png, image/jpeg" /> 
                        <p v-if="sImageName != ''" class="mt-2 small">Imagen seleccionada: <strong>{{ sImageName }}</strong></p>
                        <span class="small text-muted"><strong>AVISO: </strong>La imagen subida aparecerá en la página principal del evento</span>
                    </div>
                        
            </div>
        </div>
        <div class="row">
            <p class="text-muted small">Los campos marcados con * son obligatorios.</p>
            <div class="col-md-2">
                <button type="submit" class="btn btn-primary">Enviar</button>
            </div>
        </div>
    </form>
</div>
<div class="alert alert-danger alert-dismissible fade show fixed-bottom" role="alert" v-if="sErrorMessage != ''">
    {{ sErrorMessage }}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close" @click="sErrorMessage = ''"></button>
</div>
</template>


<script setup>
import axios from 'axios';
import { ref, watch } from 'vue';
import SidebarFinal from '@/components/SidebarFinal.vue'
import { useUserStore } from '@/store/UserStore';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { useRouter } from 'vue-router';
import moment from 'moment';
const userStore = useUserStore();
const router = useRouter();
let sLocationToSearch = ref('');
let aLocations = ref(null);
let sTitle = ref("");
let sDescription = ref("");
let selectedLocation = ref(null);
let aCheckedInterests = ref([]);
let tCelebrationDate = ref(null);
let tCelebrationHour = ref(null);
let timeout = null;
let sErrorMessage = ref("");
let sProvinceName = null;
let formData = new FormData();
let sImageName = ref("");
let imgUpload = ref(null);
let bIsOnline = ref(false);



function searchAndGetResults() {
    if(formData.get('file') != null) console.log("holasdasdsadsadas")
    if (sLocationToSearch.value.length > 3) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            axios.get("https://nominatim.openstreetmap.org/search?q=" + sLocationToSearch.value.replace(' ', '+') + "&format=json&limit=3&countrycodes=es")
                .then(response => {
                    aLocations.value = response.data;
                    //console.log(response.data);
                })
        }, 400)
    } else {
        aLocations.value = [];
    }
}

function selectLocation(location) {
    selectedLocation.value = location;
    sProvinceName = null;
    axios.get("https://nominatim.openstreetmap.org/reverse?format=json&lat=" + location.lat +"&lon=" + location.lon)
    .then(response => {
    sProvinceName = response.data.address.state_district;
    console.log(response.data)
    console.log(sProvinceName)
    if(sProvinceName === null) {
        sErrorMessage.value = "No se ha podido seleccionar la ubicación correctamente. Por favor, vuelva a intentarlo, y si el error persiste, seleccione otra ubicación."
    }
})
    sLocationToSearch.value = "";
    aLocations.value = [];
}

function isDatetimeValid() {
    let bIsValid = true;
    console.log("Comprobando fecha")
    if(moment(tCelebrationDate.value).isBefore(moment(Date.now()))) 
        bIsValid = false;
    console.log("A devolver: " + bIsValid)
    return bIsValid;
}

function submitEvent() {
    let iUserId = userStore.person._iId;
    let sLocationName = selectedLocation.value === null ? "" : selectedLocation.value.display_name;
    console.log(sLocationName)
    console.log(bIsOnline.value)
    if(isDatetimeValid()) {
        let eventDTO = {
            sTitle: sTitle.value,
            tCelebratedAt: tCelebrationDate.value,
            tCelebrationHour: tCelebrationHour.value,
            sDescription: sDescription.value,
            iOrganizerId: iUserId,
            setInterests: aCheckedInterests.value,
            sLocationName, //: selectedLocation.value != null ? selectedLocation.value.display_name : "",
            dLatitude: selectedLocation.value != null ? selectedLocation.value.lat : -1.00,
            dLongitude: selectedLocation.value != null ? selectedLocation.value.lon : -1.00,
            sProvinceName: sProvinceName != null ? sProvinceName : "",
            bIsOnline: bIsOnline.value
        }
        if((selectedLocation.value != null && !bIsOnline.value) || (bIsOnline.value)) {
            axios.post("http://localhost:8000/api/newEvent", eventDTO)
            .then(response => {
                let iNewEventId = response.data;
                formData.append('id', response.data);
                console.log("FormData: " + formData.get('id'))
                if(formData.get('file') != null) {
                    axios.post("http://localhost:8000/api/uploadEventHeaderImage", formData, {
                        'content-type': 'form-data'
                    })
                    .then(response => {
                        router.push("/events/" + iNewEventId);
                    })
                } else {
                    router.push("/events/" + iNewEventId);
                }
            })
        } else {
            sErrorMessage.value = "Error. Seleccione una localización para el evento.";
        }
    } else {
        sErrorMessage.value = "Error. Seleccione una fecha válida.";
        console.log(sErrorMessage.value)
    }
}

function onImageUpload(iEventId) {
    let file = imgUpload.value.files[0];
    sImageName.value = file.name;
    formData.append('file', file);
    console.log(formData.get('file'))
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
    background-color: #e0e0e0;
}

.upload-transparent {
    background-color: transparent;
    border: none;
}

.upload-transparent:hover {
    background-color: rgb(108, 205, 243);
    border: none;
    border-radius: 5px;
}

.blackb {
    border: solid 1px black;
}
</style>