import { ApiRoutes, GetApiRoute } from "@/helpers/ApiRoutes";
import axios from "axios";

export class MedicineBrandService{

    private medicineBrands: Record<string, any>[] = [];

    async getMedicineBrands(): Promise<Record<string, any>[]>{
       const response = await axios.get(GetApiRoute(ApiRoutes.ALL_MEDICINE_BRAND));
       if(response.status==200){
           this.medicineBrands = response.data.collection;
       }

       return this.medicineBrands;
    }
}