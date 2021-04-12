import { ApiRoutes, GetApiRoute } from "@/helpers/ApiRoutes";
import { hasRole } from "@/helpers/Roles";
import store from "@/store";
import axios from "axios";

export class RolePermissionService{

    private roles!: Record<string,any>[];

    async getRoles(): Promise<Record<string,any>[]>{
      const resposne = await axios.get(GetApiRoute(ApiRoutes.GET_ROLES));
      if(resposne.status == 200){
        this.roles = resposne.data.collection;
        this.roles = this.roles.filter(r=> r.name != hasRole(store.getters.auth));
      }
      return this.roles;
    }

    async saveRolePermission(payload: Record<string,any>): Promise<Record<string,any>>{
      const response = await axios.post(GetApiRoute(ApiRoutes.ADD_ROLE_PERMISSION),payload);
      return response;
    }
}