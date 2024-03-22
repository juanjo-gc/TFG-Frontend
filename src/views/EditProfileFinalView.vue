<template>
    <SidebarFinal id="sidebar" :key="componentKey"></SidebarFinal>
    <div class="container" v-if="!bIsFetching">
        <div class="row mt-4">
            <div class="col-md-3">
                <img :src="'http://localhost:8000/api/getProfileImage/' + userStore.person._iId" alt="ProfileImg"
                    class="img-min-circle mt-2 mb-2" v-if="userStore.person._iId != 0" />
                <img v-else
                    src="https://camo.githubusercontent.com/eb6a385e0a1f0f787d72c0b0e0275bc4516a261b96a749f1cd1aa4cb8736daba/68747470733a2f2f612e736c61636b2d656467652e636f6d2f64663130642f696d672f617661746172732f6176615f303032322d3531322e706e67"
                    alt="" class="img-min-circle mt-2 mb-2" />
                <div class="row mt-4 categories-box py-1 w-75">
                    <ul class="list-unstyled">
                        <li v-for="category in asCategoriesToSelect">
                            <div class="row category py-2 my-2 mx-0" :class="{ 'selected': category === sSelectedCategory }"
                                @click="sSelectedCategory = category">
                                <p class="mx-2 pt-3 fw-light">{{ category }}</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="col-md-8 ms-4">
                <h4 class="mt-4">{{ sSelectedCategory }}</h4>
                <div class="row mt-4" v-if="sSelectedCategory === 'Detalles de cuenta'">
                    <div class="mb-3">
                        <label for="accountName" class="form-label">Nombre de la cuenta</label>
                        <input type="text" class="form-control" id="accountName" v-model="sName">
                        <div id="accountName" class="form-text">El nombre que se mostrará para tu cuenta.</div>
                    </div>
                    <div class="mb-3">
                        <label for="username" class="form-label">Nombre de usuario</label>
                        <input type="text" class="form-control" id="username" v-model="sUsername">
                        <div id="accountName" class="form-text">El nombre que se usará para identificar tu cuenta.</div>
                    </div>
                    <div class="col-md-4">
                        <div class="mb-3">
                            <label for="provinceName" class="form-label">Localización</label>
                            <input type="text" class="form-control" id="provinceName" v-model="sProvince"
                                @keyup="filterProvinces">
                            <div id="provinceName" class="form-text" >Escribe tu provincia y selecciona de entre las
                                disponibles.</div>
                        </div>
                    </div>
                    <div class="col-md-7 mt-2" v-if="aFilteredProvinces.length === 0">
                        <button type="button" class="btn btn-outline-primary mt-4" @click="bTriggerLocationPopup = true;">No mostrar localización</button>
                            <div class="form-text" v-if="userProvince != null">Localización seleccionada: {{ userProvince._sName }}, {{ userProvince._region._sName }}, {{
                                            userProvince._region._country._sName }}</div>
                    </div>
                    <div class="col-md-7" v-else>
                        <ul class="list-unstyled mt-4">
                            <li v-for="province in aFilteredProvinces">
                                <div class="row province-info mt-2"
                                    @click="userProvince = province; sProvince = province._sName; aFilteredProvinces = []">
                                    <p class="ms-2 pt-3 ps-1">
                                        {{ province._sName }}, {{ province._region._sName }}, {{
                                            province._region._country._sName }}
                                    </p>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div class="row">
                        <div class="col-md-1">
                            <button type="button" class="btn btn-primary" @click="sendAccountDetails">Enviar</button>
                        </div>
                    </div>
                </div>
                <div class="row mt-4" v-if="sSelectedCategory === 'Información sobre el usuario'">
                    <div class="mb-3">
                        <label for="description" class="form-label fw-bold">Descripción</label>
                        <textarea class="form-control" maxlength="256" id="description" rows="3"
                            v-model="sDescription"></textarea>
                        <div class="row">
                            <div class="col-md-10">
                                <div id="accountName" class="form-text">Escribe un poco sobre ti. Puedes hablar de tus
                                    gustos o describirte un poco en general, por ejemplo.</div>
                            </div>
                            <div class="col-md-2">
                                <p class="small text-muted mt-2 float-end pe-2">{{ 256 - sDescription.length }}</p>
                            </div>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <label for="interests" class="form-label fw-bold">Intereses</label>
                        <p class="small">Selecciona aquellos intereses que creas que te representan en mayor medida. Puedes seleccionar 4 como máximo, ¡así que piensa bien cuáles eliges!</p>
                        <ul class="ks-cboxtags" id="interests">
                            <li v-for="(interest, index) in aInterests">
                                <input type="checkbox" :id="'checkbox' + index" :value="interest._sName" v-model="aCheckedInterests" /><label
                                    :for="'checkbox' + index">{{ interest._sName }}</label>
                            </li>
                        </ul>
                    </div>
                    <div class="row mb-3">
                        <p class="fw-bold">Preguntas 'Sobre mí'</p>
                        <p class="text-center small">A continuación puedes responder preguntas sobre tu personalidad. No es
                            necesario responderlas todas. Deja en blanco aquellas que
                            no quieras que se muestren en tu perfil.
                        </p>
                        <div class="mb-3" v-for="(question, index) in aAMQuestions">
                            <label :for="'question' + index" class="form-label">{{ question._sQuestion }}</label>
                            <input type="text" class="form-control" :id="'question' + index"
                            v-model="aAMQuestions[index]._sAnswer">
                        </div>
                    </div>
                    <div class="col-md-1">
                        <button type="button" class="btn btn-primary" @click="sendUserInformation">Enviar</button>
                    </div>
                </div>

                <div class="row mt-4 mb-4" v-if="sSelectedCategory === 'Fotos'">
                    <div class="d-flex justify-content-center mt-4 photos-box">
                        <div class="d-flex justify-content-center" v-for="photo in userStore.person._setImagePath">
                            <img class="user-image m-1" :src="'http://localhost:8000/api/getImage/' + photo._sName" alt=""
                                v-if="photo._tDeleteDate === null">
                            <div class="photo-xmark" v-if="photo._tDeleteDate === null">
                                <font-awesome-icon icon="fa-solid fa-xmark" class="clickable" size="l"
                                    style="color: #000000;" @click="setDeleteImagePopup(photo)" />
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="mb-3">
                            <label for="userImages" class="form-label">Subir imágenes</label>
                            <input class="form-control" type="file" id="userImages" ref="uploadImage"
                                @change="onImageUpload" multiple accept="image/png, image/jpeg">
                            <div id="userImagesInfo" class="form-text">Estas son las fotos que verán los demás al entrar a
                                tu perfil. Puedes
                                subir 6 fotos como máximo. La temática es libre, ya sean fotos tuyas, o fotos de cosas que
                                te gusten, por ejemplo. Te sugerimos
                                que sean lo suficientemente descriptivas como para que los demás puedan hacerse una idea
                                general de cómo eres.
                            </div>
                        </div>
                        <div class="col-md-3 mb-3">
                            <button type="button" class="btn btn-primary" @click="sendImages">Subir fotos</button>
                        </div>
                        <div class="mb-3">
                            <label for="profileImage" class="form-label">Cambiar foto de perfil</label>
                            <input class="form-control" type="file" id="profileImage" ref="profileImg"
                                accept="image/png, image/jpeg" @change="onProfileImageUpload">
                        </div>
                        <div class="col-md-4">
                            <button type="button" class="btn btn-primary" @click="uploadProfileImage">Cambiar foto de
                                perfil</button>
                        </div>
                    </div>
                </div>

                <div class="row mt-4 mb-4" v-if="sSelectedCategory === 'Privacidad y seguridad'">
                    <div class="mb-3">
                        <label for="email" class="form-label">Correo electrónico</label>
                        <input type="email" class="form-control" id="email" v-model="sEmail">
                        <div id="email" class="form-text">El correo electrónico de tu cuenta.</div>
                    </div>
                    <div class="mb-3">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" v-model="bPrivateAccount">
                            <label class="form-check-label" for="">
                                Cuenta privada
                            </label>
                        </div>
                        <div id="private-info" class="form-text">Al establecer tu cuenta como privada, aquellos usuarios que
                            no te sigan únicamente
                            podrán ver la información que has proporcionado en la pestaña "Información sobre el usuario". No
                            podrán ver tus publicaciones, eventos asistidos y creados ni "Me gusta".
                            Sin embargo, en caso de que decidas asistir a un evento, tu participación, comentarios y fotos
                            que hayas publicado tras la finalización del mismo serán visibles para todos los usuarios que visiten la página del evento.
                            Para más información acerca de esto, consulta las <strong @click="router.push('/help')">preguntas frecuentes.</strong>
                        </div>
                    </div>
                    <div class="col-md-4 mb-3">
                        <button type="button" class="btn btn-outline-primary mb-3"
                            @click="bShowPasswordChange = !bShowPasswordChange">
                            <span v-if="!bShowPasswordChange">Cambiar contraseña</span>
                            <span v-else>No cambiar contraseña</span>
                        </button>
                    </div>
                    <div class="row" v-if="bShowPasswordChange">
                        <p class="text-muted small">Si no quieres ejecutar ningún cambio sobre la contraseña, oculta esta
                            sección pulsando el botón que se encuentra encima de este texto.
                            En caso contrario, se enviará la solicitud para solicitar también un cambio de contraseña,
                            además de las opciones mostradas en la parte superior.
                        </p>
                        <div class="mb-3">
                            <label for="currentPassword" class="form-label">Contraseña actual</label>
                            <input type="password" class="form-control" id="currentPassword" v-model="sCurrentPassword">
                            <div id="currentPassword" class="form-text">Por motivos de seguridad, para cambiar la contraseña
                                es necesario que escribas tu contraseña antigua.</div>
                        </div>
                        <div class="mb-3">
                            <label for="newPassword" class="form-label">Nueva contraseña</label>
                            <input type="password" class="form-control" id="newPassword" v-model="sNewPassword">
                            <div id="newPassword" class="form-text">La nueva contraseña deberá contener, al menos, una letra
                                mayúscula, una minúscula, un número, y no debe ser más corta de 8 caracteres.</div>
                        </div>
                        <div class="mb-3">
                            <label for="passConfirm" class="form-label">Vuelve a escribir la contraseña nueva</label>
                            <input type="password" class="form-control" id="passConfirm" v-model="sNewPasswordConfirmation">
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-1">
                            <button type="button" class="btn btn-primary" @click="sendPrivacityOptions">Enviar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Popup v-if="bTriggerPopup">
            <p class="mt-4 fs-5 fw-light text-center">¿Estás seguro de que quieres borrar la imagen?</p>
            <div class="row mt-2">
                <div class="col-md-8"></div>
                <div class="col-md-2">
                    <button type="button" class="btn btn-danger" @click="deleteImage">Borrar</button>
                </div>
                <div class="col-md-2">
                    <button type="button" class="btn btn-secondary" @click="bTriggerPopup = false">Volver</button>
                </div>
            </div>
        </Popup>
        <Popup v-if="bTriggerLocationPopup">
            <div class="row mx-4">
                <p class="mt-4 fs-5 fw-bold">¿Estás seguro de que no quieres mostrar tu localización?</p>
                <p class="mt-2 fw-light">Sin localización, los demás usuarios no podrán saber de donde eres, y por tanto solo aparecerás para los demás usuarios cuando decidan usar la función de buscar personas si no filtran por localización.</p>
                <p class="mt-1">¿Quieres continuar sin mostrar tu localización?</p>
            </div>
            <div class="row mt-2">
                <div class="col-md-8"></div>
                <div class="col-md-4">
                    <div class="row">
                        <div class="col-md-6">
                            <button type="button" class="btn btn-primary float-end" @click="userProvince = null; sProvince = ''; bTriggerLocationPopup = false">Continuar</button>
                        </div>
                        <div class="col-md-6">
                            <button type="button" class="btn btn-secondary" @click="bTriggerLocationPopup = false">Volver</button>
                        </div>
                    </div>
                </div>
            </div>
        </Popup>
        <div class="alert alert-success alert-dismissible fade show fixed-bottom" role="alert" v-if="bTriggerSuccessAlert">
            {{ sAlertMessage }}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"
                @click="bTriggerSuccessAlert = false"></button>
        </div>
        <div class="alert alert-danger alert-dismissible fade show fixed-bottom" role="alert" v-if="bTriggerErrorAlert">
            <strong>Error. </strong>{{ sAlertMessage }}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"
                @click="bTriggerErrorAlert = false"></button>
        </div>
    </div>
