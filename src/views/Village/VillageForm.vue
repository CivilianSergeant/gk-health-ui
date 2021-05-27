<template>
    <div>
        <CCard>
            <CCardHeader>Add Village <router-link
          to="/villages"
          class="btn btn-primary btn-sm float-right"
          >Village List</router-link
        ></CCardHeader>
        <b-form @submit.prevent="onSubmit" @reset.prevent="onReset">
            <CCardBody>
                <div class="row">
                    <div class="col-md-4">
                        <b-form-group
                            id="input-group-1"
                            label="Region Office"
                            label-for="input-1"
                            description=""
                        >
                            <!-- <label> Region Office: </label> -->
                           <b-form-select  @change="handleChangeRaOffice" :options="raOffices"></b-form-select>
                        </b-form-group>
                        </div>
                    <div class="col-md-4" >
                            <!-- <Loader :isBusy="isBusy" /> -->
                            <b-form-group
                            id="input-group-hc-office"
                            label="HC Office:"
                            label-for="hc-office"
                            >
                                <b-form-select :options="hcOffices"  v-model="form.hcoffice.id"></b-form-select>
                            </b-form-group>
                    </div>
                    <div class="col-md-4">
                        <b-form-group
                            id="input-group-1"
                            label-for="input-1"
                            description=""
                        >
                            <label> Division: <span class="text-danger">*</span></label>
                            <b-form-select
                            required
                            id="divisions"
                            v-model="form.division.id"
                            ></b-form-select>
                        </b-form-group>
                        </div>
                    
                    <div class="col-md-4">
                        <b-form-group
                            id="input-group-1"
                            label-for="input-1"
                            description=""
                        >
                            <label> District: <span class="text-danger">*</span></label>
                            <b-form-select
                            required
                            v-model="form.district.id"
                            id="divisions"
                            ></b-form-select>
                        </b-form-group>
                        </div>
                        <div class="col-md-4">
                        <b-form-group
                            id="input-group-1"
                            label-for="input-1"
                            description=""
                        >
                            <label> Upazila: <span class="text-danger">*</span></label>
                            <b-form-select
                            required
                            v-model="form.upazila.id"
                            id="upazila"
                            ></b-form-select>
                        </b-form-group>
                        </div>
                        <div class="col-md-4">
                        <b-form-group
                            id="input-group-1"
                            label-for="input-1"
                            description=""
                        >
                            <label> Union: <span class="text-danger">*</span></label>
                            <b-form-select
                            required
                            v-model="form.union.id"
                            id="unions"
                            ></b-form-select>
                        </b-form-group>
                        </div>
                        <div class="col-md-4">
                        <b-form-group
                            id="input-group-1"
                            label-for="input-1"
                            description=""
                        >
                            <label> Village: </label>
                            <b-form-select
                            id="villages"
                            v-model="form.village.id"
                            ></b-form-select>
                        </b-form-group>
                        </div>
                        <div class="col-md-4">
                            <b-form-group>
                                <label>Village Code </label>
                                <b-form-input v-model="form.villageCode"></b-form-input>
                            </b-form-group>
                        </div>
                         <div class="col-md-4">
                            <b-form-group>
                                <label>Village Name </label>
                                <b-form-input v-model="form.villageName"></b-form-input>
                            </b-form-group>
                        </div>
                    </div>
            </CCardBody>
            <CCardFooter>
                 <div class="row mt-2 mb-2">
            <div class="col-md-3 d-flex justify-content">
              <b-button type="submit" variant="info"
                ><CIcon name="cil-check-circle" /> Submit</b-button
              >
              <b-button type="reset" class="ml-2" variant="danger">
                <CIcon name="cil-x-circle" /> Cancel</b-button
              >
            </div>
          </div>
            </CCardFooter>
        </b-form>
        </CCard>
    </div>
</template>

<script>
import {
  NavigationService,
} from "@/services";
import { CenterService } from "@/services/CenterService";


export default {
    computed: {
    showRaOfficeList(){
      return (this.$store.getters.center.officeTypeId == 1 || this.$store.getters.center.officeTypeId ==4);
    },
    rows() {
      return this.totalRows;
    },
    isBusy() {
      return this.$store.state.isBusy;
    },
    center() {
      return this.$store.getters.center;
    },
  },
    data(){
        return {
            form: { centerId: null,
            hcoffice:{id:null},
            division:{id:null},
            district:{id:null},
            upazila:{id:null},
            thana:{id:null},
            union:{id:null},
            village:{id:null},
            villageCode:null,
            villageName:null, },
            // selectedCenter: null,
            currentCenter:null,
            raCenters:[],
            raOffices:[], 
            hcOffices:[],
            centers:[],
        }
    },
    mounted(){
        this.fetchRaOffice();
        this.fetchCenters();
    },
    methods:{
        fetchRaOffice(){
            (new CenterService()).getRaCenters().then(result=>{
                this.raCenters = result;
                result.map(ra=>{
                this.raOffices.push({value:ra.id,text:ra.name})
                });
            });
        },
      
         handleChangeRaOffice(val){
            this.currentCenter = val;
            this.hcOffices = [];
            this.fetchHcOffice();
        },
        fetchHcOffice(){
            this.$store.commit('start')
            console.log(this.currentCenter);
            const raOffice = (this.raCenters.length>0)?(this.raCenters.filter(r=>r.id == this.currentCenter))[0] :
            this.$store.getters.center;
            console.log(raOffice);
            (new CenterService()).getCentersByThirdLevel(raOffice).then(result=>{
            this.hcCenters = result;
            if(result.length>0){
                result.forEach(hc=>this.hcOffices.push({value:hc.id,text:hc.name}));
            }
            this.$store.commit('finish');
            });
        },
        fetchCenters(){
             (new CenterService()).getCenters().then(result=>{
                     this.centers = result;
                     result.map(m=>{
                         this.hcOffices.push({value:m.id,text:m.name});
                     })
                 });
        },
        onReset() {
            this.$store.commit("clearMessage");
            const navigationService = new NavigationService();
            navigationService.redirect(this, "/villages");
        },
        
    }
};
</script>