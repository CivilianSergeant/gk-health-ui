import { ApiRoutes, GetApiRoute, handleException, setAuthorizationToken } from "@/helpers/ApiRoutes";
import store from "@/store";
import axios from "axios";

export class EventService {
    private event: any = {};
    // pull all events with pagination
    async getEvents(q: any): Promise<any>{
        const auth = store.getters.auth;
        try {
            let path = GetApiRoute(ApiRoutes.GET_EVENTS);
            path += `?centerId=${q.centerId}&eventCategoryId=${q.eventCategoryId}&eventType=${q.eventType}&doctor=${q.doctor}&fromDate=${q.fromDate}&toDate=${q.toDate}`;
            path += `&page=${q.page}&size=${q.size}&sortBy=${q.sortBy}&sortDesc=${q.sortDesc}`;

            const response = await axios.get(path, setAuthorizationToken(auth.token));
            if (response.status == 200) {
                this.event = response.data.object;
            }
        } catch (e) {
            handleException(e);
        }
        return this.event;
    }

    async addEvent(payload: Record<string, any>): Promise<any> {

        const auth = store.getters.auth;

        try {
            const response = await axios.post(GetApiRoute(ApiRoutes.ADD_EVENT), payload,
                setAuthorizationToken(auth.token));

            if (response.status == 200) {

                this.event = response.data.object;
            }
        } catch (error) {
          
            handleException(error);
        }

        return this.event;
    }

    async getEventById(id: any): Promise<any>{
        const auth = store.getters.auth;
        try{
            const response = await axios.get(GetApiRoute(ApiRoutes.GET_EVENT_BY_ID,id),
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