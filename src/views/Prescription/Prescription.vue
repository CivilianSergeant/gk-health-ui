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
            <!-- <b-button type="submit" variant="info">Search</b-button>  -->
            <b-button @click="onClearSearch" class="ml-1" variant="warning">Clear</b-button> 
            
          </div>
          <div class="col-md-12 text-secondary font-weight-bold">
            <Loader :isBusy="isBusy" />
            <b-card v-if="patient!=null">
              <div class="row">
              <div class="col-md-6">
            <b-card-title>Patient Info #{{patient.pid}}</b-card-title>
            <div v-if="patient.id>0"> <span>Patient Name: {{patient.fullName}}</span>
            <span v-if="patient.gender">, Sex: {{patient.gender}} </span></div>
            <div> IS GB?: <Status :data="patient.registration.gb"/> </div>
            <div> Card Registered?:  <Status :data="patient.registration && patient.registration.id"/> 
            
            </div>
            <span v-if="patient.registration && patient.registration.id">Card Number: {{patient.registration.cardNumber}}</span>
            <div v-if="patient.registration && patient.registration.members.length>0">
              Family Members
            <ul>
              <li v-for="(member,m) in form.cardRegistration.members" :key="m">{{member.fullName}}</li>
            </ul>
            </div>
            <p v-if="patient.registration && patient.registration.validityDuration>0"> Registration Valid for ({{patient.registration.validityDuration}}) Months From {{getDate(patient.registration.startDate)}} 
             - {{getDate(patient.registration.expiredDate)}}  </p>
             </div>
             <div class="col-md-6">
             <h5 class="mt-1">Invoice Detail</h5>
             <p>Invoice No: {{invoice.invoiceNumber}}</p>
             <ul class="nav">
                <li v-for="d in invoice.patientServiceDetails" :key="d.id">
                  <p>{{d.service.name}} - {{d.payableAmount}}</p>
                </li>
              </ul>
             </div>
             </div>
            </b-card>
          </div>
        </div>
        
      </b-form>
      <div class="row mt-1">
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
      <div class="row mt-1">
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
            <b-button  class="ml-2" pill variant="success"> 
              <b-icon-plus-circle scale="1.25" class="t-bold"></b-icon-plus-circle></b-button>
          </div>
         
        </div>
    </div>
</template>
<script>
import {PatientService,PatientInvoiceService, HealthService} from '@/services'

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
        attributes:[],
        invoice:{},
        serviceAutocomplete:null,
        invoiceAutocomplete:null,
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
  mounted(){
    //this.getAdminToken();
    this.fetchLabServices();
  },
  methods:{
      getAdminToken(){
        
        const details = {
            "grant_type":"password",
            "client_id":"admin-cli",
            "username":"admin",
            "password":"admin"
          };
        let formBody = [];
        for (const property in details) {
          const encodedKey = encodeURIComponent(property);
          const encodedValue = encodeURIComponent(details[property]);
          formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");

        fetch('http://103.26.136.30:8080/auth/realms/master/protocol/openid-connect/token',{
          method:'POST',
          
          headers:new Headers({
            'Content-Type': 'application/x-www-form-urlencoded'
          }),
          body:formBody
        }).then(res=> res.text()).then(r=>console.log(r));
      },
      getDate(dateStr){
        return (new Date(dateStr)).toLocaleDateString()
      },
      handleAutocomplete(service,autocomplete){
         this.service = service;
         this.serviceAutocomplete = autocomplete;
         this.fetchServiceAttribute()
      },
      handleInvoiceNumberAutocomplete(invoice,autocomplete){
         (new PatientInvoiceService()).getInvoiceById(invoice.id).then(result=>{
             this.invoice = result;
             this.patient = this.invoice.patient;
             console.log(result,this.invoice);
             this.invoiceAutocomplete = autocomplete;
         }) 
      },
      handleInvoiceNumberAjaxCall(searchText){
          if(searchText.length>=3){
              (new PatientInvoiceService()).getInvoiceNumbers(searchText).then(result=>{
                  this.invoices = result.collection;
                })
          }
      },
      onClearSearch(){
        this.patient=null;
        this.invoice=null;
        this.service=null;

        if(this.serviceAutocomplete.setInputValue!=undefined){
          this.serviceAutocomplete.setInputValue('');
        }

        if(this.invoiceAutocomplete.setInputValue!=undefined){
          this.invoiceAutocomplete.setInputValue('');
        }
        
    },
    fetchServiceAttribute(){
       (new HealthService()).findServicesById(this.service.serviceId).then(result=>{
            this.attributes=result;
            this.$store.commit('finish');
        });
    },
    fetchLabServices(){
      this.$store.commit('start');
      (new HealthService()).getLabServices().then(result=>{
        this.$store.commit('finish');
        this.tests = result;
      })
    },
    onSearch(){
      this.patient=null;
      
      this.$store.commit('clearMessage')
      //this.$store.commit('start');
      //this.findPatient()
    },
  }
}

</script>