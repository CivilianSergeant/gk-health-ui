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
            <b-button  @click="gotoPatientCreateView" class="ml-2" pill variant="success"> 
              <b-icon-plus-circle scale="1.25" class="t-bold"></b-icon-plus-circle></b-button>
          </div>
          <div class="col-md-6 text-secondary font-weight-bold">
            <Loader :isBusy="isBusy" />
            <b-card v-if="patient!=null">
            <b-card-title>Patient Info #{{patient.pid}}</b-card-title>
            <p> Patient Name: {{patient.fullName}} </p>
            <p> IS GB?: <Status :data="form.cardRegistration.gb"/> </p>
            <p> Card Registered?:  <Status :data="form.cardRegistration.id"/> </p>
            <p v-if="!hasActiveCard">
                <b-button v-b-modal.modal-1 variant="info" size="sm">Register For Card</b-button>
            </p>
            <p v-if="registration.id"> Registration Date: {{getDate(registration.startDate)}} </p>
            <p v-if="registration.id"> Expire Date: {{getDate(registration.expiredDate)}}  </p>
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
              <th>Room No</th>
              <th>Amount</th>
              <th>Discount</th>
              <th>Payable</th>
              <th>Action</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(ps,i) in patientInvoice.patientServices" :key="i">
              <td>{{(i+1)}}</td>
              <td>({{ps.service.code}}) {{ps.service.name}}</td>
              <td><input type="text" v-model="ps.service.roomNumber"/></td>
              <td>{{ps.serviceAmount}}</td>
              <td>{{ps.discountAmount}}</td>
              <td>{{ps.payableAmount}}</td>
              <td>
                <div class="row">
                <div class="col-md-6"><b-form-file>Upload</b-form-file></div>
                <div class="col-md-6"><b-button>Download</b-button></div>
                </div>
              </td>
          </tr>
        </tbody>
        <tfoot>
            <tr>
                <td colspan="5"></td>
                
                <td>{{totalPayable}}</td>
                <td></td>
            </tr>
        </tfoot>
      </table>
      <div class="row mt-2 mb-2" v-if="patientInvoice.patientServices.length>0">
          <div class="col-md-2 d-flex justify-content-between">
              <b-button type="submit" variant="success">Submit</b-button>
              <b-button type="reset" class="ml-4" variant="danger">Cancel</b-button>
          </div>
      </div>
       <b-modal id="modal-1" size="lg" button-size="sm" bvModalEvent.trigger = 'ok' title="Card Register">
          <div class="col-md-4 d-flex flex-row"> IS GB?: &nbsp; <b-form-checkbox
              id="input-is-gb"
              class="ml-2"
              v-model="form.cardRegistration.gb"
              name="card-registration-gb"
              v-if="!form.cardRegistration.id"
              :value="true"
              :unchecked-value="false"
              ></b-form-checkbox> </div>

          <div class="col-md-4">
                          <b-form-group
                              id="input-group-validity"
                              label="Validity :"
                              label-for="validity"
                              description="Validity"
                          >
                              <b-form-select id="r-validity" v-model="form.cardRegistration.validityDuration" 
                              :options="validityDurations"></b-form-select>
                          </b-form-group>
                      </div>
         <div class="col-md-12 mt-3"><h6 class="clearfix">Members <b-button @click="addMember" class="float-right mb-2" size="sm" variant="info">Add Member</b-button></h6></div>
            
         <b-card class="clearBoth" v-for="(member,i) in form.cardRegistration.members" :key="i">
            <b-card-body >
              <div class="row ">
                  <div class="col-md-6 float-left">
                      <h6>Member #{{(i+1)}}</h6>
                  </div>
                  <div class="col-md-6">
                  <b-button @click="delMember(i)" class="float-right" size="sm" variant="danger"><b-icon-trash  ></b-icon-trash></b-button>
                  </div>
              </div>
              <div class="col-md-12 ">
                  <div class="row">
                      <div class="col-md-5">
                          <b-form-group
                              id="input-group-r-fullname"
                              label="Full Name:"
                              label-for="input-r-fullname"
                              description="full name"
                          >
                              <b-form-input
                                  id="input-r-fullname"
                                  v-model="member.fullName"
                                  type="text"
                                  placeholder="Full Name"
                                  required
                                  ></b-form-input>
                          </b-form-group>
                      </div>
                      <div class="col-md-2">
                          <b-form-group
                              id="input-group-r-age"
                              label="Age:"
                              label-for="r-age"
                              description="Age"
                          >
                              <b-form-input id="r-age" v-model="member.age"
                              placeholder="Age" type="number"
                              ></b-form-input>
                          </b-form-group>
                      </div>
                      <div class="col-md-4">
                          <b-form-group
                              id="input-group-r-gender"
                              label="Gender:"
                              label-for="gender"
                              description="Gender"
                          >
                              <b-form-select id="r-gender" v-model="member.gender" 
                              :options="genderOptions"></b-form-select>
                          </b-form-group>
                      </div>
                  </div>
              </div>
              <div class="col-md-12">
                <div class="row">
                    <div class="col-md-2">
                        <b-form-group
                            id="input-group-r-blood-group"
                            label="Blood Group"
                            label-for="r-blood-group"
                            description="Blood Group"
                        >
                        <b-form-select id="r-blood-group" v-model="member.bloodGroup" 
                              :options="bloodGroups"></b-form-select>
                            
                        </b-form-group>
                    </div>
                    <div class="col-md-3">
                        <b-form-group
                            id="input-group-r-nationality"
                            label="Nationality:"
                            label-for="nationality"
                            description="Nationality"
                        >
                            <b-form-input id="r-nationality" v-model="member.nationality"
                            placeholder="Nationality"
                            ></b-form-input>
                        </b-form-group>
                    </div>
                    <div class="col-md-3">
                        <b-form-group
                            id="input-group-r-nationalId"
                            label="National ID:"
                            label-for="nationalId"
                            description="National ID"
                        >
                            <b-form-input id="r-nationalId" v-model="member.nationalId"
                            placeholder="National ID"
                            ></b-form-input>
                        </b-form-group>
                    </div>
                    <div class="col-md-3">
                        <b-form-group
                            id="input-group-relation"
                            label="Relation:"
                            label-for="relation"
                            description="Relation with Patient"
                        >
                            <b-form-input id="relation" v-model="member.relationWithPatient"
                            placeholder="Relation"
                            ></b-form-input>
                        </b-form-group>
                    </div>
                </div>  
            </div>
            </b-card-body>
         </b-card>
         <template #modal-footer="{ ok, cancel }">
          
          <!-- Emulate built in modal footer ok and cancel button actions -->
          <b-button size="sm" variant="success" @click="handleOk">
            OK
          </b-button>
          <b-button size="sm" variant="danger" @click="cancel()">
            Cancel
          </b-button>
          
        </template>
        </b-modal>     
    </div>
