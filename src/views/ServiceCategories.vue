<template>
  <div >
    <ContentBar :PageTitle="title"/>
    <b-alert v-model="isError" variant="danger">{{errorMsg}}</b-alert>
    <h5>All Service Categories</h5>
      <b-table id="category-table" :fields="fields" :per-page="perPage" :busy.sync="isBusy"
        :current-page="currentPage" :items="categories">
        <template #cell(active)="row">
          <span v-if="row.item.active" class="badge badge-success">Active </span>
          <span v-if="!row.item.active" class="badge badge-danger">Inactive </span>
        </template>
      </b-table>
      <Loader/>
      <b-pagination
        v-model="currentPage"
        :total-rows="rows"
        :per-page="perPage"
        aria-controls="category-table"
      ></b-pagination>
  </div>
</template>

<script>
import ContentBar from '@/components/ContentBar.vue'

import {CategoryService} from '@/services/CategoryService'
import {Category} from '@/entity/Category'

export default {
  name: 'ServiceCategories',
  computed: {
    rows() {
      return this.categories.length
    }
  },
  data(){
      return {
        title: "Service Categories",
        categories:[],
        isBusy:false,
        errorMsg:null,
        isError:false,
        fields:['name','description',{'key':'active','label':'Status'},],
        perPage: 20,
        currentPage: 1,
      }
  },
  components: {
    ContentBar
  },
  beforeMount(){
    this.isBusy=true;
    (new CategoryService()).getCategories().then(result=>{this.categories=result; this.isBusy=false})
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
</script>