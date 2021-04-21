import { ApiRoutes, GetApiRoute, handleException, setAuthorizationToken } from "@/helpers/ApiRoutes";
import { hasRole } from "@/helpers/Roles";
import store from "@/store";
import axios from "axios";

export class RolePermissionService{

    private roles!: Record<string,any>[];

    async getRoles(): Promise<any>{
      const auth = store.getters.auth;
      try{
        const resposne = await axios.get(GetApiRoute(ApiRoutes.GET_ROLES),
        setAuthorizationToken(auth.token));
        if(resposne.status == 200){
          this.roles = resposne.data.collection;
          this.roles = this.roles.filter(r=> r.name != hasRole(store.getters.auth));
        }
        return this.roles;
      }catch(error){
        handleException(error);
      }
    }

    async saveRolePermission(payload: Record<string,any>): Promise<any>{
      const auth = store.getters.auth;
      try{
        const response = await axios.post(GetApiRoute(ApiRoutes.ADD_ROLE_PERMISSION),payload,
        setAuthorizationToken(auth.token));
        return response;
      }catch(error){
        handleException(error);
      }
    }
}