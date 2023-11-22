<template>
    <SidebarFinal></SidebarFinal>
    <div class="container">
        <h2 class="mt-4">Gestionar contenidos</h2>
        <div class="hline"></div>
        <div class="row mt-4">
            <div class="col-md-4">
                <ul class="list-unstyled">
                    <li v-for="(item, key) in aIndex">
                        <div class="row mt-4 hv-increase" @click="iItemToShow = key; bIsBeingModified = false;">
                            <div class="col-md-1" style="margin-top: 3px;">
                                <font-awesome-icon icon="fa-solid fa-angle-right" class="float-end mt-3" />
                            </div>
                            <div class="col-sm-7">
                                <p class="fw-light fs-5 mt-2">{{ item }}</p>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="col-md-8" v-if="iItemToShow != -1">
                <div class="row">
                    <h4 class="mt-2">{{ aIndex[iItemToShow] }}</h4>
                    <div class="hline"></div>
                </div>
                <!-- Divs con campos especificos dependiendo de iItemToShow -->
                <div class="row mt-2" v-if="aIndex[iItemToShow] === 'Gestionar categorías'">
                    <div class="col-md-6">
                        <h5 class="mt-3">Registrar una categoría:</h5>
                        <div class="form-group field mt-2">
                            <div class="row">
                                <div class="col-md-10">
                                    <input type="input" class="form-field ms-2" placeholder="Nombre" name="categoryName"
                                        id='categoryName' v-model="sCategoryName" />
                                    <label for="categoryName" class="form-label mt-2">Nombre categoría</label>
                                    <p class="mt-2 small">El nombre de la categoría</p>
                                    <button type="button" class="btn btn-primary float-end mt-2"
                                        @click="createEntity('category')">Enviar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <h5 class="mt-3">Editar/borrar categorías</h5>
                        <ListBox display-key="Nombre" v-if="!bIsBeingModified">
                            <li v-for="category in aCategories">
                                <div class="row mt-2 item">
                                    <div class="col-sm-2">
                                        {{ category._iId }}
                                    </div>
                                    <div class="col-sm-7">
                                        {{ category._sName }}
                                    </div>
                                    <div class="col-sm-1">
                                        <font-awesome-icon icon="fa-solid fa-pen" class="clickable"
                                            @click="currentEntity = category; bIsBeingModified = true" />
                                    </div>
                                    <div class="col-sm-1">
                                        <font-awesome-icon icon="fa-solid fa-xmark" class="clickable"
                                            @click="setPopup('category', category)" />
                                    </div>
                                </div>
                            </li>
                        </ListBox>
                        <div class="mt-4" v-else>
                            <p class="mt-4">Id de la entidad: <strong>{{ currentEntity._iId }}</strong></p>
                            <div class="form-group field mt-2">
                                <div class="row">
                                    <div class="col-md-10">
                                        <input type="input" class="form-field ms-2" placeholder="Nombre" name="categoryName"
                                            id='categoryName' v-model="currentEntity._sName" />
                                        <label for="categoryName" class="form-label mt-2">Nombre categoría</label>
                                        <p class="mt-2 small">El nombre de la categoría</p>
                                        <button type="button" class="btn btn-secondary mt-2"
                                            @click="currentEntity = {}; bIsBeingModified = false">Volver</button>
                                        <button type="button" class="btn btn-primary float-end mt-2"
                                            @click="modifyEntity('category')">Enviar</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row mt-2" v-if="aIndex[iItemToShow] === 'Gestionar intereses'">
                    <div class="col-md-6">
                        <h5 class="mt-3">Registrar un interés:</h5>
                        <div class="form-group field mt-2">
                            <div class="row">
                                <div class="col-md-10">
                                    <input type="input" class="form-field ms-2" placeholder="Nombre" name="interestName"
                                        id='interestName' v-model="sInterestName" />
                                    <label for="interestName" class="form-label mt-2">Nombre interés</label>
                                    <p class="mt-2 small">El nombre del interés a registrar</p>
                                    <button type="button" class="btn btn-primary float-end"
                                        @click="createEntity('interest')">Enviar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <h5 class="mt-3">Editar/borrar intereses</h5>
                        <ListBox display-key="Nombre" v-if="!bIsBeingModified">
                            <li v-for="interest in aInterests">
                                <div class="row mt-2 item">
                                    <div class="col-sm-2">
                                        {{ interest._iId }}
                                    </div>
                                    <div class="col-sm-7">
                                        {{ interest._sName }}
                                    </div>
                                    <div class="col-sm-1">
                                        <font-awesome-icon icon="fa-solid fa-pen" class="clickable"
                                            @click="currentEntity = interest; bIsBeingModified = true" />
                                    </div>
                                    <div class="col-sm-1">
                                        <font-awesome-icon icon="fa-solid fa-xmark" class="clickable"
                                            @click="setPopup('interest', interest)" />
                                    </div>
                                </div>
                            </li>
                        </ListBox>
                        <div class="mt-4" v-else>
                            <p class="mt-4">Id de la entidad: <strong>{{ currentEntity._iId }}</strong></p>
                            <div class="form-group field mt-2">
                                <div class="row">
                                    <div class="col-md-10">
                                        <input type="input" class="form-field ms-2" placeholder="Nombre" name="interestName"
                                            id='interestName' v-model="currentEntity._sName" />
                                        <label for="interestName" class="form-label mt-2">Nombre interés</label>
                                        <p class="mt-2 small">El nombre del interés</p>
                                        <button type="button" class="btn btn-secondary mt-2"
                                            @click="currentEntity = {}; bIsBeingModified = false">Volver</button>
                                        <button type="button" class="btn btn-primary float-end mt-2"
                                            @click="modifyEntity('interest')">Enviar</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row mt-2" v-if="aIndex[iItemToShow] === 'Gestionar provincias'">
                    <div class="col-md-6">
                        <h5 class="mt-3">Registrar una provincia:</h5>
                        <div class="form-group field mt-2">
                            <div class="row">
                                <div class="col-md-10">
                                    <input type="input" class="form-field ms-2" placeholder="Nombre" name="provinceName"
                                        id='provinceName' v-model="sProvinceName" />
                                    <label for="provinceName" class="form-label mt-2">Nombre provincia</label>
                                    <p class="mt-2 small">El nombre de la provincia a registrar</p>
                                </div>
                                <div class="select mt-4">
                                    <select name="format" id="format" v-model="sSelectedRegion">
                                        <option selected disabled>Comunidad autónoma</option>
                                        <option v-for="region in aRegions" :value="region._sName">{{
                                            region._sName }}</option>
                                    </select>
                                </div>
                                <p class="small mt-2">La comunidad autónoma a la que pertenece la provincia</p>
                                <button type="button" class="btn btn-primary float-end"
                                    @click="createEntity('province')">Enviar</button>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <h5 class="mt-3">Editar/borrar provincias</h5>
                        <ListBox display-key="Nombre" v-if="!bIsBeingModified">
                            <li v-for="province in aProvinces">
                                <div class="row mt-2 item">
                                    <div class="col-sm-2">
                                        {{ province._iId }}
                                    </div>
                                    <div class="col-sm-7">
                                        {{ province._sName }}
                                    </div>
                                    <div class="col-sm-1">
                                        <font-awesome-icon icon="fa-solid fa-pen" class="clickable"
                                            @click="currentEntity = province; bIsBeingModified = true; sSelectedRegion = province._region._sName" />
                                    </div>
                                    <div class="col-sm-1">
                                        <font-awesome-icon icon="fa-solid fa-xmark" class="clickable"
                                            @click="setPopup('province', province)" />
                                    </div>
                                </div>
                            </li>
                        </ListBox>
                        <div class="mt-4" v-else>
                            <p class="mt-4">Id de la entidad: <strong>{{ currentEntity._iId }}</strong></p>
                            <div class="form-group field mt-2">
                                <div class="row">
                                    <div class="col-md-10">
                                        <input type="input" class="form-field ms-2" placeholder="Nombre" name="provinceName"
                                            id='provinceName' v-model="currentEntity._sName" />
                                        <label for="provinceName" class="form-label mt-2">Nombre provincia</label>
                                        <p class="mt-2 small">El nombre de la provincia</p>
                                        <div class="select mt-4 mb-3">
                                            <select name="format" id="format" v-model="sSelectedRegion">
                                                <option selected disabled>Comunidad autónoma</option>
                                                <option v-for="region in aRegions" :value="region._sName">{{
                                                    region._sName }}</option>
                                            </select>
                                        </div>
                                        <p class="small">La comunidad autónoma a la que pertenece la provincia</p>
                                        <button type="button" class="btn btn-secondary mt-2"
                                            @click="currentEntity = {}; bIsBeingModified = false; sSelectedRegion = 'Comunidad autónoma'">Volver</button>
                                        <button type="button" class="btn btn-primary float-end mt-2"
                                            @click="modifyEntity('province')">Enviar</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row mt-2" v-if="aIndex[iItemToShow] === 'Gestionar CCAs'">
                    <div class="col-md-6">
                        <h5 class="mt-3">Registrar una comunidad autónoma:</h5>
                        <div class="form-group field mt-2">
                            <div class="row">
                                <div class="col-md-10">
                                    <input type="input" class="form-field ms-2" placeholder="Nombre" name="regionName"
                                        id='regionName' v-model="sRegionName" />
                                    <label for="regionName" class="form-label mt-2">Nombre comunidad autónoma</label>
                                    <p class="mt-2 small">El nombre de la Comunidad a registrar</p>
                                    <div class="select mt-4 mb-3">
                                        <select name="format" id="format" v-model="sSelectedCountry">
                                            <option selected disabled>País</option>
                                            <option v-for="country in aCountries" :value="country._sName">{{
                                                country._sName }}</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <button type="button" class="btn btn-primary float-end"
                                @click="createEntity('region')">Enviar</button>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <h5 class="mt-3">Editar/borrar Comunidades Autónomas</h5>
                        <ListBox display-key="Nombre" v-if="!bIsBeingModified">
                            <li v-for="region in aRegions">
                                <div class="row mt-2 item">
                                    <div class="col-sm-2">
                                        {{ region._iId }}
                                    </div>
                                    <div class="col-sm-7">
                                        {{ region._sName }}
                                    </div>
                                    <div class="col-sm-1">
                                        <font-awesome-icon icon="fa-solid fa-pen" class="clickable"
                                            @click=" currentEntity = region; bIsBeingModified = true; sSelectedCountry = region._country._sName" />
                                    </div>
                                    <div class="col-sm-1">
                                        <font-awesome-icon icon="fa-solid fa-xmark" class="clickable"
                                            @click="setPopup('region', region)" />
                                    </div>
                                </div>
                            </li>
                        </ListBox>
                        <div class="mt-4" v-else>
                            <p class="mt-4">Id de la entidad: <strong>{{ currentEntity._iId }}</strong></p>
                            <div class="form-group field mt-2">
                                <div class="row">
                                    <div class="col-md-10">
                                        <input type="input" class="form-field ms-2" placeholder="Nombre" name="regionName"
                                            id='regionName' v-model="currentEntity._sName" />
                                        <label for="regionName" class="form-label mt-2">Nombre comunidad</label>
                                        <p class="mt-2 small">El nombre de la comunidad autónoma</p>
                                        <div class="select mt-4 mb-3">
                                            <select name="format" id="format" v-model="sSelectedCountry">
                                                <option selected disabled>País</option>
                                                <option v-for="country in aCountries" :value="country._sName">{{
                                                    country._sName }}</option>
                                            </select>
                                        </div>
                                        <p class="small">El país al que pertenece la comunidad autónoma</p>
                                        <button type="button" class="btn btn-secondary mt-2"
                                            @click="currentEntity = {}; bIsBeingModified = false; sSelectedCountry = 'País'">Volver</button>
                                        <button type="button" class="btn btn-primary float-end mt-2"
                                            @click="modifyEntity('region')">Enviar</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row mt-2" v-if="aIndex[iItemToShow] === 'Gestionar países'">
                    <div class="col-md-6">
                        <h5 class="mt-3">Registrar un país:</h5>
                        <div class="form-group field mt-2">
                            <div class="row">
                                <div class="col-md-10">
                                    <input type="input" class="form-field ms-2" placeholder="Nombre" name="countryName"
                                        id='countryName' v-model="sCountryName" />
                                    <label for="countryName" class="form-label mt-2">Nombre país</label>
                                    <p class="mt-2 small">El nombre del país a registrar</p>
                                    <button type="button" class="btn btn-primary float-end"
                                        @click="createEntity('country')">Enviar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <h5 class="mt-3">Editar/borrar países</h5>
                        <ListBox display-key="Nombre" v-if="!bIsBeingModified">
                            <li v-for="country in aCountries">
                                <div class="row mt-2 item">
                                    <div class="col-sm-2">
                                        {{ country._iId }}
                                    </div>
                                    <div class="col-sm-7">
                                        {{ country._sName }}
                                    </div>
                                    <div class="col-sm-1">
                                        <font-awesome-icon icon="fa-solid fa-pen" class="clickable"
                                            @click="currentEntity = country; bIsBeingModified = true" />
                                    </div>
                                    <div class="col-sm-1">
                                        <font-awesome-icon icon="fa-solid fa-xmark" class="clickable"
                                            @click="setPopup('country', country)" />
                                    </div>
                                </div>
                            </li>
                        </ListBox>
                        <div class="mt-4" v-else>
                            <p class="mt-4">Id de la entidad: <strong>{{ currentEntity._iId }}</strong></p>
                            <div class="form-group field mt-2">
                                <div class="row">
                                    <div class="col-md-10">
                                        <input type="input" class="form-field ms-2" placeholder="Nombre" name="countryName"
                                            id='countryName' v-model="currentEntity._sName" />
                                        <label for="countryName" class="form-label mt-2">Nombre país</label>
                                        <p class="mt-2 small">El nombre del país</p>
                                        <button type="button" class="btn btn-secondary mt-2"
                                            @click="currentEntity = {}; bIsBeingModified = false">Volver</button>
                                        <button type="button" class="btn btn-primary float-end mt-2"
                                            @click="modifyEntity('country')">Enviar</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row mt-2" v-if="aIndex[iItemToShow] === 'Gestionar FAQs'">
                    <div class="col-md-6">
                        <h5 class="mt-3">Registrar una FAQ:</h5>
                        <div class="form-group field">
                            <div class="row">
                                <div class="col-md-10">
                                    <div class="form-group">
                                        <label for="faqQuestion">Pregunta</label>
                                        <textarea class="form-control mt-2" id="faqQuestion" rows="2" v-model="sFaqQuestion"></textarea>
                                    </div>
                                    <p class="mt-2 small">La pregunta en sí a registrar</p>
                                    <div class="form-group">
                                        <label for="faqAnswer">Respuesta</label>
                                        <textarea class="form-control mt-2" id="faqAnswer" rows="2" v-model="sFaqAnswer"></textarea>
                                    </div>
                                    <p class="mt-2 small">La respuesta a la pregunta</p>
                                    <button type="button" class="btn btn-primary float-end"
                                        @click="createEntity('faq')">Enviar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <h5 class="mt-3">Editar/borrar FAQs</h5>
                        <ListBox display-key="Pregunta" v-if="!bIsBeingModified">
                            <li v-for="faq in aFAQs">
                                <div class="row mt-2 item">
                                    <div class="col-sm-2">
                                        {{ faq._iId }}
                                    </div>
                                    <div class="col-sm-7">
                                        {{ faq._sQuestion }}
                                    </div>
                                    <div class="col-sm-1">
                                        <font-awesome-icon icon="fa-solid fa-pen" class="clickable"
                                            @click="currentEntity = faq; bIsBeingModified = true" />
                                    </div>
                                    <div class="col-sm-1">
                                        <font-awesome-icon icon="fa-solid fa-xmark" class="clickable"
                                            @click="setPopup('FAQ', faq)" />
                                    </div>
                                </div>
                            </li>
                        </ListBox>
                        <div class="mt-4" v-else>
                            <p class="mt-4">Id de la entidad: <strong>{{ currentEntity._iId }}</strong></p>
                            <div class="form-group field mt-2">
                                <div class="row">
                                    <div class="col-md-10">
                                        <div class="form-group">
                                            <label for="faqQuestion">Pregunta</label>
                                            <textarea class="form-control mt-2" id="faqQuestion" rows="2" v-model="currentEntity._sQuestion"></textarea>
                                        </div>
                                        <p class="mt-2 small">La pregunta en sí a registrar</p>
                                        <div class="form-group">
                                            <label for="faqAnswer">Respuesta</label>
                                            <textarea class="form-control mt-2" id="faqAnswer" rows="2" v-model="currentEntity._sAnswer"></textarea>
                                        </div>
                                        <p class="mt-2 small">La respuesta a la pregunta</p>
                                        <button type="button" class="btn btn-secondary mt-2"
                                            @click="currentEntity = {}; bIsBeingModified = false">Volver</button>
                                        <button type="button" class="btn btn-primary float-end mt-2"
                                            @click="modifyEntity('faq')">Enviar</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row mt-2" v-if="aIndex[iItemToShow] === 'Gestionar Preguntas \'Conóceme\''">
                    <div class="col-md-6">
                        <h5 class="mt-3">Registrar una Pregunta 'Conóceme':</h5>
                        <div class="form-group field">
                            <div class="row">
                                <div class="col-md-10">
                                    <div class="form-group">
                                        <label for="faqQuestion">Pregunta</label>
                                        <textarea class="form-control mt-2" id="faqQuestion" rows="2" v-model="sAMQuestion"></textarea>
                                    </div>
                                    <p class="mt-2 small">La pregunta en sí a registrar</p>
                                    <button type="button" class="btn btn-primary float-end"
                                        @click="createEntity('AMQuestion')">Enviar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <h5 class="mt-3">Editar/borrar preguntas 'Conóceme'</h5>
                        <ListBox display-key="Pregunta" v-if="!bIsBeingModified">
                            <li v-for="question in aAMQuestions">
                                <div class="row mt-2 item">
                                    <div class="col-sm-2">
                                        {{ question._iId }}
                                    </div>
                                    <div class="col-sm-7">
                                        {{ question._sQuestion }}
                                    </div>
                                    <div class="col-sm-1">
                                        <font-awesome-icon icon="fa-solid fa-pen" class="clickable"
                                            @click="currentEntity = question; bIsBeingModified = true" />
                                    </div>
                                    <div class="col-sm-1">
                                        <font-awesome-icon icon="fa-solid fa-xmark" class="clickable"
                                            @click="setPopup('AMQuestion', question)" />
                                    </div>
                                </div>
                            </li>
                        </ListBox>
                        <div class="mt-4" v-else>
                            <p class="mt-4">Id de la entidad: <strong>{{ currentEntity._iId }}</strong></p>
                            <div class="form-group field mt-2">
                                <div class="row">
                                    <div class="col-md-10">
                                        <div class="form-group">
                                            <label for="faqQuestion">Pregunta</label>
                                            <textarea class="form-control mt-2" id="faqQuestion" rows="2" v-model="currentEntity._sQuestion"></textarea>
                                        </div>
                                        <p class="mt-2 small">La pregunta en sí a registrar</p>
                                        <button type="button" class="btn btn-secondary mt-2"
                                            @click="currentEntity = {}; bIsBeingModified = false">Volver</button>
                                        <button type="button" class="btn btn-primary float-end mt-2"
                                            @click="modifyEntity('AMQuestion')">Enviar</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
        <Popup v-if="sPopupMessage != ''">
            <h4 class="mt-2 fw-bold">ATENCIÓN</h4>
            <!-- <div class="row"> -->
            <p class="mt-4 fs-5 fw-bold">{{ sPopupMessage }}</p>
            <ul class="mt-2">
                <li v-for="consequence in asConsequencesOfOperation">
                    {{ consequence }}
                </li>
            </ul>
            <p class="mt-4 fs-5">¿Desea continuar con la operación?</p>
            <button type="button" class="btn btn-primary float-end mt-2"
                @click="deleteEntity(sEntityType, currentEntity)">Continuar</button>
            <button type="button" class="btn btn-secondary me-2 float-end mt-2"
                @click="sPopupMessage = ''; asConsequencesOfOperation = []">Cancelar</button>
            <!-- </div> -->
        </Popup>
    </div>
