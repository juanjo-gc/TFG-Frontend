<template>
    <!-- <header-component></header-component> -->
    <SidebarFinal></SidebarFinal>
    <div class="container ps-4" v-if="!bIsFetching">
        <div v-if="event._iId === 0">
            <h2 class="mt-4 ms-2 fw-formal">El evento no existe</h2>
        </div>
        <div v-else>
            <div class="row mt-2" v-if="event._tDeleteDate != null && userStore.person._sRole === 'User'">
                <p class="fs-3 fw-light mt-2">El evento ha sido eliminado</p>
                <div class="col-md-2">
                    <button type="button" class="btn btn-primary" @click="router.push('/timeline')">Volver</button>
                </div>
            </div>
            <div v-else>
                <div class="row mt-4">
                    <div class="col-md-10">
                        <h3 class="fw-formal fw-bold">{{ event._sTitle }}</h3>
                    </div>
                    <div class="col-md-2" v-if="userStore.person._sRole === 'Admin'">
                        <button type="button" class="btn btn-danger" v-if="event._tDeleteDate === null"
                            @click="softDeleteEvent()">
                            Eliminar evento
                        </button>
                        <button type="button" class="btn btn-primary" v-else @click="softDeleteEvent()">
                            Restaurar evento
                        </button>
                    </div>
                    <div class="hline"></div>
                    <div class="row">
                        <div class="col-md-3 bg-contrast p-2 m-2 mt-4">
                            <div class="row mt-2">
                                <div class="col-md-4 mt-1">
                                    <router-link :to="'/profile/' + event._organizer._sUsername"
                                        style="text-decoration: none; color: inherit;">
                                        <img class="avatar ms-4"
                                            :src="'http://localhost:8000/api/getProfileImage/' + event._organizer._iId" />
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
                        <div class="col-md-8 d-flex align-items-center justify-content-end"
                            v-if="!bIsFinished && userStore.person._sRole === 'User'">
                            <div class="row" v-if="userStore.person._iId != event._organizer._iId">
                                <button type="button" class="btn btn-outline-primary me-5" v-if="!bIsAssistant"
                                    @click="setAssist">Participar</button>
                                <button type="button" class="btn btn-primary me-5" v-else @click="setAssist">No
                                    participar</button>
                            </div>
                        </div>
                        <div class="row d-flex align-items-center justify-content-end"
                            v-if="!bIsFinished && userStore.person._sRole === 'User' && userStore.person._iId != event._organizer._iId">
                            <div class="col-md-2">
                                <button type="button" class="btn btn-outline-danger" @click="bTriggerReportPopup = true">
                                    <font-awesome-icon icon="fa-solid fa-flag" class="mt-1" /> Reportar
                                </button>
                            </div>
                        </div>
                        <!-- <div class="col-md-5 d-flex align-items-center justify-content-end" v-else>
                        <div class="row">
                            <a href="#photos">
                                <button type="button" class="btn btn-primary">Ver fotos</button>
                            </a>
                        </div>
                    </div> -->
                    </div>
                </div>
                <div class="row" v-if="event._setInterest != null">
                    <div class="col-md-4">
                        <p class="fw-bold">Intereses del evento:</p>
                        <ul class="list-group list-group-horizontal list-unstyled">
                            <li v-for="interest in event._setInterest">
                                <div class="border border-dark rounded-pill ms-2">
                                    <span class="m-2 p-1">{{ interest._sName }}</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="row mt-4 mb-4 bg-dark" v-if="bIsFinished">
                    <p class="text-white mt-2">Este evento ya se ha celebrado.</p>
                </div>
                <div class="row mt-4">
                    <div class="col-md-7">
                        <img class="event-img" v-if="event._headerPhoto != null"
                            :src="'http://localhost:8000/api/getEventHeaderImage/' + event._iId" alt="">
                        <div class="p-3 bg-contrast mt-4">
                            <h5 class="fw-formal">Descripción</h5>
                            <div class="hline"></div>
                            <p class="mt-3 text-block">{{ event._sDescription }}</p>
                        </div>
                    </div>
                    <div class="col-md-1"></div>
                    <div class="col-md-4">
                        <div class="row p-2 bg-contrast">
                            <h5 class="fw-formal">Datos del evento</h5>
                            <div class="hline"></div>
                            <div class="row mt-4">
                                <div class="d-flex justify-content-start">
                                    <font-awesome-icon icon="fa-solid fa-calendar" class="mt-1" />
                                    <p class="ms-2">{{ event._tCelebrationHour }}</p>
                                </div>
                            </div>
                            <div class="row mt-2">
                                <div class="d-flex justify-content-start">
                                    <font-awesome-icon icon="fa-solid fa-clock" class="mt-1" />
                                    <p class="ms-2">{{ moment(event._tCelebratedAt).format('D-M-YYYY') }}</p>
                                </div>
                            </div>
                            <div class="row mt-2">
                                <div class="d-flex justify-content-start">
                                    <font-awesome-icon icon="fa-solid fa-location-dot" class="mt-1" />
                                    <!-- <router-link :to="'https://maps.google.com/?q=' + event._location._latitude + ',' + event._location._longitude">
                                    <p class="ms-2 location-link">{{ event._location._sName }}</p>
                                </router-link> -->
                                    <a class="ms-2" v-if="event._location != null" target="_blank"
                                        :href="'https://maps.google.com/?q=' + event._location._fLatitude + ',' + event._location._fLongitude">{{
                                            event._location._sName }}
                                    </a>
                                    <p class="ms-2" v-else>El evento es online.</p>
                                </div>
                            </div>
                        </div>
                        <div class="row mt-5 p-2 bg-contrast clickable"
                            @click="router.push('/events/' + event._iId + '/assistants')">
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

                    <div class="row mt-3" v-if="bIsFinished">
                        <div class="col-md-7 bg-contrast">
                            <h4 class="fw-formal mt-4">Comentarios</h4>
                            <div class="hline"></div>
                            <div id="commentsBox" ref="commentsBox" class="comments-box mt-4 mb-4">
                                <ul id="commentList" ref="commentList" class="list-unstyled">
                                    <li v-for="comment in aComments">
                                        <div class="row mt-1"
                                            v-if="comment._tDeleteDate === null || userStore.person._sRole === 'Admin'">
                                            <div class="col-sm-1">
                                                <img :src="'http://localhost:8000/api/getProfileImage/' + comment._user._iId"
                                                    @click="router.push('/profile/' + comment._user._sUsername)"
                                                    class="avatar-mini clickable">
                                            </div>
                                            <div class="col-sm-7">
                                                <p class="fw-bold mt-2 clickable"
                                                    @click="router.push('/profile/' + comment._user._sUsername)">{{
                                                        comment._user._sName }}</p>
                                            </div>
                                            <div class="col-sm-3">
                                                <p class="mt-2 small fst-italic" v-if="comment._tDeleteDate != null">
                                                    Borrado, no visible para usuarios</p>
                                            </div>
                                            <div class="col-sm-1">
                                                <font-awesome-icon icon="fa-solid fa-xmark" class="mt-3 clickable"
                                                    v-if="userStore.person._sRole === 'Admin'"
                                                    @click="softDeleteComment(comment)" />
                                            </div>
                                            <p class="text-muted lh-sm">{{ comment._sText }}</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <!-- scrollTop: {{ commentsBox.scrollTop }} -->
                            <!-- <div class="new-comment" contenteditable="true"></div> -->
                            <textarea v-model="sComment" v-if="userStore.person._sRole === 'User'"
                                placeholder="Escribe tu comentario sobre el evento aquí"></textarea>
                            <button @click="submitNewComment" class="btn btn-primary float-end mt-1" v-if="userStore.person._sRole === 'User'">
                                Enviar
                            </button>
                        </div>

                    </div>

                    <div id="photos" class="row bg-contrast mt-3" v-if="bIsFinished">
                        <div class="col-md-3">
                            <h4 class="fw-formal mt-4">Fotos del evento</h4>
                        </div>

                        <div class="col-md-9">
                            <div class="row float-start" v-if="userStore.person._sRole === 'User'">
                                <div class="col-md-8">
                                    <p class="mt-3 float-end">¿Tienes fotos del evento? ¡Compártelas con los demás!</p>
                                </div>
                                <div class="col-md-1">
                                    <input type="file" id="imgUpload" ref="uploadImage" @change="onImageUpload" name="image"
                                        style="display: none;" accept="image/png, image/jpeg" multiple />
                                    <button class="upload-transparent ps-3 pe-3 p-2 mt-3"
                                        onclick="document.getElementById('imgUpload').click();">
                                        <font-awesome-icon icon="fa-solid fa-upload" />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="hline mb-4"></div>
                        <div class="d-flex justify-content-center">
                            <ul class="list-group list-group-horizontal list-unstyled">
                                <li v-for="photo in aEventPhotos">
                                    <div class="blackb d-flex justify-content-center clickable" v-if="photo._tDeleteDate === null || userStore.person._sRole === 'Admin'"
                                        @click="bTriggerFullscreenImage = true; fsImage = photo; bFsImageIsDeleted = fsImage._tDeleteDate === null ? false : true">
                                        <img class="event-image"
                                            :src="'http://localhost:8000/api/getEventImage/' + photo._sName" alt="">
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <Popup v-if="bTriggerFullscreenImage">
                <div class="row">
                    <div class="col-md-12">
                        <font-awesome-icon icon="fa-solid fa-xmark" class="float-end clickable" size="m"
                            style="color: #000000;" @click="bTriggerFullscreenImage = false" />
                    </div>
                    <div class="img-wrapper" v-if="userStore.person._sRole === 'Admin'">
                        <img :src="'http://localhost:8000/api/getEventImage/' + fsImage._sName" class="fsimg p-2" alt="">
                        <button class="btn btn-danger align-self-center del-btn"
                            v-if="!bFsImageIsDeleted" @click="softDeleteOrRestoreImage(fsImage)">
                        Borrar
                        </button>
                        <button class="btn btn-primary align-self-center del-btn"
                            v-else @click="softDeleteOrRestoreImage(fsImage)">
                        Restaurar
                        </button>
                    </div>
                    <div v-else>
                        <img :src="'http://localhost:8000/api/getEventImage/' + fsImage._sName" class="fsimg p-2" alt="">
                    </div>
                </div>
            </Popup>
            <Popup v-if="bTriggerReportPopup">
                <div class="row">
                    <div class="col-md-6">
                        <h4 class="mt-4">Denunciar un evento</h4>
                    </div>
                    <div class="col-md-6">
                        <font-awesome-icon icon="fa-solid fa-xmark" class="float-end clickable" size="sm"
                            style="color: #000000;" @click="bTriggerReportPopup = false" />
                    </div>
                </div>
                <p class="mt-4 fw-light">Incluye a continuación una descripción detallada que indique los motivos de la
                    denuncia.</p>
                <div class="mb-3">
                    <label for="report" class="form-label">Motivo de la denuncia</label>
                    <textarea class="form-control" id="report" rows="3" v-model="sReportDescription"></textarea>
                </div>
                <button type="button" class="btn btn-primary float-end" @click="reportEvent()">Enviar</button>
            </Popup>
        </div>
    </div>
