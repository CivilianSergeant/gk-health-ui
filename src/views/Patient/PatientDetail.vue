<template>
  <div>
    <ContentBar :PageTitle="title" />
    <b-alert v-model="isSuccess" variant="success">{{ message }}</b-alert>
    <b-alert v-model="isError" variant="danger">{{ message }}</b-alert>

    <h5>
      Patient Info #{{ form.pid }}
      <router-link
        to="/patients"
        class="btn btn-primary btn-sm float-right ml-2"
        >Patient List</router-link
      >
      <router-link
        :to="'/patients/' + id + '/edit'"
        class="btn btn-primary btn-sm float-right"
        >Patient Edit</router-link
      >
    </h5>
    <div>
      <b-card>
        <b-card-body>
          <div class="row">
            <div class="col-md-3">
              <b-form-group
                id="input-group-0"
                label="Center:"
                label-for="centers"
              >
                <strong class="text-secondary">{{
                  form.center != null && form.center.name
                    ? form.center.name
                    : "N/A"
                }}</strong>
              </b-form-group>
            </div>
          </div>
          <div class="row">
            <div class="col-md-3">
              <b-form-group
                id="input-group-1"
                label="Full Name:"
                label-for="input-1"
              >
                <strong class="text-secondary">{{
                  form.fullName ? form.fullName : "N/A"
                }}</strong>
              </b-form-group>
            </div>
            <div class="col-md-3">
              <b-form-group
                id="input-group-2"
                label="Guardian Name:"
                label-for="input-2"
              >
                <strong class="text-secondary">{{
                  form.guardianName ? form.guardianName : "N/A"
                }}</strong>
              </b-form-group>
            </div>
            <div class="col-md-3">
              <b-form-group
                id="input-group-3"
                label="Mother Name:"
                label-for="input-3"
              >
                <strong class="text-secondary">{{
                  form.motherName ? form.motherName : "N/A"
                }}</strong>
              </b-form-group>
            </div>
          </div>

          <div class="row">
            <div class="col-md-3">
              <b-form-group
                id="input-group-4"
                label="Gender:"
                label-for="gender"
                description="Patient's Gender"
              >
                <strong class="text-secondary">{{
                  form.gender ? form.gender : "N/A"
                }}</strong>
              </b-form-group>
            </div>
            <div class="col-md-3">
              <b-form-group
                id="input-group-6"
                label="Marital Status:"
                label-for="marital-status"
              >
                <strong class="text-secondary">{{
                  form.maritalStatus ? form.maritalStatus : "N/A"
                }}</strong>
              </b-form-group>
            </div>
            <div class="col-md-4">
              <b-form-group
                id="input-group-6"
                label="Age:"
                label-for="patient-age"
              >
                <strong class="text-secondary">{{
                  form.age ? form.age : "N/A"
                }}</strong>
              </b-form-group>
            </div>
          </div>

          <div class="row">
            <div class="col-md-6">
              <b-form-group
                id="input-group-7"
                label="Village"
                label-for="vilage"
              >
                <strong class="text-secondary">{{
                  form.village ? form.village : "N/A"
                }}</strong>
              </b-form-group>
            </div>
            <div class="col-md-3">
              <b-form-group
                id="input-group-8"
                label="Mobile Number:"
                label-for="mobileNumber"
              >
                <strong class="text-secondary">{{
                  form.mobileNumber ? form.mobileNumber : "N/A"
                }}</strong>
              </b-form-group>
            </div>
          </div>
          <div class="row">
            <div class="col-md-2">
              <b-form-group
                id="input-group-9"
                label="Blood Group"
                label-for="bloodGroup"
              >
                <strong class="text-secondary">{{
                  form.detail ? form.detail.bloodGroup : "N/A"
                }}</strong>
              </b-form-group>
            </div>
            <div class="col-md-3">
              <b-form-group
                id="input-group-10"
                label="Nationality:"
                label-for="nationality"
              >
                <strong class="text-secondary">{{
                  form.detail ? form.detail.nationality : "N/A"
                }}</strong>
              </b-form-group>
            </div>
            <div class="col-md-3">
              <b-form-group
                id="input-group-10"
                label="National ID:"
                label-for="nationalId"
              >
                <strong class="text-secondary">{{
                  form.detail ? form.detail.nationalId : "N/A"
                }}</strong>
              </b-form-group>
            </div>
            <div class="col-md-3">
              <b-form-group
                id="input-group-10"
                label="Occupation:"
                label-for="occupation"
              >
                <strong class="text-secondary">{{
                  form.detail ? form.detail.occupation : "N/A"
                }}</strong>
              </b-form-group>
            </div>
          </div>
        </b-card-body></b-card
      >
      <hr />
      <div class="row">
        <div class="col-md-4">
          <h5>
            Registrations
            <b-button
              class="float-right"
              v-if="
                form.registrations != undefined &&
                form.registrations.length == 0
              "
              >Registration</b-button
            >
          </h5>
          <!-- <p
        v-if="form.registrations != undefined && form.registrations.length == 0"
      >
        This patient did not registered yet
      </p>

      <b-card
        class="col-md-4 px-0 py-0"
        v-for="card in form.registrations"
        :key="card.id"
      >
        <b-card-title>
          <h6>Card No: {{ card.cardNumber }}</h6>
        </b-card-title>
        <b-card-body class="px-0 py-0">
          <p>
            <span v-if="card.active" class="badge badge-success">Active</span>
            <span v-if="!card.active" class="badge badge-danger">Inactive</span>
          </p>
          <p>IS GB: ({{ card.gb ? "Yes" : "No" }})</p>
          <p>Card Members ({{ card.members.length }})</p>
          <p>Start Date: {{ card.startDate }}</p>
          <p>Expire Date: {{ card.expiredDate }}</p>
        </b-card-body>
      </b-card> -->
          <!---->
          <p v-if="form.registration == null">
            This patient did not registered yet
          </p>
          <b-card class="col-md-12 px-0 py-0" v-if="form.registration != null">
            <b-card-title>
              <h6>Card No: {{ form.registration.cardNumber }}</h6>
            </b-card-title>
            <b-card-body class="px-0 py-0">
              <p>
                <span
                  v-if="form.registration.active"
                  class="badge badge-success"
                  >Active</span
                >
                <span
                  v-if="!form.registration.active"
                  class="badge badge-danger"
                  >Inactive</span
                >
              </p>
              <p>IS GB: ({{ form.registration.gb ? "Yes" : "No" }})</p>
              <p>Card Members ({{ form.registration.members.length }})</p>
              <p>Start Date: {{ form.registration.startDate }}</p>
              <p>Expire Date: {{ form.registration.expiredDate }}</p>
            </b-card-body>
          </b-card>
        </div>
        <div class="col-md-8">
          <!-- <br class="mb-3" /> -->
          <h5 style="padding-left: 15px">Patient Invoices</h5>
          <b-card>
            <!-- v-if="patient"-->
            <b-card-body v-for="(pi, i) in form.patientInvoices" :key="i">
              <h5>
                Invoice No # {{ pi.invoiceNumber }}
                <a
                  @click="showReport(i)"
                  class="cursor-pointer btn btn-info btn-sm"
                  ><b-icon-printer></b-icon-printer> Print</a
                >
              </h5>
              <h6>Date: {{ getDate(pi.createdAt) }}</h6>
              <table class="table table-bordered">
                <thead class="thead-light">
                  <tr>
                    <th>Sl</th>
                    <th>Service Name</th>
                    <th>Room No</th>
                    <th>Amount</th>
                    <th>Discount</th>
                    <th>Payable</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="(ps, i) in pi.patientServiceDetails" :key="i">
                    <td>{{ i + 1 }}</td>
                    <td>{{ ps.service.name }}</td>
                    <td>{{ ps.roomNumber }}</td>
                    <td>{{ ps.serviceAmount }}</td>
                    <td>{{ ps.discountAmount }}</td>
                    <td>{{ ps.payableAmount }}</td>
                    <td>
                      <router-link
                        v-if="hasReportButton(ps)"
                        :to="showReportButton(ps.service, form.id, pi.id)"
                        >{{
                          ps.service.labTest ? "Lab Report" : "Prescription"
                        }}</router-link
                      >
                    </td>
                  </tr>
                </tbody>
              </table>
            </b-card-body>
          </b-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { CenterService } from "@/services/CenterService";
