<template>
    <div>
        <ContentBar :PageTitle="title"/>
          <b-alert v-model="isSuccess" variant="success">{{message}}</b-alert>
    <b-alert v-model="isError" variant="danger">{{message}}</b-alert>
    <h5>Add Service Category
        <router-link to="/service-categories" class=" btn btn-info btn-sm float-right">Service Category List</router-link >
    </h5>
    <b-form v-if="!isError"  @submit.prevent="onSubmit" @reset.prevent="onReset">
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
    </div>
</template>

<script>

import {CategoryService,NavigationService} from '@/services'

export default {
  name: 'ServiceCategories',
  computed: {
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
        id:"null",
        title: "Service Category",
        form:{name:'',description:'',labTest:true,active:true}
      }
  },
 mounted() {
    this.id = this.$route.params.id;
    if(this.id!=undefined){
        this.fetchServiceCategoryById(this.id);
    }
    this.$store.commit("clearMessage");

    },
  methods:{
    fetchServiceCategoryById(id){
        (new CategoryService()).getServiceCategoryById(id).then((result)=>{
            this.form = result;
        })
    },
    onSubmit(){
      this.$store.commit('start');
      (new CategoryService()).addServiceCategory(this.form,()=>{
          const message = (this.id!=undefined)? "Service Category Updated":"New Service Category Created";
          this.$store.commit('setSuccessMsg',message);
          const navigationService =new NavigationService();
          navigationService.redirect(this,"service-categories");
      })
      
    },
    onReset(){
        this.$store.commit('clearMessage');
        const navigationService =new NavigationService();
        navigationService.redirect(this,"service-categories");
    },
    
  }
}
</script>