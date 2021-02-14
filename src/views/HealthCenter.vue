<template>
    <div>
      <ContentBar :PageTitle="title"/>
       <b-alert v-model="isError" variant="danger">{{message}}</b-alert>
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
import { CenterService } from '@/services/CenterService';

export default {
  name: 'HealthCenter',
  computed: {
    rows() {
      return this.centers.length
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
        title: "Health Center",
        centers:[],
        fields:['name','apiOfficeId','centerCode','address'],
        currentPage:1,
        perPage:20
      }
  },
  beforeMount(){
    this.$store.commit('clearErrorMsg');
    this.fetchCenters();
  },

  methods:{

    fetchCenters(){
      this.$store.commit('start');
      (new CenterService()).getCenters().then(result=> {
        this.centers = result; 
        this.$store.commit('finish');
      })
      .catch(error=>{
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