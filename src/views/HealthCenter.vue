<template>
  <div>
    <!-- <ContentBar :PageTitle="title"/> -->
    <b-alert v-model="isSuccess" variant="success">{{ message }}</b-alert>
    <b-alert v-model="isError" variant="danger">{{ message }}</b-alert>
    <!-- <h5> All Centers</h5> -->
    <CCard>
      <CCardBody>
        <b-form>
            <div class="row" >
            <div class="col-md-3" v-if="showRaOfficeList">
              <b-form-group
              id="input-group-regional-office"
              label="Region Office:"
              label-for="regional-office"
              >
                <b-form-select :options="raOffices" @change="handleChangeRaOffice" v-model="search.raoffice"></b-form-select>
              </b-form-group>
            </div>
            <div class="col-md-3" >
              <Loader :isBusy="isBusy" />
              <b-form-group v-if="hcOffices.length>0"
              id="input-group-hc-office"
              label="HC Office:"
              label-for="hc-office"
              >
                <b-form-select :options="hcOffices" @change="handleChangeHcOffice" v-model="search.hcoffice"></b-form-select>
              </b-form-group>
            </div>
          </div>

        </b-form>
      </CCardBody>
    </CCard>

    <CCard>
      <CCardHeader>All Centers</CCardHeader>
      <CCardBody>
        <b-table
          id="center-table"
          :fields="fields"
          @filtered="onFiltered"
          @sort-changed="handleSort"
          :per-page="0"
          :filter="filter"
          :filter-included-fields="filterOn"
          :current-page="currentPage"
          :items="centers"
          bordered
          hover
          striped
          small
        ></b-table>
        <Loader :isBusy="isBusy" />
        <b-pagination
          v-model="currentPage"
          :total-rows="rows"
          :per-page="perPage"
          aria-controls="center-table"
        ></b-pagination>
      </CCardBody>
    </CCard>
  </div>
</template>

<script>
import { CenterService } from "@/services/CenterService";
import { handleCatch } from "@/helpers/ApiRoutes";

export default {
  name: "HealthCenter",
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
    isError() {
      return this.$store.state.isError;
    },
    isSuccess() {
      return this.$store.state.isSuccess;
    },
    message() {
      return this.$store.state.message;
    },
  },
  data() {
    return {
      title: "Health Center",
      centers: [],
      fields: [
        {key: "name",sortable: true},
        {key: "apiOfficeId", sortable: true},
        {key: "centerCode", sortable: true},
        {key: "officeLevel", sortable: true},
        {key: "officeTypeId", sortable: true},
        {key: "firstLevel", sortable: true},
        {key: "secondLevel", sortable: true},
        {key: "thirdLevel", sortable: true},
        {key: "fourthLevel", sortable: true},
      ],
      currentPage: 1,
      perPage: 10,
      filter: null,
      filterOn: [],
      totalRows: 0,
      totalPages:0,
      sortBy:'',
      sortDesc:false,
      raOffices:[],
      raCenters:[],
      hcOffices:[],
      search:{}
    };
  },
  watch: {
    currentPage: {
      handler: function() {
        this.fetchCenters();
      }
    }
  },
  beforeMount() {
    this.$store.commit("clearErrorMsg");
    this.fetchCenters();
    
    this.fetchOffice();
    
  },

  methods: {
    handleChangeRaOffice(val){
      this.center = val;
      this.hcOffices = [];
      this.fetchHcOffice();
    },
    handleChangeHcOffice(val){
      this.center = val;
      this.hcOffices = [];
      this.fetchHcOffice();
    },
    fetchRaOffice(){
      (new CenterService()).getRaCenters().then(result=>{
        this.raCenters = result;
        result.map(ra=>{
          this.raOffices.push({value:ra.id,text:ra.name})
        });
      });
    },
    fetchHcOffice(){
      this.$store.commit('start')
      console.log(this.center);
      const raOffice = (this.raCenters.length>0)?(this.raCenters.filter(r=>r.id == this.center))[0] :
      this.$store.getters.center;
      console.log(raOffice);
      (new CenterService()).getCentersByThirdLevel(raOffice).then(result=>{
        if(result.length>0){
          result.forEach(hc=>this.hcOffices.push({value:hc.id,text:hc.name}));
        }
        this.$store.commit('finish');
      });
    },
    handleSort(ctx){
      this.sortBy = ctx.sortBy;
      this.sortDesc = ctx.sortDesc;
      this.currentPage = 1;
      this.fetchCenters();
    },
    fetchOffice(){
      if(this.$store.getters.center.officeTypeId==1 || this.$store.getters.center.officeTypeId==4){
        this.fetchRaOffice();
      }else if(this.$store.getters.center.officeTypeId == 5){
        this.fetchHcOffice();
      }
        
      
    },
    fetchCenters() {
      this.$store.commit("start");
      const q = {
        page: (this.currentPage -1 ),
        size: this.perPage,
        sortBy: this.sortBy,
        sortDesc: this.sortDesc
      }
      new CenterService().getCentersWithPagination(q).then((result) => {
        this.centers = result.content;
        this.totalRows = result.totalElements;
        this.totalPages = result.totalPages;
        this.$store.commit("finish");
      });
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
  },
};
</script>