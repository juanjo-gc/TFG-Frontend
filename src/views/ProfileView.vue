<template>
  <HeaderComponent></HeaderComponent>
  <section class="h-100 gradient-custom-2">
    <div class="container py-5 h-100">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col col-lg-12 col-xl-10">
          <div class="card">
            <div
              class="rounded-top text-white d-flex flex-row"
              style="background-color: #000; height: 200px"
            >
              <div class="ms-4 mt-5 d-flex flex-column" style="width: 150px">
                <!-- <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-1.webp" -->
                <img
                  :src="
                    sProfileImageURL
                    // 'http://localhost:8000/api/getProfileImage/' + person._iId
                    // setProfileImageURL
                  "
                  alt="ProfileImg"
                  class="img-thumbnail mt-4 mb-2"
                  style="width: 150px; z-index: 1"
                  v-if="person._iId != 0 && sProfileImageURL"
                />
                <img
                  v-else
                  src="https://camo.githubusercontent.com/eb6a385e0a1f0f787d72c0b0e0275bc4516a261b96a749f1cd1aa4cb8736daba/68747470733a2f2f612e736c61636b2d656467652e636f6d2f64663130642f696d672f617661746172732f6176615f303032322d3531322e706e67"
                  alt=""
                />
              </div>
              <div class="ms-3" style="margin-top: 130px">
                <h5>{{ person._sName }}</h5>
                <p v-if="person._iId != 0">@{{ person._sUsername }}</p>
                <p v-else>@{{ route.params.username }}</p>
              </div>
              <div class="ms-auto mt-auto mb-2 me-2">
                <ul
                  class="list-group list-group-horizontal"
                  style="list-style-type: none"
                >
                  <li
                    class="litem"
                    v-for="interest in person._setInterests"
                    :key="interest._iId"
                  >
                    {{ interest._sName }}
                  </li>
                  <!-- <li class="litem">Hola 1</li>
                  <li class="litem">Hola 2</li>
                  <li class=" litem">Hola 1</li>
                  <li class="litem">Hola 2</li> -->
                  <!-- <li class="list-group-item">Hola 1</li>
                  <li class="list-group-item">Hola 2</li> -->
                </ul>
              </div>
            </div>
            <div class="p-4 text-black" style="background-color: #f8f9fa">
              <div class="row">
                <div class="col-2">
                  <button
                    type="button"
                    class="btn btn-outline-dark"
                    data-mdb-ripple-color="dark"
                    style="margin-left: 10px; z-index: 1"
                    @click="router.push('/editProfile')"
                    v-if="person._iId === userStore.person._iId"
                  >
                    Modificar perfil
                  </button>
                  <button
                    type="button"
                    class="btn btn-outline-dark"
                    data-mdb-ripple-color="dark"
                    style="margin-left: 10px; z-index: 1"
                    @click="router.push('/photos/' +  person._sUsername)"
                    v-else
                    >
                    Ver fotos
                  </button>
                </div>
                <div class="col-7">
                  <div
                    class="d-flex justify-content-left text-left py-1"
                    style="position: relative"
                  >
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
                      <p class="mb-1 h5">253</p>
                      <p class="small text-muted mb-0">Publicaciones</p>
                    </div>
                    <div class="px-3">
                      <p class="mb-1 h5">1026</p>
                      <p class="small text-muted mb-0">Seguidos</p>
                    </div>
                    <div>
                      <p class="mb-1 h5">478</p>
                      <p class="small text-muted mb-0">Seguidores</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="card-body p-4 text-black">
              <div class="row">
                <!-- <p class="lead fw-normal mb-1">About</p> -->
                <!-- <div class="p-4" style="background-color: #f8f9fa;"> -->
                <div class="col-md colItem">
                  <button class="btnSwitch">
                    <p class="lead fw-normal mb-1">Publicaciones</p>
                  </button>
                </div>
                <div class="col-md colItem">
                  <button class="btnSwitch">
                    <p class="lead fw-normal mb-1">Eventos</p>
                  </button>
                </div>
                <!-- </div> -->
              </div>
              <p>{{ person }}</p>
              <!-- <div class="d-flex justify-content-between align-items-center mb-4">
                <p class="lead fw-normal mb-0">Recent photos</p>
                <p class="mb-0"><a href="#!" class="text-muted">Show all</a></p>
              </div>
              <div class="row g-2 blueb">
                <div class="col mb-2">
                  <img src="https://mdbcdn.b-cdn.net/img/Photos/Lightbox/Original/img%20(112).webp" alt="image 1"
                    class="w-100 rounded-3">
                </div>
                <div class="col mb-2">
                  <img src="https://mdbcdn.b-cdn.net/img/Photos/Lightbox/Original/img%20(107).webp" alt="image 1"
                    class="w-100 rounded-3">
                </div>
              </div>
              <div class="row g-2">
                <div class="col">
                  <img src="https://mdbcdn.b-cdn.net/img/Photos/Lightbox/Original/img%20(108).webp" alt="image 1"
                    class="w-100 rounded-3">
                </div>
                <div class="col">
                  <img src="https://mdbcdn.b-cdn.net/img/Photos/Lightbox/Original/img%20(114).webp" alt="image 1"
                    class="w-100 rounded-3">
                </div>
              </div> -->
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

const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
let sProfileImageURL = ref("");
let person = ref(userStore.person);

onMounted(() => {
  if (route.params.username != person._sUsername) {
    axios
      .get(
        "http://localhost:8000/api/getUserFromUsername/" + route.params.username
      )
      .then((response) => {
        person.value = response.data;
        sProfileImageURL.value =
          "http://localhost:8000/api/getProfileImage/" + person.value._iId;
      })
      .catch((error) => console.log(error));
  }
});
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
  background-image: linear-gradient(
    92.88deg,
    #455eb5 9.16%,
    #5643cc 43.89%,
    #673fd7 64.72%
  );
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
}
</style>
