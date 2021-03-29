<template>
    <div>
         <!-- <ContentBar :PageTitle="title"/> -->
        <h5 class="py-3">Service Records</h5>
        <div class="row py-2 mr-3 d-flex justify-content-end">
            <div class="mr-2">
                    <b-form-datepicker id="datepicker-placeholder" :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }" placeholder="from date" locale="en"></b-form-datepicker>
            </div>
            <div>
                <b-form-datepicker id="datepicker-placeholder2" placeholder="To date" :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }" locale="en"></b-form-datepicker>
            </div>
            <div>
                <b-button class="ml-2" variant="info">Search</b-button>
            </div>
        </div>
        <b-table :fields="fields" :per-page="perPage" :current-page="currentPage" :items="serviceRecords">
              <template #foot(receivableAmount)="data">
                    <span class="text-danger">{{ data.label }}</span>
            </template>
        </b-table>

       
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
        
            serviceRecords.map(r=>{
            // if(this.registration.gb){
            //   this.totalPayable+= r.currentGbCost
            // }else{
            //   this.totalPayable+= r.currentCost
            // }
            
            
            this.totalReceivable+= r.receivableAmount;
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
            totalReceivable:0
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
            }
        }
    
}
</script>