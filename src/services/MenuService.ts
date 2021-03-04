import { Menu } from '@/entity/Menu'

export class MenuService {
  static getMenus () {
    return [
      new Menu('Dashboard', '/', false, true, 'fas fa-home', null),
      new Menu('Heath Center', '/health-centers', false, true, 'fas fa-cog', null),
      new Menu('Employees', '/employees', false, true, 'fas fa-laptop-house', null),
      new Menu('Patients', '/patients', false, true, 'fas fa-users', null),
      new Menu('Prescription', '/prescription', false, true, 'fas fa-users', null),
      new Menu('Service Categories', '/service-categories', false, true, 'fas fa-users', null),
      new Menu('Services', '/services', false, true, 'fas fa-users', null),
      new Menu('Service Packages', '/services-packages', false, true, 'fas fa-users', null),
      new Menu('Lab Tests', '/lab-tests', false, true, 'fas fa-users', null),
    ]
  }
}
