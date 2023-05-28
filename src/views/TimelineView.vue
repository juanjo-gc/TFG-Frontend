<template>
  <HeaderComponent></HeaderComponent>
    <div class="container">
      <div class="row">
        <div class="col-md-2">
        </div>
        <div class="col-md-8">
          <div class="card new-post">
            <div class="card-body">
              <h5 class="card-title">Nueva publicación</h5>
              <textarea class="form-control" rows="2" maxlength="255" v-model="sPost" @keyup="calculateCharacters"></textarea>
              <span>Caracteres restantes: {{ iRemainingCharacters }}</span>
              <button class="btn btn-primary mt-2 float-end" @click="newPost">Publicar</button>
            </div>
          </div>
        </div>
        <div class="col-md-2"></div>
      </div>
      <div class="row">
        <div class="col-md-2 "></div>
        <div class="col-md-8">
          <div class="card">
            <div class="card-body">
              <ul class="list-unstyled">
                <li v-for="post in aPosts">
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
                            <font-awesome-icon icon="fa-regular fa-heart" size="sm" style="color: #1e3050;" /> {{ post.iNumLikes }}
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
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="col-md-2 "></div>
      </div>
    </div>
  </template>
  
  <script setup>
  
  import { computed, onMounted, ref } from "vue";
  import HeaderComponent from "@/components/HeaderComponent.vue"
  import { useUserStore } from "@/store/UserStore";
  import axios from "axios";
  import moment from 'moment';


  const userStore = useUserStore();
  let iRemainingCharacters = ref(255);
  let sPost = ref('');
  let aPosts = ref([]);

  function newPost() {
    axios.post("http://localhost:8000/api/newPost", {
      sText: sPost.value,
      iUserId: userStore.person._iId
    }).then((response) => {
      aPosts.value.unshift(response.data);
      sPost.value = '';
    }).catch(error => console.log(error))
  }

  onMounted(() => {
    getTimelinePosts();
  })

  function getTimelinePosts() {
    axios.get("http://localhost:8000/api/getTimelinePosts/" + userStore.person._iId)
    .then(response => {
      aPosts.value = response.data;
      // aPosts.value.map( (data, index) => ({...data, iNumLikes: 0}))
      aPosts.value.forEach(post => { 
        // console.log(typeof(post._setLikes))
        // if(typeof(post._setLikes.size) === 'undefined') {
        //   post.iNumLikes = 0;
        // } else { 
        //   post.iNumLikes = post._setLikes.size; }
        post.iNumLikes = Object.keys(post._setLikes).length;
        })
      
      aPosts.value.forEach(post => {
        console.log("Texto: " + post._sText + " Likes: " + post.iNumLikes)
        // console.log(typeof(post._setLikes.size))
    })
    }).catch(error => console.log(error));

    

  }

  function calculateCharacters() {
    iRemainingCharacters.value = 255 - sPost.value.length
  }

  function setLike(postId) {
    axios.post("http://localhost:8000/api/setLike/" + postId + "/" + userStore.person._iId)
    .then(response => {
      let postIndex = aPosts.value.findIndex(post => post._iId === postId);
      if(response.data === true) {
        aPosts.value[postIndex].iNumLikes++;
      } else {
        aPosts.value[postIndex].iNumLikes--;
      }
    })
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
  