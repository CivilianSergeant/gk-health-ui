<template>
    <div>
      <ContentBar :PageTitle="title"/>
       <b-alert v-model="isError" variant="danger">{{errorMsg}}</b-alert>
      <h5>All Centers</h5>
      <b-table id="center-table" :fields="fields" :per-page="perPage" 
      :current-page="currentPage" :items="centers"></b-table>
      <Loader :isBusy="isBusy"/>
      <b-pagination
        v-model="currentPage"
        :total-rows="rows"
        :per-page="perPage"
        aria-controls="center-table"
      ></b-pagination>
    </div>
</template>

<script>
import { Center } from '@/entity/Center';
import { CenterService } from '@/services/CenterService';

export default {
  name: 'HealthCenter',
  computed: {
    rows() {
      return this.centers.length
    }
  },
  data(){
      return {
        title: "Health Center",
        centers:[],
        errorMsg:'',
        isError:false,
        isBusy:false,
        fields:['name','apiOfficeId','centerCode','address'],
        currentPage:1,
        perPage:20
      }
  },
  beforeMount(){
    this.fetchCenters();
  },

  methods:{

    fetchCenters(){
      this.isBusy=true;
      (new CenterService()).getCenters().then(result=> {this.centers = result; this.isBusy=false;})
      .catch(error=>{
        this.isError=true;
        this.isBusy=false;
        if(error.toString().match('Error: Network Error') !=null){
          this.errorMsg = 'Opps! Network Error, Please try again later'
        }else if(error.toString.length>0){
          this.errorMsg = error;
        }
      });  
    }

  }
}
</script>