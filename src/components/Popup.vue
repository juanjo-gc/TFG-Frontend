<template>
    <div class="popup">
        <div class="popup-inner">
            <slot />
            <!-- <button class="btn btn-outline-dark float-start popup-close">
                Cerrar
            </button> -->
        </div>
    </div>
</template>


<script setup>

</script>


<style scoped>

.popup {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 99;
    background-color: rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    .popup-inner {
        background: #FFF;
        padding: 32px;
    }
}

</style>