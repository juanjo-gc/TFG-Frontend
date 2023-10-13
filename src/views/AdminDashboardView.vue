<template>
<div class="container" v-if="!bIsFetching">
    <h2 class="fw-formal mt-4">Panel de administración</h2>
    <div class="hline"></div>
    <div class="row mt-4">
        <div class="col-md-4">
            <h3 class="fw-formal">Acciones</h3>
            <div class="hline"></div>
            <ul class="list-unstyled mt-4">
                <li v-for="action in aActions">
                    <div class="row ms-1">
                        <div class="col-md-10 p-1 option" @click="router.push(action.route)">
                            <div class="row">
                                <div class="col-sm-1 ">
                                    <font-awesome-icon icon="fa-solid fa-angle-right" />
                                </div>
                                <div class="col-sm-9 ">
                                    <p>{{ action.action }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <div class="col-md-1"></div>
        <div class="col-md-7">
            <h3 class="fw-formal">Estado de la página</h3>
            <div class="hline mb-4"></div>
            <div class="row mt-2">
                <div class="col-md-1"></div>
                <div class="col-md-4 stat-box " style="background-color: rgb(146, 204, 255);">
                    <h4 class="d-flex justify-content-center mt-4">{{ lEvents }}</h4>
                    <h4 class="d-flex justify-content-center mt-4">Eventos creados</h4>
                </div>
                <div class="col-md-1"></div>
                <div class="col-md-4 stat-box " style="background-color: rgb(255, 97, 97);">
                    <h4 class="d-flex justify-content-center mt-4">{{ lPosts }}</h4>
                    <h4 class="d-flex justify-content-center mt-4">Publicaciones</h4>
                </div>
            </div>
            <div class="row mt-4">
                <div class="col-md-1"></div>
                <div class="col-md-4 stat-box " style="background-color: rgb(255, 248, 117);">
                    <h4 class="d-flex justify-content-center mt-4">{{ lUsers }}</h4>
                    <h4 class="d-flex justify-content-center mt-4">Usuarios registrados</h4>
                </div>
                <div class="col-md-1"></div>
                <div class="col-md-4 stat-box " style="background-color: rgb(97, 255, 105);">
                    <h4 class="d-flex justify-content-center mt-4">{{ lMessages }}</h4>
                    <h4 class="d-flex justify-content-center mt-4">Mensajes enviados</h4>
                </div>
            </div>
        </div>
    </div>
    <div class="row mt-4">
        <div class="col-md-4">
            <h3>Últimas operaciones realizadas</h3>
            
        </div>
        <div class="col-md-2">
            <router-link to="/admin/operations" style="text-decoration: none; color: inherit;">
                <p class="small mt-2 float-start">Ver todo</p>
            </router-link>
        </div>
        <div class="hline"></div>
    </div>
    <div class="row mt-4">
        <div class="row">
            <div class="col-md-2"><p class="fw-bold">Administrador</p></div>
            <!-- <div class="col-md-1"></div> -->
            <div class="col-md-2"><p class="fw-bold">Fecha</p></div>
            <div class="col-md-8"><p class="fw-bold">Operación</p></div>
        </div>
        <ul class="list-unstyled">
            <li v-for="operation in aLastOperations">
                <div class="row">
                    <div class="col-md-2">
                        {{ operation._admin._sUsername }}
                    </div>
                    <div class="col-md-2 d-flex">
                        {{ moment(operation._tTimestamp).format("DD/MM/YYYY") }}
                    </div>
                    <div class="col-md-8">
                        {{ truncateText(operation._sInformation) }}
                    </div>
                </div>
            </li>
        </ul>
    </div>
</div>

</template>
    
<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import moment from 'moment';


const router = useRouter();
const aActions = [  {action: "Gestionar tickets", route: "/admin/tickets"},
                    {action: "Gestionar usuarios", route: "/admin/manage/users"},
                    {action: "Gestionar contenido", route: "/admin/manage/content"}
                ];
const aLastOperations = ref([]);
let lUsers = 0;
let lEvents = 0;
let lMessages = 0;
let lPosts = 0;
let bIsFetching = ref(true);

onMounted(() => {
    axios.get("http://localhost:8000/api/countUsers").then(response => lUsers = response.data);
    axios.get("http://localhost:8000/api/countEvents").then(response => lEvents = response.data);
    axios.get("http://localhost:8000/api/countMessages").then(response => lMessages = response.data);
    axios.get("http://localhost:8000/api/countPosts").then(response => {
        lPosts = response.data
        bIsFetching.value = false;
    });
    axios.get("http://localhost:8000/api/getOperations/0")
    .then(response => aLastOperations.value = response.data.content)

    setTimeout(() => {
        console.log(lUsers)
        console.log(lEvents)
        console.log(lPosts)
        console.log(lMessages)

    }, 1000);


})

function truncateText(text) {
    if(text.length > 75)
        return text.slice(0, 75);
    else
        return text;
}


</script>


<style scoped>
.hline{
    border-bottom: solid black 1px;
}

.blackb {
    border: solid 1px black;
}

.stat-box {
    height: 150px;
}

.option:hover {
    background-color: rgb(224, 240, 255);
    cursor: pointer;
}
</style>