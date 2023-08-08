<template>
    <HeaderComponent></HeaderComponent>
    <div class="container" v-if="!bIsFetching">
        <div class="row">
            <h2 class="mt-3">Mensajes privados</h2>
        </div>
        <div class="row">
            <div class="col-md-7">
                <h4 class="mt-3">Mensajes recientes</h4>
                <div v-if="aLastMessages.length === 0">
                    <p class="lead fw-formal mt-4">No hay mensajes recientes :&#40;</p>
                </div>
                <div class="pt-2 me-5" v-else>
                    <ul class="list-unstyled">
                        <li v-for="message in aLastMessages">
                                <div class="row message-preview" :class="{newmessage: !message._bIsSeen}" @click="navigateToChat(message)">
                                    <div class="col-sm-1">
                                        <img v-if="message._issuer._iId != userStore.person._iId" class="mr-3 avatar float-left" :src="`http://localhost:8000/api/getProfileImage/${message._issuer._iId}`"  alt="User avatar">
                                        <img v-else class="mr-3 avatar float-left" :src="`http://localhost:8000/api/getProfileImage/${message._recipient._iId}`"  alt="User avatar">
                                    </div>
                                    <div class="col-sm-7">
                                        <h6 v-if="message._issuer._iId != userStore.person._iId">{{ message._issuer._sName }}</h6>
                                        <h6 v-else>{{ message._recipient._sName }}</h6>
                                        <p class="small text-muted">{{ message._sText }}</p>
                                    </div>
                                    <div class="col-sm-4  align-self-center">
                                        <div v-if="message._issuer._iId != userStore.person._iId" class="circle float-end"></div>
                                    </div>
                                </div>
                            <!-- </router-link> -->
                        </li>
                    </ul>
                </div>
            </div>
            <div class="col-md-1">
                <div class="vline"></div>
            </div>
            <div class="col-md-4">
                <h4 class="mt-3">Nuevo mensaje</h4>
                <div class="form-group field mt-3">
                    <div class="row">
                        <div class="col-sm-10">
                            <input type="input" class="form-field" placeholder="Buscar usuario" name="name" id='name'
                            v-model="sUsernameToMessage" @keyup="getUsersFromUsername"/>
                            <label for="name" class="form-label">Buscar usuario</label>
                        </div>
                        <div class="col-sm-2">
                            <button type="button" class="btn btn-primary mt-2" @click="deselectUser">Limpiar</button>
                        </div>
                    </div>
                </div>
                <div v-if="aUsers.length != 0">
                    <ul class="list-unstyled">
                        <li v-for="user in aUsers" @click="selectUser(user)">
                            <div class="row user-data" v-if="user._iId != userStore.person._iId">
                                <div class="col-ms-1">
                                    <img class="mr-3 avatar float-left" :src="`http://localhost:8000/api/getProfileImage/${user._iId}`"  alt="User avatar">
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
                <!-- <div class="mt-5" v-if="selectedUser != null"> -->
                <div class="mt-5" v-if="selectedUser != null">
                    <p class="text-muted">Mensaje para @{{ selectedUser._sUsername }}</p>
                    <textarea cols="55" rows="4" placeholder="Escribe tu mensaje aquí" v-model="sNewMessage"></textarea>
                    <button type="button" class="btn btn-primary float-end mt-2" @click="sendMessage">Enviar</button>
                </div>
            </div>
        </div>
        <div class="alert alert-danger alert-dismissible fade show" role="alert" v-if="bActivateAlert">
          <strong>Error.</strong> {{ sErrorMessage }}.
          <button type="button" class="btn-close" aria-label="Close" @click="bActivateAlert = false"></button>
        </div>
    </div>
</template>

<script setup>
import HeaderComponent from '@/components/HeaderComponent.vue';
import { useUserStore } from '@/store/UserStore';
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();
let sUsernameToMessage = ref("");
let sNewMessage = ref("");
let aUsers = ref([]);
let selectedUser = ref(null);
let bActivateAlert = ref(false);
let bIsFetching = ref(true);
let sErrorMessage = ref("");
let aLastMessages = ref([]);
let aiRecentMessagedUsers = ref([]);

onMounted(() => {
    axios.get("http://localhost:8000/api/getLastMessages/" + userStore.person._iId)
    .then(response => {
        aLastMessages.value = response.data;
        bIsFetching.value = false;
        aLastMessages.value.forEach(message => {
            if(message._issuer._iId != userStore.person._iId) {
                message._bIsSeen = false;
                aiRecentMessagedUsers.value.push(message._issuer._iId);
            } else {
                message._bIsSeen = true;
                aiRecentMessagedUsers.value.push(message._recipient._iId);
            }
        console.log(aiRecentMessagedUsers.value)
        })
    })
    .catch(error => console.log(error));
})

function selectUser(user) {
    selectedUser.value = user;
    if(aiRecentMessagedUsers.value.find(u => u === selectedUser.value._iId)) 
        router.push("/messages/" + selectedUser.value._iId);
    sUsernameToMessage.value = "";
}

function deselectUser() {
    selectedUser.value = null;
    aUsers.value = [];
}

function getUsersFromUsername() {
    if(sUsernameToMessage.value.length > 3) {
        axios.get("http://localhost:8000/api/findFirst7Users/" + sUsernameToMessage.value)
        .then(response => aUsers.value = response.data)
        .catch(error => console.log(error));
    } else {
        aUsers.value = [];
    }
}

function sendMessage() {
    if(sNewMessage.value.length === 0) {
        bActivateAlert.value = true;
        sErrorMessage.value = "El mensaje no puede estar vacío"
    } else {
        axios.post("http://localhost:8000/api/newMessage", {
            iIssuerId: userStore.person._iId,
            iRecipientId: selectedUser.value._iId,
            sText: sNewMessage.value
        })
        .then(response => {
            aLastMessages.value.unshift(response.data)
        })
        .catch(error => console.log(error));
        sNewMessage.value = "";
    }
}

function navigateToChat(message) {
    if(userStore.person._iId === message._issuer._iId) 
        router.push("/messages/" + message._recipient._iId);
    else
        router.push("/messages/" + message._issuer._iId);

}

</script>

<style scoped>

.hline {
    border-bottom: solid 1px black;
}

.vline {
    border-left: solid 1px black;
    position: relative;
    margin-top: 20px;
    margin-bottom: 20px;
    height: 100%;
}

.message-preview {
    padding: 10px;
    margin-top: 10px;
    border: solid 1px #d5d5d5;
}

.message-preview:hover {
    background-color: #e5e5e5;
    cursor: pointer;
}

.newmessage h6 {
    font-weight: bold;
}


.circle {
    background: #3676d7;
    width: 7px;
    height: 7px;
    border-radius: 50%;
}

.avatar {
    border-radius: 50%;
    width: 50px;
    height: 50px;
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

body {
    font-family: "Poppins", sans-serif;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    font-size: 1.5rem;
    background-color: #222222;
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

.text-muted {
      color: #777;
    }

.blackb {
    border: solid 1px black;
    ;
}</style>