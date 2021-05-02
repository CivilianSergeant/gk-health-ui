<template>
  <div>
    <!-- <ContentBar :PageTitle="title"/> -->
    <!-- <h5 class="py-3"></h5> -->
    <cCard>
      <cCardBody>
        
        <b-form @submit.prevent="onSearch">
          <div class="row" >
            <div class="col-md-3" v-if="showRaOfficeList">
              <b-form-group
              id="input-group-regional-office"
              label="Region Office:"
              label-for="regional-office"
              >
                <b-form-select :options="raOffices" @change="handleChangeRaOffice" v-model="search.raoffice"></b-form-select>
              </b-form-group>
            </div>
            <div class="col-md-3" >
              <Loader :isBusy="isBusy" />
              <b-form-group v-if="hcOffices.length>0"
              id="input-group-hc-office"
              label="HC Office:"
              label-for="hc-office"
              >
                <b-form-select :options="hcOffices" @change="handleChangeHcOffice" v-model="search.hcoffice"></b-form-select>
              </b-form-group>
            </div>
          </div>
          <div class="row py-2 mx-2 d-flex justify-content-start">
            <div class="mr-2">
              <!-- <b-form-datepicker
                id="datepicker-placeholder"
                placeholder="from date"
                locale="en"
                
                v-model="form.from_date"
              ></b-form-datepicker> -->
              <b-form-group
              label="From Date"
              >
              <b-form-input type="date" placeholder="from date" v-model="form.from_date">
              </b-form-input>
              </b-form-group>
            </div>
            <div>
              <b-form-group
              label="To Date"
              >
              <b-form-input type="date" placeholder="To date" v-model="form.to_date">
              </b-form-input>
              </b-form-group>
              <!-- <b-form-datepicker
                id="datepicker-placeholder2"
                placeholder="To date"
                locale="en"
                v-model="form.to_date"
              ></b-form-datepicker> -->
            </div>
            <div>
              <b-form-group
              label="."
              class="text-white"
              >
              <b-button type="submit" class="ml-2" variant="info"
                >Search</b-button
              >
              </b-form-group>
            </div>
          </div>
        </b-form>
      </cCardBody>
    </cCard>
    <cCard>
      <cCardHeader> Service Records </cCardHeader>
      <cCardBody>
        <div class="text-center" v-if="serviceRecords.length==0">To Search Records Select Date Range</div>
        <div v-for="sr in serviceRecords" :key="sr.center.id">
          <h6>{{ sr.center.name }}</h6>
          <table class="table table-bordered">
            <thead class="thead-light">
              <tr>
                <th>Date</th>
                <th>Invoice No</th>
                <th>Name</th>
                <th>Address</th>
                <th>Receivable</th>
                <th>Paid</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(ps, i) in sr.serviceRecords" :key="i">
                <td>{{ ps.date }}</td>
                <td>{{ ps.invoiceNumber }}</td>
                <td>
                  <router-link :to="'/patients/' + ps.patientId">{{
                    ps.name
                  }}</router-link>
                </td>
                <td>{{ ps.address }}</td>
                <td>{{ ps.receivableAmount }}</td>
                <td>{{ ps.paid }}</td>
                <!--  -->
                <td>
                  <b-button
                    size="sm"
                    variant="info"
                    type="button"
                    @click="viewDetail(ps.invoiceId)"
                    >Detail</b-button
                  >
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <th colspan="4">Total</th>
                <th>{{ sr.totalReceivable }}</th>
                <th>{{ sr.totalPaid }}</th>
                <th></th>
              </tr>
            </tfoot>
          </table>
        </div>
        <Loader :isBusy="isBusy" />
        <div v-if="!isBusy"></div>

        <!-- <b-table :fields="fields" :per-page="perPage" :current-page="currentPage" :items="serviceRecords">
              <template>

            </template>
        </b-table> -->
      </cCardBody>
    </cCard>
  </div>
</template>

