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

  static processMenus(data: any): any{
    const _navs: Array<any>= [];
      const _groups: any[] = [];
      const medicineMenus: any = {
        _name: 'CSidebarNavDropdown',
        name: 'Medicine',
        
        icon: 'cil-puzzle',
        items: [ ]};
      const patientMenus: any = {
        _name: 'CSidebarNavDropdown',
        name: 'Patient',
        
        icon: 'cil-puzzle',
        items: [ ]};
      const prescriptionMenus: any = {
          _name: 'CSidebarNavDropdown',
          name: 'Prescription',
          
          icon: 'cil-puzzle',
          items: [ ]};

      const settingMenus: any = {
            _name: 'CSidebarNavDropdown',
            name: 'Settings',
            
            icon: 'cil-puzzle',
            items: [ ]};

      const labMenus: any = {
              _name: 'CSidebarNavDropdown',
              name: 'Pathology/Lab',
              
              icon: 'cil-puzzle',
              items: [ ]};
      const reportMenus: any = {
              _name: 'CSidebarNavDropdown',
              name: 'Reports',
              
              icon: 'cil-puzzle',
              items: [ ]};
      
      data.map((m: any)=>{
        
        if(m.permissions[0].read){
          const menu = {
            _name:'CSidebarNavItem',
            name:m.name,
            to:m.route,
            icon:m.icon,
           
          }
          if(m.name.toString().toLowerCase().match(/medicine/)){
            if(_groups.indexOf('medicine') == -1){
              _groups.push('medicine');
              _navs.push(medicineMenus);
            }
            medicineMenus.items.push(menu);
          }else if(m.name.toString().toLowerCase().match(/patient/)){
            if(_groups.indexOf('patient') == -1){
              _groups.push('patient');
              _navs.push(patientMenus);
            }
            patientMenus.items.push(menu);
          }else if(m.name.toString().toLowerCase().match(/prescription/)){
            if(_groups.indexOf('prescription') == -1){
              _groups.push('prescription');
              _navs.push(prescriptionMenus);
            }
            prescriptionMenus.items.push(menu);
          }else if(m.name.toString().toLowerCase().match(/center|employee|role|village|categor|services/)){
            if(_groups.indexOf('settings') == -1){
              _groups.push('settings');
              _navs.push(settingMenus);
            }
            settingMenus.items.push(menu);
          }else if(m.name.toString().toLowerCase().match(/lab/)){
            if(_groups.indexOf('lab') == -1){
              _groups.push('lab');
              _navs.push(labMenus);
            }
            labMenus.items.push(menu);
          }else if(m.name.toString().toLowerCase().match(/report|record|monitor|statistic/)){
            if(_groups.indexOf('report') == -1){
              _groups.push('report');
              _navs.push(reportMenus);
            }
            reportMenus.items.push(menu);
          }else{
            _navs.push(menu)
          }
        }
      });
      return _navs;
  }

}
