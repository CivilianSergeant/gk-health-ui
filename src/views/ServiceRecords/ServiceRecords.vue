<template>
    <div>
         <!-- <ContentBar :PageTitle="title"/> -->
        <h5 class="py-3">Service Records</h5>
        <div class="row py-2 mr-3 d-flex justify-content-end">
            <div class="mr-2">
                    <b-form-datepicker id="datepicker-placeholder" placeholder="from date" locale="en"></b-form-datepicker>
            </div>
            <div>
                <b-form-datepicker id="datepicker-placeholder" placeholder="To date" locale="en"></b-form-datepicker>
            </div>
            <div>
                <b-button class="ml-2" variant="info">Search</b-button>
            </div>
        </div>
        <b-table :fields="fields" :per-page="perPage" :current-page="currentPage" :items="serviceRecords">
             <template #cell(action)="row">
            <router-link class="btn btn-primary btn-sm " :to="'/service-record/'+row.item.id+'/detail'">Details</router-link>
        </template>
        </b-table>
        <b-pagination 
        v-model="currentPage"
        :total-rows="rows"
        :per-page="perPage"
        aria-controls="service-record-table"
      ></b-pagination>
    </div>
</template>

<script lang="ts">
import {ServiceRecordService} from '@/services'
export default {
    computed:{
         rows() {
            return this.totalRows;
        },
    },
    data(){
        return{
            title:"Service Record",
            fields:[{key:'createdAt',label:'Date'},'invoiceNumber',{key:'name',label:'Name'},'address','receivableAmount','paid','action'],
            serviceRecords:[],
            perPage: 20,
            currentPage: 1,
            totalRows:0
        }
        
    },
    mounted(){
        this.fetchServiceRecords();
    },
    methods:{
            fetchServiceRecords(){
               (new ServiceRecordService()).getServiceRecords().then((result: any)=>{
                   this.serviceRecords = result;
                   this.totalRows = this.serviceRecords.length;
               })
            }
        }
    
}
</script>