</template>
    

<script setup>

import SidebarFinal from "@/components/SidebarFinal.vue";
import Popup from "@/components/Popup.vue";
import axios from "axios";
import moment from "moment";
import { ref, onMounted } from "vue";
import { useUserStore } from "@/store/UserStore";


const activeItem = ref("collapseOne");
const userStore = useUserStore();
let asCategoriesToSelect = ref(['Detalles de cuenta', 'Información sobre el usuario', 'Fotos', 'Privacidad y seguridad']);
let aAMQuestions = ref([]);
let aAMAnswers = ref([]);
let sSelectedCategory = ref('Detalles de cuenta');
let formData = new FormData();
let aProvinces = [];
let aFilteredProvinces = ref([]);
let sUsername = ref(userStore.person._sUsername);
let sName = ref(userStore.person._sName);
let sProvince = ref(userStore.person._province != null ? userStore.person._province._sName : "");
let userProvince = ref(null);
let sDescription = ref(userStore.person._sDescription != null ? userStore.person._sDescription : "");
let sEmail = ref(userStore.person._sEmail);
let uploadImage = ref(null);
let profileImg = ref(null);
let checkedInterests = ref([]);
let bTriggerSuccessAlert = ref(false);
let bTriggerErrorAlert = ref(false);
let bTriggerPopup = ref(false);
let iImageIdToDelete = ref(null);
let sAlertMessage = ref("");
let bIsFetching = ref(true);
let bShowPasswordChange = ref(false);
let bPrivateAccount = ref(userStore.person._bIsPrivate);
let sCurrentPassword = ref("");
let sNewPassword = ref("");
let sNewPasswordConfirmation = ref("");
let aInterests = ref([]);
let aCheckedInterests = ref([]);
let bTriggerLocationPopup = ref(false);

