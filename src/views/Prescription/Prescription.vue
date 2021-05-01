<template>
  <div>
    <!-- <ContentBar :PageTitle="title"/> -->
    <b-alert v-model="isSuccess" variant="success">{{ message }}</b-alert>
    <b-alert v-model="isError" variant="danger">{{ message }}</b-alert>

    <cCard>
      <CCardHeader>
        Prescription List
        <router-link
          to="/prescription"
          class="btn btn-primary btn-sm float-right"
          >New Prescription</router-link
        >
      </CCardHeader>
      <CCardBody>
         <b-form class="row" @submit.prevent="handleSearch" @reset.prevent="onClearSearch">
          
          <div class="col-md-3">
            <b-form-group
              id="input-group-patient-id"
              label="Prescription No:"
              label-for="pNumber"
              
            >
              <b-form-input
                id="pNumber"
                placeholder="Prescription No"
                v-model="pNumber"
              ></b-form-input>
            </b-form-group>
          </div>
          <div class="col-md-3">
            <b-form-group
              id="input-group-patient-id"
              label="Patient Name:"
              label-for="fullName"
              
            >
              <b-form-input
                id="name"
                placeholder="Patient Name"
                v-model="fullName"
              ></b-form-input>
            </b-form-group>
          </div>
          <div class="col-md-3">
            <b-form-group
              id="input-group-patient-id"
              label="By Date:"
              label-for="date"
              
            >
              <b-form-input
                id="name"
                placeholder="By Date"
                type="date"
                v-model="date"
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
          id="prescription-table"
          :fields="fields"
          @sort-changed="handleSort"
          :per-page="0"
          :busy.sync="isBusy"
          :current-page="currentPage"
          :items="prescriptions"
          hover
          bordered
          striped
          small
        >
          <template #cell(fullName)="row">
            <router-link :to="'/patients/' + row.item.id">{{
              row.item.fullName
            }}</router-link>
          </template>
          <template #cell(createdAt)="row">
            <span>{{ showDate(row.item.createdAt) }}</span>
          </template>
          <template #cell(action)="row">
            <b-button
              size="sm"
              variant="info"
              @click="viewDetail(row.item.prescriptionId)"
              >Detail</b-button
            >
            <!-- <b-button size="sm" variant="" class="ml-1"><b-icon-printer></b-icon-printer> Print</b-button> -->
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
import { PrescriptionService } from "@/services";
export default {
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
      title: "My Prescriptions",
      prescriptions: [],
      totalPages: 0,
      totalRows: 0,
      perPage: 10,
      currentPage: 1,
      sortBy:'',
      sortDesc:false,
      fields: [
        { key: "pNumber", label: "Prescription No",sortable:true },
        { key: "fullName", label: "Patient Name", sortable:true },
        { key: "createdAt", label: "Date", sortable: true },
        "action",
      ],
      pNumber:'',
      fullName:'',
      date:''
    };
  },
  mounted() {
    this.fetchPrescriptions();
  },
  watch: {
    currentPage: {
      handler: function () {
        this.fetchPrescriptions();
      },
    },
  },
  methods: {
    onClearSearch(){
      this.pNumber = '';
      this.fullName = '';
      this.date = '';
      this.fetchPrescriptions();
    },
    handleSearch(){
      this.fetchPrescriptions();
    },
    handleSort(ctx){
      this.sortBy = ctx.sortBy;
      this.sortDesc = ctx.sortDesc;
      this.currentPage = 1;
      this.fetchPrescriptions();
    },
    fetchPrescriptions() {
      this.$store.commit("start");
      const q = {
        pNumber: this.pNumber,
        fullName: this.fullName,
        date: this.date,
        page: (this.currentPage-1),
        size: this.perPage,
        sortBy: this.sortBy,
        sortDesc: this.sortDesc
      };
      new PrescriptionService()
        .getPrescriptions(q)
        .then((result) => {
          this.prescriptions = result.content;
          this.totalPages = result.totalPages;
          this.totalRows = result.totalElements;
          this.$store.commit("finish");
        });
    },
    viewDetail(id) {
      this.$router.push("/prescriptions/" + id);
    },
    showDate(createdAt) {
      return new Date(createdAt)
        .toLocaleString()
        .substr(0, 10)
        .replace(",", "");
    },
  },
};
</script>
