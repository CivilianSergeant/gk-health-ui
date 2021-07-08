<template>
  <div>
    <CCard>
      <CCardHeader>
        Add Doctor Camp
        <router-link
          to="/doctor-camps"
          class="btn btn-primary btn-sm float-right"
          >Doctor Camp List</router-link
        >
      </CCardHeader>
      <b-form @submit.prevent="onSubmit" @reset.prevent="onReset">
        <CCardBody>
          <div class="row">
            <div class="col-md-4" v-if="showRaOfficeList">
              <b-form-group id="center" label-for="camp-center">
                <label> RA Office</label>
                <b-form-select
                  id="camp-center"
                  :options="raOffices"
                  v-model="raOffice"
                  @change="handleChangeRaOffice"
                ></b-form-select>
              </b-form-group>
            </div>

            <div class="col-md-4">
              <!-- <Loader class="mt-4" :isBusy="isBusy" /> -->
              <!-- v-if="centers.length > 0" -->
              <b-form-group id="center" label-for="camp-center">
                <label> Center <span class="text-danger">*</span></label>
                <b-form-select
                  required
                  id="camp-center"
                  @change="handleChangeCenter"
                  :options="centers"
                  v-model="form.center.id"
                  :disabled="centers.length == 0"
                ></b-form-select>
              </b-form-group>
            </div>
            <div class="col-md-4">
              <b-form-group id="event-date" label-for="event-date">
                <label> Event Date <span class="text-danger">*</span></label>
                <b-form-input
                  required
                  id="event-date"
                  v-model="form.eventDate"
                  type="date"
                ></b-form-input>
              </b-form-group>
            </div>
          </div>
          <div class="row">
            <div class="col-md-4">
              <b-form-group id="event-date" label-for="event-category">
                <label>
                  Event Category <span class="text-danger">*</span></label
                >
                <b-form-select
                  required
                  id="event-category"
                  v-model="form.eventCategory.id"
                  :options="eventCategories"
                  type="text"
                ></b-form-select>
              </b-form-group>
            </div>
            <div class="col-md-4">
              <b-form-group id="event-type" label-for="event-type">
                <label> Event Type</label>
                <b-form-select
                  id="event-type"
                  v-model="form.eventType"
                  :options="eventTypes"
                ></b-form-select>
              </b-form-group>
            </div>
            <div class="col-md-4">
              <b-form-group id="event-type" label-for="main-doctor">
                <label> Main Doctor <span class="text-danger">*</span></label>
                <b-form-select
                  required
                  id="main-doctor"
                  v-model="employeeId"
                  :options="doctorList"
                ></b-form-select>
              </b-form-group>
            </div>
            <!-- <div class="col-md-4">
              <b-form-group id="event-type" label-for="other-doctor">
                <label> Others Doctor</label>
                <b-form-select
                  id="other-doctor"
                  :options="otherDoctors"
                  v-model="form.otherDoctor"
                  type="text"
                ></b-form-select>
              </b-form-group>
            </div> -->
          </div>
          <div class="row">
            <div class="col-md-4">
              <b-form-group id="event-type" label-for="village">
                <label> Village</label>
                <b-form-select
                  id="village"
                  :options="villages"
                  v-model="form.village.lgVillageId"
                  :disabled="villages.length == 0"
                ></b-form-select>
              </b-form-group>
            </div>
            <div class="col-md-8">
              <b-form-group id="event-type" label-for="location-address">
                <label> Location Address</label>
                <b-form-input
                  id="location-address"
                  v-model="form.locationAddress"
                  type="text"
                ></b-form-input>
              </b-form-group>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
              <b-form-group id="event-type" label-for="note">
                <label> Note</label>
                <b-form-input
                  id="note"
                  v-model="form.note"
                  type="text"
                ></b-form-input>
              </b-form-group>
            </div>
          </div>
        </CCardBody>
        <CCardFooter>
          <div class="row mt-2 mb-2">
            <div class="col-md-3 d-flex justify-content">
              <b-button type="submit" variant="info"
                ><CIcon name="cil-check-circle" /> Submit</b-button
              >
              <b-button type="reset" class="ml-2" variant="danger">
                <CIcon name="cil-x-circle" /> Cancel</b-button
              >
            </div>
          </div>
        </CCardFooter>
      </b-form>
    </CCard>
  </div>
