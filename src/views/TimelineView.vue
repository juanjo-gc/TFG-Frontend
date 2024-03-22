<template>
  <SidebarFinal ref="sidebar"></SidebarFinal>
      <div class="col-left">
        <div class="position-fixed w-25 mt-4" style="height: 75vh; top: 15%;">
          <div class="position-absolute abs-top bg-soft rounded ms-3">
            <ul class="list-unstyled p-4 ps-1">
              <li v-for="route in aRoutes">
                <div class="row option-preview rounded-pill p-2 mt-4 ms-4" @click="router.push(route.route)">
                  <div class="col-md-2">
                    <font-awesome-icon :icon="route.icon" size="xl" color="black" />
                  </div>
                  <div class="col-md-10">
                    <span> {{ route.name }}</span>
                    <span class="bg-light px-2 ms-2 rounded" style="color: black;"
                      v-if="route.name === 'Notificaciones' && iNewNotifications > 0">{{ iNewNotifications }}</span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div class="position-absolute" style="left: 2%; bottom: 10%;">
            <div class="row option-preview rounded-pill p-2 mt-3 ms-4 bg-soft px-3 py-2"
              @click="  sidebar.setLogout();">
              <div class="col-md-2">
                <font-awesome-icon icon="fa-solid fa-right-from-bracket" size="xl" color="black" class="fa-rotate-180"/>
              </div>
              <div class="col-md-9">
                <span class="ms-2"> Cerrar sesión</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-middle">
        <div class="card new-post ">
          <div class="card-body bg-soft rounded">
            <div class="row d-flex justify-content-center">
              <div class="col-md-1 align-items-center d-flex">
                <img class="mr-3 avatar" :src="`http://localhost:8000/api/getProfileImage/${userStore.person._iId}`"
                  alt="User avatar">
              </div>
              <div class="col-md-11" style="margin: auto;">
                <h5 class="card-title mt-2">Nueva publicación</h5>
              </div>
            </div>
            <textarea class="form-control mt-2" rows="2" maxlength="255" v-model="sPost"></textarea>
            <span>Caracteres restantes: {{ 255 - sPost.length }}</span>
            <button class="btn btn-primary mt-2 float-end" @click="newPost">Publicar</button>
          </div>
        </div>

        <div class="card mt-4">
          <div class="card-body rounded">
            <div class="row" v-if="aPosts.length === 0">
              <p class="fs-5 fw-light">Parece que no hay nada por aquí... </p>
                <p class="fs-5 fw-light text-center">¡Prueba a buscar personas que puedan tener intereses comunes contigo!</p>
                <div class="row">
                  <div class="col-md-3"></div>
                  <div class="col-md-6">
                    <button type="button" class="btn btn-primary w-100" @click="router.push('/users/explore')">Descubrir personas</button>
                  </div>
                </div>
            </div>
            <ul class="list-unstyled" v-else>
              <li v-for="post in aPosts" :key="post._iId">
                <PostComponent :post="post" @report="setPopup"
                  v-if="post._tDeleteDate === null && !post._user._bIsSuspended"></PostComponent>
              </li>
            </ul>
          </div>
        </div>

      </div>
      <div class="col-right">
        <div class="position-fixed w-100 h-100">
          <div class="position-absolute ms-4 bg-soft rounded" style="top: 20%;">
            <p class="fw-bold text-center fs-5 p-4">Sugerencias de eventos para ti</p>
            <ul class="list-unstyled p-4">
              <li>
                <div class="row">
                  <div class="col-md-8">
                    <span class="fw-light ms-2">Título del evento</span>
                  </div>
                  <div class="col-md-4">
                    <span class="fw-light">Asistentes</span>
                  </div>
                </div>
              </li>
              <li v-for="event in aHotEvents" v-if="aHotEvents.length != 0">
                <div class="row border rounded-pill option-preview p-2 mt-1"
                  @click="router.push('/events/' + event._iId)">
                  <div class="col-md-10">
                    <span>{{ event._sTitle }}</span>
                  </div>
                  <div class="col-md-2">
                    <span class="float-end">{{ event._iAssistants }}</span>
                  </div>
                </div>
              </li>
              <li v-else>
                <div class="row mt-3 text-center">
                  <div class="col-md-1"></div>
                  <div class="col-md-10 text-center">
                    <span class="mt-2">No hay eventos que mostrar ahora mismo...</span>
                  </div>
                </div>
                </li>
            </ul>
            <p class="fw-light mt-3 text-center">¿Quieres hacer una búsqueda más específica?</p>
            <div class="d-flex justify-content-center p-4">
              <button type="button" class="btn btn-primary w-75 justify-self-center" @click="router.push('/events/explore')">Explorar eventos</button>
            </div>
          </div>
        </div>

      </div>
    <div
      class="alert alert-danger alert-dismissible fade show fixed-bottom d-flex justify-content-center align-content-center"
      role="alert" v-if="bTriggerEmptyPostAlert">
      <p><strong>Error.</strong> El cuerpo de la publicación debe contener al menos un carácter alfanumérico.</p>
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"
        @click="bTriggerEmptyPostAlert = false"></button>
    </div>

    <GenericReportPopup v-if="bTriggerReportSentPopup" @close="bTriggerReportSentPopup = false"></GenericReportPopup>

    <Popup v-if="bTriggerReportPopup">
      <div class="row mb-3">
        <div class="col-md-6">
          <h4 class="mt-4">Denunciar una publicación</h4>
        </div>
        <div class="col-md-6">
          <font-awesome-icon icon="fa-solid fa-xmark" class="float-end clickable" size="sm" style="color: #000000;"
            @click="bTriggerReportPopup = false" />
        </div>
      </div>
      <PostComponent :post="reportedPost"></PostComponent>
      <p class="mt-4 fw-light">En caso de que sea necesario, incluye a continuación una breve descripción que detalle los
        motivos de la denuncia.</p>
      <div class="mb-3">
        <label for="report" class="form-label">Motivo de la denuncia</label>
        <textarea class="form-control" id="report" rows="3" v-model="sReportDescription"></textarea>
      </div>
      <button type="button" class="btn btn-primary float-end" @click="reportPost(reportedPost)">Enviar</button>
    </Popup>
