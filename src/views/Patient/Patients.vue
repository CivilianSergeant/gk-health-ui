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
      <span v-if="isBusy" class="center badge badge-info">Loanding</span>
      <b-pagination
        v-model="currentPage"
        :total-rows="rows"
        :per-page="perPage"
        aria-controls="patient-table"
      ></b-pagination>
  </div>
</template>

<script>
import ContentBar from '@/components/ContentBar.vue'
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
        fields: ['pid','center.name','fullName','guardianName','gender','maritalStatus'],

      }
  },
  components: {
    ContentBar
  },
  watch: {
    currentPage: {
      handler: function(value) {
        this.fetchPatients();
      }
    }
  },
  beforeMount(){
    this.fetchPatients();
  },
  methods:{
    fetchPatients(){
      (new PatientService()).getPatients((this.currentPage-1),this.perPage).then(result=>{
        this.totalPages = result.totalPages;
        this.totalRows = result.totalElements;
      
        this.patients = result.content;
      });
    }
  }
}
</script>