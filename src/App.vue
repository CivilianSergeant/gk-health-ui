<template>
  <div id="app">
      <AppHeader/>
      <div class="container-fluid">
        <div class="row">
          <SideMenu/>
          <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
          <router-view></router-view>
          </main>
          
        </div>
      </div>
      
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import AppHeader  from './components/AppHeader.vue';
import SideMenu  from './components/SideMenu.vue';
import Loader from '@/components/global/Loader.vue';

Vue.component('Loader',Loader);

import Home  from './views/Home.vue';
@Component({
  components: {
    AppHeader,
 
    SideMenu
  },
})
export default class App extends Vue {}
</script>

<style lang="scss">
#app {
  // font-family: Avenir, Helvetica, Arial, sans-serif;
  // -webkit-font-smoothing: antialiased;
  // -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  // color: #2c3e50;
  // margin-top: 60px;
}
</style>
