<template>
  <div class="row">
    <div class="col-md-12 text-secondary font-weight-bold mb-2">
      <b-card v-if="patient != null">
        <div class="row">
          <div class="col-md-10">
            <div v-if="currentDate != undefined">
              Date: {{ currentDate.toLocaleDateString() }}
            </div>
            <!-- <b-card-title>Patient Info #{{patient.pid}}</b-card-title> -->
            <div v-if="patient.id > 0">
              <div class="row">
                <div class="col-md-6">
                  Patient Name: {{ patient.fullName }}
                  {{ "(" + patient.pid + ")" }}
                </div>
                <div class="col-md-3" v-if="patient.age">
                  Age: {{ patient.age }}
                </div>
                <div class="col-md-2" v-if="patient.gender">
                  Sex: {{ patient.gender }}
                </div>
              </div>
            </div>
            <!-- <div>
                  IS GB?:
                  <Status :data="isGb()"/>
                </div>
                <div>
                  Card Registered?:
                  <Status :data="patient.registration && patient.registration.id"/>
                </div> -->
            <!-- <span
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
                </div> -->
            <!-- <p v-if="patient.registration && patient.registration.validityDuration>0">
                  Registration Valid for ({{patient.registration.validityDuration}}) Months From {{getDate(patient.registration.startDate)}}
                  - {{getDate(patient.registration.expiredDate)}}
                </p> -->
          </div>
          <!-- <div class="col-md-3">
                <h5 class="mt-1">Invoice Detail</h5>
                <p>Invoice No: {{invoice.invoiceNumber}}</p>
                <ul class="nav">
                  <li v-for="d in invoice.patientServiceDetails" :key="d.id">
                    <p>{{d.service.name}} - {{d.payableAmount}} BDT</p>
                  </li>
                </ul>
              </div> -->
          <div class="col-md-2">
            <div>
              <span class="w-50 d-inline-block"> NCH:</span>
              <Status :data="!patient.registration" />
            </div>
            <div>
              <span class="w-50 d-inline-block">CH-GB:</span>
              <Status :data="isGb()" />
            </div>

            <div>
              <span class="w-50 d-inline-block">CH-NGB:</span>
              <Status :data="patient.registration && !isGb()" />
            </div>
          </div>
        </div>
      </b-card>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class PatientInfo extends Vue {
  @Prop() private invoice!: any;
  @Prop() private patient!: any;
  @Prop() private form!: any;
  private currentDate: Date = new Date();

  getDate() {
    this.currentDate = new Date();
  }
  isGb() {
    if (this.patient.registration != null) {
      console.log("tset1", this.patient.registration);
      return this.patient.registration.gb;
    }
    console.log("tset2", this.patient.registration);
    return false;
  }
}
</script>