<template>
  <SidebarFinal></SidebarFinal>



  
  <!-- <swiper
  :slides-per-view="1"
  :space-between="0"
  @swiper="onSwiper"
  @slideChange="onSlideChange"
  @clickable="true"
  >
    <swiper-slide v-for="photo in aPhotos"><img :src="photo" alt=""></swiper-slide>

  </swiper> -->

  <!-- <swiper
    :modules="modules"
    :slides-per-view="3"
    :space-between="50"
    navigation
    :pagination="{ clickable: true }"
    :scrollbar="{ draggable: true }"
    @swiper="onSwiper"
    @slideChange="onSlideChange"
  >
  <swiper-slide v-for="photo in aPhotos"><img :src="photo" alt=""></swiper-slide>
  

  </swiper> -->
<div class="main">
  <div class="row">
    <div class="col mt-2">
      <p class="lead fw-normal px-3 pt-3">Fotos de {{ person._sName }}</p>
    </div>
  </div>
  <div class="background blackb">

    <div class="centered">
      
      <Swiper :modules="[Navigation, Pagination, Scrollbar, A11y, Autoplay]" 
      :slides-per-view="1"
      :space-between="700"
      :centered-slides="true"
      :loop="true"
      :pagination="{clickable: true}"
      :autoplay="{
        delay: 7000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
    }"        
          :navigation="{enabled: true}"
          >
          <SwiperSlide v-for="photo in aPhotos">
            <div class="centered">
              <img :src="photo" alt="">
            </div>
          </SwiperSlide>
        </Swiper>
        
        
      </div>
    </div>
  </div>
    
  </template>

<script setup>
import SidebarFinal from '@/components/SidebarFinal.vue'
import axios from "axios";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
;

import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

const onSwiper = (swiper) => {
        console.log(swiper);
      };
const onSlideChange = () => {
      console.log('slide change');
      };



const route = useRoute();
let person = ref(0);
const aPhotos = ref([]);
const aImages = ref([]);


const carousel4 = ref(0);


onMounted(async () => {
  const response = await axios.get(
    "http://localhost:8000/api/getUserFromUsername/" + route.params.username
  );
  person.value = response.data;
  person.value._setUserImages.forEach((userImage) => {
    // aPhotos.push({
    //     src: "http://localhost:8000/api/getImage/" + userImage._sName,
    //     alt: "image",
    // })
    aPhotos.value.push("http://localhost:8000/api/getImage/" + userImage._sName);
    aImages.value.push({
      src: "http://localhost:8000/api/getImage/" + userImage._sName,
      alt: '...'
    })
  });
});


</script>

<style scoped>
.blackb {
  border: solid 1px black;
}

.main {
  width: 100%;
  height: 100%;
  position: absolute;
  max-width: 100%0;
  overflow-x: hidden;
}

.centered {
  margin: 0;
  position: absolute;
  top: 50%;
  left:50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}

.background {
  background-color: black;
  width: 100%;
}


.swiper {
  width: 1000px;
  height: 600px;
  overflow: visible;
}

.swiper-slide {
  /* display: flex;
  justify-content: center; */
  width: 80%;
}

/* .swiper-slide img[height*="100%"] {
  width: auto;
  height: 100%;
  object-fit: cover;
  max-height: 600px;
}

.swiper-slide img[width*="100%"] {
  width: 100%;
  height: auto;
  object-fit: cover;
  max-height: 600px;

} */

.swiper-slide img {
  width: auto;
  height: 100%;
  object-fit: scale-down;
  max-height: 600px;
}

</style>
