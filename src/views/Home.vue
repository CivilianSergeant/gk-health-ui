<template>
    <div>
      
      <ContentBar :PageTitle="title"/>
      <b-alert v-model="isSuccess" variant="success">{{message}}</b-alert>
      <b-alert v-model="isError" variant="danger">{{message}}</b-alert>
      <b-form @submit.prevent="onSearch">
        <div class="row">
           
          <div class="col-md-3">
           
              <b-form-group
                  id="input-group-patient-id"
                  label="Patient ID:"
                  label-for="patient-id"
                  description="Search By Patient ID"
              >
                  <b-form-input id="relation" 
                  placeholder="Patient ID"
                  v-model="pid"
                  ></b-form-input>
                  
              </b-form-group>
           
          </div>
          <div class="col-md-3 mt-4">
            <b-button type="submit" variant="info">Search</b-button> 
            <b-button @click="onClearSearch" class="ml-1" variant="warning">Clear</b-button> 
            <b-button v-if="notFound" class="ml-2" pill variant="success"> 
              <b-icon-plus-circle scale="1.25" class="t-bold"></b-icon-plus-circle></b-button>
          </div>
          <div class="col-md-6 text-secondary font-weight-bold">
            <b-card v-if="patient!=null">
            <b-card-title>Patient Info #{{patient.pid}}</b-card-title>
            <p> Patient Name: {{patient.fullName}} </p>
            <p> Card Registered?:  <Status :data="registration"/> </p>
            <p> IS GB?: <Status :data="isGb(patient.registrations)"/> </p>
            <p v-if="registration"> Start Date: {{getDate(registration.startDate)}} </p>
            <p v-if="registration"> Expire Date: {{getDate(registration.expiredDate)}}  </p>
            </b-card>
          </div>
        </div>
        <div class="row">
          <!-- <vue-typeahead-bootstrap :data="services"
          :serializer="input=>input.name" v-model="service.id"/> -->
          
          <div class="col-md-3">
            <b-form-group
                  id="input-group-patient-id"
                  label="Search Service:"
                  label-for="patient-id"
                  description="Search Service to add"
              >
          <Autocomplete @choose-item="handleAutocomplete" 
            :items="services" label="name" rowId="serviceId"
            :disabled="!patient"/>
             </b-form-group>
          </div>
          <div class="col-md-3 mt-4" v-if="service">
            <b-button @click="addPatientService" class="ml-2" pill variant="success"> 
              <b-icon-plus-circle scale="1.25" class="t-bold"></b-icon-plus-circle></b-button>
          </div>
         
        </div>
      </b-form>
      <table class="table table-bordered">
        <thead class="thead-light">
          <tr>
              <th>Sl</th>
              <th>Service Name</th>
              <th>Amount</th>
              <th>Discount</th>
              <th>Payable</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(ps,i) in patientServices" :key="i">
              <td>{{(i+1)}}</td>
              <td>({{ps.code}}) {{ps.name}}</td>
              <td>{{ps.currentCost}}</td>
              <td>{{ps.currentGbCost}}</td>
              <td>{{ps.currentGbCost}}</td>
          </tr>
        </tbody>
        <tfoot>
            <tr>
                <td colspan="4"></td>
                
                <td>{{totalPayable}}</td>
            </tr>
        </tfoot>
      </table>
      <div class="row mt-2 mb-2" v-if="patientServices.length>0">
          <div class="col-md-2 d-flex justify-content-between">
              <b-button type="submit" variant="success">Submit</b-button>
              <b-button type="reset" class="ml-4" variant="danger">Cancel</b-button>
          </div>
      </div>
            
    </div>
</template>

<script>
import {PatientService} from '@/services/PatientService'
import {HealthService} from '@/services/HealthService'

export default {
  name: 'Home',
  data(){
      return {
        title: "Patient Service",
        pid:'',
        patient:null,
        services:[],
        service:null,
        notFound:false,
        registration:null,
        patientServices:[],
        autocomplete:{},
        totalPayable:0
      }
  },

  computed: {
    
    isBusy(){
      return this.$store.state.isBusy;
    },
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
    
    this.fetchServices()
  },
  watch:{
    patientServices: function(patientServices){
      this.totalPayable=0;
      patientServices.map(r=>{
        if(this.registration.gb){
          this.totalPayable+= r.currentGbCost
        }else{
          this.totalPayable+= r.currentCost
        }
        
      });
    }
  },
  methods:{
    getDate(dateStr){
      return (new Date(dateStr)).toLocaleDateString()
    },
    addPatientService(){
      this.patientServices.push(this.service)
      this.service = null;
      this.autocomplete.setInputValue('')
    },

    handleAutocomplete(service,autocomplete){
      this.service = service;
      this.autocomplete = autocomplete;
    },
    onClearSearch(){
        this.patient=null;
        this.patientServices=[];
        this.registration=null;
        this.service=null;
    },
    onSearch(){
      this.patient=null;
      this.registration=null;
      this.patientServices =[];
      this.$store.commit('clearMessage')
      this.findPatient()
    },
    isGb(registrations){
      if(registrations!=null && registrations.length>0){
        registrations.map(r=>{
          if(r.active){
            this.registration = r;
          }
        })
        return (this.registration.gb)? true:false
      }
      return false
    },
    findPatient(){
      console.log(this.pid);
      (new PatientService()).getPatientByPid(this.pid).then(result=>{
        if(result!=null && result.status==200){
          this.patient = result.patient;
          this.notFound = false;
        }else{
          this.$store.commit('setErrorMsg',result.message)
          this.notFound = true;
        }
        
      })
    },
    fetchServices(){
      this.$store.commit('start');
      (new HealthService()).getServices().then(result=>{
        this.services=result; 
        this.$store.commit('finish');
        })
      .catch(error=> {
        this.$store.commit('finish');
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

<style>
.rounded-pill{border-radius: 60rem !important;}
</style>
