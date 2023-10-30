<template>
    <HeaderComponent></HeaderComponent>
    <div class="container container-fluid vh-100 min-vh-100 mw-75 min-mw-75 d-flex flex-column" v-if="targetUser != null">
        <div class="row">
            <div class="col-md-5">
                <router-link to="/messages" style="text-decoration: none; color: inherit;">
                    <div class="rounded col-1">
                        <font-awesome-icon icon="fa-solid fa-arrow-left" size="lg" />
                    </div>
                </router-link>
            </div>
            <div class="col-md-7 d-flex align-items-center">
                <img class="mr-3 avatar"
                                    :src="`http://localhost:8000/api/getProfileImage/${targetUser._iId}`" alt="User avatar">
                <h4 class="name-display">{{ targetUser._sName }}</h4>
            </div>
        </div>
        <div class="hline"></div>
        <div class="row justify-content-center scroller" ref="chatContainer">
            <div class="chat">
                <ul class="list-unstyled">
                    <li v-for="message in aMessages">
                        <div class="row" v-if="message._iIssuerId === targetUser._iId">
                            <div class="col-sm-1 ">
                                <img class="mr-3 avatar"
                                    :src="`http://localhost:8000/api/getProfileImage/${targetUser._iId}`" alt="User avatar">
                            </div>
                            <div class="col-sm-10 recipient-message">
                                <p class="float-start">{{ message._sText }}</p>
                            </div>
                        </div>
                        <div class="row" v-else>
                            <div class="col-sm-10 issuer-message">
                                <p class="float-end">{{ message._sText }}</p>
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
        </div>
        <div class="hline"></div>
        <div class="row new-message align-items-center d-flex">
            <div class="col-sm-11">
                <input type="text" class="w-100 message-box" v-model="sMessage">
            </div>
            <div class="col-sm-1">
                <button type="button" class="btn btn-primary" @click="submitMessage">Enviar</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import HeaderComponent from "@/components/HeaderComponent.vue"
import { ref, onMounted } from "vue";
import Pusher from 'pusher-js';
import axios from "axios";
import { useUserStore } from "@/store/UserStore";
import { useRoute, useRouter } from "vue-router";

const userStore = useUserStore();
const route = useRoute();
const router = useRouter();
let chatContainer = ref(null);
let aMessages = ref([]);
let sMessage = ref('');
let targetUser = ref(null);


onMounted(() => {
    axios.get("http://localhost:8000/api/getUser/" + route.params.targetId)
    .then(response => {
        targetUser.value = response.data;
        if(targetUser.value._bIsSuspended)
            router.push('/timeline');
    }) 
    .catch(error => console.log(error));

    
    axios.get("http://localhost:8000/api/getConversation/" + userStore.person._iId + "/" + route.params.targetId)
    .then(response => {
        aMessages.value = response.data.map(item => {
            return {
                _sText: item._sText,
                _iIssuerId: item._issuer._iId,
                _iRecipientId: item._recipient._iId
            }
        });
        console.log(aMessages.value)
        axios.patch("http://localhost:8000/api/setSeenMessages/" + userStore.person._iId + "/" + targetUser.value._iId)

        setTimeout(() => {
            chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
        }, 250);
        })

    const pusher = new Pusher('56c83b0b9e4a25060b44', {
        cluster: 'eu'
    })

    const channel = pusher.subscribe('rt-chat');
    // channel.bind('newMessage', (data) => {
    //     aMessages.value.push(data.message);
    //     console.log(aMessages.value)
    //     chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    // })

})

function submitMessage() {
    axios.post("http://localhost:8000/api/newMessage", {
        iIssuerId: userStore.person._iId,
        iRecipientId: route.params.targetId,
        sText: sMessage.value
    })
        .then(response => {
            sMessage.value = "";
            aMessages.value.push({
                _sText: response.data._sText,
                _iIssuerId: response.data._issuer._iId,
                _iRecipientId: response.data._recipient._iId
            })
        })
        .catch(error => console.log(error));
    sMessage.value = '';
}


</script>


<style scoped>

body {
    overflow-y: auto;
}
.text-muted {
    color: #777;
}

.hline {
    border-bottom: solid 1px black;
    width: 100%;
    margin-top: 8px;
    margin-bottom: 8px;
}

.avatar {
    border-radius: 50%;
    width: 50px;
    height: 50px;
}

.message-box {
    border-radius: 5px;
    border: solid 1px rgb(205, 205, 205);
}

.scroller {
    height: 60vh;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: thin;
}

.chat {
    /* width: 80%;
    height: 50%; */
    /* border: solid 1px black; */
    padding: 15px;
    margin: 15px;
}

.new-message {
    padding: 15px;
    margin: 15px;
}

.name-display {
    padding-left: 5px;
    margin-top: 5px;
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

.rounded {
    /* border: solid 1px #777; */
    padding: 5px;
    border-radius: 10px;
    margin: 15px;
    text-align: center;
}

.rounded:hover {
    background-color: rgb(228, 200, 253);
}

.blackb {
    border: solid 1px black;
}
</style>