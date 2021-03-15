<template>
  <div>
    <ContentBar :PageTitle="title"/>
    <b-alert v-model="isSuccess" variant="success">{{message}}</b-alert>
    <b-alert v-model="isError" variant="danger">{{message}}</b-alert>
    <b-form @submit.prevent="onSearch">
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
              :ajax="true"
              @choose-item="handleInvoiceNumberAutocomplete"
              :items="invoices"
              label="invoiceNumber"
              rowId="id"
              @ajax-call="handleInvoiceNumberAjaxCall"
            />
          </b-form-group>
        </div>
        <div class="col-md-3 mt-4">
          <!-- <b-button type="submit" variant="info">Search</b-button>  -->
          <b-button @click="onClearSearch" class="ml-1" variant="warning">Clear</b-button>
        </div>
        <div class="col-md-12 text-secondary font-weight-bold">
          <Loader :isBusy="isBusy"/>
          <b-card v-if="patient!=null">
            <div class="row">
              <div class="col-md-6">
                <b-card-title>Patient Info #{{patient.pid}}</b-card-title>
                <div v-if="patient.id>0">
                  <span>Patient Name: {{patient.fullName}}</span>
                  <span v-if="patient.gender">, Sex: {{patient.gender}}</span>
                  <span v-if="patient.age">, Age: {{patient.age}}</span>
                </div>
                <div>
                  IS GB?:
                  <Status :data="patient.registration.gb"/>
                </div>
                <div>
                  Card Registered?:
                  <Status :data="patient.registration && patient.registration.id"/>
                </div>
                <span
                  v-if="patient.registration && patient.registration.id"
                >Card Number: {{patient.registration.cardNumber}}</span>
                <div v-if="patient.registration && patient.registration.members.length>0">
                  Family Members
                  <ul>
                    <li
                      v-for="(member,m) in form.cardRegistration.members"
                      :key="m"
                    >{{member.fullName}}</li>
                  </ul>
                </div>
                <p v-if="patient.registration && patient.registration.validityDuration>0">
                  Registration Valid for ({{patient.registration.validityDuration}}) Months From {{getDate(patient.registration.startDate)}}
                  - {{getDate(patient.registration.expiredDate)}}
                </p>
              </div>
              <div class="col-md-6">
                <h5 class="mt-1">Invoice Detail</h5>
                <p>Invoice No: {{invoice.invoiceNumber}}</p>
                <ul class="nav">
                  <li v-for="d in invoice.patientServiceDetails" :key="d.id">
                    <p>{{d.service.name}} - {{d.payableAmount}} BDT</p>
                  </li>
                </ul>
              </div>
            </div>
          </b-card>
        </div>
      </div>
    </b-form>
    <b-form @submit.prevent="onSubmitPrescription" @reset.prevent="onResetPrescription">
    <div class="row">
      <div class="col-md-5">
        <div class="row mt-1">
          <div class="col-md-12">
            <b-form-group
              id="input-group-symptoms"
              label="C/C:"
              label-for="symptoms"
              description="Disease symptoms"
            >
              <b-textarea id="symptoms" v-model="prescription.symptoms" placeholder="ex. Fever, Cough etc"/>
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
              <b-form-checkbox v-model="prescription.familyHistory.dm"> DM</b-form-checkbox>
              <b-form-checkbox v-model="prescription.familyHistory.htn"> HTN</b-form-checkbox>
              <b-form-checkbox v-model="prescription.familyHistory.asthma"> Br. Asthma</b-form-checkbox>
              <b-form-checkbox v-model="prescription.familyHistory.tb"> TB</b-form-checkbox>
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
              <b-form-checkbox v-model="prescription.personalHistory.dm"> DM</b-form-checkbox>
              <b-form-checkbox v-model="prescription.personalHistory.htn"> HTN</b-form-checkbox>
              <b-form-checkbox v-model="prescription.personalHistory.asthma"> Br. Asthma</b-form-checkbox>
              <b-form-checkbox v-model="prescription.personalHistory.tb"> TB</b-form-checkbox>
              <b-form-checkbox v-model="prescription.personalHistory.pud"> PUD</b-form-checkbox>
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
            <b-form-textarea v-model="prescription.previousHistory"></b-form-textarea>
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
              <b-form-input  v-model="prescription.bloodPressure" />
              <label>Pulse</label>
              <b-form-input  v-model="prescription.pulse" />
              <label>Tempurature</label>
              <b-form-input  v-model="prescription.tempurature" />
              <label>Weight</label>
              <b-form-input  v-model="prescription.weight" />
            </b-form-group>
          </div>
        </div>
        <div class="row mt-1">
          <div class="col-md-9">
            <b-form-group
              id="input-group-observation"
              label="P/A/E:"
              label-for="observation"
              description="Per abdominal examination of patient"
            >
              <b-textarea  id="observation" v-model="prescription.observations"/>
            </b-form-group>
          </div>
        </div>
        <div class="row mt-1">
          <div class="col-md-9">
            <b-form-group
              id="input-group-advice"
              label="Advice:"
              label-for="advice"
              description="Advice for patient"
            >
              <b-textarea id="advice" v-model="prescription.advice" />
            </b-form-group>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
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
                  <a class="ml-2 anchorBtn" pill variant="success" @click="addRequiredTest">
                    <b-icon-plus-circle scale="1.25" class="t-bold"></b-icon-plus-circle>
                  </a>
                </div>
              </div>
            </b-form-group>
          </div>

          <div class="col-md-3 mt-4" v-if="service"></div>
        </div>
        <table class="table">
              <tr v-for="(rt,r) in recommendedTests" :key="r">
                <td style="width:180px">{{rt.service.name}}</td>
                <td><b-form-input placeholder="Write any remark here" type="text" v-model="rt.remark"></b-form-input></td>
                <!-- <td>
                  <span v-for="(attr,a) in rt.attributes" :key="a" class="badge badge-info ml-2">{{attr.labTestAttribute.attributeName}} 
                    <a class="removeAttrBtn anchorBtn" @click="removeAttribute(rt,a)"><b-icon-x scale="1.5" class="t-bold"></b-icon-x></a>
                  </span>
                </td> -->
              </tr>
            </table>
      </div>
      <div class="col-md-7 border-left">
        <table class="table">
          <thead>
            <tr>
              <th>Medicine</th>
              <th>Rules</th>
              <th>Course Duration</th>
              <th><a @click="addMedicine" v-if="patient" class="anchorBtn"><b-icon-plus-circle></b-icon-plus-circle> ADD</a></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(medicine,m) in recommendedMedicines" :key="m">
              <td style="width:180px;">
                <Autocomplete
                    @choose-item="handleMedicineAutocomplete"
                    :items="medicines"
                    :rowIndex="m"
                    label="name"
                    rowId="serviceId"
                    :disabled="!patient"
                  />
              </td>
              <td style="width:195px;">
                <b-form-select id="r-rule" v-model="medicine.rule" 
                                        :options="feedingRules"></b-form-select>
              </td>
              <td style="width:80px;"><b-form-input type="number" v-model="medicine.duration" ></b-form-input></td>
              <td style="width:122px;"><b-form-select id="r-durationUnit" v-model="medicine.durationUnit" 
                                        :options="durationUnits"></b-form-select></td>
              
            </tr>
          </tbody>
        </table>
        <uploder-ui accept=".png" 
        ref="Fileuploader"
        :disable="!patient" 
        allowedFileType="image/png" 
        uploadUrl=""
        allowedFileExt="png"></uploder-ui>
      </div>
    </div>
    <div class="row mb-3 pt-3 border-top">
        
      <div class="col-md-12 d-flex justify-content-end">
          <b-button type="submit" variant="success">Submit</b-button>
          <b-button type="reset" class="ml-4" variant="danger">Cancel</b-button>
      </div>
        
    </div>
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
</style>
