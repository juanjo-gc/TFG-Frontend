<template>
    <SidebarFinal></SidebarFinal>
    <div class="container">
        <h2 class="mt-4">Gestionar usuarios</h2>
        <div class="hline"></div>
        <div class="row" v-if="userToDisplay === null">
            <p class="mt-3"><strong>IMPORTANTE:</strong> Cualquier acción que se aplique sobre un usuario exceptuando la de carga del mismo tendrá consecuencias para dicho usuario y quedará registrada en el sistema con objeto de realizar un seguimiento para evitar malos comportamientos y, en caso de que sucedan, asegurar las conscuencias del responsable.</p>
            <div class="col-md-6">
                <div class="my-2">
                    <!-- <p class="">Nombre de usuario</p>
                        <input type="text" class="form-control w-50"> -->
                        <label for="userToSearch" class="m-1 mb-2">Nombre de usuario</label>
                        <div class="input-group mb-3" id="userToSearch">
                            <span class="input-group-text" id="basic-addon1">@</span>
                            <input type="text" class="form-control" placeholder="Nombre de usuario" aria-label="Username" aria-describedby="basic-addon1" v-model="sUsernameToSearch" @keyup="searchUsers">
                        </div>
                    <p class="small text-muted ms-1">Escribe en el campo el nombre del usuario que deseas cargar, y a continuación selecciona uno de los que aparece en la lista para mostrar sus datos.</p>
                </div>
            </div>
            <div class="col-md-6">
                <div class="my-2" v-if="aUsers.length != 0 && sUsernameToSearch != ''">
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
            </div>
        </div>
        <div class="row" v-else>
            <div class="col-md-5">
                <div class="row">
                    <div class="col-md-6">
                        <h4 class="mt-4">Datos del usuario</h4>
                        <div class="hline"></div>
                    </div>
                    <div class="col-md-6">
                        <button type="button" class="btn btn-primary mt-4 float-end" @click="userToDisplay = null; ">Cargar otro usuario</button>
                    </div>
                </div>
                <!-- <div class="form-group field mt-4">
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
                </div> -->
                <div class="row mt-4 ms-2" v-if="userToDisplay != null">
                    <div class="col-md-4">
                        <p class="mt-2"><strong>Id del usuario: </strong>{{ userToDisplay._iId }}</p>
                    </div>
                    <div class="col-md-8">
                        <p class="mt-2"><strong>Nombre de usuario: </strong>{{ userToDisplay._sUsername }}</p>
                    </div>
                    <div class="col-md-4">
                        <p class="mt-2"><strong>Nombre: </strong>{{ userToDisplay._sName }}</p>
                    </div>
                    <div class="col-md-8">
                        <p class="mt-2"><strong>Correo electrónico: </strong>{{ userToDisplay._sEmail }}</p>
                    </div>
                    <p class="mt-2"><strong>Descripción: </strong>{{ userToDisplay._sDescription }}</p>
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
                    <div class="col-md-6"></div>
                    <div class="col-md-6">
                        <button type="button" class="btn btn-danger mt-4 float-end" v-if="!userToDisplay._bIsSuspended"
                            @click="suspendReactivateAccount(1)">Suspender cuenta</button>
                            <button type="button" class="btn btn-primary mt-4 float-end" v-else
                            @click="suspendReactivateAccount(0)">Reactivar cuenta</button>
                    </div>
                </div>
                <div class="row mt-2" v-if="userToDisplay != null && !userToDisplay._bIsSuspended">
                    <h5 class="mt-4">Enviar aviso</h5>
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
                <div class="row" v-if="bShowPosts">
                    <div class="col-md-8">
                        <h4 class="mt-4">Publicaciones de @{{ userToDisplay._sUsername }}</h4>
                    </div>
                    <div class="col-md-4">
                        <button type="button" class="btn btn-primary mt-3" @click="bShowPosts = !bShowPosts">Ver
                            fotos</button>
                    </div>
                    <div class="hline"></div>
                </div>
                <div class="row" v-else>
                    <div class="col-md-8">
                        <h4 class="mt-4">Fotos de @{{ userToDisplay._sUsername }}</h4>
                    </div>
                    <div class="col-md-4">
                        <button type="button" class="btn btn-primary mt-3" @click="bShowPosts = !bShowPosts">Ver
                            publicaciones</button>
                    </div>
                    <div class="hline"></div>
                </div>
                <div class="row d-flex justify-content-center" v-if="bShowPosts">
                    <div class="posts-box mt-4" ref="postsBox">
                        <ul class="list-unstyled" v-if="aPosts.length > 0">
                            <li v-for="post in aPosts">
                                <div class="row mt-2 post p-2" :class="{ selected: selectedPost._iId === post._iId }"
                                    @click="selectedPost = post">
                                    <p class="mt-2"><strong>Texto: </strong>{{ post._sText }}</p>
                                    <p class="mt-2"><strong>Fecha: </strong>{{ moment(post._tCreatedAt).format("DD/MM/YYYY")
                                    }}</p>
                                </div>
                            </li>
                        </ul>
                        <p v-else>El usuario no tiene publicaciones</p>
                    </div>
                    <div class="col-md-6"></div>
                    <div class="col-md-4" v-if="selectedPost._iId != -1">
                        <button type="button" class="btn mt-3 btn-danger float-end"
                            v-if="selectedPost._tDeleteDate === null" @click="deleteOrRestorePost">
                            Eliminar publicación
                        </button>
                        <button type="button" class="btn mt-3 btn-primary float-end" v-else @click="deleteOrRestorePost">
                            Restaurar publicación
                        </button>
                    </div>
                </div>
                <!-- <div class="row d-flex justify-content-center" v-else> -->
                <!-- <div class="photos-container blackb mt-4">
                        <ul class="list-unstyled list-group list-group-horizontal">
                            <li v-for="photo in aUserPhotos">
                                <div>
                                    <img :src="'http://localhost:8000/api/getImage/' + photo._sName" alt="">
                                </div>
                            </li>
                        </ul>
                    </div> -->
                <div class="d-flex justify-content-center mt-4" v-else>
                    <ul class="list-group list-group-horizontal list-unstyled" v-if="aUserPhotos.length > 0">
                        <li v-for="photo in aUserPhotos">
                            <div class="blackb d-flex justify-content-center clickable"
                                @click="bTriggerFullscreenImage = true; fsImage = photo; bFsImageIsDeleted = fsImage._tDeleteDate === null ? false : true">
                                <img class="user-image" :class="{deleted: photo._tDeleteDate != null}"
                                :src="'http://localhost:8000/api/getImage/' + photo._sName" alt="">
                            </div>
                        </li>
                    </ul>
                    <p v-else>El usuario no tiene fotos</p>
                </div>
                <!-- </div> -->
            </div>
        </div>
        <Popup v-if="bTriggerFullscreenImage">
            <div class="row">
                <div class="col-md-12">
                    <font-awesome-icon icon="fa-solid fa-xmark" class="float-end clickable" size="m" style="color: #000000; cursor: pointer;"
                        @click="bTriggerFullscreenImage = false" />
                </div>
                <div class="img-wrapper">
                    <img :src="'http://localhost:8000/api/getImage/' + fsImage._sName" class="fsimg p-2" alt="">
                    <button class="btn btn-danger align-self-center del-btn" v-if="!bFsImageIsDeleted"
                        @click="softDeleteOrRestoreImage(fsImage)">
                        Borrar
                    </button>
                    <button class="btn btn-primary align-self-center del-btn" v-else
                        @click="softDeleteOrRestoreImage(fsImage)">
                        Restaurar
                    </button>
                </div>
            </div>
        </Popup>
    </div>
