<template>
  <div>
    <!-- <ContentBar :PageTitle="title" /> -->
    <b-alert v-model="isSuccess" variant="success">{{ message }}</b-alert>
    <b-alert v-model="isError" variant="danger">{{ message }}</b-alert>
    <cCard>
      <CCardHeader>
        Add Patient
        <router-link to="/patients" class="btn btn-primary btn-sm float-right"
          >Patient List</router-link
        >
      </CCardHeader>

      <b-form @submit.prevent="onSubmit" @reset.prevent="onReset">
        <CCardBody>
          <!-- <div class="row">
        <div class="col-md-3">
          <b-form-group
            id="input-group-0"
            label="Center:"
            label-for="centers"
            description="Select Center"
          >
            <b-form-select
              :disabled="centers.length == 0 || isError"
              id="centers"
              v-model="form.center.id"
              :options="centers"
            ></b-form-select>
          </b-form-group>
        </div>
      </div> -->
          <div class="row">
            <div class="col-md-3">
              <b-form-group
                id="input-group-1"
                label-for="input-1"
                description=""
              >
                <label> Full Name: <span class="text-danger">*</span> </label>
                <b-form-input
                  id="input-1"
                  v-model="form.fullName"
                  type="text"
                  placeholder="Full Name"
                  required
                ></b-form-input>
              </b-form-group>
            </div>
            <div class="col-md-3">
              <b-form-group
                id="input-group-2"
                label-for="input-2"
                description=""
              >
                <label>
                  Guardian Name: <span class="text-danger">*</span>
                </label>
                <b-form-input
                  id="input-2"
                  v-model="form.guardianName"
                  type="text"
                  placeholder="Guardian Name"
                  required
                ></b-form-input>
              </b-form-group>
            </div>
            <div class="col-md-6">
              <b-form-group
                id="input-group-3"
                label-for="input-3"
                description=""
              >
                <label> Mother Name: <span class="text-danger">*</span> </label>
                <b-form-input
                  id="input-3"
                  v-model="form.motherName"
                  type="text"
                  placeholder="Mother Name"
                  required
                ></b-form-input>
              </b-form-group>
            </div>
          </div>

          <div class="row">
            <div class="col-md-3">
              <b-form-group
                id="input-group-4"
                label="Gender:"
                label-for="gender"
                description=""
              >
                <b-form-select
                  id="gender"
                  v-model="form.gender"
                  :options="genderOptions"
                ></b-form-select>
              </b-form-group>
            </div>
            <div class="col-md-3">
              <b-form-group
                id="input-group-6"
                label="Marital Status:"
                label-for="marital-status"
                description=""
              >
                <b-form-select
                  id="marital-status"
                  v-model="form.maritalStatus"
                  :options="maritalStatusOptions"
                ></b-form-select>
              </b-form-group>
            </div>
            <!-- <div class="col-md-4">
                    <b-form-group
                        id="input-group-6"
                        label="Date Of Birth:"
                        label-for="patient-datepicker"
                        description="Patient's Date of Birth"
                    >
                        <b-form-datepicker :required="true" id="patient-datepicker"  v-model="form.dateOfBirth" class="mt-2"></b-form-datepicker>
                    </b-form-group>
                </div> -->
            <div class="col-md-3">
              <b-form-group
                id="input-group-3"
                label-for="patient-age"
                description=""
              >
                <label> Age: <span class="text-danger">*</span> </label>
                <b-form-input
                  type="number"
                  :required="true"
                  id="patient-age"
                  v-model="form.age"
                ></b-form-input>
              </b-form-group>
            </div>
            <div class="col-md-3">
              <b-form-group
                id="input-group-3"
                label-for="patient-isgb"
                description=""
              >
                <label for="patient-isgb"> Is GB: <span class="text-danger">*</span> </label>
                <b-form-checkbox
                  :required="true"
                  id="patient-isgb"
                  v-model="form.gb"
                ></b-form-checkbox>
              </b-form-group>
            </div>
          </div>

          <div class="row">
            <div class="col-md-3">
                        <b-form-group
                          id="input-group-r-gender"
                          label="Village:"
                          label-for="village"
                          description=""
                        >
                          <b-form-select
                            id="r-village"
                            v-model="form.village.lgVillageId"
                            :options="villages"
                          ></b-form-select>
                        </b-form-group>
                      </div>
            <div class="col-md-6">
              <b-form-group
                v-if="form.village.lgVillageId"
                id="input-group-7"
                label="Street Address"
                label-for="street-address"
                description=""
              >
                <b-form-input
                  id="streetAddress"
                  v-model="form.streetAddress"
                  type="text"
                  placeholder="Patient's address"
                ></b-form-input>
              </b-form-group>
            </div>
            <div class="col-md-6">
              <b-form-group
                id="input-group-8"
                label="Mobile Number:"
                label-for="mobileNumber"
                description=""
              >
                <b-form-input
                  id="mobileNumber"
                  v-model="form.mobileNumber"
                ></b-form-input>
              </b-form-group>
            </div>
          </div>
          <div class="row">
            <div class="col-md-3">
              <b-form-group
                id="input-group-9"
                label="Blood Group"
                label-for="bloodGroup"
                description=""
              >
                <b-form-input
                  id="bloodGroup"
                  v-model="form.detail.bloodGroup"
                  type="text"
                  placeholder="Blood Group"
                ></b-form-input>
              </b-form-group>
            </div>
            <div class="col-md-3">
              <b-form-group
                id="input-group-10"
                label="Nationality:"
                label-for="nationality"
                description=""
              >
                <b-form-input
                  id="nationality"
                  v-model="form.detail.nationality"
                  placeholder="Nationality"
                ></b-form-input>
              </b-form-group>
            </div>
            <div class="col-md-3">
              <b-form-group
                id="input-group-10"
                label="National ID:"
                label-for="nationalId"
                description=""
              >
                <b-form-input
                  id="nationalId"
                  v-model="form.detail.nationalId"
                  placeholder="Patient's National ID"
                ></b-form-input>
              </b-form-group>
            </div>
            <div class="col-md-3">
              <b-form-group
                id="input-group-10"
                label="Occupation:"
                label-for="occupation"
                description=""
              >
                <b-form-input
                  id="occupation"
                  v-model="form.detail.occupation"
                  placeholder="Occupation"
                ></b-form-input>
              </b-form-group>
            </div>
          </div>
          <!-- <div class="row">
                <div class="col-md-5">
                <b-form-checkbox
                    id="checkbox-1"
                    v-model="cardRegistrationAccepted"
                    name="card-registration"
                    :value="true"
                    :unchecked-value="false"
                    >
                    <strong>Card registration ?</strong>
                </b-form-checkbox>
                </div>
            </div> -->
          <div class="row mt-3" v-if="cardRegistrationAccepted">
            <b-card class="col-md-12">
              <div class="row">
                <div class="col-md-5">
                  <b-form-checkbox
                    id="input-is-gb"
                    v-model="form.cardRegistration.gb"
                    name="card-registration-gb"
                    :value="true"
                    :unchecked-value="false"
                  >
                    <strong>IS GB ?</strong> (Is the patient from Grameen Bank?)
                  </b-form-checkbox>
                </div>
              </div>

              <div class="col-md-12 mt-3">
                <h6>
                  Card Members
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
                <b-card-body>
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

                  <div class="col-md-12">
                    <div class="row">
                      <div class="col-md-3">
                        <b-form-group
                          id="input-group-r-fullname"
                          label="Full Name:"
                          label-for="input-r-fullname"
                          description="full name"
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
                      <div class="col-md-3">
                        <b-form-group
                          id="input-group-r-age"
                          label="Age:"
                          label-for="r-age"
                          description="Age"
                        >
                          <b-form-input
                            id="r-age"
                            v-model="member.age"
                            placeholder="Age"
                            type="number"
                          ></b-form-input>
                        </b-form-group>
                      </div>

                      <div class="col-md-3">
                        <b-form-group
                          id="input-group-r-gender"
                          label="Gender:"
                          label-for="gender"
                          description="Gender"
                        >
                          <b-form-select
                            id="r-gender"
                            v-model="member.gender"
                            :options="genderOptions"
                          ></b-form-select>
                        </b-form-group>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-12">
                    <div class="row">
                      <div class="col-md-2">
                        <b-form-group
                          id="input-group-r-blood-group"
                          label="Blood Group"
                          label-for="r-blood-group"
                          description="Blood Group"
                        >
                          <b-form-input
                            id="r-blood-group"
                            v-model="member.bloodGroup"
                            type="text"
                            placeholder="Blood Group"
                          ></b-form-input>
                        </b-form-group>
                      </div>
                      <div class="col-md-3">
                        <b-form-group
                          id="input-group-r-nationality"
                          label="Nationality:"
                          label-for="nationality"
                          description="Nationality"
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
                          description="National ID"
                        >
                          <b-form-input
                            id="r-nationalId"
                            v-model="member.nationalId"
                            placeholder="National ID"
                          ></b-form-input>
                        </b-form-group>
                      </div>
                      <div class="col-md-3">
                        <b-form-group
                          id="input-group-relation"
                          label="Relation:"
                          label-for="relation"
                          description="Relation with Patient"
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
                </b-card-body>
              </b-card>
            </b-card>
          </div>
        </CCardBody>
        <CCardFooter>
          <div class="row mt-2 mb-2">
            <div class="col-md-3 d-flex justify-content-between">
              <b-button type="submit" variant="info"
                ><CIcon name="cil-check-circle" /> Submit</b-button
              >
              <b-button type="reset" class="ml-2" variant="danger"
                ><CIcon name="cil-x-circle" /> Cancel</b-button
              >
            </div>
          </div>
        </CCardFooter>
      </b-form>
    </cCard>
  </div>
