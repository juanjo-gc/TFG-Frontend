<template>
    <div class="container mb-4" ref="main" v-if="!bIsFetching">
        <h2 class="mt-4">Ticket: {{ ticket._sSubject }}</h2>
        <div class="hline"></div>
        <div class="row mt-4 mb-2 p-2 closed" v-if="!ticket._bIsOpen">
            <p class="fw-light mt-2">Este ticket está cerrado.</p>
        </div>
        <div class="row mt-2">
            <div class="col-md-1">
                <p class="fw-light mt-3 float-end">Enviado por: </p>
            </div>
            <div class="col-md-1">
                <img class="avatar ms-4" :src="'http://localhost:8000/api/getProfileImage/' + ticket._issuer._iId" />
            </div>
            <div class="col-md-3">
                <p class="mt-3 float-start">@{{ ticket._issuer._sUsername }}</p>
            </div>
            <div class="col-md-4 float-end" v-if="userStore.person._sRole === 'Admin'">
                <button type="button" class="btn btn-primary" v-if="ticket._bIsOpen"  @click="openCloseTicket()">
                    Cerrar ticket
                </button>
                <button type="button" class="btn btn-primary" v-else  @click="openCloseTicket()">
                    Reabrir ticket
                </button>
            </div>
        </div>
        <div class="row mt-2 text-box">
            <p class="p-2 fw-light">{{ ticket._sDescription }}</p>
            <img :src="'http://localhost:8000/api/getTicketImage/' + ticket._iId"  alt="img" class="ticket-reply-image" v-if="ticket._imagePath != null" @click="setFsImage(true, ticket._iId)" />
        </div>
        <div class="row mb-4">
            <div class="col-md-4">
                <h4 class="mt-4">Respuestas</h4>
                <div class="hline"></div>
            </div>
        </div>
        <ul class="list-unstyled">
            <li v-for="reply in aReplies">
                <div class="row mt-2 text-box p-2">
                    <div class="col-md-4">
                        <div class="row">
                            <div class="col-md-1">
                                <font-awesome-icon icon="fa-solid fa-reply"
                                    class="fa-flip-horizontal fa-flip-vertical mt-3" />
                            </div>
                            <div class="col-md-7">
                                <p class="mt-3 fw-bold">@{{ reply._person._sUsername }} respondió:</p>
                            </div>
                        </div>
                    </div>
                    <p class="ms-2 fw-light">{{ reply._sText }}</p>
                    <img :src="'http://localhost:8000/api/getReplyImage/' + reply._iId"
                      alt="img" class="ticket-reply-image" v-if="reply._imagePath != null" @click="setFsImage(false, reply._iId)" />

                </div>
            </li>
        </ul>
        <div class="row mt-4" v-if="ticket._bIsOpen">
            <div class="col-md-4 mt-4">
                <h4>Responder:</h4>
                <div class="hline"></div>
            </div>
            <div class="mt-4">
                <textarea class="form-control" id="description" rows="4" v-model="sReply"></textarea>
            </div>
            <div class="col-md-7"></div>
            <div class="col-md-2">
                <p class="mt-3 fw-light float-end">Subir imagen:</p>
            </div>
            <div class="col-md-1">
                <input type="file" id="imgUpload" ref="uploadImage" @change="onImageUpload" name="image"
                    style="display: none;" accept="image/png, image/jpeg" />

                <button class="upload-transparent ps-3 pe-3 p-2 mt-2 float-start"
                    onclick="document.getElementById('imgUpload').click();">
                    <font-awesome-icon icon="fa-solid fa-upload" />
                </button>
            </div>
            <div class="col-md-2">
                <button type="button" class="btn btn-primary mt-3 float-end" @click="sendReply">Enviar</button>
            </div>
        </div>
        <div class="row">
            <div class="col-md-10">
                <p class="mt-2 fw-light float-end" v-if="sFilename != ''"><strong>Imagen seleccionada:</strong> {{ sFilename }}</p>
            </div>
        </div>
        <Popup v-if="fsImage.bIsTicketImage || fsImage.bIsReplyImage">
            <div class="row mt-2">
                <button type="button" class="btn btn-transparent float-end" @click="fsImage.bIsTicketImage = false" v-if="fsImage.bIsTicketImage">
                    <font-awesome-icon icon="fa-solid fa-xmark" />
                </button>
                <button type="button" class="btn btn-transparent float-end" @click="fsImage.bIsReplyImage = false" v-if="fsImage.bIsReplyImage">
                    <font-awesome-icon icon="fa-solid fa-xmark" />
                </button>
            </div>
            <img :src="fsImage.sLink"  alt="img" class="fs-image p-4" />
        </Popup>
    </div>
