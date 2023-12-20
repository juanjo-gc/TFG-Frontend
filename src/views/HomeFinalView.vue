<template>
    <div id="main" class="main">
        <div id="login" class="bg-main">
            <div class="row">
                <div class="col-md-7">
                    <!-- Logo, nombre, eslogan -->
                </div>
                <div class="col-md-4">
                    <!-- Registro / login -->
                    <div class="options-card text-black 4 pb-4">
                        <div class="row">
                            <!-- Mini logo -->
                            <div class="col-md-1"></div>
                            <div class="col-md-10">
                                <h3 class="mt-4  text-center text-white fw-bold">¡Únete a nuestra comunidad y comienza a
                                    conocer
                                    personas!</h3>
                            </div>
                            <div class="col-md-1"></div>
                        </div>
                        <div class="row mt-4">
                            <div class="col-md-1"></div>
                            <div class="col-md-10">


                                <form @submit.prevent="authUser">
                                    <!-- <label class="form-label" for="email">Correo electrónico</label> -->
                                    <div class="form-outline mb-4">
                                        <input type="email" id="email" class="form-control rounded-pill"
                                            placeholder="Correo electrónico" v-model="email" required />
                                    </div>
                                    <!-- <label class="form-label" for="passw">Contraseña</label> -->
                                    <div class="form-outline mb-4">
                                        <input type="password" id="password" placeholder="Contraseña"
                                            class="form-control rounded-pill" v-model="password" required />
                                    </div>

                                    <div class="text-center pt-1 mb-5 pb-1">
                                        <!-- <router-link to="/profile" tag="button"> -->
                                        <button class="btn btn-outline-light rounded-pill w-75 btn-block fa-lg "
                                            type="submit">
                                            Iniciar sesión
                                        </button>


                                        <!-- <router-link to="#" class="text-muted">¿Olvidaste tu contraseña?</router-link> -->
                                    </div>

                                    <div v-if="formError" class="alert alert-danger">Error. Introduce tus datos de nuevo.
                                    </div>
                                    <!-- <p>{{ userStore.person }}</p> -->
                                </form>

                                <p>--------------------------------------------------------</p>
                                <p class="mt-2 fw-bold text-center">¿No tienes una cuenta? </p>
                                <p class="mt-2 text-center">Regístrate en nuestra plataforma y empieza a interactuar
                                    con los demás usuarios.</p>
                                <button type="button"
                                    class="btn btn-outline-dark rounded-pill w-100 p-2 mt-2 mb-3 fw-bold" @click="router.push('/register')">Regístrate</button>
                                <!-- <button type="button" class="btn btn-outline-light rounded-pill w-100 p-2 mt-2"><span
                                class="fw-bold">Inicia sesión</span></button> -->
                            </div>
                            <div class="col-md-1"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="showmore" class="row position-sticky bottom-0 mt-4" @click="scrollDown()">
                <div class="col-md-5"></div>
                <div class="col-md-2 mt-4">
                    <p class="text-white text-center show-more fw-bold">Ver más</p>
                    <p class="text-white text-center"><font-awesome-icon icon="fa-solid fa-arrow-down" /></p>
                </div>
                <div class="col-md-5"></div>
            </div>
        </div>
        <div class="row bg-light p-4">
            <div class="col-md-1"></div>
            <div class="col-md-3">
                <!-- Foto 1 -->
                <img src="https://i.pinimg.com/564x/c5/f4/e9/c5f4e9f354ed07f9d02b68c408e7fe94.jpg"
                    class="rounded-photo my-2" alt="">
            </div>
            <div class="col-md-7">
                <!-- Texto 1 -->
                <div class="text-info">
                    <h4 class="fw-bold text-black text-center ">¡Conoce a nuevas personas y haz planes con ellos!</h4>
                    <p class="text-black text-center">Comienza a interactuar con nuevas personas que tengan tus mismos
                        gustos y
                        mantén el contacto con ellos mediante publicaciones o mensajes.</p>
                </div>
            </div>
        </div>
        <div class="row p-4" style="background-color: black;">
            <div class="col-md-1"></div>
            <div class="col-md-7">
                <!-- Texto 2 -->
                <div class="text-info">
                    <h4 class="fw-bold text-white text-center ">¡Apúntate a eventos que puedan interesarte!</h4>
                    <p class="text-white text-center">Busca eventos cerca de tu zona relacionados con tus gustos para quedar
                        con
                        nuevas personas y realizar una actividad en común.</p>
                </div>
            </div>
            <div class="col-md-3">
                <!-- Foto 2 -->
                <img src="https://img.freepik.com/free-photo/two-basketball-player-outdoors-court_23-2147871622.jpg?size=626&ext=jpg"
                    class="rounded-photo my-2" alt="">
            </div>
        </div>
        <div class="row p-4">
            <div class="col-md-1"></div>
            <div class="col-md-3">
                <!-- Foto 3 -->
                <img src="https://st4.depositphotos.com/1017228/21671/i/450/depositphotos_216718526-stock-photo-portrait-delighted-young-guy-playing.jpg"
                    class="rounded-photo my-2" alt="">
            </div>
            <div class="col-md-7">
                <!-- Texto 3 -->
                <div class="text-info">
                    <h4 class="fw-bold text-black text-center ">¿Eres más de estar en casa?</h4>
                    <p class="text-black text-center">Busca eventos online y encuentra gente con la que puedas jugar a tu
                        videojuego favorito, ver y hablar de series, películas y mucho más, todo desde tu propia casa.</p>
                </div>
            </div>
        </div>
        <div class="row p-4" style="background-color: black;">
            <p class="text-center text-white fs-5">Footer</p>
        </div>
    </div>
