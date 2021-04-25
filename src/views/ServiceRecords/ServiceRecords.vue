<template>
  <div>
    <!-- <ContentBar :PageTitle="title"/> -->
    <!-- <h5 class="py-3"></h5> -->
    <cCard>
      <cCardBody>
        <b-form @submit.prevent="onSearch">
          <div class="row py-2 mr-3 d-flex justify-content-end">
            <div class="mr-2">
              <b-form-datepicker
                id="datepicker-placeholder"
                placeholder="from date"
                locale="en"
                v-model="form.from_date"
              ></b-form-datepicker>
            </div>
            <div>
              <b-form-datepicker
                id="datepicker-placeholder2"
                placeholder="To date"
                locale="en"
                v-model="form.to_date"
              ></b-form-datepicker>
            </div>
            <div>
              <b-button type="submit" class="ml-2" variant="info"
                >Search</b-button
              >
            </div>
          </div>
        </b-form>
      </cCardBody>
    </cCard>
    <cCard>
      <cCardHeader> Service Records </cCardHeader>
      <cCardBody>
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
                <td><b-button type="button">Detail</b-button></td>
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
import { ServiceRecordService } from "@/services";
export default {
  computed: {
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
    };
  },
  mounted() {
    if (this.$store.getters.center.id != undefined) {
      this.fetchServiceRecords();
    }
  },
  methods: {
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
      const center = this.$store.getters.center;

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
  },
};
</script>