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
import Status from '@/components/global/Status.vue';
import Loader from '@/components/global/Loader.vue';
import VueTypeaheadBootstrap from 'vue-typeahead-bootstrap'

import Autocomplete from './components/Autocomplete.vue'

Vue.component('ContentBar',ContentBar);
Vue.component('Autocomplete',Autocomplete);
Vue.component('Status',Status);
Vue.component('Loader',Loader);
Vue.component('VueTypeaheadBootstrap',VueTypeaheadBootstrap);


// import Home  from './views/Home.vue';
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
