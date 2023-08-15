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
                    <div class="col-md-3 bg-contrast p-2 m-2 mt-4">
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
                <div v-if="!bIsFinished">
                    <div class="col-md-8 d-flex align-items-center justify-content-end" v-if="userStore.person._iId != event._organizer._iId">
                        <button type="button" class="btn btn-outline-primary me-5" v-if="!bIsAssistant" @click="setAssist">Participar</button>
                        <button type="button" class="btn btn-primary me-5" v-else @click="setAssist">No participar</button>
                    </div>
                </div>
                <div v-else>    
                    <div class="col-md-5 d-flex align-items-center justify-content-end">
                        <a href="#photos">
                            <button type="button" class="btn btn-primary">Ver fotos</button>
                        </a>
                    </div>
                </div>
            </div>
        </div>
        <div class="row mt-4 mb-4 bg-dark" v-if="!bIsFinished">
                <p class="text-white mt-2">Este evento ya se ha celebrado.</p>
        </div>
        <div class="row mt-4">
            <div class="col-md-7">
                <img class="event-img" v-if="event._headerPhoto != null" :src="'http://localhost:8000/api/getEventHeaderImage/' + event._iId" alt="">
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
                            v-if="event._location != null"
                            target="_blank"
                            :href="'https://maps.google.com/?q=' + event._location._fLatitude + ',' + event._location._fLongitude">{{ event._location._sName }}
                        </a>
                        <p class="ms-2" v-else>El evento es online.</p>
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

        <div class="row mt-3">
            <div class="col-md-7 bg-contrast">
                <h4 class="fw-formal mt-4">Comentarios</h4>
                <div class="hline"></div>
                <div id="commentsBox" ref="commentsBox" class="comments-box mt-4 mb-4">
                    <ul id="commentList" ref="commentList" class="list-unstyled">
                        <li v-for="comment in aComments">
                            <div class="row mt-1">
                                <div class="col-sm-1">
                                    <img :src="'http://localhost:8000/api/getProfileImage/' + comment._user._iId" 
                                     @click="router.push('/profile/' + comment._user._sUsername)" class="avatar-mini clickable">
                                </div>
                                <div class="col-sm-7">
                                    <p class="fw-bold mt-2 clickable" @click="router.push('/profile/' + comment._user._sUsername)">{{ comment._user._sName }}</p>
                                </div>
                                <p class="text-muted lh-sm">{{ comment._sText }}</p>
                            </div>
                        </li>
                    </ul>
                </div>
                <!-- scrollTop: {{ commentsBox.scrollTop }} -->
                <!-- <div class="new-comment" contenteditable="true"></div> -->
                <textarea v-model="sComment" placeholder="Escribe tu comentario sobre el evento aquí"></textarea>
                <button @click="submitNewComment" class="btn btn-primary float-end mt-1">Enviar</button>
            </div>

        </div>

        <div id="photos" class="row bg-contrast mt-3">
            <div class="col-md-3">
                <h4 class="fw-formal mt-4">Fotos del evento</h4>
            </div>
            
            <div class="col-md-9">
                    <div class="row float-start">
                    <div class="col-md-8">
                        <p class="mt-3 float-end">¿Tienes fotos del evento? ¡Compártelas con los demás!</p>
                    </div>
                    <div class="col-md-1">
                        <input type="file"  id="imgUpload" ref="uploadImage" @change="onImageUpload" name="image" style="display: none;"
                        accept="image/png, image/jpeg" multiple /> 
                        <button class="upload-transparent ps-3 pe-3 p-2 mt-3" onclick="document.getElementById('imgUpload').click();">
                            <font-awesome-icon icon="fa-solid fa-upload" />
                        </button>
                    </div>
                </div>
            </div>
            <div class="hline mb-4"></div>
            <div class="d-flex justify-content-center">
                <ul class="list-group list-group-horizontal list-unstyled">
                    <li v-for="photo in aEventPhotos">
                        <div class="blackb d-flex justify-content-center">
                            <img class="event-image" :src="'http://localhost:8000/api/getEventImage/' + photo._sName" alt="">
                        </div>
                    </li>
                </ul>
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
let aAssistantIds = ref([]);
let aAssistantProfileImages = ref([]);
let bIsAssistant = ref(false);
let bIsFinished = false;
let aEventPhotos = ref([]);
let sComment = ref("");
let aComments = ref([]);

let formData = new FormData();
let uploadImage = ref(null);
let commentsBox = ref(null);



onMounted(() => {
    axios.get("http://localhost:8000/api/getEvent/" + route.params.eventId)
    .then(response => {
        event.value = response.data;
        console.log(response.data)
        if(event.value._tCelebratedAt < Date.now()) {
            bIsFinished = true;
        }
        // console.log(response.data)
        bIsFetching.value = false;
        axios.get("http://localhost:8000/api/getEventAssistantIds/" + event.value._iId)
        .then(response => {
            aAssistantIds.value = response.data.slice(0, 5); // 5 primeros usuarios
            aAssistantIds.value.forEach(iId => aAssistantProfileImages.value.push("http://localhost:8000/api/getProfileImage/" + iId));
            if(response.data.some((iId) => iId === userStore.person._iId))
                bIsAssistant.value = true;
        }) 
    // Si el evento ha finalizado
    // if(bIsFinished) {
        bIsFinished = true;
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
    // }
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
    console.log("holdsadasdsadsasadsad")
  formData.append('id', event.value._iId);
  axios.post("http://localhost:8000/api/uploadEventImages", formData, {
    'content-type': 'form-data'
  })
  .then(response =>{ 
    console.log(response.data);
    axios.get("http://localhost:8000/api/getEventPhotos/" + event.value._iId)
        .then(response => {
            aEventPhotos.value = response.data;
        })
})
}
function submitNewComment() {
    console.log("Se envia")
    if(sComment.value != "" && bIsFinished) {
        axios.post("http://localhost:8000/api/newComment", {
            iUserId: userStore.person._iId,
            iEventId: event.value._iId,
            sText: sComment.value
        })
        .then(response => {
            aComments.value.push(response.data);
            console.log(response.data)
            commentsBox.value.scrollTop = commentsBox.value.scrollHeight;
        })
    } else {
        //mensaje error
    }
}
</script>

<style scoped>

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

.blackb {
    border: solid 1px black;
}

</style>