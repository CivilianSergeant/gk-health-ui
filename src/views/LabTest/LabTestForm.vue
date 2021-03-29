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
        methods:{
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
                
        
                this.$store.commit("clearMessage");
                
                if (this.invoiceAutocomplete != undefined) {
                this.invoiceAutocomplete.setInputValue("");
                }
        
                
            }
        }
    }
</script>