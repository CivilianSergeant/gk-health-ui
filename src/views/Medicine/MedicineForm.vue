<template>
    <div>
        <ContentBar :PageTitle="title" />
        <b-alert v-model="isSuccess" variant="success">{{message}}</b-alert>
        <b-alert v-model="isError" variant="danger">{{message}}</b-alert>
        <h5 class="clearfix">Add Medicine
            <router-link to="/medicines" class=" btn btn-primary btn-sm float-right">Medicine List</router-link >
        </h5>
         <b-form  @submit.prevent="onSubmit" @reset.prevent="onReset">
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
                                type="text"
                                placeholder="Name"
                                required
                                ></b-form-input>
                        </b-form-group>
                </div>
                
                <div class="col-md-4">
                    <b-form-group
                            id="input-group-1"
                            label="Brand:"
                            label-for="input-1"
                            description="Brand (Required)"
                        >
                             <b-form-select required :disabled="medicineBrands.length==0 || isError" id="medicineBrands" v-model="form.medicineBrand.id"
                        :options="medicineBrands"></b-form-select>
                </b-form-group>
                </div>
                <div class="col-md-4">
                    <b-form-group
                            id="input-group-1"
                            label="Group:"
                            label-for="input-1"
                            description="Group (Required)"
                        >
                             <b-form-select required :disabled="medicineGroups.length==0 || isError" id="medicineGroups" v-model="form.medicineGroup.id"
                        :options="medicineGroups"></b-form-select>
                        </b-form-group>
                </div>

                <div class="col-md-4">
                   
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
<script lang="ts">
import {MedicineGroupService, MedicineService, NavigationService} from '@/services'
import {MedicineBrandService} from '@/services'

import { GetApiRoute, ApiRoutes } from '@/helpers/ApiRoutes';
import axios from 'axios';


export default {
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
        return{
            id:"null",
            title:"Medicine",
            medicineGroups:[],
             medicineBrands:[],
            form:{name:'',medicineBrand:{id:null},medicineGroup:{id:null},active:true}
        }
    },
     mounted(): void{
        this.id = this.$route.params.id;
        // console.log("test",this.id);
        if(this.id!=undefined){
            this.fetchMedicineById(this.id);
            console.log("test");
        }
        this.fetcheMedicineGroups();
        this.fetcheMedicineBrands();
        this.$store.commit("clearMessage");

    },
    methods:{
        fetcheMedicineGroups (){
           (new MedicineGroupService()).getMedicineGroups().then((result: any)=>{
               result.unshift({'id':null,'name':'Select Group'});
               result.map((r: Record<string,any>)=>{
                   r.value = r.id;
                   r.text = r.name;
               })
               
               this.medicineGroups = result;
           })
        },
        fetcheMedicineBrands (){
           (new MedicineBrandService()).getMedicineBrands().then((result: any)=>{
               result.unshift({'id':null,'name':'Select Brand'});
               result.map((r: Record<string,any>)=>{
                   r.value = r.id;
                   r.text = r.name;
               })
               this.medicineBrands = result;
           })
        },
        fetchMedicineById(id: string){
             (new MedicineService()).getMedicineById(id).then((result: any)=>{
                 this.form = result;
             })
        },
        onSubmit(){
            this.$store.commit('start');
            axios.post(GetApiRoute(ApiRoutes.ADD_MEDICINE),this.form).then(response=>{
                const message = (this.id!=undefined)? "Medicine Updated":"Medicine Created";
                if(response.status==200){
                this.$store.commit('setSuccessMsg',message);
                const navigationService =new NavigationService();
                navigationService.redirect(this,"medicines");
                }
                this.$store.commit('finish');
            });
            },
        onReset(){
                this.$store.commit('clearMessage');
                const navigationService =new NavigationService();
                navigationService.redirect(this,"medicines");
        },
    },
}
</script>