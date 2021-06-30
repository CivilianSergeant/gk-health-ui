<template>
  <div>
    <!-- <ContentBar :PageTitle="title" /> -->
    <b-alert v-model="isSuccess" variant="success">{{ message }}</b-alert>
    <b-alert v-model="isError" variant="danger">{{ message }}</b-alert>

    <cCard>
      <CCardHeader>
        <!-- <h5 class="clearfix"> -->
        Add Medicine Brand
        <router-link to="/medicine-brands" class="btn btn-primary btn-sm float-right"
          >Medicine Brands</router-link
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
              <b-form-checkbox id="isActive" v-model="form.status">
                Is Active</b-form-checkbox
              >
            </div>
          </div>
        </CCardBody>
        <CCardFooter>
          <div class="row mt-2 mb-2">
            <div class="col-md-3 d-flex justify-content">
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
  MedicineBrandService,
  NavigationService,
} from "@/services";

export default {
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
  data() {
    return {
      id: null,
      title: "Add Medicine Brand",
      
      form: {
        name: "",
        status: true,
      },
    };
  },
  mounted() {
    this.id = this.$route.params.id;

    if (this.id != undefined) {
      this.fetchMedicineBrandById(this.id);
    }
    this.$store.commit("clearMessage");
  },
  methods: {
    fetchMedicineBrandById(id) {
      new MedicineBrandService().getMedicineBrandById(id).then((result) => {
        this.form = result;
      });
    },
    onSubmit() {
      this.$store.commit("start");
      new MedicineBrandService().addMedicineBrand(this.form, () => {
        const message =
          this.id != undefined ? "Medicine Brand Updated" : "Medicine Brand Created";
        this.$store.commit("setSuccessMsg", message);
        this.$store.commit("finish");
        const navigationService = new NavigationService();
        navigationService.redirect(this, "Medicine Brands");
      });
    },
    onReset() {
      this.$store.commit("clearMessage");
      const navigationService = new NavigationService();
      navigationService.redirect(this, "Medicine Brands");
    },
  },
};
</script>