import { Menu } from '@/entity/Menu'
import { ApiRoutes, GetApiRoute, setAuthorizationToken } from '@/helpers/ApiRoutes';
import { hasRole, Role } from '@/helpers/Roles';
import store from '@/store';
import axios from 'axios';
// import axios from 'axios';

export class MenuService {

   static async getMenus (userRole?: string) {

    const auth: any = store.getters.auth;
    const role = (userRole != undefined)? userRole : hasRole(auth);
    console.log(role);
    let menus: Menu[] = [];

    if(role==null){
      return menus;
    }

   
    const response = await axios.get(GetApiRoute(ApiRoutes.GET_AVAILABLE_MENUS+`/${encodeURI(role)}`),
      setAuthorizationToken(auth.token));
    if(response.status == 200){
      menus = response.data.collection;
    }
    
    
    return menus;
  }
  static async getAllMenus () {

    
    
    let menus: Menu[] = [];
    const auth: any = store.getters.auth;
    const response = await axios.get(GetApiRoute(ApiRoutes.GET_AVAILABLE_MENUS),setAuthorizationToken(auth.token));
    if(response.status == 200){
      menus = response.data.collection;
    }
    
    
    return menus;
  }

}
