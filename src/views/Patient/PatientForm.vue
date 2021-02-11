<template>
  <div>
    <ContentBar :PageTitle="title"/>
    <b-alert v-model="isError" variant="danger">{{errorMsg}}</b-alert>
    <h5>Add Patient <router-link to="/patients" class=" btn btn-primary btn-sm float-right">Patient List</router-link></h5>
    <b-form @submit.prevent="onSubmit" @reset.prevent="onReset">
            <div class="row">
                <div class="col-md-3">
                    <b-form-group
                        
                        id="input-group-0"
                        label="Center:"
                        label-for="centers"
                        description="Select Center"
                    >
                        <b-form-select :disabled="isError" id="centers" v-model="form.center.id"
                         :options="centers"></b-form-select>
                    </b-form-group>
                </div>
            </div>
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
                            v-model="form.fullName"
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

            <div class="row">
                <div class="col-md-3">
                    <b-form-group
                        id="input-group-4"
                        label="Gender:"
                        label-for="gender"
                        description="Patient's Gender"
                    >
                        <b-form-select id="gender" v-model="form.gender" 
                        :options="genderOptions"></b-form-select>
                    </b-form-group>
                </div>
                <div class="col-md-3">
                    <b-form-group
                        id="input-group-6"
                        label="Marital Status:"
                        label-for="marital-status"
                        description="Patient's Marital Status"
                    >
                        <b-form-select id="marital-status" v-model="form.maritalStatus"
                         :options="maritalStatusOptions"></b-form-select>
                    </b-form-group>
                </div>
                <div class="col-md-4">
                    <b-form-group
                        id="input-group-6"
                        label="Date Of Birth:"
                        label-for="patient-datepicker"
                        description="Patient's Date of Birth"
                    >
                        <b-form-datepicker id="patient-datepicker" v-model="form.dateOfBirth" class="mt-2"></b-form-datepicker>
                    </b-form-group>
                </div>
            </div>

            <div class="row">
                <div class="col-md-3">
                    <b-form-group
                        id="input-group-7"
                        label="Village"
                        label-for="vilage"
                        description="Patient's address"
                    >
                        <b-form-input id="village" v-model="form.village"  
                            type="text"
                            placeholder="Mother Name"
                        ></b-form-input>
                    </b-form-group>
                </div>
                <div class="col-md-3">
                    <b-form-group
                        id="input-group-8"
                        label="Mobile Number:"
                        label-for="mobileNumber"
                        description="Patient's Mobile No"
                    >
                        <b-form-input id="mobileNumber" v-model="form.mobileNumber"
                         ></b-form-input>
                    </b-form-group>
                </div>
                
            </div>
            <div class="row">
                <div class="col-md-2 d-flex justify-content-between">
                    <b-button type="submit" variant="success">Success</b-button>
                    <b-button type="reset" class="ml-4" variant="danger">Cancel</b-button>
                </div>
            </div>
        </b-form>
  </div>
</template>

<script>

import { CenterService } from '@/services/CenterService'

export default {
  name: 'Patients',
 
  data(){
      return {
        title: "Patients",
        isBusy: false,
        errorMsg:'',
        isError: false,
        centers: [],
        genderOptions: [
          { value: null, text: 'Please Select Gender' },
          { value: 'Male', text: 'Male' },
          { value: 'Female', text: 'Female' }
        ],
        maritalStatusOptions: [
          { value: null, text: 'Please Select Marital Status' },
          { value: 'Single', text: 'Single' },
          { value: 'Married', text: 'Married' },
          { value: 'Divorced', text: 'Married' },
          { value: 'Widow', text: 'Widow' },
          
        ],
        form:{
            center:{id:null},
            apiVillageId:null,
            fullName:'',
            dateOfBirth:'',
            guardianName:'',
            motherName:'',
            gender:null,
            maritalStatus:null,
            village:'',
            mobileNumber:'',
            cardRegistration:{
                active:true,
                gb:false,
                members:[]
            },
            createdBy:{
                id:1,
                apiEmployeeId:124
            }
        }
        
      }
  },

 
  beforeMount(){
    this.fetchCenters();
  },
  methods:{
    onSubmit(){
        console.log(this.form)
    },
    onReset(){
        this.$router.push('/patients')
        console.log('')
    },
    fetchCenters(){

      this.isBusy=true;
      (new CenterService()).getCenters().then(result=> {
          this.centers.push({value:null,text:'Select Center'});
          result.map(center=>this.centers.push({value:center.id,text:center.name})); 
          this.isBusy=false;})
      .catch(error=>{
        this.isError=true;
        this.isBusy=false;
        if(error.toString().match('Error: Network Error') !=null){
          this.errorMsg = 'Opps! Network Error, Please try again later'
        }else if(error.toString.length>0){
          this.errorMsg = error;
        }
      });

    }
  }
}
</script>