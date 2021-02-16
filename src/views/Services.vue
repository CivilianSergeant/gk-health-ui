<template>
  <div>
    <ContentBar :PageTitle="title"/>
    <b-alert v-model="isSuccess" variant="success">{{message}}</b-alert>
    <b-alert v-model="isError" variant="danger">{{message}}</b-alert>
    <h5>All Services
      <b-button v-if="!showForm" @click="toggleView" class=" btn btn-info btn-sm float-right">Add Service</b-button>
      <b-button v-if="showForm" @click="toggleView" class=" btn btn-info btn-sm float-right">Service List</b-button>

    </h5>
    <b-form v-if="showForm" @submit.prevent="onSubmit" @reset.prevent="onReset">
      <div class="row">
          <div class="col-md-3">
              <b-form-group
                  
                  id="input-group-0"
                  label="Categories:"
                  label-for="categories"
                  description="Select Category"
                  
              >
                  <b-form-select :disabled="categories.length==0 || isError" id="categories" v-model="form.serviceCategory.id"
                    :options="categories"></b-form-select>
              </b-form-group>
          </div>
      </div>
        <div class="row">
          <div class="col-md-4">
        <b-form-group
            id="input-group-1"
            label="Name:"
            label-for="input-1"
            description="Name"
        >
            <b-form-input
                id="input-1"
                v-model="form.name"
                type="text"
                placeholder="Name"
                required
                ></b-form-input>
        </b-form-group>
        </div>
        </div>
        <div class="row">
          <div class="col-md-4">
        <b-form-group
            id="input-group-1"
            label="Code:"
            label-for="input-1"
            description="Code"
        >
            <b-form-input
                id="input-1"
                v-model="form.code"
                type="text"
                placeholder="Code"
                required
                ></b-form-input>
        </b-form-group>
        </div>
        </div>
        <b-form-group
            id="input-group-2"
            label="Description:"
            label-for="input-2"
            description="Description"
        >
            <b-form-input
                id="input-2"
                v-model="form.description"
                type="text"
                placeholder="Description"
                required
                ></b-form-input>
        </b-form-group>
        <b-form-group
            id="input-group-2"
            label="Current Cost:"
            label-for="input-2"
            description="Current Cost"
        >
            <b-form-input
                id="input-2"
                v-model="form.currentCost"
                type="text"
                placeholder="Current Cost"
                required
                ></b-form-input>
        </b-form-group>
        <b-form-group
            id="input-group-2"
            label="GB Cost:"
            label-for="input-2"
            description="Current GB Cost"
        >
            <b-form-input
                id="input-2"
                v-model="form.currentGbCost"
                type="text"
                placeholder="GB Cost"
                required
                ></b-form-input>
        </b-form-group>
        <div class="row mt-2 mb-2">
            <div class="col-md-2 d-flex justify-content-between">
                <b-button type="submit" variant="success">Submit</b-button>
                <b-button type="reset" class="ml-4" variant="danger">Cancel</b-button>
            </div>
        </div>
    </b-form>
    <b-table id="service-table" v-if="!showForm" :fields="fields" :per-page="perPage" :busy.sync="isBusy" 
        :current-page="currentPage" :items="services">
        <template #cell(active)="row">
          <span v-if="row.item.active" class="badge badge-success">Active </span>
          <span v-if="!row.item.active" class="badge badge-danger">Inactive </span>
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
          // {'key':'currentRevisitCost','label':'Revisit Cost',
          // },
          'description','active'],
        perPage: 20,
        currentPage: 1,
        showForm:false,
        categories:[],
        form:{name:'',active:true,serviceCategory:{id:null}}
      }
  },
  beforeMount(){
    this.$store.commit('clearErrorMsg');
    this.fetchServices();
  },
  methods:{
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
      this.$store.commit('clear');
      this.toggleView();
    },
    toggleView(){
      this.$store.commit('clear');
      this.showForm=!this.showForm
      if(this.showForm){
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