<template>
    <div> 
        <b-alert v-model="isSuccess" variant="success">{{ message }}</b-alert>
    <b-alert v-model="isError" variant="danger">{{ message }}</b-alert>
        <CCard>
            <CCardHeader> Village List <router-link
          to="/villages/add"
          class="btn btn-primary btn-sm float-right"
          >Add Village</router-link
        ></CCardHeader>
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
import { LocationService } from '@/services';
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
        data(){
            return {
                fields: [
                    { key:"divisionName", label:"Division", sortable: true},
                    { key: "districtName", label:"District", sortable: true},
                    { key: "thanaName", label:"Upozila", sortable: true},
                    { key:"unionName", label:"Union", sortable:true},
                    { key:"villageCode", sortable:true},
                    { key:"villageName", sortable:true},
                    // "action",
                ],
                villages:[],
                perPage: 25,
                currentPage: 1,
                filter: null,
                filterOn: [],
                totalPages:0,
                totalRows: 0,
                sortBy:"",
                sortDesc:false
            }
        },
        watch: {
            currentPage: {
            handler: function() {
                this.fetcheVillages();
            }
            }
        },
        mounted() {
            this.fetcheVillages();
        },
        methods: {
            handleSearch(){
                this.fetcheVillages();
            },
            onClearSearch(){
                this.name = '';
                this.fetcheVillages();
            },
            handleSort(ctx){
                console.log(ctx)
                this.sortBy = ctx.sortBy;
                this.sortDesc = ctx.sortDesc;
                this.currentPage = 1;
                this.fetcheVillages();
            },
            fetcheVillages() {
                this.$store.commit("start");
                const searchablePagable = {
                    sortBy: this.sortBy,
                    sortDesc: this.sortDesc,
                    page: (this.currentPage-1),
                    size: this.perPage
                }
                new LocationService().getVillages(searchablePagable).then((result) => {
                    console.log("test-",result)
                    this.villages = result.content;
                    this.totalPages = result.totalPages;
                    this.totalRows = result.totalElements;
                    // this.totalRows = this.medicines.length;
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
