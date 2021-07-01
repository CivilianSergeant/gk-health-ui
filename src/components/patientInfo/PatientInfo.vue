<template>
  <div class="row">
    <div class="col-md-12 font-weight-bold mb-2">
      <b-card v-if="patient != null">
        <div class="row">
          <div class="col-md-9">
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
          </div>

          <div class="col-md-3" style="padding-top: 21px">
            <div v-if="gbNCh()">
              <span class="w-50 d-inline-block"> NCH-GB:</span>
              <Status :data="gbNCh()" />
            </div>
            <div v-if="gbCh()">
              <span class="w-50 d-inline-block">CH-GB:</span>
              <Status :data="gbCh()" />
            </div>
            <div v-if="ngbCh()">
              <span class="w-50 d-inline-block">CH-NGB:</span>
              <Status :data="ngbCh()" />
            </div>
            <div v-if="ngbNch()">
              <span class="w-50 d-inline-block">NCH-NGB:</span>
              <Status :data="ngbNch()" />
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
  gbCh() {
    if (this.patient.registration != null && this.patient.gb) {
      return true;
    }

    return false;
  }

  gbNCh() {
    if (this.patient.registration == null && this.patient.gb) {
      return true;
    }
    return false;
  }

  ngbCh() {
    if (this.patient.registration != null && !this.patient.gb) {
      return true;
    }

    return false;
  }

  ngbNch() {
    if (this.patient.registration == null && !this.patient.gb) {
      return true;
    }
    return false;
  }
}
</script>