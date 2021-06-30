import { ApiRoutes, GetApiRoute, handleException, setAuthorizationToken } from "@/helpers/ApiRoutes";
import store from "@/store";
import axios from "axios";

export class MedicineGroupService{

    private medicineGroups: Record<string, any>[] = [];
    private medicineGroup: any;


    async getMedicineGroupById(id: string): Promise<any>{

        const auth = store.getters.auth;
        try{
            const response = await axios.get(GetApiRoute(ApiRoutes.GET_MEDICINE_GROUP_BY_ID,id),
            setAuthorizationToken(auth.token));
            if(response.status==200){
                this.medicineGroup = response.data.object;
            }

            return this.medicineGroup;
        }catch(error){
            handleException(error);
        }
    }

    async addMedicineGroup(payload: Record<string, any>, callback: Function): Promise<any> {
        
        const auth = store.getters.auth;

        try{
            const response = await axios.post(GetApiRoute(ApiRoutes.ADD_MEDICINE_GROUP),payload,
            setAuthorizationToken(auth.token));
            if(response.status==200){
                callback();
            }
        }catch(error){
            handleException(error);
        }
            
    }

     async getMedicineGroups(): Promise<any>{
        const auth = store.getters.auth; 
        try{
            const response = await axios.get(GetApiRoute(ApiRoutes.ALL_MEDICINE_GROUP),
            setAuthorizationToken(auth.token));
            if(response.status==200){
                this.medicineGroups = response.data.collection;
            }
            return this.medicineGroups;
        }catch(error){
            handleException(error)    
        }
    }

    async getMedicineGroupPage(q: any): Promise<any>{
        
       const auth = store.getters.auth;
       try{
            const response = await axios.get(GetApiRoute(ApiRoutes.ALL_MEDICINE_GROUP)
                +`/list?name=${q.name}&page=${q.page}&size=${q.size}&sortBy=${q.sortBy}&sortDesc=${q.sortDesc}`,
            setAuthorizationToken(auth.token));
            if(response.status==200){
                this.medicineGroups = response.data.object;
            }

            return this.medicineGroups;
        }catch(error){
            handleException(error);
        }
    }
}