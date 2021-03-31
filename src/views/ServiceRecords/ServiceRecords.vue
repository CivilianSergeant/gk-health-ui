<template>
    <div>
         <!-- <ContentBar :PageTitle="title"/> -->
        <h5 class="py-3">Service Records</h5>
        <b-form @submit.prevent="onSearch">
        <div class="row py-2 mr-3 d-flex justify-content-end">
            <div class="mr-2">
                    <b-form-datepicker id="datepicker-placeholder" placeholder="from date" locale="en" v-model="form.from_date"></b-form-datepicker>
            </div>
            <div>
                <b-form-datepicker id="datepicker-placeholder2" placeholder="To date"  locale="en" v-model="form.to_date"></b-form-datepicker>
            </div>
            <div>
                <b-button type="submit" class="ml-2" variant="info">Search</b-button>
            </div>
        </div>
        </b-form>
        <table class="table table-bordered">
              <thead class="thead-light">
                <tr>
                    <th>Date</th>
                    <th>Invoice No</th>
                    <th>Name</th>
                    <th>Address</th>
                    <th>Receivable</th>
                    <th>Paid</th>
                </tr>
              </thead>
              <tbody>
                   <tr v-for="(ps,i) in serviceRecords" :key="i">
                    <td>{{ps.date}}</td>
                    <td>{{ps.invoiceNumber}}</td>
                    <td>{{ps.name}}</td>
                    <td>{{ps.address}}</td>
                    <td>{{ps.receivableAmount}}</td>
                    <td>{{ps.paid}}</td>
                </tr>
              </tbody>
              <tfoot>
                  <tr>
                      <th colspan="4">Total</th>
                      <th>{{totalReceivable}}</th>
                      <th>{{totalPaid}}</th>
                  </tr>
              </tfoot>
        </table>
        <!-- <b-table :fields="fields" :per-page="perPage" :current-page="currentPage" :items="serviceRecords">
              <template>
                    
            </template>
        </b-table> -->

       
    </div>
</template>

<script>
import {ServiceRecordService} from '@/services'
export default {
    computed:{
         rows() {
            return this.totalRows;
        },
    },
    watch:{
        serviceRecords: {
        handler(serviceRecords){
            this.totalReceivable=0;
            this.totalPaid = 0;
            serviceRecords.map(r=>{
            this.totalReceivable+= r.receivableAmount;
            this.totalPaid+= r.paid;
            });
            
        },
        deep:true
        }
  },
    data(){
        return{
            title:"Service Record",
            fields:['date',{key:'invoiceNumber',label:'Invoice No'},'name','address',{key:'receivableAmount',label:'Receivable'},'paid'],
            serviceRecords:[],
            perPage: 20,
            currentPage: 1,
            totalRows:0,
            totalReceivable:0,
            totalPaid:0,
            form:{},
        }
        
    },
    mounted(){
        this.fetchServiceRecords();
    },
    methods:{
            fetchServiceRecords(){
               (new ServiceRecordService()).getServiceRecords().then((result)=>{
                   this.serviceRecords = result;
                   this.totalRows = this.serviceRecords.length;
               })
            },
            onSearch(){
                console.log("test");

                (new ServiceRecordService()).getServiceRecords(this.form.from_date,this.form.to_date).then((result)=>{
                this.serviceRecords = result;
                   this.totalRows = this.serviceRecords.length;
               })
            }
        }
    
}
</script>