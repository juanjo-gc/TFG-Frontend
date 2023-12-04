<template>
    <div class="media post-border">
        <div class="row">
            <div class="col-md-1">
                <router-link :to="`/profile/${post._user._sUsername}`" style="text-decoration: none; color: inherit;">
                    <img class="mr-3 avatar float-left"
                        :src="`http://localhost:8000/api/getProfileImage/${post._user._iId}`" alt="User avatar">
                </router-link>
            </div>
            <div class="col-md-7">
                <h5 class="mt-0 mb-1">{{ post._user._sName }}</h5>
                <h6>
                    <p class="text-muted">@{{ post._user._sUsername }}</p>
                </h6>
            </div>
            <div class="col-md-4" v-if="post._repliesTo != null" @click="router.push('/post/' + post._repliesTo._iId)">
                <p class="small text-muted clickable">Respondiendo a @{{ post._repliesTo._user._sUsername }}</p>
            </div>
        </div>
        <div class="media-body" :class="{clickable: bIsClickable}">
            <p  @click="router.push('/post/' + post._iId)">{{ post._sText }}</p>
            <div class="row">
                <div class="col-md-3">
                    <button class="btn float-end" style="background-color: transparent;" @click="router.push('/post/' + post._iId)">
                        <font-awesome-icon icon="fa-regular fa-comment" size="sm" style="color: #1e3050;" /> {{ post._iReplies }}
                    </button>
                </div>
                <div class="col-md-3">
                    <button class="btn float-end" style="background-color: transparent;" @click="setLike(post._iId)">
                        <font-awesome-icon icon="fa-solid fa-heart" size="sm" :style="{color: sLikeColor}" /> {{ post._iLikes }}
                    </button>
                </div>
                <div class="col-md-3" v-if="post._user._iId != userStore.person._iId">
                    <button class="btn float-end" style="background-color: transparent;" @click="$emit('report', post)" v-if="!bIsAdmin">
                        <font-awesome-icon icon="fa-solid fa-flag" size="sm" style="color: #8e0000;" />
                    </button>
                </div>
                <div class="col-md-3" v-else></div>
                <div class="col-md-3">
                    <small class="text-muted float-end" style="margin-top: 10px;">
                        Publicado el {{ moment(post._tCreatedAt).format('D-M-YYYY') }}
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
import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';

const props = defineProps(['post', 'admin', 'clickable', 'liked']);
const userStore = useUserStore();
const router = useRouter();

let post = props.post;
let bIsClickable = props.clickable === undefined ? true : false;
let bIsAdmin = props.admin === undefined ? false : props.admin;
let bIsLiked = props.liked;
let sLikeColor = ref(null);

onMounted(() => {
  if(bIsLiked === undefined) {
    axios.get("http://localhost:8000/api/checkLike/" + post._iId + "/" + userStore.person._iId)
    .then(response => sLikeColor.value = response.data ? '#8e0000' : '#1e3050')
  } else {
    sLikeColor.value = bIsLiked ? '#8e0000' : '#1e3050';
  }
})

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
          sLikeColor.value = '#8e0000';
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
        } else {
          sLikeColor.value = '#1e3050';
          post._iLikes--;
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

  .clickable {
    cursor: pointer;
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