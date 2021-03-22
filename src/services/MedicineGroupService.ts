import { ApiRoutes, GetApiRoute } from "@/helpers/ApiRoutes";
import axios from "axios";

export class MedicineGroupService{

    private medicneGroups: Record<string, any>[] = [];

     async getMedicineGroups(): Promise<Record<string, any>[]>{
        const response = await axios.get(GetApiRoute(ApiRoutes.ALL_MEDICINE_GROUP));
        if(response.status==200){
            this.medicneGroups = response.data.collection;
        }
        return this.medicneGroups;

    //     return [
    //         {id:1,name:"Paracetamol"},
    //         {id:2,name:"Esomeprazole"},
    //         {id:3,name:"Montelukast Sodium"},
    //         {id:4,name:"Azithromycin"}
    //     ]
     }
}