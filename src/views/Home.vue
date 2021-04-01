<template>
    <div>
      
      <ContentBar :PageTitle="title"/>
      <b-alert v-model="isSuccess" variant="success">{{message}}</b-alert>
      <b-alert v-model="isError" variant="danger">{{message}}</b-alert>
      <b-form @submit.prevent="onSearch">
        <div class="row">
          <div class="col-md-6"> 
            <div class="row">
            <div class="col-md-5">
            
                <b-form-group
                    id="input-group-patient-id"
                    label="Patient ID:"
                    label-for="patient-id"
                    description="Search By Patient ID"
                >
                    <!-- <b-form-input id="relation" 
                    placeholder="Patient ID"
                    v-model="pid"
                    required
                    ></b-form-input> -->

                    <Autocomplete
                      :ajax="true"
                      @choose-item="handlePatientSelect"
                      :items="patientNumbers"
                      label="pid"
                      rowId="id"
                      :disable="false"
                      @ajax-call="handlePatientAutocomplete"
                    />
                    
                </b-form-group>
                
            </div>
            <div class="col-md-7 mt-4">
              <b-button type="submit" variant="info">Search</b-button> 
              <b-button @click="onClearSearch" class="ml-1" variant="warning">Clear</b-button> 
              <b-button  @click="gotoPatientCreateView" class="ml-2" pill variant="success"> 
                <b-icon-plus-circle scale="1.25" class="t-bold"></b-icon-plus-circle></b-button>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
              <h6 v-if="consumer">Service For: {{consumer.fullName}} [{{consumer.pid}}]</h6>
              <div v-if="showReferredCard()">Referred Card Number: {{showReferredCard() }}</div>
              <div v-if="showReferredPatient()">Referred Patient: {{showReferredPatient() }}</div>
              <div v-if="showReferredCard()"> IS GB?: <Status :data="isGB()"/> </div>
            </div>
          </div>
          </div>
          <div class="col-md-6 text-secondary font-weight-bold">
            <Loader :isBusy="isBusy" />
            <b-card v-if="patient!=null">
            <b-card-title>Patient Info #{{patient.pid}}</b-card-title>
            <div v-if="patient.id>0"> <span>Patient Name: {{patient.fullName}}</span>
            <span v-if="patient.gender">, Sex: {{patient.gender}} </span>
            <span v-if="patient.age">, Age: {{patient.age}}</span>
            </div>
            <div> IS GB?: <Status :data="form.cardRegistration.gb"/> </div>
            <div> Card Registered?:  <Status :data="patient.registration && patient.registration.id"/> 
            
            </div>
            <span v-if="form.cardRegistration && form.cardRegistration.id">Card Number: {{form.cardRegistration.cardNumber}}</span>
            <div v-if="form.cardRegistration && form.cardRegistration.members.length>0">
              Family Members
            <ul>
              <li v-for="(member,m) in form.cardRegistration.members" :key="m">{{member.fullName}} <button class="btn btn-info btn-sm" type="button" @click="selectPatient(member,m)">{{member.patient? 'Select Patient': 'Create Patient'}}</button></li>
            </ul>
            </div>
            <p v-if="form.cardRegistration && form.cardRegistration.validityDuration>0"> Registration Valid for ({{form.cardRegistration.validityDuration}}) Months From {{getDate(form.cardRegistration.startDate)}} 
             - {{getDate(form.cardRegistration.expiredDate)}}  </p>
             <p v-if="!hasActiveCard" class="mt-2">
                <b-button v-b-modal.modal-1 variant="info" size="sm">Register For Card</b-button>
            </p>
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
              <!-- <th>Action</th> -->
          </tr>
        </thead>

        <tbody>
          <tr v-for="(ps,i) in patientInvoice.patientServiceDetails" :key="i">
              <td>{{(i+1)}}</td>
              <td>{{ps.service.name}}</td>
              <td><input type="text" v-model="ps.roomNumber"/></td>
              <td>{{ps.serviceAmount}}</td>
              <td>{{ps.discountAmount}}</td>
              <td>{{ps.payableAmount}}</td>
              <!-- <td>
                <div class="row">
                <div class="col-md-6"><b-form-file>Upload</b-form-file></div>
                <div class="col-md-6"><b-button>Download</b-button></div>
                </div>
              </td> -->
          </tr>
        </tbody>
        <tfoot>
            <tr>
                <td colspan="5" class="text-right">Grand Total</td>
                <td>{{totalPayable}}</td>
                <!-- <td></td> -->
            </tr>
            <tr>
                <td colspan="5" class="text-right">Total Paid</td>
                <td><b-form-input type="number" @input="changeTotalPaid" v-model="patientInvoice.paidAmount"></b-form-input></td>
                <!-- <td></td> -->
            </tr>
            <tr>
                <td colspan="5" class="text-right">Due Amount</td>
                <td><b-form-input type="number" v-model="patientInvoice.dueAmount" readonly="readonly"></b-form-input></td>
                <!-- <td></td> -->
            </tr>
        </tfoot>
      </table>
      <div class="row mt-2 mb-2" v-if="patientInvoice.patientServiceDetails.length>0">
          <div class="col-md-2 d-flex justify-content-between">
              <b-button type="button" @click="onSubmit" variant="success">Submit</b-button>
              <b-button type="reset" @click="onReset" class="ml-4" variant="danger">Cancel</b-button>
          </div>
      </div>  
          

      <h4>Service History</h4> 
      <b-card v-if="patient">
          <b-card-body v-for="(pi,i) in consumer.patientInvoices" :key="i">
            <h5>Invoice No # {{pi.invoiceNumber}} <a @click="showReport(i)" class="cursor-pointer btn btn-info btn-sm"><b-icon-printer></b-icon-printer> Print</a></h5>
            <h6>Date: {{getDate(pi.createdAt)}}</h6>
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
                <tr v-for="(ps,i) in pi.patientServiceDetails" :key="i">
                    <td>{{(i+1)}}</td>
                    <td>{{ps.service.name}}</td>
                    <td>{{ps.roomNumber}}</td>
                    <td>{{ps.serviceAmount}}</td>
                    <td>{{ps.discountAmount}}</td>
                    <td>{{ps.payableAmount}}</td>
                    <td><router-link  v-if="hasReportButton(ps.service)" :to="showReportButton(ps.service,consumer.id,pi.id)">Report</router-link></td>
                    
                </tr>
              </tbody>
            </table>
          </b-card-body>
          
          
      </b-card>
        
      
      
       <b-modal id="modal-1" size="lg" button-size="sm" bvModalEvent.trigger = 'ok' title="Card Register">
          <div class="col-md-4 d-flex flex-row"> IS GB?: &nbsp; <b-form-checkbox
              id="input-is-gb"
              class="ml-2"
              v-model="form.cardRegistration.gb"
              name="card-registration-gb"
              v-if="form.cardRegistration && !form.cardRegistration.id"
              :value="true"
              :unchecked-value="false"
              ></b-form-checkbox> </div>

          <div class="col-md-4 mt-2">
                          <b-form-group
                              id="input-group-validity"
                              label="Validity :"
                              label-for="validity"
                              description="Validity"
                          >
                              <b-form-select id="r-validity" @change="showDate" required v-model="form.cardRegistration.validityDuration" 
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
import { PatientInvoiceService } from '@/services';
import jspdf,{ jsPDF } from 'jspdf';