</template>
    

<script setup>
import { useUserStore } from '@/store/UserStore';
import SidebarFinal from '@/components/SidebarFinal.vue';
import Popup from '@/components/Popup.vue';
import axios from 'axios';
import moment from 'moment';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const userStore = useUserStore();
const route = useRoute();
const router = useRouter();

let userToDisplay = ref(null);
let sUsernameToSearch = ref("");
let aUsers = ref([]);
let sReason = ref("");
let aPosts = ref([]);
let aWarnings = ref([]);
let aReports = ref([]);
let selectedPost = ref({ _iId: -1 });
let aUserPhotos = ref([]);
let aRows = ref([]);
let bShowPosts = ref(true);
let bTriggerFullscreenImage = ref(false);
let fsImage = ref(null);
let bFsImageIsDeleted = ref(false);

let postsBox = ref(null);

onMounted(() => {
    if(route.params.userId != null) {
        axios.get("http://localhost:8000/api/getUser/" + route.params.userId)
        .then(response => userToDisplay.value = response.data);
    }
})

function searchUsers() {
    if (sUsernameToSearch.value.length > 3)
        axios.get("http://localhost:8000/api/findFirst7Users/" + sUsernameToSearch.value)
            .then(response => aUsers.value = response.data)
    else
        aUsers.value = [];
}

function loadUserData(user) {
    selectedPost.value = {};
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
                axios.get("http://localhost:8000/api/getImageNames/" + user._iId)
                    .then(response => aUserPhotos.value = response.data)
            }
            sUsernameToSearch.value = ''
        })
}

function suspendReactivateAccount(iSuspend) {
    axios.patch("http://localhost:8000/api/suspendReactivateAccount/" + userToDisplay.value._iId + '/' + iSuspend)
        .then(response => userToDisplay.value._bIsSuspended = response.data)
}

function deleteOrRestorePost() {
    userStore.softDeleteRestorePost(selectedPost.value._iId, userToDisplay.value._iId, userToDisplay.value._sUsername,
        selectedPost.value._sText, selectedPost.value._tDeleteDate != null);
    aPosts.value.map(post => {
        if (post._iId === selectedPost.value._iId)
            post._tDeleteDate = post._tDeleteDate === null ? moment(Date.now()) : null;
    })
}

function softDeleteOrRestoreImage(image) {
    let iIndex = aUserPhotos.value.findIndex(item => image._iId === item._iId);
    userStore.softDeleteOrRestoreImage(image._iId, userToDisplay.value._iId, userToDisplay.value._sUsername, true, -1);
    //Si la imagen no tiene fecha de borrado, y se acaba de borrar, bIsDeleted debe ser true para establecer la fecha de borrado sin necesidad de petición extra para mostrar reactividad
    let bIsDeleted = image._tDeleteDate === null ? true : false;
    if (bIsDeleted) {
        aUserPhotos.value[iIndex]._tDeleteDate = moment(Date.now());
    } else {
        aUserPhotos.value[iIndex]._tDeleteDate = null;
    }
    console.log("Antes " + bFsImageIsDeleted.value)
    bFsImageIsDeleted.value = bIsDeleted;
    console.log("Despues s" + bFsImageIsDeleted.value)
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
.user-image {
    object-fit: contain;
    max-height: 200px;
    width: auto;
}

.user-image:hover {
    cursor: pointer;
    opacity: 0.7;
}

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

.photos-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 40px;
    width: 80%;
    height: 60vh;
    background-color: aliceblue;
}

.user-image {
    height: 30%;
    width: auto;
    max-height: 100px;
    margin: 5px;
    object-fit: contain;
}

.deleted {
    opacity: 0.5;
    z-index: 5;
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

.img-row {
    display: flex;
    flex-direction: column;
    align-items: center;
}

/* img {
    height: 100%;
    width: auto;
} */

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
}
</style>