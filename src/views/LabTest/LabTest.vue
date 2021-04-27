<template>
  <div>
    <!-- <ContentBar :PageTitle="title" /> -->
    <b-alert v-model="isSuccess" variant="success">{{ message }}</b-alert>
    <b-alert v-model="isError" variant="danger">{{ message }}</b-alert>

    <cCard>
      <CCardHeader>
        All Reports
        <router-link
          to="/lab-tests/add"
          class="btn btn-primary btn-sm float-right"
          >Create Lab Test Report</router-link
        >
      </CCardHeader>
      <CCardBody>
        <b-table
          striped
          hover
          bordered
          small
          class="mt-4"
          id="lab-tests"
          :fields="fields"
          :items="labTests"
          :per-page="0"
          :busy.sync="isBusy"
          :current-page="currentPage"
          @sort-changed="handleSort"
        >
          <template #cell(status)="row">
            <span
              v-if="row.item.status"
              :class="showStatusCss(row.item.status)"
              >{{ row.item.status }}</span
            >
          </template>
          <template #cell(action)="row">
            <router-link
              class="btn btn-primary btn-sm"
              :to="'/lab-tests/edit/' + row.item.id"
              >Edit</router-link
            >
            &nbsp;&nbsp;
            <!-- <b-button size="sm" variant="success">Eidit</b-button> &nbsp;&nbsp; -->
            <b-button size="sm" variant="info" @click="viewDetail(row.item.id)"
              >Detail</b-button
            >
          </template>
        </b-table>
        <Loader :isBusy="isBusy" />
        <b-pagination
          v-model="currentPage"
          :total-rows="rows"
          :per-page="perPage"
          aria-controls="prescription-table"
        ></b-pagination>
      </CCardBody>
    </cCard>
  </div>
</template>

<script>
import { LabTestService } from "@/services";
export default {
  data() {
    return {
      title: "Lab Test Reports",
      fields: [
        {key: "invoiceNumber", sortable: true},
        {key: "serviceName", sortable: true},
        {key: "fullName", sortable: true},
        {key: "pid", sortable: true},
        {key: "createdAt", sortable: true},
        {key: "status", sortable: true},
        "action",
      ],
      perPage: 5,
      currentPage: 1,
      labTests: [],
      totalRows: 0,
      totalPages:0,
      sortBy:'',
      sortDesc: false
    };
  },
  computed: {
    rows(){
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
  mounted() {
    this.fetchLabtests();
  },
  watch: {
    currentPage: {
      handler: function () {
        this.fetchLabtests();
      },
    },
  },
  methods: {
    handleSort(ctx){
      this.sortBy = ctx.sortBy;
      this.sortDesc = ctx.sortDesc;
      this.currentPage = 1;
      this.fetchLabtests();
    },
    fetchLabtests() {
      this.$store.commit('start');
      const q = {
        page: (this.currentPage-1),
        size: this.perPage,
        sortBy: this.sortBy,
        sortDesc: this.sortDesc
      };
      new LabTestService().getLabTests(q).then((result) => {
        this.labTests = result.content;
        this.totalRows = result.totalElements;
        this.totalPages = result.totalPages;
        console.log(this.labTests);
        this.$store.commit('finish')
      });
    },
    viewDetail(id) {
      this.$router.push("/lab-tests/" + id);
    },
    showStatusCss: function (status) {
      switch (status) {
        case "pending":
          return "badge badge-warning text-light text-capitalize";
        case "complete":
          return "badge badge-success text-light text-capitalize";
        case "processing":
          return "badge badge-primary text-light text-capitalize";
        case "delivered":
          return "badge badge-success text-light text-capitalize";
      }
      return "";
    },
  },
};
</script>