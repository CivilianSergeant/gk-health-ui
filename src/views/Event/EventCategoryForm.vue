<template>
    <div>
        <b-alert v-model="isSuccess" variant="success">{{ message }}</b-alert>
        <b-alert v-model="isError" variant="danger">{{ message }}</b-alert>
        <cCard>
      <CCardHeader>
        <!-- <h5 class="clearfix"> -->
        {{(this.id)? 'Edit' : 'Add'}} Event Category
        <router-link to="/event-category" class="btn btn-primary btn-sm float-right"
          >Event Category List</router-link
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
            <div class="col-md-12">
              <b-form-group
                id="input-group-2"
                label-for="input-2"
                description="Description"
              >
                <!-- <template> -->
                <label> Description: </label>
                <!-- </template> -->
                <b-form-input
                  id="input-2"
                  v-model="form.description"
                  type="text"
                  placeholder="Description"
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
import { EventCategoryService, NavigationService } from '@/services';
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
  data(){
      return {
          id:null,
          form:{
              name:'',
              description:'',
              status:true
          }
      };
  },
  mounted(){
    this.id = this.$route.params.id;

    if (this.id != undefined) {
      this.fetchEventCategoryById();
    }   
  },
  methods:{
      fetchEventCategoryById(){
          this.$store.commit('start');
          (new EventCategoryService()).getById(this.id).then(result=>{
              this.form = result;
              this.$store.commit('finish')
          })
      },
      onSubmit(){
          this.$store.commit('start');
          if(this.id!=undefined){
            this.form.createdAt=this.form.createdAt+'T00:00:00';
          }
          (new EventCategoryService()).addEventCatgory(this.form).then(result=>{
            if(result.id != undefined){
              this.$store.commit('finish');
              this.$store.commit('setSuccessMsg',(this.id)?'Event Category Updated' : 'New Event Category Created');
              const navigationService = new NavigationService();
            navigationService.redirect(this, "Event Category");
            }
          });
      },
      onReset(){
          this.$store.commit('clearMessage');
          this.form={
              name:'',
              description:'',
              status:true
          };
      }
  }
}
</script>