</template>


<script setup>

import HeaderComponent from '@/components/HeaderComponent.vue';
import Popup from '@/components/Popup.vue';
import SidebarFinal from '@/components/SidebarFinal.vue';
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
let aAssistantIds = ref([]);
let aAssistantProfileImages = ref([]);
let bIsAssistant = ref(false);
let bIsFinished = false;
let aEventPhotos = ref([]);
let sComment = ref("");
let aComments = ref([]);
let bTriggerReportPopup = ref(false);
let sReportDescription = ref("");
let bTriggerFullscreenImage = ref(false);
let fsImage = ref(null);
let bFsImageIsDeleted = ref(false);

let formData = new FormData();
let uploadImage = ref(null);
let commentsBox = ref(null);



onMounted(() => {
    axios.get("http://localhost:8000/api/getEvent/" + route.params.eventId)
        .then(response => {
            event.value = response.data;
            console.log(event.value)
            console.log("Fecha evento: " + event.value._tCelebratedAt + " Fecha hoy: " + Date.now())
            if (moment(event.value._tCelebratedAt).isBefore(moment(Date.now()))) {
                bIsFinished = true;
                console.log(bIsFinished)
            }
            // console.log(response.data)
            bIsFetching.value = false;
            axios.get("http://localhost:8000/api/getEventAssistantIds/" + event.value._iId)
                .then(response => {
                    aAssistantIds.value = response.data.slice(0, 5); // 5 primeros usuarios
                    aAssistantIds.value.forEach(iId => aAssistantProfileImages.value.push("http://localhost:8000/api/getProfileImage/" + iId));
                    if (response.data.some((iId) => iId === userStore.person._iId))
                        bIsAssistant.value = true;
                })
            // Si el evento ha finalizado
            if (bIsFinished) {
                axios.get("http://localhost:8000/api/getEventPhotos/" + event.value._iId)
                    .then(response => {
                        aEventPhotos.value = response.data;
                    })
                axios.get("http://localhost:8000/api/getEventComments/" + event.value._iId)
                    .then(response => {
                        aComments.value = response.data;
                        setTimeout(() => {
                            commentsBox.value.scrollTop = commentsBox.value.scrollHeight;
                        }, 500);
                    })
            }
        })

})