</template>
  
<script setup>

import { computed, onMounted, ref } from "vue";
import SidebarFinal from "@/components/SidebarFinal.vue";
import Popup from "@/components/Popup.vue";
import { useUserStore } from "@/store/UserStore";
import axios from "axios";
import moment from 'moment';
import { useRouter } from "vue-router";
import PostComponent from "@/components/PostComponent.vue";
import GenericReportPopup from "@/components/GenericReportPopup.vue";


const userStore = useUserStore();
const router = useRouter();
let sPost = ref('');
let aPosts = ref([]);
let iPageNumber = ref(0);
let iTotalPages = ref(-1);
let bTriggerEmptyPostAlert = ref(false);
let sReportDescription = ref("");
let bTriggerReportPopup = ref(false);
let reportedPost = ref(null);
let aHotEvents = ref([]);
let iNewNotifications = ref(-1);
let bTriggerReportSentPopup = ref(false);

let sidebar = ref(null);

let aRoutes = ref([
  { name: 'Ver perfil', route: '/profile/' + userStore.person._sUsername, icon: "fa-solid fa-user" },
  { name: 'Notificaciones', route: '/notifications', icon: "fa-solid fa-bell" },
  { name: 'Descubrir personas', route: '/users/explore', icon: "fa-solid fa-people-robbery" },
  { name: 'Mensajes privados', route: '/messages', icon: "fa-solid fa-message" },
]);


function newPost() {
  if (!isBlank(sPost.value)) {
    axios.post("http://localhost:8000/api/newPost", {
      sText: sPost.value,
      iUserId: userStore.person._iId
    }).then((response) => {
      aPosts.value.splice(0, 0, response.data)
      sPost.value = '';
    }).catch(error => console.log(error))
  } else {
    bTriggerEmptyPostAlert.value = true;
  }
}

onMounted(() => {
  getTimelinePosts(0);
  axios.get("http://localhost:8000/api/findHotEvents/" + userStore.person._iId)
    .then(response => {
      aHotEvents.value = response.data;
      aHotEvents.value.forEach(event =>
        axios.get("http://localhost:8000/api/getEventAssistantsNumber/" + event._iId)
          .then(response => event._iAssistants = response.data))
      axios.get("http://localhost:8000/api/countNewNotifications/" + userStore.person._iId)
        .then(response => iNewNotifications.value = response.data);
    });
})