</template>

<script>
import {
  EmployeeService,
  EventCategoryService,
  LocationService,
  NavigationService,
  EventService,
  CenterService,
} from "@/services";
export default {
  computed: {
    showRaOfficeList() {
      return this.$store.getters.center.officeTypeId == 1;
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
    isBusy() {
      return this.$store.state.isBusy;
    },
  },
  data() {
    return {
      eventCategories: [],
      eventTypes: [{ value: "camp", text: "Camp" }],
      doctorList: [
        { value: "", text: "Select Doctor" },
        { value: "1", text: "Dr Farjana" },
      ],
      // otherDoctors: [
      //   { value: "", text: "Select Doctor" },
      //   { value: "1", text: "Dr Tasnim" },
      //   { value: "2", text: "Dr Fariya" },
      // ],
      form: {
        center: { id: null },
        eventDate: null,
        eventCategory: { id: null },
        eventType: "camp",
        village: { lgVillageId: null },
        locationAddress: "",
        note: "",
        status: "pending",
      },
      raOffice: null,
      employeeId: null,
      villages: [],
      centers: [],
      raOffices: [],
      currentCenter: null,
      raCenters: [],
      eventPersonnel: {},
    };
  },
  watch: {
    employeeId(newVal, old) {
      this.eventPersonnel = { employee: { id: newVal }, personnelType: "main" };
    },
  },
  mounted() {
    //this.fetchVillagesByCenter();
    this.fetchEventCategories();
    this.fetchDoctors();
    this.fetchRaOffices();
  },
  methods: {
    fetchDoctors() {
      new EmployeeService().getDoctors().then((result) => {
        this.doctorList = [{ value: null, text: "Select Doctor" }];
        result.forEach((d) => {
          this.doctorList.push({
            value: d.id,
            text: d.fullName + " [" + d.designation + " ]",
          });
        });
      });
    },
    fetchVillagesByCenter(id) {
      //const id = this.$store.getters.center.apiOfficeId;
      if (id == undefined) {
        return;
      }
      new LocationService().getVillagesByCenter(id).then((result) => {
        this.villages.push({ value: null, text: "Select Village" });
        result.forEach((v) => {
          this.villages.push({
            value: v.lgVillageId,
            text: v.villageName,
          });
        });
      });
    },
    fetchEventCategories() {
      new EventCategoryService().getEventCategoryList().then((result) => {
        this.eventCategories.push({ value: null, text: "Select Category" });
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
      const raOffice =
        this.raCenters.length > 0
          ? this.raCenters.filter((r) => r.id == this.currentCenter)[0]
          : this.$store.getters.center;

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
    handleChangeRaOffice(val) {
      if (!val) {
        this.centers = [];
        return;
      }
      this.currentCenter = val;
      this.centers = [];
      this.villages = [];
      this.fetchCenters();
    },
    handleChangeCenter(val) {
      this.villages = [];
      this.fetchVillagesByCenter(val);
    },
    onSubmit() {
      // some update
      this.$store.commit("start");
      const eventRequest = {
        event: this.form,
        eventPersonnel: this.eventPersonnel,
      };
      eventRequest.event.eventDate = eventRequest.event.eventDate + "T00:00:00";
      new EventService().addEvent(eventRequest).then((result) => {
        const message =
          this.id != undefined ? "Event Updated" : "Event Created";
        this.$store.commit("setSuccessMsg", message);
        this.$store.commit("finish");
        const navigationService = new NavigationService();
        navigationService.redirect(this, "Doctor Camps");
      });
    },
    onReset() {
      this.$store.commit("clearMessage");
      const navigationService = new NavigationService();
      navigationService.redirect(this, "Doctor Camps");
    },
  },
};
</script>