</template>

<script>
import {PatientService} from '@/services/PatientService'
import {LocalStorageService} from '@/services/LocalStorageService'
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
        patientInvoice:{
          patientServices:[]
        },
        form:{
          
          cardRegistration:{members:[],gb:false,startDate:'',expiredDate:'',validityDuration:0}
        },
        bloodGroups:[
            {value:null, text:'Select'},
            {value:'O(ve)', text:'O(ve)'},
            {value:'O(-ve)', text:'O(-ve)'},
            {value:'A(ve)', text:'A(ve)'},
            {value:'A(-ve)', text:'A(-ve)'},
            {value:'B(ve)', text:'B(ve)'},
            {value:'B(-ve)', text:'B(-ve)'},
            {value:'AB(ve)', text:'AB(ve)'},
            {value:'AB(-ve)', text:'AB(-ve)'}
        ],
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
        validityDurations:[
          {value:6,text:'6 Months'},
          {value:12,text:'12 Months'}
        ],
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
    },
    hasActiveCard(){
      
      let status=false;
      
      this.patient.registrations.map(r=>{
        if(r.active){
          status = true;
        }
      });
      
      return status;
    }
  },
  beforeMount(){
    
    this.fetchServices()
  },
  watch:{
    patientInvoice: {
      handler(patientInvoice){
      this.totalPayable=0;
      
      patientInvoice.patientServices.map(r=>{
        // if(this.registration.gb){
        //   this.totalPayable+= r.currentGbCost
        // }else{
        //   this.totalPayable+= r.currentCost
        // }
        this.totalPayable+= r.payableAmount;
      });
      },
      deep:true
    }
  },
  created(){
    console.log(this.$route);
    this.pid = this.$route.params.pid;
    if(this.pid != undefined && this.pid != null){
      this.onSearch();
    }
  },
  methods:{
    handleOk(){
      
      let service = {};
      this.services.map(s=>{
        if(s.code.match('card registration')){
          service = s;
        }
      });
      const serviceAmount = service.currentCost;
      const discountAmount = (this.registration.gb)? (service.currentCost-service.currentGbCost) : 0;
      this.patientInvoice.patientServices.push({
        service,
        serviceAmount:serviceAmount,
        discountAmount:discountAmount,
        payableAmount:(serviceAmount-discountAmount),
      });
      this.registration = this.form.cardRegistration;
      this.patient.registrations.push(this.form.cardRegistration)
      this.$bvModal.hide('modal-1')
      console.log('hiiere')
    },
    addMember(){
        this.form.cardRegistration.members.push({
            fullName:'',age:'',gender:null,bloodGroup:null,nationality:'',nationalId:'',relationWithPatient:''
            })
    },
    delMember(i){
        this.form.cardRegistration.members.splice(i,1);
    },
    gotoPatientCreateView(){
      this.$router.push({name:'patient-create',params:{referrer:"Home"}});
      (new LocalStorageService()).set('referrer','Home');
    },
    getDate(dateStr){
      return (new Date(dateStr)).toLocaleDateString()
    },
    addPatientService(){
      const serviceAmount = this.service.currentCost;
      const discountAmount = (this.registration.gb)? (this.service.currentCost-this.service.currentGbCost) : 0;
      this.patientInvoice.patientServices.push({
        serviceAmount:serviceAmount,
        discountAmount:discountAmount,
        payableAmount:(serviceAmount-discountAmount),
        service:this.service
      });
      this.service = null;
      this.autocomplete.setInputValue('')
    },

    handleAutocomplete(service,autocomplete){
      this.service = service;
      this.autocomplete = autocomplete;
    },
    onClearSearch(){
        this.patient=null;
        this.patientInvoice.patientServices=[];
        this.registration=null;
        this.service=null;
        if(this.autocomplete.setInputValue!=undefined){
          this.autocomplete.setInputValue('');
        }
        this.pid="";
    },
    register(){
      this.registration.patient = {id:this.patient.id};
      (new PatientService()).cardRegistration(this.registration).then(result=>{
        if(result.status==200){
          this.onSearch();
        }else{
          this.$store.commit('setErrorMsg',result.message);
        }
      });
      console.log(this.registration);
    },
    onSearch(){
      this.patient=null;
      this.registration=null;
      this.patientServices =[];
      this.$store.commit('clearMessage')
      this.$store.commit('start');
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
        this.$store.commit('finish');
        if(result!=null && result.status==200){
          this.patient = result.patient;
          if(this.patient.registrations.length==0){
            this.registration = {gb:false,patient:{id:null}};
          }
          // if(this.patient.patientInvoices.length>0){
            this.patientInvoice = {patientServices:[]}//this.patient.patientInvoices[this.patient.patientInvoices.length-1];
          // }
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
