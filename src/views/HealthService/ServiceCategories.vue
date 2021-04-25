<template>
  <div >
    
    <b-alert v-model="isSuccess" variant="success">{{message}}</b-alert>
    <b-alert v-model="isError" variant="danger">{{message}}</b-alert>
    <CCard>
      <CCardBody>
    
    <CCardHeader> <h5>All Service Categories 
      <router-link to="/service-categories/add" class=" btn btn-primary btn-sm float-right">Add Service Category</router-link >
    </h5>
    </CCardHeader>
    
    <b-table v-if="!showForm" id="category-table" :fields="fields" :per-page="perPage" :busy.sync="isBusy"
        :current-page="currentPage" :items="categories" :bordered="true"
          :hover="true"
          :striped="true"
          :small="true">
         <template #cell(labTest)="row">
          <span v-if="row.item.labTest" class="badge badge-success">Yes </span>
          <span v-if="!row.item.labTest" class="badge badge-danger">No </span>
        </template>
        <template #cell(active)="row">
          <span v-if="row.item.active" class="badge badge-success">Active </span>
          <span v-if="!row.item.active" class="badge badge-danger">Inactive </span>
        </template>
         <template #cell(action)="row">
            <router-link class="btn btn-primary btn-sm " :to="'/service-categories/'+row.item.id+'/detail'">Edit</router-link>
        </template>
      </b-table>
      <Loader :isBusy="isBusy"/>
      <b-pagination v-if="!showForm"
        v-model="currentPage"
        :total-rows="rows"
        :per-page="perPage"
        aria-controls="category-table"
      ></b-pagination>
      </CCardBody>
    </CCard>
  </div>
</template>

<script>


import {CategoryService} from '@/services'
import { handleCatch } from '@/helpers/ApiRoutes';

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
      (new CategoryService()).addServiceCategory(this.form,()=>{
        this.fetchServiceCategories();
        this.toggleView();
        this.$store.commit('setSuccessMsg','New Service Category Created');
      })
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
      .catch(handleCatch());
    }
  }
}
</script>