</template>


<script setup>
import axios from 'axios';
import SidebarFinal from '@/components/SidebarFinal.vue'
import { onMounted, ref } from 'vue';
import ListBox from '@/components/ListBox.vue';
import Popup from '@/components/Popup.vue';
import { useUserStore } from '@/store/UserStore';

const userStore = useUserStore();
const aIndex = ["Gestionar categorías", "Gestionar intereses", "Gestionar provincias", "Gestionar CCAs", "Gestionar países", "Gestionar FAQs", "Gestionar Preguntas 'Conóceme'"];
let aCategories = ref([]);
let aInterests = ref([]);
let aProvinces = ref([]);
let aRegions = ref([]);
let aCountries = ref([]);
let aFAQs = ref([]);
let aAMQuestions = ref([]);
let iItemToShow = ref(-1);
let sCategoryName = ref("");
let sInterestName = ref("");
let sProvinceName = ref("");
let sRegionName = ref("");
let sCountryName = ref("");
let sFaqQuestion = ref("");
let sFaqAnswer = ref("");
let sAMQuestion = ref("");
let sSelectedRegion = ref("Comunidad autónoma");
let sSelectedCountry = ref("País");
let bIsBeingModified = ref(false);
let currentEntity = ref({});
let sSuccessMessage = ref("");
let sErrorMessage = ref("");
let sPopupMessage = ref("");
let sEntityType = ref("");
let asConsequencesOfOperation = ref([]);

