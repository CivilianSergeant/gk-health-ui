import Vue from 'vue'
import {BootstrapVue , IconsPlugin } from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import './assets/dashboard.css'

Vue.use(BootstrapVue)

Vue.use(IconsPlugin)

import App from './App.vue'
import router from './router'
import store from './store'

import Keycloak from 'keycloak-js'
import { UserService } from './services/UserService';
import { ApiRoutes } from './helpers/ApiRoutes';
// import axios from 'axios';

Vue.config.productionTip = false



const initOptions = {
  url: ApiRoutes.AUTH_PATH, 
  realm: 'GK_HEALTH', 
  clientId: 'demo-vue-app',
  onLoad: 'login-required'
}
const keycloak: any = Keycloak(initOptions);



keycloak.init({ onLoad: initOptions.onLoad }).then((auth: any) => {
  if (!auth) {
    window.location.reload();
  } else {
    console.info("Authenticated", keycloak.token);
    store.commit('setAuth',keycloak);
    
    UserService.getUserInfo(ApiRoutes.USER_INFO_PATH,keycloak.token)
      .then(res=>{
        console.log(res);
        store.commit('setUser',res)
      });

    new Vue({
      router,
      store,
      render: h => h(App,{ props: { keycloak: keycloak } })
    }).$mount('#app')
  }


//Token Refresh
  setInterval(() => {
    keycloak.updateToken(70).then((refreshed: any) => {
      if (refreshed) {
        console.info('Token refreshed' + refreshed,);
      } else {
        console.info('Token not refreshed, valid for '
          + Math.round(keycloak.tokenParsed.exp + keycloak.timeSkew - new Date().getTime() / 1000) + ' seconds');
        
      }
    }).catch(() => {
      console.error('Failed to refresh token');
    });
  }, 6000)

}).catch(() => {
  console.error("Authenticated Failed");
});


