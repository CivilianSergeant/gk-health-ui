<template>
    <div>
        <ContentBar :PageTitle="title"/>
        <b-alert v-model="isSuccess" variant="success">{{message}}</b-alert>
        <b-alert v-model="isError" variant="danger">{{message}}</b-alert>
        <h5>Service Detail
      
        <router-link to="/services" class=" btn btn-info btn-sm float-right ml-2">Service List</router-link >
        <router-link v-if="form.labTest" :to="'/services/'+form.serviceId+'/attribute'" class=" btn btn-info btn-sm float-right">Service Attributes</router-link >

        </h5>
        <b-form @submit.prevent="onSubmit" @reset.prevent="onReset">
        <div class="row">
            <div class="col-md-3">
                <b-form-group
                    
                    id="input-group-0"
                    label="Categories:"
                    label-for="categories"
                    description="Select Category (Required)"
                    
                >
                    <b-form-select required :disabled="categories.length==0 || isError" id="categories" v-model="form.serviceCategory.id"
                        :options="categories"></b-form-select>
                </b-form-group>
            </div>
        </div>
        <div class="row" v-if="isCategoryPathology">
            <div class="col-md-3">
                <b-form-group
                    
                    id="input-group-0"
                    label="Lab Test Group:"
                    label-for="groups"
                    description="Select Group For Lab Test (Required)"
                    
                >
                    <b-form-select required :disabled="labTestGroups.length==0 || isError" id="categories" v-model="form.labTestGroup.id"
                        :options="labTestGroups"></b-form-select>
                </b-form-group>
            </div>
        </div>
            <div class="row">
                <div class="col-md-4">
                    <b-form-group
                        id="input-group-1"
                        label="Name:"
                        label-for="input-1"
                        description="Name (Required)"
                    >
                        <b-form-input
                            id="input-1"
                            v-model="form.name"
                            @input="handleInput"
                            type="text"
                            placeholder="Name"
                            required
                            ></b-form-input>
                    </b-form-group>
                </div>
                <div class="col-md-4">
                    <b-form-group
                        id="input-group-1"
                        label="Code:"
                        label-for="input-1"
                        description="Code"
                    >
                        <b-form-input
                            id="input-1"
                            readonly
                            v-model="form.code"
                            type="text"
                            placeholder="Code"
                            required
                            ></b-form-input>
                    </b-form-group>
                    
                </div>
            </div>
            <div class="row">
                <div class="col-md-4">
                    <b-form-group
                        id="input-group-2"
                        label="Non CH-GB Cost:"
                        label-for="input-2"
                        description="Non CH-GB Cost (Required)"
                    >
                        <b-form-input
                            id="input-2"
                            @input="handleCurrentCostInput"
                            v-model="form.currentCost"
                            type="text"
                            placeholder=""
                            required
                            ></b-form-input>
                    </b-form-group>
                </div>
                <div class="col-md-4">
                    <b-form-group
                        id="input-group-2"
                        label="CH-GB Cost:"
                        label-for="input-2"
                        description="CH-GB Cost (Required)"
                    >
                        <b-form-input
                            id="input-2"
                            v-model="form.currentGbCost"
                            type="text"
                            placeholder=""
                            required
                            ></b-form-input>
                    </b-form-group>
                </div>
            </div>
            <b-form-group
                id="input-group-2"
                label="Description:"
                label-for="input-2"
                description="Description (Optional)"
            >
                <b-form-input
                    id="input-2"
                    v-model="form.description"
                    type="text"
                    placeholder="Description"
                    
                    ></b-form-input>
            </b-form-group>
            
            
            <div class="row mt-2 mb-2">
                <div class="col-md-2 d-flex justify-content-between">
                    <b-button type="submit" variant="success">Update</b-button>
                    <b-button type="reset" class="ml-4" variant="danger">Cancel</b-button>
                </div>
            </div>
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
        services:[],
        
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
    this.fetchServiceCategories();
    this.fetchLabTestGroups();
    this.fetchServiceById(this.$route.params.id);
  },
  methods:{
    handleInput(val){
        this.form.code = (val.toLowerCase())
    },
    handleCurrentCostInput(val){
        
        this.form.currentGbCost=(parseInt(val)-50);
    },
    fetchServiceById(id){
        this.$store.commit('start');
        (new HealthService()).findServicesById(id).then(result=>{
            this.form=result;
        });
    },
    fetchLabTestGroups(){
        this.$store.commit('start');
        (new LabTestGroupService()).getLabTestGroups().then(result=>{
            this.labTestGroups.push({value:null,text:'Select Group'});
            result.forEach(group=>{
                this.labTestGroups.push({value:group.id,text:group.name,id:group.id})
            });
            this.$store.commit('finish');
        }).catch(error=>{
            this.$store.commit('finish');
            if(error.toString().match('Error: Network Error') !=null){
            this.$store.commit('setErrorMsg','Opps! Network Error, Please try again later');
            }else if(error.toString.length>0){
            this.$store.commit('setErrorMsg',error);
            }
        });
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
      if(this.form.labTestGroup!=null && this.form.labTestGroup.id != null){
          this.form.labTest = true;
      }else{
          this.form.labTestGroup = null;
      }
      
      axios.put(GetApiRoute(ApiRoutes.UPDATE_SERVICE),this.form).then(response=>{
        this.$store.commit('finish');

        if(response.status==200){
          
          this.$store.commit('setSuccessMsg','Service Updated Successfully');
          this._redirectToServices();
        }
        
      });
    },

    onReset(){
      this.$store.commit('clearMessage');
      this._redirectToServices();
    },
    _redirectToServices(){
        const navigationService =new NavigationService();
        navigationService.redirect(this,"services");
    }
    
  }
}
</script>