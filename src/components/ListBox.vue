<template>
    <div class="mt-4 ms-4 list-box ps-4 pt-2 pb-2" ref="categoryListBox">
        <ul class="list-unstyled">
            <li>
                <div class="row mt-2">
                    <div class="col-sm-2">
                        <p class="fw-bold">Id</p>
                    </div>
                    <div class="col-sm-9">
                        <p class="fw-bold">{{ sDisplayKey }}</p>
                    </div>
                </div>
            </li>
            <slot />
        </ul>
    </div>
</template>

<script setup>

const props = defineProps(['displayKey']);

let sDisplayKey = props.displayKey;

</script>


<style scoped>

.list-box {
    border: solid 1px black;
    max-height: 350px;
    max-width: 450px;
    height: 350px;
    width: 450px;
    overflow-y: scroll;
    overflow-x: hidden;
    scrollbar-width: thin;
}

</style>