</template>

<script>
import { CenterService } from "@/services/CenterService";
import { LocalStorageService } from "@/services/LocalStorageService";
import { NavigationService } from "@/services/NavigationService";
import { LocationService, PatientService } from "@/services";

export default {
  name: "Patients",

  data() {
    return {
      referrer: null,
      cardRegistrationAccepted: false,
      title: "Patients",
      id: null,
      centers: [],
      bloodGroups: [
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
        { value: "Divorced", text: "Divorced" },
        { value: "Widow", text: "Widow" },
      ],
      form: {
        pid: "",
        center: { id: null },
        village: {lgVillageId:null},
        fullName: "",
        age: "",
        guardianName: "",
        motherName: "",
        gender: null,
        maritalStatus: null,
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
      villages:[],
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
    this.id = this.$route.params.id;
    if (this.id != null) {
      this.fetchPatient(this.$route.params.id);
    }
    this.fetchCenters(() => {
      console.log("here", this.$store.getters.center);
    });
  },
  mounted() {
    console.log(this.$store.getters);
    this.fetchVillagesByCenter();
  },
  created() {
    new LocalStorageService().getReferrer((r) => (this.referrer = r), this);
  },
  methods: {
    async onSubmit() {
      const formRequest = Object.assign({}, this.form);
      console.log(this.form);

      if (
        (this.form.detail.bloodGroup == null ||
          this.form.detail.bloodGroup == "") &&
        (this.form.detail.nationality == null ||
          this.form.detail.nationality == "") &&
        (this.form.detail.nationalId == null ||
          this.form.detail.nationalId == "") &&
        (this.form.detail.occupation == null ||
          this.form.detail.occupation == "")
      ) {
        console.log(this.form.detail.bloodGroup, 2);
        formRequest.detail = null;
      }
      if (!this.cardRegistrationAccepted) {
        formRequest.cardRegistration = null;
      }

      if(this.form.village.lgVillageId!=null){
        this.form.village = null;
      }
      formRequest.center.id = this.$store.getters.center.id;

      // axios.defaults.headers.common = {
      //   "Access-Control-Allow-Origin": ApiRoutes.DOMAIN,
      //   "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
      // };
      console.log(formRequest);
      try {
        const response = await new PatientService().addPatient(formRequest);
        console.log(response);
        if (response.status == 200) {
          this.$store.commit("setSuccessMsg", "New Patient profile Created");
          this.form.pid = response.data.patient.pid;
          const navigationService = new NavigationService();
          navigationService.setLocalStorageService(new LocalStorageService());
          navigationService.redirect(this, "Patients");
        } else {
          this.$store.commit("setErrorMsg", response);
        }
      } catch (e) {
        this.$store.commit("setErrorMsg", e);
      }
    },
    onReset() {
      const navigationService = new NavigationService();
      navigationService.setLocalStorageService(new LocalStorageService());
      navigationService.redirect(this, "Patients");
      this.referrer = null;
      console.log("");
    },
    addMember() {
      this.form.cardRegistration.members.push({
        fullName: "",
        age: "",
        gender: "",
        bloodGroup: "",
        nationality: "",
        nationalId: "",
        relationWithPatient: "",
      });
    },
    delMember(i) {
      this.form.cardRegistration.members.splice(i, 1);
    },
    fetchPatient(id) {
      new PatientService().getPatientById(id, (data) => {
        this.form = data;
        this.form.center = {id:null}
        if(data.village==null){
          this.form.village = {lgVillageId:null}
        }
        if (data.detail == null) {
          this.form.detail = {
            bloodGroup: null,
            nationality: null,
            nationalId: null,
            occupation: null,
          };
        }
      });
    },
    fetchCenters(callback) {
      this.$store.commit("start");
      new CenterService().getCenters().then((result) => {
        this.centers.push({ value: null, text: "Select Center" });
        result.forEach((center) => {
          this.centers.push({
            value: center.id,
            text: center.name,
            id: center.id,
          });
        });

        if (callback != null && callback != undefined) {
          callback();
        }

        this.$store.commit("finish");
      });
    },

    fetchVillagesByCenter(){
      const id = this.$store.getters.center.apiOfficeId;
      if(id==undefined)
      {
        return;
      }
      (new LocationService()).getVillagesByCenter(id).then((result)=>{
         this.villages.push({ value: null, text: "Select Village" });
        result.forEach((v)=>{
          this.villages.push({
            value: v.lgVillageId,
            text: v.villageName,
          })
        })
        
      })
    },
  },
};
</script>

<style scoped>
.clearBoth {
  clear: both;
}
</style>
