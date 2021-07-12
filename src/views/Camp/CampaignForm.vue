<template>
  <div>
    <b-alert v-model="isSuccess" variant="success">{{ message }}</b-alert>
    <b-alert v-model="isError" variant="danger">{{ message }}</b-alert>
    <CCard>
      <CCardHeader>
        Add Campaign
        <router-link to="/campaigns" class="btn btn-primary btn-sm float-right"
          >Campaign List</router-link
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
              <b-form-group id="event-type" label-for="event-type">
                <label> Event Type <span class="text-danger">*</span></label>
                <b-form-select
                  required
                  id="event-type"
                  v-model="form.eventType"
                  :options="eventTypes"
                  @change="handleChangeEventType"
                ></b-form-select>
              </b-form-group>
            </div>
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
              <b-form-group id="event-type" label-for="main-doctor">
                <label>
                  Main Doctor
                  <span v-if="this.form.eventType == 'camp'" class="text-danger"
                    >*</span
                  ></label
                >
                <b-form-select
                  required
                  :disabled="this.form.eventType == 'satellite'"
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
            <div class="col-md-5 d-flex justify-content">
              <b-button type="submit" variant="info"
                ><CIcon name="cil-check-circle" /> Save as Draft</b-button
              >

              <b-button
                type="submit"
                class="ml-4 mr-2"
                v-if="this.form.id"
                variant="success"
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
      eventCategories: [{ value: null, text: "Select Category" }],
      eventTypes: [
        { value: null, text: "Select Type" },
        { value: "camp", text: "Camp" },
        { value: "satellite", text: "Satellite" },
      ],
      doctorList: [
        { value: "", text: "Select Doctor" },
        { value: "1", text: "Dr Farjana" },
      ],
      id: null,
      form: {
        center: { id: null },
        eventDate: null,
        eventCategory: { id: null },
        eventType: null,
        village: { lgVillageId: null },
        locationAddress: "",
        note: "",
        status: "draft",
      },
      raOffice: null,
      employeeId: null,
      villages: [],
      centers: [],
      raOffices: [],
      currentCenter: null,
      raCenters: [],
      eventPersonnel: { id: null },
      allEventCategories: [],
    };
  },
  watch: {
    employeeId(newVal, old) {
      if (this.id == null) {
        this.eventPersonnel = {
          employee: { id: newVal },
          personnelType: "main",
        };
      }
    },
  },
  mounted() {
    this.id = this.$route.params.id;

    if (this.id != undefined) {
      this.fetchEventById();
    }
    this.fetchEventCategories();
    this.fetchDoctors();
    this.fetchRaOffices();
  },
  methods: {
    fetchEventById() {
      new EventService().getEventById(this.id).then((result) => {
        this.form.id = result.id;
        this.form.eventDate = result.eventDate;
        this.form.eventType = result.eventType;
        this.handleChangeEventType(this.form.eventType);
        this.form.eventCategory = result.eventCategory;
        const ep = result.eventPersonnels.pop();
        this.employeeId = ep.employee.id;
        this.eventPersonnel = ep;
        this.form.note = result.note;
        this.form.locationAddress = result.locationAddress;
        this.currentCenter = result.regionOfficeId;
        this.raOffice = result.regionOfficeId;
        this.fetchCenters(() => {
          this.form.center = result.center;
        });

        this.fetchVillagesByCenter(result.center.id, () => {
          this.form.village = result.village;
        });
      });
    },
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
    fetchVillagesByCenter(id, callback) {
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

        if (callback != undefined) {
          callback();
        }
      });
    },
    fetchEventCategories() {
      new EventCategoryService().getEventCategoryList().then((result) => {
        //this.allEventCategories.push({ value: null, text: "Select Category" });
        result.forEach((c) => {
          this.allEventCategories.push({
            value: c.id,
            text: c.name,
          });
        });
      });
    },
    fetchCenters(callback) {
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

          if (callback != undefined) {
            callback();
          }
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
    handleChangeEventType(val) {
      this.eventCategories = [{ value: null, text: "Select Category" }];
      if (val == "satellite") {
        this.allEventCategories.forEach((c) => {
          if (c.value == 21 || c.value == 22) {
            // console.log("test");
            this.eventCategories.push({
              value: c.value,
              text: c.text,
            });
          }
        });
      }

      if (val == "camp") {
        this.allEventCategories.forEach((c) => {
          if (c.value != 21 && c.value != 22) {
            // console.log(c.text);
            this.eventCategories.push({
              value: c.value,
              text: c.text,
            });
          }
        });
      }

      // console.log(this.modifiedEventCategories);
    },
    onSubmit() {
      // some update
      this.$store.commit("start");
      const eventRequest = {
        event: this.form,
        eventPersonnel: this.eventPersonnel,
        regionOfficeId: this.currentCenter,
      };

      eventRequest.event.eventDate =
        eventRequest.event.eventDate.toString().trim() + "T00:00:00";
      console.log(eventRequest);
      new EventService().addEvent(eventRequest).then((result) => {
        console.log(result);
        if (result.id != undefined) {
          const message =
            this.id != undefined ? "Event Updated" : "Event Created";
          this.$store.commit("setSuccessMsg", message);

          const navigationService = new NavigationService();
          navigationService.redirect(this, "Campaigns");
        }
        this.$store.commit("finish");
      });
    },
    onReset() {
      this.$store.commit("clearMessage");
      const navigationService = new NavigationService();
      navigationService.redirect(this, "Campaigns");
    },
  },
};
</script>