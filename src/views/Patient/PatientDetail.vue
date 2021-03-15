<template>
  <div>
    <ContentBar :PageTitle="title"/>
    <b-alert v-model="isError" variant="danger">{{message}}</b-alert>
    <h5>Patient Info #{{form.pid}}
        <router-link to="/patients" class=" btn btn-primary btn-sm float-right ml-2">Patient List</router-link>
        <router-link :to="'/patients/'+id+'/edit'" class=" btn btn-primary btn-sm float-right">Patient Edit</router-link>
    </h5>
    <div>
            <div class="row">
                <div class="col-md-3">
                    <b-form-group
                        
                        id="input-group-0"
                        label="Center:"
                        label-for="centers"
                        
                    >
                        <strong class="text-secondary">{{(form.center!=null && form.center.name)?form.center.name:'N/A'}}</strong>
                    </b-form-group>
                </div>
            </div>
            <div class="row">
                <div class="col-md-3">
                    <b-form-group
                        id="input-group-1"
                        label="Full Name:"
                        label-for="input-1"
                    >
                        <strong class="text-secondary"  >{{(form.fullName)?form.fullName:'N/A'}}</strong>
                    </b-form-group>
                </div>
                <div class="col-md-3">
                    <b-form-group
                        id="input-group-2"
                        label="Guardian Name:"
                        label-for="input-2"
                    >
                        <strong class="text-secondary" >{{(form.guardianName)?form.guardianName:'N/A'}}</strong>
                    </b-form-group>
                </div>
                <div class="col-md-3">
                    <b-form-group
                        id="input-group-3"
                        label="Mother Name:"
                        label-for="input-3"
                    >
                        <strong class="text-secondary">{{(form.motherName)?form.motherName:'N/A'}}</strong>
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
                        <strong class="text-secondary">{{(form.gender)?form.gender:'N/A'}}</strong>
                    </b-form-group>
                </div>
                <div class="col-md-3">
                    <b-form-group
                        id="input-group-6"
                        label="Marital Status:"
                        label-for="marital-status"
                    >
                        <strong class="text-secondary">{{(form.maritalStatus)? form.maritalStatus:'N/A'}}</strong>
                    </b-form-group>
                </div>
                <div class="col-md-4">
                    <b-form-group
                        id="input-group-6"
                        label="Age:"
                        label-for="patient-age"
                    >
                        <strong class="text-secondary" >{{(form.age)?form.age:'N/A'}}</strong>
                    </b-form-group>
                </div>
            </div>

            <div class="row">
                <div class="col-md-6">
                    <b-form-group
                        id="input-group-7"
                        label="Village"
                        label-for="vilage"
                    >
                        <strong class="text-secondary" >{{(form.village)?form.village:'N/A'}}</strong>
                    </b-form-group>
                </div>
                <div class="col-md-3">
                    <b-form-group
                        id="input-group-8"
                        label="Mobile Number:"
                        label-for="mobileNumber"
                    >
                        <strong class="text-secondary">{{(form.mobileNumber)? form.mobileNumber:'N/A'}}</strong>
                    </b-form-group>
                </div>
                
            </div>
            <div class="row">
                <div class="col-md-2">
                    <b-form-group
                        id="input-group-9"
                        label="Blood Group"
                        label-for="bloodGroup"
                    >
                        <strong class="text-secondary">{{(form.detail)? form.detail.bloodGroup:'N/A'}}</strong>
                    </b-form-group>
                </div>
                <div class="col-md-3">
                    <b-form-group
                        id="input-group-10"
                        label="Nationality:"
                        label-for="nationality"
                    >
                        <strong class="text-secondary">{{(form.detail)? form.detail.nationality : 'N/A'}}</strong>
                    </b-form-group>
                </div>
                <div class="col-md-3">
                    <b-form-group
                        id="input-group-10"
                        label="National ID:"
                        label-for="nationalId"
                    >
                        <strong class="text-secondary">{{(form.detail)?form.detail.nationalId:'N/A'}}</strong>
                    </b-form-group>
                </div>
                <div class="col-md-3">
                    <b-form-group
                        id="input-group-10"
                        label="Occupation:"
                        label-for="occupation"
                    >
                        <strong class="text-secondary">{{(form.detail)? form.detail.occupation:'N/A'}}</strong>
                    </b-form-group>
                </div>
            </div>
            <hr/>
            <h5>Registrations <b-button class="float-right" v-if="form.registrations!=undefined && form.registrations.length==0">Registration</b-button></h5>
            <p v-if="(form.registrations != undefined && form.registrations.length==0)">This patient did not registered yet</p>
            <b-card class="col-md-4 px-0 py-0" v-for="card in form.registrations" :key="card.id">
                <b-card-title>
                    <h6>Card No: {{card.cardNumber}}</h6>
                </b-card-title>
                <b-card-body class="px-0 py-0">
                    <p> <span v-if="card.active" class="badge badge-success">Active</span>
                        <span v-if="!card.active" class="badge badge-danger">Inactive</span></p>
                    <p>IS GB: ({{(card.gb)? 'Yes':'No'}})</p>
                    <p>Card Members ({{card.members.length}})</p>
                    <p>Start Date: {{card.startDate}}</p>
                    <p>Expire Date: {{card.expiredDate}}</p>
                </b-card-body>
            </b-card>
            <br class="mb-3"/>
        </div>
  </div>
