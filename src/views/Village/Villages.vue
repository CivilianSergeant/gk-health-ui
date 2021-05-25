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
                :items="villags"
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
            }
        }
    }
</script>
