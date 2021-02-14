<template>
  <div>
    <ContentBar :PageTitle="title"/>
    <b-alert v-model="isError" variant="danger">{{message}}</b-alert>
    <h5>All Services</h5>
    <b-table id="service-table" :fields="fields" :per-page="perPage" :busy.sync="isBusy" 
        :current-page="currentPage" :items="services">
        <template #cell(active)="row">
          <span v-if="row.item.active" class="badge badge-success">Active </span>
          <span v-if="!row.item.active" class="badge badge-danger">Inactive </span>
        </template>
      </b-table>
      <Loader :isBusy="isBusy"/>
      <b-pagination
        v-model="currentPage"
        :total-rows="rows"
        :per-page="perPage"
        aria-controls="service-table"
      ></b-pagination>
  </div>
</template>

<script>
import { HealthService } from '@/services/HealthService'

export default {
  name: 'Services',
  computed: {
    rows() {
      return this.services.length
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
      return {
        title: "Services",
        services:[],
        fields:[{key:'serviceCategory.name',label:'Service Category'},'name','code','currentCost',
          {'key':'currentGbCost','label':'GB Cost'}, 
          {'key':'currentRevisitCost','label':'Revisit Cost',
          },'description','active'],
        perPage: 20,
        currentPage: 1
      }
  },
  beforeMount(){
    this.$store.commit('clearErrorMsg');
    this.fetchServices();
  },
  methods:{
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