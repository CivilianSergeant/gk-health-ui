<template>
    <div>
        <ContentBar :PageTitle="title"/>
        <b-alert v-model="isSuccess" variant="success">{{message}}</b-alert>
        <b-alert v-model="isError" variant="danger">{{message}}</b-alert>
        <Loader :isBusy="isBusy"/>
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
                        ></b-form-input>-->

                        <Autocomplete
                        :ajax="true"
                        @choose-item="handleInvoiceNumberAutocomplete"
                        :items="invoices"
                        label="invoiceNumber"
                        rowId="id"
                        @ajax-call="handleInvoiceNumberAjaxCall"
                        />
                    </b-form-group>
                </div>
                <div class="col-md-3 mt-4 px-0" style="margin-top:1.8rem !important">
                <!-- <b-button type="submit" variant="info">Search</b-button>  -->
                <b-button @click="onClearSearch" class="ml-1" variant="warning">Clear</b-button>
                </div>
                    <div class="col-md-6">
                    <div v-if="invoice!=null">Invoice Number: {{invoice.invoiceNumber}}</div>
                    <span  v-if="invoice!=null">Status: {{ isPaid()}}</span>
                    <div v-if="invoice">
                        <div  v-for="(d,i) in invoice.patientServiceDetails" :key="i">
                            <a class="cursor-pointer" @click="setService(i)">{{d.service.name}} </a>    
                            <span v-if="d.selected">Selected</span>
                        </div> 
                    </div>
                </div>
            </div>
            <PatientInfo :invoice="invoice" :patient="patient" :form="form"></PatientInfo>
            </b-form>
            <table class="table" v-if="service">
                <thead>
                    <tr>
                        <th>Attribute List</th>
                        <th colspan="6">
                        </th>
                        
                    </tr>
                    <tr>
                        
                        <th>Name</th>
                        <th>Result</th>
                        <th>Range</th>
                        <th>Unit</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(attr,i) in service.labTestAttributes" :key="i">
                        <td class="p-0" colspan="6" v-if="attr.group">
                            <span> {{attr.attributeName}} </span>
                        </td>
                        
                        
                        <td v-if="!attr.group"  class="p-0">
                            <span> {{attr.attributeName}}</span>
                        </td>
                        <td v-if="!attr.group" class="p-2"><input v-model="attr.result" type="text" style="width:100%" /></td>
                        <td v-if="!attr.group" class="p-2" v-html="showRange(attr)"></td>
                        
                        <td v-if="!attr.group" class="p-0">{{showUnit(attr)}}</td>
                        
                    </tr>
                </tbody>
            </table>
            <div v-if="service" class="col-md-12 d-flex justify-content-between">
                <b-button type="submit" class=""  variant="info">Print</b-button>
                <div>
                    <b-button type="submit" class="ml-2" variant="success">Submit</b-button>
                    <b-button type="reset" class="ml-2" variant="danger">Cancel</b-button>
                </div>
            </div>
    </div>
</template>

<script>
import {PatientInvoiceService,HealthService} from '@/services'
import PatientInfo from '@/components/patientInfo/PatientInfo.vue'
export default {
        components:{
            PatientInfo
        },
        data(){
            return {
                title: "Create Lab Test Report",
                invoices: [],
                invoice: null,
                service: null,
                invoiceAutocomplete: null,
                patient:null,
                form:null
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
        mounted(){
            this.fetchLabTestUnits();
        },
        methods:{
            showUnit(attr){
                const unit = this.units.filter(u=>u.id == attr.labTestUnit.id);
                return unit[0].name;
            },
            showRange(attr){
                let range=" ";
                if(attr){
                    if(attr.averageRange){
                        range = attr.averageRange;
                    }
                    if(attr.maleRange){
                        range += "Male: "+attr.maleRange+"<br/>";
                    }
                    if(attr.femaleRange){
                        range += "Female: "+attr.femaleRange+"<br/>";
                    }
                    if(attr.childRange){
                        range += "Child Range: "+attr.childRange+"<br/>";
                    }
                }
                return range;
            },
            fetchLabTestUnits(){
                this.$store.commit('start');
                (new HealthService()).getServiceUnits().then(result=>{
                    this.units = result;
                    this.$store.commit('finish')
                })
            },
            setService(i){
                const patientService = this.invoice.patientServiceDetails[i];
                patientService.selected=true;
                this.fetchServiceById(patientService.service.serviceId);
                this.$forceUpdate();
            },
            isPaid(){
                
                return (this.invoice.paidAmount < this.invoice.payableAmount)? 'NOT PAID' : 'PAID'
            },
            handleInvoiceNumberAutocomplete(invoice, autocomplete) {
                (new PatientInvoiceService()).getInvoiceById(invoice.id).then(result => {
                this.invoice = result;
                this.patient = this.invoice.patient;
            
                this.invoiceAutocomplete = autocomplete;
                });
            },
            handleInvoiceNumberAjaxCall(searchText) {
                if (searchText.length >= 2) {
                (new PatientInvoiceService())
                    .getInvoiceNumbers(searchText)
                    .then(result => {
                    this.invoices = result.collection;
                    });
                }
                
            },
            fetchServiceById(id){
                this.$store.commit('start');
                (new HealthService()).findServicesById(id).then(result=>{
                    this.service=result;
                    this.$store.commit('finish');
                });
            },
            onClearSearch() {
                this.patient = null;
                this.invoice = null;
                this.service = null;
        
                this.$store.commit("clearMessage");
                
                if (this.invoiceAutocomplete != undefined) {
                this.invoiceAutocomplete.setInputValue("");
                }
        
                
            }
        }
    }
</script>