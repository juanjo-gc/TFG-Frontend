<template>
    <HeaderComponent></HeaderComponent>
    <div class="container" v-if="targetUser != null">
        <router-link to="/messages" style="text-decoration: none; color: inherit;">
            <div class="rounded col-1">
                <font-awesome-icon icon="fa-solid fa-arrow-left" size="lg" />
            </div>
        </router-link>
        <h5></h5>
        <ul class="list-unstyled">
            <li v-for="message in aMessages">
                <div class="row" v-if="message._issuer._iId == targetUser._iId">
                    <div class="col-sm-1">
                        <img class="mr-3 avatar" :src="`http://localhost:8000/api/getProfileImage/${targetUser._iId}`"  alt="User avatar">
                    </div>
                    <div class="col-sm-10 recipient-message">
                        <p class="float-start">{{ message._sText }}</p>
                    </div>
                </div>
                <div class="row" v-else>
                    <div class="col-sm-10 issuer-message">
                        {{ message._sText }}
                    </div>
                    <div class="col-sm-1">
                        <img class="mr-3 avatar float-left" :src="`http://localhost:8000/api/getProfileImage/${userStore.person._iId}`"  alt="User avatar">
                    </div>
                </div>
            </li>
        </ul>
        <form @submit.prevent="submitMessage">
            <input type="text" v-model="sMessage">
            <button type="submit" class="btn btn-primary">Enviar</button>
        </form>
    </div>
</template>

<script setup>
import HeaderComponent from "@/components/HeaderComponent.vue"
import { ref, onMounted } from "vue";
import Pusher from 'pusher-js';
import axios from "axios";
import { useUserStore } from "@/store/UserStore";
import { useRoute } from "vue-router";

const userStore = useUserStore();
const route = useRoute();
let aMessages = ref([]);
let aMessagesText = ref([]);
let sMessage = ref('');
let targetUser = ref(null);


onMounted(() => {
    axios.get("http://localhost:8000/api/getUser/" + route.params.targetId)
        .then(response => targetUser.value = response.data)
        .catch(error => console.log(error));

    axios.get("http://localhost:8000/api/getConversation/" + userStore.person._iId + "/" + route.params.targetId)
        .then(response => {
            aMessages.value = response.data;
            aMessagesText.value = aMessages.value.map(message => {
                return message._sText;
            })
        })

    const pusher = new Pusher('56c83b0b9e4a25060b44', {
        cluster: 'eu'
    })

    const channel = pusher.subscribe('rt-chat');
    channel.bind('newMessage', (data) => {
        aMessages.value.push(data.message);
    })
})

function submitMessage() {
    axios.post("http://localhost:8000/api/newMessage", {
        iIssuerId: userStore.person._iId,
        iRecipientId: route.params.targetId,
        sText: sMessage.value
    })
}


</script>


<style scoped>
.text-muted {
    color: #777;
}

.avatar {
    border-radius: 50%;
    width: 50px;
    height: 50px;
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