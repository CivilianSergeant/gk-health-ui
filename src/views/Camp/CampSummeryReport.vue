<template>
  <div>
    <b-alert v-model="isSuccess" variant="success">{{ message }}</b-alert>
    <b-alert v-model="isError" variant="danger">{{ message }}</b-alert>
    <vue-html2pdf
      :show-layout="false"
      :float-layout="true"
      :enable-download="false"
      :preview-modal="true"
      :paginate-elements-by-height="1400"
      :pdf-quality="2"
      :manual-pagination="false"
      pdf-format="a4"
      pdf-orientation="portrait"
      pdf-content-width="760px"
      ref="html2Pdf"
    >
      <section slot="pdf-content">
        <ReportHeader></ReportHeader>
        <h5 class="text-center">
          Camp Summery Report For The Month of July-2021
        </h5>
        <h5 class="text-center mt-3">
          Region: Tangail
          <a
            @click="printPrescription()"
            class="btn btn-sm btn-primary cursor-pointer text-white"
            ><b-icon-printer></b-icon-printer
          ></a>
        </h5>
        <div class="campSummeryReport">
          <div class="row">
            <div class="col-md-2"><b></b></div>
            <div class="col-md-2"><b>Special Camp</b></div>
            <div class="col-md-2"><b>ENT</b></div>
            <div class="col-md-2"><b>EYE</b></div>
            <div class="col-md-2"><b>USG CAMP</b></div>
          </div>
          <div class="row">
            <div class="col-md-2"><b> Chuadanga Unit</b></div>
            <div class="col-md-2">
              Doctor Name: Mr X, <br />
              Date: 8,10
            </div>
            <div class="col-md-2">
              Doctor Name: Mr X, <br />
              Date: 8,10
            </div>
            <div class="col-md-2">
              Doctor Name: Mr X, <br />
              Date: 8,10
            </div>
            <div class="col-md-2">
              Doctor Name: Mr X, <br />
              Date: 8,10
            </div>
          </div>
          <div class="row">
            <div class="col-md-2"><b>Magura Unit</b></div>
            <div class="col-md-2">
              Doctor Name: Mr X, <br />
              Date: 8,10
            </div>
            <div class="col-md-2">
              Doctor Name: Mr X, <br />
              Date: 8,10
            </div>
            <div class="col-md-2">
              Doctor Name: Mr X, <br />
              Date: 8,10
            </div>
            <div class="col-md-2">
              Doctor Name: Mr X, <br />
              Date: 8,10
            </div>
          </div>
          <div class="row">
            <div class="col-md-2"><b>Pantisab</b></div>
            <div class="col-md-2">
              Doctor Name: Mr X, <br />
              Date: 8,10
            </div>
            <div class="col-md-2">
              Doctor Name: Mr X, <br />
              Date: 8,10
            </div>
            <div class="col-md-2">
              Doctor Name: Mr X, <br />
              Date: 8,10
            </div>
            <div class="col-md-2">
              Doctor Name: Mr X, <br />
              Date: 8,10
            </div>
          </div>
          <div class="row">
            <div class="col-md-2"><b>Nator</b></div>
            <div class="col-md-2">
              Doctor Name: Mr X, <br />
              Date: 8,10
            </div>
            <div class="col-md-2">
              Doctor Name: Mr X, <br />
              Date: 8,10
            </div>
            <div class="col-md-2">
              Doctor Name: Mr X, <br />
              Date: 8,10
            </div>
            <div class="col-md-2">
              Doctor Name: Mr X, <br />
              Date: 8,10
            </div>
          </div>
          <div class="row">
            <div class="col-md-2"><b>Beramara</b></div>
            <div class="col-md-2">
              Doctor Name: Mr X, <br />
              Date: 8,10
            </div>
            <div class="col-md-2">
              Doctor Name: Mr X, <br />
              Date: 8,10
            </div>
            <div class="col-md-2">
              Doctor Name: Mr X, <br />
              Date: 8,10
            </div>
            <div class="col-md-2">
              Doctor Name: Mr X, <br />
              Date: 8,10
            </div>
          </div>
        </div>
      </section>
    </vue-html2pdf>
    <CCard>
      <CCardHeader>Report Search</CCardHeader>
      <b-form @submit.prevent="handleSearch" @reset.prevent="onClearSearch">
        <CCardBody>
          <div class="row">
            <div class="col-md-3" v-if="showRaOfficeList">
              <b-form-group id="center" label-for="camp-center">
                <!-- <label> RA Office</label> -->
                <b-form-select
                  id="camp-center"
                  :options="raOffices"
                  v-model="search.raOffice"
                  @change="handleChangeRaOffice"
                ></b-form-select>
              </b-form-group>
            </div>
            <div class="col-md-3">
              <b-form-group id="event-date" label-for="event-date">
                <!-- <label> From Date </label> -->
                <b-form-input
                  id="event-date"
                  v-model="search.eventDate"
                  type="date"
                ></b-form-input>
              </b-form-group>
            </div>
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
        Camp Summery Report
        <router-link
          to="/doctor-camp/add"
          class="btn btn-primary btn-sm float-right"
          >Add Doctor Camp</router-link
        ></CCardHeader
      >
      <CCardBody>
        <h5 class="text-center">
          Camp Summery Report For The Month of July-2021
        </h5>
        <h5 class="text-center mt-3">
          Region: Tangail
          <a
            @click="printPrescription()"
            class="btn btn-sm btn-primary cursor-pointer text-white"
            ><b-icon-printer></b-icon-printer
          ></a>
        </h5>
        <div class="campSummeryReport">
          <div class="row">
            <div class="col-md-2"><b></b></div>
            <div class="col-md-2"><b>Special Camp</b></div>
            <div class="col-md-2"><b>ENT</b></div>
            <div class="col-md-2"><b>EYE</b></div>
            <div class="col-md-2"><b>USG CAMP</b></div>
          </div>
          <div class="row">
            <div class="col-md-2"><b> Chuadanga Unit</b></div>
            <div class="col-md-2">
              Doctor Name: Mr X, <br />
              Date: 8,10
            </div>
            <div class="col-md-2">
              Doctor Name: Mr X, <br />
              Date: 8,10
            </div>
            <div class="col-md-2">
              Doctor Name: Mr X, <br />
              Date: 8,10
            </div>
            <div class="col-md-2">
              Doctor Name: Mr X, <br />
              Date: 8,10
            </div>
          </div>
          <div class="row">
            <div class="col-md-2"><b>Magura Unit</b></div>
            <div class="col-md-2">
              Doctor Name: Mr X, <br />
              Date: 8,10
            </div>
            <div class="col-md-2">
              Doctor Name: Mr X, <br />
              Date: 8,10
            </div>
            <div class="col-md-2">
              Doctor Name: Mr X, <br />
              Date: 8,10
            </div>
            <div class="col-md-2">
              Doctor Name: Mr X, <br />
              Date: 8,10
            </div>
          </div>
          <div class="row">
            <div class="col-md-2"><b>Pantisab</b></div>
            <div class="col-md-2">
              Doctor Name: Mr X, <br />
              Date: 8,10
            </div>
            <div class="col-md-2">
              Doctor Name: Mr X, <br />
              Date: 8,10
            </div>
            <div class="col-md-2">
              Doctor Name: Mr X, <br />
              Date: 8,10
            </div>
            <div class="col-md-2">
              Doctor Name: Mr X, <br />
              Date: 8,10
            </div>
          </div>
          <div class="row">
            <div class="col-md-2"><b>Nator</b></div>
            <div class="col-md-2">
              Doctor Name: Mr X, <br />
              Date: 8,10
            </div>
            <div class="col-md-2">
              Doctor Name: Mr X, <br />
              Date: 8,10
            </div>
            <div class="col-md-2">
              Doctor Name: Mr X, <br />
              Date: 8,10
            </div>
            <div class="col-md-2">
              Doctor Name: Mr X, <br />
              Date: 8,10
            </div>
          </div>
          <div class="row">
            <div class="col-md-2"><b>Beramara</b></div>
            <div class="col-md-2">
              Doctor Name: Mr X, <br />
              Date: 8,10
            </div>
            <div class="col-md-2">
              Doctor Name: Mr X, <br />
              Date: 8,10
            </div>
            <div class="col-md-2">
              Doctor Name: Mr X, <br />
              Date: 8,10
            </div>
            <div class="col-md-2">
              Doctor Name: Mr X, <br />
              Date: 8,10
            </div>
          </div>
        </div>
      </CCardBody>
    </CCard>
  </div>
