<template>
    <SidebarFinal></SidebarFinal>
    <!-- <div class="container" v-if="!bIsFetching">
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
                                <div class="row message-preview" :class="{newmessage: !message._bIsSeen}" @click="navigateToChat(message)"
                                v-if="!message._issuer._bIsSuspended && !message._recipient._bIsSuspended">
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
                                        <div v-if="message._issuer._iId != userStore.person._iId && !message._bSeen" class="circle float-end"></div>
                                    </div>
                                </div>
                            </router-link> ESTABA COMENTADA
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
                            <div class="row user-data" v-if="user._iId != userStore.person._iId && !user._bIsSuspended">
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
                <div class="mt-5" v-if="selectedUser != null"> ESTABA COMENTADA
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
    </div> -->
    <div class="container" style="border-bottom: solid 2px #777;">
        <div class="row">
            <div class="col-md-4 recents-col">
                <h3 class="mt-4 text-center mb-2">Chats recientes</h3>
                <div class="row mt-4 p-2 option" @click="bShowNewMessage = !bShowNewMessage">
                    <div class="col-md-1">
                        <font-awesome-icon icon="fa-solid fa-envelope-open-text" size="xl" class="mt-2" />
                    </div>
                    <div class="col-md-5">
                        <p class="fs-5 mt-1">Nuevo mensaje</p>
                    </div>
                </div>
                





                <!-- Listado de chats -->
                <div class="row">
                    <div v-if="aLastMessages.length === 0">
                        <p class="lead fw-formal mt-4">No hay mensajes recientes :&#40;</p>
                    </div>
                    <div class="pt-2 me-5" v-else>
                        <ul class="list-unstyled">
                            <li v-for="message in aLastMessages">
                                <!-- Al hacer click se carga el chat con el usuario -->
                                <div class="row message-preview" :class="{ newmessage: !message._bIsSeen }"
                                    @click="loadChat(message._issuer._iId === userStore.person._iId ? message._recipient : message._issuer)"    
                                    v-if="!message._issuer._bIsSuspended && !message._recipient._bIsSuspended">
                                    <div class="col-sm-2">
                                        <img v-if="message._issuer._iId != userStore.person._iId"
                                            class="mr-3 avatar float-left"
                                            :src="`http://localhost:8000/api/getProfileImage/${message._issuer._iId}`"
                                            alt="User avatar">
                                        <img v-else class="mr-3 avatar float-left"
                                            :src="`http://localhost:8000/api/getProfileImage/${message._recipient._iId}`"
                                            alt="User avatar">
                                    </div>
                                    <div class="col-sm-6">
                                        <h6 v-if="message._issuer._iId != userStore.person._iId">{{ message._issuer._sName
                                        }}</h6>
                                        <h6 v-else>{{ message._recipient._sName }}</h6>
                                        <p class="small text-muted">{{ message._sText }}</p>
                                    </div>
                                    <div class="col-sm-4  align-self-center">
                                        <div v-if="message._issuer._iId != userStore.person._iId && !message._bSeen"
                                            class="circle float-end"></div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="col-md-8 private-chat" v-if="currentUserChat != null">
                <div class="row  header-chat">
                    <div class="col-md-2">
                        <img class="mr-3 mt-4 avatar "
                            :src="`http://localhost:8000/api/getProfileImage/${currentUserChat._iId}`" alt="User avatar">
                    </div>
                    <div class="col-md-10">
                        <h3 class="mt-4">{{ currentUserChat._sName }}</h3>
                        <h5 class="mt-2 text-muted">@{{ currentUserChat._sUsername }}</h5>
                    </div>
                </div>
                <div class="row scroller" ref="chatContainer">
                    <ul class="list-unstyled">
                        <li v-for="message in aMessages">
                            <div class="row" v-if="message._iIssuerId === currentUserChat._iId">
                                <div class="col-sm-1 ">
                                    <img class="mr-3 avatar"
                                        :src="`http://localhost:8000/api/getProfileImage/${currentUserChat._iId}`"
                                        alt="User avatar">
                                </div>
                                <div class="col-sm-10 ">
                                    <p class="float-start mt-4"><span class="recipient-message">{{ message._sText }}</span></p>
                                </div>
                            </div>
                            <div class="row" v-else>
                                <div class="col-sm-10 ">
                                    <p class="float-end mt-4"><span class="issuer-message">{{ message._sText }}</span></p>
                                </div>
                                <div class="col-sm-1">
                                    <img class="mr-3 avatar float-end"
                                        :src="`http://localhost:8000/api/getProfileImage/${userStore.person._iId}`"
                                        alt="User avatar">
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="row">
                    <div class="col-md-10">
                        <div class="message-wrapper">
                            <textarea class="mt-3" v-model="sMessage" @keyup.enter="submitMessage"></textarea>
                        </div>
                    </div>
                    <div class="col-md-1">
                        <div class="message-wrapper">
                            <button type="button" class="btn btn-outline-dark btn-send mt-3" @click="submitMessage">
                                <font-awesome-icon icon="fa-solid fa-paper-plane" size="xl" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Popup v-if="bShowNewMessage">
        <div class="row" >
            <div class="col-md-6">
                <h4 class="mt-2">Nuevo mensaje</h4>
            </div>
            <div class="col-md-6">
                <font-awesome-icon icon="fa-solid fa-xmark" size="l" class="float-end clickable" @click="bShowNewMessage = false" />
            </div>
                    <div class="form-group field">
                        <div class="row ms-3">
                            <input type="input" class="form-field" placeholder="Buscar usuario" name="name" id='name'
                                v-model="sUsernameToMessage" @keyup="getUsersFromUsername" />
                            <label for="name" class="form-label">Buscar usuario</label>
                        </div>
                    </div>
                    <p class="small align-self-center mt-2">Escribe el nombre del usuario y selecciona a quien quieras
                        enviar el mensaje.</p>
                </div>
                <div v-if="aUsers.length != 0">
                    <ul class="list-unstyled user-list">
                        <li v-for="user in aUsers" @click="loadChat(user)">
                            <div class="row user-data" v-if="user._iId != userStore.person._iId && !user._bIsSuspended">
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
        </Popup>
    </div>
