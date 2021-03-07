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
                  label="Invoice ID:"
                  label-for="invoice-id"
                  description="Search By Invoice ID"
              >
                  <!-- <b-form-input id="relation" 
                  placeholder="Invoice ID"
                  v-model="pid"
                  ></b-form-input> -->

                  <Autocomplete :ajax="true" @choose-item="handleInvoiceNumberAutocomplete" 
                    :items="invoices" label="invoiceNumber" rowId="id" @ajax-call="handleInvoiceNumberAjaxCall"
                    />
                  
              </b-form-group>
           
          </div>
          <div class="col-md-3 mt-4">
            <b-button type="submit" variant="info">Search</b-button> 
            <b-button @click="onClearSearch" class="ml-1" variant="warning">Clear</b-button> 
            
          </div>
          <div class="col-md-12 text-secondary font-weight-bold">
            <Loader :isBusy="isBusy" />
            <b-card v-if="patient!=null">
            <b-card-title>Patient Info #{{patient.pid}}</b-card-title>
            <div v-if="patient.id>0"> <span>Patient Name: {{patient.fullName}}</span>
            <span v-if="patient.gender">, Sex: {{patient.gender}} </span></div>
            <div> IS GB?: <Status :data="form.cardRegistration.gb"/> </div>
            <div> Card Registered?:  <Status :data="patient.registration && patient.registration.id"/> 
            
            </div>
            <span v-if="form.cardRegistration && form.cardRegistration.id">Card Number: {{form.cardRegistration.cardNumber}}</span>
            <div v-if="form.cardRegistration && form.cardRegistration.members.length>0">
              Family Members
            <ul>
              <li v-for="(member,m) in form.cardRegistration.members" :key="m">{{member.fullName}}</li>
            </ul>
            </div>
            <p v-if="form.cardRegistration && form.cardRegistration.validityDuration>0"> Registration Valid for ({{form.cardRegistration.validityDuration}}) Months From {{getDate(form.cardRegistration.startDate)}} 
             - {{getDate(form.cardRegistration.expiredDate)}}  </p>
             
            </b-card>
          </div>
        </div>
        
      </b-form>
      <div class="row">
            <div class="col-md-9">
            <b-form-group
                  id="input-group-advice"
                  label="Advice:"
                  label-for="advice"
                  description="Advice for patient"
              >
              <b-textarea/>
            </b-form-group>
            </div>
      </div>
      <div class="row">
            <div class="col-md-9">
            <b-form-group
                  id="input-group-observation"
                  label="Primary Observation:"
                  label-for="observation"
                  description="Observation of patient"
              >
              <b-textarea/>
            </b-form-group>
            </div>
      </div>
      <div class="row">
          <!-- <vue-typeahead-bootstrap :data="services"
          :serializer="input=>input.name" v-model="service.id"/> -->
          
          <div class="col-md-3">
            <b-form-group
                  id="input-group-patient-id"
                  label="Tests:"
                  label-for="test-id"
                  description="Select Test (optional)"
              >
                <Autocomplete @choose-item="handleAutocomplete" 
                    :items="tests" label="name" rowId="serviceId"
                    :disabled="!patient"/>
            </b-form-group>
          </div>
          <div class="col-md-3 mt-4" v-if="service">
            <b-button @click="addPatientService" class="ml-2" pill variant="success"> 
              <b-icon-plus-circle scale="1.25" class="t-bold"></b-icon-plus-circle></b-button>
          </div>
         
        </div>
    </div>
</template>
<script>
import {PatientService,PatientInvoiceService} from '@/services'

export default {
  name: 'Home',
  data(){
      return {
        title: "Prescription",
        notFound:false,
        pid:'',
        patient:null,
        tests:[],
        invoices:[],
        invoice:{},
        service:null,
        form:{ cardRegistration:{members:[],gb:false,startDate:'',expiredDate:'',validityDuration:0} }
      }
  },
  computed:{
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
    },
  },
  methods:{
      handleAutocomplete(service,autocomplete){
         this.service = service;
         this.autocomplete = autocomplete;
      },
      handleInvoiceNumberAutocomplete(invoice,autocomplete){
         (new PatientInvoiceService()).getInvoiceById(invoice.id).then(result=>{
             this.invoice = result;
         }) 
      },
      handleInvoiceNumberAjaxCall(searchText){
          if(searchText.length>=3){
              (new PatientInvoiceService()).getInvoiceNumbers(searchText).then(result=>{
                  this.invoices = result;
                })
          }
      },
      onClearSearch(){
            this.patient=null;
            this.patientInvoice.patientServiceDetails=[];
            this.registration=null;
            this.service=null;
            if(this.autocomplete.setInputValue!=undefined){
            this.autocomplete.setInputValue('');
            }
            this.pid="";
        },
      findPatient(){
      
        (new PatientService()).getPatientByPid(this.pid).then(result=>{
            this.$store.commit('finish');
            if(result!=null && result.status==200){
            this.patient = result.patient;
            // if((this.patient.registration == null) || (this.patient.registration && this.patient.registration.active == false)){
            //     this.form.cardRegistration = {members:[],gb:false,startDate:'',expiredDate:'',validityDuration:0};
            // }else{
            //     this.form.cardRegistration = this.patient.registration;
            // }
            
            //     this.patientInvoice = {id:null,discountAmount:0,payableAmount:0,paidAmount:0,serviceAmount:0,
            //     patientServiceDetails:[]}//this.patient.patientInvoices[this.patient.patientInvoices.length-1];
            
            this.notFound = false;
            }else{
            this.$store.commit('setErrorMsg',result.message)
            this.notFound = true;
            }
            
        }).catch(error=>{
            this.$store.commit('finish');
            if(error.toString().match('Error: Network Error') !=null){
            this.$store.commit('setErrorMsg','Opps! Network Error, Please try again later');
            }else if(error.toString.length>0){
            this.$store.commit('setErrorMsg',error);
            }
        });
    },
    onSearch(){
      this.patient=null;
      
      this.$store.commit('clearMessage')
      this.$store.commit('start');
      this.findPatient()
    },
  }
}

</script>