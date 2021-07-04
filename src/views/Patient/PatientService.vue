<template>
  <div class="patientService">
    <!-- <ContentBar :PageTitle="title"/> -->
    <b-alert v-model="isSuccess" variant="success">{{ message }}</b-alert>
    <b-alert v-model="isError" variant="danger">{{ message }}</b-alert>

    <cCard>
      <CCardHeader>
        Patient Service
        <b-button
          @click="gotoPatientCreateView"
          class="ml-2 float-right"
          variant="success"
        >
          <!-- <b-icon-plus-circle
                      scale="1.25"
                      class="t-bold"
                    ></b-icon-plus-circle> -->
          Add Patient
        </b-button>
      </CCardHeader>
      <CCardBody>
        <b-form @submit.prevent="onSearch">
          <div class="row">
            <div class="col-md-2">
              <b-form-group
                id="input-group-keyword"
                label="Search By:"
                label-for="keyword-type"
                description=""
              >
                <b-form-select
                  id="search-keyword"
                  v-model="search.keywordType"
                  @change="handleKeywodChange"
                  :options="keywordTypes"
                ></b-form-select>
              </b-form-group>
            </div>
            <div class="col-md-5">
              <b-form-group
                id="input-group-patient-id"
                label="Patient ID:"
                label-for="patient-id"
                description=""
              >
                <!-- <b-form-input id="relation"
                    placeholder="Patient ID"
                    v-model="pid"
                    required
                    ></b-form-input> -->

                <Autocomplete
                  :ajax="true"
                  @choose-item="handlePatientSelect"
                  :items="patientNumbers"
                  label="label"
                  rowId="id"
                  :disable="false"
                  ref="patientSelect"
                  @ajax-call="handlePatientAutocomplete"
                />
              </b-form-group>
            </div>
            <div class="col-md-1 mt-4 mt-30">
              <!-- <b-button type="submit" variant="info">Search</b-button>  -->
              <b-button @click="onClearSearch" class="ml-1" variant="warning"
                >Clear</b-button
              >
            </div>
            <div class="col-md-2 mt-30"></div>
            <div
              class="col-md-2 mt-30 text-right"
              @click="showCardInfo"
              v-if="patient != null"
            >
              <b-button class="" variant="primary">Card Info</b-button>
            </div>

            <!--card info-->
            <div
              class="col-md-12 font-weight-bold cardInfoPopup"
              v-if="showCardInfoPopup"
            >
              <!--font-weight-bold-->

              <Loader :isBusy="isBusy" />
              <b-card class="mb-0" v-if="patient != null">
                <b-button
                  @click="hideCardInfo"
                  class="btn-sm float-right crossBtn"
                >
                  <b-icon-x-square scale="1.25" class="t-bold">
                  </b-icon-x-square>
                  <!-- <b-icon-plus-circle
                      scale="1.25"
                      class="t-bold"
                    ></b-icon-plus-circle> -->
                </b-button>

                <b-card-title>Patient Info #{{ patient.pid }}</b-card-title>
                <div class="row">
                  <div class="col-md-5"></div>
                </div>

                <div
                  v-if="
                    form.cardRegistration &&
                    form.cardRegistration.members.length > 0
                  "
                >
                  Family Members:
                  <ul class="fMembers">
                    <li
                      class="mb-2"
                      v-for="(member, m) in form.cardRegistration.members"
                      :key="m"
                    >
                      {{ member.fullName }}
                      <button
                        v-if="
                          form.cardRegistration && form.cardRegistration.active
                        "
                        class="btn btn-info btn-sm"
                        type="button"
                        @click="selectPatient(member, m)"
                      >
                        {{
                          member.patient ? "Select Patient" : "Create Patient"
                        }}
                      </button>
                    </li>
                  </ul>
                </div>
                <span
                  v-if="
                    form.cardRegistration &&
                    form.cardRegistration.id > 0 &&
                    !form.cardRegistration.active
                  "
                  class="badge badge-danger"
                  >Registration Expired</span
                >
                <p
                  class="mb-0"
                  v-if="
                    form.cardRegistration &&
                    form.cardRegistration.validityDuration > 0
                  "
                >
                  Registration Valid for ({{
                    form.cardRegistration.validityDuration
                  }}) Months From
                  {{ getDate(form.cardRegistration.startDate) }} -
                  {{ getDate(form.cardRegistration.expiredDate) }}
                </p>
                <p v-if="!hasActiveCard" class="mt-2">
                  <b-button v-b-modal.modal-1 variant="info" size="sm"
                    >Register For Card</b-button
                  >
                </p>
              </b-card>
            </div>
            <!--end card info-->
          </div>
          <!--patient info-->
          <div class="row" v-if="patient != null">
            <div class="col-md-12 table-responsive">
              <table class="table" style="border-bottom: 1px solid #ddd">
                <tr>
                  <th>Patient Name</th>
                  <td>:</td>
                  <th>{{ consumer.fullName }}</th>

                  <th>PID</th>
                  <td>:</td>
                  <th>{{ patient.pid }}</th>

                  <th>Sex</th>
                  <td>:</td>
                  <th>{{ patient.gender }}</th>

                  <th>Age</th>
                  <td>:</td>
                  <th>{{ patient.age }}</th>
                </tr>
                <tr v-if="patient != null">
                  <th>IS GB?</th>
                  <td>:</td>
                  <th><Status :data="isGB()" /></th>

                  <th>Card Registered?</th>
                  <td>:</td>
                  <th>
                    <Status
                      :data="patient.registration && patient.registration.id"
                    />
                  </th>

                  <th>Card Number</th>
                  <td>:</td>
                  <th>
                    <span
                      v-if="form.cardRegistration && form.cardRegistration.id"
                      >Card Number: {{ form.cardRegistration.cardNumber }}</span
                    >
                  </th>

                  <th></th>
                  <td></td>
                  <th></th>
                </tr>
              </table>
            </div>
          </div>
          <div class="row fw-500" v-if="false">
            <div class="col-md-2">Patient Name:</div>
            <div class="col-md-2 text-left px-0 mx-0">
              {{ consumer.fullName }}
            </div>
            <div class="col-md-1 text-right">PID :</div>
            <div class="col-md-2 text-left px-0">{{ patient.pid }}</div>
            <div class="col-md-1 text-right" v-if="patient.gender">Sex:</div>
            <div class="col-md-1 text-left px-0" v-if="patient.gender">
              {{ patient.gender }}
            </div>
            <div class="col-md-1 text-right" v-if="patient.age">Age:</div>
            <div class="col-md-1 text-left px-0" v-if="patient.age">
              {{ patient.age }}
            </div>

            <!-- <div class="col-md-3">

                  </div> -->
          </div>
          <div class="row fw-500" v-if="false">
            <div class="col-md-2 text-right">IS GB?:</div>
            <div class="col-md-2 px-0">
              <Status :data="isGB()" />
            </div>
            <div class="col-md-2">
              Card Registered?:
              <Status :data="patient.registration && patient.registration.id" />
            </div>
            <div class="col-md-3">
              <span v-if="form.cardRegistration && form.cardRegistration.id"
                >Card Number: {{ form.cardRegistration.cardNumber }}</span
              >
            </div>
          </div>
          <!--end patient info-->

          <div class="row">
            <div class="col-md-12">
              <h6 v-if="consumer">
                Service For: {{ consumer.fullName }} [{{ consumer.pid }}]
              </h6>
              <div v-if="showReferredCard()">
                Referred Card Number: {{ showReferredCard() }}
              </div>
              <div v-if="showReferredPatient()">
                Referred Patient: {{ showReferredPatient() }}
              </div>
              <div v-if="showReferredCard()">
                IS GB?: <Status :data="isReferedPatientGb()" />
              </div>
            </div>
          </div>
          <!-- service-->
          <div class="row">
            <div class="col-md-6">
              <b-form-group
                id="input-group-patient-id"
                label="Search Service:"
                label-for="patient-id"
                description="Search Service to add"
              >
                <Autocomplete
                  @choose-item="handleAutocomplete"
                  :items="services"
                  label="name"
                  rowId="serviceId"
                  :disabled="!patient"
                />
              </b-form-group>
            </div>
            <div class="col-md-6 mt-30" v-if="service">
              <b-button
                @click="addPatientService"
                class="ml-2"
                variant="success"
              >
                <!-- <b-icon-plus-circle
                      scale="1.25"
                      class="t-bold"
                    ></b-icon-plus-circle> -->
                Add Service
              </b-button>
            </div>
          </div>
          <!--end service-->
        </b-form>
      </CCardBody></cCard
    >
    <cCard
      ><CCardBody>
        <div class="table-responsive">
          <table class="table table-bordered position-relative">
            <thead class="thead-light">
              <tr>
                <th>Action</th>
                <th>Sl</th>
                <th>Service Name</th>
                <th>Room No</th>
                <th>Amount</th>
                <th>Discount</th>
                <th>Payable</th>
                <!-- <th>Action</th> -->
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="(ps, i) in patientInvoice.patientServiceDetails"
                :key="i"
              >
                <td>
                  <b-icon-trash-fill
                    @click="deleteService(i, ps)"
                    variant="danger"
                    class="d-inline-block cursor-pointer ml-2"
                  ></b-icon-trash-fill>
                </td>
                <td>{{ i + 1 }}</td>
                <td>{{ ps.service.name }}</td>
                <td><input type="text" v-model="ps.roomNumber" /></td>
                <td>{{ ps.serviceAmount }}</td>
                <td>{{ ps.discountAmount }}</td>
                <td>{{ ps.payableAmount }}</td>
                <!-- <td>
                <div class="row">
                <div class="col-md-6"><b-form-file>Upload</b-form-file></div>
                <div class="col-md-6"><b-button>Download</b-button></div>
                </div>
              </td> -->
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="6" class="text-right">Grand Total</td>
                <td>{{ totalPayable }}</td>
                <!-- <td></td> -->
              </tr>
              <tr>
                <td colspan="6" class="text-right">Total Paid</td>
                <td>
                  <b-form-input
                    type="number"
                    @input="changeTotalPaid"
                    v-model="patientInvoice.paidAmount"
                  ></b-form-input>
                </td>
                <!-- <td></td> -->
              </tr>
              <tr>
                <td colspan="6" class="text-right">Due Amount</td>
                <td>
                  <b-form-input
                    type="number"
                    v-model="patientInvoice.dueAmount"
                    readonly="readonly"
                  ></b-form-input>
                </td>
                <!-- <td></td> -->
              </tr>
            </tfoot>
          </table>
        </div>
      </CCardBody></cCard
    >
    <div
      class="row mt-2 mb-2"
      v-if="patientInvoice.patientServiceDetails.length > 0"
    >
      <div class="col-md-2 d-flex justify-content-between">
        <b-button type="button" @click="onSubmit" variant="success"
          >Submit</b-button
        >
        <b-button type="reset" @click="onReset" class="ml-4" variant="danger"
          >Cancel</b-button
        >
      </div>
    </div>

    <b-card v-if="patient">
      <h4>Service History</h4>
      <b-card-body
        style="padding-left: 0.6rem; padding-right: 0.6rem"
        v-for="(pi, i) in consumer.patientInvoices"
        :key="i"
      >
        <h5>
          Invoice No # {{ pi.invoiceNumber }}
          <a
            @click="showReport(i)"
            class="cursor-pointer btn btn-info text-white btn-sm"
            ><b-icon-printer></b-icon-printer> Print</a
          >
        </h5>
        <h6>Date: {{ getDate(pi.createdAt) }}</h6>
        <div class="table-responsive">
          <table class="table table-bordered position-relative">
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
                    :to="showReportButton(ps.service, consumer.id, pi.id)"
                    >{{
                      ps.service.labTest ? "Lab Report" : "Prescription"
                    }}</router-link
                  >
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </b-card-body>
    </b-card>

    <b-modal
      id="modal-1"
      size="lg"
      button-size="sm"
      bvModalEvent.trigger="ok"
      title="Card Register"
    >
      <!-- <div class="col-md-4 d-flex flex-row">
        IS GB?: &nbsp;
        <b-form-checkbox
          id="input-is-gb"
          class="ml-2"
          v-model="form.cardRegistration.gb"
          name="card-registration-gb"
          v-if="form.cardRegistration && !form.cardRegistration.id"
          :value="true"
          :unchecked-value="false"
        ></b-form-checkbox>
      </div> -->

      <div class="col-md-4 mt-2 px-0" v-if="form.cardRegistration">
        <b-form-group
          id="input-group-validity"
          label="Validity :"
          label-for="validity"
          description="Validity"
        >
          <b-form-select
            id="r-validity"
            @change="showDate"
            required
            v-model="form.cardRegistration.validityDuration"
            :options="validityDurations"
          ></b-form-select>
        </b-form-group>
      </div>

      <div class="col-md-12 mt-3 px-0">
        <h6 class="clearfix">
          Members
          <b-button
            @click="addMember"
            class="float-right mb-2"
            size="sm"
            variant="info"
            >Add Member</b-button
          >
        </h6>
      </div>

      <b-card
        class="clearBoth"
        v-for="(member, i) in form.cardRegistration.members"
        :key="i"
      >
        <!-- <b-card-body> -->
        <div class="row">
          <div class="col-md-6 float-left">
            <h6>Member #{{ i + 1 }}</h6>
          </div>
          <div class="col-md-6">
            <b-button
              @click="delMember(i)"
              class="float-right"
              size="sm"
              variant="danger"
              ><b-icon-trash></b-icon-trash
            ></b-button>
          </div>
        </div>
        <div class="col-md-12 px-0">
          <div class="row">
            <div class="col-md-4">
              <b-form-group
                id="input-group-r-fullname"
                label="Full Name:"
                label-for="input-r-fullname"
                description=""
              >
                <b-form-input
                  id="input-r-fullname"
                  v-model="member.fullName"
                  type="text"
                  placeholder="Full Name"
                  required
                ></b-form-input>
              </b-form-group>
            </div>
            <div class="col-md-2">
              <b-form-group
                id="input-group-r-age"
                label="Age:"
                label-for="r-age"
                description=""
              >
                <b-form-input
                  id="r-age"
                  v-model="member.age"
                  placeholder="Age"
                  type="number"
                ></b-form-input>
              </b-form-group>
            </div>
            <div class="col-md-2">
              <b-form-group
                id="input-group-r-gender"
                label="Gender:"
                label-for="gender"
                description=""
              >
                <b-form-select
                  id="r-gender"
                  v-model="member.gender"
                  :options="genderOptions"
                ></b-form-select>
              </b-form-group>
            </div>
            <div class="col-md-2">
              <b-form-group
                id="input-group-r-blood-group"
                label="Blood Group"
                label-for="r-blood-group"
                description=""
              >
                <b-form-select
                  id="r-blood-group"
                  v-model="member.bloodGroup"
                  :options="bloodGroups"
                ></b-form-select>
              </b-form-group>
            </div>

            <div class="col-md-2">
              <b-form-group
                id="input-group-relation"
                label="Relation:"
                label-for="relation"
                description=""
              >
                <b-form-input
                  id="relation"
                  v-model="member.relationWithPatient"
                  placeholder="Relation"
                ></b-form-input>
              </b-form-group>
            </div>
          </div>
        </div>
        <div class="col-md-12 px-0" style="display: none">
          <div class="row">
            <div class="col-md-3">
              <b-form-group
                id="input-group-r-nationality"
                label="Nationality:"
                label-for="nationality"
                description=""
              >
                <b-form-input
                  id="r-nationality"
                  v-model="member.nationality"
                  placeholder="Nationality"
                ></b-form-input>
              </b-form-group>
            </div>
            <div class="col-md-3">
              <b-form-group
                id="input-group-r-nationalId"
                label="National ID:"
                label-for="nationalId"
                description=""
              >
                <b-form-input
                  id="r-nationalId"
                  v-model="member.nationalId"
                  placeholder="National ID"
                ></b-form-input>
              </b-form-group>
            </div>
          </div>
        </div>
        <!-- </b-card-body> -->
      </b-card>
      <template #modal-footer="{ ok, cancel }">
        <!-- Emulate built in modal footer ok and cancel button actions -->
        <b-button size="sm" variant="success" @click="handleOk"> OK </b-button>
        <b-button size="sm" variant="danger" @click="cancel()">
          Cancel
        </b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import { PatientService } from "@/services/PatientService";