</template>

<script setup>
import SidebarFinal from '@/components/SidebarFinal.vue';
import Popup from '@/components/Popup.vue';
import { useUserStore } from '@/store/UserStore';
import axios from 'axios';
import Pusher from 'pusher-js';
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
let aMessages = ref([]);
let bShowNewMessage = ref(false);
let currentUserChat = ref(null);
let sMessage = ref("");

let chatContainer = ref(null);

onMounted(() => {
    axios.get("http://localhost:8000/api/getLastMessages/" + userStore.person._iId)
        .then(response => {
            aLastMessages.value = response.data;
            bIsFetching.value = false;
            aLastMessages.value.forEach(message => {
                if (message._issuer._iId != userStore.person._iId) {
                    message._bIsSeen = false;
                    aiRecentMessagedUsers.value.push(message._issuer._iId);
                } else {
                    message._bIsSeen = true;
                    aiRecentMessagedUsers.value.push(message._recipient._iId);
                }
            })
            console.log(aLastMessages.value)
        })
        .catch(error => console.log(error));
    const pusher = new Pusher('56c83b0b9e4a25060b44', {
        cluster: 'eu'
    })
    const channel = pusher.subscribe('rt-chat');

})

function getUsersFromUsername() {
    if (sUsernameToMessage.value.length > 3) {
        axios.get("http://localhost:8000/api/findFirst7Users/" + sUsernameToMessage.value)
            .then(response => aUsers.value = response.data)
            .catch(error => console.log(error));
    } else {
        aUsers.value = [];
    }
}

// function sendMessage() {
//     if (sNewMessage.value.length === 0) {
//         bActivateAlert.value = true;
//         sErrorMessage.value = "El mensaje no puede estar vacío"
//     } else {
//         axios.post("http://localhost:8000/api/newMessage", {
//             iIssuerId: userStore.person._iId,
//             iRecipientId: selectedUser.value._iId,
//             sText: sNewMessage.value
//         })
//             .then(response => {
//                 aLastMessages.value.unshift(response.data)
//             })
//             .catch(error => console.log(error));
//         sNewMessage.value = "";
//     }
// }

