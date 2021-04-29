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
        <ReportHeader></ReportHeader>
        <h5 class="text-center mt-3">
          Center: {{ getCenterName }}
          <!-- <a
            @click="printPrescription()"
            class="btn btn-sm btn-primary cursor-pointer"
            ><b-icon-printer></b-icon-printer
          ></a> -->
        </h5>
        <div class="row">
          <div class="col-md-6">
            SL: {{ resultData.id }}<br />
            Date: {{ showCreatedDate(resultData) }}
          </div>
          <!-- <div class="col-md-6"> -->
          <MemberRegStatus
            v-if="resultData.patient"
            :nch="hasCard()"
            :chgb="isGb()"
            :chngb="hasCardNonGB()"
          ></MemberRegStatus>
          <!-- </div> -->
        </div>
        <div class="row py-3">
          <div class="col-md-3 offset-md-4">
            <h6 class="text-center border p-2">
              {{ resultData.service.name }}
            </h6>
          </div>
        </div>
        <div class="row" v-if="resultData.patient">
          <div class="col-md-6">
            Patient's Name: {{ resultData.patient.fullName }}
          </div>
          <div class="col-md-3">Age: {{ resultData.patient.age }}</div>
          <div class="col-md-3">Sex: {{ resultData.patient.gender }}</div>
        </div>
        <div class="row py-2" v-if="resultData.specimen">
          <div class="col-md-6">Specimen: {{ resultData.specimen.name }}</div>
          <!-- <div class="col-md-6">Refd.by: .............</div> -->
        </div>
        <table class="table table-bordered" v-if="service">
          <thead class="thead-light">
            <tr>
              <th width="400">Test</th>
              <th>Result</th>
              <th>Reference Value</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(td, i) in service.labTestAttributes" :key="i">
              <td v-if="td.group" colspan="3">
                <strong>{{ td.attributeName }}</strong>
              </td>
              <td v-if="!td.group">{{ td.attributeName }}</td>
              <td v-if="!td.group">
                <span class="pl-4">{{ showResult(td) }}</span>
              </td>
              <td v-if="!td.group" v-html="showRange(td)"></td>
            </tr>
          </tbody>
        </table>
      </section>
    </vue-html2pdf>
    <b-alert class="my-3" v-model="isSuccess" variant="success">{{
      message
    }}</b-alert>
    <b-alert class="my-3" v-model="isError" variant="danger">{{
      message
    }}</b-alert>
    <cCard>
      <CCardBody>
        <Loader class="mt-5" :isBusy="isBusy" />
        <div v-if="!isBusy && service != null">
          <h5 class="text-center mt-3">
            Center: {{ getCenterName }}
            <a
              @click="printLabReport()"
              class="btn btn-sm btn-primary cursor-pointer"
              ><b-icon-printer></b-icon-printer
            ></a>
          </h5>
          <div class="row">
            <div class="col-md-6">
              SL: {{ resultData.id }}<br />
              Date: {{ showCreatedDate(resultData) }}
            </div>
            <!-- <div class="col-md-6"> -->
            <MemberRegStatus
              v-if="resultData.patient"
              :nch="hasCard()"
              :chgb="isGb()"
              :chngb="hasCardNonGB()"
            ></MemberRegStatus>
            <!-- </div> -->
          </div>
          <div class="row py-3">
            <div class="col-md-3 offset-md-4">
              <h6 class="text-center border p-2">
                {{ resultData.service.name }}
              </h6>
            </div>
          </div>
          <div class="row" v-if="resultData.patient">
            <div class="col-md-6">
              Patient's Name: {{ resultData.patient.fullName }}
            </div>
            <div class="col-md-3">Age: {{ resultData.patient.age }}</div>
            <div class="col-md-3">Sex: {{ resultData.patient.gender }}</div>
          </div>
          <div class="row py-2" v-if="resultData.specimen">
            <div class="col-md-6">Specimen: {{ resultData.specimen.name }}</div>
            <!-- <div class="col-md-6">Refd.by: .............</div> -->
          </div>
          <table class="table table-bordered" v-if="service">
            <thead class="thead-light">
              <tr>
                <th width="400">Test</th>
                <th>Result</th>
                <th>Reference Value</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="(td, i) in service.labTestAttributes" :key="i">
                <td v-if="td.group" colspan="3">
                  <strong>{{ td.attributeName }}</strong>
                </td>
                <td v-if="!td.group">{{ td.attributeName }}</td>
                <td v-if="!td.group">
                  <span class="pl-4">{{ showResult(td) }}</span>
                </td>
                <td v-if="!td.group" v-html="showRange(td)"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </CCardBody>
    </cCard>
  </div>