import { LocalStorageService } from "@/services/LocalStorageService";
import { HealthService } from "@/services/HealthService";
import { PatientInvoiceService } from "@/services";
import { jsPDF } from "jspdf";

export default {
  name: "Home",

  data() {
    return {
      title: "Patient Service",
      pid: "",
      patient: null,
      consumer: null,
      services: [],
      patientNumbers: [],
      service: null,
      notFound: false,
      registration: null,
      showCardInfoPopup: false,
      patientInvoice: {
        id: null,
        serviceAmount: 0,
        payableAmount: 0,
        discountAmount: 0,
        paidAmount: 0,
        dueAmount: 0,
        patientServiceDetails: [],
      },
      form: {
        cardRegistration: {
          members: [],
          gb: false,
          id: null,
          startDate: "",
          expiredDate: "",
          validityDuration: 0,
        },
      },
      bloodGroups: [
        { value: null, text: "Select" },
        { value: "O(ve)", text: "O(ve)" },
        { value: "O(-ve)", text: "O(-ve)" },
        { value: "A(ve)", text: "A(ve)" },
        { value: "A(-ve)", text: "A(-ve)" },
        { value: "B(ve)", text: "B(ve)" },
        { value: "B(-ve)", text: "B(-ve)" },
        { value: "AB(ve)", text: "AB(ve)" },
        { value: "AB(-ve)", text: "AB(-ve)" },
      ],
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
      validityDurations: [
        { value: 6, text: "6 Months" },
        { value: 12, text: "12 Months" },
      ],
      keywordTypes: [
        { value: null, text: "Select Field" },
        { value: "pid", text: "PID" },
        { value: "name", text: "Name" },
        { value: "mobile", text: "Mobile Number" },
      ],
      search: { keywordType: "pid", keyword: "" },
      autocomplete: {},
      patientIdAutocomplete: {},
      totalPayable: 0,
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
    hasActiveCard() {
      // let status=false;

      return this.patient.registration
        ? this.patient.registration.active
        : false;
      // this.patient.registrations.map(r=>{
      //   if(r.active){
      //     status = true;
      //   }
      // });

      // return status;
    },
  },
  beforeMount() {
    this.fetchServices();
  },
  watch: {
    patientInvoice: {
      handler(patientInvoice) {
        this.totalPayable = 0;

        patientInvoice.patientServiceDetails.map((r) => {
          // if(this.registration.gb){
          //   this.totalPayable+= r.currentGbCost
          // }else{
          //   this.totalPayable+= r.currentCost
          // }

          this.totalPayable += r.payableAmount;
        });
      },
      deep: true,
    },
  },
  created() {
    console.log(this.$route);
    this.pid = this.$route.params.pid;
    if (this.pid != undefined && this.pid != null) {
      this.onSearch();
    }
  },
  mounted() {
    this.$store.commit("clearMessage");
  },
  methods: {
    showReport(i) {
      const invoice = this.patient.patientInvoices[i];
      const pdf = new jsPDF({
        orientation: "portrait",
        format: "A4",
      });

      //   <h5>Grameen Kalyan</h5>
      // Telecom Bhaban, Level 5, 53/1 Box Nagar, Zoo Road, <br />
      // Mirpur – 1, Dhaka-1216, Bangladesh

      let x = 90;
      let y = 30;
      pdf.setFontSize(11);
      pdf.text("Grameen Kalyan", x, y);
      //pdf.line(x, y + 1, 120, y + 1);

      x = 60;
      y = y + 5;
      pdf.text("Telecom Bhaban, Level 5, 53/1 Box Nagar, Zoo Road,", x, y);

      x = 75;
      y = y + 5;
      pdf.text("Mirpur – 1, Dhaka-1216, Bangladesh", x, y);

      x = 90;
      y = y + 20;
      pdf.setFontSize(14);
      pdf.text("Money Receipt", x, y);
      pdf.line(x, y + 1, 125, y + 1);

      x = 15;
      y = y + 20;
      pdf.setFontSize(11);
      pdf.text("Patient Reg.", x, y);
      pdf.text(": " + this.patient.pid, x + 40, y);
      y = y + 5;
      pdf.text("Patient Name", x, y);
      pdf.text(": " + this.patient.fullName, x + 40, y);
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

      pdf.text("Total : ", x + 140, y + 10);
      pdf.text(paidAmount.toString(), x + 158, y + 10);

      pdf.output("dataurlnewwindow");
    },

    showPatientType() {
      //this.consumer.registration.active
      if (this.consumer.registration && this.consumer.registration.active) {
        if (this.consumer.gb) {
          return "CH-GB";
        } else {
          return "CH-NGB";
        }
      } else {
        if (this.consumer.gb) {
          return "NCH-GB";
        } else {
          return "NCH-NGB";
        }
      }
    },

    showReferredCard() {
      if (this.consumer && this.consumer.cardMember) {
        return this.consumer.cardMember.cardRegistration.cardNumber;
      }
    },
    showReferredPatient() {
      if (this.consumer && this.consumer.cardMember) {
        const patient = this.consumer.cardMember.cardRegistration.patient;
        return patient.fullName + " [" + patient.pid + "]";
      }
    },
    onReset() {
      this.patientInvoice.paidAmount = 0;
      this.patientInvoice.patientServiceDetails = [];
    },
    selectPatient(member, i) {
      const formRequest = Object.assign({}, member);

      if (!member.patient) {
        formRequest.center = this.$store.getters.center;
        formRequest.createdBy = this.$store.getters.employee;
        formRequest.cardRegistration = {
          id: this.form.cardRegistration.id,
        };
        formRequest.patient = {
          fullName: member.fullName,
          gender: member.gender,
          age: member.age,
          center: this.$store.getters.center,
          createdBy: this.$store.getters.employee,
        };
        console.log(formRequest);
        new PatientService()
          .addPatientFromCardMember(formRequest)
          .then((_member) => {
            this.consumer = _member.patient;

            this.patient.registration.members[i] = _member;
          });
      } else {
        this.findPatient(member.patient.pid);
        // this.consumer = member.patient;
        console.log(this.consumer);
      }
    },
    handlePatientAutocomplete(searchText) {
      // ajax call
      if (searchText.length >= 1) {
        this.$store.commit("start");

        new PatientService()
          .getPatientIdsByPid(searchText, this.search.keywordType)
          .then((result) => {
            this.patientNumbers = result.collection;
            this.patientNumbers.map((result2) => {
              if (this.search.keywordType == "pid") {
                result2.label = result2.fullName + " (" + result2.pid + ")";
              } else if (this.search.keywordType == "mobile") {
                result2.label =
                  result2.fullName + " (" + result2.mobileNumber + ")";
              } else {
                result2.label = result2.fullName;
              }
              return result2;
            });
            // console.log(result);
            this.$store.commit("finish");
          });
      }
    },
    handlePatientSelect(obj, autocomplete, index, rowIndex) {
      this.pid = obj.pid;
      this.patientIdAutocomplete = autocomplete;
      this.onSearch();
    },
    changeTotalPaid(val) {
      this.patientInvoice.paidAmount = parseFloat(val);
      if (this.patientInvoice.paidAmount < this.patientInvoice.payableAmount) {
        this.patientInvoice.dueAmount =
          this.patientInvoice.payableAmount - this.patientInvoice.paidAmount;
      } else {
        this.patientInvoice.dueAmount = 0;
      }
    },
    showDate() {
      const dateObj = new Date();
      const toDayDateObj = new Date();
      const expiredDate = new Date(
        dateObj.setMonth(
          dateObj.getMonth() + this.form.cardRegistration.validityDuration
        )
      );
      this.form.cardRegistration.startDate = toDayDateObj.toISOString();
      this.form.cardRegistration.expiredDate = expiredDate.toISOString();
    },
    _updateInvoice(patientService) {
      const serviceAmount = patientService.serviceAmount;
      const discountAmount = patientService.discountAmount;
      const payableAmount = patientService.payableAmount;

      this.patientInvoice.serviceAmount += serviceAmount;
      this.patientInvoice.discountAmount += discountAmount;
      this.patientInvoice.payableAmount += payableAmount;
      this.patientInvoice.paidAmount = this.patientInvoice.payableAmount;
    },
    handleOk() {
      this.$store.commit("clearMessage");

      let service = {};
      this.services.map((s) => {
        if (s.code.match("card registration")) {
          service = s;
        }
      });

      if (!this.isServiceAdded(service)) {
        return;
      }

      const serviceAmount = service.currentCost;
      console.log(this.isGB() || this.isReferedPatientGb(), "IS GB");
      const discountAmount =
        this.isGB() || this.isReferedPatientGb()
          ? service.currentCost - service.currentGbCost
          : 0;
      const payableAmount = serviceAmount - discountAmount;

      const patientService = {
        service,
        serviceAmount: serviceAmount,
        discountAmount: discountAmount,
        payableAmount: payableAmount,
      };

      this.patientInvoice.patientServiceDetails.push(patientService);
      this._updateInvoice(patientService);

      this.patient.registration = this.form.cardRegistration;
      // this.patient.registrations.push(this.form.cardRegistration)
      this.$bvModal.hide("modal-1");
    },
    isServiceAdded(service, showMessage) {
      let valid = true;
      this.patientInvoice.patientServiceDetails.map((ps) => {
        if (ps.service.code == service.code) {
          valid = false;
        }
        return ps;
      });

      if (!valid) {
        if (showMessage) {
          this.$store.commit(
            "setErrorMsg",
            "Service [" + service.name + "] already added to the list"
          );
        }

        this.$bvModal.hide("modal-1");
        return valid;
      }
      return valid;
    },
    addMember() {
      this.form.cardRegistration.members.push({
        fullName: "",
        age: "",
        gender: null,
        bloodGroup: null,
        nationality: "",
        nationalId: "",
        relationWithPatient: "",
      });
    },
    delMember(i) {
      this.form.cardRegistration.members.splice(i, 1);
    },
    gotoPatientCreateView() {
      this.$router.push({
        name: "Create Patient",
        params: { referrer: "Patient Service Add" },
      });
      new LocalStorageService().set("referrer", "Patient Service Add");
    },
    getDate(dateStr) {
      return new Date(dateStr).toLocaleDateString();
    },
    addPatientService() {
      this.$store.commit("clearMessage");

      if (!this.isServiceAdded(this.service)) {
        this.$store.commit("setErrorMsg", "Service Already added");
        this.service = null;
        this.autocomplete.setInputValue("");
        return;
      }

      const serviceAmount = this.service.currentCost;
      const discountAmount =
        this.isGB() || this.isReferedPatientGb()
          ? this.service.currentCost - this.service.currentGbCost
          : 0;
      const payableAmount = serviceAmount - discountAmount;
      const patientService = {
        serviceAmount,
        discountAmount,
        payableAmount,
        service: this.service,
        roomNumber: 0,
      };

      this.patientInvoice.patientServiceDetails.push(patientService);
      this._updateInvoice(patientService);

      this.service = null;
      this.autocomplete.setInputValue("");
    },

    handleAutocomplete(service, autocomplete) {
      this.service = service;
      this.autocomplete = autocomplete;
    },
    onClearSearch() {
      this.patient = null;
      this.patientInvoice.patientServiceDetails = [];
      this.registration = null;
      this.service = null;
      this.consumer = null;
      this.patientNumbers = [];
      this.form.cardRegistration = { members: [] };
      // if (this.autocomplete.setInputValue != undefined) {
      //   this.autocomplete.setInputValue("");
      // }
      this.$refs["patientSelect"].setInputValue("");
      this.pid = "";
    },
    handleKeywodChange() {
      this.onClearSearch();
    },
    register() {
      this.registration.patient = { id: this.patient.id };
      new PatientService()
        .cardRegistration(this.registration)
        .then((result) => {
          if (result.status == 200) {
            this.onSearch();
          } else {
            this.$store.commit("setErrorMsg", result.message);
          }
        });
    },
    onSearch() {
      this.patient = null;
      this.registration = null;
      this.patientServiceDetails = [];
      this.$store.commit("clearMessage");
      this.$store.commit("start");
      this.findPatient();
    },
    isGB() {
      return this.consumer.gb;
    },
    isReferedPatientGb() {
      if (this.consumer.cardMember == null) {
        return false;
      }
      if (this.consumer.cardMember.cardRegistration == null) {
        return false;
      }
      return this.consumer.cardMember.cardRegistration.patient.gb;
    },
    findPatient(_pid) {
      const pid = _pid != undefined ? _pid : this.pid;
      new PatientService()
        .getPatientByPid(pid)
        .then((result) => {
          this.$store.commit("finish");
          if (result != null && result.status == 200) {
            this.patient = result.patient;
            this.consumer = this.patient;

            if (this.patient.registration) {
              this.form.cardRegistration = this.patient.registration;
            }

            this.patientInvoice = {
              id: null,
              discountAmount: 0,
              payableAmount: 0,
              paidAmount: 0,
              serviceAmount: 0,
              patientServiceDetails: [],
            }; //this.patient.patientInvoices[this.patient.patientInvoices.length-1];

            this.notFound = false;
          } else {
            this.$store.commit("setErrorMsg", result.message);
            this.notFound = true;
          }
        })
        .catch((error) => {
          this.$store.commit("finish");
          if (error.toString().match("Error: Network Error") != null) {
            this.$store.commit(
              "setErrorMsg",
              "Opps! Network Error, Please try again later"
            );
          } else if (error.toString.length > 0) {
            this.$store.commit("setErrorMsg", error);
          }
        });
    },
    fetchServices() {
      this.$store.commit("start");
      console.log("hererehrerer");
      new HealthService()
        .getServicesList()
        .then((result) => {
          console.log(result);
          this.services = result;
          this.$store.commit("finish");
        })
        .catch((error) => {
          this.$store.commit("finish");
          if (error.toString().match("Error: Network Error") != null) {
            this.$store.commit(
              "setErrorMsg",
              "Opps! Network Error, Please try again later"
            );
          } else if (error.toString.length > 0) {
            this.$store.commit("setErrorMsg", error);
          }
        });
    },

    onSubmit() {
      this.$store.commit("start");
      if (this.consumer.registration) {
        this.consumer.registration.startDate =
          this.consumer.registration.startDate.toString().replace(" ", "T");
        this.consumer.registration.expiredDate =
          this.consumer.registration.expiredDate.toString().replace(" ", "T");
      }
      const form = {
        id: this.consumer.id,
        pid: this.consumer.pid,
        center: this.$store.getters.center,
        createdBy: this.$store.getters.employee,
        patientInvoices: [this.patientInvoice],
        registration: { ...this.consumer.registration },
      };
      form.registration.members = [];

      this.consumer.patientInvoices.unshift(this.patientInvoice);
      this.consumer.center = this.$store.getters.center;
      this.consumer.createdBy = this.$store.getters.employee;
      new PatientInvoiceService()
        .saveInvoice(form)
        .then((result) => {
          if (result.status == 200) {
            this.consumer = result.object;
            this.patientInvoice = {
              id: null,
              discountAmount: 0,
              payableAmount: 0,
              paidAmount: 0,
              serviceAmount: 0,
              patientServiceDetails: [],
            };
            this.$store.commit(
              "setSuccessMsg",
              "Service Purchased Successfully"
            );
          }
          this.$store.commit("finish");
        })
        .catch((error) => {
          this.$store.commit("finish");
          if (error.toString().match("Error: Network Error") != null) {
            this.$store.commit(
              "setErrorMsg",
              "Opps! Network Error, Please try again later"
            );
          } else if (error.toString.length > 0) {
            this.$store.commit("setErrorMsg", error);
          }
        });
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
    showCardInfo() {
      this.showCardInfoPopup = true;
    },
    hideCardInfo() {
      this.showCardInfoPopup = false;
    },
    deleteService(index, ps) {
      this.patientInvoice.paidAmount =
        this.patientInvoice.paidAmount - ps.payableAmount;
      this.patientInvoice.payableAmount =
        this.patientInvoice.payableAmount - ps.payableAmount;
      this.patientInvoice.serviceAmount =
        this.patientInvoice.serviceAmount - ps.serviceAmount;
      this.patientInvoice.patientServiceDetails.splice(index, 1);
    },
  },
};
</script>

<style>
.rounded-pill {
  border-radius: 60rem !important;
}

.patientService .c-main {
  padding-top: 1rem;
}

.patientService .table th,
.patientService .table td {
  padding: 0.3rem;
}

.patientService .card {
  margin-bottom: 0.5rem;
}
/* .patientService .card-body {
  padding: 0.6rem;
} */

ul.fMembers {
  padding: 0px;
  margin-left: 15px;
}
ul.fMembers li {
  /* display: inline-block; */
  margin: 0.3rem 0.53rem 0.3rem 0;
}
.mt-30 {
  margin-top: 30px !important;
}
.fw-500 {
  font-weight: 500;
}
.cardInfoPopup {
  position: absolute;
  right: 0px;
  background: #fff;
  width: 400px;
  z-index: 9;
  top: 84px;
}

.cardInfoPopup .crossBtn {
  background: #fff;
  color: #e55353;
  border: 0px;
}

.cardInfoPopup .card {
  box-shadow: 2px 4px 21px #ccc;
}
</style>

