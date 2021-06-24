<template>
    <div>
        <b-alert v-model="isSuccess" variant="success">{{ message }}</b-alert>
        <b-alert v-model="isError" variant="danger">{{ message }}</b-alert>
        <cCard>
            <CCardHeader>
                Add Voucher
                <router-link
                to="/vouchers"
                class="btn btn-primary btn-sm float-right"
                >Vouchers</router-link
            ></CCardHeader>
            
            <b-form @submit.prevent="onSubmit" @reset.prevent="onReset">
                <CCardBody>
                    <div class="col-md-4">
                        <b-form-group
                        id="input-group-1"
                        label-for="voucherType"
                        description=""
                        >
                        <label>Voucher Type <span class="text-danger">*</span></label>
                        <b-form-select
                        id="voucherType"
                        :options="voucherTypes"
                        v-model="form.alias"
                        @change="handleChangeType"
                        required
                        ></b-form-select>

                        </b-form-group>
                    </div>
                    <div class="col-md-4">
                        <b-form-group
                            id="input-group-1"
                            label-for="input-1"
                            description=""
                        >
                            <!-- <template> -->
                            <label> Voucher No: <span class="text-danger">*</span></label>
                            <!-- </template> -->
                            <b-form-input
                            id="input-1"
                            v-model="form.voucherNo"
                            type="text"
                            placeholder="Voucher No"
                            required
                            ></b-form-input>
                        </b-form-group>
                    </div>
                    <div class="col-md-4">
                        <b-form-group
                            id="input-group-1"
                            label-for="input-1"
                            description=""
                        >
                            <!-- <template> -->
                            <label> Voucher Date: <span class="text-danger">*</span></label>
                            <!-- </template> -->
                            <b-form-input
                            id="input-1"
                            v-model="form.voucherDate"
                            type="date"
                            placeholder="Voucher Date"
                            required
                            ></b-form-input>
                        </b-form-group>
                    </div>
                    <div class="col-md-4">
                        <b-form-group
                            id="input-group-1"
                            label-for="input-1"
                            description=""
                        >
                            <!-- <template> -->
                            <label> Pos Sale Amount: <span class="text-danger">*</span></label>
                            <!-- </template> -->
                            <b-form-input
                            id="input-1"
                            v-model="form.amount"
                            type="text"
                            placeholder=""
                            required
                            ></b-form-input>
                        </b-form-group>
                    </div>
                    <div class="col-md-4">
                        <b-form-group
                            id="input-group-1"
                            label-for="input-1"
                            description=""
                        >
                            <!-- <template> -->
                            <label> Adj. Amount: </label>
                            <!-- </template> -->
                            <b-form-input
                            id="input-1"
                            v-model="form.adjAmount"
                            type="text"
                            placeholder=""
                            
                            ></b-form-input>
                        </b-form-group>
                    </div>
                    <hr/>
                    <span class="d-block mb-2 pl-3 font-weight-bold">Total: {{getTotalAmount}}</span>
                    <div class="col-md-4">
                        <b-form-group
                            id="input-group-1"
                            label-for="input-1"
                            description=""
                        >
                            <!-- <template> -->
                            <label> Note: </label>
                            <!-- </template> -->
                            <b-form-input
                            id="input-1"
                            v-model="form.note"
                            type="text"
                            placeholder=""
                            
                            ></b-form-input>
                        </b-form-group>
                    </div>
                </CCardBody>
                <CCardFooter>
                    <div class="row mt-2 mb-2">
                        <div class="col-md-3 d-flex justify-content">
                        <b-button type="submit" variant="info" :disabled="disbleBtn"
                            ><CIcon name="cil-check-circle" /> Submit</b-button
                        >
                        <b-button type="reset" class="ml-2" variant="danger">
                            <CIcon name="cil-x-circle" /> Cancel</b-button
                        >
                        </div>
                        <div class="col-md-4"> <Loader :isBusy="isBusy" /></div>
                    </div>
                </CCardFooter>
            </b-form>
            
        </cCard>
    </div>
</template>

<script>
import { VoucherService,NavigationService } from '@/services';
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
    disbleBtn(){
        return (this.form.amount==0 || this.form.voucherNo=='') || this.isBusy;
    },
    getTotalAmount(){
        let result = 0;
        const total = parseFloat(this.form.amount) + parseFloat(this.form.adjAmount);
        return result = isNaN(total)? result : total; 
    }
  },
  beforeMount() {
      this.getVoucherTypes();
  },
  data() {
    return {
        form:{
            voucherNo:'',
            voucherDate:(new Date()).toISOString().substring(0,10),
            amount:0,
            adjAmount:0,
            note:'',
            alias:"",            
        },
        voucherTypes:[
               // {value:null,text:"Select Voucher Type"},
            ]
    };
  },

  methods:{
      clearMessage(){
          this.$store.commit('clearMessage');
      },
      onSubmit(){
          if(this.isBusy){
              return false;
          }
          this.$store.commit("start");
          this.form.officeId = this.$store.getters.center.apiOfficeId;
          this.form.officeTypeId = this.$store.getters.center.officeTypeId;
          this.form.totalAmount = this.getTotalAmount;
          this.form.voucherDate = this.form.voucherDate+ 'T00:00:00';
          this.form.module = 'GK_HEALTH';
        (new VoucherService()).addVoucher(this.form).then(result=>{
            this.$store.commit("finish");
            if(result.id != undefined || result.id != null){
                this.$store.commit('setSuccessMsg','Voucher Created Successfully')
                this.redirectTo('Vouchers')
            }
        });
      },
      onReset(){
        this.$store.commit("finish");
        this.clearMessage();
        this.redirectTo('Vouchers');
      },
      redirectTo(routeName){
            const navigationService = new NavigationService();
            navigationService.redirect(this, routeName);
        },
        getVoucherTypes(){
            (new VoucherService()).getVoucherTypes().then((result)=>{
                this.voucherTypes.push({ value: "", text: "Select Voucher Type" });
                result.forEach((v)=>{
                    this.voucherTypes.push({
                        value: v.alias,
                        text: v.name,
                    })
                })
                
            })
    },
    handleChangeType(){
        if(this.form.alias=='patient-service'){
           (new VoucherService()).getTotalUnpostedAmount().then((result)=>{
               this.form.amount = (result)?result:0;
           })
        }else{
            this.form.amount = 0;
        }
    }
  }
}
</script>
