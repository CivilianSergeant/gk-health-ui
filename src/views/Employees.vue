<template>
  <div>
    <ContentBar :PageTitle="title"/>
    <h5>All Employees</h5>
      <b-table id="employee-table" :fields="fields" :per-page="perPage" :current-page="currentPage" :items="employees"></b-table>
      <b-pagination
        v-model="currentPage"
        :total-rows="rows"
        :per-page="perPage"
        aria-controls="employee-table"
      ></b-pagination>
  </div>
</template>

<script>
import ContentBar from '@/components/ContentBar.vue'
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
        fields:[{'apiEmployeeId':'Employee ID'},{'center.name':'Center'},'fullName','designation','contactNumber','email'],
        currentPage: 1,
        perPage: 20,
      }
  },
  components: {
    ContentBar
  },
  beforeMount(){
    (new EmployeeService).getEmployees().then(result=>this.employees = result);
  }
}
</script>