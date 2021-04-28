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
        <b-form class="row" @submit.prevent="handleSearch" @reset.prevent="onClearSearch">
          <div class="col-md-3">
            <b-form-group
              id="input-group-patient-id"
              label="Invoice ID:"
              label-for="invoice-id"
              description="Search By Invoice ID"
            >
              <b-form-input
                id="invoice-id"
                placeholder="Invoice ID"
                v-model="invoiceId"
              ></b-form-input>
            </b-form-group>
          </div>
          <div class="col-md-3">
            <b-form-group
              id="input-group-patient-id"
              label="Fullname:"
              label-for="fullanme"
              description="Search By Fullname"
            >
              <b-form-input
                id="fullname"
                placeholder="Fullname"
                v-model="fullName"
              ></b-form-input>
            </b-form-group>
          </div>
          <div class="col-md-3">
            <b-form-group
              id="input-group-patient-id"
              label="Patient ID:"
              label-for="patient-id"
              description="Search By Patient ID"
            >
              <b-form-input
                id="patient-id"
                placeholder="Patient ID"
                v-model="pid"
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
import { LabTestService, PatientInvoiceService } from "@/services";
export default {
  data() {
    return {
      title: "Lab Test Reports",
      fields: [
        { key: "invoiceNumber", sortable: true },
        { key: "serviceName", sortable: true },
        { key: "fullName", sortable: true },
        { key: "pid", sortable: true },
        { key: "createdAt", sortable: true },
        { key: "status", sortable: true },
        "action",
      ],
      invoiceId:'',
      fullName:'',
      pid:'',
      perPage: 5,
      currentPage: 1,
      labTests: [],
      totalRows: 0,
      totalPages: 0,
      sortBy: "",
      sortDesc: false,
      invoiceNumbers: [],
    };
  },
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
    handleSort(ctx) {
      this.sortBy = ctx.sortBy;
      this.sortDesc = ctx.sortDesc;
      this.currentPage = 1;
      this.fetchLabtests();
    },
    // handleInvoiceNumberAutocomplete(invoice, autocomplete) {
    //   // (new PatientInvoiceService()).getInvoiceById(invoice.id).then(result => {
    //   //   this.invoice = result;
    //   // }
    // },
    // handleInvoiceNumberAjaxCall(searchText) {
    //   // if (searchText.length >= 2) {
    //   new PatientInvoiceService()
    //     .getInvoiceNumbers(searchText)
    //     .then((result) => {
    //       this.invoiceNumbers = result.collection;
    //     });
    //   // }
    // },

    handleSearch(){
      this.fetchLabtests();
    },
    onClearSearch(){
      this.invoiceId='';
      this.fullName='';
      this.pid='';
      this.fetchLabtests();
    },
    fetchLabtests() {
      this.$store.commit("start");
      const q = {
        invoiceNumber: this.invoiceId,
        fullName: this.fullName,
        pid: this.pid,
        page: this.currentPage - 1,
        size: this.perPage,
        sortBy: this.sortBy,
        sortDesc: this.sortDesc,
      };
      console.log(q)
      new LabTestService().getLabTests(q).then((result) => {
        this.labTests = result.content;
        this.totalRows = result.totalElements;
        this.totalPages = result.totalPages;
        console.log(this.labTests);
        this.$store.commit("finish");
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