let sidebar = ref(null);
let componentKey = ref(0);

onMounted(() => {
    sidebar.value = document.getElementById('sidebar');
    axios.get("http://localhost:8000/api/getAllProvinces")
        .then(response => aProvinces = response.data);
        axios.get("http://localhost:8000/api/getAllInterests")
        .then(response => aInterests.value = response.data);
    userStore.person._setInterests.forEach(interest => {
        aCheckedInterests.value.push(interest._sName)
    })
    axios.get("http://localhost:8000/api/getAllAboutMeQuestions")
        .then(response => {
            aAMQuestions.value = response.data;
            axios.get("http://localhost:8000/api/getUserAnswers/" + userStore.person._iId)
                .then(response => {
                    aAMAnswers.value = response.data;
                    aAMQuestions.value.forEach(question => {
                        let answerToQuestion = aAMAnswers.value.find(answer => answer._question._iId === question._iId);
                        if (answerToQuestion === undefined) {
                            question._sAnswer = "";
                            question._iAnswerId = -1;
                        } else {
                            question._sAnswer = answerToQuestion._sAnswer;
                            question._iAnswerId = answerToQuestion._iId;
                        }
                    })
                })

        });
    userProvince.value = userStore.person._province;
    setTimeout(() => {
        bIsFetching.value = false;
    }, 250);
})