export default {
  name: 'Home',
 
  data(){
      return {
        title: "Patient Service",
        pid:'',
        patient:null,
        consumer:null,
        services:[],
        patientNumbers:[],
        service:null,
        notFound:false,
        registration:null,

        
        patientInvoice:{
          id:null,
          serviceAmount:0,
          payableAmount:0,
          discountAmount:0,
          paidAmount:0,
          dueAmount:0,
          patientServiceDetails:[]
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
        patientIdAutocomplete:{},
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
      
      // let status=false;
      
      return (this.patient.registration)? this.patient.registration.active : false;
      // this.patient.registrations.map(r=>{
      //   if(r.active){
      //     status = true;
      //   }
      // });
      
      // return status;
    }
  },
  beforeMount(){
    
    this.fetchServices()
  },
  watch:{
    patientInvoice: {
      handler(patientInvoice){
        this.totalPayable=0;
      
        patientInvoice.patientServiceDetails.map(r=>{
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
    showReport(i){
      const invoice = this.patient.patientInvoices[i];
      const pdf = new jsPDF({
        orientation:"portrait",
        format:"A4"
      });
      let x=80;
      let y=30;
      pdf.text("Money Receipt",x,y);
      pdf.line(x,y+1,120,y+1);

      x=15;
      y=y+20;
      pdf.setFontSize(11);
      pdf.text("Patient Reg.",x,y);
      pdf.text(": "+this.patient.pid,x+40,y);
      y=y+5;
      pdf.text("Patient Name",x,y);
      pdf.text(": "+this.patient.fullName,x+40,y);
      y=y+5;
      pdf.text("Patient Type",x+100,y-10);
      pdf.text(": "+this.showPatientType(),x+140,y-10);
      pdf.text("Date",x+100,y-5);

      pdf.text(": "+(new Date()).toLocaleString(),x+140,y-5);
      y=y+5;
      const headers = [
        'Sl# ',
        'Particulars',
        'Rate ',
        'Amount'
        
      ]
      let paidAmount = 0;
      const invoiceItems = []
         pdf.cell(x,y,20,10,"SL#",1,"center")
         pdf.cell(x,y,110,10,"Particulars",1,"center")
         pdf.cell(x,y,25,10,"Rate",1,"center")
         pdf.cell(x,y,25,10,"Amount",1,"right")
         y=y+5;
      invoice.patientServiceDetails.forEach((ps,i)=>{
         
         const index= (i<=1)? 2 : i+1; 
         pdf.cell(x,y,20,10,(i+1).toString(),index,"center")
         pdf.cell(x,y,110,10,ps.service.name.toString(),index,"center")
         pdf.cell(x,y,25,10,ps.payableAmount.toString(),index,"right")
         pdf.cell(x,y,25,10,ps.payableAmount.toString(),index,"right")
         y=y+5;
         paidAmount += ps.payableAmount;
      });
      
      pdf.text("Total : ",x+140,y+20);
      pdf.text(paidAmount.toString(), x+170,y+20);
      
      pdf.output("dataurlnewwindow");
    },
    showPatientType(){
      if(this.consumer.registration){
        if(this.consumer.registration.gb){
          return "CH-GB";
        }
        return "CH-NGB";
      }
      return "NCH";
    },
    showReferredCard(){
      if(this.consumer && this.consumer.cardMember){
        return this.consumer.cardMember.cardRegistration.cardNumber
      }
    },
    showReferredPatient(){
      if(this.consumer && this.consumer.cardMember){
        const patient = this.consumer.cardMember.cardRegistration.patient;
        return patient.fullName + " ["+patient.pid+"]";
      }
    },
    onReset(){
      this.patientInvoice.paidAmount=0;
       this.patientInvoice.patientServiceDetails = []; 
    },
    selectPatient(member,i){
      const formRequest = Object.assign({},member);
      
      if(!member.patient){
        formRequest.center = this.$store.getters.center
        formRequest.createdBy = this.$store.getters.employee
        formRequest.cardRegistration = {
          id:this.form.cardRegistration.id
        }
        formRequest.patient = {
          fullName:member.fullName,
          gender:member.gender,
          age:member.age,
          center: this.$store.getters.center,
          createdBy: this.$store.getters.employee
        }
        console.log(formRequest);
        (new PatientService()).addPatientFromCardMember(formRequest).then(_member=>{
          this.consumer = _member.patient;
          
          this.patient.registration.members[i] = _member;
        })
      }else{
        this.consumer = member.patient;
        console.log(this.consumer);
      }
    },
    handlePatientAutocomplete(searchText){
      // ajax call
      if (searchText.length >= 2) {
        new PatientService()
          .getPatientIdsByPid(searchText)
          .then(result => {
            this.patientNumbers = result.collection;
          });
      }
    },
    handlePatientSelect(obj,autocomplete,index,rowIndex){
      this.pid=obj.pid
      this.patientIdAutocomplete = autocomplete;
    },
    changeTotalPaid(val){
      this.patientInvoice.paidAmount = parseFloat(val);
      if(this.patientInvoice.paidAmount < this.patientInvoice.payableAmount){
        this.patientInvoice.dueAmount = (this.patientInvoice.payableAmount - this.patientInvoice.paidAmount)
      }else{
        this.patientInvoice.dueAmount=0;
      }

    },
    showDate(){
      const dateObj = new Date();
      const toDayDateObj = new Date();
      const expiredDate = new Date(dateObj.setMonth(dateObj.getMonth()+this.form.cardRegistration.validityDuration));
      this.form.cardRegistration.startDate = toDayDateObj.toISOString();
      this.form.cardRegistration.expiredDate = expiredDate.toISOString();
    },
    _updateInvoice(patientService){
          const serviceAmount = patientService.serviceAmount;
          const discountAmount = patientService.discountAmount;
          const payableAmount =  patientService.payableAmount;

          this.patientInvoice.serviceAmount += serviceAmount;
          this.patientInvoice.discountAmount += discountAmount;
          this.patientInvoice.payableAmount += payableAmount;
          this.patientInvoice.paidAmount = this.patientInvoice.payableAmount;
    },
    handleOk(){
      this.$store.commit('clearMessage');
      
      let service = {};
      this.services.map(s=>{
        if(s.code.match('card registration')){
          service = s;
        }
      });

      if(!this.isServiceAdded(service)){
        return;
      }

      const serviceAmount = service.currentCost;
      const discountAmount = (this.isGB())? (service.currentCost-service.currentGbCost) : 0;
      const payableAmount = (serviceAmount-discountAmount);

      const patientService = {
        service,
        serviceAmount:serviceAmount,
        discountAmount:discountAmount,
        payableAmount:payableAmount,
      };

      this.patientInvoice.patientServiceDetails.push(patientService);
      this._updateInvoice(patientService);
      
      this.patient.registration = this.form.cardRegistration;
      // this.patient.registrations.push(this.form.cardRegistration)
      this.$bvModal.hide('modal-1')
 
    },
    isServiceAdded(service,showMessage){
      let valid =true;
      this.patientInvoice.patientServiceDetails.map(ps=>{
        if(ps.service.code == service.code){
          valid = false;
        }
        return ps;
      })
      
      if(!valid){
        if(showMessage){
          this.$store.commit('setErrorMsg','Service ['+service.name+'] already added to the list');
        }
      
        this.$bvModal.hide('modal-1')
        return valid;
      }
      return valid;
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
      this.$store.commit('clearMessage');

      if(!this.isServiceAdded(this.service)){
        this.$store.commit('setErrorMsg','Service Already added');
        this.service = null;
        this.autocomplete.setInputValue('')
        return;
      }

      
      const serviceAmount = this.service.currentCost;
      const discountAmount = (this.isGB())? (this.service.currentCost-this.service.currentGbCost) : 0;
      const payableAmount = (serviceAmount-discountAmount);
      const patientService = {
        serviceAmount,
        discountAmount,
        payableAmount,
        service:this.service,
        roomNumber:0
      };

      this.patientInvoice.patientServiceDetails.push(patientService);
      this._updateInvoice(patientService);

      this.service = null;
      this.autocomplete.setInputValue('')
    },

    handleAutocomplete(service,autocomplete){
      this.service = service;
      this.autocomplete = autocomplete;
    },
    onClearSearch(){
        this.patient=null;
        this.patientInvoice.patientServiceDetails=[];
        this.registration=null;
        this.service=null;
        this.consumer = null;
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
      
    },
    onSearch(){
      this.patient=null;
      this.registration=null;
      this.patientServiceDetails =[];
      this.$store.commit('clearMessage')
      this.$store.commit('start');
      this.findPatient()
    },
    isGB(){
      if(this.form.registration != null){
        return this.form.cardRegistration.gb;
      }
      if(this.consumer.cardMember!=null){
        return this.consumer.cardMember.cardRegistration.gb;
      }

      return false;
    },
    
    findPatient(){
      
      (new PatientService()).getPatientByPid(this.pid).then(result=>{
        this.$store.commit('finish');
        if(result!=null && result.status==200){
          this.patient = result.patient;
          this.consumer = this.patient;
          if((this.patient.registration == null) || (this.patient.registration && this.patient.registration.active == false)){
            this.form.cardRegistration = {members:[],gb:false,startDate:'',expiredDate:'',validityDuration:0};
          }else{
            this.form.cardRegistration = this.patient.registration;
          }
          
            this.patientInvoice = {id:null,discountAmount:0,payableAmount:0,paidAmount:0,serviceAmount:0,
              patientServiceDetails:[]}//this.patient.patientInvoices[this.patient.patientInvoices.length-1];
          
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
    },

    onSubmit(){
        this.$store.commit('start');
        this.consumer.patientInvoices.unshift(this.patientInvoice);
        this.consumer.center = this.$store.getters.center;
        this.consumer.createdBy = this.$store.getters.employee;
        (new PatientInvoiceService()).saveInvoice(this.consumer).then(result=>{
            if(result.status == 200){
              this.consumer = result.object;
              this.patientInvoice = {id:null,discountAmount:0,payableAmount:0,paidAmount:0,serviceAmount:0,
              patientServiceDetails:[]}
              this.$store.commit('setSuccessMsg','Service Purchased Successfully');
            }
            this.$store.commit('finish');
        }).catch(error=>{
          this.$store.commit('finish');
          if(error.toString().match('Error: Network Error') !=null){
            this.$store.commit('setErrorMsg','Opps! Network Error, Please try again later');
          }else if(error.toString.length>0){
            this.$store.commit('setErrorMsg',error);
          }
        });
    },
    hasReportButton(servic){
        if(servic.labTest==true || servic.prescription==true){
          return true;
        }

        return false;
    },
    showReportButton(servic,patientId,invoiceId){
        if(servic.labTest==true){
          return `/lab-tests/${patientId}/${invoiceId}`;
        }
        if(servic.prescription==true){
          return `/prescriptions/${patientId}/${invoiceId}`;
        }
        return null;
    }
  }

}
</script>

<style>
.rounded-pill{border-radius: 60rem !important;}
</style>
