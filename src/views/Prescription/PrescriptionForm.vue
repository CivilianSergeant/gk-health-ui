<template>
  <div>
    <!-- <ContentBar :PageTitle="title" /> -->
    <b-alert v-model="isSuccess" variant="success">{{ message }}</b-alert>
    <b-alert v-model="isError" variant="danger">{{ message }}</b-alert>
    <!-- <Loader :isBusy="isBusy" /> -->
    <b-form @submit.prevent="onSearch">
      <cCard>
        <cCardBody>
          <div class="row">
            <div class="col-md-3">
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
                  
                  @choose-item="handleInvoiceNumberAutocomplete"
                  :items="invoices"
                  label="invoiceNumber"
                  rowId="id"
                  
                />
              </b-form-group>
            </div>
            <div
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
              <div v-if="invoice">
                <a v-for="(d, i) in invoice.patientServiceDetails" :key="i"
                  >{{ d.service.name }} <span>Status: {{ isPaid(d) }}</span
                  >,
                </a>
              </div>
            </div>
          </div>
          <Loader :isBusy="isBusy"/>
          <div class="row" v-if="!patient">
            <div class="col-md-8">
              <h5>Latest Invoice</h5>
              <ul class="list-group">
                <li class="cursor-pointer list-group-item" @click="handleInvoiceItemClick(invoice.id)" v-for="invoice in invoices" :key="invoice.id">{{invoice.invoiceNumber}} - {{invoice.patientFullName}}[{{invoice.pid}}]</li>
              </ul>
            </div>
          </div>
        </cCardBody>
      </cCard>
      <PatientInfo
        :invoice="invoice"
        :patient="patient"
        :form="form"
      ></PatientInfo>
    </b-form>
    <b-form
      v-if="patient"
      @submit.prevent="onSubmitPrescription"
      @reset.prevent="onResetPrescription"
    >
      <cCard
        ><CCardBody>
          <div class="row">
            <div class="col-md-3">
              <div class="row mt-1">
                <div class="col-md-12">
                  <b-form-group
                    id="input-group-symptoms"
                    label="C/C:"
                    label-for="symptoms"
                    description="Disease symptoms"
                  >
                    <b-textarea
                      id="symptoms"
                      v-model="prescription.symptoms"
                      placeholder="ex. Fever, Cough etc"
                    />
                  </b-form-group>
                </div>
              </div>

              <div class="row mt-1">
                <div class="col-md-9">
                  <b-form-group
                    id="input-group-observation"
                    label="Family History:"
                    description="Family history of patient"
                  >
                    <div class="d-flex flex-row justify-content-between">
                      <b-form-checkbox
                        class="mr-2"
                        v-model="prescription.familyHistory.dm"
                      >
                        DM</b-form-checkbox
                      >
                      <b-form-checkbox
                        class="mr-2"
                        v-model="prescription.familyHistory.htn"
                      >
                        HTN</b-form-checkbox
                      >
                    </div>
                    <div class="d-flex flex-row justify-content-between">
                      <b-form-checkbox
                        class="mr-2"
                        v-model="prescription.familyHistory.asthma"
                      >
                        Br. Asthma</b-form-checkbox
                      >
                      <b-form-checkbox
                        class="mr-2"
                        v-model="prescription.familyHistory.tb"
                      >
                        TB</b-form-checkbox
                      >
                    </div>
                  </b-form-group>
                </div>
              </div>
              <div class="row mt-1">
                <div class="col-md-9">
                  <b-form-group
                    id="input-group-observation"
                    label="Personal History:"
                    description="Personal history of patient"
                  >
                    <div class="d-flex flex-row justify-content-between">
                      <b-form-checkbox
                        v-model="prescription.personalHistory.dm"
                      >
                        DM</b-form-checkbox
                      >
                      <b-form-checkbox
                        v-model="prescription.personalHistory.htn"
                      >
                        HTN</b-form-checkbox
                      >
                      <b-form-checkbox
                        v-model="prescription.personalHistory.tb"
                      >
                        TB</b-form-checkbox
                      >
                    </div>
                    <div class="d-flex flex-row justify-content-between">
                      <b-form-checkbox
                        v-model="prescription.personalHistory.asthma"
                      >
                        Br. Asthma</b-form-checkbox
                      >
                      <b-form-checkbox
                        v-model="prescription.personalHistory.pud"
                      >
                        PUD</b-form-checkbox
                      >
                    </div>
                  </b-form-group>
                </div>
              </div>
              <div class="row mt-1">
                <div class="col-md-12">
                  <b-form-group
                    id="input-group-prev-history"
                    label="Previous History:"
                    description="Previous history of patient"
                  >
                    <b-form-textarea
                      v-model="prescription.personalHistory.previousHistory"
                    ></b-form-textarea>
                  </b-form-group>
                </div>
              </div>
              <div class="row mt-1">
                <div class="col-md-9">
                  <b-form-group
                    id="input-group-observation"
                    label="G/E:"
                    label-for="observation"
                    description="General Examination of patient"
                  >
                    <label>Blood Pressure</label>
                    <b-form-input
                      v-model="prescription.generalExamination.bloodPressure"
                    />
                    <label>Pulse</label>
                    <b-form-input
                      v-model="prescription.generalExamination.pulse"
                    />
                    <label>Tempurature</label>
                    <b-form-input
                      v-model="prescription.generalExamination.tempurature"
                    />
                    <label>Weight</label>
                    <b-form-input
                      v-model="prescription.generalExamination.weight"
                    />
                  </b-form-group>
                </div>
              </div>
              <div class="row mt-1">
                <div class="col-md-9">
                  <b-form-group
                    id="input-group-observation"
                    label="P/A/E:"
                    label-for="pae"
                    description="Per abdominal examination of patient"
                  >
                    <b-textarea
                      id="pae"
                      v-model="prescription.generalExamination.pae"
                    />
                  </b-form-group>
                </div>
              </div>
            </div>
            <div class="col-md-9 border-left">
              <table class="table">
                <thead>
                  <tr class="bg-light text-dark">
                    <th>Medicine</th>
                    <th>Rules</th>
                    <th>Course Duration</th>
                    <th>
                      <a
                        @click="addMedicine"
                        v-if="patient"
                        class="anchorBtn text-info"
                        ><b-icon-plus-circle></b-icon-plus-circle> ADD</a
                      >
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(medicine, m) in recommendedMedicines" :key="m">
                    <td>
                      <Autocomplete
                        @choose-item="handleMedicineAutocomplete"
                        :items="medicines"
                        :rowIndex="m"
                        label="name"
                        rowId="serviceId"
                        :disabled="!patient"
                      />
                    </td>
                    <td>
                      <b-form-select
                        id="r-rule"
                        v-model="medicine.rule"
                        :options="feedingRules"
                      ></b-form-select>
                    </td>
                    <td style="width: 150px">
                      <b-form-input
                        type="number"
                        v-model="medicine.duration"
                      ></b-form-input>
                    </td>
                    <td>
                      <b-form-select
                        id="r-durationUnit"
                        class="courseDuration"
                        v-model="medicine.durationUnit"
                        :options="durationUnits"
                      ></b-form-select>
                      <b-icon-trash-fill
                        @click="deleteMedicine(m)"
                        variant="danger"
                        class="d-inline-block cursor-pointer ml-2"
                      ></b-icon-trash-fill>
                    </td>
                  </tr>
                </tbody>
              </table>
              <!-- Advice and test section -->
              <div class="row py-2 border-top bg-light mx-0">
                <div class="col-md-4">
                  <b-form-group
                    id="input-group-advice"
                    label="Advice:"
                    label-for="advice"
                    description="Advice for patient"
                  >
                    <b-textarea id="advice" v-model="prescription.advice" />
                  </b-form-group>
                </div>
                <div class="col-md-8">
                  <b-form-group
                    id="input-group-patient-id"
                    class="row"
                    label="Tests:"
                    label-for="test-id"
                    content-cols-md="12"
                    description="Select Test (optional)"
                  >
                    <div class="row">
                      <div class="col-md-10">
                        <Autocomplete
                          @choose-item="handleAutocomplete"
                          :items="tests"
                          label="name"
                          rowId="serviceId"
                          :disabled="!patient"
                        />
                      </div>
                      <div class="col-md-2">
                        <a
                          class="ml-2 anchorBtn"
                          pill
                          variant="success"
                          @click="addRequiredTest"
                        >
                          <b-icon-plus-circle
                            scale="1.25"
                            class="t-bold text-info"
                          ></b-icon-plus-circle>
                        </a>
                      </div>
                    </div>
                  </b-form-group>
                  <!-- <div class="col-md-3 mt-4" v-if="service"></div> -->
                  <table class="table">
                    <tr v-for="(rt, r) in recommendedTests" :key="r">
                      <td style="width: 180px">{{ rt.service.name }}</td>
                      <td>
                        <b-form-input
                          placeholder="Write any remark here"
                          class="w-75 d-inline-block"
                          type="text"
                          v-model="rt.remarks"
                        ></b-form-input>
                        <b-icon-trash-fill
                          @click="deleteTest(r)"
                          variant="danger"
                          class="d-inline-block cursor-pointer ml-2"
                        ></b-icon-trash-fill>
                      </td>
                    </tr>
                  </table>
                </div>
              </div>
              <!-- end -->
              <uploder-ui
                accept=".png"
                ref="Fileuploader"
                :disable="!patient"
                allowedFileType="image/png"
                @uploadedfile="handleUploadedFile"
                uploadUrl="http://localhost:8282/api/v1/file-upload/upload"
                allowedFileExt="png"
              ></uploder-ui>
            </div>
          </div>
          <div class="row mb-3 pt-3 border-top">
            <div class="col-md-12 d-flex justify-content-between">
              <div>
                <b-button type="submit" class="ml-2" variant="info"
                  ><CIcon name="cil-check-circle" /> Submit</b-button
                >
                <b-button type="reset" class="ml-2" variant="danger"
                  ><CIcon name="cil-x-circle" /> Cancel</b-button
                >
              </div>
            </div>
          </div>
        </CCardBody></cCard
      >
    </b-form>
  </div>
</template>
<script type="text/javascript" src="./prescriptionController.js"></script>

<style scoped>
.anchorBtn {
  cursor: pointer;
}
.removeAttrBtn {
  color: #ffffff;
}
.removeAttrBtn:hover {
  background-color: rgba(255, 255, 255, 0.35);
}
.font-weight-bold {
  font-weight: 500 !important;
}

.table th {
  border-top: 0px;
}
/* table .form-control{ height:20px;} */
.courseDuration {
  width: 92px;
  display: inline-block;
}
</style>
