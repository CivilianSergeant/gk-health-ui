import store from '@/store';
import axios from 'axios';
import { GetApiRoute, ApiRoutes, setAuthorizationToken, handleException } from '@/helpers/ApiRoutes';

export class VoucherService{

    private voucher: any;
    private voucherTypes: any;
    private totalUnpostedAmount: any;

    async addVoucher(payload: any): Promise<any>{
        const auth = store.getters.auth;
        try{
            const response = await axios.post(GetApiRoute(ApiRoutes.ADD_VOUCHER),payload,
            setAuthorizationToken(auth.token));
            if(response.status == 200){
                this.voucher = response.data.object;
            }

        }catch(e){
            handleException(e);
        }
        return this.voucher;
    }

    async getVouchers(q: any): Promise<any>{
        const auth = store.getters.auth;

        try{
            let path: string = GetApiRoute(ApiRoutes.GET_VOUCHERS);
            path += `?page=${q.page}&size=${q.size}&sortBy=${q.sortBy}&sortDesc=${q.sortDesc}`;
            const response = await axios.get(path,setAuthorizationToken(auth.token));
            if(response.status == 200){
                this.voucher = response.data.object;
            }
            
        }catch(e){
            handleException(e);
        }

        return this.voucher;
    }

    async getVoucherTypes(): Promise<any> {
        const auth = store.getters.auth;
        try {
            const response = await axios.get(GetApiRoute(ApiRoutes.VOUCHER_TYPES),
                setAuthorizationToken(auth.token));
            if (response.status == 200) {
                this.voucherTypes = response.data.collection;
            }

            return this.voucherTypes;
        } catch (error) {
            handleException(error);
        }
    }

    async getTotalUnpostedAmount(): Promise<any>{
        const auth = store.getters.auth;
        try {
            const response = await axios.get(GetApiRoute(ApiRoutes.GET_TOTAL_UNPOSTED_AMOUNT),
                setAuthorizationToken(auth.token));
            if (response.status == 200) {
                this.totalUnpostedAmount = response.data.object;
            }

            return this.totalUnpostedAmount;
        } catch (error) {
            handleException(error);
        }
    }

}