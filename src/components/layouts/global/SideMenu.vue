<template>
    <nav id="sidebarMenu" class="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
      <div class="position-sticky pt-3">
        <ul class="nav flex-column" v-if="!isBusy">
          <li  class="nav-item"  v-for="(menu,i) in menus" :key="i" @click="menuClicked">

              <router-link :to="menu.route" v-if="menu.permissions[0].read"  class="nav-link active"> {{menu.name}}</router-link>
              
          </li>  
          
          
        </ul>
        <Loader :isBusy="isBusy"/>
        
      </div>
    </nav>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Menu } from '@/entity/Menu'

@Component
export default class Sidebar extends Vue {
  
  private currentLocation = ''

  get isBusy(){
    return this.$store.state.isMenuLoading;
  }
  get menus(){
    return this.$store.getters.menus;
  }
  mounted () {
    this.currentLocation = location.href
    this.$store.commit('startLoadingMenu');
    
    this.selectedMenu()
  }

  menuClicked(){
    this.$store.commit('clearMessage');
  }

  selectedMenu () {
    this.menus.map((menu: Menu) => {
      if (menu.children) {
        menu.children.map((submenu: Menu) => {
          if (this.currentLocation.indexOf(menu.link) > -1 || this.currentLocation.indexOf(submenu.link) > -1) {
            menu.selected = true
          }
        })
      }
    })
  }

  handleClickMenu (index: number) {
    this.currentLocation = location.href
    this.menus.map((menu: Menu) => {
      const i = this.menus.indexOf(menu)
      if (i !== -1 && index === i) {
        menu.selected = true
      } else {
        menu.selected = false
      }
      return menu
    })
  }
}
</script>

<style>
li a.nav-link{
  color:#4a5055 !important;
}
li a.router-link-exact-active{
  color:#507aeef8 !important;
}
</style>
