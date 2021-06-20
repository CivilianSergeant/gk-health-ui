import { RouteConfig } from "vue-router";
import Vouchers from '@/views/Voucher/Vouchers.vue';
import VoucherForm from '@/views/Voucher/VoucherForm.vue';

const voucherRoutes: Array<RouteConfig> = [

    {
        name:'Vouchers',
        path: '/vouchers',
        component: Vouchers
    },
    {
        name:'Add Voucher',
        path: '/vouchers/add',
        component: VoucherForm
    }

];

export default voucherRoutes;