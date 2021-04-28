<template>
  <div>
    <b-alert v-model="isSuccess" variant="success">{{ message }}</b-alert>
    <b-alert v-model="isError" variant="danger">{{ message }}</b-alert>
    <CCard>
      <CCardHeader>
        All Service Categories
        <router-link
          to="/service-categories/add"
          class="btn btn-primary btn-sm float-right"
          >Add Service Category</router-link
        >
      </CCardHeader>
      <CCardBody>
              <b-form class="row" @submit.prevent="handleSearch" @reset.prevent="onClearSearch">
          
          <div class="col-md-3">
            <b-form-group
              id="input-group-patient-id"
              label="Name:"
              label-for="name"
              description="Search By Category name"
            >
              <b-form-input
                id="name"
                placeholder="Name"
                v-model="name"
              ></b-form-input>
            </b-form-group>
          </div>
          
          <div class="col-md-3 mt-4 px-0" style="margin-top: 1.8rem !important">
            <b-button type="submit" variant="info">Search</b-button>
            <b-button type="reset" class="ml-1" variant="warning"
              >Clear</b-button
            >
          </div>
        </b-form>
    <b-table v-if="!showForm" id="category-table" :fields="fields" :per-page="0" :busy.sync="isBusy"
        :current-page="currentPage" :items="categories" 
        @sort-changed="handleSort"
        :bordered="true"
        :hover="true"
        :striped="true"
        :small="true">
         <template #cell(labTest)="row">
          <span v-if="row.item.labTest" class="badge badge-success">Yes </span>
          <span v-if="!row.item.labTest" class="badge badge-danger">No </span>
        </template>
        <template #cell(active)="row">
          <span v-if="row.item.active" class="badge badge-success">Active </span>
          <span v-if="!row.item.active" class="badge badge-danger">Inactive </span>
        </template>
         <template #cell(action)="row">
            <router-link class="btn btn-primary btn-sm " :to="'/service-categories/'+row.item.id+'/detail'">Edit</router-link>
        </template>
      </b-table>
      <Loader :isBusy="isBusy"/>
      <b-pagination v-if="!showForm"
        v-model="currentPage"
        :total-rows="rows"
        :per-page="perPage"
        aria-controls="category-table"
      ></b-pagination>
      </CCardBody>
    </CCard>
  </div>
</template>

<script>
import { CategoryService } from "@/services";
import { handleCatch } from "@/helpers/ApiRoutes";

export default {
  name: "ServiceCategories",
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
      title: "Service Categories",
      categories: [],
      showForm: false,
      fields: [
        {key:"name", sortable:true},
        {key:"description",sortable:true},
        {key:"labTest",sortable:true},
        { key: "active", label: "Status",sortable:true },
        "action",
      ],
      perPage: 10,
      currentPage: 1,
      form: { name: "", labTest: true, active: true },
      totalRows:0,
      totalPages:0,
      sortBy:"",
      sortDesc:false,
      name:''
    };
  },
  watch: {
    currentPage: {
      handler: function() {
        this.fetchServiceCategories();
      }
    }
  },
  beforeMount() {
    this.$store.commit("clearErrorMsg");
    this.fetchServiceCategories();
  },
  methods: {
    handleSort(ctx){
      this.sortBy = ctx.sortBy;
      this.sortDesc = ctx.sortDesc;
      this.currentPage = 1;
      this.fetchServiceCategories();
    },
    onSubmit() {
      this.$store.commit("start");
      new CategoryService().addServiceCategory(this.form, () => {
        this.fetchServiceCategories();
        this.toggleView();
        this.$store.commit("setSuccessMsg", "New Service Category Created");
      });
    },
    onReset() {
      this.$store.commit("clearMessage");
      this.toggleView();
    },
    toggleView() {
      this.form = { name: "", description: "", active: true };
      this.$store.commit("clearMessage");
      // this.showForm = !this.showForm;
    },
    handleSearch(){
      this.fetchServiceCategories();
    },
    onClearSearch(){
      this.name = '';
      this.fetchServiceCategories();
    },
    fetchServiceCategories() {
      const searchablePagable = {
        categoryName: this.name,
        sortBy: this.sortBy,
        sortDesc: this.sortDesc,
        page: (this.currentPage-1),
        size: this.perPage
      }
      this.$store.commit("start");
      new CategoryService()
        .getCategories(searchablePagable)
        .then((result) => {
          this.categories = result.content;
          this.totalPages = result.totalPages;
          this.totalRows = result.totalElements;
          this.$store.commit("finish");
        })
        .catch(handleCatch());
    },
  },
};
</script>