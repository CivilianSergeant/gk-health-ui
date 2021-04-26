<template>
  <div>
    <!-- <ContentBar :PageTitle="title"/> -->
    <b-alert v-model="isSuccess" variant="success">{{ message }}</b-alert>
    <b-alert v-model="isError" variant="danger">{{ message }}</b-alert>
    <!-- <h5> All Centers</h5> -->
    <CCard>
      <CCardBody>
        <b-form-group
          label="Filter"
          label-for="filter-input"
          label-cols-sm="1"
          label-align-sm="right"
          label-size="sm"
          class="my-2"
        >
          <b-input-group size="sm" class="col-md-3">
            <b-form-input
              id="filter-input"
              v-model="filter"
              type="search"
              placeholder="Type to Search"
            ></b-form-input>

            <b-input-group-append>
              <b-button :disabled="!filter" @click="filter = ''"
                >Clear</b-button
              >
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </CCardBody>
    </CCard>

    <CCard>
      <CCardHeader>All Centers</CCardHeader>
      <CCardBody>
        <b-table
          id="center-table"
          :fields="fields"
          @filtered="onFiltered"
          @sort-changed="handleSort"
          :per-page="0"
          :filter="filter"
          :filter-included-fields="filterOn"
          :current-page="currentPage"
          :items="centers"
          bordered
          hover
          striped
          small
        ></b-table>
        <Loader :isBusy="isBusy" />
        <b-pagination
          v-model="currentPage"
          :total-rows="rows"
          :per-page="perPage"
          aria-controls="center-table"
        ></b-pagination>
      </CCardBody>
    </CCard>
  </div>
</template>

<script>
import { CenterService } from "@/services/CenterService";
import { handleCatch } from "@/helpers/ApiRoutes";

export default {
  name: "HealthCenter",
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
      title: "Health Center",
      centers: [],
      fields: [
        {key: "name",sortable: true},
        {key: "apiOfficeId", sortable: true},
        {key: "centerCode", sortable: true},
        {key: "officeLevel", sortable: true},
        {key: "officeTypeId", sortable: true},
        {key: "firstLevel", sortable: true},
        {key: "secondLevel", sortable: true},
        {key: "thirdLevel", sortable: true},
        {key: "fourthLevel", sortable: true},
      ],
      currentPage: 1,
      perPage: 10,
      filter: null,
      filterOn: [],
      totalRows: 0,
      totalPages:0,
      sortBy:'',
      sortDesc:false
    };
  },
  watch: {
    currentPage: {
      handler: function() {
        this.fetchCenters();
      }
    }
  },
  beforeMount() {
    this.$store.commit("clearErrorMsg");
    this.fetchCenters();
  },

  methods: {
    handleSort(ctx){
      this.sortBy = ctx.sortBy;
      this.sortDesc = ctx.sortDesc;
      this.currentPage = 1;
      this.fetchCenters();
    },
    fetchCenters() {
      this.$store.commit("start");
      const q = {
        page: (this.currentPage -1 ),
        size: this.perPage,
        sortBy: this.sortBy,
        sortDesc: this.sortDesc
      }
      new CenterService().getCentersWithPagination(q).then((result) => {
        this.centers = result.content;
        this.totalRows = result.totalElements;
        this.totalPages = result.totalPages;
        this.$store.commit("finish");
      });
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
  },
};
</script>