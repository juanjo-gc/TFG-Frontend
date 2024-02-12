<template>
    <SidebarFinal></SidebarFinal>
    <div class="container mb-4" ref="main" v-if="!bIsFetching">
        <h2 class="mt-4">Ticket: {{ ticket._sSubject }}</h2>
        <div class="hline"></div>
        <div class="row mt-4 mb-2 p-2 closed" v-if="!ticket._bIsOpen">
            <p class="fw-light mt-2">Este ticket está cerrado.</p>
        </div>
        <div class="row mt-2 p-2">
            <div class="col-md-2">
                <p class="fw-light mt-3 float-end">Enviado por: </p>
            </div>
            <div class="col-md-1">
                <img class="avatar ms-4" :src="'http://localhost:8000/api/getProfileImage/' + ticket._issuer._iId" />
            </div>
            <div class="col-md-3">
                <p class="mt-3 float-start">@{{ ticket._issuer._sUsername }}</p>
            </div>
            <div class="col-md-4" v-if="userStore.person._sRole === 'Admin'">
                <button type="button" class="btn btn-danger mt-2 float-end" v-if="ticket._bIsOpen"
                    @click="openCloseTicket()">
                    Cerrar ticket
                </button>
                <button type="button" class="btn btn-primary" v-else @click="openCloseTicket()">
                    Reabrir ticket
                </button>
            </div>
        </div>
        <h5 class="mt-2">Descripción del ticket:</h5>
        <div class="hline"></div>
        <div class="row mt-4">
            <p class="p-2 fw-light ms-4">{{ ticket._sDescription }}</p>
            <div class="row mt-2" v-if="ticket._post != null">
                <div class="d-flex justify-content-center">
                    <div class="dt-element mt-2">
                        <PostComponent :post="ticket._post" :admin="true"></PostComponent>
                    </div>
                </div>
                <div class="col-md-5"></div>
                <div class="col-md-2" v-if="userStore.person._sRole === 'Admin'">
                    <button type="button" class="btn btn-danger" @click="deleteRestorePost(true)"
                        v-if="!bIsDeleted">Eliminar publicacion</button>
                    <button type="button" class="btn btn-primary" @click="deleteRestorePost(false)" v-else>Restaurar
                        publicacion</button>
                </div>
            </div>
            <div class="row mt-2" v-if="ticket._event != null">
                <div class="d-flex justify-content-center">
                    <div class="dt-element mt-2">
                        <p class="fs-4">Resumen del evento:</p>
                        <div class="row mt-2 p-2" style="border: solid 1px rgb(148, 148, 148)">
                            <div class="col-md-8">
                                <p class="fs-5">{{ ticket._event._sTitle }}</p>
                            </div>
                            <div class="col-md-4">
                                <p class="mt-2">Fecha evento: {{ moment(ticket._event._tCelebratedAt).format("DD/MM/YYYY")
                                }}</p>
                            </div>
                            <p class="fw-light mt-2">{{ ticket._event._sDescription }}</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-5"></div>
                <div class="col-md-2" v-if="userStore.person._sRole === 'Admin'">
                    <button type="button" class="btn btn-primary mt-3"
                        @click="router.push('/events/' + ticket._event._iId)">Moderar evento</button>
                </div>
            </div>
            <div class="row mt-2" v-if="ticket._reported != null && ticket._category._sName === 'Denunciar un usuario'">
                <div class="d-flex justify-content-center">
                    <div class="dt-element border border-secondary p-3">
                        <p class="fw-bold">Datos del usuario:</p>
                        <div class="row">
                            <div class="col-md-2"><strong>ID: </strong>{{ ticket._reported._iId }}</div>
                            <div class="col-md-6"><strong>Nombre de usuario: </strong> @{{ ticket._reported._sUsername }}
                            </div>
                            <div class="col-md-4"><strong>Nombre: </strong>{{ ticket._reported._sName }}</div>
                        </div>
                        <p class="mt-4" v-if="ticket._reported._sDescription != null"><strong>Descripción: </strong>{{
                            ticket._reported._sDescription }}</p>
                    </div>
                </div>
                <div class="col-md-5"></div>
                <div class="col-md-2 mt-4">
                    <button type="button" class="btn btn-primary"
                        @click="router.push('/admin/manage/users/' + ticket._reported._iId)">Gestionar perfil</button>
                </div>
            </div>
            <!-- <div class="d-flex mt-2 justify-content-center" v-if="ticket._event != null">
                <div class="dt-element mt-2">
                    <div class="media m-2">
                        <div class="row">
                            <div class="col-md-7">
                                <h5 class="mt-0 mb-1">
                                    <router-link :to="`/events/${ticket._event._iId}`"
                                        style="text-decoration: none; color: inherit;">
                                        {{ ticket.event._sTitle }}
                                    </router-link>
                                </h5>
                                <h6>
                                    <p class="text-muted">Organizado por: @{{ ticket.event._organizer._sUsername }}</p>
                                </h6>
                            </div>
                        </div>
                        <div class="media-body">
                            <router-link :to="`/events/${ticket._event._iId}`"
                                style="text-decoration: none; color: inherit;">
                                <div>
                                    <p v-if="ticket.event._sDescription.length <= 250">{{ ticket.event._sDescription }}</p>
                                    <p v-else>{{ proccessDescription(ticket.event._sDescription) }}...</p>
                                </div>
                            </router-link>
                            <div class="row">
                                <div class="col-md-6"></div>
                                <div class="col-md-6">
                                    <small class="text-muted float-end" style="margin-top: 10px;">
                                        Fecha del evento: {{ moment(ticket.event._tCelebratedAt).format('D-M-YYYY') }}
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> -->
            <img :src="'http://localhost:8000/api/getTicketImage/' + ticket._iId" alt="img" class="ticket-reply-image"
                v-if="ticket._imagePath != null" @click="setFsImage(true, ticket._iId)" />
            <div class="row mb-4">
                <div class="col-md-4">
                    <h4 class="mt-4">Respuestas</h4>
                    <div class="hline"></div>
                </div>
                <p class="mt-4 fs-5 fw-light" v-if="aReplies.length === 0">Aún no hay respuestas para este ticket.</p>
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
                        <img :src="'http://localhost:8000/api/getReplyImage/' + reply._iId" alt="img"
                            class="ticket-reply-image" v-if="reply._imagePath != null"
                            @click="setFsImage(false, reply._iId)" />
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
                    <p class="mt-2 fw-light float-end" v-if="sFilename != ''"><strong>Imagen seleccionada:</strong> {{
                        sFilename }}</p>
                </div>
            </div>
            <Popup v-if="fsImage.bIsTicketImage || fsImage.bIsReplyImage">
                <div class="row mt-2">
                    <div class="col-md-10"></div>
                    <div class="col-md-2">
                        <button type="button" class="btn btn-transparent float-end" @click="fsImage.bIsTicketImage = false"
                        v-if="fsImage.bIsTicketImage">
                        <font-awesome-icon icon="fa-solid fa-xmark" />
                    </button>
                </div>
                <div class="col-md-10"></div>
                    <div class="col-md-2">
                    <button type="button" class="btn btn-transparent float-end" @click="fsImage.bIsReplyImage = false"
                        v-if="fsImage.bIsReplyImage">
                        <font-awesome-icon icon="fa-solid fa-xmark" />
                    </button>
                    </div>
                </div>
                <div class="d-flex justify-content-center">
                    <div class="img-wrapper d-flex justify-content center">
                        <img :src="fsImage.sLink" alt="img" class="fs-image p-4" />
                    </div>
                </div>
            </Popup>
        </div>
    </div>
