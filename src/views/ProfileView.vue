<template>
  <HeaderComponent></HeaderComponent>
  <section class="h-100 gradient-custom-2">
    <div class="container py-5 h-100">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col col-lg-12 col-xl-10">
          <div class="card">
            <div class="rounded-top text-white d-flex flex-row" style="background-color: #000; height: 200px">
              <div class="ms-4 mt-5 d-flex flex-column" style="width: 150px">
                <!-- <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-1.webp" -->
                <img :src="sProfileImageURL
                  // 'http://localhost:8000/api/getProfileImage/' + person._iId
                  // setProfileImageURL
                  " alt="ProfileImg" class="img-thumbnail mt-4 mb-2" style="width: 150px; z-index: 1"
                  v-if="person._iId != 0 && sProfileImageURL" />
                <img v-else
                  src="https://camo.githubusercontent.com/eb6a385e0a1f0f787d72c0b0e0275bc4516a261b96a749f1cd1aa4cb8736daba/68747470733a2f2f612e736c61636b2d656467652e636f6d2f64663130642f696d672f617661746172732f6176615f303032322d3531322e706e67"
                  alt="" />
              </div>
              <div class="ms-3" style="margin-top: 130px">
                <h5>{{ person._sName }}</h5>
                <p v-if="person._iId != 0">@{{ person._sUsername }}</p>
                <p v-else>@{{ route.params.username }}</p>
              </div>
              <div class="ms-auto mt-auto mb-2 me-2">
                <ul class="list-group list-group-horizontal" style="list-style-type: none">
                  <li class="litem" v-for="interest in person._setInterests" :key="interest._iId">
                    {{ interest._sName }}
                  </li>
                </ul>
              </div>
            </div>
            <div class="p-4 text-black" style="background-color: #f8f9fa">
              <div class="row">
                <div class="col-2" v-if="person._iId != 0">
                  <button type="button" class="btn btn-outline-dark" data-mdb-ripple-color="dark"
                    style="margin-left: 10px; z-index: 1" @click="router.push('/editProfile')"
                    v-if="person._iId === userStore.person._iId">
                    Modificar perfil
                  </button>
                  <button type="button" class="btn btn-outline-dark" data-mdb-ripple-color="dark"
                    style="margin-left: 10px; z-index: 1" @click="router.push('/photos/' + person._sUsername)" v-else>
                    Ver fotos
                  </button>
                </div>
                <div class="col-2" v-else></div>
                <div class="col-7">
                  <div class="d-flex justify-content-left text-left py-1" style="position: relative">
                    <div class="description">
                      <p class="mb-1">{{ person._sDescription }}</p>
                      <p class="lead fw-formal" v-if="person._iId == 0">
                        Esta cuenta no existe.
                      </p>
                    </div>
                  </div>
                </div>
                <div class="col-3">
                  <div class="d-flex justify-content-end text-center py-1">
                    <div>
                      <p class="mb-1 h5">{{ iNumPosts }}</p>
                      <p class="small text-muted mb-0">Publicaciones</p>
                    </div>
                    <div class="px-3">
                      <router-link :to="`/${person._sUsername}/following`" style="text-decoration: none; color: inherit;">
                        <p class="mb-1 h5">{{ iNumFollowing }}</p>
                        <p class="small text-muted mb-0">Siguiendo</p>
                      </router-link>
                    </div>
                    <div class="px-3">
                      <router-link :to="`/${person._sUsername}/followers`" style="text-decoration: none; color: inherit;">
                        <p class="mb-1 h5">{{ iNumFollowers }}</p>
                        <p class="small text-muted mb-0">Seguidores</p>
                      </router-link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-9"></div>
              <div class="col-md-3 d-flex flex-row-reverse">
                <button type="button" class="btn btn-outline-dark" data-mdb-ripple-color="dark"
                  style="margin-right: 20px; z-index: 1" @click="setFollow()" v-if="!bFollowed">
                  Seguir
                </button>
                <button type="button" class="btn btn-dark" data-mdb-ripple-color="dark"
                  style="margin-right: 20px; z-index: 1" @click="setFollow()" v-else>
                  Siguiendo
                </button>
              </div>
            </div>
            <div class="card-body p-4 text-black">
              <!-- Mostrar publicaciones y eventos -->
              <div v-if="bShouldDisplayData">

                <div class="row">
                  <!-- <p class="lead fw-normal mb-1">About</p> -->
                  <!-- <div class="p-4" style="background-color: #f8f9fa;"> -->
                  <div class="col-md colItem">
                    <button class="btnSwitch" @click="bShowPosts = true">
                      <p class="lead fw-normal mb-1">Publicaciones</p>
                    </button>
                  </div>
                  <div class="col-md colItem">
                    <button class="btnSwitch" @click="bShowPosts = false">
                      <p class="lead fw-normal mb-1">Eventos</p>
                    </button>
                  </div>
                </div>
                <!-- Mostrar publicaciones -->
                <div class="row" v-if="bShowPosts">

                  <div class="col-md-12 mt-2">
                    <div class="card">
                      <div class="card-body">
                        <ul class="list-unstyled">
                          <li v-for="post in aPosts">
                            <div class="media post-border m-2">
                              <div class="row">
                                <div class="col-md-1">
                                  <router-link :to="`/profile/${post._user._sUsername}`"
                                    style="text-decoration: none; color: inherit;">
                                    <img class="mr-3 avatar float-left"
                                      :src="`http://localhost:8000/api/getProfileImage/${post._user._iId}`"
                                      alt="User avatar">
                                  </router-link>
                                </div>
                                <div class="col-md-7">
                                  <h5 class="mt-0 mb-1">
                                    <router-link :to="`/profile/${post._user._sUsername}`"
                                      style="text-decoration: none; color: inherit;">
                                      {{ post._user._sName }}
                                    </router-link>
                                  </h5>
                                  <h6>
                                    <p class="text-muted">@{{ post._user._sUsername }}</p>
                                  </h6>
                                </div>
                                <div class="col-md-4">
                                  <p class="small text-muted" v-if="post._repliesTo != null">Respondiendo a @{{
                                    post._repliesTo._user._sUsername }}</p>
                                </div>
                              </div>
                              <div class="media-body">
                                <router-link :to="`/post/${post._iId}`" style="text-decoration: none; color: inherit;">
                                  <div>
                                    <p>{{ post._sText }}</p>
                                  </div>
                                </router-link>
                                <div class="row">
                                  <div class="col-md-3">
                                    <button class="btn float-end" style="background-color: transparent;">
                                      <font-awesome-icon icon="fa-regular fa-comment" size="sm" style="color: #1e3050;" />
                                      0
                                    </button>
                                  </div>
                                  <div class="col-md-3">
                                    <button class="btn float-end" style="background-color: transparent;"
                                      @click="setLike(post._iId)">
                                      <font-awesome-icon icon="fa-regular fa-heart" size="sm" style="color: #1e3050;" />
                                      {{ post._iLikes }}
                                    </button>
                                  </div>
                                  <div class="col-md-6">
                                    <small class="text-muted float-end" style="margin-top: 10px;">
                                      Publicado el {{ moment(post._tCreatedAt).format('D-M-YYYY') }}
                                    </small>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- Mostrar eventos -->
                <div class="row" v-else>
                  <div class="col-md-12 mt-2">
                    <div class="card">
                      <div class="card-body">
                        <ul class="list-unstyled">
                          <li v-for="event in aEvents">
                            <div class="media post-border m-2">
                              <div class="row">
                                <div class="col-md-7">
                                  <h5 class="mt-0 mb-1">
                                    <router-link :to="`/events/${event._iId}`"
                                      style="text-decoration: none; color: inherit;">
                                      {{ event._sTitle }}
                                    </router-link>
                                  </h5>
                                  <h6>
                                    <p class="text-muted">Organizado por: @{{ event._organizer._sUsername }}</p>
                                  </h6>
                                </div>
                              </div>
                              <div class="media-body">
                                <router-link :to="`/events/${event._iId}`" style="text-decoration: none; color: inherit;">
                                  <div>
                                    <p v-if="event._sDescription.length <= 250">{{ event._sDescription }}</p>
                                    <p v-else>{{ proccessDescription(event._sDescription) }}...</p>
                                  </div>
                                </router-link>
                                <div class="row">
                                  <div class="col-md-6"></div>
                                  <div class="col-md-6">
                                    <small class="text-muted float-end" style="margin-top: 10px;">
                                      Fecha del evento: {{ moment(event._tCelebratedAt).format('D-M-YYYY') }}
                                    </small>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else>
                <h5 class="lead fw-formal">Esta cuenta es privada</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import HeaderComponent from "@/components/HeaderComponent.vue";
