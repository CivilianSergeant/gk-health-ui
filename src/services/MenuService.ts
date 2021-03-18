import { Menu } from '@/entity/Menu'
import { hasRole, Role } from '@/helpers/Roles';
import store from '@/store';

export class MenuService {
  static getMenus () {
    const paramedicRole = hasRole(Role.PARAMEDIC,store.state.auth.realmAccess.roles);
    const superadminRole = hasRole(Role.SUPER_ADMIN,store.state.auth.realmAccess.roles);
    console.log(superadminRole)
    const menus: Menu[] = [];
    if(paramedicRole.length){
      
      menus.push(new Menu('Dashboard', '/', false, true, 'fas fa-home', null));
      menus.push(new Menu('Prescription', '/prescription', false, true, 'fas fa-users', null));

    }else if(superadminRole.length){
      console.log(superadminRole)
      menus.push(new Menu('Dashboard', '/', false, true, 'fas fa-home', null));
      menus.push(new Menu('Heath Center', '/health-centers', false, true, 'fas fa-cog', null));
      menus.push(new Menu('Employees', '/employees', false, true, 'fas fa-laptop-house', null));
      menus.push(new Menu('Patients', '/patients', false, true, 'fas fa-users', null));
      menus.push(new Menu('Prescription', '/prescription', false, true, 'fas fa-users', null));
      menus.push(new Menu('Service Categories', '/service-categories', false, true, 'fas fa-users', null));
      menus.push(new Menu('Services', '/services', false, true, 'fas fa-users', null));
      menus.push(new Menu('Service Packages', '/services-packages', false, true, 'fas fa-users', null));
      menus.push(new Menu('Lab Tests', '/lab-tests', false, true, 'fas fa-users', null));
      menus.push(new Menu('Medicines', '/medicines', false, true, 'fas fa-users', null));
    }

    return menus;
  }
}
