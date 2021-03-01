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
                        <th>Attribute List</th>
                        <th colspan="6">
                            <button type="button" @click="addAttributeGroup" class="btn btn-secondary btn-sm float-right ml-2">Add Attribute Group</button>
                            <button type="button" @click="addAttribute" class="btn btn-secondary btn-sm float-right">Add Attribute</button>
                        </th>
                        
                    </tr>
                    <tr>
                        
                        <th>Name</th>
                        <th>Avg range</th>
                        <th>Male range</th>
                        <th>Female range</th>
                        <th>Child range</th>
                        <th>Unit</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(attr,i) in form.labTestAttributes" :key="i">
                        <td class="p-0" colspan="6" v-if="attr.group">
                            <input type="text" v-model="attr.attributeName" :ref="('name-'+i)" @keyup="handleKeyUp(this,i,'name')" style="width:100%" placeholder="Attribute Group Name" />
                        </td>
                        <td v-if="attr.group" class="p-0 text-center"><button class="btn btn-danger btn-sm" type="button" @click="deleteRow(i)"><b-icon-trash></b-icon-trash></button></td>
                        
                        <td v-if="!attr.group"  class="p-0"><input v-model="attr.attributeName" :ref="('name-'+i)" @keyup="handleKeyUp(this,i,'name')" type="text" placeholder="Attribute Name, Ex. HB%" style="width:100%" /></td>
                        <td v-if="!attr.group" class="p-0"><input v-model="attr.averageRange" :ref="('arange-'+i)"  @keyup="handleKeyUp(this,i,'arange')" placeholder="Ex. 14.0-18.0" type="text" style="width:100%" /></td>
                        <td v-if="!attr.group" class="p-0"><input v-model="attr.maleRange" :ref="('frange-'+i)"  @keyup="handleKeyUp(this,i,'frange')" placeholder="Ex. Male:14.0-18.0" type="text" style="width:100%" /></td>
                        <td v-if="!attr.group" class="p-0"><input v-model="attr.femaleRange" :ref="('mrange-'+i)"  @keyup="handleKeyUp(this,i,'mrange')" placeholder="Ex. Female:12.0-16.0" type="text" style="width:100%" /></td>
                        <td v-if="!attr.group" class="p-0"><input v-model="attr.childRange" :ref="('crange-'+i)"  @keyup="handleKeyUp(this,i,'crange')" placeholder="Ex. Child:14.0-18.0" type="text" style="width:100%" /></td>
                        <td v-if="!attr.group" class="p-0">
                                <select style="width:100%;padding:2px;" v-model="attr.labTestUnit.id">
                                    <option :value="null">Select Unit</option>
                                    <option v-for="(unit,u) in units" :key="u" :value="unit.id">{{unit.name}}</option>
                                </select>

                        </td>
                        <td v-if="!attr.group" class="p-0 text-center"><button class="btn btn-danger btn-sm" type="button" @click="deleteRow(i)"><b-icon-trash></b-icon-trash></button></td>
                    </tr>
                </tbody>
            </table>
            <div class="row mt-2 mb-2">
                <div class="col-md-2 d-flex justify-content-between">
                    <b-button type="submit" :disabled="buttonDisabled" variant="success">Update</b-button>
                    <b-button type="reset"  :disabled="buttonDisabled" class="ml-4" variant="danger">Cancel</b-button>
                </div>
            </div>
        </b-form>
    </div>
</template>
<script>
import {HealthService, NavigationService} from '@/services'
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
      return (this.form.labTestAttributes)?this.form.labTestAttributes.length:0;
    },
    buttonDisabled(){
        return this.rows==0;
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
        units:[],
        perPage: 20,
        currentPage: 1,
        showForm:false,
        categories:[],
        labTestGroups:[],
        form:{serviceId:null,labTestAttributes:[]}
      }
  },
  beforeMount(){
    this.$store.commit('clearMessage');
    this.fetchServiceById(this.$route.params.id);
    this.fetchLabTestUnits();
  },
  methods:{
    handleKeyUp(e,rowIndex,key){
        const event = e || window.event;
        switch(event.keyCode){
            case 40:
                ++rowIndex;
                if(this.$refs[`${key}-${rowIndex}`] != undefined){
                    this.$refs[`${key}-${rowIndex}`][0].focus();
                }
                break;
            case 38:
                --rowIndex;
                if(this.$refs[`${key}-${rowIndex}`] != undefined){
                    this.$refs[`${key}-${rowIndex}`][0].focus();
                }
        }
    },
    addAttribute(){
        console.log('here')
        this.form.labTestAttributes.push({
            group:false,
            labTestUnit:{id:null},
            attributeName:'',
            averageRange:'',
            maleRange:'',
            femaleRange:'',
            childRange:'',
            displayOrder: (this.rows>0)? this.rows:0
            });
    },
    addAttributeGroup(){
        console.log('here')
        this.form.labTestAttributes.push({
            group:true,
            labTestUnit:{id:null},
            attributeName:'',
            averageRange:'',
            maleRange:'',
            femaleRange:'',
            childRange:'',
            displayOrder: (this.rows>0)? this.rows:0
            });
    },
    deleteRow(i){
        this.$store.commit('clearMessage')
        const attr = this.form.labTestAttributes[i];
        console.log(attr)
        if(attr!=undefined && attr.id != undefined && attr.id > 0){
            axios.delete(GetApiRoute(ApiRoutes.SERVICE_ATTRIBUTE_BY_ID,attr.id)).then(
                res=> {
                    if(res.status==200){
                        this.$store.commit('setSuccessMsg',res.data.message);
                    }
                }
            )
        }
        this.form.labTestAttributes.splice(i,1);
    },
    fetchServiceById(id){
        this.$store.commit('start');
        (new HealthService()).findServicesById(id).then(result=>{
            this.form=result;
            this.$store.commit('finish');
        });
    },
    fetchLabTestUnits(){
        this.$store.commit('start');
        (new HealthService()).getServiceUnits().then(result=>{
            this.units = result;
            this.$store.commit('finish')
        })
    },
    onSubmit(){
        this.$store.commit('clearMessage')
        let valid=true;
        this.form.labTestAttributes.map(attr=>{
            if(attr.group){
                attr.labTestUnit=null;
            }else{
                if(attr.labTestUnit.id==null){
                    this.$store.commit('setErrorMsg','Please Select Unit')
                    valid=false;
                    return;
                }
            }
            return attr;
        })
        
        if(valid){
            (new HealthService()).addServiceAttributes(this.form).then(res=>{
                 this.fetchServiceById(this.form.serviceId);
            })
        }
    },
    onReset(){
        this.$store.commit('clearMessage');
        (new NavigationService()).redirect(this,'services')
    }
  }
}
</script>
<style scoped>
.table .btn-sm, .btn-group-sm > .btn{ padding: 0.05rem 0.5rem;}
</style>
