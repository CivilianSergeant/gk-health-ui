import { ApiRoutes, GetApiRoute, handleException, setAuthorizationToken } from "@/helpers/ApiRoutes";
import store from "@/store";
import axios from "axios";

export class EventService {
    private eventCategories: Record<string, any>[] = [];

    private event: any = {};

    async getEventCategories(): Promise<any> {
        const auth = store.getters.auth;
        try {
            const response = await axios.get(GetApiRoute(ApiRoutes.ALL_EVENT_CATEGORIES),
                setAuthorizationToken(auth.token));
            if (response.status == 200) {
                this.eventCategories = response.data.collection;
            }

            return this.eventCategories;
        } catch (error) {
            handleException(error);
        }
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