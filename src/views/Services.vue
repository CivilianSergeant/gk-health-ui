<template>
  <div>
    
    <ContentBar :PageTitle="title"/>
    <b-alert v-model="isError" variant="danger">{{errorMsg}}</b-alert>
    <h5>All Services</h5>
    <b-table id="service-table" :fields="fields" :per-page="perPage" :busy.sync="isBusy" 
        :current-page="currentPage" :items="services">
        <template #cell(active)="row">
          <span v-if="row.item.active" class="badge badge-success">Active </span>
          <span v-if="!row.item.active" class="badge badge-danger">Inactive </span>
        </template>
      </b-table>
      <b-pagination
        v-model="currentPage"
        :total-rows="rows"
        :per-page="perPage"
        aria-controls="service-table"
      ></b-pagination>
  </div>
</template>

<script>
import ContentBar from '@/components/ContentBar.vue'
import { HealthService } from '@/services/HealthService'

export default {
  name: 'Services',
  computed: {
    rows() {
      return this.services.length
    }
  },
  data(){
      return {
        title: "Services",
        services:[],
        isBusy:false,
        errorMsg:null,
        isError:false,
        fields:['serviceCategory.name','name','code','currentCost',
          {'key':'currentGbCost','label':'GB Cost'}, 
          {'key':'currentRevisitCost','label':'Revisit Cost',
          },'description','active'],
        perPage: 20,
        currentPage: 1
      }
  },
  components: {
    ContentBar
  },
  beforeMount(){
    this.isBusy=true;
    (new HealthService()).getServices().then(result=>{this.services=result; this.isBusy=false})
    .catch(error=> {
      this.isError=true;
      if(error.toString().match('Error: Network Error') !=null){
        this.errorMsg = 'Opps! Network Error, Please try again later'
      }else if(error.toString.length>0){
        this.errorMsg = error;
      }
      
    });
  }
}
</script>