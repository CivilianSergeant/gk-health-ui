<template>
  <div>
    <ContentBar :PageTitle="title"/>
    <b-alert v-model="isSuccess" variant="success">{{message}}</b-alert>
    <b-alert v-model="isError" variant="danger">{{message}}</b-alert>
    <h5>All Patients <router-link to="/patients/add" class=" btn btn-primary btn-sm float-right">Add Patient</router-link></h5>
    <b-form @submit.prevent="onSearch">
      <div class="row mb-3">
        <div class="col-md-3">
          <Autocomplete :ajax="true" @choose-item="handleAutoComplete" 
            :items="centers" label="name" rowId="id"
            @ajax-call="handleOnChangeAjaxCall" placeholder="Select Center"/>
        </div>
        <div class="col-md-2">
          <b-form-select v-model="search.keywordType" :options="keywordTypes"></b-form-select>
        </div>
        <div class="col-md-2">
          <b-form-input v-model="search.keyword"></b-form-input>  
        </div>  
        <div class="col-md-2">
          <b-button size="sm" variant="info">Search</b-button>
        </div>
      </div>
    </b-form>
    <b-table id="patient-table" :fields="fields" :per-page="0" :busy.sync="isBusy"
        :current-page="currentPage" :items="patients">
        <template #cell(active)="row">
          <span v-if="row.item.active" class="badge badge-success">Active </span>
          <span v-if="!row.item.active" class="badge badge-danger">Inactive </span>
        </template>

        <template #cell(action)="row">
          <b-button size="sm" variant="info" @click="viewDetail(row.item.id)">Detail</b-button>
        </template>
      </b-table>
      <Loader :isBusy="isBusy" />
      <b-pagination
        v-model="currentPage"
        :total-rows="rows"
        :per-page="perPage"
        aria-controls="patient-table"
      ></b-pagination>
  </div>
</template>

<script>

import { PatientService } from '@/services/PatientService'
import { CenterService } from '@/services';

export default {
  name: 'Patients',
  computed: {
    rows() {
      return this.totalRows
    },
    isBusy(){
      return this.$store.state.isBusy;
    },
    isError(){
      return this.$store.state.isError;
    },
    isSuccess(){
      return this.$store.state.isSuccess;
    },
    message(){
      return this.$store.state.message;
    }
  },
  data(){
      return {
        title: "Patients",
        patients: [],
        centers:[],
        center:null,
        centerSearchAutoComplete: null,
        totalPages:0,
        totalRows:0,
        errorMsg: '',
        perPage: 20,
        currentPage: 1,
        fields: [
          {key:'pid',label:'Patient ID'},
          {key:'center',label:'Center Name'},
          'fullName','guardianName','gender','maritalStatus','action'
        ],
        keywordTypes:[
          {value:null,text:'Select Field'},
          {value:'fullName',text:'Name'},
          {value:'pid', text:'PID'},
          {value:'mobileNumber',text:'Mobile No'}
        ],
        search:{keywordType:null,keyword:''}

      }
  },

  watch: {
    currentPage: {
      handler: function() {
        this.fetchPatients();
      }
    }
  },
  beforeMount(){
    this.$store.commit('clearErrorMsg');
    this.fetchPatients();
  },
  methods:{
    handleOnChangeAjaxCall(searchText){
      if (searchText.length >= 2) {
        (new CenterService())
          .getCentersByKeyword(searchText)
          .then(result => {
            this.centers = result;
            
          });
      }
    },
    handleAutoComplete(center, autocomplete){
      this.center = center,
      this.centerSearchAutoComplete = autocomplete;
    },

    viewDetail(id){
      this.$router.push('/patients/'+id);
    },
    fetchPatients(){
      this.$store.commit('start');
      (new PatientService()).getPatients((this.currentPage-1),this.perPage).then(result=>{
        this.$store.commit('finish');
        this.totalPages = result.totalPages;
        this.totalRows = result.totalElements;
        this.patients = result.content;
      })
      .catch(error=>{
        
        this.$store.commit('finish');
        if(error.toString().match('Error: Network Error') !=null){
          this.$store.commit('setErrorMsg','Opps! Network Error, Please try again later');
          
        }else if(error.toString.length>0){
          this.$store.commit('setErrorMsg',error);
          
        }
      });
    }
  }
}
</script>