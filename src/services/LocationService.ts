import { ApiRoutes, GetApiRoute, handleException, setAuthorizationToken } from "@/helpers/ApiRoutes";
import store from "@/store";
import axios from "axios";

export class LocationService {

    private divisions: Record<string, any>[] = [];
    private districts: Record<string, any>[] = [];
    private thanas: Record<string, any>[] = [];
    private unions: Record<string, any>[] = [];
    private villages: Record<string, any>[] = [];

    async getDivisions(): Promise<any> {
        const auth = store.getters.auth;
        try {
            const response = await axios.get(GetApiRoute(ApiRoutes.ALL_DIVISIONS),
                setAuthorizationToken(auth.token));
            if (response.status == 200) {
                this.divisions = response.data.collection;
            }

            return this.divisions;
        } catch (error) {
            handleException(error);
        }
    }

    async getVillages(q: any): Promise<any> {
        const auth = store.getters.auth;
        try {

            let path: string = ApiRoutes.ALL_VILLAGES;
            path += `?divisionId=${q.divisionId}&districtId=${q.districtId}` +
                `&thanaId=${q.thanaId}&unionId=${q.unionId}` +
                `&villageCode=${q.villageCode}&villageName=${q.villageName}&page=${q.page}&size=${q.size}` +
                `&sortBy=${q.sortBy}&sortDesc=${q.sortDesc}`;
            const response = await axios.get(GetApiRoute(path),
                setAuthorizationToken(auth.token));
            if (response.status == 200) {
                this.villages = response.data.object;
            }

            return this.villages;
        } catch (error) {
            handleException(error);
        }
    }

    async getDistrictBydivisionId(id: string): Promise<any[]> {
        const auth = store.getters.auth;
        const result = await axios.get(GetApiRoute(ApiRoutes.GET_DISTRICT_BY_DIVISION_ID, id),
            setAuthorizationToken(auth.token));
        if (result.status == 200) {
            this.districts = result.data;
        }
        return this.districts;
    }

    async getThanaBydistrictId(id: string): Promise<any[]> {
        const auth = store.getters.auth;
        const result = await axios.get(GetApiRoute(ApiRoutes.GET_THANA_BY_DISTRICT_ID, id),
            setAuthorizationToken(auth.token));
        if (result.status == 200) {
            this.thanas = result.data;
        }
        return this.thanas;
    }

    async getUnionByThanaId(id: string): Promise<any[]> {
        const auth = store.getters.auth;
        const result = await axios.get(GetApiRoute(ApiRoutes.GET_UNION_BY_THANA_ID, id),
            setAuthorizationToken(auth.token));
        if (result.status == 200) {
            this.unions = result.data;
        }
        return this.unions;
    }

    async getVillageByUnionId(unionId: string): Promise<any[]> {
        const auth = store.getters.auth;
        const result = await axios.get(GetApiRoute(ApiRoutes.GET_VILLAGE_BY_UNION_ID, unionId),
            setAuthorizationToken(auth.token));
        if (result.status == 200) {
            this.villages = result.data;
        }
        return this.villages;
    }

    async addLocation(payload: Record<string, any>, callback: Function): Promise<any> {

        const auth = store.getters.auth;

        try {
            const response = await axios.post(GetApiRoute(ApiRoutes.ADD_LOCATION), payload,
                setAuthorizationToken(auth.token));

            if (response.status == 200) {

                callback();
            }
        } catch (error) {
            handleException(error);
        }


    }

    async locationMapping(payload: Record<string, any>, callback: Function): Promise<any> {

        const auth = store.getters.auth;

        try {
            const response = await axios.post(GetApiRoute(ApiRoutes.MAPPING_LOCATION), payload,
                setAuthorizationToken(auth.token));

            if (response.status == 200) {

                callback();
            }
        } catch (error) {
            handleException(error);
        }


    }


    async getVillagesByCenter(id: number): Promise<any> {
        console.log("cid=", id);
        const auth = store.getters.auth;
        try {
            const path: string = ApiRoutes.GET_VILLAGE_BY_CENTER;
            const response = await axios.get(GetApiRoute(path, id.toString()),
                setAuthorizationToken(auth.token));
            if (response.status == 200) {
                this.villages = response.data.collection;
            }

            return this.villages;
        } catch (error) {
            handleException(error);
        }
    }

}