let categoryListBox = ref(null);


onMounted(() => {
    axios.get("http://localhost:8000/api/getAllCategories")
        .then(response => aCategories.value = response.data);

    axios.get("http://localhost:8000/api/getAllInterests")
        .then(response => aInterests.value = response.data);

    axios.get("http://localhost:8000/api/getAllProvinces")
        .then(response => aProvinces.value = response.data);

    axios.get("http://localhost:8000/api/getAllRegions")
        .then(response => aRegions.value = response.data);

    axios.get("http://localhost:8000/api/getAllCountries")
        .then(response => aCountries.value = response.data);

    axios.get("http://localhost:8000/api/getAllFAQs")
        .then(response => aFAQs.value = response.data);

    axios.get("http://localhost:8000/api/getAllAboutMeQuestions")
        .then(response => aAMQuestions.value = response.data);

})


function createEntity(sEntityType) {
    switch (sEntityType) {
        case 'category':
            if (sCategoryName.value != "") {
                axios.post("http://localhost:8000/api/createCategory", { sName: sCategoryName.value })
                    .then(response => {
                        if (response.data._iId != 0) {
                            aCategories.value.push(response.data);
                            axios.post("http://localhost:8000/api/newOperation", {
                                sInformation: "Se ha creado una nueva categoría con nombre " + response.data._sName + " y con id " + response.data._iId,
                                iAdminId: userStore.person._iId
                            })
                        }
                    })
            } else {
                sErrorMessage.value = "Escribe un nombre para la categoría."
            }
            break;
        case 'interest':
            if (sInterestName.value != "") {
                axios.post("http://localhost:8000/api/createInterest", { sName: sInterestName.value })
                    .then(response => {
                        if (response.data._iId != 0) {
                            aInterests.value.push(response.data);
                            axios.post("http://localhost:8000/api/newOperation", {
                                sInformation: "Se ha creado un nuevo interés con nombre " + response.data._sName + " y con id " + response.data._iId,
                                iAdminId: userStore.person._iId
                            })
                        }
                    })
            } else {
                sErrorMessage.value = "Escribe un nombre para el interés."
            }
            break;
        case 'province':
            if (sProvinceName.value != "" && sSelectedRegion.value != "" && sSelectedRegion.value != "Comunidad autónoma") {
                axios.post("http://localhost:8000/api/createProvince", { sName: sProvinceName.value, sRegion: sSelectedRegion.value })
                    .then(response => {
                        if (response.data._iId != 0) {
                            aProvinces.value.push(response.data);
                            axios.post("http://localhost:8000/api/newOperation", {
                                sInformation: "Se ha creado una nueva provincia con nombre " + response.data._sName + " y con id " + response.data._iId,
                                iAdminId: userStore.person._iId
                            })
                        }
                    })
            } else {
                sErrorMessage.value = "Algún valor introducido no es válido. Revisa los campos."
            }
            break;
        case 'region':
            if (sRegionName.value != "" && sSelectedCountry.value != "" && sSelectedCountry.value != "País") {
                axios.post("http://localhost:8000/api/createRegion", { sName: sRegionName.value, sCountry: sSelectedCountry.value })
                    .then(response => {
                        if (response.data._iId != 0) {
                            aRegions.value.push(response.data);
                            axios.post("http://localhost:8000/api/newOperation", {
                                sInformation: "Se ha creado una nueva región con nombre " + response.data._sName + " y con id " + response.data._iId,
                                iAdminId: userStore.person._iId
                            })
                        }
                    })
            } else {
                sErrorMessage.value = "Algún valor introducido no es válido. Revisa los campos."
            }
            break;
        case 'country':
            if (sCountryName.value != "") {
                axios.post("http://localhost:8000/api/createCountry", { sName: sCountryName.value })
                    .then(response => {
                        if (response.data._iId != 0) {
                            aCountries.value.push(response.data);
                            axios.post("http://localhost:8000/api/newOperation", {
                                sInformation: "Se ha creado un nuevo país con nombre " + response.data._sName + " y con id " + response.data._iId,
                                iAdminId: userStore.person._iId
                            })
                        }
                    })
            } else {
                sErrorMessage.value = "Introduce un nombre para el país."
            }
            break;
        case 'faq':
            if (sFaqQuestion.value != "" && sFaqAnswer.value != "") {
                axios.post("http://localhost:8000/api/newFAQ/" + userStore.person._iId, {
                    sQuestion: sFaqQuestion.value,
                    sAnswer: sFaqAnswer.value
                })
                    .then(response => {
                        if (response.data._iId != 0) {
                            aFAQs.value.push(response.data);
                        }
                    })
            } else {
                sErrorMessage.value = "Introduce los dos campos para registrar la entidad."
            }
            break;
        case 'AMQuestion':
            if (sAMQuestion.value != "") {
                axios.post("http://localhost:8000/api/newAboutMeQuestion", {
                    sQuestion: sAMQuestion.value,
                    sAnswer: "",
                    iAdminId: userStore.person._iId,
                    iUserId: -1,
                    iQuestionId: -1,
                    iAnswerId: -1
                })
                    .then(response => {
                        if (response.data._iId != 0) {
                            aAMQuestions.value.push(response.data);
                        }
                    })
            } else {
                sErrorMessage.value = "Introduce un enunciado para la pregunta."
            }
            break;
    }
}


