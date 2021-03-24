<template>
    <header class="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
        <a class="navbar-brand col-md-3 col-lg-2 me-0 px-3" href="#">{{title}}</a>
        <button class="navbar-toggler position-absolute d-md-none collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <!-- <input class="form-control form-control-dark w-100" type="text" placeholder="Search" aria-label="Search"> -->
        <ul class="navbar-nav px-3" v-if="isLive">
          <li><span class="nav-link text-white" :href="showAccount()"> {{'Center: '+HealthCenter}}</span></li>
          <li class="nav-item text-nowrap">
            
            <b-dropdown id="dropdown-1" :text="'Welcome '+username" class="m-md-2">
              <a class="dropdown-item text-dark" :href="showAccount()">Profile</a>
              <a class="dropdown-item text-dark" target="_blank" href="http://training.ghrmplus.com">HRM</a>
              <b-dropdown-divider></b-dropdown-divider>
              <a class="dropdown-item text-dark" :href="onLogout()">Sign out</a>
            </b-dropdown>
          </li>
          <li class="nav-item text-nowrap ml-2">
          </li>
        </ul>
      </header>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { ApiRoutes } from '@/helpers/ApiRoutes';
import axios from 'axios';

@Component
export default class AppHeader extends Vue {
  @Prop() private msg!: string;

  private title = 'GK Health';

  

  isLive(){
    return (this.$store.state.keycloak != null)? true :false
  }

  get HealthCenter(){
    return this.$store.state.center.name;
  }

  get username(){
    return this.$store.state.employee.name;
  }

  onLogout(){
    return ApiRoutes.LOGOUT_PATH+"?redirect_uri="+encodeURI(ApiRoutes.DOMAIN);
    // window.location.reload();
  }

  showAccount(){
    return ApiRoutes.USER_ACCOUNT_PATH;
  }
  
  
}
</script>
<style scoped>
.navbar-nav {flex-direction: row;}
.text-white{ color: white !important;}
</style>
