<template>
    <SidebarFinal></SidebarFinal>
    <div class="container" v-if="!bIsFetching">
        <div class="row mt-4">
            <div class="col-md-1"></div>
            <div class="col-md-10 border border-2 mx-4 p-4">
                <div class="row">
                    <div class="col-md-2" v-if="bIsBlockedByPerson || bIsPersonBlocked">
                        <img :src="userStore.baseAPIurl + 'getProfileImage/0'" alt="" class="img-min-circle mt-2 mb-2" />
                    </div>
                    <div class="col-md-2" v-else>
                        <img :src="sProfileImageURL
                            // 'http://localhost:8000/api/getProfileImage/' + person._iId
                            // setProfileImageURL
                            " alt="ProfileImg" class="img-min-circle mt-2 mb-2"
                            v-if="person._iId != 0 && sProfileImageURL" />
                        <img v-else :src="userStore.baseAPIurl + 'getProfileImage/0'" alt=""
                            class="img-min-circle mt-2 mb-2" />
                    </div>
                    <div class="col-md-6">
                        <div class="row" v-if="person._iId != 0">
                            <p class="mt-4 fs-4">{{ person._sName }}</p>
                            <p class="text-muted">@{{ person._sUsername }}</p>
                        </div>
                        <div class="row" v-else>
                            <p class="mt-4 fs-4">Esta cuenta no existe</p>
                            <p class="text-muted">@{{ route.params.username }}</p>

                        </div>
                    </div>
                    <div class="col-md-4 ">
                        <div class="row mt-2">
                            <div class="col-md-8"
                                v-if="!bIsBlockedByPerson && !bIsPersonBlocked && userStore.person._iId != person._iId && person._iId != 0">
                                <button type="button" class="btn btn-outline-primary mt-3 float-end" v-if="!bFollowed"
                                    @click="setFollow">Seguir</button>
                                <button type="button" class="btn btn-secondary mt-3 float-end"
                                    v-else-if="!bFollowed && bIsPending" @click="setFollow">Pendiente</button>
                                <button type="button" class="btn btn-secondary mt-3 float-end" v-else-if="bFollowed"
                                    @click="setFollow">Siguiendo</button>
                            </div>
                            <div class="col-md-8" v-else>
                                <button type="button" class="btn btn-primary mt-3 float-end"
                                    @click="router.push('/editProfile')" v-if="userStore.person._iId === person._iId">
                                    Editar perfil
                                </button>
                            </div>
                            <div class="col-md-2" @click="bShowOptions = !bShowOptions"
                                v-if="userStore.person._iId != person._iId && person._iId != 0">
                                <div class="justify-content-center align-content-center d-flex mt-3 options-button p-2">
                                    <font-awesome-icon icon="fa-solid fa-ellipsis-vertical" size="xl" class="" />
                                </div>
                            </div>
                            <div class="col-md-6"></div>
                            <div class="col-md-6" v-if="bShowOptions">
                                <ul class="list-unstyled border my-2">
                                    <li>
                                        <div class="dropdown-option p-2" @click="setBlockReportPopup(true)">
                                            <p v-if="!bIsPersonBlocked">Bloquear usuario</p>
                                            <p v-else>Desbloquear usuario</p>
                                        </div>
                                    </li>
                                    <li>
                                        <div class="dropdown-option p-2" @click="setBlockReportPopup(false)">Denunciar
                                            usuario</div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-7">
                        <p class="mt-2 ms-2 fw-light text-break">{{ person._sDescription }}</p>
                        <p class="mt-4" v-if="person._province != null">
                            <strong>Ubicación: </strong>{{ person._province._sName }}, {{ person._province._region._sName
                            }}, {{ person._province._region._country._sName }}
                        </p>
                    </div>
                    <div class="col-md-1"></div>
                    <div class="col-md-4" v-if="person._iId != 0">
                        <div class="row" v-if="!bIsBlockedByPerson && !bIsPersonBlocked">
                            <div class="col-md-4" style="word-wrap: keep-all;">
                                <p class="mb-1 h5 text-center">{{ iNumPosts }}</p>
                                <p class="small text-muted mb-0 text-center">Publicaciones</p>
                            </div>
                            <div class="col-md-4">
                                <router-link :to="`/${person._sUsername}/following`"
                                    style="text-decoration: none; color: inherit;">
                                    <p class="mb-1 h5 text-center">{{ iNumFollowing }}</p>
                                    <p class="small text-muted mb-0 text-center">Siguiendo</p>
                                </router-link>
                            </div>
                            <div class="col-md-4">
                                <router-link :to="`/${person._sUsername}/followers`"
                                    style="text-decoration: none; color: inherit;">
                                    <p class="mb-1 h5 text-center">{{ iNumFollowers }}</p>
                                    <p class="small text-muted mb-0 text-center">Seguidores</p>
                                </router-link>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row" v-if="person._iId != 0">
                    <div class="row mt-2" v-if="!bIsBlockedByPerson && !bIsPersonBlocked && person._iId != 0">
                        <div class="col-md-3 border border-end-0 category" :class="{ selected: abSelectedCategory[0] }"
                            @click="selectCategory(0)">
                            <p class="m-2 p-2 text-center opt-text">Publicaciones</p>
                        </div>
                        <div class="col-md-3 border border-end-0 category" :class="{ selected: abSelectedCategory.at(1) }"
                            @click="selectCategory(1)">
                            <p class="m-2 p-2 text-center">Eventos</p>
                        </div>
                        <div class="col-md-3 border border-end-0 category" :class="{ selected: abSelectedCategory[2] }"
                            @click="selectCategory(2)">
                            <p class="m-2 p-2 text-center">Información</p>
                        </div>
                        <div class="col-md-3 border category" :class="{ selected: abSelectedCategory[3] }"
                            @click="selectCategory(3)">
                            <p class="m-2 p-2 text-center">Me gusta</p>
                        </div>
                    </div>
                    <div class="row mt-4" v-else>
                        <p class="fs-5 fw-light" v-if="bIsBlockedByPerson">
                            Este usuario te ha bloqueado
                        </p>
                        <p class="fs-5 fw-light" v-else>
                            Bloqueaste a este usuario
                        </p>
                    </div>
                    <!-- Publicaciones -->
                    <div class="row" v-if="!bIsBlockedByPerson && !bIsPersonBlocked">
                        <div class="row mt-4" v-if="abSelectedCategory[0]">
                            <div class="row"
                                v-if="!person._bIsPrivate || bFollowed || userStore.person._iId === person._iId">
                                <h5 class="mt-2 fs-light">Publicaciones de {{ person._sName }}</h5>
                                <ul class="list-unstyled mt-2">
                                    <li v-for="post in aPosts" :key="post._iId">
                                        <PostComponent :post="post" @report="(repPost) => {reportedPost = repPost; bTriggerPostReportPopup = true;}"
                                            v-if="post._tDeleteDate === null && !post._user._bIsSuspended"></PostComponent>
                                    </li>
                                </ul>
                            </div>
                            <div class="row" v-else>
                                <p class="mt-2 fs-light fs-5">Esta cuenta es privada.</p>
                            </div>
                        </div>
                        <!-- Eventos -->
                        <div class="row mt-4" v-if="abSelectedCategory[1]">
                            <div class="row"
                                v-if="!person._bIsPrivate || bFollowed || userStore.person._iId === person._iId">
                                <div class="row d-flex justify-content-center">
                                    <select class="form-select justify-self-center p-2 ms-4" v-model="bEventSelector">
                                        <option :value="true" selected>Participados</option>
                                        <option :value="false" v-if="person._iId != userStore.person._iId">Creados por {{
                                            person._sName }}</option>
                                        <option :value="false" v-else>Creados por mí</option>
                                    </select>
                                </div>
                                <div class="col-md-12 mt-2">
                                    <ul class="list-unstyled">
                                        <li v-for="event in aEvents" v-if="bEventSelector">
                                            <div class="media event-card m-2" v-if="event._tDeleteDate === null" @click="router.push('/events/' + event._iId)">
                                                <div class="row">
                                                    <div class="col-md-7">
                                                        <h5 class="mt-0 mb-1">
                                                            {{ event._sTitle }}
                                                        </h5>
                                                        <h6>
                                                            <p class="text-muted">Organizado por: @{{
                                                                event._organizer._sUsername }}</p>
                                                        </h6>
                                                    </div>
                                                    <div class="col-md-4">
                                                        <!-- <p class="text-muted" v-if="event._location != null">
                                                            <strong>Celebrado en: </strong>{{
                                                                event._location._province._sName }},
                                                            {{ event._location._province._region._sName }}, {{
                                                                event._location._province._region._country._sName }}
                                                        </p>
                                                        <p class="text-muted float-end" v-else><strong>Evento
                                                                online</strong>
                                                        </p> -->
                                                    </div>
                                                </div>
                                                <div class="media-body">
                                                    <router-link :to="`/events/${event._iId}`"
                                                        style="text-decoration: none; color: inherit;">
                                                        <div>
                                                            <p v-if="event._sDescription.length <= 250">{{
                                                                event._sDescription }}</p>
                                                            <p v-else>{{ proccessDescription(event._sDescription) }}...</p>
                                                        </div>
                                                    </router-link>
                                                    <div class="row">
                                                        <div class="col-md-6"></div>
                                                        <div class="col-md-6">
                                                            <small class="text-muted float-end" style="margin-top: 10px;">
                                                                Fecha del evento: {{
                                                                    moment(event._tCelebratedAt).format('D-M-YYYY') }}
                                                            </small>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                        <li v-for="event in aCreatedEvents" v-else>
                                            <div class="media event-card m-2" v-if="event._tDeleteDate === null">
                                                <div class="row">
                                                    <div class="col-md-7">
                                                        <h5 class="mt-0 mb-1">
                                                            <router-link :to="`/events/${event._iId}`"
                                                                style="text-decoration: none; color: inherit;">
                                                                {{ event._sTitle }}
                                                            </router-link>
                                                        </h5>
                                                        <h6>
                                                            <p class="text-muted">Organizado por: @{{
                                                                event._organizer._sUsername }}</p>
                                                        </h6>
                                                    </div>
                                                    <div class="col-md-4">
                                                        <p class="text-muted" v-if="event._location != null">
                                                            <strong>Celebrado en: </strong>{{
                                                                event._location._province._sName }},
                                                            {{ event._location._province._region._sName }}, {{
                                                                event._location._province._region._country._sName }}
                                                        </p>
                                                        <p class="text-muted float-end" v-else><strong>Evento
                                                                online</strong>
                                                        </p>
                                                    </div>
                                                </div>
                                                <div class="media-body">
                                                    <router-link :to="`/events/${event._iId}`"
                                                        style="text-decoration: none; color: inherit;">
                                                        <div>
                                                            <p v-if="event._sDescription.length <= 250">{{
                                                                event._sDescription }}</p>
                                                            <p v-else>{{ proccessDescription(event._sDescription) }}...</p>
                                                        </div>
                                                    </router-link>
                                                    <div class="row">
                                                        <div class="col-md-6"></div>
                                                        <div class="col-md-6">
                                                            <small class="text-muted float-end" style="margin-top: 10px;">
                                                                Fecha del evento: {{
                                                                    moment(event._tCelebratedAt).format('D-M-YYYY') }}
                                                            </small>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div class="row" v-else>
                                <p class="mt-2 fs-light fs-5">Esta cuenta es privada.</p>
                            </div>
                        </div>
                        <!-- Informacion -->
                        <div class="row mt-4" v-if="abSelectedCategory[2]">
                            <h5 class="mt-2 fs-light">Intereses de {{ person._sName }}</h5>
                            <ul class="list-unstyled list-group list-group-horizontal mt-2 ms-4">
                                <li v-for="interest in person._setInterests">
                                    <p class="ms-2 interest rounded-pill px-3">{{ interest._sName }}</p>
                                </li>
                            </ul>
                            <p class="fw-light" v-if="iInterests === 0">El usuario no ha indicado ningún interés :&#40;</p>
                            <div class="row">
                                <h5 class="mt-2 fs-light">Preguntas 'Sobre mí' de {{ person._sName }}</h5>
                                <ul class="mt-4 list-unstyled" v-if="shouldShowAnswers()">
                                    <li v-for="answer in aAMAnswers" class="ms-4">
                                        <div class="row mt-2" v-if="answer._sAnswer != ''">
                                            <p class="fw-bold">- {{ answer._question._sQuestion }}</p>
                                            <p class="fw-light">{{ answer._sAnswer }}</p>
                                        </div>
                                    </li>
                                </ul>
                                <div class="row" v-else>
                                    <p class="fw-light">El usuario no ha indicado ninguna respuesta a las preguntas :&#40;
                                    </p>
                                </div>
                            </div>
                            <h5 class="mt-2 fs-light">Fotos de {{ person._sName }}</h5>
                            <div class="d-flex justify-content-center mt-4 photos-box" v-if="aPhotos.length > 0">
                                <div class="d-flex justify-content-center clickable" v-for="photo in userStore.person._setImagePath"
                                    @click="bTriggerFullscreenImage = true; fsImage = photo">
                                    <img class="user-image m-1" :src="userStore.baseAPIurl + 'getImage/' + photo._sName"
                                        alt="" v-if="photo._tDeleteDate === null">
                                </div>
                            </div>
                            <div class="row" v-else>
                                <p class="fw-light">El usuario no ha subido ninguna foto :&#40;</p>
                            </div>
                        </div>
                        <!-- Me gusta -->
                        <div class="row mt-4" v-if="abSelectedCategory[3]">
                            <div class="row"
                                v-if="!person._bIsPrivate || bFollowed || userStore.person._iId === person._iId">
                                <h5 class="mt-2 fs-light">Me gusta de {{ person._sName }}</h5>
                                <ul class="list-unstyled mt-2">
                                    <li v-for="post in aLikedPosts">
                                        <PostComponent :post="post" @report="(repPost) => {reportedPost = repPost; bTriggerPostReportPopup = true;}"
                                            v-if="post._tDeleteDate === null && !post._user._bIsSuspended"></PostComponent>
                                    </li>
                                </ul>
                            </div>
                            <div class="row" v-else>
                                <p class="mt-2 fs-light fs-5">Esta cuenta es privada.</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
        <Popup v-if="bTriggerFullscreenImage">
            <div class="row">
                <div class="col-md-12">
                    <font-awesome-icon icon="fa-solid fa-xmark" class="float-end clickable" size="m" style="color: #000000;"
                        @click="bTriggerFullscreenImage = false" />
                </div>
                <div class="col-md-1 d-flex">
                    <div class="row h-100">
                        <font-awesome-icon icon="fa-solid fa-angle-left" class="align-self-center clickable" size="xl"
                            style="color: #000000;" @click="chooseAdjacentPhoto(false)" />
                    </div>
                </div>
                <div class="col-md-10">
                    <div class="row">
                        <div class="img-wrapper">
                            <img :src="userStore.baseAPIurl + 'getImage/' + fsImage._sName" class="fsimg" alt="">
                        </div>
                    </div>
                </div>
                <div class="col-md-1 d-flex">
                    <div class="row h-100">
                        <font-awesome-icon icon="fa-solid fa-angle-right" class="align-self-center clickable" size="xl"
                            style="color: #000000;" @click="chooseAdjacentPhoto(true)" />
                    </div>
                </div>
            </div>
        </Popup>
        <Popup v-if="bTriggerBlockPopup || bTriggerReportPopup">
            <div class="row">
                <div class="col-md-10">
                    <h5 v-if="bTriggerBlockPopup">Bloquear a @{{ person._sUsername }}</h5>
                    <h5 v-else>Denunciar a @{{ person._sUsername }}</h5>
                </div>
                <div class="col-md-2">
                    <font-awesome-icon icon="fa-solid fa-xmark" class="float-end clickable" size="m" style="color: #000000;"
                        @click="bTriggerBlockPopup = false; bTriggerReportPopup = false" />
                </div>
                <p class="mt-2 fw-light">{{ sPopupMessage }}</p>
                <div class="mb-3" v-if="bTriggerReportPopup">
                    <label for="report" class="form-label">Motivo de la denuncia</label>
                    <textarea class="form-control" id="report" rows="3" v-model="sReportDescription"></textarea>
                </div>
                <div class="col-md-10"></div>
                <div class="col-md-1">
                    <button type="button" class="btn btn-danger me-4" v-if="bTriggerReportPopup" @click="sendUserReport()">
                        Denunciar
                    </button>
                    <button type="button" class="btn btn-danger float-end" @click="blockUnblockUser"
                        v-else-if="!bIsPersonBlocked">Bloquear</button>
                    <button type="button" class="btn btn-primary me-4" @click="blockUnblockUser" v-else>Desbloquear</button>
                </div>
            </div>
        </Popup>
        <Popup v-if="bTriggerPostReportPopup && reportedPost != null">
            <div class="row mb-3">
                <div class="col-md-6">
                    <h4 class="mt-4">Denunciar una publicación</h4>
                </div>
                <div class="col-md-6">
                    <font-awesome-icon icon="fa-solid fa-xmark" class="float-end clickable" size="sm"
                        style="color: #000000;" @click="bTriggerPostReportPopup = false" />
                </div>
            </div>
            <PostComponent :post="reportedPost"></PostComponent>
            <p class="mt-4 fw-light">En caso de que sea necesario, incluye a continuación una breve descripción que detalle
                los
                motivos de la denuncia.</p>
            <div class="mb-3">
                <label for="report" class="form-label">Motivo de la denuncia</label>
                <textarea class="form-control" id="report" rows="3" v-model="sReportDescription"></textarea>
            </div>
            <button type="button" class="btn btn-primary float-end" @click="reportPost(reportedPost)">Enviar</button>
        </Popup>
    </div>
    <div class="container" v-else-if="person._iId != 0"></div>
    <div class="container" v-else>
        <div class="row mt-4">
            <div class="col-md-1"></div>
            <div class="col-md-10 border border-2 mx-4 p-4">
                <div class="row">
                    <div class="col-md-2">
                        <img :src="userStore.baseAPIurl + 'getProfileImage/0'" alt="" class="img-min-circle mt-2 mb-2" />
                    </div>
                    <div class="col-md-6">
                        <div class="row">
                            <p class="mt-4 fs-4">Usuario no encontrado</p>
                            <p class="text-muted">@{{ route.params.username }}</p>
                        </div>
                    </div>
                    <p class="fw-light mt-4">Esta cuenta no existe</p>
                </div>
            </div>
        </div>
    </div>
    <GenericReportPopup v-if="bTriggerReportSentPopup" @close="bTriggerReportSentPopup = false"></GenericReportPopup>