function modifyEntity(sEntityType) {
    switch (sEntityType) {
        case 'category':
            axios.patch("http://localhost:8000/api/updateCategory/" + currentEntity._rawValue._iId, {
                sName: currentEntity._rawValue._sName
            })
                .then(response => {
                    if (response.data._iId != 0) {
                        let updatedEntity = response.data;
                        let sInformation = "Se ha modificado la categoría con id " + updatedEntity._iId + ". Antes de modificar: " +
                            " nombre -> " + currentEntity.value._sName + ". Después de modificar: " +
                            " nombre -> " + updatedEntity._sName;
                        axios.post("http://localhost:8000/api/newOperation", {
                            sInformation: sInformation,
                            iAdminId: userStore.person._iId
                        })
                        aCategories.value = aCategories.value.map(item => {
                            if (item._iId === updatedEntity._iId)
                                item = updatedEntity;
                            return item;
                        })
                        currentEntity = {};
                        bIsBeingModified.value = false;
                    }
                })
            break;
        case 'interest':
            axios.patch("http://localhost:8000/api/updateInterest/" + currentEntity._rawValue._iId, {
                sName: currentEntity._rawValue._sName
            })
                .then(response => {
                    if (response.data._iId != 0) {
                        let updatedEntity = response.data;
                        let sInformation = "Se ha modificado el interés con id " + updatedEntity._iId + ". Antes de modificar: " +
                            " nombre -> " + currentEntity.value._sName + ". Después de modificar: " +
                            " nombre -> " + updatedEntity._sName;
                        axios.post("http://localhost:8000/api/newOperation", {
                            sInformation: sInformation,
                            iAdminId: userStore.person._iId
                        })
                        aInterests.value = aInterests.value.map(item => {
                            if (item._iId === updatedEntity._iId)
                                item = updatedEntity;
                            return item;
                        })
                        currentEntity = {};
                        bIsBeingModified.value = false;
                    }
                })
            break;
        case 'province':
            if (sSelectedRegion.value != "" && sSelectedRegion.value != "Comunidad autónoma") {
                axios.patch("http://localhost:8000/api/updateProvince/" + currentEntity._rawValue._iId, {
                    sName: currentEntity._rawValue._sName,
                    sRegion: sSelectedRegion.value
                })
                    .then(response => {
                        if (response.data._iId != 0) {
                            let updatedEntity = response.data;
                            let sInformation = "Se ha modificado la provincia con id " + updatedEntity._iId + ". Antes de modificar: " +
                                " nombre -> " + currentEntity.value._sName + ", comunidad autónoma -> " + currentEntity.value._region._sName + ". Después de modificar: " +
                                " nombre -> " + updatedEntity._sName + ", comunidad autónoma -> " + updatedEntity._region._sName;
                            axios.post("http://localhost:8000/api/newOperation", {
                                sInformation: sInformation,
                                iAdminId: userStore.person._iId
                            })
                            aProvinces.value = aProvinces.value.map(item => {
                                if (item._iId === updatedEntity._iId)
                                    item = updatedEntity;
                                return item;
                            })
                            currentEntity = {};
                            bIsBeingModified.value = false;
                        }
                    })
            } else {
                sErrorMessage.value = "Se ha producido un error a la hora de registrar la provincia. Revisa la comunidad autónoma seleccionada.";
            }
            break;
        case 'region':
            if (sSelectedCountry.value != "" && sSelectedCountry.value != "País") {
                axios.patch("http://localhost:8000/api/updateRegion/" + currentEntity._rawValue._iId, {
                    sName: currentEntity._rawValue._sName,
                    sCountry: sSelectedCountry.value
                })
                    .then(response => {
                        if (response.data._iId != 0) {
                            let updatedEntity = response.data;
                            let sInformation = "Se ha modificado la región con id " + updatedEntity._iId + ". Antes de modificar: " +
                                " nombre -> " + currentEntity.value._sName + ", país -> " + currentEntity.value._country._sName + ". Después de modificar: " +
                                " nombre -> " + updatedEntity._sName + ", país -> " + updatedEntity._country._sName;
                            axios.post("http://localhost:8000/api/newOperation", {
                                sInformation: sInformation,
                                iAdminId: userStore.person._iId
                            })
                            aRegions.value = aRegions.value.map(item => {
                                if (item._iId === updatedEntity._iId)
                                    item = updatedEntity;
                                return item;
                            })
                            currentEntity = {};
                            bIsBeingModified.value = false;
                        }
                    })
            } else {
                sErrorMessage.value = "Se ha producido un error a la hora de registrar la comunidad autónoma. Revisa el país seleccionado."
            }
            break;
        case 'country':
            axios.patch("http://localhost:8000/api/updateCountry/" + currentEntity._rawValue._iId, {
                sName: currentEntity._rawValue._sName
            })
                .then(response => {
                    if (response.data._iId != 0) {
                        let updatedEntity = response.data;
                        let sInformation = "Se ha modificado el país con id " + updatedEntity._iId + ". Antes de modificar: " +
                            " nombre -> " + currentEntity.value._sName + ". Después de modificar: " +
                            " nombre -> " + updatedEntity._sName;
                        axios.post("http://localhost:8000/api/newOperation", {
                            sInformation: sInformation,
                            iAdminId: userStore.person._iId
                        })
                        aCountries.value = aCountries.value.map(item => {
                            if (item._iId === updatedEntity._iId)
                                item = updatedEntity;
                            return item;
                        })
                        currentEntity = {};
                        bIsBeingModified.value = false;
                    }
                })
            break;
        case 'faq':
            axios.patch("http://localhost:8000/api/updateFAQ/" + currentEntity._rawValue._iId, {
                sQuestion: currentEntity._rawValue._sQuestion,
                sAnswer: currentEntity._rawValue._sAnswer
            })
                .then(response => {
                    if (response.data._iId != 0) {
                        let updatedEntity = response.data;
                        let sInformation = "Se ha modificado la FAQ con id " + updatedEntity._iId + ". Antes de modificar: " +
                            " Pregunta -> " + currentEntity.value._sQuestion + " Después de modificar: " +
                            " Pregunta -> " + updatedEntity._sQuestion + ". Respuesta -> " + currentEntity.value._sAnswer +
                            " Después de modificar: Respuesta -> " + updatedEntity._sAnswer;
                        axios.post("http://localhost:8000/api/newOperation", {
                            sInformation: sInformation,
                            iAdminId: userStore.person._iId
                        })
                        aFAQs.value = aFAQs.value.map(item => {
                            if (item._iId === updatedEntity._iId)
                                item = updatedEntity;
                            return item;
                        })
                        currentEntity = {};
                        bIsBeingModified.value = false;
                    }
                })
            break;
        case 'AMQuestion':
            axios.patch("http://localhost:8000/api/updateAboutMeQuestion", {
                sQuestion: currentEntity._rawValue._sQuestion,
                sAnswer: "",
                iAdminId: userStore.person._iId,
                iUserId: -1,
                iQuestionId: currentEntity._rawValue._iId,
                iAnswerId: -1
            })
                .then(response => {
                    if (response.data._iId != 0) {
                        let updatedEntity = response.data;
                        aAMQuestions.value = aAMQuestions.value.map(item => {
                            if (item._iId === updatedEntity._iId)
                                item = updatedEntity;
                            return item;
                        })
                        currentEntity = {};
                        bIsBeingModified.value = false;
                        // let updatedEntity = response.data;
                        // let sInformation = "Se ha modificado la FAQ con id " + updatedEntity._iId + ". Antes de modificar: " +
                        //     " Pregunta -> " + currentEntity.value._sQuestion + " Después de modificar: " +
                        //     " Pregunta -> " + updatedEntity._sQuestion + ". Respuesta -> " + currentEntity.value._sAnswer +
                        //     " Después de modificar: Respuesta -> " + updatedEntity._sAnswer;
                        // axios.post("http://localhost:8000/api/newOperation", {
                        //     sInformation: sInformation,
                        //     iAdminId: userStore.person._iId
                        // })
                    }
                })
            break;
    }
}

