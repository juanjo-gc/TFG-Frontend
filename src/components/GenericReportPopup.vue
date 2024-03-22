<template>
<Popup>
    <div class="row">
        <div class="col-md-1"></div>
        <div class="col-md-10">
            <h4 class="mt-2 text-center">La denuncia se ha enviado correctamente</h4>
        </div>
        <div class="col-md-1">
            <font-awesome-icon icon="fa-solid fa-xmark" class="clickable" size="xl" @click="$emit('close')" />
        </div>
    </div>
    <div class="row mt-2">
        <div class="col-md-4"></div>
        <div class="col-md-4">
            <button type="button" class="btn btn-primary w-100" @click="router.push('/help/myTickets')">
                Ver mis tickets
            </button>
        </div>
    </div>
</Popup>
</template>
    


<script setup>
import Popup from './Popup.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
</script>

<style scoped>
.clickable:hover {
    cursor: pointer;
}
</style>