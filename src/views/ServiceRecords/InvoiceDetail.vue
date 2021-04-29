<template>
  <div>
    <vue-html2pdf
      :show-layout="false"
      :float-layout="true"
      :enable-download="false"
      :preview-modal="true"
      :paginate-elements-by-height="1400"
      :pdf-quality="2"
      :manual-pagination="false"
      pdf-format="a4"
      pdf-orientation="portrait"
      pdf-content-width="780px"
      ref="html2Pdf"
    >
      <section class="container" slot="pdf-content">
        <div class="my-5 text-center">
          <ReportHeader></ReportHeader>
          <!-- <h5>Grameen Kalyan</h5>
          Telecom Bhaban, Level 5, 53/1 Box Nagar, Zoo Road, <br />
          Mirpur – 1, Dhaka-1216, Bangladesh -->
          <h6 class="my-3">Invoice Details Report</h6>
          <h5 class="d-inline mr-3">
            Invoice Number: {{ resultData.invoiceNumber }}
          </h5>
        </div>
        <div class="row">
          <div class="col-md-6">
            <strong v-if="resultData.patient"> Patient Name:</strong> {{ resultData.patient.fullName }}
            {{ "(" + resultData.patient.pid + ")" }}
          </div>
          <div class="col-md-3">
            <strong>Age:</strong> {{ resultData.patient.age }}
          </div>
          <div class="col-md-3">
            <strong>Gender:</strong> {{ resultData.patient.gender }}
          </div>
        </div>
        <div class="row">
          <div class="col-md-4">
            <strong>Mobile No:</strong> {{ resultData.mobileNumber }}
          </div>
        </div>

        <h5 class="pt-4 pb-1">Services</h5>
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>SL</th>
              <th>Service Name</th>
              <th>Report Generated</th>
              <th>Date</th>
              <th>Service Amount</th>
              <th>Discount</th>
              <th>Payable Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(sd, i) in resultData.patientServiceDetails" :key="i">
              <td>{{ i }}</td>
              <td>{{ sd.service.name }}</td>
              <td>{{ sd.reportGenerated ? "Yes" : "No" }}</td>
              <td>{{ showCreatedDate(sd.createdAt) }}</td>
              <td>{{ sd.serviceAmount }}</td>
              <td>{{ sd.discountAmount }}</td>
              <td>{{ sd.payableAmount }}</td>
            </tr>

            <tr>
              <td colspan="6"><strong>Total</strong></td>

              <td>{{ resultData.payableAmount }}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </vue-html2pdf>
    <cCard>
      <div class="my-5 text-center">
        <h5 class="d-inline mr-3">
          Invoice Number: {{ resultData.invoiceNumber }}
        </h5>
        <a
          @click="printLabReport()"
          class="btn btn-sm btn-primary cursor-pointer text-white"
          ><b-icon-printer></b-icon-printer
        ></a>
      </div>

      <CCardBody>
        <div class="row">
          <div class="col-md-6">
            <strong> Patient Name:</strong> {{ resultData.patient.fullName }}
            {{ "(" + resultData.patient.pid + ")" }}
          </div>
          <div class="col-md-3">
            <strong>Age:</strong> {{ resultData.patient.age }}
          </div>
          <div class="col-md-3">
            <strong>Gender:</strong> {{ resultData.patient.gender }}
          </div>
        </div>
        <div class="row">
          <div class="col-md-4">
            <strong>Mobile No:</strong> {{ resultData.mobileNumber }}
          </div>
        </div>

        <h5 class="pt-4 pb-1">Services</h5>
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>SL</th>
              <th>Service Name</th>
              <th>Report Generated</th>
              <th>Date</th>
              <th>Service Amount</th>
              <th>Discount</th>
              <th>Payable Amountt</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(sd, i) in resultData.patientServiceDetails" :key="i">
              <td>{{ i + 1 }}</td>
              <td>{{ sd.service.name }}</td>
              <td>{{ sd.reportGenerated ? "Yes" : "No" }}</td>
              <td>{{ showCreatedDate(sd.createdAt) }}</td>
              <td>{{ sd.serviceAmount }}</td>
              <td>{{ sd.discountAmount }}</td>
              <td>{{ sd.payableAmount }}</td>
            </tr>

            <tr>
              <td colspan="6"><strong>Total</strong></td>

              <td>{{ resultData.payableAmount }}</td>
            </tr>
          </tbody>
        </table>
      </CCardBody>
    </cCard>
  </div>
</template>

<script>
import { ServiceRecordService } from "@/services";
import VueHtml2pdf from "vue-html2pdf";
import ReportHeader from "@/components/global/ReportHeader";

export default {
  data() {
    return {
      title: "Invoice Details",
      id: 0,
      service: null,
      resultData: {
        patient:{},
        service: { name: null },
        id: null,
      },
    };
  },
  computed: {
    isBusy() {
      return this.$store.state.isBusy;
    },
    isError() {
      return this.$store.state.isError;
    },
    isSuccess() {
      return this.$store.state.isSuccess;
    },
    message() {
      return this.$store.state.message;
    },
  },
  mounted() {
    this.id = this.$route.params.id;

    this.fetchInvoicById(this.id);
  },
  methods: {
    fetchInvoicById(id) {
      new ServiceRecordService().getInvoiceById(id).then((result) => {
        this.resultData = result;
        console.log("Result-" + this.resultData.id);
        this.$store.commit("finish");
      });
    },
    showCreatedDate(date) {
      return new Date(date).toLocaleString().substr(0, 10).replace(",", "");
    },

    printLabReport() {
      this.$refs.html2Pdf.generatePdf();
    },
  },
  components: {
    VueHtml2pdf,
    ReportHeader,
  },
};
</script>