function setPopup(sType, entity) {
    currentEntity.value = entity;
    sEntityType.value = sType;
    console.log(currentEntity.value);
    asConsequencesOfOperation.value[0] = "La entidad desaparecerá del sistema, y los cambios provocados por la misma que se puedan arreglar deberán realizarse de forma manual."

    switch (sType) {
        case 'category':
            sPopupMessage.value = "Estás a punto de borrar una categoría del sistema. Esta acción es irreversible, y traerá las siguientes consecuencias:";
            asConsequencesOfOperation.value[1] = "Todos los tickets con la categoría dispuesta a borrar pasarán a tener la categoría 'Borrada previamente'.";
            break;
        case 'interest':
            sPopupMessage.value = "Estás a punto de borrar un interés del sistema. Esta acción es irreversible, y traerá las siguientes consecuencias:";
            asConsequencesOfOperation.value[1] = "La etiqueta del interés desaparecerá de todos aquellos usuarios y eventos que hagan uso de la misma."
            break;
        case 'province':
            sPopupMessage.value = "Estás a punto de borrar una provincia del sistema. Esta acción es irreversible, y traerá las siguientes consecuencias:";
            asConsequencesOfOperation.value[1] = "Todos aquellos usuarios que hagan uso de la provincia que va a ser borrada quedarán sin localización.";
            asConsequencesOfOperation.value[2] = "Se establecerá el valor nulo para el atributo referente a la provincia de todas las localizaciones que incluyeran la provincia que está a punto de ser borrada.";
            asConsequencesOfOperation.value[3] = "Relacionado con el punto anterior, todos los eventos localizados por alguna de esas localizaciones no podrán encontrarse usando la provincia'.";
            asConsequencesOfOperation.value[4] = "En caso de que el nombre de la provincia fuera correcto, si no se vuelve a añadir al sistema, podrían ocurrir errores de compatibilidad a la hora de registrar una localización nueva.";
            break;
        case 'region':
            sPopupMessage.value = "Estás a punto de borrar una comunidad autónoma del sistema. Esta acción es irreversible, y traerá las siguientes consecuencias:";
            asConsequencesOfOperation.value[1] = "La operación es en cascada; es decir, TODAS las provincias de la comunidad autónoma serán BORRADAS del sistema junto a la misma.";
            asConsequencesOfOperation.value[2] = "Por consiguiente, esta acción traerá TODAS las CONSECUENCIAS de borrar cada una de las PROVINCIAS que conforman la región."
            break;
        case 'country':
            sPopupMessage.value = "Estás a punto de borrar un país del sistema. Esta acción es irreversible, y traerá las siguientes consecuencias:";
            asConsequencesOfOperation.value[1] = "La operación es en cascada; es decir, TODAS las comunidades autónomas del país serán BORRADAS del sistema junto al mismo.";
            asConsequencesOfOperation.value[2] = "Por consiguiente, esta acción traerá TODAS las CONSECUENCIAS de borrar cada una de las REGIONES que conforman el país.";
            break;
        case 'FAQ':
            sPopupMessage.value = "Estás a punto de borrar una FAQ del sistema. Esta acción es irreversible, y traerá las siguientes consecuencias:";
            break;
        case 'AMQuestion':
            sPopupMessage.value = "Estás a punto de eliminar una pregunta 'Conóceme' del sistema. Esta acción es irreversible, y traerá las siguientes consecuencias:";
            asConsequencesOfOperation.value[1] = "La operación borrará todas las respuestas de aquellos usuarios que hayan respondido a la pregunta.";
            break;
    }
    asConsequencesOfOperation.value.push("La operación quedará registrada en el sistema para tareas de seguimiento y registro en caso de comportamiento inadecuado.");
}

