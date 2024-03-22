<template>
    <SidebarFinal></SidebarFinal>
    <div class="container">
        <h2 class="mt-4 fw-formal">Notificaciones</h2>
        <div class="hline"></div>
        <div class="row mt-4">
            <div class="col-md-12">
                <ul class="list-unstyled">
                    <li v-for="(notification, key) in aNotifications">
                        <div class="row mt-2 notification" @click="router.push(generateLink(notification))"
                        v-if="shouldBeShown(notification)" @mouseover="setSeen(key)">
                            <div class="col-sm-1 mt-3" v-if="notification._issuer._iId != 0">
                                <img :src="'http://localhost:8000/api/getProfileImage/' + notification._issuer._iId"
                                    class="avatar-mini float-end">
                            </div>
                            <div class="col-sm-6 mt-2">
                                <div class="row mt-2">
                                    <p :class="{'fw-bold': !notification._bSeen}">{{ notification._sInfo }}</p>
                                </div>
                                <div class="row mt-2" v-if="notification._type._sName === 'NewPostComment'">
                                    <p class="ms-2 text-muted small">
                                        {{ shortenText(notification._post._sText) }}
                                    </p>
                                </div>
                            </div>
                            <div class="col-sm-2 mt-2" v-if="notification._type._sName === 'NewFollow'">
                                <button type="button" class="btn btn-outline-primary" @click="proccessFollow(notification)"
                                    v-if="!notification._bIsFollowing">
                                    Seguir
                                </button>
                                <button type="button" class="btn btn-primary" @click="proccessFollow(notification)"
                                    v-else>Siguiendo</button>
                            </div>
                            <div class="col-sm-2" v-else-if="notification._type._sName === 'FollowRequest'">
                                <div class="row mt-2" v-if="aNotifications.some(receivedNotification => receivedNotification._type === 'NewFollow' && receivedNotification._issuer._iId === Notification._issuer._iId)">
                                    <div class="col-sm-6">
                                        <button type="button" class="btn btn-outline-primary"
                                            @click="acceptIgnoreFollowRequest(notification, true)">
                                            Aceptar
                                        </button>
                                    </div>
                                    <div class="col-sm-6">
                                        <button type="button" class="btn btn-outline-secondary"
                                            @click="acceptIgnoreFollowRequest(notification, false)">
                                            Ignorar
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div class="col-sm-2 ms-1">
                                <p class="mt-3 float-end text-muted">
                                    {{ formatDate(notification._tCreatedAt) }}
                                </p>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
    

<script setup>
import SidebarFinal from '@/components/SidebarFinal.vue'
import { useUserStore } from '@/store/UserStore';
import axios, { Axios } from 'axios';
import moment from 'moment';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();
let aNotifications = ref([]);
let iPageNumber = 0;
let iTotalPages = -1;
let tToday = moment(new Date());
let aLoadedNotificationPages = [];


function getNotificationsPage() {
    axios.get("http://localhost:8000/api/getUserNotifications/" + userStore.person._iId + "/" + iPageNumber)
        .then(response => {
            let aUnfilteredNotifications = response.data.content;
            aUnfilteredNotifications.forEach(notification => {
                if(notification._issuer === null || notification._issuer._sRole === "Admin") {
                    aNotifications.value.push(notification);
                } else {
                    axios.get("http://localhost:8000/api/checkMutualBlock/" + userStore.person._iId + "/" + notification._issuer._iId)
                    .then(response => {
                        let bNeitherAreBlocked = response.data;
                        if(bNeitherAreBlocked)
                            aNotifications.value.push(notification);
                    })
                }
            })
            aNotifications.value.forEach(notification => {
                if (notification._type._sName === "NewFollow" || notification._type._sName === "FollowRequest") {
                    axios.get('http://localhost:8000/api/checkFollow/' + notification._recipient._iId + '/' + notification._issuer._iId)
                        .then(response => notification._bIsFollowing = response.data)
                }
            })
            aLoadedNotificationPages.push({ iPageNumber, aNotifications: aNotifications.value })
            iTotalPages = response.data.totalPages;
            iPageNumber++;
        })
}

onMounted(() => {
    getNotificationsPage();
})

function shouldBeShown(notification) {
    let bShouldBeShown = true;

    if(notification._issuer._sRole === 'User')
        if(notification._issuer._bIsSuspended)
            bShouldBeShown = false;
    if(notification._event != null)
        if(notification._event._tDeleteDate != null)
            bShouldBeShown = false;
    if(notification._post != null)
        if(notification._post._tDeleteDate != null)
            bShouldBeShown = false;
    
    return bShouldBeShown;
}

