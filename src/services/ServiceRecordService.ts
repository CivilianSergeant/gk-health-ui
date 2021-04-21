import {ApiRoutes, GetApiRoute, setAuthorizationToken} from "@/helpers/ApiRoutes";
import store from "@/store";
import axios from "axios";

export class ServiceRecordService{

    private serviceRecords: Record<string, any>[] = [];

     async getServiceRecords(centerId: number, centerCode: string, officeTypeId: number,
          fromDate: Date,toDate: Date): Promise<any>{
       
        let response: any = '';

        const auth = store.getters.auth;

        const route = ApiRoutes.ALL_SERVICE_RECORD;
        if(fromDate!=undefined && toDate!=undefined){
            
             response = await axios.post(GetApiRoute(route),{
               centerCode:centerCode,
               centerId:centerId,
               officeTypeId:officeTypeId,
               toDate:toDate,fromDate:fromDate},setAuthorizationToken(auth.token));
             
        }else{
             response = await axios.get(GetApiRoute(route),setAuthorizationToken(auth.token));
            
        }

        if(response.status==200){
            this.serviceRecords = response.data.collection;
        }
        return this.serviceRecords;

        
     }
}