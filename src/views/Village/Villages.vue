<template>
  <div>
    <b-alert v-model="isSuccess" variant="success">{{ message }}</b-alert>
    <b-alert v-model="isError" variant="danger">{{ message }}</b-alert>
    <CCard>
      <CCardHeader>Search Village</CCardHeader>
      <CCardBody>
        <b-form @submit.prevent="handleSearch" @reset.prevent="onClearSearch">
          <div class="row">
            <div class="col-md-3">
              <b-form-group
                id="input-group-division"
                label="Division:"
                label-for=""
              >
                <b-form-select
                  :options="divisions"
                  id="divisions"
                  @change="handleChangeDivision"
                  v-model="search.divisionId"
                ></b-form-select>
              </b-form-group>
            </div>
            <div class="col-md-3">
              <b-form-group
                id="input-group-district"
                label="District:"
                label-for=""
              >
                <b-form-select
                  :options="districts"
                  id="districts"
                  :disabled="districts.length == 0 || search.divisionId == null"
                  @change="handleChangeDistrict"
                  v-model="search.districtId"
                ></b-form-select>
              </b-form-group>
            </div>
            <div class="col-md-3">
              <b-form-group
                id="input-group-upozila"
                label="Upozila:"
                label-for=""
              >
                <b-form-select
                  :options="thanas"
                  id="thanas"
                  :disabled="thanas.length == 0 || search.districtId == null"
                  @change="handleChangeThana"
                  v-model="search.thanaId"
                ></b-form-select>
              </b-form-group>
            </div>
            <div class="col-md-3">
              <b-form-group id="input-group-union" label="Union:" label-for="">
                <b-form-select
                  :options="unions"
                  id="unions"
                  @change="handleChangeUnion"
                  :disabled="unions.length == 0 || search.thanaId == null"
                  v-model="search.unionId"
                ></b-form-select>
              </b-form-group>
            </div>
          </div>
          <div class="row">
            <div class="col-md-3">
              <b-form-group
                id="input-group-village-code"
                label="Village Code:"
                label-for="village-code"
              >
                <b-form-input
                  id="village-code"
                  placeholder="Village Code"
                  v-model="search.villageCode"
                ></b-form-input>
              </b-form-group>
            </div>
            <div class="col-md-3">
              <b-form-group
                id="input-group-village-name"
                label="Village Name:"
                label-for=""
              >
                <b-form-input
                  id="villageName"
                  placeholder="Village Name"
                  v-model="search.villageName"
                ></b-form-input>
              </b-form-group>
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-md-12 d-flex justify-content-end">
              <b-button type="submit" class="mr-2" variant="success"
                >Search</b-button
              >
              <b-button type="reset" variant="warning">Clear</b-button>
            </div>
          </div>
        </b-form>
      </CCardBody>
      <CCardFooter></CCardFooter>
    </CCard>
    <CCard>
      <CCardHeader>
        Village List
        <router-link
          to="/villages/add"
          class="btn btn-primary btn-sm float-right"
          >Add Village</router-link
        ></CCardHeader
      >
      <CCardBody>
        <div class="table-responsive">
          <b-table
            id="village-table"
            class="position-relative"
            :fields="fields"
            :per-page="0"
            :busy.sync="isBusy"
            :filter="filter"
            :filter-included-fields="filterOn"
            :current-page="currentPage"
            :items="villages"
            :bordered="true"
            :hover="true"
            :striped="true"
            :small="true"
          ></b-table>
        </div>
        <b-pagination
          v-model="currentPage"
          :total-rows="rows"
          :per-page="perPage"
          aria-controls="village-table"
        ></b-pagination>
      </CCardBody>
      <CCardFooter></CCardFooter>
    </CCard>
  </div>
</template>

