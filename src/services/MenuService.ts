import { Menu } from '@/entity/Menu'
import { ApiRoutes, GetApiRoute } from '@/helpers/ApiRoutes';
import { hasRole, Role } from '@/helpers/Roles';
import store from '@/store';
import axios from 'axios';

export class MenuService {
   static async getMenus () {

    const auth: any = store.getters.auth;
    const role = hasRole(auth.realmAccess.roles);
    console.log(role);
    let menus: Menu[] = [];

    if(role==null){
      return menus;
    }

    if(role?.match('Super Admin')){
      const response = await axios.get(GetApiRoute(ApiRoutes.GET_AVAILABLE_MENUS));
      if(response.status == 200){
        menus = response.data.collection;
      }
    }else{
      const response = await axios.get(GetApiRoute(ApiRoutes.GET_AVAILABLE_MENUS+`/${encodeURI(role)}`));
      if(response.status == 200){
        menus = response.data.collection;
      }
    }
    
    return menus;
  }
}