function filterProvinces() {
    if (sProvince.value.length > 2) {
        aFilteredProvinces.value = aProvinces.filter(province => province._sName.match(new RegExp('^' + sProvince.value)));
        if (aFilteredProvinces.value.length > 5)
            aFilteredProvinces.value = aFilteredProvinces.value.slice(0, 4);
    }
    else
        aFilteredProvinces.value = [];
}

function isBlank(sStr) {
    let bIsBlank = true;
    for (let i = 0; i < sStr.length; i++) {
        if (sStr.charAt(i) != " ")
            bIsBlank = false;
    }
    return bIsBlank;
}

function sendAccountDetails() {
    if (!isBlank(sName.value) && !isBlank(sUsername.value)) {
        axios.post("http://localhost:8000/api/updateUserAccountDetails", {
            iUserId: userStore.person._iId,
            sName: sName.value,
            sUsername: sUsername.value,
            sDescription: sDescription.value,
            iProvinceId: userProvince.value != null ? userProvince.value._iId : -1,
            sCurrentPassword: "",
            sNewPasswordConfirmation: "",
            sNewPassword: "",
            bIsPrivate: userStore.person._bIsPrivate,
            asInterests: [],
        })
            .then(response => {
                if (response.data._iId != 0) {
                    userStore.person._sName = response.data._sName;
                    userStore.person._sUsername = response.data._sUsername;
                    componentKey.value += 1;
                    userStore.person._province = response.data._province;
                    bTriggerSuccessAlert.value = true;
                    sAlertMessage.value = "Los cambios se han aplicado correctamente.";
                } else {
                    bTriggerErrorAlert.value = true;
                    sAlertMessage.value = "Alguno de los campos esta vacío o es erróneo. Revisa los datos introducidos."
                }
            })
    } else {
        bTriggerErrorAlert.value = true;
        sAlertMessage.value = "Los campos de nombre de cuenta y de usuario no pueden quedar vacíos."
    }
}