</template>

<script>

import { CenterService } from '@/services/CenterService'
import axios from 'axios';
import { GetApiRoute, ApiRoutes } from '@/helpers/ApiRoutes';

export default {
  name: 'PatientDetail',
 
  data(){
      return {
        cardRegistrationAccepted:false,
        title: "Patients",
        isBusy: false,
        centers: [],
        id: this.$route.params.id,
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
            detail:{bloodGroup:null,nationality:null,nationalId:null,occupation:null},
            cardRegistration:{
                active:true,
                gb:false,
                members:[]
            },
            createdBy:{
                id:1,
                apiEmployeeId:124
            }
        },
        
        
      }
  },

  computed:{
      
    isError(){
      return this.$store.state.isError;
    },
    isSuccess(){
      return this.$store.state.isSuccess;
    },
    message(){
      return this.$store.state.message;
    }
  },
  beforeMount(){
    this.$store.commit('clearMessage');
    this.fetchCenters();
    this.fetchPatient(this.$route.params.id);
  },
  methods:{
    async onSubmit(){
        
        const formRequest = Object.assign({},this.form);
         console.log(this.form);
         
        if((this.form.detail.bloodGroup == null || this.form.detail.bloodGroup == "") 
        && (this.form.detail.nationality == null || this.form.detail.nationality =="") && 
            (this.form.detail.nationalId == null || this.form.detail.nationalId == "") && 
            (this.form.detail.occupation ==null || this.form.detail.occupation =="")){
                console.log(this.form.detail.bloodGroup,2);
                formRequest.detail = null;
            }
        if(!this.cardRegistrationAccepted){
            formRequest.cardRegistration = null;
        }
        console.log(formRequest);
        // formRequest.dateOfBirth = formRequest.dateOfBirth+' 00:00:00';
        axios.defaults.headers.common = {
        "Access-Control-Allow-Origin": ApiRoutes.DOMAIN,
        'Access-Control-Allow-Methods' : 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
        };
        const response = await axios.post(GetApiRoute(ApiRoutes.ADD_PATIENT),formRequest);
        console.log(response)
        if(response.status==200){
            this.$store.commit('setSuccessMsg','New Patient profile Created');
            this.$router.push("/patients");
        }else{
            console.log(response);
        }
        
    },
    onReset(){
        this.$router.push('/patients')
        console.log('')
    },
    addMember(){
        this.form.cardRegistration.members.push({
            fullName:'',age:'',gender:'',bloodGroup:'',nationality:'',nationalId:'',relationWithPatient:''
            })
    },
    delMember(i){
        this.form.cardRegistration.members.splice(i,1);
    },
    async fetchPatient(id){
        const response = await axios.get(GetApiRoute(ApiRoutes.GET_PATIENT_BY_ID,id));
        if(response.status==200){
            this.form = response.data;
        }
        console.log(response);
    },
    fetchCenters(){

      this.isBusy=true;
      (new CenterService()).getCenters().then(result=> {
          this.centers.push({value:null,text:'Select Center'});
          result.map(center=>this.centers.push({value:center.id,text:center.name})); 
          this.isBusy=false;})
      .catch(error=>{
        this.isBusy=false;
        if(error.toString().match('Error: Network Error') !=null){
          this.$store.commit('setErrorMsg','Opps! Network Error, Please try again later');
        }else if(error.toString.length>0){
          this.$store.commit('setErrorMsg',error);
        }
      });

    }
  }
}
</script>

<style scoped>
.clearBoth{
    clear: both;
}
</style>
