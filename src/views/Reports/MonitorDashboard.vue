<template>
  <div>
    <cCard>
      <CCardBody>
        <b-form @submit.prevent="onSearch">
          <div class="row">
            <div class="col-md-2">
              <b-form-select
                v-model="form.officeTypeId"
                @change="handleOfficeTypeChange"
                :options="optionOfficeTypes"
              ></b-form-select>
            </div>
            <div class="col-md-2">
              <b-form-select
                v-model="form.centerId"
                @change="handleOfficeChange"
                :options="optionOffices"
              ></b-form-select>
            </div>
            <div class="col-md-3">
              <b-input-group class="mb-3">
                <!-- <b-form-input
                            id="example-input"
                            v-model="value"
                            type="text"
                            placeholder="YYYY-MM-DD"
                            autocomplete="off"
                        ></b-form-input> -->
                <b-input-group-append>
                  <b-form-datepicker
                    placeholder="From Date"
                    right
                    locale="en-US"
                    aria-controls="example-input"
                    @context="onContext"
                  ></b-form-datepicker>
                </b-input-group-append>
              </b-input-group>
            </div>
            <div class="col-md-3">
              <b-input-group class="mb-3">
                <!-- <b-form-input
                            id="example-input"
                            v-model="value2"
                            type="text"
                            placeholder="YYYY-MM-DD"
                            autocomplete="off"
                        ></b-form-input> -->
                <b-input-group-append>
                  <b-form-datepicker
                    placeholder="To Date"
                    right
                    locale="en-US"
                    aria-controls="example-input"
                    @context="onContext2"
                  ></b-form-datepicker>
                </b-input-group-append>
              </b-input-group>
            </div>
            <div class="col-md-2">
              <b-button type="submit" variant="info">Search</b-button>
            </div>
          </div>
        </b-form>
        <Loader :isBusy="isBusy" />
        <div class="row py-5" v-if="!isBusy">
          <div class="col-md-3">
            <b-card
              header="Total GB Patient"
              header-tag="header"
              footer=""
              footer-tag="footer"
              :title="stats.totalGbPatient.toString()"
            >
              <!-- <b-card-text>5288</b-card-text>
                    <b-button href="#" variant="primary">Go somewhere</b-button> -->
            </b-card>
          </div>
          <div class="col-md-3">
            <b-card
              header="Non GB Patient"
              header-tag="header"
              footer=""
              footer-tag="footer"
              :title="stats.totalNonGbPatient.toString()"
            >
              <!-- <b-card-text>5288</b-card-text>
                    <b-button href="#" variant="primary">Go somewhere</b-button> -->
            </b-card>
          </div>
          <div class="col-md-3">
            <b-card
              header="Total Patient"
              header-tag="header"
              footer=""
              footer-tag="footer"
              :title="stats.totalPatient.toString()"
            >
              <!-- <b-card-text>5288</b-card-text>
                    <b-button href="#" variant="primary">Go somewhere</b-button> -->
            </b-card>
          </div>
          <div class="col-md-3">
            <b-card
              header="Total Amount"
              header-tag="header"
              footer=""
              footer-tag="footer"
              :title="stats.totalAmount.toString()"
            >
              <!-- <b-card-text>5288</b-card-text>
                    <b-button href="#" variant="primary">Go somewhere</b-button> -->
            </b-card>
          </div>
          <div class="col-md-12" style="display: none">
            <div class="card">
              <div class="card-header">Summery</div>
              <div class="card-body">
                <div class="row">
                  <div class="col-md-3">
                    <strong class="d-block"> GB Patient</strong>
                    {{ stats.totalGbPatient }}
                  </div>
                  <div class="col-md-3">
                    <strong class="d-block">Non GB Patient</strong>
                    {{ stats.totalNonGbPatient }}
                  </div>
                  <div class="col-md-3">
                    <strong class="d-block"> Total Patient</strong>
                    {{ stats.totalPatient }}
                  </div>
                  <div class="col-md-3">
                    <strong class="d-block"> Total Amount(Tk)</strong>
                    {{ stats.totalAmount }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CCardBody>
    </cCard>
  </div>
</template>
<script>
import { CenterService, StatsService } from "@/services";

export default {
  data() {
    return {
      form: { officeTypeId: null, centerId: null },
      selectedCenter: null,
      centers: [],
      fromDate: "",
      toDate: "",
      formatted: "",
      optionOfficeTypes: [
        { value: null, text: "Select Office Type" },
        { value: "1", text: "All Office" },
        { value: "4", text: "Zonal Office" },
        { value: "5", text: "Regional Office" },
        { value: "6", text: "Health Center" },
      ],
      optionOffices: [],
      stats: {
        totalNonGbPatient: 0,
        totalGbPatient: 0,
        totalPatient: 0,
        totalAmount: 0,
        totalAmountUptoLastDay: "0",
        totalPatientUptoLastDay: "0",
        totalGbPatientUptoLastDay: "0",
        totalNonGbPatientUptoLastDay: "0",
      },
    };
  },
  computed: {
    center() {
      return this.$store.getters.center;
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
  watch: {
    center(newLen, oldLen) {
      if (newLen.id != undefined) {
        this.fetchStats();
      }
    },
  },
  mounted() {
    if (this.$store.getters.center.id != undefined) {
      this.fetchStats();
    }
  },
  methods: {
    handleOfficeChange(val) {
      console.log(val);
      const centers = this.centers.filter((o) => o.id == val);
      this.selectedCenter = centers[0];
    },
    handleOfficeTypeChange(val) {
      this.selectedCenter = null;
      this.form.centerId = null;
      if (val == null) {
        return;
      }
      console.log("office-type", val);
      this.optionOffices = [];
      if (val == 0) {
        new CenterService().getCenters().then((result) => {
          this.centers = result;
          result.map((m) => {
            this.optionOffices.push({ value: m.id, text: m.name });
          });
        });
      } else {
        new CenterService().getCentersByOfficeTypeId(val).then((result) => {
          this.centers = result;
          result.map((m) => {
            this.optionOffices.push({ value: m.id, text: m.name });
          });
        });
      }
    },
    formatDate(date, start) {
      const d = new Date(date);
      let month = "" + (d.getMonth() + 1);
      let day = "" + d.getDate();
      const year = d.getFullYear();

      if (month.length < 2) month = "0" + month;
      if (day.length < 2) day = "0" + day;

      const formatedDate = [year, month, day].join("-");
      console.log(formatedDate);
      return formatedDate.toString() + (start ? " 23:59:59" : " 23:59:59");
    },
    onSearch() {
      this.fetchStats(this.selectedCenter);
    },
    fetchStats(center) {
      this.$store.commit("start");
      const _center = center ? center : this.$store.getters.center;
      console.log(center);
      const toDate = new Date();
      toDate.setDate(toDate.getDate() - 7);

      const payload = {
        id: _center.id,
        officeTypeId: _center.officeTypeId,
        centerCode: _center.centerCode,
        fromDate: this.fromDate
          ? this.fromDate + " 00:00:00"
          : this.formatDate(toDate, false),
        toDate: this.toDate
          ? this.toDate + " 23:59:59"
          : this.formatDate(new Date(), true),
      };
      new StatsService().getDashBoardStats(payload).then((result) => {
        this.$store.commit("finish");
        if (result != undefined) {
          this.stats = result;
        }
      });
    },
    onContext(ctx) {
      // The date formatted in the locale, or the `label-no-date-selected` string
      //this.formatted = ctx.selectedFormatted
      // The following will be an empty string until a valid date is entered
      //this.selected = ctx.selectedYMD
      this.fromDate = ctx.selectedYMD;
    },
    onContext2(ctx) {
      // The date formatted in the locale, or the `label-no-date-selected` string
      //this.formatted = ctx.selectedFormatted
      // The following will be an empty string until a valid date is entered
      //this.selected = ctx.selectedYMD
      this.toDate = ctx.selectedYMD;
    },
  },
};
</script>