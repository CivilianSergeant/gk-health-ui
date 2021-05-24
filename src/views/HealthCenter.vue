<template>
  <div>
    <!-- <ContentBar :PageTitle="title"/> -->
    <b-alert v-model="isSuccess" variant="success">{{ message }}</b-alert>
    <b-alert v-model="isError" variant="danger">{{ message }}</b-alert>
    <!-- <h5> All Centers</h5> -->
    <CCard>
      <CCardBody>
        <b-form @submit.prevent="onSearch" @reset.prevent="onReset">
            <div class="row" >
            <div class="col-md-3" v-if="showRaOfficeList">
              <b-form-group
              id="input-group-regional-office"
              label="Region Office:"
              label-for="regional-office"
              >
                <b-form-select :options="raOffices" v-model="search.raOffice"></b-form-select>
              </b-form-group>
            </div>
            
          </div>
          <div class="row">
            <div class="col-md-3" >
              <b-form-group
              id="input-group-name"
              label="Office/Center Name:"
              label-for="name"
              >
              <b-form-input placeholder="Name" v-model="search.name"></b-form-input>
              </b-form-group>
          </div>
          <div class="col-md-3" >
              <b-form-group
              id="input-group-office-code"
              label="Office/Center Code:"
              label-for="code"
              >
              <b-form-input placeholder="Office Code" v-model="search.code"></b-form-input>
              </b-form-group>
          </div>
          <div class="col-md-3 pt-4">
            <b-button type="submit" variant="success" class="mr-2">Search</b-button>
            <b-button type="reset" variant="warning">Clear</b-button>
          </div>
          </div>
        </b-form>
      </CCardBody>
    </CCard>

    <CCard>
      <CCardHeader>All Centers</CCardHeader>
      <CCardBody>
        <div class="table-responsive">
        <b-table
          id="center-table"
          class="position-relative"
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
        </div>
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
    center() {
      return this.$store.getters.center;
    }
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
      search:{raOffice:'',name:'',code:''}
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
    onSearch(){
      this.fetchCenters();
    },
    onReset(){
      this.search.raOffice='';
      this.search.name = '';
      this.search.code = '';
      this.fetchCenters();
    },
    handleChangeRaOffice(val){
      this.center = val;
      this.hcOffices = [];
      this.fetchHcOffice();
    },
    handleChangeHcOffice(val){
      this.center = val;
      this.hcOffices = [];
      // this.fetchHcOffice();
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
      const raOffice = (this.raCenters.filter(ra=>ra.id==this.search.raOffice));
      const q = {
        center: (raOffice.length==1)? raOffice[0].centerCode:'',
        name: this.search.name,
        code: this.search.code,
        page: (this.currentPage -1 ),
        size: this.perPage,
        sortBy: this.sortBy,
        sortDesc: this.sortDesc
      }
      console.log(this.search)
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