function uploadInterests() {
    let interestsFormData = new FormData();
    interestsFormData.append("id", userStore.person._iId);
    interestsFormData.append("interests[]", aCheckedInterests.value);

    axios.post("http://localhost:8000/api/uploadInterests", interestsFormData)
      .then((response) => {
        userStore.person._setInterests = response.data;
      })
      .catch((error) => {
        console.log(error);
      });
}

function sendUserInformation() {
    if(aCheckedInterests.value.length >=5) {
        bTriggerErrorAlert.value = true;
        sAlertMessage.value = "No se han podido actualizar los intereses. Selecciona como máximo 4 intereses.";
    } else {
        uploadInterests();
        axios.post("http://localhost:8000/api/updateUserDescription", {
            iUserId: userStore.person._iId,
            sName: sName.value,
            sUsername: sUsername.value,
            sDescription: sDescription.value,
            iProvinceId: userProvince.value._iId,
            sCurrentPassword: "",
            sNewPasswordConfirmation: "",
            sNewPassword: "",
            bIsPrivate: userStore.person._bIsPrivate,
            asInterests: [],
    })
        .then(response => {
            userStore.person._sDescription = sDescription.value;
        })
    aAMQuestions.value.forEach(item => {
        if (!isBlank(item._sAnswer) || item._iAnswerId != -1) {      //Se envia si las respuestas no son blancas o ya existía la respuesta
            axios.post("http://localhost:8000/api/createOrModifyAboutMeAnswer", {
                sQuestion: item._sQuestion,
                sAnswer: item._sAnswer,
                iAdminId: -1,
                iUserId: userStore.person._iId,
                iQuestionId: item._iId,
                iAnswerId: item._iAnswerId
            })
            .then(response => {
                response.data === true ? bTriggerSuccessAlert.value = true : bTriggerErrorAlert.value = true;
                bTriggerSuccessAlert.value === true ? sAlertMessage.value = "Los cambios se han aplicado correctamente." : "Ocurrió un error inesperado."
            })
        }
    })
}

}

function uploadProfileImage() {
    if (formData.get('file') != null) {
        axios({
            url: "http://localhost:8000/api/uploadProfileImage",
            method: "POST",
            data: formData,
            headers: {
                Accept: "application/json",
                "Content-Type": "multipart/form-data",
            },
        })
            .then(response => {
                if (response.data._iId != 0) {
                    userStore.person._profileImagePath = response.data;
                    bTriggerSuccessAlert.value = true;
                    bTriggerErrorAlert.value = false;
                    sAlertMessage.value = "Los cambios se han aplicado correctamente. Recarga la página para visualizar los cambios.";
                } else {
                    bTriggerErrorAlert.value = true;
                    sAlertMessage.value = "No se ha podido subir la foto de perfil. Inténtalo de nuevo más tarde.";
                }
            })
            .catch(error => console.log(error))
    } else {
        bTriggerErrorAlert.value = true;
        sAlertMessage.value = "No se ha podido subir la foto de perfil.";
    }
}

function onProfileImageUpload() {
    formData = new FormData();
    formData.append("id", userStore.person._iId);
    formData.append("file", profileImg.value.files[0]);
}

function onImageUpload() {
    formData = new FormData();
    let iCurrentUploadedImages = 0;
    userStore.person._setImagePath.forEach(image => {
        if (image._tDeleteDate === null)
            iCurrentUploadedImages++;
    })
    if (uploadImage.value.files.length > 6 || (uploadImage.value.files.length + iCurrentUploadedImages) > 6) {
        bTriggerErrorAlert.value = true;
        sAlertMessage.value = "No se pueden subir más de 6 fotos por usuario. Sube menos fotos o borra alguna para poder subir las imágenes."
        uploadImage.value.files = [];
    } else {
        for (let i = 0; i < uploadImage.value.files.length; i++) {
            let file = uploadImage.value.files[i];
            formData.append("userId", userStore.person._iId)
            formData.append("file", file);
        }
    }
}