function reportEvent() {
    axios.post("http://localhost:8000/api/newTicket", {
        sSubject: "Denuncia de evento con título " + event.value._sTitle,
        sDescription: sReportDescription.value,
        iIssuerId: userStore.person._iId,
        iReportedId: -1,
        iEventId: event.value._iId,
        iPostId: -1,
        sCategory: 'Denunciar un evento'
    })
        .then(response => {
            console.log(response.data)
            bTriggerReportPopup.value = false;
            sReportDescription.value = "";
        })
}

function softDeleteEvent() {
    axios.patch("http://localhost:8000/api/softDeleteOrRestoreEvent/" + event.value._iId)
        .then(response => {
            if (response.data) {     // true, existe fecha borrado => evento borrado
                axios.post("http://localhost:8000/api/newOperation", {
                    sInformation: "Se ha eliminado un evento del usuario @" + event.value._organizer._sUsername + ". ID del evento: " +
                        event.value._iId,
                    iAdminId: userStore.person._iId
                })
                axios.post("http://localhost:8000/api/newNotification", {
                    sInfo: "Uno de los eventos que has creado ha sido eliminado por no cumplir con nuestras normas de comportamiento.",
                    iRecipientId: event.value._organizer._iId,
                    iIssuerId: userStore.person._iId,
                    iPostId: -1,
                    iEventId: event.value._iId,
                    sType: "BehaviorWarning"
                })

            } else {
                axios.post("http://localhost:8000/api/newOperation", {
                    sInformation: "Se ha restaurado un evento del usuario @" + comment._user._sUsername + ". ID del evento: " +
                        event.value._iId,
                    iAdminId: userStore.person._iId
                })
                axios.post("http://localhost:8000/api/newNotification", {
                    sInfo: "Uno de tus eventos que había sido eliminado ha sido restaurado. Disculpa las molestias.",
                    iRecipientId: event.value._organizer._iId,
                    iIssuerId: userStore.person._iId,
                    iPostId: -1,
                    iEventId: event.value._iId,
                    sType: "Announcement"
                })
            }
        })
}

