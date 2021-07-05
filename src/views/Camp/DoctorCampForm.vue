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
      <CCardBody>
        <div class="row">
          <div class="col-md-4">
            <b-form-group id="center" label-for="camp-center">
              <label> Center</label>
              <b-form-input
                id="camp-center"
                v-model="form.center.id"
                type="text"
              ></b-form-input>
            </b-form-group>
          </div>
          <div class="col-md-4">
            <b-form-group id="event-date" label-for="event-date">
              <label> Event Date</label>
              <b-form-input
                id="event-date"
                v-model="form.eventDate"
                type="date"
              ></b-form-input>
            </b-form-group>
          </div>
          <div class="col-md-4">
            <b-form-group id="event-date" label-for="event-category">
              <label> Event Category</label>
              <b-form-select
                id="event-category"
                v-model="form.eventCategory"
                :options="eventCategories"
                type="text"
              ></b-form-select>
            </b-form-group>
          </div>
        </div>
        <div class="row">
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
              <label> Main Doctor</label>
              <b-form-select
                id="main-doctor"
                v-model="form.employeeId"
                :options="doctorList"
              ></b-form-select>
            </b-form-group>
          </div>
          <div class="col-md-4">
            <b-form-group id="event-type" label-for="other-doctor">
              <label> Others Doctor</label>
              <b-form-select
                id="other-doctor"
                :options="otherDoctors"
                v-model="form.otherDoctor"
                type="text"
              ></b-form-select>
            </b-form-group>
          </div>
        </div>
        <div class="row">
          <div class="col-md-4">
            <b-form-group id="event-type" label-for="village">
              <label> Village</label>
              <b-form-select
                id="village"
                :options="villages"
                v-model="form.village"
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
      <CCardFooter></CCardFooter>
    </CCard>
  </div>
</template>

<script>
import { LocationService } from "@/services";
export default {
  computed: {
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
      eventCategories: [
        { value: "", text: "Select Category" },
        { value: "1", text: "Ent" },
      ],
      eventTypes: [
        { value: "", text: "Select Type" },
        { value: "camp", text: "Camp" },
      ],
      doctorList: [
        { value: "", text: "Select Doctor" },
        { value: "1", text: "Dr Farjana" },
      ],
      otherDoctors: [
        { value: "", text: "Select Doctor" },
        { value: "1", text: "Dr Tasnim" },
        { value: "2", text: "Dr Fariya" },
      ],
      form: {
        center: { id: null },
        eventDate: null,
        eventCategory: "",
        eventType: "",
        employeeId: "",
        village: null,
        otherDoctor: "",
        locationAddress: "",
        note: "",
      },
      villages: [],
    };
  },
  mounted() {
    this.fetchVillagesByCenter();
  },
  methods: {
    fetchVillagesByCenter() {
      const id = this.$store.getters.center.apiOfficeId;
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
  },
};
</script>