async function uploadImg() {
    formData.append('id', userStore.person._iId);
    axios({
        url: "http://localhost:8000/api/uploadImages",
        method: "POST",
        data: formData,
        headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
        },
    })
        .then((response) => {
            alertSuccess.value = true;
        })
        .catch((error) => {
            console.log(error);
        });
}

function sendImages() {
    if (uploadImage.value.files.length > 0) {
        for (let i = 0; i < uploadImage.value.files.length; i++) {
            let currentFormData = new FormData();
            currentFormData.append('userId', userStore.person._iId);
            currentFormData.append('file', uploadImage.value.files[i]);
            let sFilename = userStore.person._iId + "-" + uploadImage.value.files[i].name;
            let existingImage = userStore.person._setImagePath.find(image => image._sName === sFilename);
            if (existingImage === undefined) {   // La imagen no existe => se guarda como nueva
                axios({
                    url: "http://localhost:8000/api/uploadUserImage",
                    method: "POST",
                    data: currentFormData,
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "multipart/form-data",
                    },
                })
                    .then((response) => {
                        if (response.data._iId != 0) {
                            bTriggerSuccessAlert.value = true;
                            sAlertMessage.value = "Los cambios se han aplicado correctamente.";
                            userStore.person._setImagePath.push(response.data);
                        } else {
                            bTriggerErrorAlert.value = false;
                            sAlertMessage.value = "Ha ocurrido un error. Asegúrate de no introducir imágenes con el mismo nombre.";
                        }
                    })
            } else {    // La imagen existe => se quita soft delete
                if (existingImage._tDeleteDate != null) {
                    axios.patch("http://localhost:8000/api/softDeleteOrRestoreImage/" + existingImage._iId)
                        .then(response => {
                            if (response.data === false) {
                                let iImageIndex = userStore.person._setImagePath.findIndex(image => image._iId === existingImage._iId);
                                userStore.person._setImagePath[iImageIndex]._tDeleteDate = null;
                            }
                        })
                } else {
                    bTriggerErrorAlert.value = true;
                    sAlertMessage.value = "Se ha producido un error al subir las imágenes. Revisa que no tengan el mismo nombre y vuelve a intentarlo.";
                }
            }
        }
    }
}

function setDeleteImagePopup(image) {
    bTriggerPopup.value = true;
    iImageIdToDelete.value = image._iId;
}

function deleteImage() {
    axios.patch("http://localhost:8000/api/softDeleteOrRestoreImage/" + iImageIdToDelete.value)
        .then(response => {
            if (response.data === true) {
                userStore.person._setImagePath = userStore.person._setImagePath.map(image => {
                    if (image._iId === iImageIdToDelete.value) {
                        image._tDeleteDate = moment(Date.now());
                    }
                    return image;
                })
            }
        })
    bTriggerPopup.value = false;
}