function deleteEntity(sEntityType, entityToDelete) {
    // console.log(entityToDelete._sName);
    // console.log(entityToDelete._iId)
    console.log(sEntityType);
    switch (sEntityType) {
        case 'category':
            axios.delete("http://localhost:8000/api/deleteCategory/" + entityToDelete._iId)
                .then(response => {
                    axios.post("http://localhost:8000/api/newOperation", {
                        sInformation: "Se ha eliminado la categoría con nombre " + entityToDelete._sName,
                        iAdminId: userStore.person._iId
                    })
                    aCategories.value = aCategories.value.filter(item => {
                        if (item._iId != entityToDelete._iId)
                            return item;
                    })

                })
            break;
        case 'interest':
            axios.delete("http://localhost:8000/api/deleteInterest/" + entityToDelete._iId)
                .then(response => {
                    axios.post("http://localhost:8000/api/newOperation", {
                        sInformation: "Se ha eliminado el interés con nombre " + entityToDelete._sName,
                        iAdminId: userStore.person._iId
                    })
                    aCategories.value = aCategories.value.filter(item => {
                        if (item._iId != entityToDelete._iId)
                            return item;
                    })

                })
            break;
        case 'province':
            axios.delete("http://localhost:8000/api/deleteProvince/" + entityToDelete._iId)
                .then(response => {
                    axios.post("http://localhost:8000/api/newOperation", {
                        sInformation: "Se ha eliminado la provincia con nombre " + entityToDelete._sName,
                        iAdminId: userStore.person._iId
                    })
                    aCategories.value = aCategories.value.filter(item => {
                        if (item._iId != entityToDelete._iId)
                            return item;
                    })

                })
            break;
        case 'region':
            axios.delete("http://localhost:8000/api/deleteRegion/" + entityToDelete._iId)
                .then(response => {
                    axios.post("http://localhost:8000/api/newOperation", {
                        sInformation: "Se ha eliminado la comunidad autónoma con nombre " + entityToDelete._sName,
                        iAdminId: userStore.person._iId
                    })
                    aCategories.value = aCategories.value.filter(item => {
                        if (item._iId != entityToDelete._iId)
                            return item;
                    })

                })
            break;
        case 'country':
            axios.delete("http://localhost:8000/api/deleteCountry/" + entityToDelete._iId)
                .then(response => {
                    axios.post("http://localhost:8000/api/newOperation", {
                        sInformation: "Se ha eliminado el país con nombre " + entityToDelete._sName,
                        iAdminId: userStore.person._iId
                    })
                    aCategories.value = aCategories.value.filter(item => {
                        if (item._iId != entityToDelete._iId)
                            return item;
                    })

                })
            break;
        case 'FAQ':
            axios.delete("http://localhost:8000/api/deleteFAQ/" + entityToDelete._iId)
                .then(response => {
                    axios.post("http://localhost:8000/api/newOperation", {
                        sInformation: "Se ha eliminado la FAQ con los siguientes datos: Pregunta: " + entityToDelete._sQuestion + " Respuesta: " +
                        entityToDelete._sAnswer,
                        iAdminId: userStore.person._iId
                    })
                    aFAQs.value = aFAQs.value.filter(item => {
                        if (item._iId != entityToDelete._iId)
                            return item;
                    })
                })
            break;
        case 'AMQuestion':
            axios.delete("http://localhost:8000/api/deleteAboutMeQuestion/" + entityToDelete._iId)
                .then(response => {
                    axios.post("http://localhost:8000/api/newOperation", {
                        sInformation: "Se ha eliminado la pregunta 'Conóceme' con los siguientes datos: Pregunta: " + entityToDelete._sQuestion,
                        iAdminId: userStore.person._iId
                    })
                    aAMQuestions.value = aAMQuestions.value.filter(item => {
                        if (item._iId != entityToDelete._iId)
                            return item;
                    })
                })
            break;
    }
    sPopupMessage.value = "";
    asConsequencesOfOperation.value = [];
}