function isBlank(sStr) {
  let bIsBlank = true;
  for (let i = 0; i < sStr.length; i++) {
    if (sStr.charAt(i) != " ")
      bIsBlank = false;
  }
  return bIsBlank;
}

function getTimelinePosts(iPageNumber) {
  axios.get("http://localhost:8000/api/getTimelinePosts/" + userStore.person._iId + "/" + iPageNumber)
    .then(response => {
      aPosts.value = aPosts.value.concat(response.data.content);
      iTotalPages.value = response.data.totalPages;
    }).catch(error => console.log(error));
}

function setPopup(post) {
  reportedPost.value = post;
  bTriggerReportPopup.value = true;
}


function reportPost(post) {
  axios.post("http://localhost:8000/api/newTicket", {
    sSubject: "Denuncia de publicación de @" + post._user._sUsername,
    sDescription: sReportDescription._rawValue,
    iIssuerId: userStore.person._iId,
    iReportedId: post._user._iId,
    iEventId: -1,
    iPostId: post._iId,
    sCategory: 'Denunciar una publicación'
  })
    .then(response => {
      bTriggerReportPopup.value = false;
      sReportDescription.value = "";
      bTriggerReportSentPopup.value = true;
    })
}


window.onscroll = () => {
  if (document.documentElement.scrollTop + window.innerHeight === document.documentElement.offsetHeight) {
    iPageNumber.value++;
    if (iPageNumber.value < iTotalPages.value)
      getTimelinePosts(iPageNumber.value);
  }
}


</script>
  
<style>

body {
  overflow-x: hidden;
}

.col-left {
  width: 20%;
  height: 75vh;
  position: fixed;
  top: 10%;
  left: 0;
}

.col-middle {
  width: 50%;
  margin-left: 22%;
}

.col-right {
  width: 25%;
  height: 75vh;
  position: fixed;
  margin-right: 4%;
  top: 10%;
  right: 0;
}

.social-media-wall {
  margin-top: 20px;
}

.list-unstyled {
  padding: 0;
  margin: 0;
}

.media {
  margin-bottom: 10px;
}

.media-body {
  overflow: hidden;
}

.media-body p {
  max-height: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.clickable {
  cursor: pointer;
}

.text-muted {
  color: #777;
}

.post-border {
  border: solid 1px #d0d0d0;
  padding: 10px;
}

.new-post {
  margin-top: 75px;
}

.avatar {
  border-radius: 50%;
  width: 50px;
  height: 50px;
}

.centered-image {
  display: block;
  margin-right: auto;
  margin-left: auto;
  width: 40%;
}

.abs-top {
  top: 10%;
}

.abs-right {
  right: 2%;
}

.option-preview:hover {
  cursor: pointer;
  background-color: #d8d8ff;
}


.button-like {
  border: 2px solid #8a8a8a;
  background-color: transparent;
  text-decoration: none;
  padding: 1rem;
  position: relative;
  vertical-align: middle;
  text-align: center;
  display: inline-block;
  border-radius: 3rem;
  color: #8a8a8a;
  transition: all ease 0.4s;
}

.button-like span {
  margin-left: 0.5rem;
}

.button-like .fa,
.button-like span {
  transition: all ease 0.4s;
}

.button-like:focus {
  background-color: transparent;
}

.button-like:focus .fa,
.button-like:focus span {
  color: #8a8a8a;
}

.button-like:hover {
  border-color: #cc4b37;
  background-color: transparent;
}

.button-like:hover .fa,
.button-like:hover span {
  color: #cc4b37;
}

.liked {
  background-color: #cc4b37;
  border-color: #cc4b37;
}

.liked .fa,
.liked span {
  color: #fefefe;
}

.liked:focus {
  background-color: #cc4b37;
}

.liked:focus .fa,
.liked:focus span {
  color: #fefefe;
}

.liked:hover {
  background-color: #cc4b37;
  border-color: #cc4b37;
}

.liked:hover .fa,
.liked:hover span {
  color: #fefefe;
}


.bg-soft {
  background-color: #f6f6ff;
}


.blackb {
  border: solid 2px black;
}
</style>
  