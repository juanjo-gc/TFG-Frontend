<template>
    <HeaderComponent></HeaderComponent>
      <div class="container" v-if="!bIsFetching">
        <div class="row" style="height: 150px;">
        </div>
        <div class="row">
          <div class="col-md-2 "></div>
          <div class="col-md-8">
            <div class="card">
              <div class="card-body">
                    <div class="media post-border">
                      <div class="row">
                        <div class="col-md-1">
                          <img class="mr-3 avatar float-left" src="https://static.vecteezy.com/system/resources/thumbnails/000/439/863/small/Basic_Ui__28186_29.jpg" alt="User avatar">
                        </div>
                        <div class="col-md-11">
                          <h5 class="mt-0 mb-1">{{ post._user._sName }}</h5>
                          <h6><p class="text-muted">@{{ post._user._sUsername }}</p></h6>
                        </div>
                      </div>
                      <div class="media-body">
                        <p>{{ post._sText }}</p>
                        <div class="row">
                          <div class="col-md-3">
                            <button class="btn float-end" style="background-color: transparent;">
                              <font-awesome-icon icon="fa-regular fa-comment" size="sm" style="color: #1e3050;" /> 0
                            </button>
                          </div>
                          <div class="col-md-3">
                            <button class="btn float-end" style="background-color: transparent;" @click="setLike(post._iId)">
                              <font-awesome-icon icon="fa-regular fa-heart" size="sm" style="color: #1e3050;" /> {{ post._iLikes }}
                            </button>
                          </div>
                          <div class="col-md-6">
                            <small class="text-muted float-end" style="margin-top: 10px;">
                              Publicado el {{ moment(post._tCreatedAt).format('D-M-YYY') }}  
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>
              </div>
            </div>
          </div>
          <div class="col-md-2 "></div>
        </div>
        <!-- Publicar respuesta -->
        <div class="row">
          <div class="col-md-2"></div>
          <div class="col-md-8">
            <div class="reply-wrapper">
              <p class="lead fw-formal">Publica tu respuesta</p>
              <textarea maxlength="255" placeholder="Escribe tu respuesta aquí" v-model="sReplyText"></textarea>
              <span>Caracteres restantes: {{ 255 - sReplyText.length }}</span>
              <button class="btn btn-primary float-end mt-2" @click="postNewReply">Publicar respuesta</button>
            </div>
          </div>
          <div class="col-md-2"></div>
        </div>
        
        <!-- Listado de respuestas -->
        <div class="row">
          <div class="col-md-2"></div>
          <div class="col-md-8">
            <h5>Respuestas</h5>
            <div v-if="aReplies.length === 0">
              <p class="lead fw-formal" style="margin=20px;">Aún no hay respuestas para esta publicación :&#40;</p>
            </div>
            <div class="card" v-else>
            <div class="card-body">
              <ul class="list-unstyled">
                <li v-for="reply in aReplies">
                  <div class="media post-border">
                    <div class="row">
                      <div class="col-md-1">
                        <router-link :to="`/profile/${reply._user._sUsername}`" style="text-decoration: none; color: inherit;">
                        <img class="mr-3 avatar float-left" :src="`http://localhost:8000/api/getProfileImage/${reply._user._iId}`"  alt="User avatar">
                        </router-link>
                      </div>
                      <div class="col-md-11">
                        <h5 class="mt-0 mb-1">
                          <router-link :to="`/profile/${reply._user._sUsername}`" style="text-decoration: none; color: inherit;">
                          {{ reply._user._sName }}
                          </router-link>
                        </h5>
                        <h6><p class="text-muted">@{{ reply._user._sUsername }}</p></h6>
                      </div>
                    </div>
                    <div class="media-body">
                      <router-link :to="`/post/${reply._iId}`" style="text-decoration: none; color: inherit;">
                      <div>
                        <p>{{ reply._sText }}</p>
                      </div>
                    </router-link>
                      <div class="row">
                        <div class="col-md-3">
                          <button class="btn float-end" style="background-color: transparent;">
                            <font-awesome-icon icon="fa-regular fa-comment" size="sm" style="color: #1e3050;" /> 0
                          </button>
                        </div>
                        <div class="col-md-3">
                          <button class="btn float-end" style="background-color: transparent;" @click="setLike(post._iId)">
                            <font-awesome-icon icon="fa-regular fa-heart" size="sm" style="color: #1e3050;" /> {{ post._iLikes }}
                          </button>
                        </div>
                        <div class="col-md-6">
                          <small class="text-muted float-end" style="margin-top: 10px;">
                            Publicado el {{ moment(reply._tCreatedAt).format('D-M-YYY') }}  
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          </div>
          <div class="col-md-2"></div>
        </div>
        <!-- Alerta -->
        <div class="alert alert-danger alert-dismissible fade show" role="alert" v-if="bError">
          <strong>Error.</strong> {{ sErrorMessage }}.
          <button type="button" class="btn-close" aria-label="Close" @click="resetErrors"></button>
        </div>
      </div>
    </template>
    
    <script setup>
    
    import { onMounted, ref } from "vue";
    import HeaderComponent from "@/components/HeaderComponent.vue"
    import { useUserStore } from "@/store/UserStore";
    import axios from "axios";
    import moment from 'moment';
    import { useRoute } from "vue-router";
  
  
    const userStore = useUserStore();
    const route = useRoute();
    let post = ref(axios.get("http://localhost:8000/api/getPost/" + route.params.id));
    let aReplies = ref(null);
    let aLikes = ref(null);
    let sLink = "http://localhost:8000/api/getPost/" + route.params.id;
    let bIsFetching = ref(true);
    let sReplyText = ref("");
    let bError = ref(false);
    let sErrorMessage = ref("");
  
  
    onMounted(() => {
      console.log(sLink)
      axios.get("http://localhost:8000/api/getPost/" + route.params.id)
      .then(response => {
        // console.log(response.data)
        post.value = response.data;
        // console.log(post.value)
        if(post.value._iId != 0) {   // la publicación es válida
          axios.get("http://localhost:8000/api/getLikes/" + post.value._iId)
          .then(response => {
            aLikes.value = response.data;
          })
          .catch(error => console.log(error));
          axios.get("http://localhost:8000/api/getReplies/" + post.value._iId)
          .then(response => {
            aReplies.value = response.data;
          })
          .catch(error => console.log(error));
        }
        bIsFetching.value = false;
      }).catch(error => console.log(error));
    })

    function resetErrors() {
      bError.value = false;
      sErrorMessage.value = "";
    }
  
  
    function setLike(postId) {
      axios.post("http://localhost:8000/api/setLike/" + postId + "/" + userStore.person._iId)
      .then(response => {
        if(response.data === true) {
          post.value._iLikes++;
        } else {
          post.value._iLikes--;
        }
      })
    }

    function postNewReply() {
      if(sReplyText.value === "") {
        bError.value = true;
        sErrorMessage.value = "La respuesta no puede estar vacía."
      } else {
        axios.post("http://localhost:8000/api/newReply/" + post.value._iId, {
          sText: sReplyText.value,
          iUserId: userStore.person._iId
        })
        .then(response => {
          aReplies.value.unshift(response.data);
        })
        .catch(error => console.log(error));
        sReplyText.value = "";
      }
    }
  
    // const person = userStore.person;
        
      
    
    </script>
    
    <style>
    .social-media-wall {
      margin-top: 20px;
    }
    
    .list-unstyled {
      padding: 0;
      margin: 0;
    }
    
    .media {
      margin-bottom: 10px;
    }
    
    .media-body {
      overflow: hidden;
    }
    
    .media-body p {
      max-height: 80px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .text-muted {
      color: #777;
    }
  
    .post-border {
      border: solid 1px #777;
      padding: 10px;
    }
  
    .new-post {
      margin-top: 75px;
    }
  
    .avatar {
      border-radius: 50%;
      width: 50px;
      height: 50px;
    }
  
  
  .reply-wrapper {
    padding: 20px;
    margin: 10px;
    /* background-color: #f4f4f4; */
  }

  textarea {
    width: 100%;
    height: 100px;
  }
  
  
    
  .button-like {
    border: 2px solid #8a8a8a;
    background-color: transparent;
    text-decoration: none;
    padding: 1rem;
    position: relative;
    vertical-align: middle;
    text-align: center;
    display: inline-block;
    border-radius: 3rem;
    color: #8a8a8a;
    transition: all ease 0.4s;
  }
  
  .button-like span {
    margin-left: 0.5rem;
  }
  
  .button-like .fa,
  .button-like span {
    transition: all ease 0.4s;
  }
  
  .button-like:focus {
    background-color: transparent;
  }
  
  .button-like:focus .fa,
  .button-like:focus span {
    color: #8a8a8a;
  }
  
  .button-like:hover {
    border-color: #cc4b37;
    background-color: transparent;
  }
  
  .button-like:hover .fa,
  .button-like:hover span {
    color: #cc4b37;
  }
  
  .liked {
    background-color: #cc4b37;
    border-color: #cc4b37;
  }
  
  .liked .fa,
  .liked span {
    color: #fefefe;
  }
  
  .liked:focus {
    background-color: #cc4b37;
  }
  
  .liked:focus .fa,
  .liked:focus span {
    color: #fefefe;
  }
  
  .liked:hover {
    background-color: #cc4b37;
    border-color: #cc4b37;
  }
  
  .liked:hover .fa,
  .liked:hover span {
    color: #fefefe;
  }
  
  
  
  
  
    .blackb {
      border: solid 2px black;
    }
    </style>
    