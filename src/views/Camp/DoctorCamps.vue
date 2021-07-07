<template>
  <div>
    <b-alert v-model="isSuccess" variant="success">{{ message }}</b-alert>
    <b-alert v-model="isError" variant="danger">{{ message }}</b-alert>
    <CCard>
      <CCardHeader>Search</CCardHeader>
      <b-form @submit.prevent="handleSearch" @reset.prevent="onClearSearch">
        <CCardBody>
          <div class="row">
            <div class="col-md-3" v-if="showRaOfficeList">
              <b-form-group id="center" label-for="camp-center">
                <label> RA Office</label>
                <b-form-select
                  id="camp-center"
                  :options="raOffices"
                  v-model="search.raOffice"
                  @change="handleChangeRaOffice"
                ></b-form-select>
              </b-form-group>
            </div>

            <div class="col-md-3">
              <!-- <Loader class="mt-4" :isBusy="isBusy" /> -->
              <!-- v-if="centers.length > 0" -->
              <b-form-group id="center" label-for="camp-center">
                <label> Center</label>
                <b-form-select
                  id="camp-center"
                  :options="centers"
                  v-model="search.center"
                  type="text"
                ></b-form-select>
              </b-form-group>
            </div>
            <div class="col-md-2">
              <b-form-group id="event-date" label-for="event-category">
                <label> Event Category </label>
                <b-form-select
                  id="event-category"
                  v-model="search.eventCategory"
                  :options="eventCategories"
                  type="text"
                ></b-form-select>
              </b-form-group>
            </div>
            <div class="col-md-2">
              <b-form-group id="event-type" label-for="event-type">
                <label> Event Type</label>
                <b-form-select
                  id="event-type"
                  v-model="search.eventType"
                  :options="eventTypes"
                ></b-form-select>
              </b-form-group>
            </div>
            <div class="col-md-2">
              <b-form-group id="event-type" label-for="main-doctor">
                <label> Doctor </label>
                <b-form-select
                  id="main-doctor"
                  v-model="search.employeeId"
                  :options="doctorList"
                ></b-form-select>
              </b-form-group>
            </div>
          </div>
          <div class="row">
            <div class="col-md-3">
              <b-button type="submit" variant="info" class="mr-2"
                >Search</b-button
              >
              <b-button type="reset" class="ml-1" variant="warning"
                >Clear</b-button
              >
            </div>
          </div>
        </CCardBody>
        <!-- <CCardFooter></CCardFooter> -->
      </b-form>
    </CCard>
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
            :items="events"
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
    showRaOfficeList() {
      return this.$store.getters.center.officeTypeId == 1;
    },
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
      eventCategories: [],
      eventTypes: [
        { value: null, text: "Select" },
        { value: "camp", text: "Camp" },
        { value: "visit", text: "Visit" },
      ],
      doctorList: [
        { value: "", text: "Select" },
        { value: "1", text: "Dr Farjana" },
      ],
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
      search: {
        center: null,
        eventDate: null,
        eventCategory: null,
        eventType: null,
        employeeId: "",
        village: null,
        locationAddress: "",
        note: "",
        raOffice: null,
      },
      perPage: 10,
      currentPage: 1,
      filter: null,
      filterOn: [],
      totalPages: 0,
      totalRows: 0,
      sortBy: "",
      sortDesc: false,
      raOffices: [],
      centers: [],
      currentCenter: null,
      raCenters: [],
      events: [],
    };
  },

  mounted() {
    this.fetchEventCategories();
    this.fetchRaOffices();
  },

  methods: {
    fetchEventCategories() {
      new EventService().getEventCategories().then((result) => {
        this.eventCategories.push({ value: null, text: "Category" });
        result.forEach((c) => {
          this.eventCategories.push({
            value: c.id,
            text: c.name,
          });
        });
      });
    },
    fetchCenters() {
      this.$store.commit("start");
      console.log(this.currentCenter);
      const raOffice =
        this.raCenters.length > 0
          ? this.raCenters.filter((r) => r.id == this.currentCenter)[0]
          : this.$store.getters.center;
      console.log(raOffice);
      new CenterService().getCentersByThirdLevel(raOffice).then((result) => {
        //this.centers = result;
        if (result.length > 0) {
          this.centers.push({ value: null, text: "Select Center" });
          result.forEach((hc) =>
            this.centers.push({ value: hc.id, text: hc.name })
          );
        }
        this.$store.commit("finish");
      });
    },
    fetchRaOffices() {
      new CenterService().getRaCenters().then((result) => {
        this.raCenters = result;
        this.raOffices.push({ value: null, text: "Select RA" });
        result.forEach((c) => {
          this.raOffices.push({
            value: c.id,
            text: c.name,
          });
        });
      });
    },
    // fetcheEvents() {},
    handleChangeRaOffice(val) {
      this.currentCenter = val;
      this.centers = [];
      this.fetchCenters();
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    handleSort(ctx) {
      console.log(ctx);
      this.sortBy = ctx.sortBy;
      this.sortDesc = ctx.sortDesc;
      this.currentPage = 1;
      // this.fetcheEvents();
    },
  },
};
</script>