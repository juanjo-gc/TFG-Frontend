<template>
    <div class="media post-border">
        <div class="row">
            <div class="col-md-1">
                <router-link :to="`/profile/${post._user._sUsername}`" style="text-decoration: none; color: inherit;">
                    <img class="mr-3 avatar float-left"
                        :src="`http://localhost:8000/api/getProfileImage/${post._user._iId}`" alt="User avatar">
                </router-link>
            </div>
            <div class="col-md-11">
                <h5 class="mt-0 mb-1">{{ post._user._sName }}</h5>
                <h6>
                    <p class="text-muted">@{{ post._user._sUsername }}</p>
                </h6>
            </div>
        </div>
        <div class="media-body">
            <p>{{ post._sText }}</p>
            <div class="row">
                <div class="col-md-3">
                    <button class="btn float-end" style="background-color: transparent;">
                        <font-awesome-icon icon="fa-regular fa-comment" size="sm" style="color: #1e3050;" /> {{ post._iReplies }}
                    </button>
                </div>
                <div class="col-md-3">
                    <button class="btn float-end" style="background-color: transparent;" @click="setLike(post._iId)">
                        <font-awesome-icon icon="fa-regular fa-heart" size="sm" style="color: #1e3050;" /> {{ post._iLikes
                        }}
                    </button>
                </div>
                <div class="col-md-3">
                    <button class="btn float-end" style="background-color: transparent;" @click="$emit('report', post)" v-if="!bIsAdmin">
                        <font-awesome-icon icon="fa-solid fa-flag" size="sm" style="color: #8e0000;" />
                    </button>
                </div>
                <div class="col-md-3">
                    <small class="text-muted float-end" style="margin-top: 10px;">
                        Publicado el {{ moment(post._tCreatedAt).format('D-M-YYY') }}
                    </small>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useUserStore } from '@/store/UserStore';
import moment from 'moment';
import axios from 'axios';

const props = defineProps(['post', 'admin']);
const userStore = useUserStore();

let post = props.post;
let bIsAdmin = props.admin === undefined ? false : props.admin;


function reportPost(post) {
      axios.post("http://localhost:8000/api/newTicket", {
        sSubject: "Denuncia de publicación de @" + post._user._sUsername,
        sDescription: sReportDescription.value,
        iIssuerId: userStore.person._iId,
        iReportedId: post._user._iId,
        iEventId: -1,
        iPostId: post._iId,
        sCategory: 'Denunciar una publicación'
      })
    }
  
  
    function setLike(postId) {
      if(!bIsAdmin) {
        axios.post("http://localhost:8000/api/setLike/" + postId + "/" + userStore.person._iId)
        .then(response => {
        if(response.data === true) {
          post._iLikes++;
        } else {
          post._iLikes--;
        }
        if (userStore.person._iId != post._user._iId) {
          axios.post("http://localhost:8000/api/newNotification", {
            sInfo: "¡" + userStore.person._sName + " ha dado Like a tu publicación!",
            iRecipientId: post._user._iId,
            iIssuerId: userStore.person._iId,
            iPostId: post._iId,
            sType: "NewPostLike"
          })
          .then(response => console.log(response.data))
        }
      })
    }
    }

</script>


<style scoped>


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
      border: solid 1px #d0d0d0;
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
  

</style>