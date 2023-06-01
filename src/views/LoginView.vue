<template>
  <section class="h-100 gradient-form backgroundPattern">
    <div class="container py-5 h-100 ext">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col-xl-6" >
          <div class="card rounded-3 text-black">
            <div class="row g-0">
              <!-- <div class="col-lg-6"> -->
                <div class="card-body p-md-5 mx-md-4">
                  <div class="text-center">
                    <img
                      src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/lotus.webp"
                      style="width: 185px"
                      alt="logo"
                    />
                    <h4 class="mt-1 mb-5 pb-1">Iniciar sesión</h4>
                  </div>

                  <form @submit.prevent="authUser">
                    <!-- <p>Please login to your account</p> -->
                    <label class="form-label" for="email">Correo electrónico</label>
                    <div class="form-outline mb-4">
                      <input
                        type="email"
                        id="email"
                        class="form-control"
                        placeholder="Correo electrónico"
                        v-model="email"
                        required
                      />
                    </div>
                    <label class="form-label" for="passw">Contraseña</label>
                    <div class="form-outline mb-4">
                      <input
                        type="password"
                        id="password"
                        class="form-control"
                        v-model="password"
                        required
                      />
                    </div>

                    <div class="text-center pt-1 mb-5 pb-1">
                      <!-- <router-link to="/profile" tag="button"> -->
                        <button
                        class="btn btn-primary btn-block fa-lg gradient-custom mb-3 btnLogin"
                        type="submit"
                        >
                        Iniciar sesión
                      </button>
                    <!-- </router-link> -->
                      <br>
                      <!-- <p v-if="Object.keys(userStore.person).length != 0"> {{ userStore.person }}</p>
                      <p v-if="Object.keys(userStore.person).length != 0"> {{ userStore.person._sEmail }}</p> -->
                      <router-link to="#" class="text-muted" >¿Olvidaste tu contraseña?</router-link>
                    </div>

                    <div
                      class="d-flex align-items-center justify-content-center pb-4"
                    >
                      <p class="mb-0 me-2">¿No tienes una cuenta?</p>
                      <router-link to="/register" >
                        <button type="button" class="btn btn-outline-dark">Regístrate</button>
                      </router-link>
                    </div>
                    <div v-if="formError" class="alert alert-danger">Error. Introduce tus datos de nuevo.</div>
                    <!-- <p>{{ userStore.person }}</p> -->
                  </form>
                </div>
              </div>
            <!-- </div> -->
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
  import axios from 'axios';
  import { useUserStore } from '@/store/UserStore';
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';

  const userStore = useUserStore();
  const router = useRouter();

  let email = ref("");
  let password = ref("");
  let formError = ref(false);

  async function authUser() {
    if(email.value === "") {
      formError.value = true;
    } else if(password.value === "") {
      formError.value = true;
      
    } else {

      axios.post("http://localhost:8000/api/login", {
        sEmail: email.value,
        sPassword: password.value
      })
      .then( response => {
        console.log(response)
        userStore.person = response.data;
        router.push("/timeline");
        if(userStore.person._iId === 0)
          formError.value = true;
      })
      .catch( error => {
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
    background: rgb(131,58,180);
    background: linear-gradient(90deg, rgba(131,58,180,1) 0%, rgba(253,29,29,1) 51%, rgba(252,176,69,1) 100%); 
  }

.backgroundPattern {
  background: rgb(180,142,0);
  background: radial-gradient(circle, rgba(180,142,0,1) 0%, rgba(179,2,172,1) 100%); 
}

</style>
