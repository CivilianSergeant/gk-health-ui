import { ApiRoutes, GetApiRoute, handleException, setAuthorizationToken } from "@/helpers/ApiRoutes";
import store from "@/store";
import axios from "axios";

export class MedicineGroupService{

    private medicneGroups: Record<string, any>[] = [];

     async getMedicineGroups(): Promise<any>{
        const auth = store.getters.auth; 
        try{
            const response = await axios.get(GetApiRoute(ApiRoutes.ALL_MEDICINE_GROUP),
            setAuthorizationToken(auth.token));
            if(response.status==200){
                this.medicneGroups = response.data.collection;
            }
            return this.medicneGroups;
        }catch(error){
            handleException(error)    
        }
     }
}