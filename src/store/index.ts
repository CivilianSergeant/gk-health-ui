import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isBusy:false,
    isError:false,
    isSuccess:false,
    user:{},
    auth:{},
    center:{},
    employee:{},
    message:''
  },
  mutations: {
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
    }
  },
  getters:{
    center: state=> {return state.center} ,
    employee: state=>  {return state.employee} ,
    auth: state=> {return state.auth}
  },
  actions: {
  },
  modules: {
  }
})