function loadChat(user) {
    currentUserChat.value = user;
    bShowNewMessage.value = false;
    axios.get("http://localhost:8000/api/getConversation/" + userStore.person._iId + "/" + user._iId)
        .then(response => {
            aMessages.value = response.data.map(item => {
                return {
                    _sText: item._sText,
                    _iIssuerId: item._issuer._iId,
                    _iRecipientId: item._recipient._iId
                }
            });
            axios.patch("http://localhost:8000/api/setSeenMessages/" + userStore.person._iId + "/" + user._iId)

            setTimeout(() => {
                chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
            }, 250);
        })
}

function isBlank(sString) {
    let bIsBlank = true;
    let i = 0;
    while(bIsBlank && i < sString.length) {
        if(sString[i] != ' ')
            bIsBlank = false;
        i++;
    }
    return bIsBlank;
}

function submitMessage() {
    if(sMessage.value != '' && !isBlank(sMessage.value)) {
        sMessage.value = sMessage.value.slice(0, sMessage.value.length - 1)
        axios.post("http://localhost:8000/api/newMessage", {
        iIssuerId: userStore.person._iId,
        iRecipientId:currentUserChat.value._iId,
        sText: sMessage.value
    })
    .then(response => {
            sMessage.value = "";
            aMessages.value.push({
                _sText: response.data._sText,
                _iIssuerId: response.data._issuer._iId,
                _iRecipientId: response.data._recipient._iId
            })
            if(!aiRecentMessagedUsers.value.find(iId => iId === currentUserChat.value._iId)) {
                aLastMessages.value.unshift(response.data)
            } else {
                let messageToReplace = response.data;
                console.log(messageToReplace)
                console.log(aLastMessages.value)
                let bFound = false;
                let i = 0;
                while(!bFound && i < aLastMessages.value.length) {
                    console.log(aLastMessages.value[i])
                    i++;
                    // if(aLastMessages.value[i]._issuer._iId === messageToReplace._issuer._iId && aLastMessages.value[i]._recipient._iId === messageToReplace._recipient._iId)
                    //     bFound = true;
                    // else
                    //     i++;
                }
                aLastMessages.value[i]._sText = messageToReplace._sText;
                aLastMessages.value = aLastMessages.value.unshift(aLastMessages.value[i]);
                // aLastMessages.value.forEach(msg => {
                //     console.log("Emisor nuevo: " + messageToReplace._issuer._iId + " Emisor last: " + msg._issuer._iId + " Rec nuevo: " + messageToReplace._recipient._iId + " Rec last: " + msg._recipient._iId)
                //     if(msg._issuer._iId === messageToReplace._issuer._iId && msg._recipient._iId === messageToReplace._recipient._iId)
                //         bFound = true;
                // })
                // console.log("Se encontro ? " + bFound)
            }
            // console.log(aMessages.value)
        })
        .catch(error => console.log(error));
    }
    sMessage.value = '';
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

.option:hover {
    background-color: #e5e5e5;
    cursor: pointer;
}



.message-preview {
    padding: 10px;
    /*margin-top: 10px;*/
    border-top: solid 1px #777;
    border-bottom: solid 1px #777;
}

.message-preview:hover {
    background-color: #e5e5e5;
    cursor: pointer;
}

.scroller {
    max-height: 60vh;
    min-height: 60vh;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: thin;
    border-bottom: solid 2px #777;
}

.header-chat {
    border-bottom: solid 2px #777;
}

.newmessage h6 {
    font-weight: bold;
}

.recents-col {
    border-left: solid 2px #777;
    border-right: solid 2px #777;
    height: 90vh;
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


.recipient-message {
    background-color: rgb(226, 226, 226);
    margin: 7px;
    border-radius: 10px;
    padding: 5px;
}

.issuer-message {
    background-color: rgb(209, 209, 209);
    margin: 7px;
    border-radius: 10px;
    padding: 5px;
}

.private-chat {
    border-right: solid 2px #777;
}

.message-wrapper {
    margin-left: 20px;
    margin-top: 10px;
    margin-bottom: 10px;
}
.btn-send {
    height: 86px;
    width: 86px;
    align-self: center;
}

textarea {
    width: 100%;
    height: 86px;
    font-size: 16px;
}


.blackb {
    border: solid 1px black;
    ;
}
</style>