<script>
import { LocationService } from "@/services";
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
        { key: "divisionName", label: "Division", sortable: true },
        { key: "districtName", label: "District", sortable: true },
        { key: "upozillaName", label: "Upozila", sortable: true },
        { key: "unionName", label: "Union", sortable: true },
        { key: "villageCode", sortable: true },
        { key: "villageName", sortable: true },
        // "action",
      ],
      search: {
        divisionId: null,
        districtId: null,
        thanaId: null,
        unionId: null,
        villageCode: "",
        villageName: "",
      },
      villages: [],
      perPage: 25,
      currentPage: 1,
      filter: null,
      filterOn: [],
      totalPages: 0,
      totalRows: 0,
      sortBy: "",
      sortDesc: false,
      divisions: [],
      districts: [],
      thanas: [],
      unions: [],
      division: "",
      district: "",
      thana: "",
      union: "",
    };
  },
  watch: {
    currentPage: {
      handler: function () {
        this.fetcheVillages();
      },
    },
  },
  mounted() {
    this.fetcheVillages();
    this.fetchDivisions();
  },
  methods: {
    handleSearch() {
      this.fetcheVillages();
    },
    onClearSearch() {
      this.division = "";
      this.district = "";
      this.thana = "";
      this.union = "";
      this.search = {
        divisionId: null,
        districtId: null,
        thanaId: null,
        unionId: null,
        villageCode: "",
        villageName: "",
      };
      this.fetcheVillages();
    },
    handleSort(ctx) {
      console.log(ctx);
      this.sortBy = ctx.sortBy;
      this.sortDesc = ctx.sortDesc;
      this.currentPage = 1;
      this.fetcheVillages();
    },
    fetcheVillages() {
      this.$store.commit("start");
      const searchablePagable = {
        divisionId: this.division ? this.division : "",
        districtId: this.district ? this.district : "",
        thanaId: this.thana ? this.thana : "",
        unionId: this.union ? this.union : "",
        villageCode: this.search.villageCode,
        villageName: this.search.villageName,
        sortBy: this.sortBy,
        sortDesc: this.sortDesc,
        page: this.currentPage - 1,
        size: this.perPage,
      };
      new LocationService().getVillages(searchablePagable).then((result) => {
        //console.log("test-", result);
        this.villages = result.content;
        this.totalPages = result.totalPages;
        this.totalRows = result.totalElements;
        // this.totalRows = this.medicines.length;
        this.$store.commit("finish");
      });
    },
    fetchDivisions() {
      new LocationService().getDivisions().then((result) => {
        result.unshift({ divisionId: null, divisionName: "Select Division" });
        result.map((r) => {
          this.divisions.push({ value: r.divisionId, text: r.divisionName });
        });
      });
    },
    handleChangeDivision(val) {
      this.division = val;
      this.districts = [];
      this.unions = [];
      this.thanas = [];

      this.getDistrictList(val);
    },
    getDistrictList(id) {
      //console.log(id);
      new LocationService().getDistrictBydivisionId(id).then((result) => {
        result.collection.unshift({
          districtId: null,
          districtName: "Select District",
        });
        result.collection.map((r) => {
          this.districts.push({ value: r.districtId, text: r.districtName });
        });
        this.$store.commit("finish");
      });
    },
    handleChangeDistrict(val) {
      this.district = val;
      this.thanas = [];
      this.unions = [];
      this.getThanaList(val);
    },
    getThanaList(id) {
      new LocationService().getThanaBydistrictId(id).then((result) => {
        result.collection.unshift({
          thanaId: null,
          thanaName: "Select Upozilla",
        });
        result.collection.map((r) => {
          this.thanas.push({ value: r.thanaId, text: r.thanaName });
        });
        this.$store.commit("finish");
      });
    },
    handleChangeThana(val) {
      this.thana = val;
      this.unions = [];
      this.getUnionList(val);
    },
    getUnionList(id) {
      new LocationService().getUnionByThanaId(id).then((result) => {
        result.collection.unshift({ unionId: null, unionName: "Select Union" });
        result.collection.map((r) => {
          this.unions.push({ value: r.unionId, text: r.unionName });
        });
        this.$store.commit("finish");
      });
    },
    handleChangeUnion(val) {
      this.union = val;
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
  },
};
</script>
