<template>
  <div>
    <ContentBar :PageTitle="title"/>
    <b-alert v-model="isError" variant="danger">{{errorMsg}}</b-alert>
    <h5>All Employees</h5>
      <b-table id="employee-table" :fields="fields" :per-page="perPage" 
      :current-page="currentPage" :items="employees"></b-table>
      <Loader :isBusy="isBusy"/>
      <b-pagination
        v-model="currentPage"
        :total-rows="rows"
        :per-page="perPage"
        aria-controls="employee-table"
      ></b-pagination>
  </div>
</template>

<script>
import { Employee } from '@/entity/Employee';
import { EmployeeService }from '@/services/EmployeeService'
export default {
  name: 'Employees',
  computed: {
    rows() {
      return this.employees.length
    }
  },
  data(){
      return {
        title: "Employees",
        employees:[],
        isBusy:false,
        isError:false,
        errorMsg:'',
        fields:[{'apiEmployeeId':'Employee ID'},{'center.name':'Center'},'fullName','designation','contactNumber','email'],
        currentPage: 1,
        perPage: 20,
      }
  },
  beforeMount(){
    this.fetchEmployees();
  },
  methods:{
    fetchEmployees(){
      this.isBusy = true;
      (new EmployeeService).getEmployees().then(result=> {this.employees = result; this.isBusy=false;})
      .catch(error=>{
        this.isError=true;
        this.isBusy=false;
        if(error.toString().match('Error: Network Error') !=null){
          this.errorMsg = 'Opps! Network Error, Please try again later'
        }else if(error.toString.length>0){
          this.errorMsg = error;
        }
      });
    }
  }
}
</script>