import { ApiRoutes, GetApiRoute } from "@/helpers/ApiRoutes";
import axios from "axios";

export class MedicineService{

    private medicines: Record<string, any>[] = [];
    private medicine!: Record<string, any>;

    async getMedicines(): Promise<Record<string, any>[]>{
        // return [
        //     {id:1,name:"Napa",brand:"Square",group:"Paracitamol"},
        //     {id:2,name:"Monas"},
        //     {id:3,name:"Antazol 0.1%"},
        //     {id:4,name:"sergel 20"}
        // ]

        const response = await axios.get(GetApiRoute(ApiRoutes.ALL_MEDICINE));
        if(response.status==200){
            this.medicines = response.data.collection;
        }

        return this.medicines;
    }

    async getMedicineById(id: string): Promise<Record<string, any>>{

        const response = await axios.get(GetApiRoute(ApiRoutes.GET_MEDICINE_BY_ID,id));
        if(response.status==200){
            this.medicine = response.data.object;
        }

        return this.medicine;
    }
}