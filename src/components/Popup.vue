<template>
    <div class="popup">
        <div class="popup-inner">
            <slot />
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
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.2);
}
.popup-inner {
    min-width: 35vw;
    max-width: 75vw;
    min-height: 15vh;
    max-height: 75vh;
    flex-grow: 1;
    flex-basis: 50%;
    background: #FFF;
    padding: 32px;
}

</style>