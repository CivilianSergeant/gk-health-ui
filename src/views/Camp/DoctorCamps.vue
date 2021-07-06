<template>
  <div>
    <b-alert v-model="isSuccess" variant="success">{{ message }}</b-alert>
    <b-alert v-model="isError" variant="danger">{{ message }}</b-alert>
    <CCard>
      <CCardHeader>
        Doctor Camp List
        <router-link
          to="/doctor-camp/add"
          class="btn btn-primary btn-sm float-right"
          >Add Doctor Camp</router-link
        ></CCardHeader
      >
      <CCardBody>
        <div class="table-responsive">
          <b-table
            id="event-list-table"
            class="position-relative"
            :fields="fields"
            @filtered="onFiltered"
            @sort-changed="handleSort"
            :per-page="0"
            :busy.sync="isBusy"
            :filter="filter"
            :filter-included-fields="filterOn"
            :current-page="currentPage"
            :items="medicines"
            :bordered="true"
            :hover="true"
            :striped="true"
            :small="true"
          ></b-table>
        </div>
      </CCardBody>
    </CCard>
  </div>
</template>

<script>
import { LocationService, NavigationService } from "@/services";
import { EventService, CenterService } from "@/services";
export default {
  computed: {
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
  data() {
    return {
      fields: [
        { key: "sl", sortable: true },
        { key: "center", sortable: true },
        { key: "date", sortable: true },
        { key: "eventCategory", sortable: true },
        { key: "eventType", sortable: true },
        { key: "mainDoctor", sortable: true },
        { key: "status", sortable: true },
        "action",
      ],
      perPage: 10,
      currentPage: 1,
      filter: null,
      filterOn: [],
      totalPages: 0,
      totalRows: 0,
      sortBy: "",
      sortDesc: false,
    };
  },

  methods: {},
};
</script>