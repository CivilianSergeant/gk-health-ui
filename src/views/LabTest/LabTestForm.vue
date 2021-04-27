<template>
  <div>
    <!-- <ContentBar :PageTitle="title" /> -->
    <b-alert v-model="isSuccess" variant="success">{{ message }}</b-alert>
    <b-alert v-model="isError" variant="danger">{{ message }}</b-alert>
    <Loader :isBusy="isBusy" />
    <b-form @submit.prevent="onSearch">
      <cCard
        ><CCardBody>
          <div class="row">
            <div class="col-md-3" v-if="form.id == null">
              <b-form-group
                id="input-group-patient-id"
                label="Invoice ID:"
                label-for="invoice-id"
                description="Search By Invoice ID"
              >
                <!-- <b-form-input id="relation"
                            placeholder="Invoice ID"
                            v-model="pid"
                        ></b-form-input>-->

                <Autocomplete
                  :ajax="true"
                  @choose-item="handleInvoiceNumberAutocomplete"
                  :items="invoices"
                  label="invoiceNumber"
                  rowId="id"
                  @ajax-call="handleInvoiceNumberAjaxCall"
                />
              </b-form-group>
            </div>
            <div
              v-if="form.id == null"
              class="col-md-3 mt-4 px-0"
              style="margin-top: 1.8rem !important"
            >
              <!-- <b-button type="submit" variant="info">Search</b-button>  -->
              <b-button @click="onClearSearch" class="ml-1" variant="warning"
                >Clear</b-button
              >
            </div>
            <div class="col-md-6">
              <div v-if="invoice != null">
                Invoice Number: {{ invoice.invoiceNumber }}
              </div>
              <span v-if="invoice != null">Status: {{ isPaid() }}</span>
              <div v-if="invoice">
                <div v-for="(d, i) in invoice.patientServiceDetails" :key="i">
                  <a
                    class="cursor-pointer"
                    @click="setService(i)"
                    v-if="d.service.labTest == true && !d.reportGenerated"
                    >{{ d.service.name }}
                  </a>
                  <span v-if="d.service.labTest == false">{{
                    d.service.name
                  }}</span>
                  <span v-if="d.service.labTest == true && d.reportGenerated"
                    >{{ d.service.name }} (Generated)</span
                  >
                  <span v-if="d.selected">Selected</span>
                </div>
              </div>
              <div v-if="form.service">
                <span>{{ form.service.name }}</span>
              </div>
            </div>
          </div>
        </CCardBody>
      </cCard>
      <PatientInfo
        :invoice="invoice"
        :patient="patient"
        :form="form"
      ></PatientInfo>
    </b-form>
    <cCard>
      <CCardBody>
        <b-form @submit.prevent="onSubmit" @reset.prevent="onReset">
          <div class="row">
            <div class="col-md-2">
              <b-form-group
                v-if="specimens && service"
                label="Specimen"
                description="Select Lab Test Specimen"
              >
                <b-form-select
                  required
                  :options="specimens"
                  v-model="form.specimen.id"
                ></b-form-select>
              </b-form-group>
            </div>
            <div class="col-md-3 offset-md-5">
              <b-form-group v-if="service" label="Delivery date" description="">
                <b-form-datepicker
                  id="datepicker-placeholder"
                  placeholder="Delivery date"
                  locale="en"
                  v-model="form.deliveryDate"
                ></b-form-datepicker>
              </b-form-group>
            </div>
            <div class="col-md-2">
              <b-form-group
                id="input-group-1"
                v-if="service"
                label="Status:"
                label-for="input-1"
                description=""
              >
                <b-form-select
                  v-model="form.status"
                  :options="labTestStatus"
                ></b-form-select>
              </b-form-group>
            </div>
          </div>
          <table class="table" v-if="service">
            <thead>
              <tr>
                <th>Attribute List</th>
                <th colspan="6"></th>
              </tr>
              <tr>
                <th>Name</th>
                <th>Result</th>
                <th>Range</th>
                <th>Unit</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(attr, i) in service.labTestAttributes" :key="i">
                <td class="p-0" colspan="6" v-if="attr.group">
                  <span> {{ attr.attributeName }} </span>
                </td>

                <td v-if="!attr.group" class="p-0">
                  <span> {{ attr.attributeName }}</span>
                </td>
                <td v-if="!attr.group" class="p-2">
                  <input
                    v-model="attr.result"
                    type="text"
                    style="width: 100%"
                  />
                </td>
                <td
                  v-if="!attr.group"
                  class="p-2"
                  v-html="showRange(attr)"
                ></td>

                <td v-if="!attr.group" class="p-0">{{ showUnit(attr) }}</td>
              </tr>
            </tbody>
          </table>
          <div v-if="service" class="col-md-12 d-flex justify-content-between">
            <div>
              <b-button type="submit" class="ml-2" variant="info"
                ><CIcon name="cil-check-circle" /> Submit</b-button
              >
              <b-button type="reset" class="ml-2" variant="danger"
                ><CIcon name="cil-x-circle" /> Cancel</b-button
              >
            </div>
          </div>
        </b-form>
      </CCardBody>
    </cCard>
  </div>
</template>

