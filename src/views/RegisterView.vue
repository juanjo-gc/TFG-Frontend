<template>
  <div class="main">
    <section class="h-100 gradient-form backgroundPattern">
      <div class="container py-5 h-100 ext">
        <div class="row d-flex justify-content-center align-items-center h-100">
          <div class="col-xl-6">
            <div class="card rounded-3 text-black">
              <div class="row g-0">
                <!-- <div class="col-lg-6"> -->
                <div class="card-body p-md-5 mx-md-4">
                  <div class="text-center">
                    <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/lotus.webp"
                      style="width: 185px" alt="logo" />
                    <h4 class="mt-1 mb-5 pb-1">Registrar una cuenta</h4>
                  </div>

                  <!-- <form @submit.prevent="userStore.registerUser(email, name, username, password, confirmPassword, birthDate)"> -->
                  <!-- <form @submit.prevent="registerUser"> -->
                  <form>
                    <!-- <p>Please login to your account</p> -->
                    <label class="form-label" for="email">Correo electrónico</label>
                    <div class="form-outline mb-4">
                      <input type="email" id="email" class="form-control" v-model="email" @keyup="checkEmail" required />
                      <small class="text-muted" v-if="isEmailTaken">Esa dirección de correo ya está en uso.</small>
                    </div>
                    <label class="form-label" for="name">Nombre</label>
                    <div class="form-outline mb-4">
                      <input type="text" id="name" class="form-control"
                        placeholder="El nombre que será visible para los demás" v-model="name" />
                    </div>
                    <label class="form-label" for="username">Usuario</label>
                    <div class="form-outline mb-4">
                      <input type="text" id="username" class="form-control"
                        placeholder="Debe ser único y servirá para identificarte" v-model="username"
                        @keyup="checkUsername" required />
                      <small class="text-muted" v-if="isUsernameTaken">Ese nombre de usuario ya está en uso</small>
                      <small class="text-muted" v-if="bIsUsernameIncorrect">El nombre de usuario no puede contener
                        caracteres especiales ni espacios.</small>
                    </div>
                    <label class="form-label" for="password">Contraseña</label>
                    <div class="form-outline mb-4">
                      <input type="password" id="password" class="form-control" v-model="password" required />
                    </div>
                    <label class="form-label" for="password">Confirmar contraseña</label>
                    <div class="form-outline mb-4">
                      <input type="password" id="confirmPassword" class="form-control" v-model="confirmPassword"
                        required />
                    </div>
                    <label class="form-label" for="birthDate">Fecha de nacimiento</label>
                    <div class="form-outline mb-4">
                      <input type="date" id="birthDate" class="form-control" v-model="birthDate" required />
                    </div>
                    <!-- <div class="mb-3">
                        <label class="form-label" for="province">Localización</label>
                        <div class="row">
                          <div class="col-md-4">
                          <select class="form-select" aria-label="Default select example" v-model="sCountry" @change="getRegions()">
                            <option selected disabled>País</option>
                            <option :value="country._sName" v-for="country in aCountries">{{ country._sName }}</option>
                          </select>
                        </div>
                        <div class="col-md-4">
                          <select class="form-select" aria-label="Default select example" v-model="sRegion" :disabled="sCountry === 'País'" @change="getProvinces(sRegionName)">
                            <option selected disabled>Comunidad autónoma</option>
                            <option :value="region._sName" v-for="region in aFilteredRegions">{{ region._sName }}</option>
                          </select>
                        </div>
                        <div class="col-md-4">
                          <select class="form-select" aria-label="Default select example" v-model="sProvince" :disabled="sRegion === 'Comunidad autónoma'">
                            <option selected disabled>Provincia</option>
                            <option :value="province._sName" v-for="province in aFilteredProvinces">{{ province._sName }}</option>
                          </select>
                        </div>
                      </div>
                    </div> -->
                    <div class="text-center pt-1 mb-5 pb-1">
                      <!-- <router-link to="/"> -->
                      <button class="btn btn-primary btn-block fa-lg gradient-custom mb-3 btnLogin" type="button"
                        @click="registerUser">
                        Regístrate
                      </button>
                      <!-- </router-link> -->
                      <br />
                      <router-link to="/login" class="text-muted">¿Tienes ya una cuenta? Inicia sesión</router-link>
                    </div>
                  </form>
                </div>
              </div>
              <!-- </div> -->
            </div>
          </div>
        </div>
      </div>
    </section>
    <div class="alert alert-danger alert-dismissible fade show" role="alert" v-if="bTriggerErrorAlert">
      <strong>Error. </strong>{{ sAlertMessage }}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"
        @click="bTriggerErrorAlert = false;"></button>
    </div>
    <Popup v-if="bTriggerSuccessPopup">
      <div class="row">
        <h4 class="mt-4">¡Felicidades! Te has registrado.</h4>
      </div>
      <p class="mt-4 fw-light">Te estamos redirigiendo para que inicies sesión.</p>
    </Popup>
  </div>
</template>

