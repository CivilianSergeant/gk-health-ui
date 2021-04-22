<template>
  <CSidebar
    fixed
    :minimize="minimize"
    :show="show"
    @update:show="(value) => $store.commit('set', ['sidebarShow', value])"
  >
    <CSidebarBrand class="d-md-down-none" to="/">
      <!-- <CIcon
        class="c-sidebar-brand-full"
        name="logo"
        size="custom-size"
        :height="35"
        viewBox="0 0 556 250"
      />
      <CIcon
        class="c-sidebar-brand-minimized"
        name="logo"
        size="custom-size"
        :height="35"
        viewBox="0 0 250 300"
      /> -->
      <span class="c-sidebar-brand-full">GK Health</span>
      <span class="c-sidebar-brand-minimized">GK</span>
    </CSidebarBrand>

    <CRenderFunction v-if="!isBusy" flat :content-to-render="nav" />
    <Loader :isBusy="isBusy" />
    <CSidebarMinimizer
      class="d-md-down-none"
      @click.native="$store.commit('set', ['sidebarMinimize', !minimize])"
    />
  </CSidebar>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Sidebar extends Vue {
  name = "TheSidebar";

  get isBusy() {
    return this.$store.state.isMenuLoading;
  }

  get nav() {
    return this.$store.getters.navs;
  }

  get show() {
    return this.$store.state.sidebarShow;
  }

  get minimize() {
    return this.$store.state.sidebarMinimize;
  }
}
</script>
