<template>
    <div>
        <ContentBar :PageTitle="title"/>
        <b-alert v-model="isSuccess" variant="success">{{message}}</b-alert>
        <b-alert v-model="isError" variant="danger">{{message}}</b-alert>
        
        <h5>All Reports <router-link to="/lab-tests/add" class=" btn btn-primary btn-sm float-right">Create Lab Test Report</router-link></h5>
        <Loader :isBusy="isBusy"/>
    
    </div>
</template>

<script>
    export default {
        data(){
            return {
                title: "Lab Test Reports"
            }
        },
        computed: {
            isBusy() {
                return this.$store.state.isBusy;
            },
            isError() {
                return this.$store.state.isError;
            },
            isSuccess() {
                return this.$store.state.isSuccess;
            },
            message() {
                return this.$store.state.message;
            }
        },
    }
</script>