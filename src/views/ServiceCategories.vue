<template>
  <div >
    <ContentBar :PageTitle="title"/>
    <b-alert v-model="isError" variant="danger">{{message}}</b-alert>
    <h5>All Service Categories</h5>
      <b-table id="category-table" :fields="fields" :per-page="perPage" :busy.sync="isBusy"
        :current-page="currentPage" :items="categories">
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
        aria-controls="category-table"
      ></b-pagination>
  </div>
</template>

<script>


import {CategoryService} from '@/services/CategoryService'

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
        fields:['name','description',{'key':'active','label':'Status'},],
        perPage: 20,
        currentPage: 1,
      }
  },
  beforeMount(){
    this.$store.commit('clearErrorMsg');
    this.fetchServiceCategories();
  },
  methods:{
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