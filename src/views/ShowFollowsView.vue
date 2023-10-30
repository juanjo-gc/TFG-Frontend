<template>
    <HeaderComponent></HeaderComponent>
      <div class="container" >
        <div class="row">
            <div class="col-md-2"></div>
            <div class="col-md-8">
                <div class="row" style="margin-top: 40px;">
                    <div class="col-sm-6" style="border-right: solid 1px black;">
                      <div class="wrapper" >
                        <button class="trigger" @click="toggleFollowing" :class="{actived: bFollowingActive}">
                          Siguiendo
                        </button>
                      </div>
                    </div>
                    <div class="col-sm-6">
                      <div class="wrapper">
                        <button class="trigger" @click="toggleFollowers" :class="{actived: !bFollowingActive }">
                          Seguidores
                        </button>
                      </div>
                    </div>
                </div>
            </div>
            <div class="col-md-2"></div>
        </div>
        <div class="row" style="margin-top: 30px;">
          <div class="col-md-2"></div>
          <div class="col-md-8">
            <ul class="list-unstyled">
              <li v-for="follower in aFollowers" v-if="!bFollowingActive">
                <div class="user-data" v-if="!follower._bIsSuspended">
                  <div class="row">
                    <div class="col-sm-1">
                      <router-link :to="`/profile/${follower._sUsername}`" style="text-decoration: none; color: inherit;">
                        <img class="mr-3 avatar float-left" :src="`http://localhost:8000/api/getProfileImage/${follower._iId}`"  alt="User avatar">
                      </router-link>
                    </div>
                    <div class="col-sm-11">
                      <h5 class="mt-0 mb-1">
                          <router-link :to="`/profile/${follower._sUsername}`" style="text-decoration: none; color: inherit;">
                          {{ follower._sName }}
                          </router-link>
                        </h5>
                        <h6><p class="text-muted">@{{ follower._sUsername }}</p></h6>
                        <p class="text-muted">{{ follower._sDescription }}</p>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
            <ul class="list-unstyled">
              <li v-for="followed in aFollowing" v-if="bFollowingActive">
                <div class="user-data" v-if="!followed._bIsSuspended">
                  <div class="row">
                    <div class="col-sm-1">
                      <router-link :to="`/profile/${followed._sUsername}`" style="text-decoration: none; color: inherit;">
                        <img class="mr-3 avatar float-left" :src="`http://localhost:8000/api/getProfileImage/${followed._iId}`"  alt="User avatar">
                      </router-link>
                    </div>
                    <div class="col-sm-11">
                      <h5 class="mt-0 mb-1">
                          <router-link :to="`/profile/${followed._sUsername}`" style="text-decoration: none; color: inherit;">
                          {{ followed._sName }}
                          </router-link>
                        </h5>
                        <h6><p class="text-muted">@{{ followed._sUsername }}</p></h6>
                        <p class="text-muted">{{ followed._sDescription }}</p>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div class="col-md-2"></div>

        </div>
      </div>
    </template>
    
    <script setup>
    
    import { computed, onMounted, ref } from "vue";
    import HeaderComponent from "@/components/HeaderComponent.vue"
    import { useUserStore } from "@/store/UserStore";
    import axios from "axios";
    import moment from 'moment';
    import { useRoute } from "vue-router";
  
    const userStore = useUserStore();
    let route = useRoute();
    let bIsFetching = ref(true);
    let bFollowingActive = route.params.follow === "following" ? ref(true) : ref(false);
    let aFollowing = ref([]);
    let aFollowers = ref([]);

    onMounted(() => {
      axios.get("http://localhost:8000/api/getFollowing/" + route.params.username)
      .then(response => aFollowing.value = response.data)
      .catch(error => console.log(error));

      axios.get("http://localhost:8000/api/getFollowers/" + route.params.username)
      .then(response => aFollowers.value = response.data)
      .catch(error => console.log(error));
      bIsFetching.value = false;

      aFollowers.value.forEach(element => {
        console.log(element)
      });
    })


    function toggleFollowing() {
      bFollowingActive.value = true;
      route.params.follow = "following";
    }

    function toggleFollowers() {
      bFollowingActive.value = false;
      route.params.follow = "followers";
    }

    
    </script>
    
    <style>
    
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
  
    .avatar {
      border-radius: 50%;
      width: 50px;
      height: 50px;
    }
  
    .centered-image {
      display: block;
      margin-right: auto;
      margin-left: auto;
      width: 40%;
    }

    .wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .toggle-follow {
      margin: auto;
    }

    .trigger {
      background-color: transparent;
      border-color: transparent;
      font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      width: 100%;
      height: 100%;
    }

    .trigger:hover{
      background-color: aliceblue;
    }

    .actived {
      background-color: aliceblue;
      border-color: transparent;
      font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      font-weight: bold;
    }

    .user-data {
      border: solid 1px #ececec;
      padding: 20px;
    }

  
    .blackb {
      border: solid 2px black;
    }
    </style>
    