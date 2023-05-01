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
                  <form @submit.prevent="registerUser">
                    <!-- <p>Please login to your account</p> -->
                    <label class="form-label" for="email">Correo electrónico</label>
                    <div class="form-outline mb-4">
                      <input type="email" id="email" class="form-control" v-model="email" @keyup="checkEmail" required/>
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
                        placeholder="Debe ser único y servirá para identificarte" v-model="username" @keyup="checkUsername" required/>
                      <small class="text-muted" v-if="isUsernameTaken">Ese nombre de usuario ya está en uso</small>
                    </div>
                    <label class="form-label" for="password">Contraseña</label>
                    <div class="form-outline mb-4">
                      <input type="password" id="password" class="form-control" v-model="password" required/>
                    </div>
                    <label class="form-label" for="password">Confirmar contraseña</label>
                    <div class="form-outline mb-4">
                      <input type="password" id="confirmPassword" class="form-control" v-model="confirmPassword" required/>
                    </div>
                    <label class="form-label" for="birthDate">Fecha de nacimiento</label>
                    <div class="form-outline mb-4">
                      <input type="date" id="birthDate" class="form-control" v-model="birthDate" required/>
                    </div>

                    <div class="text-center pt-1 mb-5 pb-1">
                      <!-- <router-link to="/"> -->
                      <button class="btn btn-primary btn-block fa-lg gradient-custom mb-3 btnLogin" type="submit">
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
  </div>
</template>

<script setup>
import { useUserStore } from '@/store/UserStore';
import axios from 'axios';
import { ref } from 'vue';

const userStore = useUserStore();
let email = ref("");
let name = ref("");
let username = ref("");
let password = ref("");
let confirmPassword = ref("");
let birthDate = ref(new Date());
let isUsernameTaken = ref(false);
let isEmailTaken = ref(false);

async function checkEmail() {
  axios.post("http://localhost:8000/api/checkEmail", {
    sEmail: email.value
  })
  .then( response => {
    isEmailTaken.value = response.data
  })
  .catch( error => console.log(error))
}

async function checkUsername() {
  axios.post("http://localhost:8000/api/checkUser", {
    sUsername: username.value
  })
  .then( response => {
    isUsernameTaken.value = response.data
  })
  .catch( error => console.log(error))
}


async function registerUser() {
  if(isUsernameTaken.value) {
    alert("Error. El nombre de usuario ya se encuentra en uso.")
  } else if(isEmailTaken.value) {
    alert("Error. La dirección de correo ya se encuentra en uso.")

  } else if (password.value != confirmPassword.value) {
    alert("Error. Las contraseñas deben coincidir.");
  } else 
    // if (new Date(birthDate.value.value.getFullYear() + 18, birthDate.value.getMonth() - 1, birthDate.value.getDay) > new Date()) { // menor de 18
      if(password.value === "asdsdfhgtrwh") {
        alert("Error. Debes ser mayor de edad para registrarte.")
    } else {
      axios.post("http://localhost:8000/api/register", {
        sEmail: email.value,
        sName: name.value,
        sUsername: username.value,
        sPassword: password.value,
        tBirthDate: birthDate.value
      })
        .then(response => {
          console.log(response)
          alert(response.data);
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
  background: rgb(180,142,0);
background: radial-gradient(circle, rgba(180,142,0,1) 0%, rgba(179,2,172,1) 100%); 
}


/* .fixed-top {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 1030;
} */
</style>
