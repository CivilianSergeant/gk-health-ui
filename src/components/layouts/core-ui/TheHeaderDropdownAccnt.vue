<template>
  <CDropdown
    v-if="isLive"
    inNav
    class="c-header-nav-items"
    placement="bottom-end"
    add-menu-classes="pt-0"
  >
    <template #toggler>
      <CHeaderNavLink>
        <!-- <div class="c-avatar">
          <img src="img/avatars/6.jpg" class="c-avatar-img" />
        </div> -->
        {{ "Welcome " + username }}
      </CHeaderNavLink>
    </template>
    <CDropdownHeader tag="div" class="text-center" color="light">
      <strong
        ><CLink :href="showAccount()">{{
          "Office/Center: " + HealthCenter
        }}</CLink></strong
      >
      <!-- <strong>{{ "Welcome " + username }}</strong> -->
    </CDropdownHeader>
    <CDropdownItem :href="showAccount()" target="_blank">
      <CIcon name="cil-user" />Profile
    </CDropdownItem>
    <CDropdownItem href="http://training.ghrmplus.com" target="_blank">
      <CIcon name="cil-settings" />HRM
    </CDropdownItem>
    <CDropdownDivider />
    <CDropdownItem :href="onLogout()">
      <CIcon name="cil-lock-locked" />Sign Out
    </CDropdownItem>
  </CDropdown>
</template>

<script lang="ts">
//import Vue from "*.vue"
import { Component, Prop, Vue } from "vue-property-decorator";
import { ApiRoutes } from "@/helpers/ApiRoutes";
import axios from "axios";
import { hasRole } from "@/helpers/Roles";

@Component
export default class TheHeaderDropdownAccnt extends Vue {
  // name: 'TheHeaderDropdownAccnt',
  // data () {
  //   return {
  //     itemsCount: 42
  //   }
  // }
  isLive() {
    return this.$store.state.keycloak != null ? true : false;
  }

  get HealthCenter() {
    return this.$store.state.center.name;
  }

  get username() {
    return (
      this.$store.state.employee.fullName +
      ` (${hasRole(this.$store.getters.auth)})`
    );
  }

  onLogout() {
    return (
      ApiRoutes.LOGOUT_PATH + "?redirect_uri=" + encodeURI(ApiRoutes.DOMAIN)
    );
    // window.location.reload();
  }

  showAccount() {
    return ApiRoutes.USER_ACCOUNT_PATH;
  }
}
</script>

<style scoped>
.c-icon {
  margin-right: 0.3rem;
}
</style>