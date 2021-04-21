<template>
  <div id="layout" class="c-app">

    <!-- Core Ui Theme Code -->
    <TheSidebar/>
    <CWrapper>
      <TheHeader/>
      <div class="c-body">
        <main class="c-main">
          <CContainer fluid>
            <transition name="fade" mode="out-in">
              <router-view :key="$route.path"></router-view>
            </transition>
          </CContainer>
        </main>
      </div>
      <TheFooter/>

      <!-- Basic Theme code -->
      <!-- <div class="container-fluid">
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
      </div> -->
    </CWrapper>  
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
// import AppHeader  from './components/layouts/global/AppHeader.vue';
import TheHeader  from './components/layouts/core-ui/TheHeader.vue';
import TheSidebar from './components/layouts/core-ui/TheSidebar.vue';
import TheFooter from './components/layouts/core-ui/TheFooter.vue';
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
    // AppHeader,
    TheHeader,
    TheSidebar,
    TheFooter,
    SideMenu
  },
})
export default class App extends Vue {

  @Prop() keycloak!: any;

}
</script>

<style lang="scss">
  // Import Main styles for this application
  @import 'assets/scss/style';

// .fade-enter-active,
// .fade-leave-active {
//   transition-duration: 0.09s;
//   transition-property: opacity;
//   transition-timing-function: ease;
// }

// .fade-enter,
// .fade-leave-active {
//   opacity: 0
// }
</style>
