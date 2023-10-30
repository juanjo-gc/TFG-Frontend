<template>
    <div class="container">
        <h2 class="mt-4">Gestionar usuarios</h2>
        <div class="hline"></div>
        <button @click="userStore.logout()">logout</button>
        <div class="row">
            <div class="col-md-5">
                <h4 class="mt-4">Datos del usuario</h4>
                <div class="hline"></div>
                <div class="form-group field mt-4">
                    <div class="row">
                        <div class="col-md-6">
                            <input type="input" class="form-field ms-2" placeholder="Asunto" name="username" id='username'
                                v-model="sUsernameToSearch" @keyup="searchUsers()" />
                            <label for="username" class="form-label">Nombre del usuario...</label>
                        </div>
                        <div class="col-md-6" v-if="userToDisplay != null">
                            <button type="button" class="btn btn-danger mt-2 float-end" v-if="!userToDisplay._bIsSuspended"
                                @click="suspendReactivateAccount(1)">Suspender cuenta</button>
                            <button type="button" class="btn btn-primary mt-2 float-end" v-else
                                @click="suspendReactivateAccount(0)">Reactivar cuenta</button>
                        </div>
                    </div>
                </div>
                <div v-if="aUsers.length != 0 && sUsernameToSearch != ''">
                    <ul class="list-unstyled">
                        <li v-for="user in aUsers">
                            <div class="row user-data" @click="loadUserData(user)"
                                v-if="user._iId != userStore.person._iId">
                                <div class="col-ms-1">
                                    <img class="mr-3 avatar float-left"
                                        :src="`http://localhost:8000/api/getProfileImage/${user._iId}`" alt="User avatar">
                                </div>
                                <div class="col-ms-11">
                                    <h5 class="mt-0 mb-1">
                                        {{ user._sName }}
                                    </h5>
                                    <h6>
                                        <p class="text-muted">@{{ user._sUsername }}</p>
                                    </h6>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="row mt-4 ms-2" v-if="userToDisplay != null">
                    <div class="col-md-4">
                        <p class="mt-2"><strong>Id del usuario: </strong>{{ userToDisplay._iId }}</p>
                    </div>
                    <div class="col-md-8">
                        <p class="mt-2"><strong>Nombre de usuario: </strong>{{ userToDisplay._sUsername }}</p>
                    </div>
                </div>
                <div class="row mt-2" v-if="userToDisplay != null">
                    <div class="col-md-6 mt-4">
                        <div class="info-box p-2" style="background-color: rgb(103, 103, 255);">
                            <p class="mt-2 text-white fs-4 d-flex justify-content-center">{{ aReports.length }}</p>
                            <p class="mt-2 text-white fs-4 d-flex justify-content-center">Denuncias</p>
                        </div>
                    </div>
                    <div class="col-md-6 mt-4">
                        <div class="info-box p-2" style="background-color: rgb(255, 181, 42);">
                            <p class="mt-2 text-white fs-4 d-flex justify-content-center">{{ aWarnings.length }}</p>
                            <p class="mt-2 text-white fs-4 d-flex justify-content-center">Avisos</p>
                        </div>
                    </div>
                </div>
                <div class="row mt-2" v-if="userToDisplay != null && !userToDisplay._bIsSuspended">
                    <h5 class="mt-4">Motivo del aviso/suspensión</h5>
                    <div class="hline"></div>
                    <div class="mb-3 mt-4">
                        <textarea class="form-control" id="textbody" rows="3" v-model="sReason"></textarea>
                    </div>
                    <div class="col-md-12">



                        <button type="button" class="btn btn-warning mt-2 me-4 float-end"
                            v-if="!userToDisplay._bIsSuspended" @click="sendWarning()">Enviar aviso</button>
                    </div>
                </div>
            </div>
            <div class="col-md-1"></div>
            <div class="col-md-6" v-if="userToDisplay != null">
                <h4 class="mt-4">Publicaciones de @{{ userToDisplay._sUsername }}</h4>
                <div class="hline"></div>
                <div class="row d-flex justify-content-center">
                    <div class="posts-box mt-4" ref="postsBox">
                        <ul class="list-unstyled">
                            <li v-for="post in aPosts">
                                <div class="row mt-2 post p-2" :class="{ selected: selectedPost._iId === post._iId }"
                                    @click="selectedPost = post">
                                    <p class="mt-2"><strong>Texto: </strong>{{ post._sText }}</p>
                                    <p class="mt-2"><strong>Fecha: </strong>{{ moment(post._tCreatedAt).format("DD/MM/YYYY")
                                    }}</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div class="col-md-6"></div>
                    <div class="col-md-4" v-if="selectedPost._iId != -1">
                        <button type="button" class="btn mt-3 btn-danger float-end"
                            v-if="selectedPost._tDeleteDate === null">Eliminar publicación</button>
                        <button type="button" class="btn mt-3 btn-primary float-end" v-else>Restaurar publicación</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
    

