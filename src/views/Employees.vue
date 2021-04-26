<template>
  <div>
    <!-- <ContentBar :PageTitle="title"/> -->
    <b-alert v-model="isError" variant="danger">{{ message }}</b-alert>
    <cCard>
      <CCardHeader>All Employees</CCardHeader>
      <CCardBody>
        <b-table
          id="employee-table"
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
export default {
  name: "Employees",
  computed: {
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
      sortDesc:false
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
  },
  methods: {
    handleSort(ctx){
      this.sortBy = ctx.sortBy;
      this.sortDesc = ctx.sortDesc;
      this.currentPage = 1;
      this.fetchEmployees();
    },
    fetchEmployees() {
      this.$store.commit("start");
      const q = {
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