<script>
import { ServiceRecordService, CenterService } from "@/services";
export default {
  computed: {
    showRaOfficeList(){
      return (this.$store.getters.center.officeTypeId == 1 || this.$store.getters.center.officeTypeId ==4);
    },
    rows() {
      return this.totalRows;
    },
    isBusy() {
      return this.$store.state.isBusy;
    },
    center() {
      return this.$store.getters.center;
    },
  },
  watch: {
    center(newLen, oldLen) {
      if (newLen.id != undefined) {
        this.fetchOffice();
        this.fetchServiceRecords();
      }
    },
  },
  data() {
    return {
      title: "Service Record",
      fields: [
        "date",
        { key: "invoiceNumber", label: "Invoice No" },
        "name",
        "address",
        { key: "receivableAmount", label: "Receivable" },
        "paid",
      ],
      serviceRecords: [],
      perPage: 20,
      currentPage: 1,
      totalRows: 0,
      totalReceivable: 0,
      totalPaid: 0,
      form: {},
      currentCenter:null,
      raCenters:[],
      hcCenters:[],
      hcOffices:[],
      raOffices:[],
      search:{},
    };
  },
  
  mounted() {
    if (this.$store.getters.center.id != undefined) {
      this.fetchServiceRecords();
      this.fetchOffice();
    }
  },
  methods: {
    handleChangeRaOffice(val){
      this.currentCenter = val;
      this.hcOffices = [];
      this.fetchHcOffice();
    },
    handleChangeHcOffice(val){
      this.currentCenter = val;
      
    },
    fetchRaOffice(){
      (new CenterService()).getRaCenters().then(result=>{
        this.raCenters = result;
        result.map(ra=>{
          this.raOffices.push({value:ra.id,text:ra.name})
        });
      });
    },
    fetchHcOffice(){
      this.$store.commit('start')
      console.log(this.currentCenter);
      const raOffice = (this.raCenters.length>0)?(this.raCenters.filter(r=>r.id == this.currentCenter))[0] :
      this.$store.getters.center;
      console.log(raOffice);
      (new CenterService()).getCentersByThirdLevel(raOffice).then(result=>{
        this.hcCenters = result;
        if(result.length>0){
          result.forEach(hc=>this.hcOffices.push({value:hc.id,text:hc.name}));
        }
        this.$store.commit('finish');
      });
    },
    fetchOffice(){
      if(this.$store.getters.center.officeTypeId==1 || this.$store.getters.center.officeTypeId==4){
        this.fetchRaOffice();
      }else if(this.$store.getters.center.officeTypeId == 5){
        this.fetchHcOffice();
      }  
    },

    formatDate(date, start) {
      const d = new Date(date);
      let month = "" + (d.getMonth() + 1);
      let day = "" + d.getDate();
      const year = d.getFullYear();

      if (month.length < 2) month = "0" + month;
      if (day.length < 2) day = "0" + day;

      const formatedDate = [year, month, day].join("-");
      console.log(formatedDate);
      return formatedDate.toString() + (start ? " 00:00:00" : " 23:59:59");
    },
    fetchServiceRecords() {
      this.$store.commit("start");
      let centerObj=null;

      if(this.hcCenters.length>0){
        centerObj = (this.hcCenters.filter(r=>r.id == this.currentCenter))[0];
      }else if(this.raCenters.length>0){
        centerObj = (this.raCenters.filter(r=>r.id == this.currentCenter))[0];
      }


      const center = (centerObj!=null)? centerObj : this.$store.getters.center;

      const fromDateObj = new Date();
      fromDateObj.setDate(fromDateObj.getDate() - 7);

      const toDate = this.form.to_date
        ? this.form.to_date + " 23:59:59"
        : this.formatDate(new Date());
      const fromDate = this.form.from_date
        ? this.form.from_date + " 00:00:00"
        : this.formatDate(fromDateObj, true);

      new ServiceRecordService()
        .getServiceRecords(
          center.id,
          center.centerCode,
          center.officeTypeId,
          fromDate,
          toDate
        )
        .then((result) => {
          result.forEach((r) => {
            r.totalReceivable = 0;
            r.totalPaid = 0;
            r.serviceRecords.forEach((sr) => {
              r.totalReceivable += parseFloat(sr.receivableAmount);
              r.totalPaid += parseFloat(sr.paid);
            });
          });
          this.serviceRecords = result;
          this.totalRows = this.serviceRecords.length;
          this.$store.commit("finish");
        });
    },
    onSearch() {
      this.fetchServiceRecords();
    },
    viewDetail(id) {
      this.$router.push("/invoice/by-id/" + id);
    },
  },
};
</script>