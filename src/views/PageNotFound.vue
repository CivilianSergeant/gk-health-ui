<template>
    <div class="mt-5 d-flex flex-column align-items-center justify-content-center">
        <h1 class="text-danger">404</h1>
        <div><b-button @click="back">Back</b-button></div>
    </div>
</template>
<script>
export default {
    data(){
        return {

        };
    },
    methods:{
        back(){
            this.$router.back();
        }
    }
}
</script>