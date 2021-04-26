<template>
    <div>
        
        <b-alert v-model="isSuccess" variant="success">{{message}}</b-alert>
        <b-alert v-model="isError" variant="danger">{{message}}</b-alert>
        
        <CRow>
            <CCol sm="6" lg="3">
                <CWidgetDropdown color="primary" :header="stats.totalPatientUptoLastDay.toString()" text="Total Patient">
                    <template #footer>
                        <div class="card-body pb-3 pt-3 d-flex justify-content-between"><small>Up to last day</small></div>
                    </template>
                </CWidgetDropdown>
            </CCol>

            <CCol sm="6" lg="3">
                <CWidgetDropdown color="info" :header="stats.totalGbPatientUptoLastDay.toString()" text="Total GB">
                    <template #footer>
                        <div class="card-body pb-3 pt-3 d-flex justify-content-between"><small>Up to last day</small></div>
                    </template>
                </CWidgetDropdown>
            </CCol>

            <CCol sm="6" lg="3">
                <CWidgetDropdown color="warning" :header="stats.totalNonGbPatientUptoLastDay.toString()" text="Total Non-GB">
                    <template #footer>
                        <div class="card-body pb-3 pt-3 d-flex justify-content-between"><small>Up to last day</small></div>
                    </template>
                </CWidgetDropdown>
            </CCol>

            <CCol sm="6" lg="3">
                <CWidgetDropdown color="danger" :header="stats.totalAmountUptoLastDay.toString()" text="Total Amount Received">
                    <template #footer>
                        <div class="card-body pb-3 pt-3 d-flex justify-content-between"><small>Up to last day</small></div>
                    </template>
                </CWidgetDropdown>
            </CCol>
        </CRow>
        <Loader :isBusy="isBusy" class="pt-3"/>
        <CCard>
        <CCardHeader>Month Wise Received Amount</CCardHeader>
        <CChartBar
            :datasets="monthWiseReceiveds"
            labels="months"
        />
        </CCard>
        
    </div>
    
</template>

<script>
import { CenterService, StatsService } from '@/services'
import { CChartBar } from '@coreui/vue-chartjs'

  export default {
    components: { CChartBar },
    data() {
      return {
        form: {officeTypeId:null, centerId:null},
        selectedCenter: null,
        centers:[],
        fromDate: '',
        toDate: '',
        formatted: '',
        optionOfficeTypes: [
          { value: null, text: 'Select Office Type' },
          { value: '1', text: 'All Office' },
          { value: '4', text: 'Zonal Office' },
          { value: '5', text: 'Regional Office' },
          { value: '6', text: 'Health Center' }
        ],
        optionOffices: [],
        stats:{totalNonGbPatient:0,totalGbPatient:0,totalPatient:0,totalAmount:0,
        totalAmountUptoLastDay:'0',totalPatientUptoLastDay:'0',
        totalGbPatientUptoLastDay:'0',totalNonGbPatientUptoLastDay:'0'},
        monthWiseReceiveds: [
        {
          label: 'Amount',
          backgroundColor: '#f87979',
          data: []
        }
      ]
      }
    },
    computed:{
        center(){
            return this.$store.getters.center;
        },
        isBusy(){
            return this.$store.state.isBusy;
        },
        isError(){
            return this.$store.state.isError;
        },
        isSuccess(){
            return this.$store.state.isSuccess;
        },
        message(){
            return this.$store.state.message;
        }
    },
    watch:{
        center(newLen,oldLen){
            if(newLen.id != undefined){
                this.fetchStats();
            }
        }
    },
     mounted(){
         if(this.$store.getters.center.id != undefined){
             this.fetchStats();
         }
     },
     methods: {
         handleOfficeChange(val){
            console.log(val);
            const centers = this.centers.filter(o=>o.id==val);
            this.selectedCenter = centers[0];
         },
         handleOfficeTypeChange(val){
             
             this.selectedCenter = null;
             this.form.centerId=null;
             if(val==null){
                 return;
             }
             console.log('office-type',val)
             this.optionOffices=[];
             if(val==0){
                 (new CenterService()).getCenters().then(result=>{
                     this.centers = result;
                     result.map(m=>{
                         this.optionOffices.push({value:m.id,text:m.name});
                     })
                 });
             }else{
                 (new CenterService()).getCentersByOfficeTypeId(val).then(result=>{
                     this.centers = result;
                     result.map(m=>{
                         this.optionOffices.push({value:m.id,text:m.name});
                     })
                 })
             }
             
         },
        formatDate(date,start) {
            const d = new Date(date);
            let    month = '' + (d.getMonth() + 1);
            let    day = '' + d.getDate();
            const    year = d.getFullYear();

            if (month.length < 2) 
                month = '0' + month;
            if (day.length < 2) 
                day = '0' + day;

            const formatedDate = [year, month, day].join('-');
            console.log(formatedDate)
            return formatedDate.toString()+ ((start)? ' 23:59:59': ' 23:59:59') ;
        }  ,
        onSearch(){
            this.fetchStats(this.selectedCenter);
        },
        fetchStats(center){
            this.$store.commit('start');
            const _center = (center)? center : this.$store.getters.center;
            console.log(center);
            const toDate = new Date();
            toDate.setDate(toDate.getDate() - 7);

            const payload = {
                id:_center.id,
                officeTypeId:_center.officeTypeId,
                centerCode: _center.centerCode,
                fromDate:(this.fromDate)? this.fromDate+' 00:00:00' : this.formatDate(toDate,false),
                toDate:(this.toDate)? this.toDate+ ' 23:59:59':this.formatDate(new Date(),true)
            };
            (new StatsService()).getDashBoardStats(payload).then(result=>{
                this.$store.commit('finish');
                if(result!=undefined){
                    this.stats=result;
                }
            });
            (new StatsService()).getMonthWiseReceivedStats().then(result=>{
                this.$store.commit('finish');
                if(result!=undefined){
                    this.monthWiseReceiveds[0].data.push(result.jan);
                    this.monthWiseReceiveds[0].data.push(result.feb);
                    this.monthWiseReceiveds[0].data.push(result.mar);
                    this.monthWiseReceiveds[0].data.push(result.apr);
                    this.monthWiseReceiveds[0].data.push(result.may);
                    this.monthWiseReceiveds[0].data.push(result.jun);
                    this.monthWiseReceiveds[0].data.push(result.jul);
                    this.monthWiseReceiveds[0].data.push(result.aug);
                    this.monthWiseReceiveds[0].data.push(result.sep);
                    this.monthWiseReceiveds[0].data.push(result.oct);
                    this.monthWiseReceiveds[0].data.push(result.nov);
                    this.monthWiseReceiveds[0].data.push(result.dec);
                }
            })
      },
      onContext(ctx) {
        // The date formatted in the locale, or the `label-no-date-selected` string
        //this.formatted = ctx.selectedFormatted
        // The following will be an empty string until a valid date is entered
        //this.selected = ctx.selectedYMD
        this.fromDate = ctx.selectedYMD
      },
      onContext2(ctx) {
        // The date formatted in the locale, or the `label-no-date-selected` string
        //this.formatted = ctx.selectedFormatted
        // The following will be an empty string until a valid date is entered
        //this.selected = ctx.selectedYMD
        this.toDate = ctx.selectedYMD
      }
    }
  }
</script>