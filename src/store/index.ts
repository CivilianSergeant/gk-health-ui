import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isRouteCheckingPermission:false,
    isBusy:false,
    isMenuLoading:false,
    isError:false,
    isSuccess:false,
    user:{},
    auth:{},
    center:{},
    employee:{},
    message:'',
    menus:[],
    sidebarShow: true, //'responsive',
    sidebarMinimize: false
  },
  mutations: {
    startLoadingMenu(state){
      state.isMenuLoading=true;
    },
    menuLoaded(state){
      state.isMenuLoading=false;
    },
    start(state){
      state.isBusy=true;
    },
    finish(state){
      state.isBusy=false;
    },
    setSuccessMsg(state,msg){
      state.isSuccess=true;
      state.isError=false;
      state.message=msg;
    },
    setErrorMsg(state,msg){
      state.isSuccess=false;
      state.isError=true;
      state.message=msg;
    },
    clearErrorMsg(state){
      state.isError=false;
    },
    clearSuccessMsg(state){
      state.isSuccess=false;
    },
    clearMessage(state){
      state.isError=false;
      state.isSuccess=false;
    },
    setUser(state,user){
      state.user = user;
    },
    setAuth(state,keycloak){
      state.auth = keycloak;
    },
    setCurrentCenter(state,center){
      state.center = center;
    },
    setCurrentEmployee(state, employee){
      state.employee = employee;
    },
    setMenus(state,menus){
      state.menus = menus;
    },
    setRoutePermissionStatus(state,checking){
      state.isRouteCheckingPermission = checking
    },
    toggleSidebarDesktop (state) {
      const sidebarOpened = [true, 'responsive'].includes(state.sidebarShow)
      state.sidebarShow = sidebarOpened ? false : true // 'responsive'
    },
    toggleSidebarMobile (state) {
      const sidebarClosed = [false, 'responsive'].includes(state.sidebarShow)
      state.sidebarShow = sidebarClosed ? true : false // 'responsive'
    },
    set (state: any, [variable, value]) {
      state[variable] = value
    }
  },
  getters:{
    center: state=> {return state.center} ,
    employee: state=>  {return state.employee} ,
    auth: state=> {return state.auth},
    menus: state=> {return state.menus},
    routeChecking: state=> {return state.isRouteCheckingPermission}
  },
  actions: {
  },
  modules: {
  }
})
