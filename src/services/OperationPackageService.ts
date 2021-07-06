import { ApiRoutes, GetApiRoute, handleException, setAuthorizationToken } from "@/helpers/ApiRoutes";
import store from "@/store";
import axios from "axios";

export class OperationPackageService{
    
    private package: any={};
    private packages: any[] = [];

    async getPackages(q: any): Promise<any>{
        const auth = store.getters.auth;

        try{
            let path = GetApiRoute(ApiRoutes.GET_OPERATION_PACKAGES);
            path += `?name=${q.name}&page=${q.page}&size=${q.size}&sortBy=${q.sortBy}&sortDesc=${q.sortDesc}`;
            const response = await axios.get(path,setAuthorizationToken(auth.token));
            if(response.status == 200){
                this.package = response.data.object;
            }

        }catch(e){
            handleException(e);
        }

        return this.package;
    }

    async addOperationPackage(payload: any): Promise<any>{
        const auth = store.getters.auth;

        try{
            const response = await axios.post(GetApiRoute(ApiRoutes.ADD_OPERATION_PACKAGE),payload,
            setAuthorizationToken(auth.token));

            if(response.status ==200){
                this.package = response.data.object;
            }
        }catch(e){
            handleException(e);
        }

        return this.package;
    }

    async getById(id: any): Promise<any>{
        const auth = store.getters.auth;
        
        try{
            const response = await axios.get(GetApiRoute(ApiRoutes.GET_OPERATION_PACKAGE_BY_ID,id),
            setAuthorizationToken(auth.token));
            if(response.status == 200){
                this.package = response.data.object;
            }
        }catch(e){
            handleException(e);
        }

        return this.package;
    }
}