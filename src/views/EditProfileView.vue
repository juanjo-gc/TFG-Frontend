<template>
  <header-component></header-component>
  <div class="container mt-5">
    <div class="row gutters">
      <div class="col-xl-3 col-lg-3 col-md-12 col-sm-12 col-12">
        <div class="card h-100 blackb">
          <div class="card-body">
            <div class="account-settings">
              <div class="user-profile">
                <div class="user-avatar">
                  <!-- <img
                    src="https://bootdey.com/img/Content/avatar/avatar7.png"
                    alt="Maxwell Admin"
                  /> -->
                  <!-- <img :src="userStore.profileImage" alt="profileImage"> -->
                  <img :src="'http://localhost:8000/api/getProfileImage/' + userStore.person._iId" alt="profileImg" />
                </div>
                <h4 class="name">{{ userStore.person._sName }}</h4>
                <h5 class="user-name">@{{ userStore.person._sUsername }}</h5>
                <h6 class="user-email">{{ userStore.person._sEmail }}</h6>
              </div>
              <div class="about">
                <h5>Descripción</h5>
                <div class="mb-3">
                  <p>{{ userStore.person._sDescription }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-9 col-lg-9 col-md-12 col-sm-12 col-12">
        <div class="card h-100">
          <div class="card-body blackb">
            <MDBAccordion v-model="activeItem" borderless>
              <MDBAccordionItem
                icon="fas fa-1"
                headerTitle="Datos personales"
                collapseId="collapseOne"
              >
                <div class="row gutters">
                  <!-- <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 ">
                      <h6 class="mb-2 text-primary">Personal Details</h6>
                    </div> -->
                  <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                    <div class="form-group">
                      <label for="name">Nombre</label>
                      <input
                        type="text"
                        class="form-control"
                        id="name"
                        v-model="sName"
                      />
                    </div>
                  </div>
                  <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                    <div class="form-group">
                      <label for="email">Correo electrónico</label>
                      <input
                        type="email"
                        class="form-control"
                        id="email"
                        v-model="sEmail"
                      />
                    </div>
                  </div>
                  <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                    <div class="form-group">
                      <label for="username">Nombre de usuario</label>
                      <input
                        type="text"
                        class="form-control"
                        id="username"
                        v-model="sUsername"
                      />
                    </div>
                  </div>
                  <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                    <div class="mb-3">
                      <label for="description" class="form-label"
                        >Descripción</label
                      >
                      <textarea
                        class="form-control"
                        name="sDescription"
                        v-model="sDescription"
                        id="description"
                        rows="3"
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div class="row-gutters">
                  <input
                    class="btn btn-primary"
                    type="submit"
                    value="Enviar"
                    style="width: 100%"
                    @click="updateUserDetails"
                  />
                </div>
              </MDBAccordionItem>
              <MDBAccordionItem
                icon="fas fa-question-circle fa-sm me-2 opacity-70"
                headerTitle="Intereses"
                collapseId="collapseTwo"
              >
                <div class="row gutters">
                  <ul class="ks-cboxtags">
                    <li>
                      <input
                        type="checkbox"
                        id="checkboxOne"
                        value="Música"
                        v-model="checkedInterests"
                      /><label for="checkboxOne">Música</label>
                    </li>
                    <li>
                      <input
                        type="checkbox"
                        id="checkboxTwo"
                        value="Videojuegos"
                        v-model="checkedInterests"
                      /><label for="checkboxTwo">Videojuegos</label>
                    </li>
                    <li>
                      <input
                        type="checkbox"
                        id="checkboxThree"
                        value="Deportes"
                        v-model="checkedInterests"
                      /><label for="checkboxThree">Deportes</label>
                    </li>
                  </ul>
                  <button
                    type="button"
                    class="btn btn-primary"
                    @click="uploadInterests"
                  >
                    Enviar
                  </button>
                </div>
              </MDBAccordionItem>
              <MDBAccordionItem
                headerTitle="Fotos"
                collapseId="collapseThree"
                icon="image-fill"
              >
              <p>Foto de perfil</p>
                <div class="file-upload-wrapper imgUpload">
                  <form @submit.prevent="uploadProfileImage" enctype="multipart/form-data">
                    <input 
                    type="file" 
                    id="profileImg"
                    ref="profileImg"
                    @change="onProfileImageUpload"
                    name="profileImg"
                    accept="image/png, image/jpeg"
                    />
                    <br>
                    <button type="submit" class="btn btn-primary">Subir</button>
                  </form>
                </div>
                <p>Subir fotos</p>
                <form @submit.prevent="uploadImg" enctype="multipart/form-data">
                  <div class="file-upload-wrapper imgUpload">
                    <input
                      type="file"
                      id="imgUpload"
                      ref="uploadImage"
                      @change="onImageUpload"
                      name="image"
                      accept="image/png, image/jpeg"
                      multiple
                    />
                  </div>
                  <br />
                  <button class="btn btn-primary" type="submit">Subir</button>
                </form>
              </MDBAccordionItem>
            </MDBAccordion>
          </div>
        </div>
      </div>
    </div>

    <div
      class="alert alert-danger alert-dismissible"
      role="alert"
      v-if="alertUserDetails"
    >
      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="alert"
        aria-label="Close"
        @click="alertUserDetails = false"
      ></button>
      <strong>Error.</strong> {{ userDetailsAlertMessage }}.
    </div>
    <div
      class="alert alert-danger alert-dismissible"
      role="alert"
      v-if="alertInterests"
    >
      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="alert"
        aria-label="Close"
        @click="alertInterests = false"
      ></button>
      <strong>Error.</strong> Elige entre uno y cinco intereses.
    </div>
    <div
      class="alert alert-danger alert-dismissible"
      role="alert"
      v-if="alertPhotos"
    >
      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="alert"
        aria-label="Close"
        @click="alertPhotos = false"
      ></button>
      <strong>Error.</strong> Algo salió mal al subir las fotos.
    </div>
    <div
      class="alert alert-success alert-dismissible"
      role="alert"
      v-if="alertSuccess"
    >
      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="alert"
        aria-label="Close"
        @click="alertSuccess = false"
      ></button>
      Los cambios se han aplicado correctamente.
    </div>
  </div>
</template>

<script setup>
import HeaderComponent from "@/components/HeaderComponent.vue";
import axios, { Axios } from "axios";
import { MDBAccordion, MDBAccordionItem } from "mdb-vue-ui-kit";
import { ref, onMounted, onBeforeMount } from "vue";
import { useUserStore } from "@/store/UserStore";
import { computed } from "@vue/reactivity";

let test = ref("prueba");

const activeItem = ref("collapseOne");
let userStore = useUserStore();
let formData = new FormData();
let sUsername = ref(userStore.person._sUsername);
let sName = ref(userStore.person._sName);
let sDescription = ref(userStore.person._sDescripcion);
let sEmail = ref(userStore.person._sEmail);
let uploadImage = ref(null);
let profileImg = ref(null);
let checkedInterests = ref([]);
let alertUserDetails = ref(false);
let alertInterests = ref(false);
let alertSuccess = ref(false);
let alertPhotos = ref(false);
let userDetailsAlertMessage = ref(
  "Asegúrate de que ningún campo se encuentra vacío y todos cumplen con el formato requerido."
);
onBeforeMount(() => {
  profileImg.value = "htpp://localhost:8000/api/getProfileImage/" + userStore.person._iId;
}) 

const setProfileImg = computed(() => {
  let imgFormData = new FormData();
  imgFormData.append("id", userStore.person._iId);
  axios.get("http://localhost:8000/api/getImage", 
  {
    responseType: "arrayBuffer"
  })
  .then(response => {
    console.log("Llega respuesta");
    profileImg = response.data;
    // let bytes = new Uint8Array(response.data);
    // // console.log(response.data)
    // let binary = bytes.reduce((data, b) => data += String.fromCharCode(b), '');
    // pageProfileImg.value = "data:image/jpeg;base64," + btoa(binary);
    
  })
  .catch(error => console.log(error))
})
  

function restoreUserDetailsAlert() {}

//TODO: Actualizar mensajes de error con la funcion de arriba
//TODO: Mirar por que no funciona la asignacion del userstore.person despues de la respuesta
async function updateUserDetails() {
  console.log(sEmail.value)
  if (sName.value != "" && /^[a-zA-Z]*$/.test(sName.value)) {
    console.log("Entra en primer if")
    if (sUsername.value != "" && /^[a-zA-Z0-9]*$/.test(sUsername.value)) {
      if (sEmail.value != "") {
        let userDetailsFormData = new FormData();

        userDetailsFormData.append("id", userStore.person._iId);
        userDetailsFormData.append("name", sName.value);
        userDetailsFormData.append("username", sUsername.value);
        userDetailsFormData.append("email", sEmail.value);
        userDetailsFormData.append("description", sDescription.value);

        axios
          .post(
            "http://localhost:8000/api/updateUserDetails",
            userDetailsFormData
          )
          .then((response) => {
            if (response.data._iId === 0) {
              alertUserDetails = true;
            } else {
              userStore.person = response.data;
              console.log(response.data);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        alertUserDetails = true;
      }
    } else {
      alertUserDetails = true;
    }
  } else {
    alertUserDetails = true;
  }
}

async function uploadInterests() {
  if (
    checkedInterests.value.length === 0 ||
    checkedInterests.value.length >= 5
  ) {
    alertInterests.value = true;
  } else {
    let interestsFormData = new FormData();
    interestsFormData.append("id", userStore.person._iId);
    // console.log("Longitud del vector: " + checkedInterests.value.length);
    console.log("Elementos del vector: " + checkedInterests.value);
    interestsFormData.append("interests[]", checkedInterests.value);

    axios
      .post("http://localhost:8000/api/uploadInterests", interestsFormData)
      .then((response) => {
        userStore.person = response.data;
        console.log(response.data);
        for (const elem of userStore.person._setInterests) {
          console.log(elem._sName);
          alertSuccess.value = true;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

function onProfileImageUpload() {
  formData = new FormData();
  let file = profileImg.value.files[0];
  formData.append('id', userStore.person._iId)
  formData.append('file', file);
}

function uploadProfileImage() {
  if(formData.get('file') != null) {
    console.log(formData);
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
      alertSuccess = true;
      // userStore.profileImage = response.data;
      console.log(response.data);
    })
    .catch(error => console.log(error))
  } else {
    alertPhotos = true;
  }
}

function onImageUpload() {
  formData = new FormData();

  console.log("Numero de archivos: " + uploadImage.value.files.length);
  for (let i = 0; i < uploadImage.value.files.length; i++) {
    let file = uploadImage.value.files[i];
    formData.append("file[]", file);
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
      console.log(response.data);
      alertSuccess.value = true;
    })
    .catch((error) => {
      console.log(error);
    });
}
</script>

<style scoped>
body {
  margin: 0;
  padding-top: 40px;
  color: #2e323c;
  background: #f5f6fa;
  position: relative;
  height: 100%;
}

.account-settings .user-profile {
  margin: 0 0 1rem 0;
  padding-bottom: 1rem;
  text-align: center;
}

.account-settings .user-profile .user-avatar {
  margin: 0 0 1rem 0;
}

.account-settings .user-profile .user-avatar img{
  width: 150px;
  height: 150px;
  width:100%;
  max-width: 150px;
  max-height: 150px;
  height: auto;
  -webkit-border-radius: 100px;
  -moz-border-radius: 100px;
   border-radius: 100px; 
}

img {
  object-fit: contain;
}
/* 
img {
  width: 100%;
  height: auto;
}

.user-avatar {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 300px;
  height: 300px;
  border: none;
  border-radius: 50%;
  overflow: hidden;
  padding: 30px;
} */

.account-settings .user-profile h5.user-name {
  margin: 0 0 0.5rem 0;
}

.account-settings .user-profile h6.user-email {
  margin: 0;
  font-size: 0.8rem;
  font-weight: 400;
  color: #9fa8b9;
}

.account-settings .about {
  margin: 2rem 0 0 0;
  text-align: center;
}

.account-settings .about h5 {
  margin: 0 0 15px 0;
  color: #007ae1;
}

.account-settings .about p {
  font-size: 0.825rem;
}

.form-control {
  border: 1px solid #cfd1d8;
  -webkit-border-radius: 2px;
  -moz-border-radius: 2px;
  border-radius: 2px;
  font-size: 0.825rem;
  background: #ffffff;
  color: #2e323c;
}

.card {
  /* background-color:#2e323c; */
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  border-radius: 5px;
  border: 0;
  margin-bottom: 1rem;
}

.cardFont {
  color: #ffffff;
}

.right {
  float: right;
}

.blackb {
  background-color: #fafafa;
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

ul.ks-cboxtags li input[type="checkbox"]:checked + label::before {
  content: "\f00c";
  transform: rotate(-360deg);
  transition: transform 0.3s ease-in-out;
}

ul.ks-cboxtags li input[type="checkbox"]:checked + label {
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
ul.ks-cboxtags li input[type="checkbox"]:focus + label {
  border: 2px solid #e9a1ff;
}

.center {
  justify-content: center;
  align-items: center;
}

.imgUpload {
  text-align: center;
  padding: 10px;
  border: thin solid black;
}

.textless {
  display: none;
}
</style>