function setSeen(i) {
    if(aNotifications.value[i]._bSeen != true) {
        aNotifications.value[i]._bSeen = true;
        axios.patch("http://localhost:8000/api/setSeen/" + aNotifications.value[i]._iId);
    }
}


function shortenText(sText) {
    if (sText.length > 150)
        sText = sText.substring(0, 150)
    return sText;
}

function formatDate(tCreatedAt) {
    const fTimeDifferenceInSeconds = tToday.diff(moment(tCreatedAt)) / 1000;

    if (fTimeDifferenceInSeconds < 2592000) {      // Dentro del mismo mes, formatos específicos
        if (fTimeDifferenceInSeconds > 86400) {    //Distinto día
            let res = Math.round(fTimeDifferenceInSeconds / 86400);
            return res === 1 ? "Hace " + res + " día" : "Hace " + res + " días";
        } else {   //Mismo día
            if (fTimeDifferenceInSeconds > 3600) { //Distinto hora
                let res = Math.round(fTimeDifferenceInSeconds / 3600);
                return res === 1 ? "Hace " + res + " hora" : "Hace " + res + " horas";
            } else {    //Misma hora
                if (fTimeDifferenceInSeconds > 60) {     //Distinto minuto
                    let res = Math.round(fTimeDifferenceInSeconds / 60);
                    return res === 1 ? "Hace " + res + " minuto" : "Hace " + res + " minutos";
                } else {    //Mismo minuto
                    let res = Math.round(fTimeDifferenceInSeconds);
                    return "Hace " + res + " segundos";
                }
            }
        }
    } else {    //Formato general
        return moment(tCreatedAt).format('DD/MM/YYYY');
    }
}

async function acceptIgnoreFollowRequest(notification, bIsAccepted) {
    const response = await axios.get("http://localhost:8000/api/getNotification/" + notification._iId);     //Puede que el usuario retire la solicitud justo cuando el otro va a aceptarla. Para evitar esto, se comprueba que existe
    if (bIsAccepted && response.data._iId != 0) {
        
        axios.patch("http://localhost:8000/api/setFollow/" + notification._issuer._iId + "/" + notification._recipient._iId)
            .then(response => {
                if (response.data) {
                    axios.post("http://localhost:8000/api/newNotification", {
                        sInfo: userStore.person._sName + " ha aceptado tu solicitud de seguimiento",
                        iRecipientId: notification._issuer._iId,
                        sType: "FollowRequestAccepted",
                        iIssuerId: userStore.person._iId
                    })
                    axios.post("http://localhost:8000/api/newNotification", {
                        sInfo: "¡Ahora " + notification._issuer._sName + " te está siguiendo!",
                        iRecipientId: userStore.person._iId,
                        sType: "NewFollow",
                        iIssuerId: notification._issuer._iId
                    })
                    .then(response => aNotifications.value.push(response.data))
                }
            })
    } else {
        axios.patch("http://localhost:8000/api/deleteNotificationById/" + notification._iId);
        aNotifications.value = aNotifications.value.filter(notif => notif._iId != notification._iId);
    }
}


async function checkFollow(notification) {
    let response = await axios.get('http://localhost:8000/api/checkFollow/' + notification._issuer._iId + '/' + notification._recipient._iId);
    return response.data;
}

function proccessFollow(notification) {
    let iNotificationIndex = aNotifications.value.findIndex(notif => notif._iId === notification._iId);
    userStore.proccessFollow(notification._issuer);
    setTimeout(() => {
        axios.get('http://localhost:8000/api/checkFollow/' + userStore.person._iId + '/' + notification._issuer._iId)
            .then(response => aNotifications.value[iNotificationIndex]._bIsFollowing = response.data)
    }, 150);
}

function generateLink(notification) {
    let sLink = "";
    if( notification._type._sName === 'NewFollow' ||
        notification._type._sName === 'FollowRequest' ||
        notification._type._sName === 'FollowRequestAccepted')
            sLink = "/profile/" + notification._issuer._sUsername;
    if(notification._type._sName === 'NewEventAssistant' ||
        notification._type._sName === 'NewEventPhoto' ||
        notification._type._sName === 'NewEventComment')
            sLink = "/events/" + notification._event._iId;
    if( notification._type._sName === 'NewPostLike' ||
        notification._type._sName === 'NewPostComment') 
            sLink = "/post/" + notification._post._iId;
    return sLink;
}


</script>


<style scoped>
.blackb {
    border: solid 1px black;
}

.notification {
    border: none;
    background-color: #e4e4e4;
}

.notification:hover {
    border: none;
    background-color: white;
    cursor: pointer;
}

.avatar-mini {
    border-radius: 50%;
    width: 30px;
    height: 30px;
}

.hline {
    border-bottom: solid 1px black;
}
</style>