function softDeleteComment(comment) {
    axios.patch("http://localhost:8000/api/softDeleteOrRestoreComment/" + comment._iId)
        .then(response => {
            if (response.data) {     // true, existe fecha borrado => comentario borrado
                axios.post("http://localhost:8000/api/newOperation", {
                    sInformation: "Se ha eliminado un comentario del usuario @" + comment._user._sUsername + ", publicado en el evento con ID " +
                        event.value._iId + ". Texto del comentario: " + comment._sText,
                    iAdminId: userStore.person._iId
                })
                axios.post("http://localhost:8000/api/newNotification", {
                    sInfo: "Uno de tus comentarios publicado en un evento ha sido eliminado por no cumplir con nuestras normas de comportamiento.",
                    iRecipientId: comment._user._iId,
                    iIssuerId: userStore.person._iId,
                    iPostId: -1,
                    iEventId: event.value._iId,
                    sType: "BehaviorWarning"
                })
                let iIndexToModify = aComments.value.findIndex(item => item._iId === comment._iId);
                aComments.value[iIndexToModify]._tDeleteDate = moment(Date.now());

            } else {
                axios.post("http://localhost:8000/api/newOperation", {
                    sInformation: "Se ha restaurado un comentario del usuario @" + comment._user._sUsername + ", publicado en el evento con ID " +
                        event.value._iId + ". Texto del comentario: " + comment._sText,
                    iAdminId: userStore.person._iId
                })
                axios.post("http://localhost:8000/api/newNotification", {
                    sInfo: "Uno de tus comentarios que había sido eliminado ha sido restaurado. Disculpa las molestias.",
                    iRecipientId: comment._user._iId,
                    iIssuerId: userStore.person._iId,
                    iPostId: -1,
                    iEventId: event.value._iId,
                    sType: "Announcement"
                })
                let iIndexToModify = aComments.value.findIndex(item => item._iId === comment._iId);
                aComments.value[iIndexToModify]._tDeleteDate = null;
            }
        })
}

