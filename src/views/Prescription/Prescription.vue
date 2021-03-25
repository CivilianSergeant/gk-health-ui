<template>
    <div>
    <ContentBar :PageTitle="title"/>
    <b-alert v-model="isSuccess" variant="success">{{message}}</b-alert>
    <b-alert v-model="isError" variant="danger">{{message}}</b-alert>
    <h5>Prescription List </h5>
    <b-table id="prescription-table" :fields="fields" :per-page="0" :busy.sync="isBusy"
        :current-page="currentPage" :items="prescriptions">
        
        <template #cell(fullName)="row">
            <router-link :to="'/patients/'+row.item.id">{{row.item.fullName}}</router-link>
        </template>
        <template #cell(action)="row">
          <b-button size="sm" variant="info" @click="viewDetail(row.item.prescriptionId)">Detail</b-button>
        </template>
      </b-table>
      <Loader :isBusy="isBusy" />
      <b-pagination
        v-model="currentPage"
        :total-rows="rows"
        :per-page="perPage"
        aria-controls="prescription-table"
      ></b-pagination>
    </div>
</template>
<script>
import { PrescriptionService } from '@/services';
export default {
    computed: {
        rows() {
        return this.totalRows
        },
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
    data(){
        return{
            title: 'My Prescriptions',
            prescriptions:[],
            totalPages:0,
            totalRows:0,
            perPage:20,
            currentPage:1,
            fields:[{'key':'pNumber','label':'Prescription No'},
            {'key':'fullName','label':'Patient Name'},'action']
        }
    },
    mounted(){
        this.fetchPrescriptions();
    },
    watch: {
        currentPage: {
            handler: function() {
                this.fetchPrescriptions();
            }
        }
    },
    methods:{
        fetchPrescriptions(){
            this.$store.commit('start');
            (new PrescriptionService()).getPrescriptions((this.currentPage-1),this.perPage).then(result=>{
                this.prescriptions = result;
                this.$store.commit('finish');
            });
        },
        viewDetail(id){
            this.$router.push('/prescriptions/'+id);
        },
    }
}
</script>