import { useUserStore } from "@/store/UserStore";
import axios from "axios";
import { onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import moment from "moment";

const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
let sProfileImageURL = ref("");
const person = ref("");
let bIsFetching = ref(true);
let bFollowed = ref(true);
let bShowPosts = ref(true);
let aPosts = ref([]);
let aEvents = ref([]);
let iNumPosts = ref(null);
let iNumFollowing = ref(null);
let iNumFollowers = ref(null);
let bShouldDisplayData = ref(false);

onMounted(() => {
  person.value = userStore.person;
  axios
    .get(
      "http://localhost:8000/api/getUserFromUsername/" + route.params.username
    )
    .then((response) => {
      person.value = response.data;
      if (person.value._iId != 0) { //Usuario válido
        if (person.value._iId != userStore.person._iId) {  //Ahorrar petición si el usuario es el mismo
          axios.get("http://localhost:8000/api/checkFollow/" + userStore.person._iId + "/" + person.value._iId)
            .then((response) => {
              bFollowed.value = response.data;
              console.log("bFollowed: " + bFollowed.value)
              //Mostrar datos
              if (!person.value._bIsPrivate || (person.value._bIsPrivate && bFollowed.value)) { //Si la cuenta no es privada, o si es privada y el usuario le sigue, muestra datos
                bShouldDisplayData.value = true;
              }
            })
            .catch((error) => console.log(error));
        } else {
          if (userStore.person._iId === person.value._iId)    //Si el perfil es del propio usuario muestra datos
            bShouldDisplayData.value = true;
        }
        axios.get("http://localhost:8000/api/getUserPosts/" + route.params.username)
          .then(response => {
            aPosts.value = response.data;
            iNumPosts.value = aPosts.value.length;
          })
          .catch(error => console.log(error));
        axios.get("http://localhost:8000/api/getUserEvents/" + person.value._iId)
        .then(response => {
            aEvents.value = response.data;
        })
        axios.get("http://localhost:8000/api/getNumFollows/" + person.value._iId)
          .then(response => {
            iNumFollowing.value = response.data[0];
            iNumFollowers.value = response.data[1];
          })
      }
      sProfileImageURL.value =
        "http://localhost:8000/api/getProfileImage/" + person.value._iId;
      bIsFetching.value = false;
    })
    .catch((error) => console.log(error));

});

function proccessDescription(sDescription) {
  if(sDescription.length > 250) {
    let iShift = 250;
    while(sDescription.charAt(iShift) != ' ')
      iShift++;
    sDescription = sDescription.slice(0, iShift);
  }
  return sDescription;
}

function setFollow() {
  axios
    .patch(
      "http://localhost:8000/api/setFollow/" + userStore.person._iId + "/" + person.value._iId)
    .then((response) => {
      bFollowed.value = response.data;
      bFollowed.value === true ? iNumFollowers.value = iNumFollowers.value + 1 : iNumFollowers.value = iNumFollowers.value - 1;
    })
    .catch((error) => console.log(error));
}
</script>

<style scoped>
.horizontal {
  display: inline-block;
  position: absolute;
  right: 0;
}

.interest {
  border: solid 2px black;
  color: black;
  padding: 5px;
  margin-right: 15px;
  border-radius: 5px;
}

.description {
  justify-content: left;
  left: 0;
  width: 60%;
  height: 90%;
  position: absolute;
  top: 0;
}

.post-border {
  border: solid 1px #777;
  padding: 10px;
}

.avatar {
  border-radius: 50%;
  width: 50px;
  height: 50px;
}

.colItem {
  justify-content: center;
  text-align: center;
  /* border: solid 1px black;
  border-bottom-style: none ;
  border-top-style: none; */
}

.litem {
  border: solid 2px white;
  color: white;
  border-radius: 15px;
  padding: 5px;
  margin-left: 4px;
  margin-right: 2px;
}

.blueb {
  border: solid 3px blue;
}

/* CSS */
.btnSwitch {
  background-image: linear-gradient(92.88deg,
      #455eb5 9.16%,
      #5643cc 43.89%,
      #673fd7 64.72%);
  border-radius: 8px;
  border-style: none;
  box-sizing: border-box;
  color: #ffffff;
  cursor: pointer;
  flex-shrink: 0;
  /* font-family: "Inter UI","SF Pro Display",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Open Sans","Helvetica Neue",sans-serif;
  font-size: 16px;
  font-weight: 500; */
  /* height: 4rem;
  padding: 0 1.6rem; */
  height: 50px;
  padding: 0%;
  text-align: center;
  text-shadow: rgba(0, 0, 0, 0.25) 0 3px 8px;
  transition: all 0.5s;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  width: 100%;
}

.btnSwitch:hover {
  box-shadow: rgba(80, 63, 205, 0.5) 0 1px 30px;
  transition-duration: 0.1s;
}

@media (min-width: 768px) {
  .btnSwitch {
    padding: 0 2.6rem;
  }
}</style>
