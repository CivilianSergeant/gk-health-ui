import { ApiRoutes, GetApiRoute, handleException, setAuthorizationToken } from "@/helpers/ApiRoutes";
import store from "@/store";
import axios from "axios";

export class MedicineService{

    private medicines: Record<string, any>[] = [];
    private medicine!: Record<string, any>;

    async getMedicines(): Promise<any>{
        const auth = store.getters.auth;
        try{
            const response = await axios.get(GetApiRoute(ApiRoutes.ALL_MEDICINE),
            setAuthorizationToken(auth.token));
            if(response.status==200){
                this.medicines = response.data.collection;
            }

            return this.medicines;
        }catch(error){
            handleException(error);
        }
    }

    async getMedicineById(id: string): Promise<any>{

        const auth = store.getters.auth;
        try{
            const response = await axios.get(GetApiRoute(ApiRoutes.GET_MEDICINE_BY_ID,id),
            setAuthorizationToken(auth.token));
            if(response.status==200){
                this.medicine = response.data.object;
            }

            return this.medicine;
        }catch(error){
            handleException(error);
        }
    }
}