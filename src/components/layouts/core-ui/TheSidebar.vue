<template>
  <CSidebar 
    fixed 
    :minimize="minimize"
    :show="show"
    @update:show="(value) => $store.commit('set', ['sidebarShow', value])"
  >
    <CSidebarBrand class="d-md-down-none" to="/">
      <CIcon 
        class="c-sidebar-brand-full" 
        name="logo" 
        size="custom-size" 
        :height="35" 
        viewBox="0 0 556 134"
      />
      <CIcon 
        class="c-sidebar-brand-minimized" 
        name="logo" 
        size="custom-size" 
        :height="35" 
        viewBox="0 0 110 134"
      />
    </CSidebarBrand>

    <CRenderFunction v-if="!isBusy" flat :content-to-render="nav"/>
    <Loader :isBusy="isBusy"/>
    <CSidebarMinimizer
      class="d-md-down-none"
      @click.native="$store.commit('set', ['sidebarMinimize', !minimize])"
    />
  </CSidebar>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Sidebar extends Vue{
  name ='TheSidebar';
  
  get isBusy(){
    return this.$store.state.isMenuLoading;
  }

  get nav(){
     
      return  this.$store.getters.navs;
      
  }
  
  get show () {
      return this.$store.state.sidebarShow 
  }
  
  get minimize () {
      return this.$store.state.sidebarMinimize 
  }
  
}
</script>
