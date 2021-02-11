<template>
    <div>
        <ContentBar :PageTitle="title"/>
        <b-form @submit="onSubmit" @reset="onReset">
            <div class="row">
            <div class="col-md-3">
                <b-form-group
                    id="input-group-1"
                    label="Full Name:"
                    label-for="input-1"
                    description="Patient's full name"
                >
                    <b-form-input
                        id="input-1"
                        v-model="form.email"
                        type="text"
                        placeholder="Full Name"
                        required
                        ></b-form-input>
                </b-form-group>
            </div>
            <div class="col-md-3">
                <b-form-group
                    id="input-group-2"
                    label="Guardian Name:"
                    label-for="input-2"
                    description="Patient's Guardian name"
                >
                    <b-form-input
                        id="input-2"
                        v-model="form.guardianName"
                        type="text"
                        placeholder="Guardian Name"
                        required
                        ></b-form-input>
                </b-form-group>
            </div>
            <div class="col-md-3">
                <b-form-group
                    id="input-group-3"
                    label="Mother Name:"
                    label-for="input-3"
                    description="Patient's Mother name"
                >
                    <b-form-input
                        id="input-3"
                        v-model="form.motherName"
                        type="text"
                        placeholder="Mother Name"
                        required
                        ></b-form-input>
                </b-form-group>
            </div>
            </div>
        </b-form>
    </div>
</template>

<script lang="ts">
import ContentBar from '@/components/ContentBar.vue'
export default {
    name: 'Patients',
    data(){
      return {
        title: "Add Patient",
        isBusy: false,
        form:{
            email:''
        }
      }
    },
    components: {
        ContentBar
    },
    methods:{
        onSubmit(){
            console.log('')
        },
        onReset(){
            console.log('')
        }
    }
}
</script>