function sendPrivacityOptions() {
    let userDTO = {
        iUserId: userStore.person._iId,
        sName: "",
        sUsername: "",
        sEmail: sEmail.value,
        sDescription: "",
        iProvinceId: -1,
        sCurrentPassword: bShowPasswordChange.value ? sCurrentPassword.value : null,
        sNewPasswordConfirmation: sNewPasswordConfirmation.value,
        sNewPassword: sNewPassword.value,
        bIsPrivate: bPrivateAccount.value,
        asInterests: [],
    }
    if (bShowPasswordChange.value) {
        if (!sNewPassword.value.match(/(.*[a-z].*)/) || !sNewPassword.value.match(/(.*[A-Z].*)/) ||
            !sNewPassword.value.match(/(.*\d.*)/) || sNewPassword.value.length < 8) {
            bTriggerErrorAlert.value = true;
            sAlertMessage.value = 'La contraseña no cumple con los requisitos indicados. Asegúrate de que contiene, al menos, una letra mayúscula, una minúscula y un número, y tiene una longitud superior a 8 caracteres.';
        } else if (sNewPassword.value != sNewPasswordConfirmation.value) {
            bTriggerErrorAlert.value = true;
            sAlertMessage.value = "Las contraseñas no coinciden. Asegúrate de que has escrito bien tu nueva contraseña y su confirmación."
        } else {
            axios.post("http://localhost:8000/api/updateUserPrivacityOptions", userDTO)
                .then(response => {
                    if (response.data._iId === 0) {
                        bTriggerErrorAlert.value = true;
                        sAlertMessage.value = "No se han podido modificar las opciones de privacidad. Asegúrate de que todos los campos introducidos tienen el formato y valor correcto."
                    } else {
                        userStore.person._bIsPrivate = response.data._bIsPrivate;
                        userStore.person._sEmail = response.data._sEmail;
                        userStore.person._sPassword = response.data._sPassword;
                        bTriggerSuccessAlert.value = true;
                        sAlertMessage.value = "Los cambios se han aplicado correctamente.";
                        sCurrentPassword.value = "";
                        sNewPassword.value = "";
                        sNewPasswordConfirmation.value = "";
                        bShowPasswordChange.value = "";
                    }
                })
        }
    } else {
        axios.post("http://localhost:8000/api/updateUserPrivacityOptions", userDTO)
            .then(response => {
                if (response.data._iId === 0) {
                    bTriggerErrorAlert.value = true;
                    sAlertMessage.value = "No se han podido modificar las opciones de privacidad. Asegúrate de que todos los campos introducidos tienen el formato y valor correcto."
                } else {
                    userStore.person._bIsPrivate = response.data._bIsPrivate;
                    userStore.person._sEmail = response.data._sEmail;
                    bTriggerSuccessAlert.value = true;
                    sAlertMessage.value = "Los cambios se han aplicado correctamente.";
                }
            })
    }

}

</script>



<style scoped>
image {
    object-fit: contain;
}


.user-image {
    object-fit: contain;
    max-height: 200px;
    width: auto;
}

.photo-xmark {
    position: relative;
    top: 0;
    right: 0;
    width: 10px;
    height: 10px;
    transform: translate(0, 0);
    z-index: 5;
}

.photos-box {
    max-width: 60vw;
    column-count: 3;
    flex-wrap: wrap;
}

.img-min-circle {
    height: 100px;
    width: 100px;
    border-radius: 50%;
    border: solid 1px black;
}

.categories-box {
    border: solid 1px rgb(183, 173, 255);
    background-color: rgb(225, 222, 255);
}

.category:hover {
    cursor: pointer;
    background-color: rgb(190, 184, 255);
}

.clickable {
    cursor: pointer;
}

.selected {
    background-color: rgb(190, 184, 255);
}

.province-info {
    border: solid 1px rgb(183, 173, 255);
    background-color: rgb(225, 222, 255);
    border-radius: 5px;
    padding: 3px;
}

.province-info:hover {
    cursor: pointer;
    background-color: rgb(190, 184, 255);
}

ul.ks-cboxtags {
  list-style: none;
  padding: 20px;
}

ul.ks-cboxtags li {
  display: inline;
}

ul.ks-cboxtags li label {
  display: inline-block;
  background-color: rgba(255, 255, 255, 0.9);
  border: 2px solid rgba(139, 139, 139, 0.3);
  color: #adadad;
  border-radius: 25px;
  white-space: nowrap;
  margin: 3px 0px;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  transition: all 0.2s;
}

ul.ks-cboxtags li label {
  padding: 8px 12px;
  cursor: pointer;
}

ul.ks-cboxtags li label::before {
  display: inline-block;
  font-style: normal;
  font-variant: normal;
  text-rendering: auto;
  -webkit-font-smoothing: antialiased;
  font-family: "Font Awesome 5 Free";
  font-weight: 900;
  font-size: 12px;
  padding: 2px 6px 2px 2px;
  content: "\f067";
  transition: transform 0.3s ease-in-out;
}

ul.ks-cboxtags li input[type="checkbox"]:checked+label::before {
  content: "\f00c";
  transform: rotate(-360deg);
  transition: transform 0.3s ease-in-out;
}

ul.ks-cboxtags li input[type="checkbox"]:checked+label {
  border: 2px solid #1b61f8;
  background-color: #1b61f8;
  color: #fff;
  transition: all 0.2s;
}

ul.ks-cboxtags li input[type="checkbox"] {
  display: absolute;
}

ul.ks-cboxtags li input[type="checkbox"] {
  position: absolute;
  opacity: 0;
}

ul.ks-cboxtags li input[type="checkbox"]:focus+label {
  border: 2px solid #e9a1ff;
}


</style>