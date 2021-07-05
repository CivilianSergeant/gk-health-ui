<template>
    <div>
        <b-alert v-model="isSuccess" variant="success">{{ message }}</b-alert>
        <b-alert v-model="isError" variant="danger">{{ message }}</b-alert>
        <CCard>
            <CCardHeader>
                Event Category
                <router-link
                to="/event-category/add"
                class="btn btn-primary btn-sm float-right"
                >Add Event Category</router-link
                ></CCardHeader
            >
            <CCardBody>
                <div class="table-responsive">
                <b-table
                id="event-category-table"
                class="position-relative"
                :fields="fields"
                @filtered="onFiltered"
                @sort-changed="handleSort"
                :per-page="0"
                :busy.sync="isBusy"
                :filter="filter"
                :filter-included-fields="filterOn"
                :current-page="currentPage"
                :items="eventCategories"
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
                        :to="'/event-category/' + row.item.id + '/detail'"
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
                aria-controls="event-category-table"
            ></b-pagination>
                <Loader :isBusy="isBusy" />
            </CCardBody>
        </CCard>
    </div>
</template>
<script>
import { EventCategoryService } from '@/services';


export default {
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
        fields: [
            { key:"name", sortable: true},
            { key:"description", sortable: true},
            { key:"status", sortable:true},
            "action",
        ],
        eventCategories:[],
        perPage: 10,
        currentPage: 1,
        filter: null,
        filterOn: [],
        totalPages:0,
        totalRows: 0,
        sortBy:"",
        sortDesc:false,
        name:''
    }
  },
  mounted(){
      this.fetchEventCategories();
  },
  methods:{
      handleSearch(){
            this.fetchEventCategories();
      },
      onClearSearch(){
            this.name = '';
            this.fetchEventCategories();
      },
      handleSort(ctx){
        
        this.sortBy = ctx.sortBy;
        this.sortDesc = ctx.sortDesc;
        this.currentPage = 1;
        this.fetchEventCategories();
      },
      fetchEventCategories(){
          this.$store.commit('start');

          const searchable  = {
            name:this.name,
            sortBy: this.sortBy,
            sortDesc: this.sortDesc,
            page: (this.currentPage-1),
            size: this.perPage
          };
          (new EventCategoryService()).getEventCategories(searchable).then(result=>{
            this.eventCategories = result.content;
            this.totalPages = result.totalPages;
            this.totalRows = result.totalElements;
            this.$store.commit('finish');
          });
      },
      onFiltered(filteredItems) {
        // Trigger pagination to update the number of buttons/pages due to filtering
        this.totalRows = filteredItems.length;
        this.currentPage = 1;
      },
  }

}
</script>