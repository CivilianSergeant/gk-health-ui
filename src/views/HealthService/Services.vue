<template>
  <div id="service-list">
    <b-alert v-model="isSuccess" variant="success">{{ message }}</b-alert>
    <b-alert v-model="isError" variant="danger">{{ message }}</b-alert>
    <CCard>
      <CCardHeader>
        
          All Services

          <router-link
            to="/services/add"
            class="btn btn-primary btn-sm float-right"
            >Add Service</router-link
          >
        
      </CCardHeader>
      <CCardBody>
        <b-form class="row" @submit.prevent="handleSearch" @reset.prevent="onClearSearch">
          
          <div class="col-md-3">
            <b-form-group
              id="input-group-patient-id"
              label="Name:"
              label-for="name"
              description="Search By Service name"
            >
              <b-form-input
                id="name"
                placeholder="Name"
                v-model="name"
              ></b-form-input>
            </b-form-group>
          </div>
          
          <div class="col-md-3 mt-4 px-0" style="margin-top: 1.8rem !important">
            <b-button type="submit" variant="info">Search</b-button>
            <b-button type="reset" class="ml-1" variant="warning"
              >Clear</b-button
            >
          </div>
        </b-form>
      </CCardBody>
    </CCard>
    <CCard>
      <CCardBody>
    <b-table id="service-table" v-if="!showForm" :fields="fields" 

        @sort-changed="handleSort"
        :per-page="0" 
        :busy.sync="isBusy" 
        :bordered="true" 
        :striped="true" 
        :small="true"
        :filter-included-fields="filterOn"
        :current-page="currentPage" 
        :items="services">
        <template #cell(active)="row">
          <span v-if="row.item.active" class="badge badge-success">Active </span>
          <span v-if="!row.item.active" class="badge badge-danger">Inactive </span>
        </template>
        <template #cell(labTestGroup)="row">
         
          <span v-if="row.item.labTestGroup" :class="'badge badge-'+ getColor(row.item.labTestGroup.name)">{{row.item.labTestGroup.name}} </span>
          <span v-if="!row.item.labTestGroup" >N/A </span>
        </template>
        <template #cell(action)="row">
            <router-link class="btn btn-primary btn-sm " :to="'/services/'+row.item.serviceId+'/detail'">Edit</router-link>
        </template>
      </b-table>
      <Loader :isBusy="isBusy"/>
      <b-pagination v-if="!showForm"
        v-model="currentPage"
        :total-rows="rows"
        :per-page="perPage"
        aria-controls="service-table"
      ></b-pagination>
      </CCardBody>
    </CCard>
  </div>
</template>

<script>
import { CategoryService } from "@/services/CategoryService";
import { HealthService } from "@/services/HealthService";

export default {
  name: "Services",
  computed: {
    isCategoryPathology() {
      let _isCategoryPathology = false;
      this.categories.forEach((c) => {
        if (
          c.id == this.form.serviceCategory.id &&
          c.text.toString().toLowerCase().match("pathology")
        ) {
          _isCategoryPathology = true;
        }
      });

      return _isCategoryPathology;
    },
    rows() {
      return this.totalRows; //this.services.length
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
  data(){
      return {
        title: "Services",
        services:[],
        fields:[
        {key:'serviceCategory.name',label:'Service Category', sortable:true},
        {key:'name',sortable:true},
        {key:'currentGbCost','label':'GB Cost', sortable:true}, 
        {key:'currentCost','label':'Non CH-GB Cost', sortable:true},
        {key:'labTestGroup','label':'Lab Test Group', sortable:true},
        {key:'active',sortable:true},'action'],
        perPage: 10,
        currentPage: 1,
        showForm:false,
        categories:[],
        labTestGroups:[],
        form:{name:'',active:true,serviceCategory:{id:null}},
        filter: null,
        filterOn: [],
        totalRows:0,
        totalPages:0,
        sortBy:"",
        sortDesc:false,
        name:''
      }
  },
  watch: {
    currentPage: {
      handler: function() {
        this.fetchServices();
      }
    }
  },
  beforeMount() {
    this.$store.commit("clearErrorMsg");
    this.fetchServices();
  },
  methods: {
    getColor(name) {
      console.log(name.toString().toLowerCase().charAt(0));
      if (name.toString().toLowerCase().charAt(0) == "b") {
        return "warning";
      } else if (name.toString().toLowerCase().charAt(0) == "h") {
        return "danger";
      } else {
        return "info";
      }
    },
    fetchServiceCategories() {
      this.$store.commit("start");
      new CategoryService().getCategories().then((result) => {
        this.categories.push({ value: null, text: "Select Category" });
        result.forEach((category) => {
          this.categories.push({
            value: category.id,
            text: category.name,
            id: category.id,
          });
        });
        this.$store.commit("finish");
      });
    },
    handleSort(ctx){
      this.sortBy = ctx.sortBy;
      this.sortDesc = ctx.sortDesc;
      this.currentPage = 1;
      this.fetchServices();
    },
    handleSearch(){
      this.fetchServices();
    },
    onClearSearch(){
      this.name = '';
      this.fetchServices();
    },
    fetchServices(){
      this.$store.commit('start');
      const searchablePagable = {
        serviceName:this.name,
        sortBy: this.sortBy,
        sortDesc: this.sortDesc,
        page: (this.currentPage -1 ),
        size: this.perPage
      };
      (new HealthService()).getServices(searchablePagable).then(result=>{
        this.services=result.content;
        this.totalPages = result.totalPages;
        this.totalRows = result.totalElements;
        this.$store.commit('finish');
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
<style scoped>
#service-table .btn-sm,
.btn-group-sm > .btn {
  padding: 0.05rem 0.5rem;
}
</style>
