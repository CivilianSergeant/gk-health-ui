<template>
    <nav id="sidebarMenu" class="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
      <div class="position-sticky pt-3">
        <ul class="nav flex-column">
          <li  class="nav-item" v-for="(menu,i) in menus" :key="i" @click="menuClicked">

              <router-link :to="menu.link"   class="nav-link active"> {{menu.name}}</router-link>
              
          </li>  
          
          
        </ul>

        
      </div>
    </nav>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Menu } from '@/entity/Menu.ts'
import { MenuService } from '@/services'

@Component
export default class Sidebar extends Vue {
  private menus: Menu[] = [];
  private currentLocation = ''

  mounted () {
    this.currentLocation = location.href
    this.menus = MenuService.getMenus()
    this.selectedMenu()
  }

  menuClicked(){
    this.$store.commit('clearMessage');
  }

  selectedMenu () {
    this.menus.map((menu) => {
      if (menu.children) {
        menu.children.map((submenu) => {
          if (this.currentLocation.indexOf(menu.link) > -1 || this.currentLocation.indexOf(submenu.link) > -1) {
            menu.selected = true
          }
        })
      }
    })
  }

  handleClickMenu (index: number) {
    this.currentLocation = location.href
    this.menus.map(menu => {
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
li a.router-link-exact-active, li a.router-link-active{
  color:#507aeef8 !important;
}
</style>