</template>

<script setup>
import Popup from '@/components/Popup.vue';
import SidebarFinal from '@/components/SidebarFinal.vue'
import { useUserStore } from '@/store/UserStore';
import axios from 'axios';
import moment from 'moment';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import PostComponent from '@/components/PostComponent.vue';

const userStore = useUserStore();
const route = useRoute();
const router = useRouter();
let ticket = ref(null);
let aReplies = ref([]);
let bIsFetching = ref(true);
let sReply = ref("");
let iReplyId = 0;
let bIsDeleted = ref(false);

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
            if (ticket.value._iId != 0) {
                axios.get("http://localhost:8000/api/getTicketReplies/" + ticket.value._iId)
                    .then(response => {
                        aReplies.value = response.data;
                        bIsFetching.value = false;
                        setTimeout(() => {
                            window.scrollTo(0, document.body.scrollHeight)
                        }, 500);
                    })
                if (ticket.value._post != null) {
                    if (ticket.value._post._tDeleteDate != null)
                        bIsDeleted.value = true;
                }
            }
        })
})

function deleteRestorePost(bWantToDelete) {
    if (bWantToDelete) {
        userStore.softDeleteRestorePost(ticket.value._post._iId, ticket.value._post._user._iId,
            ticket.value._post._user._sUsername, ticket.value._post._sText, false);
        ticket.value._tDeleteDate = Date.now();
        bIsDeleted.value = true;

    }
    else {
        userStore.softDeleteRestorePost(ticket.value._post._iId, ticket.value._post._user._iId,
            ticket.value._post._user._sUsername, ticket.value._post._sText, true)
        ticket.value._tDeleteDate = null;
        bIsDeleted.value = false;
    }
    // if(userStore.softDeleteRestorePost(ticket.value._post._iId, ticket.value._post._user._iId,
    // ticket.value._post._user._sUsername, ticket.value._post._sText, bWantToDelete ? false : true))
    //         ticket.value._tDeleteDate = Date.now();
    // else
    //     ticket.value._tDeleteDate = null;
}

