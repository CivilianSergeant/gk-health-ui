<template>
  <div id="app">
      <AppHeader/>
      <div class="container-fluid">
        <div class="row">
          <SideMenu/>
          <main class="offset-lg-2 offset-md-3 col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <transition
              name="fade"
              mode="out-in"
            >
              <router-view></router-view>
            </transition>
          </main>
          
        </div>
      </div>
      
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import AppHeader  from './components/layouts/global/AppHeader.vue';
import ContentBar  from './components/layouts/global/ContentBar.vue';
import SideMenu  from './components/layouts/global/SideMenu.vue';
import Loader from '@/components/global/Loader.vue';

Vue.component('ContentBar',ContentBar);
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
.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.09s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0
}
</style>