<script>
import {
  PatientInvoiceService,
  NavigationService,
  HealthService,
  SpecimenService,
  LabTestService,
} from "@/services";
import PatientInfo from "@/components/patientInfo/PatientInfo.vue";
export default {
  components: {
    PatientInfo,
  },
  data() {
    return {
      title: "Create Lab Test Report",
      invoices: [],
      invoice: null,
      service: { labTestAttributes: [] },
      invoiceAutocomplete: null,
      patient: null,
      specimens: [],
      form: {
        id: null,
        service: { serviceId: null },
        patient: { id: null },
        patientInvoice: { id: null },
        specimen: { id: 21 },
        labTestGroup: { id: null },
        details: [],
        status: "processing",
        testDate: new Date(),
      },
      labTestStatus: [
        { value: null, text: "select status" },
        { value: "pending", text: "Pending" },
        { value: "processing", text: "Processing" },
        { value: "complete", text: "Complete" },
      ],
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
    if (this.id != undefined) {
      this.fetchLabTestById(this.id);
    }
    this.fetchLabTestUnits();
    this.fetchSpecimens();
  },
  methods: {
    showUnit(attr) {
      if (attr.labTestUnit) {
        const unit = this.units.filter((u) => u.id == attr.labTestUnit.id);
        return unit[0].name;
      }
    },
    showRange(attr) {
      let range = " ";
      if (attr) {
        if (attr.averageRange) {
          range = attr.averageRange + "<br/>";
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
    fetchSpecimens() {
      new SpecimenService().getSpecimens().then((result) => {
        this.specimens.push({ value: null, text: "Select Specimen" });
        result.map((r) => {
          this.specimens.push({
            value: r.id,
            text: r.name,
          });
        });
      });
    },
    fetchLabTestUnits() {
      this.$store.commit("start");
      new HealthService().getServiceUnits().then((result) => {
        this.units = result;
        this.$store.commit("finish");
      });
    },
    setService(i) {
      this.invoice.patientServiceDetails.map((s) => (s.selected = false));
      const patientService = this.invoice.patientServiceDetails[i];
      patientService.selected = true;
      this.fetchServiceById(patientService.service.serviceId);
      this.$forceUpdate();
    },
    isPaid() {
      return this.invoice.paidAmount < this.invoice.payableAmount
        ? "NOT PAID"
        : "PAID";
    },
    handleInvoiceNumberAutocomplete(invoice, autocomplete) {
      new PatientInvoiceService().getInvoiceById(invoice.id).then((result) => {
        this.invoice = result;
        this.patient = this.invoice.patient;

        this.invoiceAutocomplete = autocomplete;
      });
    },
    handleInvoiceNumberAjaxCall(searchText) {
      if (searchText.length >= 2) {
        new PatientInvoiceService()
          .getInvoiceNumbers(searchText)
          .then((result) => {
            this.invoices = result.collection;
          });
      }
    },
    fetchServiceById(id, attResult) {
      this.$store.commit("start");
      new HealthService().findServicesById(id).then((result) => {
        // for update
        if (attResult != undefined) {
          result.labTestAttributes.map((a) => {
            attResult.map((b) => {
              if (b.labTestAttribute.id == a.id) {
                a.result = b.result;
              }
            });
          });
        }
        //
        this.service = result;
        this.$store.commit("finish");
      });
    },
    onClearSearch() {
      this.patient = null;
      this.invoice = null;
      this.service = null;

      this.$store.commit("clearMessage");

      if (this.invoiceAutocomplete != undefined) {
        this.invoiceAutocomplete.setInputValue("");
      }
    },
    onSubmit() {
      const updateDetails = [];
      this.$store.commit("start");
      this.service.labTestAttributes.map((a) => {
        if (!a.group) {
          if (this.form.id > 0) {
            this.form.details.map((m) => {
              if (m.labTestAttribute.id == a.id) {
                updateDetails.push({
                  id: m.id,
                  labTestAttribute: { id: m.labTestAttribute.id },
                  result: a.result,
                });
              }
            });
          } else {
            console.log("there");
            this.form.details.push({
              labTestAttribute: { id: a.id },
              result: a.result,
            });
          }
        }
      });
      if (this.form.id > 0) {
        this.form.details = updateDetails;
      }
      this.form.service = { serviceId: this.service.serviceId };
      this.form.patient = { id: this.patient.id };
      this.form.patientInvoice = { id: this.invoice.id };
      this.form.labTestGroup = { id: this.service.labTestGroup.id };

      console.log(this.form.details);

      new LabTestService().saveLabTest(this.form).then((result) => {
        if (this.form.id != null) {
          this.$store.commit("setSuccessMsg", "Lab Report Updated Sucessfully");
          const navigationService = new NavigationService();
          navigationService.redirect(this, "lab-tests");
        } else {
          if (result.id != undefined && result.id > 0) {
            this.$store.commit(
              "setSuccessMsg",
              "Lab Report Created Sucessfully"
            );
            const navigationService = new NavigationService();
            navigationService.redirect(this, "lab-tests");
          }
        }
        this.$store.commit("finish");
      });
    },
    onReset() {
      this.service = null;
      this.patient = null;
      this.invoice = null;
      this.form = {
        id: null,
        patient: { id: null },
        patientInvoice: { id: null },
        speciman: { id: null },
        labTestGroup: { id: null },
        details: [],
        testDate: new Date(),
      };

      if (this.invoiceAutocomplete != undefined) {
        this.invoiceAutocomplete.setInputValue("");
      }
    },
    fetchLabTestById(id) {
      new LabTestService().getLabTestById(id).then((resultSet) => {
        this.form = resultSet;
        this.invoice = resultSet.patientInvoice;
        this.patient = resultSet.patient;
        this.form.service = resultSet.service;
        this.form.specimen = resultSet.specimen;
        this.fetchServiceById(resultSet.service.serviceId, resultSet.details);
      });
    },
  },
};
</script>