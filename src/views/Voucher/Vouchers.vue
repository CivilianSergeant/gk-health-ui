<template>
  <div>
    
    <b-alert v-model="isSuccess" variant="success">{{ message }}</b-alert>
    <b-alert v-model="isError" variant="danger">{{ message }}</b-alert>
    <cCard>
        <CCardHeader>
            Vouchers
            <router-link
            to="/vouchers/add"
            class="btn btn-primary btn-sm float-right"
            >Add Voucher</router-link
        ></CCardHeader>
        <CCardBody>
            <b-table
            id="patient-table"
            class="position-relative"
            @sort-changed="handleSort"
            :fields="fields"
            :per-page="0"
            :busy.sync="isBusy"
            :current-page="currentPage"
            :items="vouchers"
            :bordered="true"
            :hover="true"
            :striped="true"
            :small="true"
            >
                <template #cell(voucherDate)="row">
                    <span>{{row.item.voucherDate.substr(0,10)}}</span>
                </template>
            </b-table>
        </CCardBody>
    </cCard>

    </div>    
</template>
<script>
import {VoucherService} from '@/services';

export default {
    name: "Patients",
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
            
            currentPage: 1,
            vouchers:[],
            perPage:10,
            sortBy:'',
            sortDesc:false,
            fields: [
                { key: "voucherNo", label: "Voucher No", sortable: true },
                { key: "voucherDate", label: "Voucher Date", sortable: true },
                { key: "debitHead", sortable: true },
                { key: "debitAmount", sortable: true },
                { key: "creditHead", sortable: true },
                { key: "creditAmount", sortable: true },
                { key: "status", sortable:true}
                
            ],
        }
    },
    watch: {
        currentPage: {
            handler: function () {
                this.fetchVouchers();
            },
        },
    },
    mounted(){
        this.$store.commit("clearErrorMsg");
        this.fetchVouchers();
    },
    methods:{
        handleSort(ctx) {
            this.sortBy = ctx.sortBy;
            this.sortDesc = ctx.sortDesc;
            this.currentPage = 1;
            this.fetchVouchers();
        },
        fetchVouchers(){
            const q = {
                size: this.perPage,
                page: (this.currentPage-1),
                sortBy: this.sortBy,
                sortDesc: this.sortDesc
            };
            (new VoucherService()).getVouchers(q).then(result=>{
                this.vouchers = result.content;
                this.totalPages = result.totalPages;
                this.totalRows = result.totalElements;
            })
        },
        
    }
}
</script>