</template>
    

<script setup>
import SidebarFinal from '@/components/SidebarFinal.vue';
import PostComponent from '@/components/PostComponent.vue';
import { useUserStore } from "@/store/UserStore";
import axios from "axios";
import { onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import moment from "moment";
import Popup from "@/components/Popup.vue";
import GenericReportPopup from '@/components/GenericReportPopup.vue';

const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
let sProfileImageURL = ref("");
const person = ref("");
let bIsFetching = ref(true);
let bFollowed = ref(false);
let bPendingFollow = ref(false);
let bShowPosts = ref(true);
let aPosts = ref([]);
let aLikedPosts = ref([]);
let aEvents = ref([]);
let aCreatedEvents = ref([]);
let iNumPosts = ref(null);
let iNumFollowing = ref(null);
let iNumFollowers = ref(null);
let bShouldDisplayData = ref(false);
let sReportDescription = ref("");
let aEventsBackup = [];
let aPhotos = ref([]);
let fsImage = ref(null);
let bTriggerFullscreenImage = ref(false);
let bShowOptions = ref(false);
let abSelectedCategory = ref([false, false, true, false]);
let iInterests = ref(0);
let aAMAnswers = ref([]);
let bTriggerBlockPopup = ref(false);
let bTriggerReportPopup = ref(false);
let sPopupMessage = ref("");
let bIsBlockedByPerson = ref(false);
let bIsPersonBlocked = ref(false);
let bTriggerReportSentPopup = ref(false);
let bEventSelector = ref(true);
let bTriggerPostReportPopup = ref(false);
let reportedPost = ref(null);


onMounted(() => {
    axios.get(userStore.baseAPIurl + "getUserFromUsername/" + route.params.username)
        .then((response) => {
            person.value = response.data;
            console.log(person.value._province)
            iInterests.value = person.value._setInterests.length;
            if (person.value._iId != 0) { //Usuario válido
                axios.get(userStore.baseAPIurl + "checkBlock/" + userStore.person._iId + "/" + person.value._iId)
                    .then(response => bIsPersonBlocked.value = response.data);
                axios.get(userStore.baseAPIurl + "checkBlock/" + person.value._iId + "/" + userStore.person._iId)
                    .then(response => bIsBlockedByPerson.value = response.data);
                if(userStore.person._setImagePath != null)
                    aPhotos.value = userStore.person._setImagePath;
                if (person.value._iId != userStore.person._iId) {  //Ahorrar petición si el usuario es el mismo
                    axios.get(userStore.baseAPIurl + "checkFollow/" + userStore.person._iId + "/" + person.value._iId)
                        .then((response) => {
                            bFollowed.value = response.data;
                            if (!bFollowed.value && person.value._bIsPrivate) {
                                userStore.checkPendingFollow(person.value._iId).then(bIsPending => bPendingFollow.value = bIsPending)
                            }
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
                axios.get(userStore.baseAPIurl + "getUserAnswers/" + person.value._iId)
                    .then(response => aAMAnswers.value = response.data);
                axios.get(userStore.baseAPIurl + "getUserPosts/" + route.params.username)
                    .then(response => {
                        aPosts.value = response.data;
                        iNumPosts.value = aPosts.value.length;
                    })
                    .catch(error => console.log(error));
                axios.get(userStore.baseAPIurl + "getUserEvents/" + person.value._iId)
                    .then(response => {
                        aEvents.value = response.data.sort((e1, e2) => {
                            if (e1._tCelebratedAt < e2._tCelebratedAt)
                                return 1;
                            else if (e1._tCelebratedAt > e2._tCelebratedAt)
                                return -1;
                            else
                                return 0;
                        });
                        aEventsBackup = aEvents.value;
                        aCreatedEvents.value = aEvents.value.filter(event => event._organizer._iId === person.value._iId);
                        console.log(aCreatedEvents.value)
                    })
                axios.get(userStore.baseAPIurl + "getNumFollows/" + person.value._iId)
                    .then(response => {
                        iNumFollowing.value = response.data[0];
                        iNumFollowers.value = response.data[1];
                    })
                axios.get(userStore.baseAPIurl + "getLikedPosts/" + person.value._iId)
                    .then(response => aLikedPosts.value = response.data);
            }
            sProfileImageURL.value =
                userStore.baseAPIurl + "getProfileImage/" + person.value._iId;
            setTimeout(() => {
                bIsFetching.value = false;
            }, 600);
        })
        .catch((error) => console.log(error));

});

function sendUserReport() {
    userStore.reportUser(person.value._iId, person.value._sUsername, sReportDescription.value);
    bTriggerReportPopup.value = false;
    bTriggerBlockPopup.value = false;
    bTriggerReportSentPopup.value = true;
    sReportDescription.value = "";
    bShowOptions.value = false;
}

function reportPost(post) {
      axios.post(userStore.baseAPIurl + "newTicket", {
        sSubject: "Denuncia de publicación de @" + post._user._sUsername,
        sDescription: sReportDescription.value,
        iIssuerId: userStore.person._iId,
        iReportedId: post._user._iId,
        iEventId: -1,
        iPostId: post._iId,
        sCategory: 'Denunciar una publicación'
      })
      bTriggerPostReportPopup.value = false;
      reportedPost.value = null;
      bTriggerReportSentPopup.value = true;
      sReportDescription.value = "";

    }
  

function shouldShowAnswers() {
    if (aAMAnswers.value.length === 0) {
        return false;
    } else {
        return aAMAnswers.value.some(answer => answer._sAnswer != '');
    }
}

function setBlockReportPopup(bWantToBlock) {
    if (bWantToBlock) {
        bTriggerBlockPopup.value = true;
        sPopupMessage.value = bIsPersonBlocked.value ? "Estás seguro de que quieres desbloquear a @" + person.value._sUsername + "?" :
            "¿Estás seguro de que quieres bloquear a @" + person.value._sUsername + "? Esto impedirá que pueda interactuar contigo, " +
            " no podrá ver tu perfil, pero si te apuntas a un evento sí que podrá ver tu asistencia y comentarios."
    } else {
        bTriggerReportPopup.value = true;
        sPopupMessage.value = "Detalla el/los motivos por lo que deseas denunciar a esta persona.";
    }
    bShowOptions.value = false;
}

function setFollow() {
    if (!bPendingFollow.value)
        userStore.proccessFollow(person.value, bFollowed.value)

    if (person.value._bIsPrivate && !bFollowed.value) {
        bPendingFollow.value = !bPendingFollow.value;
        if (!bPendingFollow.value)  // Si bPendingFollow es falso, significa que ha cancelado la solicitud de seguimiento
            axios.patch(userStore.baseAPIurl + "deleteNotification/" + userStore.person._iId + "/" + person.value._iId + "/FollowRequest")
    }
    if (!person.value._bIsPrivate) {
        bFollowed.value = !bFollowed.value;
        bFollowed.value === true ? iNumFollowers.value = iNumFollowers.value + 1 : iNumFollowers.value = iNumFollowers.value - 1;
    }
}

function chooseAdjacentPhoto(bNextPhoto) {
    let iCurrentIndex = aPhotos.value.findIndex(photo => photo._iId === fsImage.value._iId);
    if (bNextPhoto) {        //Siguiente foto
        do {
            iCurrentIndex = (iCurrentIndex + 1) % aPhotos.value.length;
            fsImage.value = aPhotos.value[iCurrentIndex];  
        } while(fsImage.value._tDeleteDate != null)
        
    } else {
        do {
            iCurrentIndex--;
            if (iCurrentIndex < 0)
                iCurrentIndex = aPhotos.value.length - 1;
            fsImage.value = aPhotos.value[iCurrentIndex];
        } while(fsImage.value._tDeleteDate != null)
    }
}


function selectCategory(index) {
    for (let i = 0; i < abSelectedCategory.value.length; i++) {
        if (i === index)
            abSelectedCategory.value[i] = true;
        else
            abSelectedCategory.value[i] = false;
    }
}

function proccessDescription(sDescription) {
    if (sDescription.length > 250) {
        let iShift = 250;
        while (sDescription.charAt(iShift) != ' ')
            iShift++;
        sDescription = sDescription.slice(0, iShift);
    }
    return sDescription;
}

function blockUnblockUser() {
    axios.patch(userStore.baseAPIurl + "blockUnblockUser/" + userStore.person._iId + "/" + person.value._iId)
        .then(response => {
            bIsPersonBlocked.value = response.data;
        })
    bTriggerBlockPopup.value = false;
    bTriggerReportPopup.value = false;
}



</script>


<style scoped>
image {
    object-fit: contain;
}

.category {
    font-size: 18px;
}

.category:hover {
    background-color: rgb(185, 180, 255);
    cursor: pointer;
    font-weight: bold;
}

.dropdown-option:hover {
    background-color: #eeeeee;
    cursor: pointer;
}

.photos-box {
    max-width: 60vw;
    column-count: 3;
    flex-wrap: wrap;
}

.user-image {
    object-fit: contain;
    max-height: 200px;
    width: auto;
}

.fsimg {
    height: 100%;
    width: auto;
    align-self: center;
    justify-self: center;
    object-fit: contain;
}

.img-wrapper {
    max-height: 60vh;
    max-width: 60vw;
    justify-content: center;
    display: flex;
}

.selected {
    /* background-color: rgb(185, 180, 255); */
    font-weight: bold;
}

.clickable {
    cursor: pointer;
}

.img-min-circle {
    height: 100px;
    width: 100px;
    border-radius: 50%;
    border: solid 1px black;
}

.horizontal {
    display: inline-block;
    position: absolute;
    right: 0;
}

.options-button {
    border: solid 1px rgb(97, 97, 97);
    border-radius: 50%;
    width: 40px;
    height: 40px;
}

.options-button:hover {
    background-color: #d0d0d0;
    cursor: pointer;
}

.interest {
    /* border: solid 2px rgb(111, 22, 255); */
    border: solid 2px #FF8C00;
    color: black;
    /* background-color: rgb(146, 79, 255); */
    background-color: #ffd9ab;
    padding: 5px;
    margin-right: 15px;
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
    border: solid 1px #d0d0d0;
    padding: 10px;
}

.event-card {
    border: solid 1px #d0d0d0;
    padding: 10px;

}

.event-card:hover {
    background-color: #ececec;
    cursor: pointer;
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

.report-button {
    color: 8e0000;
}

.report-button:hover {
    color: white;
}</style>