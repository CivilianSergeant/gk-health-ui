<template>
    <div>
        <h3 class="my-3 mb-5">Dashboard</h3>
        <b-form>
            <div class="row">
                <div class="col-md-2">
                    <b-form-select v-model="selected" :options="optionOfficeTypes"></b-form-select>
                </div>
                <div class="col-md-2">
                    <b-form-select v-model="selected2"  :options="optionOffices"></b-form-select>
                </div> 
                <div class="col-md-2">
                    <b-input-group class="mb-3">
                        <b-form-input
                            id="example-input"
                            v-model="value"
                            type="text"
                            placeholder="YYYY-MM-DD"
                            autocomplete="off"
                        ></b-form-input>
                        <b-input-group-append>
                            <b-form-datepicker
                            button-only
                            right
                            locale="en-US"
                            aria-controls="example-input"
                            @context="onContext"
                            ></b-form-datepicker>
                        </b-input-group-append>
                    </b-input-group>
                    
                </div>
                <div class="col-md-2">
                     <b-input-group class="mb-3">
                        <b-form-input
                            id="example-input"
                            v-model="value2"
                            type="text"
                            placeholder="YYYY-MM-DD"
                            autocomplete="off"
                        ></b-form-input>
                        <b-input-group-append>
                            <b-form-datepicker
                            button-only
                            right
                            locale="en-US"
                            aria-controls="example-input"
                            @context="onContext2"
                            ></b-form-datepicker>
                        </b-input-group-append>
                    </b-input-group>
                </div>
                <div class="col-md-2"><b-button type="submit" variant="info">Search</b-button></div>
            </div>
        </b-form>
        
        <div class="row py-5">
            <div class="col-md-3">
                <b-card
                    header="Total GB Patient"
                    header-tag="header"
                    footer=""
                    footer-tag="footer"
                    title="58544"
                    >
                    <!-- <b-card-text>5288</b-card-text>
                    <b-button href="#" variant="primary">Go somewhere</b-button> -->
                    </b-card>
            </div>
             <div class="col-md-3">
                <b-card
                    header="Non GB Patient"
                    header-tag="header"
                    footer=""
                    footer-tag="footer"
                    title="34453"
                    >
                    <!-- <b-card-text>5288</b-card-text>
                    <b-button href="#" variant="primary">Go somewhere</b-button> -->
                    </b-card>
            </div>
             <div class="col-md-3">
                <b-card
                    header="Total Patient"
                    header-tag="header"
                    footer=""
                    footer-tag="footer"
                    title="58544"
                    >
                    <!-- <b-card-text>5288</b-card-text>
                    <b-button href="#" variant="primary">Go somewhere</b-button> -->
                    </b-card>
            </div>
             <div class="col-md-3">
                <b-card
                    header="Total Amount"
                    header-tag="header"
                    footer=""
                    footer-tag="footer"
                    title="42342"
                    >
                    <!-- <b-card-text>5288</b-card-text>
                    <b-button href="#" variant="primary">Go somewhere</b-button> -->
                    </b-card>
            </div>
            <div class="col-md-12" style="display:none">
                   
                <div class="card">
                    <div class="card-header">Summery</div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-3">
                               <strong class="d-block"> GB Patient</strong>
                               10256
                            </div>
                            <div class="col-md-3">
                               <strong class="d-block">Non GB Patient</strong>
                               10256
                            </div>
                            <div class="col-md-3">
                               <strong class="d-block"> Total Patient</strong>
                               10256
                            </div>
                             <div class="col-md-3">
                               <strong class="d-block"> Total Amount(Tk)</strong>
                               25605
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  export default {
    data() {
      return {
        selected: null,
        selected2: null,
        value: '',
         value2: '',
        formatted: '',
        optionOfficeTypes: [
          { value: null, text: 'Select Office Type' },
          { value: '0', text: 'All Office' },
          { value: '2', text: 'Zonal Office' },
          { value: '3', text: 'Regional Office' },
          { value: '4', text: 'Health Center' }
        ],
        optionOffices: [
          { value: null, text: 'Select Office' },
          { value: '', text: 'Narayanganj' },
          { value: '', text: 'Savar' },
          { value: '', text: 'Gazipur' }
        ]
      }
    },
     methods: {
      onContext(ctx) {
        // The date formatted in the locale, or the `label-no-date-selected` string
        //this.formatted = ctx.selectedFormatted
        // The following will be an empty string until a valid date is entered
        //this.selected = ctx.selectedYMD
        this.value = ctx.selectedYMD
      },
      onContext2(ctx) {
        // The date formatted in the locale, or the `label-no-date-selected` string
        //this.formatted = ctx.selectedFormatted
        // The following will be an empty string until a valid date is entered
        //this.selected = ctx.selectedYMD
        this.value2 = ctx.selectedYMD
      }
    }
  }
</script>