</script>


<style scoped>
.blackb {
    border: solid 1px black;
}

.hline {
    border-bottom: solid 1px black;
}

.item:hover {
    background-color: rgb(189, 224, 255);
}

.clickable:hover {
    cursor: pointer;
}

.hv-increase:hover {
    cursor: pointer;
    transform: scale(1.1);
    -webkit-transform: scale(1.1);
}


.form-group {
    position: relative;
    padding: 15px 0 0;
    margin-top: 10px;
    /* width: 50%; */
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
    margin-top: 10px;
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


select {
    -webkit-appearance: none;
    -moz-appearance: none;
    -ms-appearance: none;
    appearance: none;
    outline: 0;
    box-shadow: none;
    border: 0 !important;
    background: rgb(224, 240, 255);
    background-image: none;
    flex: 1;
    padding: 0 .5em;
    color: #000000;
    cursor: pointer;
    font-size: 1em;
    font-family: 'Open Sans', sans-serif;
}

select::-ms-expand {
    display: none;
}

.select {
    position: relative;
    display: flex;
    width: 20em;
    height: 3em;
    line-height: 3;
    background: #3d3d3d;
    overflow: hidden;
    border-radius: .25em;
}

.select::after {
    content: '\25BC';
    position: absolute;
    top: 0;
    right: 0;
    padding: 0 1em;
    background: #a0a0a0;
    cursor: pointer;
    pointer-events: none;
    transition: .25s all ease;
}

.select:hover::after {
    color: #23b499;
}
</style>