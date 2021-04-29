import { ApiRoutes, GetApiRoute, handleException, setAuthorizationToken } from "@/helpers/ApiRoutes";
import store from "@/store";
import axios from "axios";

export class StatsService{

    async getDashBoardStats(payload: Record<string,any>): Promise<any>{

        try{

            const auth = store.getters.auth;
            const response = await axios.post(GetApiRoute(ApiRoutes.GET_STATS),payload,
            setAuthorizationToken(auth.token));

            if(response.status == 200){
                return response.data;
            }

        }catch(error){
            handleException(error);
        }
        
    }

    async getMonthWiseReceivedStats(payload: Record<string,any>): Promise<any>{

        try{

            const auth = store.getters.auth;
            const response = await axios.get(GetApiRoute(ApiRoutes.GET_MONTH_WISE_RECEIVED_STATS)
            +`?centerId=${payload.centerId}`,
            setAuthorizationToken(auth.token));

            if(response.status == 200){
                return response.data.object;
            }

        }catch(error){
            handleException(error);
        }
        
    }



}