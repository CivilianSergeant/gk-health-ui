<template>
  <div >
    <ContentBar :PageTitle="title"/>
    <b-alert v-model="isSuccess" variant="success">{{message}}</b-alert>
    <b-alert v-model="isError" variant="danger">{{message}}</b-alert>
    <h5>All Service Categories 
      <router-link to="/service-category/add" class=" btn btn-primary btn-sm float-right">Add Service Category</router-link >
    </h5>
    <b-form v-if="showForm" @submit.prevent="onSubmit" @reset.prevent="onReset">
        <div class="row">
          <div class="col-md-4">
        <b-form-group
            id="input-group-1"
            label="Category Name:"
            label-for="input-1"
            description="Category Name"
        >
            <b-form-input
                id="input-1"
                v-model="form.name"
                type="text"
                placeholder="Category Name"
                required
                ></b-form-input>
        </b-form-group>
        </div></div>
        <b-form-group
            id="input-group-2"
            label="Category Description:"
            label-for="input-2"
            description="Category Description"
        >
            <b-form-input
                id="input-2"
                v-model="form.description"
                type="text"
                placeholder="Category Description"
                required
                ></b-form-input>
        </b-form-group>
              <div class="row">
                
                <div class="col-md-2">
                        <b-form-checkbox  id="isLabTest" v-model="form.labTest"> Lab Test</b-form-checkbox>
                </div>
                <div class="col-md-2">
                        <b-form-checkbox  id="isActive" v-model="form.active"> Is Active</b-form-checkbox>
                </div>
              </div>
        <div class="row mt-2 mb-2">
            <div class="col-md-2 d-flex justify-content-between">
                <b-button type="submit" variant="success">Submit</b-button>
                <b-button type="reset" class="ml-4" variant="danger">Cancel</b-button>
            </div>
        </div>
    </b-form>
    <b-table v-if="!showForm" id="category-table" :fields="fields" :per-page="perPage" :busy.sync="isBusy"
        :current-page="currentPage" :items="categories">
         <template #cell(labTest)="row">
          <span v-if="row.item.labTest" class="badge badge-success">Yes </span>
          <span v-if="!row.item.labTest" class="badge badge-danger">No </span>
        </template>
        <template #cell(active)="row">
          <span v-if="row.item.active" class="badge badge-success">Active </span>
          <span v-if="!row.item.active" class="badge badge-danger">Inactive </span>
        </template>
         <template #cell(action)="row">
            <router-link class="btn btn-primary btn-sm " :to="'/service-category/'+row.item.id+'/detail'">Edit</router-link>
        </template>
      </b-table>
      <Loader :isBusy="isBusy"/>
      <b-pagination v-if="!showForm"
        v-model="currentPage"
        :total-rows="rows"
        :per-page="perPage"
        aria-controls="category-table"
      ></b-pagination>
  </div>
</template>

<script>


import {CategoryService} from '@/services'
import { GetApiRoute, ApiRoutes } from '@/helpers/ApiRoutes';
import axios from 'axios';
export default {
  name: 'ServiceCategories',
  computed: {
    rows() {
      return this.categories.length
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
        title: "Service Categories",
        categories:[],
        showForm:false,
        fields:['name','description','labTest',{'key':'active','label':'Status'},'action'],
        perPage: 20,
        currentPage: 1,
        form:{name:'',labTest:true,active:true}
      }
  },
  beforeMount(){
    this.$store.commit('clearErrorMsg');
    this.fetchServiceCategories();
  },
  methods:{
    onSubmit(){
      this.$store.commit('start');
      axios.post(GetApiRoute(ApiRoutes.ADD_CATEGORY),this.form).then(response=>{
        if(response.status==200){
          this.fetchServiceCategories();
          this.toggleView();
          this.$store.commit('setSuccessMsg','New Service Category Created');
        }
        this.$store.commit('finish');
      });
    },
    onReset(){
      this.$store.commit('clearMessage');
      this.toggleView();
    },
    toggleView(){
      this.form={name:'',description:'',active:true}
      this.$store.commit('clearMessage');
      this.showForm=!this.showForm
    },
    fetchServiceCategories(){
      this.$store.commit('start');
      (new CategoryService()).getCategories().then(result=>{
          this.categories=result; 
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