<template>
    <div>
        <b-alert v-model="isSuccess" variant="success">{{ message }}</b-alert>
        <b-alert v-model="isError" variant="danger">{{ message }}</b-alert>
        <cCard>
      <CCardHeader>
        <!-- <h5 class="clearfix"> -->
        {{(this.id)? 'Edit' : 'Add'}} Operation Package
        <router-link to="/operation-package" class="btn btn-primary btn-sm float-right"
          >Operation Package List</router-link
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
                id="input-group-2"
                label-for="input-2"
                description="Name (Required)"
              >
                <!-- <template> -->
                <label> Category: <span class="text-danger">*</span></label>
                <!-- </template> -->
                <b-form-select
                  id="input-2"
                  v-model="form.operationCategory.id"
                  :options="categories"
                  placeholder="Select Category"
                  required
                ></b-form-select>
              </b-form-group>
            </div>
            <div class="col-md-12">
              <b-form-group
                id="input-group-3"
                label-for="input-3"
                description="Description"
              >
                <!-- <template> -->
                <label> Description: </label>
                <!-- </template> -->
                <b-form-input
                  id="input-3"
                  v-model="form.details"
                  type="text"
                  placeholder="Description"
                  required
                ></b-form-input>
              </b-form-group>
            </div>
            

            <div class="col-md-4">
              <b-form-group
                id="input-group-4"
                label-for="input-4"
                description="Amount (Required)"
              >
                <!-- <template> -->
                <label> Amount: <span class="text-danger">*</span></label>
                <!-- </template> -->
                <b-form-input
                  id="input-4"
                  v-model="form.amount"
                  type="text"
                  placeholder="Amount"
                  required
                ></b-form-input>
              </b-form-group>
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
import { OperationCategoryService,OperationPackageService, NavigationService } from '@/services';
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
          form:{
              name:'',
              details:'',
              amount:'',
              operationCategory:{id:null},
              status:true
          },
          categories:[]
      };
  },
  mounted(){
    this.id = this.$route.params.id;
    this.fetchCategories();
    if (this.id != undefined) {
      this.fetchOperationPackageById();
    }   
  },
  methods:{
      fetchCategories(){
          (new OperationCategoryService()).getCategoryList().then(result=>{
             this.categories = [];
             this.categories.push({value:null,text:"Select Category"})
              result.forEach(r=>{
                this.categories.push({value:r.id,text:r.name})
              });
              
          });
      },
      fetchOperationPackageById(){
          this.$store.commit('start');
          (new OperationPackageService()).getById(this.id).then(result=>{
              this.form = result;
              this.$store.commit('finish')
          })
      },
      onSubmit(){
          this.$store.commit('start');
          (new OperationPackageService()).addOperationPackage(this.form).then(result=>{
              this.$store.commit('finish');
              this.$store.commit('setSuccessMsg', (this.id)?'Operation Package Updated':'New Operation Package Created');
              const navigationService = new NavigationService();
            navigationService.redirect(this, "Operation Package");
          });
      },
      onReset(){
          this.$store.commit('clearMessage');
          this.form={
              name:'',
              details:'',
              operationCategory:{id:null},
              amount:'',
              status:true
          };
      }
  }
}
</script>