<template>
    <div class="container" :class="{'show': showSidebar}">
      <div class="control">
        <i class="fas fa-xmark" @click="showNav"></i>
        <font-awesome-icon icon="fa-solid fa-xmark" class="float-start mt-3" @click="showNav"></font-awesome-icon>

      </div>
      <!-- <div class="navigation-icons">
        <font-awesome-icon icon="fa-solid fa-arrow-up" class="float-start mt-3"></font-awesome-icon>
        <font-awesome-icon icon="fa-solid fa-arrow-up" class="float-start mt-3"></font-awesome-icon>
        <font-awesome-icon icon="fa-solid fa-arrow-up" class="float-start mt-3"></font-awesome-icon>
        <font-awesome-icon icon="fa-solid fa-arrow-up" class="float-start mt-3"></font-awesome-icon>

      </div>
      <div class="navigation-links">
        <transition-group name="fade">
          <div v-show="showLink" key="1">Home</div>
          <div v-show="showLink" key="2">Portfolio</div>
          <div v-show="showLink" key="3">About Me</div>
          <div v-show="showLink" key="4">Contact</div>
          <div v-show="showLink" key="5">FAQ</div>
        </transition-group>
      </div> -->
      <div class="navigation-links">
        <div class="row blackb" v-show="showLink">

          <div class="col-sm-1">
            <font-awesome-icon icon="fa-solid fa-arrow-up" class="float-start mt-3"></font-awesome-icon>
          </div>
          <div class="col-sm-8">
            <p class="small">hola buenas</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>

import { ref, reactive } from 'vue'

const showSidebar = ref(false)
const showLink = ref(false)

const showNav = () => {
  if (showSidebar.value) {
    showLink.value = false
    setTimeout(() => {
      showSidebar.value = false
    }, 500)
  } else {
    showSidebar.value = true
    setTimeout(() => {
      showLink.value = true
    }, 500)
  }
}

    // export default {
    //   data: () => {
    //     return {
    //       showSidebar: false,
    //       showLink: false
    //     }
    //   },
    //   methods: {
    //     showNav() {
    //       if(this.showSidebar) {
    //         this.showLink = false;
    //         setTimeout(() => {
    //           this.showSidebar = false;
    //         }, 500);
    //       }
    //       else {
    //         this.showSidebar = true;
    //         setTimeout(() => {
    //           this.showLink = true;
    //         }, 500);
    //       }
    //     }
    //   }
    // }
  </script>
  
  <style scoped>

  .blackb {
    border: solid 3px black;
  }

  .small{
    font-size: 0.7em;
  }
    .container {
      position: absolute;
      top: 0;
      left: 0;
      width: 50px;
      padding: 10px;
      min-height: calc(100vh - 20px);
      background-color: rgb(0, 0, 140);
      border: solid #fff;
      border-width: 0 1px 0 0;
      z-index: 999;
      transition: all .5s ease-in-out;
  
      .control {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 50px;
        margin-bottom: 10px;
  
        i {
          font-size: 2rem;
          cursor: pointer;
          transition: all .5s ease-in-out;
        }
      }
  
      &.show {
        width: 180px;
  
        .control > i {
          color: #fff;
          transform: rotateZ(-180deg);
        }
  
        .navigation-icons {
          color: #fff;
        }
      }
  
      .navigation-icons {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        width: 50px;
        float: left;
  
        i {
          font-size: 2rem;
          padding: 10px 0;
          cursor: pointer;
          transition: all .5s ease-in-out;
  
          &:hover {
            color: #fff;
          }
        }
      }
  
      .navigation-links {
        padding-top: 14px;
        float: left;
        color: white;
  
        div {
          font-size: 1.35rem;
          padding-left: 10px;
          margin-bottom: 18px;
          cursor: pointer;
  
          &:hover {
            color: #fff;
          }
        }
      }
    }

    .fade-enter, .fade-leave-to {
      transform: scale(0);
    }
  </style>