import { ApiRoutes, GetApiRoute, handleException, setAuthorizationToken } from "@/helpers/ApiRoutes";
import store from "@/store";
import axios from "axios";

export class MedicineBrandService{

    private medicineBrands: Record<string, any>[] = [];

    async getMedicineBrands(): Promise<any>{
        const auth = store.getters.auth;
       try{
            const response = await axios.get(GetApiRoute(ApiRoutes.ALL_MEDICINE_BRAND),
            setAuthorizationToken(auth.token));
            if(response.status==200){
                this.medicineBrands = response.data.collection;
            }

            return this.medicineBrands;
        }catch(error){
            handleException(error);
        }
    }
}