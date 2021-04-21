import Vue from 'vue'
import {BootstrapVue , IconsPlugin } from 'bootstrap-vue'

import FileUploder from '@/plugin/file-uploader/index'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import './assets/dashboard.css'

// Core UI 
import 'core-js/stable'
import CoreuiVue from '@coreui/vue'
// import {iconsSet as icons} from '@/assets/icons/icons';
// Vue.use(icons);
// End Core UI

Vue.use(BootstrapVue)

Vue.use(IconsPlugin)



Vue.use(FileUploder)
Vue.use(CoreuiVue)

import App from './App.vue'
import Error from './Error.vue'
import router from './router'
import store from './store'

import Keycloak from 'keycloak-js'
import { UserService } from './services/UserService';
import { ApiRoutes } from './helpers/ApiRoutes';
import { hasRole, Role } from './helpers/Roles';
import { CenterService, EmployeeService, MenuService } from './services';


Vue.config.productionTip = false


enum ENV_MODE {
  DEV_MODE = 'dev',
  PROD_MODE = 'prod'
}

const ENV = ENV_MODE.DEV_MODE;
const clientId = (ENV.toString() === ENV_MODE.PROD_MODE)? 'demo-vue-app' : 'sandbox-health-ui';

const initOptions = {
  url: ApiRoutes.AUTH_PATH, 
  realm: 'GK_HEALTH', 
  clientId: clientId,
  onLoad: 'login-required'
}
const keycloak: any = Keycloak(initOptions);

let authServerStatus = false;

const MyMixin = {
  created(){
    MenuService.getMenus().then(result=>{
      store.commit('setMenus',result);
      store.commit('menuLoaded');
    });
    
    console.log(hasRole(keycloak));
  }
}

declare global{
  
  interface Window{
    uploadedFiles: [];
  }
}

function checkRoutePermission(route: any,writePath: boolean,next: any){
  const routes = store.getters.menus.filter((m: any)=>m.route == route);
  if(routes.length==1){
    if(writePath == true && routes[0].permissions[0].write == true){
      store.commit('setRoutePermissionStatus',false);
      next();
    }else if(writePath == false && routes[0].permissions[0].read == true){
      store.commit('setRoutePermissionStatus',false);
      next();
    }else{
      store.commit('setRoutePermissionStatus',false);
      next('/access-denied');
    }
  }else{
    next();
  }
}

//Route Guard
router.beforeEach((to,from,next)=>{
  store.commit('setRoutePermissionStatus',true);
  console.log(to,from,'here menus undefined',store.getters.menus);
  const segments = to.path.split("/");
  const route = "/"+segments[1];
  const writePath = (to.path.includes('add') || to.path.includes('edit'));
  if(store.getters.menus.length==0){
     MenuService.getMenus().then(result=>{
      store.commit('setMenus',result);
      store.commit('menuLoaded');

      checkRoutePermission(route,writePath,next);
      
    });
    
  }else if(store.getters.menus.length>0){
    checkRoutePermission(route,writePath,next);
    next();
  }
  store.commit('setRoutePermissionStatus',false);
  
});



function initKeycloak (){
  keycloak.init({ onLoad: initOptions.onLoad }).then((auth: any) => {
    if (!auth) {
      // console.log('h')
      window.location.reload();
    } else {
      console.info("Authenticated", keycloak.token);
      store.commit('setAuth',keycloak);
      fetch("http://training.ghrmplus.com/api/EmployeeInfo/GetCurrentEmployeeInfo",{
        method:"GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+keycloak.token,
        },
        }).then(result=>result.json()).then(result=>{
          const _result = result.Result;
          console.log(_result.OfficeId);
          (new CenterService()).getCenterByApiId(_result.OfficeId).then(result=>{
            store.commit('setCurrentCenter',result);
          });

          
          
          (new EmployeeService()).getEmployeeByApiId(_result.EmployeeId).then(result=>{
            // console.log('here', result)
            store.commit('setCurrentEmployee',result);
          });
          
        });  
      UserService.getUserInfo(ApiRoutes.USER_INFO_PATH,keycloak.token)
        .then(res=>{
          // console.log(res);
          store.commit('setUser',res)
        });
        
      new Vue({
        router,
        store,
        mixins:[MyMixin],
        render: h => h(App,{ props: { keycloak: keycloak } })
      }).$mount('#app')
    }

  //Token Refresh
    setInterval(() => {
      // console.log('h3')
      keycloak.updateToken(30).then((refreshed: any) => {
        // console.log('h4')
        if (refreshed) {
          console.info('Token refreshed' + refreshed,);
        } else {
          console.info('Token not refreshed, valid for '
            + Math.round(keycloak.tokenParsed.exp + keycloak.timeSkew - new Date().getTime() / 1000) + ' seconds');
          
        }
      }).catch(() => {
        store.commit('setErrorMsg','Network connection failed');
        console.error('Failed to refresh token');
      });
    }, 6000)

  }).catch(() => {
    console.error("Authenticated Failed");
  });
}

// if(ENV==ENV_MODE.DEV_MODE){
//   new Vue({
//     router,
//     store,
//     render: h => h(App,{ props: { keycloak: null } })
//   }).$mount('#app')
// }else{
  

  fetch(ApiRoutes.REALM_PATH,{
    method:"GET",
  }).then(r=>{return r.json(); }).then(result=>{
    // console.log(result)
    authServerStatus=true; 
    initKeycloak();
  })
  .catch((e)=>{
    // console.log(e)
    authServerStatus=false;
    new Vue({
      render: h => h(Error)
      }).$mount('#app')
  });
// }

// if(authServerStatus){
  
// }



