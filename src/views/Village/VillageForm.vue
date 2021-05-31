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
                <div class="row py-2" style="background:#f2f2f2">
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
                    <div class="col-md-4">
                            <!-- <Loader :isBusy="isBusy" /> -->
                            <b-form-group
                            id="input-group-hc-office"
                            label="HC Office:"
                            label-for="hc-office"
                            >
                                <b-form-select :options="hcOffices"  v-model="form.centerId"></b-form-select>
                            </b-form-group>
                    </div>
                </div>
                <hr>
                <div class="row mt-3">
                    <div class="col-md-4">
                        <b-form-group
                            id="input-group-1"
                            label-for="input-1"
                            description=""
                        >
                            <label> Division: <span class="text-danger">*</span></label>
                            <b-form-select
                            required
                            :options="divisions"
                            id="divisions"
                             @change="handleChangeDivision"
                            v-model="form.divisionId"
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
                            :disabled="districts.length==0 || form.divisionId==null"
                            :options="districts"
                            @change="handleChangeDistrict"
                            v-model="form.districtId"
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
                            :options="thanas"
                            :disabled="thanas.length==0 || form.districtId==null"
                            v-model="form.thanaId"
                            @change="handleChangeThana"
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
                            :disabled="unions.length==0 || form.thanaId==null"
                            :options="unions"
                            @change="handleChangeUnion"
                            v-model="form.unionId"
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
                            :disabled="villages.length==0 || form.unionId==null"
                            :options="villages"
                            v-model="form.lgVillageId"
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
  LocationService
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
            form: {
            //id: "null",
            centerId:null,
            divisionId:null,
            districtId:null,
            thanaId:null,
            unionId:null,
            lgVillageId:null,
            villageCode:null,
            villageName:null, 
            },
            // selectedCenter: null,
            currentCenter:null,
            raCenters:[],
            raOffices:[], 
            hcOffices:[],
            centers:[],
            divisions:[],
            districts:[],
            thanas:[],
            unions:[],
            villages:[],

        }
    },
    mounted(){
        this.fetchRaOffice();
        this.fetchCenters();
        this.fetchDivisions();
        //console.log("centerid-",this.$store.getters.center.id);
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
        fetchDivisions(){
             (new LocationService()).getDivisions().then(result=>{
                result.unshift({ divisionId: null, divisionName: "Select Division" });
                result.map(r => {
                     this.divisions.push({value:r.divisionId,text:r.divisionName});
                }) 
            });
        },
        handleChangeDivision(val){
            this.selectedDvision = val;
            //console.log(this.selectedDvision);
            this.districts = [];
            this.unions = [];
            this.thanas = [];
            this.villages = [];

            this.getDistrictList(val);
        },
        getDistrictList(id){
            //console.log(id);
             (new LocationService()).getDistrictBydivisionId(id).then(result=>{
                result.collection.unshift({ districtId: null, districtName: "Select District" });
                result.collection.map(r => {
                     this.districts.push({value:r.districtId,text:r.districtName});
                }) 
                this.$store.commit('finish'); 
            });
        },
        handleChangeDistrict(val){
            this.thanas = [];
            this.unions = [];
            this.villages = [];
            this.getThanaList(val);
        },
        getThanaList(id){
             (new LocationService()).getThanaBydistrictId(id).then(result=>{
                result.collection.unshift({ thanaId: null, thanaName: "Select Upozilla" });
                result.collection.map(r => {
                     this.thanas.push({value:r.thanaId,text:r.thanaName});
                }) 
                this.$store.commit('finish'); 
            });
        },
        handleChangeThana(val){
            this.unions = [];
            this.villages = [];
            this.getUnionList(val);
        },
        getUnionList(id){
             (new LocationService()).getUnionByThanaId(id).then(result=>{
                result.collection.unshift({ unionId: null, unionName: "Select Union" });
                result.collection.map(r => {
                     this.unions.push({value:r.unionId,text:r.unionName});
                }) 
                this.$store.commit('finish'); 
            });
        },
        handleChangeUnion(val){
            this.villages = [];
            this.getVillageList(val);
        },
        getVillageList(unionId){
             (new LocationService()).getVillageByUnionId(unionId).then(result=>{
                result.collection.unshift({ lgVillageId: null, villageName: "Select Village" });
              
                result.collection.map(r => {
                     this.villages.push({value:r.lgVillageId,text:r.villageName});
                })
               
                this.$store.commit('finish'); 
            });
        },
        onSubmit(){
             
            this.$store.commit("start");
            if(this.villages.length<0){
            new LocationService().addLocation(this.form,() => {
                const message =
                this.id != undefined ? "Location Updated" : "Location Created";
                this.$store.commit("setSuccessMsg", message);
                this.$store.commit("finish");
                const navigationService = new NavigationService();
                navigationService.redirect(this, "Villages");
            });
            }else{
                 const req={
                     healthCenter:{id:this.form.centerId},
                     village:{lgVillageId:this.form.lgVillageId}
                 };

                 new LocationService().locationMapping(req,() => {
                const message =
                this.id != undefined ? "" : "Location Mapped";
                this.$store.commit("setSuccessMsg", message);
                this.$store.commit("finish");
                const navigationService = new NavigationService();
                navigationService.redirect(this, "Villages");
            });
            }
        },
        onReset() {
            this.$store.commit("clearMessage");
            const navigationService = new NavigationService();
            navigationService.redirect(this, "Villages");
        },
        
    }
};
</script>