<template>
  <div>
    <!-- <ContentBar :PageTitle="title"/> -->
    <b-alert v-model="isError" variant="danger">{{ message }}</b-alert>
    <cCard>
      <CCardHeader>All Employees</CCardHeader>
      <CCardBody>
        <b-form @submit.prevent="onSearch" @reset.prevent="onReset">
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
          <div class="row">
            <div class="col-md-3">
              <b-form-group
              id="input-group-employee-code"
              label="Employee Code:"
              label-for="employee-code"
              >
                <b-form-input
                 id="employee-code"
                placeholder="Employee Code"
                v-model="search.employeeCode"
                ></b-form-input>
              </b-form-group>
            </div>
            <div class="col-md-3">
              <b-form-group
              id="input-group-fullname"
              label="Fullname:"
              label-for="fullname"
              >
                <b-form-input
                 id="fullname"
                placeholder="Fullname"
                v-model="search.fullName"
                ></b-form-input>
              </b-form-group>
            </div>
            <div class="col-md-3">
              <b-form-group
              id="input-group-contact-no"
              label="Contact no:"
              label-for="contact-no"
              >
                <b-form-input
                 id="contact-no"
                placeholder="Contact No"
                v-model="search.contactNo"
                ></b-form-input>
              </b-form-group>
            </div>
            <div class="col-md-3">
              <b-form-group
              id="input-group-email"
              label="E-mail:"
              label-for="email"
              >
                <b-form-input
                 id="email"
                placeholder="E-mail"
                v-model="search.email"
                ></b-form-input>
              </b-form-group>
            </div>
          </div>
          <div class="row mb-3 "> 
            <div class="col-md-12  d-flex justify-content-end">
              <b-button type="submit" class="mr-2" variant="success">Search</b-button>
              <b-button type="reset" variant="warning">Clear</b-button>
            </div>
          </div>
        </b-form>
        <div class="table-responsive">
        <b-table
          id="employee-table"
          class="position-relative"
          :fields="fields"
          :per-page="0"
          :current-page="currentPage"
          :items="employees"
          @sort-changed="handleSort"
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
          aria-controls="employee-table"
        ></b-pagination>
      </CCardBody>
    </cCard>
  </div>
</template>

<script>
import { EmployeeService } from "@/services/EmployeeService";
import { CenterService } from '@/services';
export default {
  name: "Employees",
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
      title: "Employees",
      employees: [],
      search:{employeeCode:'',fullName:'',contactNo:'',email:''},
      fields: [
        { apiEmployeeId: "Employee ID", sortable: true },
        { key: "employeeCode", label: "Employee Code", sortable: true },
        { key:"center.name", label: "Center", sortable: true },
        {key:"fullName", sortable: true},
        {key:"designation",sortable: true},
        {key:"contactNumber", sortable:true},
        {key:"email", sortable: true},
      ],
      currentPage: 1,
      perPage: 20,
      totalRows:0,
      totalPages:0,
      sortBy:'',
      sortDesc:false,
      raOffices:[],
      raCenters:[],
      hcOffices:[],
      center:''
    };
  },
  watch: {
    currentPage: {
      handler: function() {
        this.fetchEmployees();
      }
    }
  },
  beforeMount() {
    this.$store.commit("clearErrorMsg");
    this.fetchEmployees();
    if(this.$store.getters.center.officeTypeId==1 || this.$store.getters.center.officeTypeId==4){
      this.fetchRaOffice();
    }
  },
  methods: {
    onSearch(){
      this.fetchEmployees();
    },
    onReset(){
      this.center='';
      this.search={employeeCode:'',fullName:'',contactNo:'',email:''};
      this.fetchEmployees();
    },
    handleChangeRaOffice(val){
      this.center = val;
      this.hcOffices = [];
      this.fetchHcOffice();
    },
    handleChangeHcOffice(val){
      this.center = val;
      
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
      const raOffice = (this.raCenters.filter(r=>r.id == this.center))[0];
      
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
      this.fetchEmployees();
    },
    fetchEmployees() {
      this.$store.commit("start");
      const q = {
        center: (this.center)? this.center : '',
        employeeCode: this.search.employeeCode,
        fullName: this.search.fullName,
        contactNo: this.search.contactNo,
        email: this.search.email,
        page: (this.currentPage-1),
        size: this.perPage,
        sortBy: this.sortBy,
        sortDesc: this.sortDesc
      }
      
      new EmployeeService()
        .getEmployees(q)
        .then((result) => {
          this.employees = result.content;
          this.totalRows = result.totalElements;
          this.totalPages = result.totalPages;
          this.$store.commit("finish");
        })
        .catch((error) => {
          this.$store.commit("finish");
          if (error.toString().match("Error: Network Error") != null) {
            this.$store.commit(
              "setErrorMsg",
              "Opps! Network Error, Please try again later"
            );
          } else if (error.toString.length > 0) {
            this.$store.commit("setErrorMsg", error);
          }
        });
    },
  },
};
</script>