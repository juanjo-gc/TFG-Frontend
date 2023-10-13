<template>
    <div class="container">
        <h2 class="mt-4">Nuevo ticket</h2>
        <div class="hline"></div>
        <div class="row mt-4">
            <p class="fw-light">En cuanto el ticket sea enviado se asignará a uno de nuestros administradores que será el
                encargado de ayudar en la incidencia.
                Por favor, introduce a continuación los datos requeridos.
            </p>
        </div>
        <div class="row mt-2">
            <div class="col-md-4">
                <h4>Asunto</h4>
                <div class="hline"></div>
                <div class="form-group field mt-2">
                    <div class="row">
                        <input type="input" class="form-field ms-2" placeholder="Asunto" name="subject" id='subject'
                            v-model="sSubject" />
                        <label for="subject" class="form-label">Escribe el asunto...</label>
                    </div>
                </div>
            </div>
            <div class="col-md-2"></div>
            <div class="col-md-4">
                <h4>Categoría</h4>
                <div class="hline"></div>
                <div class="d-flex justify-content-center">
                    <div class="select mt-4">
                        <select name="format" id="format" v-model="sSelectedCategory">
                            <option selected disabled>Categoría</option>
                            <option v-for="category in aCategories" :value="category._sName">{{
                                category._sName }}</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
        <div class="row mt-4">
            <div class="col-md-4 mt-4">
                <h4>Descripción</h4>
                <div class="hline"></div>
            </div>
            <p class="mt-4 fw-light">Escribe a continuación la descripción de la incidencia. Intenta que sea lo más
                detallada posible. Para ello, además de
                incluir información de interés, puedes adjuntar una foto para apoyar la explicación.
            </p>
            <div class="mt-2">
                <textarea class="form-control" id="description" rows="5" v-model="sDescription"></textarea>
            </div>
        </div>
        <div class="row mt-2">
            <div class="col-md-10">
                <p class="mt-4 float-end">Subir imagen:</p>
            </div>
            <div class="col-md-1">
                <input type="file" id="imgUpload" ref="uploadImage" @change="onImageUpload" name="image"
                    style="display: none;" accept="image/png, image/jpeg" />

                <button class="upload-transparent ps-3 pe-3 p-2 mt-3 float-start"
                    onclick="document.getElementById('imgUpload').click();">
                    <font-awesome-icon icon="fa-solid fa-upload" />
                </button>
            </div>
            <div class="col-md-1">
                <button type="button" class="btn btn-primary mt-3" @click="sendTicket">Enviar</button>
            </div>
        </div>
        <Popup v-if="bTriggerErrorPopup || bTriggerWarningPopup">
            <div class="d-flex justify-content-center">
                <h4 class="mt-4">Atención</h4>
            </div>
            <p class="mt-2" v-if="sSubject === '' && bTriggerErrorPopup"><strong>Error.</strong> Incluye un asunto.</p>
            <p class="mt-2" v-if="sSelectedCategory === '' && bTriggerErrorPopup"><strong>Error.</strong> Incluye una
                categoría.</p>
            <p class="mt-2" v-if="sDescription === '' && bTriggerWarningPopup">No has incluido ninguna descripción. </p>
            <button type="button" class="btn btn-outline-primary float-end" v-if="!bTriggerErrorPopup"
                @click="confirmSend()">Enviar</button>
            <button type="button" class="btn btn-outline-dark float-end me-2"
                @click="bTriggerErrorPopup = false; bTriggerWarningPopup = false">Volver</button>
        </Popup>
        <Popup v-if="bTriggerSuccessPopup">
            <div class="d-flex justify-content-center">
                <div class="row">
                    <h4 class="mt-4">Ticket enviado correctamente</h4>
                </div>
                <div class="row">
                    <img src="https://static.vecteezy.com/system/resources/previews/014/183/770/original/green-tick-check-mark-icon-simple-style-vector.jpg"
                        class="mt-2 success-tick" alt="">
                </div>
                <div class="row">
                    <button type="button" class="btn btn-primary mt-2"
                        @click="router.push('/help/tickets/' + iTicketId)">Ver ticket</button>
                </div>
            </div>
        </Popup>
    </div>
</template>
    

<script setup>
import Popup from '@/components/Popup.vue';
import { useUserStore } from '@/store/UserStore';
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();
let iTicketId = 0;
let sSubject = ref("");
let sDescription = ref("");
let sSelectedCategory = ref("");
let aCategories = ref([]);
let uploadImage = ref(null);
let formData = new FormData();

let bTriggerErrorPopup = ref(false);
let bTriggerWarningPopup = ref(false);
let bTriggerSuccessPopup = ref(false);


onMounted(() => {
    axios.get("http://localhost:8000/api/getAllCategories").then(response => {
        aCategories.value = response.data;
        aCategories.value = aCategories.value.filter((category) => {
            return category._sName != 'ReportUser' && category._sName != 'ReportEvent' && category._sName != 'ReportPost';
        })
    })

})

function isBlankString(sString) {
    let bIsBlank = true;
    for (let i = 0; i < sString.length; i++) {
        if (sString.charAt(i) != " ")
            bIsBlank = false;
    }
    return bIsBlank;
}

function confirmSend() {
    axios.post("http://localhost:8000/api/newTicket", {
        sSubject: sSubject.value,
        sDescription: sDescription.value,
        iIssuerId: userStore.person._iId,
        iReportedId: 0,
        iEventId: 0,
        iPostId: 0,
        sCategory: sSelectedCategory.value
    })
        .then(response => {
            iTicketId = response.data;
            if (iTicketId != 0) {
                bTriggerErrorPopup.value = false;
                bTriggerWarningPopup.value = false;
                bTriggerSuccessPopup.value = true;
            }
        })
}

function sendTicket() {
    if (sSubject.value === '' || sSelectedCategory.value === '')
        bTriggerErrorPopup.value = true;
    if (sDescription.value === '')
        bTriggerWarningPopup.value = true;
    if (bTriggerErrorPopup.value === false && bTriggerWarningPopup.value === false)
        confirmSend();
}


function onImageUpload() {
    formData = new FormData();

    console.log(uploadImage.value.files[0].name);
    let file = uploadImage.value.files[0];
    formData.append("file[]", file);

    //uploadImg()
}

async function uploadImg() {
    formData.append('id', ticket.value._iId);
    axios.post("http://localhost:8000/api/uploadEventImages", formData, {
        'content-type': 'form-data'
    })
        .then(response => {
            console.log(response.data);
            axios.get("http://localhost:8000/api/getEventPhotos/" + event.value._iId)
                .then(response => {
                    aEventPhotos.value = response.data;
                })
            aAssistantIds.value.forEach(iId => {
                if (iId != userStore.person._iId) {
                    axios.post("http://localhost:8000/api/newNotification", {
                        sInfo: "¡" + userStore.person._sName + " ha compartido una o varias fotos en un evento en el que has participado!",
                        iRecipientId: iId,
                        iIssuerId: userStore.person._iId,
                        sType: "NewEventPhoto",
                        iEventId: event.value._iId
                    })
                }
            })
        })
}
</script>

<style scoped>
.hline {
    border-bottom: solid 1px black;
}

.upload-transparent {
    background-color: transparent;
    border: none;
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

.success-tick {
    max-height: 50px;
    max-width: 50px;
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
}

</style>