function softDeleteOrRestoreImage(image) {
    let bIsDeleted = null;
    axios.get("http://localhost:8000/api/getUploader/" + image._iId)
    .then(response => {
        if(response.data._iId != 0) {
            let iIndex = aEventPhotos.value.findIndex(item => image._iId === item._iId);
            userStore.softDeleteOrRestoreImage(image._iId, response.data._iId, response.data._sUsername, false, event._iId);
            //Si la imagen no tiene fecha de borrado, y se acaba de borrar, bIsDeleted debe ser true para establecer la fecha de borrado sin necesidad de petición extra para mostrar reactividad
            let bIsDeleted = image._tDeleteDate === null ? true : false;
            if(bIsDeleted) {
                aEventPhotos.value[iIndex]._tDeleteDate = moment(Date.now());
            } else {
                aEventPhotos.value[iIndex]._tDeleteDate = null;
            }
            console.log("Antes " + bFsImageIsDeleted.value)
            bFsImageIsDeleted.value = bIsDeleted; 
            console.log("Despues s" + bFsImageIsDeleted.value)
        }
        })
}

function setAssist() {
    axios.patch("http://localhost:8000/api/setAssist/" + event.value._iId + "/" + userStore.person._iId)
        .then(response => {
            bIsAssistant.value = response.data;
            if (bIsAssistant.value == false) {
                let iIndex = aAssistantProfileImages.value.indexOf("http://localhost:8000/api/getProfileImage/" + userStore.person._iId);
                aAssistantProfileImages.value.splice(iIndex, 1);
            } else {
                aAssistantProfileImages.value.push("http://localhost:8000/api/getProfileImage/" + userStore.person._iId);
                axios.post("http://localhost:8000/api/newNotification", {
                    sInfo: "¡" + userStore.person._sName + " se ha apuntado para participar en tu evento!",
                    iRecipientId: event.value._organizer._iId,
                    iIssuerId: userStore.person._iId,
                    iEventId: event.value._iId,
                    sType: "NewEventAssistant"
                })
            }
        })
}