</template>

<script>
import { EventService, CenterService, EventCategoryService } from "@/services";
import VueHtml2pdf from "vue-html2pdf";
import ReportHeader from "@/components/global/ReportHeader";
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
      centers: [{ value: null, text: "Select Center" }],
      doctorList: [
        { value: "", text: "Select" },
        { value: "1", text: "Dr Farjana" },
      ],
      fields: [
        { key: "center", sortable: true },
        { key: "eventDate", sortable: true },
        { key: "eventCategory", sortable: true },
        { key: "eventType", sortable: true },
        { key: "doctor", sortable: true },
        { key: "status", sortable: true },
        "action",
      ],
      search: {
        center: null,
        eventCategory: null,
        eventType: null,
        employeeId: "",
        village: null,
        eventDate: null,
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
      // centers: [],
      currentCenter: null,
      raCenters: [],
      events: [],
    };
  },

  mounted() {
    this.fetchEventCategories();
    this.fetchRaOffices();
    this.fetchEvents();
  },

  methods: {
    fetchEvents() {
      this.$store.commit("start");
      const searchable = {
        sortBy: this.sortBy,
        sortDesc: this.sortDesc,
        page: this.currentPage - 1,
        size: this.perPage,
      };
      new EventService().getEvents(searchable).then((result) => {
        this.events = result.content;
        this.totalPages = result.totalPages;
        this.totalRows = result.totalElements;
        this.$store.commit("finish");
      });
    },
    fetchEventCategories() {
      new EventCategoryService().getEventCategoryList().then((result) => {
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
      this.fetchEvents();
    },
    printPrescription() {
      this.$refs.html2Pdf.generatePdf();
    },
  },
  components: {
    VueHtml2pdf,
    ReportHeader,
  },
};
</script>

<style type="text/css">
.campSummeryReport {
  margin: 15px;
}
.campSummeryReport .row:first-child {
  border-top: 1px solid #ccc;
}

.campSummeryReport .row:first-child div {
  padding: 10px 5px;
}

.campSummeryReport .row {
  border-bottom: 1px solid #ccc;
  border-left: 1px solid #ccc;
  border-right: 1px solid #ccc;
}
.campSummeryReport .row > div {
  border-right: 1px solid #ccc;
  font-size: 13px;
}
</style>