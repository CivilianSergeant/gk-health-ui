<template>
  <div>
    <ContentBar :PageTitle="title" />
    <b-alert v-model="isSuccess" variant="success">{{ message }}</b-alert>
    <b-alert v-model="isError" variant="danger">{{ message }}</b-alert>

    <h5>
      All Reports
      <router-link
        to="/lab-tests/add"
        class="btn btn-primary btn-sm float-right"
        >Create Lab Test Report</router-link
      >
    </h5>
    <Loader :isBusy="isBusy" />
    <b-table
      striped
      hover
      class="mt-4"
      id="lab-tests"
      :fields="fields"
      :items="labTests"
    >
      <template #cell(action)="row">
        <router-link
          class="btn btn-primary btn-sm"
          :to="'/lab-test/' + row.item.id + '/edit'"
          >Edit</router-link
        >
        &nbsp;&nbsp;
        <!-- <b-button size="sm" variant="success">Eidit</b-button> &nbsp;&nbsp; -->
        <b-button size="sm" variant="info" @click="viewDetail(row.item.id)"
          >Detail</b-button
        >
      </template>
    </b-table>
  </div>
</template>

<script>
import { LabTestService } from "@/services";
export default {
  data() {
    return {
      title: "Lab Test Reports",
      fields: [
        "invoiceNumber",
        "serviceName",
        "fullName",
        "pid",
        "createdAt",
        "action",
      ],
      perPage: 20,
      currentPage: 1,
      labTests: [],
      totalRows: 0,
    };
  },
  computed: {
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
  methods: {
    fetchLabtests() {
      new LabTestService().getLabTests().then((result) => {
        this.labTests = result;
        console.log(this.labTests);
        this.totalRows = this.labTests.length;
      });
    },
    viewDetail(id) {
      this.$router.push("/lab-test/" + id);
    },
  },
};
</script>