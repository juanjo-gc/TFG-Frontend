<template>
    <SidebarFinal></SidebarFinal>
    <div id="main" class="container border chats-box mt-2 mb-4">
        <div class="row">
            <div class="col-md-4">
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
                                <div class="row message-preview border" :class="{ newmessage: !message._bIsSeen }"
                                    @click="loadChat(message._issuer._iId === userStore.person._iId ? message._recipient : message._issuer)"
                                    v-if="!message._issuer._bIsSuspended && !message._recipient._bIsSuspended">
                                    <div class="col-sm-2">
                                        <img v-if="message._issuer._iId != userStore.person._iId"
                                            class="mr-3 avatar float-left"
                                            :src="userStore.baseAPIurl + 'getProfileImage/' + message._issuer._iId"
                                            alt="User avatar">
                                        <img v-else class="mr-3 avatar float-left"
                                            :src="userStore.baseAPIurl + 'getProfileImage/' + message._recipient._iId"
                                            alt="User avatar">
                                    </div>
                                    <div class="col-sm-6">
                                        <h6 v-if="message._issuer._iId != userStore.person._iId">{{
                    message._issuer._sName }}</h6>
                                        <h6 v-else>{{ message._recipient._sName }}</h6>
                                        <p class="small text-muted"
                                            v-if="message._issuer._iId === userStore.person._iId">{{ message._sText.substring(0,25) }}
                                        </p>
                                        <p class="small"
                                            :class="{ 'fw-bold': !message._bSeen, 'text-muted': message._bSeen }" v-else>
                                            {{ message._sText }}</p>
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
            <div class="col-md-8" v-if="currentUserChat != null">
                <div class="row">
                    <div class="col-md-2" style="cursor: pointer;"
                        @click="router.push('/profile/' + currentUserChat._sUsername)">
                        <img class="mr-3 mt-4 avatar"
                            :src="userStore.baseAPIurl + 'getProfileImage/' + currentUserChat._iId" alt="User avatar">
                    </div>
                    <div class="col-md-10">
                        <h3 class="mt-4">{{ currentUserChat._sName }}</h3>
                        <h5 class="mt-2 text-muted">@{{ currentUserChat._sUsername }}</h5>
                    </div>
                    <div class="bg-dark pt-2" v-if="bIsBlockedByPerson || bIsPersonBlocked">
                        <p class="text-light text-center" v-if="bIsBlockedByPerson">No puedes enviar mensajes a este
                            usuario porque te ha bloqueado</p>
                        <p class="text-light text-center" v-else>No puedes enviar mensajes a este usuario porque lo has
                            bloqueado</p>

                    </div>
                </div>
                <div class="row scroller border" ref="chatContainer">
                    <ul class="list-unstyled">
                        <li v-for="message in aMessages">
                            <div class="row" v-if="message._iIssuerId === currentUserChat._iId">
                                <div class="col-sm-1 ">
                                    <img class="mr-3 avatar ms-2 mt-2"
                                        :src="userStore.baseAPIurl + 'getProfileImage/' + currentUserChat._iId"
                                        alt="User avatar">
                                </div>
                                <div class="col-sm-10 ">
                                    <p class="float-start me-2 mt-4"><span class="recipient-message">{{ message._sText
                                            }}</span></p>
                                </div>
                            </div>
                            <div class="row" v-else>
                                <div class="col-sm-10 ">
                                    <p class="float-end ms-4 mt-4"><span class="issuer-message">{{ message._sText }}</span>
                                    </p>
                                </div>
                                <div class="col-sm-1">
                                    <img class="mr-3 avatar float-end"
                                        :src="userStore.baseAPIurl + 'getProfileImage/' + userStore.person._iId"
                                        alt="User avatar">
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="row border message-row" v-if="!bIsBlockedByPerson && !bIsPersonBlocked">
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
                <div class="row border" v-else>
                    <p class="p-4 fs-4">
                        No puedes enviar mensajes a este usuario
                    </p>
                </div>
            </div>
        </div>
        <Popup v-if="bShowNewMessage">
            <div class="row">
                <div class="col-md-6">
                    <h4 class="mt-2">Nuevo mensaje</h4>
                </div>
                <div class="col-md-6">
                    <font-awesome-icon icon="fa-solid fa-xmark" size="l" class="float-end clickable"
                        @click="bShowNewMessage = false" />
                </div>
                <div class="form-group field">
                    <div class="row ms-3">
                        <input type="input" class="form-field" placeholder="Buscar usuario" name="name" id='name'
                            v-model="sUsernameToMessage" @keyup="getUsersFromUsername" />
                        <label for="name" class="form-label">Buscar usuario</label>
                    </div>
                </div>
                <p class="small align-self-center mt-2">Escribe el nombre del usuario y selecciona a quien quieras
                    enviar el mensaje. Recuerda que ese usuario deberá seguirte previamente para que puedas iniciar la conversación.</p>
            </div>
            <div v-if="aUsers.length != 0">
                <ul class="list-unstyled user-list">
                    <li v-for="user in aUsers" @click="loadChat(user)">
                        <div class="row user-data" v-if="user._iId != userStore.person._iId && !user._bIsSuspended">
                            <div class="col-ms-1">
                                <img class="mr-3 avatar float-left"
                                    :src="userStore.baseAPIurl + 'getProfileImage/' + user._iId" alt="User avatar">
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
let bIsFetching = ref(true);
let sErrorMessage = ref("");
let aLastMessages = ref([]);
let aiRecentMessagedUsers = ref([]);
let aMessages = ref([]);
let bShowNewMessage = ref(false);
let currentUserChat = ref(null);
let sMessage = ref("");
let aBlockedBy = ref([]);
let bIsBlockedByPerson = ref(false);
let bIsPersonBlocked = ref(false);
let aFollowers = ref([]);

