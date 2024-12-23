<template>
  <SidebarFinal></SidebarFinal>
  <div class="container" v-if="!bIsFetching">
    <div class="row" style="height: 150px;">
    </div>
    <div class="row">
      <div class="col-md-2 "></div>
      <div class="col-md-8">
        <div class="card">
          <div class="card-body">
            <PostComponent :post="post" :clickable="false" @report="setPopup" v-if="post._tDeleteDate === null && !post._user._bIsSuspended"></PostComponent>
            <div class="row mt-2" v-else>
              <p class="fs-4 fw-light mt-2" v-if="post._tDeleteDate != null">Esta publicación ha sido eliminada.</p>
              <p class="fs-4 fw-light mt-2" v-if="post._user._bIsSuspended">Esta publicación pertenece a una cuenta que ha sido eliminada.</p>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-2 "></div>
    </div>
    <!-- Publicar respuesta -->
    <div class="row">
      <div class="col-md-2"></div>
      <div class="col-md-8">
        <div class="reply-wrapper">
          <p class="lead fw-formal">Publica tu respuesta</p>
          <textarea maxlength="255" placeholder="Escribe tu respuesta aquí" v-model="sReplyText"></textarea>
          <span>Caracteres restantes: {{ 255 - sReplyText.length }}</span>
          <button class="btn btn-primary float-end mt-2" @click="postNewReply">Publicar respuesta</button>
        </div>
      </div>
      <div class="col-md-2"></div>
    </div>

    <!-- Listado de respuestas -->
    <div class="row">
      <div class="col-md-2"></div>
      <div class="col-md-8">
        <h5>Respuestas</h5>
        <div v-if="aReplies.length != 0">
          <div class="card-body">
            <ul class="list-unstyled">
              <li v-for="reply in aReplies">
                <PostComponent :post="reply" @report="setPopup" v-if="reply._tDeleteDate === null && !reply._user._bIsSuspended"></PostComponent>
              </li>
            </ul>
          </div>
        </div>
        <div class="card" v-else>
          <p class="lead fw-formal p-2" style="margin=20px;">Aún no hay respuestas para esta publicación :&#40;</p>
        </div>

      </div>
      <div class="col-md-2"></div>
    </div>
    <!-- Alerta -->
    <div class="alert alert-danger alert-dismissible fade show" role="alert" v-if="bError">
      <strong>Error.</strong> {{ sErrorMessage }}.
      <button type="button" class="btn-close" aria-label="Close" @click="resetErrors"></button>
    </div>

    <Popup v-if="bTriggerReportPopup">
      <div class="row">
        <div class="col-md-6">
          <h4 class="mt-4">Denunciar una publicación</h4>
        </div>
        <div class="col-md-6">
          <font-awesome-icon icon="fa-solid fa-xmark" class="float-end clickable" size="sm" style="color: #000000;"
            @click="bTriggerReportPopup = false" />
        </div>
      </div>
      <Post :post="reportedPost"></Post>
      <p class="mt-4 fw-light">En caso de que sea necesario, incluye a continuación una breve descripción que detalle los
        motivos de la denuncia.</p>
      <div class="mb-3">
        <label for="report" class="form-label">Motivo de la denuncia</label>
        <textarea class="form-control" id="report" rows="3" v-model="sReportDescription"></textarea>
      </div>
      <button type="button" class="btn btn-primary float-end" @click="reportPost(reportedPost)">Enviar</button>
    </Popup>
    <GenericReportPopup v-if="bTriggerReportSentPopup" @close="bTriggerReportSentPopup = false"></GenericReportPopup>
  </div>
</template>
    
<script setup>

import { onMounted, ref } from "vue";
import SidebarFinal from '@/components/SidebarFinal.vue'
import { useUserStore } from "@/store/UserStore";
import axios from "axios";
import moment from 'moment';
import { useRoute } from "vue-router";
import PostComponent from "@/components/PostComponent.vue";
import Popup from "@/components/Popup.vue";
import GenericReportPopup from "@/components/GenericReportPopup.vue";


const userStore = useUserStore();
const route = useRoute();
let post = ref(axios.get(userStore.baseAPIurl + "getPost/" + route.params.id));
let aReplies = ref([]);
let aLikes = ref(null);
let sLink = userStore.baseAPIurl + "getPost/" + route.params.id;
let bIsFetching = ref(true);
let sReplyText = ref("");
let bError = ref(false);
let sErrorMessage = ref("");
let sReportDescription = ref("");
let bTriggerReportPopup = ref(false);
let reportedPost = ref({});
let iPageNumber = 0;
let iTotalPages = -1;
let bTriggerReportSentPopup = ref(false);


onMounted(() => {
  axios.get(userStore.baseAPIurl + "getPost/" + route.params.id)
    .then(response => {
      post.value = response.data;
      if (post.value._iId != 0) {   // la publicación es válida
        axios.get(userStore.baseAPIurl + "getLikes/" + post.value._iId)
          .then(response => {
            aLikes.value = response.data;
          })
          .catch(error => console.log(error));
          getReplies(0);
      }
    }).catch(error => console.log(error));
})

function setPopup(post) {
  reportedPost.value = post;
  bTriggerReportPopup.value = true;
}

function resetErrors() {
  bError.value = false;
  sErrorMessage.value = "";
}

function reportPost(post) {
  console.log(sReportDescription._rawValue)
  axios.post(userStore.baseAPIurl + "newTicket", {
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


function setLike(postId) {
  axios.post(userStore.baseAPIurl + "setLike/" + postId + "/" + userStore.person._iId)
    .then(response => {
      if (response.data === true) {
        post.value._iLikes++;
      } else {
        post.value._iLikes--;
      }
    })
}

function getReplies(iPageNumber) {
  axios.get(userStore.baseAPIurl + "getReplies/" + post.value._iId + "/" + iPageNumber)
    .then(response => {
      aReplies.value = aReplies.value.concat(response.data.content);
      iTotalPages = response.data.totalPages;
      bIsFetching.value = false;

      })
    .catch(error => console.log(error));
}

function postNewReply() {
  if (sReplyText.value === "") {
    bError.value = true;
    sErrorMessage.value = "La respuesta no puede estar vacía."
  } else {
    axios.post(userStore.baseAPIurl + "newReply/" + post.value._iId, {
      sText: sReplyText.value,
      iUserId: userStore.person._iId
    })
      .then(response => {
        let reply = response.data;
        aReplies.value.push(reply);
        if (post.value._user._iId != userStore.person._iId) {
          axios.post(userStore.baseAPIurl + "newNotification", {
            sInfo: "¡" + userStore.person._sName + " ha comentado tu publicación!",
            iRecipientId: post.value._user._iId,
            iIssuerId: userStore.person._iId,
            sType: "NewPostComment",
            iPostId: reply._iId
          })
        }
      })
      .catch(error => console.log(error));
    sReplyText.value = "";
  }
}

window.onscroll = () => {
  if(document.documentElement.scrollTop + window.innerHeight === document.documentElement.offsetHeight) {
    iPageNumber++;
    if(iPageNumber < iTotalPages) {
      getReplies(iPageNumber);
    }
  }
}


</script>
    
<style scoped>
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


.reply-wrapper {
  padding: 20px;
  margin: 10px;
}

textarea {
  width: 100%;
  height: 100px;
}

.clickable:hover {
  cursor: pointer;
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





.blackb {
  border: solid 2px black;
}
</style>
    