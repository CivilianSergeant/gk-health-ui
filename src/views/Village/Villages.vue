<template>
    <div> 
        <CCard>
            <CCardHeader> Village List <router-link
          to="/villages/add"
          class="btn btn-primary btn-sm float-right"
          >Add Village</router-link
        ></CCardHeader>
            <CCardBody>
                <div class="table-responsive">
                <b-table 
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
            </CCardBody>
            <CCardFooter></CCardFooter>
        </CCard>
    </div>
</template>

<script>
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
                    { key:"division", sortable: true},
                    { key: "district", sortable: true},
                    { key: "upazila", sortable: true},
                    { key:"union", sortable:true},
                    { key:"village", sortable:true},
                    "action",
                ],
                villages:[],
                perPage: 10,
                currentPage: 1,
                filter: null,
                filterOn: [],
                totalPages:0,
                totalRows: 0,
                sortBy:"",
            }
        }
    }
</script>
