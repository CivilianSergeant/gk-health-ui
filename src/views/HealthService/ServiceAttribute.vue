<template>
    <div>
        <ContentBar :PageTitle="title"/>
        <b-alert v-model="isSuccess" variant="success">{{message}}</b-alert>
        <b-alert v-model="isError" variant="danger">{{message}}</b-alert>
        <h5>Service Attributes for {{form.name}}
      
        <router-link to="/services" class=" btn btn-info btn-sm float-right ml-2">Service List</router-link>
        <router-link :to="'/services/'+form.serviceId+'/detail'" class=" btn btn-info btn-sm float-right">Service Detail</router-link>

        </h5>
        
        <b-form @submit.prevent="onSubmit" @reset.prevent="onReset">
            <table class="table">
                <thead>
                    <tr>
                        
                        <th colspan="3"><button type="button" @click="addRow" class="float-right">Add</button></th>
                        
                    </tr>
                    <tr>
                        
                        <th>Name</th>
                        <th>Normal range</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(attr,i) in attributes" :key="i">
                        <td ><input type="text" style="width:100%" v-model="attr.name"/></td>
                        <td><input type="text" style="width:100%" v-model="attr.range"/></td>
                        <td ><button type="button" @click="deleteRow(i)">Del</button></td>
                    </tr>
                </tbody>
            </table>
        </b-form>
    </div>
</template>
<script>
import {CategoryService,HealthService, LabTestGroupService,NavigationService} from '@/services'
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
       
        attributes:[],
        perPage: 20,
        currentPage: 1,
        showForm:false,
        categories:[],
        labTestGroups:[],
        form:{name:'',description:'N/A',currentCost:0,currentGbCost:0,labTest:false,active:true,serviceCategory:{id:null},labTestGroup:{id:null}}
      }
  },
  beforeMount(){
    this.$store.commit('clearMessage');
    this.fetchServiceById(this.$route.params.id);
  },
  methods:{
    addRow(){
        console.log('here')
        this.attributes.push({});
    },
    deleteRow(i){
        console.log(i)
        this.attributes.splice(i,1);
    },
    fetchServiceById(id){
        this.$store.commit('start');
        (new HealthService()).findServicesById(id).then(result=>{
            this.form=result;
        });
    },
    onSubmit(){
        console.log('')
    },
    onReset(){
console.log('')
    }
  }
}
</script>