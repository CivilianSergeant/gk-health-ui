<template>
    <div>
        <b-alert v-model="isSuccess" variant="success">{{ message }}</b-alert>
    <b-alert v-model="isError" variant="danger">{{ message }}</b-alert>
    <cCard>
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
          
          <div class="col-md-3 mt-4" style="margin-top: 1.8rem !important">
            <b-button type="submit" variant="info">Search</b-button>
            <b-button type="reset" class="ml-1" variant="warning"
              >Clear</b-button
            >
          </div>
        </b-form>
      </CCardBody>
    </cCard>

    <CCard>
      <CCardHeader>
        Operation Categories
        <router-link
          to="/operation-category/add"
          class="btn btn-primary btn-sm float-right"
          >Add Operation Category</router-link
        ></CCardHeader
      >
      <CCardBody>
        <div class="table-responsive">
        <b-table
          id="cat-table"
          class="position-relative"
          :fields="fields"
          @filtered="onFiltered"
          @sort-changed="handleSort"
          :per-page="0"
          :busy.sync="isBusy"
          :filter="filter"
          :filter-included-fields="filterOn"
          :current-page="currentPage"
          :items="categories"
          :bordered="true"
          :hover="true"
          :striped="true"
          :small="true"
        >
          <template #cell(status)="row">
            <span v-if="row.item.status" class="badge badge-success"
              >Active
            </span>
            <span v-if="!row.item.status" class="badge badge-danger"
              >Inactive
            </span>
          </template>
          <template #cell(action)="row">
            <div class="text-center">
              <router-link
                class="btn btn-primary btn-sm"
                :to="'/operation-category/' + row.item.id + '/detail'"
                >Edit</router-link
              >
            </div>
          </template>
        </b-table>
        </div>
        <b-pagination
        v-model="currentPage"
        :total-rows="rows"
        :per-page="perPage"
        aria-controls="cat-table"
      ></b-pagination>
        <Loader :isBusy="isBusy" />
      </CCardBody>
    </CCard>
    </div>
</template>
<script>
import { OperationCategoryService } from '@/services';
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
      title: "Operation Categories",
      fields: [
        { key:"name", sortable: true},
        { key:"status", sortable:true},
        "action",
      ],
      perPage: 10,
      currentPage: 1,
      categories: [],
      filter: null,
      filterOn: [],
      totalPages:0,
      totalRows: 0,
      sortBy:"",
      sortDesc:false,
      name:''
    };
  },
  watch: {
    currentPage: {
      handler: function() {
        this.fetcheOperationCategories();
      }
    }
  },
  mounted() {
    this.fetcheOperationCategories();
  },
  methods: {
    handleSearch(){
      this.fetcheOperationCategories();
    },
    onClearSearch(){
      this.name = '';
      this.fetcheOperationCategories();
    },
    handleSort(ctx){
      console.log(ctx)
      this.sortBy = ctx.sortBy;
      this.sortDesc = ctx.sortDesc;
      this.currentPage = 1;
      this.fetcheOperationCategories();
    },
    fetcheOperationCategories() {
      this.$store.commit("start");
      const searchablePagable = {
        name:this.name,
        sortBy: this.sortBy,
        sortDesc: this.sortDesc,
        page: (this.currentPage-1),
        size: this.perPage
      }
      new OperationCategoryService().getCategories(searchablePagable).then((result) => {
        console.log(result)
        this.categories = result.content;
        this.totalPages = result.totalPages;
        this.totalRows = result.totalElements;
        this.$store.commit("finish");
      });
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
  },
}
</script>