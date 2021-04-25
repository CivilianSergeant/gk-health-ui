<template>
  <div>
    <!-- <ContentBar :PageTitle="title" /> -->
    <b-alert v-model="isSuccess" variant="success">{{ message }}</b-alert>
    <b-alert v-model="isError" variant="danger">{{ message }}</b-alert>

    <cCard>
      <CCardHeader>
        <!-- <h5 class="clearfix"> -->
        Add Medicine
        <router-link to="/medicines" class="btn btn-primary btn-sm float-right"
          >Medicine List</router-link
        >
        <!-- </h5> -->
      </CCardHeader>

      <b-form @submit.prevent="onSubmit" @reset.prevent="onReset">
        <CCardBody>
          <div class="row">
            <div class="col-md-4">
              <b-form-group
                id="input-group-1"
                label-for="input-1"
                description="Name (Required)"
              >
                <!-- <template> -->
                <label> Name: <span class="text-danger">*</span></label>
                <!-- </template> -->
                <b-form-input
                  id="input-1"
                  v-model="form.name"
                  type="text"
                  placeholder="Name"
                  required
                ></b-form-input>
              </b-form-group>
            </div>

            <div class="col-md-4">
              <b-form-group
                id="input-group-1"
                label-for="input-1"
                description="Brand (Required)"
              >
                <label> Brand: <span class="text-danger">*</span></label>
                <b-form-select
                  required
                  :disabled="medicineBrands.length == 0 || isError"
                  id="medicineBrands"
                  v-model="form.medicineBrand.id"
                  :options="medicineBrands"
                ></b-form-select>
              </b-form-group>
            </div>
            <div class="col-md-4">
              <b-form-group
                id="input-group-1"
                label-for="input-1"
                description="Group (Required)"
              >
                <label> Group: <span class="text-danger">*</span></label>
                <b-form-select
                  required
                  :disabled="medicineGroups.length == 0 || isError"
                  id="medicineGroups"
                  v-model="form.medicineGroup.id"
                  :options="medicineGroups"
                ></b-form-select>
              </b-form-group>
            </div>

            <div class="col-md-4">
              <b-form-checkbox id="isActive" v-model="form.active">
                Is Active</b-form-checkbox
              >
            </div>
          </div>
        </CCardBody>
        <CCardFooter>
          <div class="row mt-2 mb-2">
            <div class="col-md-3 d-flex justify-content-between">
              <b-button type="submit" variant="info"
                ><CIcon name="cil-check-circle" /> Submit</b-button
              >
              <b-button type="reset" class="ml-2" variant="danger">
                <CIcon name="cil-x-circle" /> Cancel</b-button
              >
            </div>
          </div>
        </CCardFooter>
      </b-form>
    </cCard>
  </div>
</template>
<script>
import {
  MedicineGroupService,
  MedicineService,
  NavigationService,
} from "@/services";
import { MedicineBrandService } from "@/services";

export default {
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
  data() {
    return {
      id: "null",
      title: "Medicine",
      medicineGroups: [],
      medicineBrands: [],
      form: {
        name: "",
        medicineBrand: { id: null },
        medicineGroup: { id: null },
        active: true,
      },
    };
  },
  mounted() {
    this.id = this.$route.params.id;

    if (this.id != undefined) {
      this.fetchMedicineById(this.id);
    }
    this.fetcheMedicineGroups();
    this.fetcheMedicineBrands();
    this.$store.commit("clearMessage");
  },
  methods: {
    fetcheMedicineGroups() {
      new MedicineGroupService().getMedicineGroups().then((result) => {
        result.unshift({ id: null, name: "Select Group" });
        result.map((r) => {
          r.value = r.id;
          r.text = r.name;
        });

        this.medicineGroups = result;
      });
    },
    fetcheMedicineBrands() {
      new MedicineBrandService().getMedicineBrands().then((result) => {
        result.unshift({ id: null, name: "Select Brand" });
        result.map((r) => {
          r.value = r.id;
          r.text = r.name;
        });
        this.medicineBrands = result;
      });
    },
    fetchMedicineById(id) {
      new MedicineService().getMedicineById(id).then((result) => {
        this.form = result;
      });
    },
    onSubmit() {
      this.$store.commit("start");
      new MedicineService().addMedicine(this.form, () => {
        const message =
          this.id != undefined ? "Medicine Updated" : "Medicine Created";
        this.$store.commit("setSuccessMsg", message);
        this.$store.commit("finish");
        const navigationService = new NavigationService();
        navigationService.redirect(this, "Medicines");
      });
    },
    onReset() {
      this.$store.commit("clearMessage");
      const navigationService = new NavigationService();
      navigationService.redirect(this, "Medicines");
    },
  },
};
</script>