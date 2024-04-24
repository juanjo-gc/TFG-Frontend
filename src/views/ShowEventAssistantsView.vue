<template>
    <SidebarFinal></SidebarFinal>
    <div class="container" v-if="!bIsFetching">
        <div class="row" v-if="event._tDeleteDate != null">
            <h3 class="mt-2">El evento ha sido eliminado.</h3>
            <div class="hline"></div>
            <button type="button" class="btn btn-primary mt-2" @click="router.push('/timeline')">Volver</button>
        </div>
        <div v-if="event._iId === 0">
            <h2 class="mt-4 ms-2 fw-formal">El evento no existe</h2>
        </div>
        <div v-else>
            <h2 class="mt-4 ms-2 fw-formal">Asistentes</h2>
            <div class="hline"></div>
            <div class="form-group field mt-3">
                    <div class="row">
                        <input type="input" class="form-field ms-2" placeholder="Buscar usuarios" name="name" id='name'
                        v-model="sUsernamesToSearch" @keyup="getUsersFromUsername"/>
                        <label for="name" class="form-label">Buscar usuario</label>
                    </div>
                </div>
            <div class="row mt-3 ms-2">
                <ul class="list-unstyled">
                    <li v-for="assistant in aUsers">
                        <div class="row mt-2 clickable" @click="router.push('/profile/' + assistant._sUsername)" v-if="!assistant._bIsSuspended">
                            <div class="col-sm-1">
                                <img class="mr-3 avatar float-left"
                                    :src="`http://tfgbackend:8000/api/getProfileImage/${assistant._iId}`" alt="User avatar">
                            </div>
                            <div class="col-sm-11 mt-1">
                                <h5 class="mt-0 mb-1">
                                    {{ assistant._sName }}
                                </h5>
                                <h6>
                                    <p class="text-muted">@{{ assistant._sUsername }}</p>
                                </h6>
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
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/store/UserStore';

const userStore = useUserStore();
const route = useRoute();
const router = useRouter();
let bIsFetching = ref(true);
let event = ref(null);
let aAssistants = ref([]);
let sUsernamesToSearch = ref("");
let aUsers = ref([]);
//let aAssistantProfileImages = ref([]);


onMounted(() => {
    axios.get(userStore.baseAPIurl + "getEvent/" + route.params.eventId)
        .then(response => {
            event.value = response.data;
            console.log(response.data)
            bIsFetching.value = false;
            console.log(event.value._tCelebrationHour)
            axios.get(userStore.baseAPIurl + "getEventAssistants/" + event.value._iId)
                .then(response => {
                    aAssistants.value = response.data;
                    aUsers.value = aAssistants.value;
                    //aAssistants.value.forEach(iId => aAssistantProfileImages.value.push(userStore.baseAPIurl + "getProfileImage/" + iId));
                })

        })
})

function getUsersFromUsername() {
    if(sUsernamesToSearch.value.length > 3) {
        axios.get(userStore.baseAPIurl + "getFilteredAssistants/" + sUsernamesToSearch.value + "/" + event.value._iId)
        .then(response =>{ aUsers.value = response.data})
        .catch(error => console.log(error));
    } else {
        aUsers.value = aAssistants.value;   //Ahorrar una petición
    }
}

</script>


<style scoped>

.blackb {
    border: solid 1px black;
}
.hline {
    border-bottom: solid 1px black;
}

.clickable:hover {
    cursor: pointer;
}

.avatar {
    border-radius: 50%;
    width: 50px;
    height: 50px;
  }

  .form-group {
    position: relative;
    padding: 15px 0 0;
    margin-top: 10px;
    width: 50%;
}

.form-field {
    font-family: inherit;
    width: 100%;
    border: 0;
    border-bottom: 2px solid #9b9b9b;
    outline: 0;
    font-size: 1.3rem;
    color: #000000;
    padding: 7px 0;
    background: transparent;
    transition: border-color 0.2s;
}

.form-field::placeholder {
    color: transparent;
}

.form-field:placeholder-shown~.form-label {
    font-size: 1.3rem;
    cursor: text;
    top: 20px;
}

.form-label {
    position: absolute;
    top: 0;
    display: block;
    transition: 0.2s;
    font-size: 1rem;
    color: #9b9b9b;
}

.form-field:focus {
    padding-bottom: 6px;
    font-weight: 700;
    border-width: 3px;
    /* border-image: linear-gradient(to right, #11998e, #38ef7d); */
    border-image: linear-gradient(to right, #000000, #16b1a4);
    border-image-slice: 1;
}

.form-field:focus~.form-label {
    position: absolute;
    top: 0;
    display: block;
    transition: 0.2s;
    font-size: 1rem;
    color: #11998e;
    font-weight: 700;
}

/* reset input */
.form-field:required,
.form-field:invalid {
    box-shadow: none;
}
</style>