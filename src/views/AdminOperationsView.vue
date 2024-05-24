<template>
    <SidebarFinal></SidebarFinal>
    <div class="container">
        <h4 class="mt-4">Operaciones</h4>
        <div class="row mt-4 border p-2">
            <div class="col-md-2">
                <p class="fw-bold mt-2">Administrador</p>
            </div>
            <div class="col-md-2">
                <p class="fw-bold mt-2">Fecha y hora</p>
            </div>
            <div class="col-md-8">
                <p class="fw-bold mt-2">Operación</p>
            </div>
        </div>
        <div class="row border p-1" v-for="operation in aOperations">
            <div class="col-md-2">
                <p class="fw-light">{{ operation._admin._sUsername }}</p>
            </div>
            <div class="col-md-2">
                <p class="fw-light">{{ moment(operation._tTimestamp).format("DD/MM/YYYY, h:mm:ss") }}</p>
            </div>
            <div class="col-md-8">
                <p class="fw-light">{{ operation._sInformation }}</p>
            </div>
        </div>
    </div>
</template>
    

<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import moment from 'moment';
import SidebarFinal from '@/components/SidebarFinal.vue';
import { useUserStore } from '@/store/UserStore';

const userStore = useUserStore();


let aOperations = ref([]);
let iPageNumber = 0;
let iTotalPages = -1;

onMounted(() => {
    getOperations();
})



function getOperations() {
    axios.get(userStore.baseAPIurl + "getOperations/" + iPageNumber)
        .then(response => {
            aOperations.value = aOperations.value.concat(response.data.content).sort((o1, o2) => {
                if (o1._tCelebratedAt < o2._tCelebratedAt)
                    return 1;
                else if (o1._tCelebratedAt > o2._tCelebratedAt)
                    return -1;
                else
                    return 0;
            });;
            iTotalPages = response.data.totalPages;
        })
}

window.onscroll = () => {
    if (document.documentElement.scrollTop + window.innerHeight === document.documentElement.offsetHeight) {
        iPageNumber++;
        if (iPageNumber < iTotalPages)
            getOperations();
    }
}

</script>




<style scoped></style>