<script setup>
import { useUserStore } from '@/store/UserStore';
import axios from 'axios';
import moment from 'moment';
import { onMounted, ref } from 'vue';

const userStore = useUserStore();
let userToDisplay = ref(null);
let sUsernameToSearch = ref("");
let aUsers = ref([]);
let sReason = ref("");
let aPosts = ref([]);
let aWarnings = ref([]);
let aReports = ref([]);
let selectedPost = ref({_iId: -1});

let postsBox = ref(null);




function searchUsers() {
    if (sUsernameToSearch.value.length > 3)
        axios.get("http://localhost:8000/api/findFirst7Users/" + sUsernameToSearch.value)
            .then(response => aUsers.value = response.data)
    else
        aUsers.value = [];
}

function loadUserData(user) {
    userToDisplay.value = {};
    aPosts.value = [];
    axios.get("http://localhost:8000/api/getUserFromUsername/" + user._sUsername)
        .then(response => {
            if (response.data._iId != 0) {
                userToDisplay.value = response.data;
                // TODO obtener denuncias
                // TODO obtener avisos
                axios.get("http://localhost:8000/api/getUserPosts/" + user._sUsername)
                    .then(response => {
                        aPosts.value = response.data;
                    });
                axios.get("http://localhost:8000/api/getUserWarnings/" + user._iId)
                    .then(response => {
                        aWarnings.value = response.data;
                    })
                axios.get("http://localhost:8000/api/getUserReports/" + user._iId)
                    .then(response => {
                        aReports.value = response.data;
                    })
            }

            sUsernameToSearch.value = ''
        })
}

function suspendReactivateAccount(iSuspend) {
    axios.patch("http://localhost:8000/api/suspendReactivateAccount/" + userToDisplay.value._iId + '/' + iSuspend)
        .then(response => userToDisplay.value._bIsSuspended = response.data)
}

function deletePost() {
    
}

function sendWarning() {
    console.log("hola")
    if (sReason.value != '') {
        console.log("Antes de enviar")
        axios.post("http://localhost:8000/api/newNotification", {
            sInfo: sReason.value,
            iRecipientId: userToDisplay.value._iId,
            iIssuerId: userStore.person._iId,
            iPostId: -1,
            iEventId: -1,
            sType: 'BehaviorWarning'
        })
        .then(response => aWarnings.value.push(response.data))
        sReason.value = "";
    }
}

function selectPost() { }

</script>


<style scoped>
.blackb {
    border: solid 1px black;
}

.hline {
    border-bottom: solid 1px black;
}

.info-box {
    height: 150px;
}

.post:hover {
    cursor: pointer;
    background-color: rgb(181, 221, 255);
}

.selected {
    background-color: rgb(181, 221, 255);
}

.avatar {
    border-radius: 50%;
    width: 50px;
    height: 50px;
}

.user-data {
    border: solid 1px #e5e5e5;
    margin: 7px;
    border-radius: 10px;
    padding: 5px;
}

.user-data:hover {
    cursor: pointer;
    background-color: #e0e0e0;
}

.posts-box {
    padding: 40px;
    width: 80%;
    max-width: 80%;
    height: 60vh;
    background-color: aliceblue;
    overflow-y: scroll;
    scrollbar-width: thin;
}

.text-muted {
    color: #777;
}

.form-group {
    position: relative;
    padding: 15px 0 0;
    margin-top: 10px;
    width: 75%;
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
}</style>