let chatContainer = ref(null);

onMounted(() => {
    axios.get(userStore.baseAPIurl + "getBlockedByUsers/" + userStore.person._iId)
        .then(response => aBlockedBy.value = response.data);
    axios.get(userStore.baseAPIurl + "getFollowers/" + userStore.person._sUsername)
        .then(response => aFollowers.value = response.data);
    axios.get(userStore.baseAPIurl + "getLastMessages/" + userStore.person._iId)
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
        })
        .catch(error => console.log(error));
    const pusher = new Pusher('56c83b0b9e4a25060b44', {
        cluster: 'eu'
    })
    pusher.bind("newMessage", data => {
        aMessages.value.push(data.message);
        setTimeout(() => {
            chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
        }, 25);
    })
    const channel = pusher.subscribe('rt-chat');

    console.log(document.getElementById('main').scrollHeight);
})

function getUsersFromUsername() {
    if (sUsernameToMessage.value.length > 3) {
        let regex = new RegExp("^" + sUsernameToMessage.value + ".*$")
        aUsers.value = aFollowers.value.filter(follower => follower._sUsername.match(regex));
        aUsers.value = aUsers.value.filter(user => {
            if (!aBlockedBy.value.some(blockedBy => blockedBy._iId === user._iId))
                return user;
        })
    } else {
        aUsers.value = [];
    }
}

function loadChat(user) {
    console.log(document.getElementById('main').scrollHeight);

    currentUserChat.value = user;
    let i = aLastMessages.value.findIndex(message => (message._issuer._iId === userStore.person._iId && message._recipient._iId === currentUserChat.value._iId) ||
        (message._issuer._iId === currentUserChat.value._iId && message._recipient._iId === userStore.person._iId));
    aLastMessages.value[i]._bSeen = true;
    axios.get(userStore.baseAPIurl + "checkBlock/" + userStore.person._iId + "/" + currentUserChat.value._iId)
        .then(response => bIsPersonBlocked.value = response.data);
    axios.get(userStore.baseAPIurl + "checkBlock/" + currentUserChat.value._iId + "/" + userStore.person._iId)
        .then(response => bIsBlockedByPerson.value = response.data);
    bShowNewMessage.value = false;
    axios.get(userStore.baseAPIurl + "getConversation/" + userStore.person._iId + "/" + user._iId)
        .then(response => {
            aMessages.value = response.data.map(item => {
                return {
                    _sText: item._sText,
                    _iIssuerId: item._issuer._iId,
                    _iRecipientId: item._recipient._iId
                }
            });
            axios.patch(userStore.baseAPIurl + "setSeenMessages/" + userStore.person._iId + "/" + user._iId)
                .then(response => aMessages.value.forEach(message => message._bSeen = true))

            setTimeout(() => {
                chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
            }, 250);
        })
}

function isBlank(sString) {
    let bIsBlank = true;
    let i = 0;
    while (bIsBlank && i < sString.length) {
        if (sString[i] != ' ')
            bIsBlank = false;
        i++;
    }
    return bIsBlank;
}

function submitMessage() {
    if (sMessage.value != '' && !isBlank(sMessage.value)) {
        sMessage.value = sMessage.value.slice(0, sMessage.value.length - 1)
        axios.post(userStore.baseAPIurl + "newMessage", {
            iIssuerId: userStore.person._iId,
            iRecipientId: currentUserChat.value._iId,
            sText: sMessage.value
        })
            .then(response => {
                sMessage.value = "";
                if (!aiRecentMessagedUsers.value.find(iId => iId === currentUserChat.value._iId)) {
                    aLastMessages.value.unshift(response.data)
                    aiRecentMessagedUsers.value.push(response.data._recipient._iId)
                } else {
                    let messageToReplace = response.data;
                    messageToReplace._bIsSeen = true;
                    aLastMessages.value = aLastMessages.value.filter(message => {
                        if (!(message._issuer._iId === messageToReplace._issuer._iId && message._recipient._iId === messageToReplace._recipient._iId) &&
                            !(message._issuer._iId === messageToReplace._recipient._iId && message._recipient._iId === messageToReplace._issuer._iId))
                            return message;
                    })
                    aLastMessages.value.unshift(messageToReplace);
                }
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
    /* border-top: solid 1px #777;
    border-bottom: solid 1px #777; */
}

.message-preview:hover {
    background-color: #e5e5e5;
    cursor: pointer;
}

.scroller {
    max-height: 60vh;
    /* min-height: 50vh; */
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: thin;
    /* border-bottom: solid 2px #777; */
}

.chats-box {
    height: 85vh;
    /* min-height: auto; */
    overflow-y: hidden;
}

.newmessage h6 {
    font-weight: bold;
}

.clickable {
    cursor: pointer;
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
    /* min-height: 100vh; */
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

/* .private-chat {
    border-right: solid 2px #777;
} */

.message-wrapper {
    margin-left: 20px;
    margin-top: 10px;
    margin-bottom: 10px;
}

.message-row {
    max-height: 20%;
    min-height: 20%;
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