import { ApiRoutes, GetApiRoute, handleException, setAuthorizationToken } from "@/helpers/ApiRoutes";
import store from "@/store";
import axios from "axios";

export class EventService {
    private eventCategories: Record<string, any>[] = [];

    private event: any = {};

    async getEvents(q: any): Promise<any>{
        const auth = store.getters.auth;
        try{
            let path = GetApiRoute(ApiRoutes.GET_EVENTS);
            path += `?page=${q.page}&size=${q.size}&sortBy=${q.sortBy}&sortDesc=${q.sortDesc}`;
            const response = await axios.get(path,setAuthorizationToken(auth.token));
            if(response.status == 200){
                this.event = response.data.object;
            }
        }catch(e){
            handleException(e);
        }
        return this.event;
    }

    async addEvent(payload: any): Promise<any>{
        const auth = store.getters.auth;
        try{
            const response = await axios.post(GetApiRoute(ApiRoutes.ADD_EVENT), payload,
            setAuthorizationToken(auth.token));
            if(response.status == 200){
                this.event = response.data.object;
            }
        }catch(e){
            handleException(e);
        }

        return this.event;
    } 
}