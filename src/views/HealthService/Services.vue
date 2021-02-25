<template>
  <div id="service-list">
    <ContentBar :PageTitle="title"/>
    <b-alert v-model="isSuccess" variant="success">{{message}}</b-alert>
    <b-alert v-model="isError" variant="danger">{{message}}</b-alert>
    <h5>All Services
      
      <router-link to="/services/add" class=" btn btn-primary btn-sm float-right">Add Service</router-link >

    </h5>
    
    <b-table id="service-table" v-if="!showForm" :fields="fields" :per-page="perPage" :busy.sync="isBusy" 
        :current-page="currentPage" :items="services">
        <template #cell(active)="row">
          <span v-if="row.item.active" class="badge badge-success">Active </span>
          <span v-if="!row.item.active" class="badge badge-danger">Inactive </span>
        </template>
        <template #cell(labTestGroup)="row">
         
          <span v-if="row.item.labTestGroup" :class="'badge badge-'+ getColor(row.item.labTestGroup.name)">{{row.item.labTestGroup.name}} </span>
          <span v-if="!row.item.labTestGroup" >N/A </span>
        </template>
        <template #cell(action)="row">
            <router-link class="btn btn-primary btn-sm " :to="'/services/'+row.item.serviceId+'/detail'">Edit</router-link>
        </template>
      </b-table>
      <Loader :isBusy="isBusy"/>
      <b-pagination v-if="!showForm"
        v-model="currentPage"
        :total-rows="rows"
        :per-page="perPage"
        aria-controls="service-table"
      ></b-pagination>
  </div>
</template>

<script>
import {CategoryService} from '@/services/CategoryService'
import { HealthService } from '@/services/HealthService'
import { GetApiRoute, ApiRoutes } from '@/helpers/ApiRoutes';
import axios from 'axios';

export default {
  name: 'Services',
  computed: {
    isCategoryPathology(){
      let _isCategoryPathology=false;
      this.categories.forEach(c=>{
        if(c.id==this.form.serviceCategory.id && c.text.toString().toLowerCase().match('pathology')){
          _isCategoryPathology=true;
        }
      });
     
      return _isCategoryPathology;
    },
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
        fields:[{key:'serviceCategory.name',label:'Service Category'},'name',
        {'key':'currentGbCost','label':'GB Cost'}, 
        {'key':'currentCost','label':'Non CH-GB Cost'},
          
          
          {'key':'labTestGroup','label':'Lab Test Group'},'active','action'],
        perPage: 20,
        currentPage: 1,
        showForm:false,
        categories:[],
        labTestGroups:[],
        form:{name:'',active:true,serviceCategory:{id:null}}
      }
  },
  beforeMount(){
    this.$store.commit('clearErrorMsg');
    this.fetchServices();
  },
  methods:{
    getColor(name){
      console.log(name.toString().toLowerCase().charAt(0))
      if(name.toString().toLowerCase().charAt(0)=='b'){
        return 'warning'
      }else if(name.toString().toLowerCase().charAt(0)=='h'){
        return 'danger';
      }else{
        return 'info'
      }

    },
    fetchServiceCategories(){
      this.$store.commit('start');
      (new CategoryService()).getCategories().then(result=>{
          this.categories.push({value:null,text:'Select Category'});
          result.forEach(category=>{
              this.categories.push({value:category.id,text:category.name,id:category.id})
            });
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
    },
    onSubmit(){
      this.$store.commit('start');
      axios.post(GetApiRoute(ApiRoutes.ADD_SERVICE),this.form).then(response=>{
        if(response.status==200){
          this.fetchServices();
          this.toggleView();
          this.$store.commit('setSuccessMsg','New Service Created');
        }
        this.$store.commit('finish');
      });
    },
    onReset(){
      this.$store.commit('clearMessage');
      this.toggleView();
    },
    toggleView(){
      this.$store.commit('clearMessage');
      this.showForm=!this.showForm
      if(this.showForm){
        this.categories = [];
        this.fetchServiceCategories();
      }
    },
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
<style scoped>
#service-table .btn-sm, .btn-group-sm > .btn{ padding: 0.05rem 0.5rem;}
</style>