</template>

<script>
import { LabTestService, HealthService } from "@/services";
import VueHtml2pdf from "vue-html2pdf";
import MemberRegStatus from "@/components/MemberRegStatus.vue";
import ReportHeader from "@/components/global/ReportHeader";
export default {
  data() {
    return {
      title: "Lab Test Report",
      id: 0,
      service: null,
      resultData: {
        service: { name: null },
      },
    };
  },
  computed: {
    getCenterName() {
      return this.$store.getters.center.name;
    },
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
    this.patientId = this.$route.params.patientId;
    this.invoiceId = this.$route.params.invoiceId;
    this.serviceId = this.$route.params.serviceId;
    if (
      this.patientId != undefined &&
      this.invoiceId != undefined &&
      this.serviceId != undefined
    ) {
      this.fetchLabTestByPatientInvoiceService(
        this.patientId,
        this.invoiceId,
        this.serviceId
      );
    } else {
      this.fetchLabTestById(this.id);
    }
  },
  methods: {
    fetchLabTestById(id) {
      this.$store.commit("start");
      new LabTestService().getLabTestById(id).then((result) => {
        this.fetchServiceById(result);
        this.$store.commit("finish");
      });
    },
    fetchLabTestByPatientInvoiceService(patientId, invoiceId, serviceId) {
      this.$store.commit("start");
      new LabTestService()
        .getLabTestByPatientInvoiceService(patientId, invoiceId, serviceId)
        .then((result) => {
          this.fetchServiceById(result);
          this.$store.commit("finish");
        });
    },
    showResult(td) {
      const results = this.resultData.details.filter(
        (m) => m.labTestAttribute.id == td.id
      );
      console.log(results);
      return results[0].result;
    },
    showRange(attr) {
      let range = " ";
      if (attr) {
        if (attr.averageRange) {
          range = attr.averageRange;
        }
        if (attr.maleRange) {
          range += "Male: " + attr.maleRange + "<br/>";
        }
        if (attr.femaleRange) {
          range += "Female: " + attr.femaleRange + "<br/>";
        }
        if (attr.childRange) {
          range += "Child Range: " + attr.childRange + "<br/>";
        }
      }
      return range;
    },
    fetchServiceById(result) {
      if (result == null) {
        this.$store.commit("setErrorMsg", "Report not done yet");
        return;
      }
      this.$store.commit("start");
      new HealthService()
        .findServicesById(result.service.serviceId)
        .then((r) => {
          this.service = r;

          this.resultData = result;
          console.log(this.resultData);

          this.$store.commit("finish");
        });
    },
    showCreatedDate(resultData) {
      return new Date(resultData.createdAt)
        .toLocaleString()
        .substr(0, 10)
        .replace(",", "");
    },
    isGb() {
      const patient = this.resultData.patient;
      if (patient.registration != null) {
        return patient.registration.gb;
      }
      if (patient.cardMember != null) {
        return patient.cardMember.cardRegistration.gb;
      }

      return false;
    },
    hasCard() {
      const patient = this.resultData.patient;

      if (patient.cardMember == null) {
        return false;
      } else if (patient.registration == null) {
        return false;
      } else {
        return true;
      }
    },
    hasCardNonGB() {
      const patient = this.resultData.patient;
      if (patient.registration != null) {
        return !patient.registration.gb;
      }
      if (patient.cardMember != null) {
        return !patient.cardMember.cardRegistration.gb;
      }

      return false;
    },
    printLabReport() {
      this.$refs.html2Pdf.generatePdf();
    },
  },
  components: {
    VueHtml2pdf,
    MemberRegStatus,
    ReportHeader,
  },
};
</script>