import { jsPDF } from "jspdf";
import { PatientService } from "@/services";

export default {
  name: "PatientDetail",

  data() {
    return {
      cardRegistrationAccepted: false,
      title: "Patients",
      isBusy: false,
      centers: [],
      id: this.$route.params.id,
      genderOptions: [
        { value: null, text: "Please Select Gender" },
        { value: "Male", text: "Male" },
        { value: "Female", text: "Female" },
      ],
      maritalStatusOptions: [
        { value: null, text: "Please Select Marital Status" },
        { value: "Single", text: "Single" },
        { value: "Married", text: "Married" },
        { value: "Divorced", text: "Married" },
        { value: "Widow", text: "Widow" },
      ],
      form: {
        center: { id: null },
        apiVillageId: null,
        fullName: "",
        dateOfBirth: "",
        guardianName: "",
        motherName: "",
        gender: null,
        maritalStatus: null,
        village: "",
        mobileNumber: "",
        detail: {
          bloodGroup: null,
          nationality: null,
          nationalId: null,
          occupation: null,
        },
        cardRegistration: {
          active: true,
          gb: false,
          members: [],
        },
        createdBy: {
          id: 1,
          apiEmployeeId: 124,
        },
      },
    };
  },

  computed: {
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
  beforeMount() {
    this.$store.commit("clearMessage");
    this.fetchCenters();
    this.fetchPatient(this.$route.params.id);
  },
  methods: {
    // async onSubmit() {
    //   const formRequest = Object.assign({}, this.form);
    //   console.log(this.form);

    //   if (
    //     (this.form.detail.bloodGroup == null ||
    //       this.form.detail.bloodGroup == "") &&
    //     (this.form.detail.nationality == null ||
    //       this.form.detail.nationality == "") &&
    //     (this.form.detail.nationalId == null ||
    //       this.form.detail.nationalId == "") &&
    //     (this.form.detail.occupation == null ||
    //       this.form.detail.occupation == "")
    //   ) {
    //     console.log(this.form.detail.bloodGroup, 2);
    //     formRequest.detail = null;
    //   }
    //   if (!this.cardRegistrationAccepted) {
    //     formRequest.cardRegistration = null;
    //   }
    //   console.log(formRequest);
    //   // formRequest.dateOfBirth = formRequest.dateOfBirth+' 00:00:00';
    //   // axios.defaults.headers.common = {
    //   //   "Access-Control-Allow-Origin": ApiRoutes.DOMAIN,
    //   //   "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
    //   // };
    //   const response = await axios.post(
    //     GetApiRoute(ApiRoutes.ADD_PATIENT),
    //     formRequest
    //   );
    //   console.log(response);
    //   if (response.status == 200) {
    //     this.$store.commit("setSuccessMsg", "New Patient profile Created");
    //     this.$router.push("/patients");
    //   } else {
    //     console.log(response);
    //   }
    // },
    // onReset() {
    //   this.$router.push("/patients");
    //   console.log("");
    // },
    // addMember() {
    //   this.form.cardRegistration.members.push({
    //     fullName: "",
    //     age: "",
    //     gender: "",
    //     bloodGroup: "",
    //     nationality: "",
    //     nationalId: "",
    //     relationWithPatient: "",
    //   });
    // },
    // delMember(i) {
    //   this.form.cardRegistration.members.splice(i, 1);
    // },
    fetchPatient(id) {
      new PatientService().getPatientById(id, (data) => {
        this.form = data;
      });
      // const response = await axios.get(
      //   GetApiRoute(ApiRoutes.GET_PATIENT_BY_ID, id)
      // );
      // if (response.status == 200) {

      // }
      // console.log(response);
    },
    fetchCenters() {
      this.isBusy = true;
      new CenterService().getCenters().then((result) => {
        this.centers.push({ value: null, text: "Select Center" });
        result.map((center) =>
          this.centers.push({ value: center.id, text: center.name })
        );
        this.isBusy = false;
      });
    },
    showReport(i) {
      const invoice = this.form.patientInvoices[i];
      const pdf = new jsPDF({
        orientation: "portrait",
        format: "A4",
      });
      let x = 80;
      let y = 30;
      pdf.text("Money Receipt", x, y);
      pdf.line(x, y + 1, 120, y + 1);

      x = 15;
      y = y + 20;
      pdf.setFontSize(11);
      pdf.text("Patient Reg.", x, y);
      pdf.text(": " + this.form.id, x + 40, y);
      y = y + 5;
      pdf.text("Patient Name", x, y);
      pdf.text(": " + this.form.fullName, x + 40, y);
      y = y + 5;
      pdf.text("Patient Type", x + 100, y - 10);
      pdf.text(": " + this.showPatientType(), x + 140, y - 10);
      pdf.text("Date", x + 100, y - 5);

      pdf.text(": " + new Date().toLocaleString(), x + 140, y - 5);
      y = y + 5;
      const headers = ["Sl# ", "Particulars", "Rate ", "Amount"];
      let paidAmount = 0;
      const invoiceItems = [];
      let index = 1;
      pdf.cell(x, y, 20, 10, "SL#", index, "center");
      pdf.cell(x, y, 110, 10, "Particulars", index, "center");
      pdf.cell(x, y, 25, 10, "Rate", index, "center");
      pdf.cell(x, y, 25, 10, "Amount", index, "right");
      y = y + 5;

      invoice.patientServiceDetails.forEach((ps, i) => {
        console.log(i);
        index++;
        pdf.cell(x, y, 20, 10, (i + 1).toString(), index, "center");
        pdf.cell(x, y, 110, 10, ps.service.name.toString(), index, "center");
        pdf.cell(x, y, 25, 10, ps.payableAmount.toString(), index, "right");
        pdf.cell(x, y, 25, 10, ps.payableAmount.toString(), index, "right");
        y = y + 10;
        paidAmount += ps.payableAmount;
      });

      pdf.text("Total : ", x + 140, y + 20);
      pdf.text(paidAmount.toString(), x + 170, y + 20);

      pdf.output("dataurlnewwindow");
    },
    getDate(dateStr) {
      return new Date(dateStr).toLocaleDateString();
    },
    hasReportButton(patientServiceDetail) {
      if (
        patientServiceDetail.reportGenerated &&
        (patientServiceDetail.service.labTest == true ||
          patientServiceDetail.service.prescription == true)
      ) {
        return true;
      }

      return false;
    },
    showReportButton(service, patientId, invoiceId) {
      if (service.labTest == true) {
        return `/lab-tests/${patientId}/${invoiceId}/${service.serviceId}`;
      }
      if (service.prescription == true) {
        return `/prescriptions/${patientId}/${invoiceId}`;
      }
      return null;
    },
    showPatientType() {
      if (this.form.registration) {
        if (this.form.registration.gb) {
          return "CH-GB";
        }
        return "CH-NGB";
      }
      return "NCH";
    },
  },
};
</script>

<style scoped>
.clearBoth {
  clear: both;
}
</style>
