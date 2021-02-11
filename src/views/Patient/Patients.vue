<template>
  <div>
    <ContentBar :PageTitle="title"/>
    <b-alert v-model="isError" variant="danger">{{errorMsg}}</b-alert>
    <h5>All Patients <router-link to="/patients/add" class=" btn btn-primary btn-sm float-right">Add Patient</router-link></h5>
    <b-table id="patient-table" :fields="fields" :per-page="0" :busy.sync="isBusy"
        :current-page="currentPage" :items="patients">
        <template #cell(active)="row">
          <span v-if="row.item.active" class="badge badge-success">Active </span>
          <span v-if="!row.item.active" class="badge badge-danger">Inactive </span>
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

export default {
  name: 'Patients',
  computed: {
    rows() {
      return this.totalRows
    }
  },
  data(){
      return {
        title: "Patients",
        isBusy: false,
        isError: false,
        patients: [],
        totalPages:0,
        totalRows:0,
        errorMsg: '',
        perPage: 2,
        currentPage: 1,
        fields: ['pid',{key:'center.name',label:'Center Name'},'fullName','guardianName','gender','maritalStatus'],

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
    this.fetchPatients();
  },
  methods:{
    fetchPatients(){
      this.isBusy=true;
      (new PatientService()).getPatients((this.currentPage-1),this.perPage).then(result=>{
        this.isBusy =false;
        this.totalPages = result.totalPages;
        this.totalRows = result.totalElements;
        this.patients = result.content;
      })
      .catch(error=>{
        this.isError=true;
        this.isBusy=false;
        if(error.toString().match('Error: Network Error') !=null){
          this.errorMsg = 'Opps! Network Error, Please try again later'
        }else if(error.toString.length>0){
          this.errorMsg = error;
        }
      });
    }
  }
}
</script>