<script setup>
import { useUserStore } from '@/store/UserStore';
import Popup from '@/components/Popup.vue';
import axios from 'axios';
import { ref, onMounted } from 'vue';
import moment from 'moment';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();
let email = ref("");
let name = ref("");
let username = ref("");
let password = ref("");
let confirmPassword = ref("");
let birthDate = ref(new Date());
let isUsernameTaken = ref(false);
let bIsUsernameIncorrect = ref(false);
let isEmailTaken = ref(false);
let aCountries = ref([]);
let aRegions = ref([]);
let aProvinces = ref([]);
let sProvince = ref("Provincia");
let sRegion = ref("Comunidad autónoma");
let sCountry = ref("País");
let aFilteredRegions = ref([]);
let aFilteredProvinces = ref([]);
let bTriggerErrorAlert = ref(false);
let sAlertMessage = ref("");
let bTriggerSuccessPopup = ref(false);

onMounted(() => {
  axios.get("http://localhost:8000/api/getAllCountries")
    .then(response => aCountries.value = response.data);
  axios.get("http://localhost:8000/api/getAllRegions")
    .then(response => aRegions.value = response.data);
  axios.get("http://localhost:8000/api/getAllProvinces")
    .then(response => aProvinces.value = response.data);
})

function getRegions(sCountryName) {
  // if(sCountry.value != 'País') {
  //   sRegion.value = 'Comunidad autónoma';
  //   sProvince.value = "Provincia";
  // }
  console.log(sCountry.value)
  sRegion.value = 'Comunidad autónoma';
  sProvince.value = "Provincia";
  aFilteredRegions.value = aRegions.value.filter(region => region._country._sName === sCountry.value);
  console.log(aFilteredRegions.value)
}

function getProvinces() {
  // if(sRegion.value != 'Comunidad autónoma') {
  //   sProvince.value = 'Provincia';
  // }
  sProvince.value = "Provincia";
  aFilteredProvinces.value = aProvinces.value.filter(province => province._region._sName === sRegion.value);
}

function selectProvince(province) {
  if (province._region._country._sName != sCountry.value) {
    sRegion.value = province._region._sName;
    sCountry.value = province._region._country._sName;
    getRegions();
    getProvinces();
  }
}

async function checkEmail() {
  axios.post("http://localhost:8000/api/checkEmail", {
    sEmail: email.value
  })
    .then(response => {
      isEmailTaken.value = response.data
    })
    .catch(error => console.log(error))
}

async function checkUsername() {
  let whiteSpaceRegex = new RegExp(/\W+/);
  let alphanumericRegex = new RegExp(/[a-zA-Z0-9]/);
  if (username.value.match(whiteSpaceRegex) || !username.value.match(alphanumericRegex))
    bIsUsernameIncorrect.value = true;
  else
    bIsUsernameIncorrect.value = false;

  if (!bIsUsernameIncorrect.value) { //Enviar peticion si el mensaje es correcto
    axios.post("http://localhost:8000/api/checkUser", {
      sUsername: username.value
    })
      .then(response => {
        isUsernameTaken.value = response.data
      })
      .catch(error => console.log(error))
  }
}


async function registerUser() {
  if (isUsernameTaken.value || bIsUsernameIncorrect.value) {
    bTriggerErrorAlert.value = true;
    sAlertMessage.value = isUsernameTaken.value ? "El nombre de usuario ya se encuentra en uso." : "Escribe un nombre de usuario correcto de acuerdo a las indicaciones";
  } else if (isEmailTaken.value) {
    bTriggerErrorAlert.value = true;
    sAlertMessage.value = "La dirección de correo ya se encuentra en uso."
  } else if (password.value != confirmPassword.value) {
    bTriggerErrorAlert.value = true;
    sAlertMessage.value = "Las contraseñas deben coincidir.";
  } else if (moment(birthDate.value).add(18, 'years').isAfter(moment(Date.now()))) {
    bTriggerErrorAlert.value = true;
    sAlertMessage.value = "Debes ser mayor de edad para registrarte."
    // } else if(sProvince.value === 'Provincia') {
    //   bTriggerErrorAlert.value = true;
    //   sAlertMessage.value = "Asegúrate de elegir una localización correcta."
  } else {
    console.log("hola")
    axios.post("http://localhost:8000/api/register", {
      sEmail: email.value,
      sName: name.value,
      sUsername: username.value,
      sPassword: password.value,
      tBirthDate: birthDate.value,
      sProvince: null
    })
      .then(response => {
        bTriggerSuccessPopup.value = true;
        setTimeout(() => {
          router.push('/');
        }, 4500);
      })
      .catch(error => {
        console.log(error);
      })
  }
}

</script>

<style scoped>
.btnLogin {
  border: none;
  opacity: 0.7;
}

.btnLogin:hover {
  border: none;
  opacity: 1;
}

.gradient-custom {
  background: rgb(131, 58, 180);
  background: linear-gradient(90deg,
      rgba(131, 58, 180, 1) 0%,
      rgba(253, 29, 29, 1) 51%,
      rgba(252, 176, 69, 1) 100%);
}

.backgroundPattern {
  background: rgb(180, 142, 0);
  background: radial-gradient(circle, rgba(180, 142, 0, 1) 0%, rgba(179, 2, 172, 1) 100%);
}


/* .fixed-top {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 1030;
} */</style>
