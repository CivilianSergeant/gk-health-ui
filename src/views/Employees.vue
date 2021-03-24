<template>
  <div>
    <ContentBar :PageTitle="title"/>
    <b-alert v-model="isError" variant="danger">{{message}}</b-alert>
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
import { EmployeeService }from '@/services/EmployeeService'
export default {
  name: 'Employees',
  computed: {
    rows() {
      return this.employees.length
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
        title: "Employees",
        employees:[],
        fields:[{'apiEmployeeId':'Employee ID'},{'center.name':'Center'},'fullName','designation','contactNumber','email'],
        currentPage: 1,
        perPage: 20,
      }
  },
  beforeMount(){
    this.$store.commit('clearErrorMsg');
    this.fetchEmployees();
  },
  methods:{
    fetchEmployees(){
      // (new EmployeeService).getRemoteEmployees().then(res=>{
      //   console.log(res)
      // });
      this.$store.commit('start');
      (new EmployeeService).getEmployees().then(result=> {
          this.employees = result; 
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
    }
  }
}
</script>