async function sendReply() {
    if (ticket.value._bIsOpen && !isBlank(sReply.value))
        axios.post("http://localhost:8000/api/newReply", {
            sText: sReply.value,
            iPersonId: userStore.person._iId,
            iTicketId: ticket.value._iId
        })
            .then(response => {
                let reply = response.data;
                sReply.value = '';
                if (uploadImage.value.files[0] != null) {
                    formData.append('id', response.data._iId)
                    axios.post("http://localhost:8000/api/uploadReplyImage", formData, {
                        'content-type': 'form-data'
                    })
                    .then(response => {
                        reply._imagePath = response.data;
                        aReplies.value.push(reply);

                    })
                } else {
                    aReplies.value.push(reply);
                }
                setTimeout(() => {
                    main.value.scrollTop = main.value.scrollHeight;
                }, 500);
            })
}

function setFsImage(bIsTicketImage, iId) {
    if (bIsTicketImage) {
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
    formData.append('id', iId)
    let image = await axios.post("http://localhost:8000/api/uploadReplyImage", formData, {
        'content-type': 'form-data'
    });
    // axios.post("http://localhost:8000/api/uploadReplyImage", formData, {
    //     'content-type': 'form-data'
    // })
    //     .then(response => {
    //         sFilename.value = "";
    //         image = response.data;
    //     })
    // setTimeout(() => {
    //     return image;
    // }, 250);
    console.log(image.data)
    return image.data;
}

function isBlank(str) {
    let bIsBlank = true;
    let i = 0;
    while (i < str.length && bIsBlank) {
        if (str.charAt(i) != ' ')
            bIsBlank = false;
        i++;
    }
    return bIsBlank;
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

.dt-element {
    width: 60%;
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
    height: 100%;
    width: auto;
    object-fit: contain;
    object-position: top center;
}

.ticket-reply-image:hover {
    cursor: pointer;
}

.img-wrapper {
    height: 60vh;
    width: 60vw;
    max-height: 100%;
    max-width: 100%;
    justify-content: center;
}

</style>