</template>

<script setup>
import Popup from '@/components/Popup.vue';
import { useUserStore } from '@/store/UserStore';
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const userStore = useUserStore();
const route = useRoute();
let ticket = ref(null);
let aReplies = ref([]);
let bIsFetching = ref(true);
let sReply = ref("");
let iReplyId = 0;

let main = ref(null);
let uploadImage = ref(null);
let formData = new FormData();
let sFilename = ref("");

let fsImage = ref({
    bIsTicketImage: false,
    bIsReplyImage: false,
    sLink: ""
})

onMounted(() => {
    axios.get("http://localhost:8000/api/getTicket/" + route.params.ticketId)
        .then(response => {
            ticket.value = response.data;
            console.log(ticket.value)
            if (ticket.value._iId != 0) {
                axios.get("http://localhost:8000/api/getTicketReplies/" + ticket.value._iId)
                    .then(response => {
                        aReplies.value = response.data;
                        bIsFetching.value = false;
                        setTimeout(() => {
                            window.scrollTo(0, document.body.scrollHeight)   
                        }, 500);
                    })
            }
        })
})

function sendReply() {
    console.log("Se envia " + console.log(ticket.value._bIsOpen))
    if(ticket.value._bIsOpen)
        axios.post("http://localhost:8000/api/newReply", {
            sText: sReply.value,
            iPersonId: userStore.person._iId,
            iTicketId: ticket.value._iId
        })
            .then(response => {
                aReplies.value.push(response.data);
                sReply.value = '';
                if(uploadImage.value.files[0] != null)
                    uploadImg(response.data._iId);
                setTimeout(() => {
                    main.value.scrollTop = main.value.scrollHeight;
                }, 500);
            })
}

function setFsImage(bIsTicketImage, iId) {
    if(bIsTicketImage){
        fsImage.value.bIsTicketImage = true;
        fsImage.value.sLink = "http://localhost:8000/api/getTicketImage/" + iId
    } else {
        fsImage.value.bIsReplyImage = true;
        fsImage.value.sLink = 'http://localhost:8000/api/getReplyImage/' + iId    
    } 
    console.log(fsImage.sLink)
}

function openCloseTicket() {
    axios.patch("http://localhost:8000/api/openCloseTicket/" + ticket.value._iId)
    .then(response => ticket.value._bIsOpen = response.data);
}


function onImageUpload() {
    formData = new FormData();

    // console.log(uploadImage.value.files[0].name);
    let file = uploadImage.value.files[0];
    sFilename.value = file.name;
    formData.append("file", file);
    console.log(formData.get('file').name)
}

async function uploadImg(iId) {
    formData.append('id', iId);
    axios.post("http://localhost:8000/api/uploadReplyImage", formData, {
        'content-type': 'form-data'
    })
    .then(response => {
        console.log("Imagen bien subida?" + response.data);
    })
}

</script>


<style scoped>
.blackb {
    border: solid 1px black;
}

.text-box {
    border: solid 1px rgb(140, 140, 140);
}

.hline {
    border-bottom: solid 1px black;
}

.closed {
    background-color: rgb(85, 85, 85);
    color: white;
}

.avatar {
    border-radius: 50%;
    width: 50px;
    height: 50px;
}


.upload-transparent {
    background-color: transparent;
    border: none;
}

.ticket-reply-image {
    max-height: 200px;
    max-width: 500px;
    object-fit: contain;
}

.fs-image {
    height: 95vh;
    width: auto;
    object-fit: cover;
    object-position: top center;
}

.ticket-reply-image:hover {
    cursor: pointer;
}
</style>