function onImageUpload() {
    formData = new FormData();

    console.log("Numero de archivos: " + uploadImage.value.files.length);
    for (let i = 0; i < uploadImage.value.files.length; i++) {
        let file = uploadImage.value.files[i];
        formData.append("file[]", file);
    }
    uploadImg()
}

async function uploadImg() {
    formData.append('id', event.value._iId);
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
function submitNewComment() {
    console.log("Se envia")
    if (sComment.value != "" && bIsFinished) {
        axios.post("http://localhost:8000/api/newComment", {
            iUserId: userStore.person._iId,
            iEventId: event.value._iId,
            sText: sComment.value
        })
            .then(response => {
                aComments.value.push(response.data);
                sComment.value = "";
                console.log(response.data);
                setTimeout(() => {
                    commentsBox.value.scrollTop = commentsBox.value.scrollHeight;
                }, 150);
                aAssistantIds.value.forEach(iId => {
                    if (iId != userStore.person._iId) {
                        axios.post("http://localhost:8000/api/newNotification", {
                            sInfo: "¡" + userStore.person._sName + " ha publicado un comentario en un evento en el que has participado!",
                            iRecipientId: event.value._organizer._iId,
                            iIssuerId: userStore.person._iId,
                            sType: "NewEventComment",
                            iEventId: event.value._iId
                        })
                    }
                })
            })
    } else {
        //mensaje error
    }
}
</script>

<style scoped>
.blackb {
    border: solid 1px black;
}

.hline {
    border-bottom: solid 1px #777;
}

.text-block {
    white-space: pre;
}

.comments-box {
    /* border: solid 1px rgb(160, 160, 160); */
    border: none;
    background-color: white;
    height: 350px;
    max-height: 350px;
    width: auto;
    padding: 25px;
    overflow-y: scroll;
    scrollbar-width: thin;
}

.new-comment {
    border: solid 2px rgb(160, 160, 160);
    height: 35px;
    max-height: 35px;
    padding: 25px;
    width: auto;
}

textarea {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    width: 100%;
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

.avatar-mini {
    border-radius: 50%;
    width: 35px;
    height: 35px;
}

.bg-contrast {
    background-color: rgb(245, 245, 245);
}

.bg-dark {
    background-color: rgb(60, 60, 60);
}

.list-group {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
}

.upload-transparent {
    background-color: transparent;
    border: none;
    /* border: solid 1px black;
    border-radius: 3px;
    padding-right: 10px;
    padding-left: 10px;
    padding-top: 5px;
    padding-bottom: 5px; */
}

.upload-transparent:hover {
    background-color: rgb(108, 205, 243);
    border: none;
    border-radius: 5px;
    /* border: solid 1px black;
    border-radius: 3px;
    padding-right: 10px;
    padding-left: 10px;
    padding-top: 5px;
    padding-bottom: 5px; */
}

.event-image {
    object-fit: contain;
    max-height: 150px;
    width: auto;
}

.location-link {
    color: blue;
}

.fsimg {
    /* height: 70vh;
    width: auto; */
    align-self: center;
    justify-self: center;
    object-fit: contain;
}

.img-wrapper {
    position: relative;
    width: 70vh;
    height: 70vh;
    max-height: 600px;
    display: inline-block;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;
}

.img-wrapper:before {
    /* empty pseudo */
    content: '';

    /* start transparent, include a transition bcuz */
    opacity: 0;
    transition: opacity 0.5s ease;

    /* covers the whole div */
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: transparent;
    z-index: 2;
}

.img-wrapper:hover:before {
    opacity: 1;
    background-color: transparent;
}

.img-wrapper img {
    position: absolute;
    display: block;
    max-width: 100%;
    height: auto;
    z-index: 1;
    background-color: transparent;
}

.del-btn {
    opacity: 0;
    transition: opacity 0.5s ease;
    position: relative;
    padding: 0 40px;
    height: 40px;
    line-height: 40px;
    max-width: 260px;
    cursor: pointer;
    z-index: 3;
}

.img-wrapper:hover .del-btn {
    opacity: 1;
}

.blackb {
    border: solid 1px black;
}
</style>