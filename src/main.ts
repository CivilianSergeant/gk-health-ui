import Vue from 'vue'
import {BootstrapVue , IconsPlugin } from 'bootstrap-vue'

import FileUploder from '@/plugin/file-uploader/index.ts'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import './assets/dashboard.css'

Vue.use(BootstrapVue)

Vue.use(IconsPlugin)

Vue.use(FileUploder)

import App from './App.vue'
import Error from './Error.vue'
import router from './router'
import store from './store'

import Keycloak from 'keycloak-js'
import { UserService } from './services/UserService';
import { ApiRoutes } from './helpers/ApiRoutes';
import { hasRole, Role } from './helpers/Roles';
import { EmployeeService } from './services';
// import axios from 'axios';

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
    console.log(hasRole(Role.PARAMEDIC,keycloak.realmAccess.roles));
  }
}

declare global{
  interface Window{
    uploadedFiles: [];
  }
}


function initKeycloak (){
  keycloak.init({ onLoad: initOptions.onLoad }).then((auth: any) => {
    if (!auth) {
      console.log('h')
      window.location.reload();
    } else {
      console.info("Authenticated", keycloak.token);
      store.commit('setAuth',keycloak);
      
      UserService.getUserInfo(ApiRoutes.USER_INFO_PATH,keycloak.token)
        .then(res=>{
          console.log(res);
          store.commit('setUser',res)
        });
        fetch("http://training.ghrmplus.com/api/EmployeeInfo/GetCurrentEmployeeInfo",{
        method:"GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+keycloak.token,
        },
        }).then(result=>result.json()).then(result=>{
          const _result = result.Result;
          store.commit('setCurrentCenter',{id:_result.Office.OfficeId,centerCode:_result.Office.OfficeCode,name:_result.Office.OfficeName});
          
          (new EmployeeService()).getEmployeeByApiId(_result.EmployeeId).then(result=>{
            console.log('here', result)
            store.commit('setCurrentEmployee',result);
          });
          
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
      console.log('h3')
      keycloak.updateToken(30).then((refreshed: any) => {
        console.log('h4')
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
    console.log(result)
    authServerStatus=true; 
    initKeycloak();
  })
  .catch((e)=>{
    console.log(e)
    authServerStatus=false;
    new Vue({
      render: h => h(Error)
      }).$mount('#app')
  });
// }

// if(authServerStatus){
  
// }