</template>
    

<script setup>

import axios from 'axios';
import Popup from '@/components/Popup.vue';
import { useUserStore } from '@/store/UserStore';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();

let email = ref("");
let password = ref("");
let bFormError = ref(false);
let bTriggerSuspendedAccountPopup = ref(false);


let main = null;
let login = null;

onMounted(() => {
    main = document.getElementById('main');
    login = document.getElementById('login');
    axios.get("http://localhost:8000/api/loadDB")
})

function scrollDown() {
    let height = login.offsetHeight;
    console.log(height)
    window.scrollTo(0, height)
}

async function authUser() {
    if (email.value === "") {
        formError.value = true;
    } else if (password.value === "") {
        formError.value = true;

    } else {

        axios.post("http://localhost:8000/api/login", {
            sEmail: email.value,
            sPassword: password.value
        })
            .then(response => {
                if (response.data._iId === 0)
                    bFormError.value = true;
                else {
                    if (!response.data._bIsSuspended) {
                        userStore.person = response.data;
                        console.log(userStore.person._sRole)
                        userStore.person._sRole === "User" ? router.push("/timeline") : router.push("/admin/dashboard")
                    } else {
                        bTriggerSuspendedAccountPopup.value = true;
                    }
                }
            })
            .catch(error => {
                console.log(error);
            })
    }
}

</script>


<style scoped>

.main {
    overflow-x: hidden;
}
.bg-main {
    height: 100vh;
    width: 100vw;
    background-color: black;
    overflow-x: hidden;
    /* background-repeat: no-repeat; */
}

.text-info {
    margin-top: 10%;
    margin-left: 5%;
    font-family: Arial, Helvetica, sans-serif;
}

.options-card {
    margin-top: 30%;
    margin-bottom: 15%;
    background-color: rgb(183, 150, 255);
    border-radius: 15px;
    /* height: 65vh;  */
    width: 30vw;
}

.rounded-photo {
    border-radius: 50%;
    object-fit: contain;
    width: 300px;
    height: 300px;
    min-width: 300px;
    min-height: 300px;
}

.show-more {
    margin-top: 50px;
}

.show-more:hover {
    cursor: pointer;
}</style>

