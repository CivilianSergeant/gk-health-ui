<template>
    <div>
        <vue-html2pdf
        :show-layout="false"
        :float-layout="true"
        :enable-download="true"
        :preview-modal="true"
        :paginate-elements-by-height="1400"
        
        :pdf-quality="2"
        :manual-pagination="false"
        pdf-format="a4"
        pdf-orientation="portrait"
        pdf-content-width="760px"
        ref="html2Pdf"
    >
        <section slot="pdf-content">
            <h5 class="text-center mt-3">Center: {{resultData.center.name}} </h5>
        <div class="row" >
            <div class="col-md-5"></div>
            <div class="col-md-2 mt-3 text-center"><h6 class="border p-1">{{title}}</h6></div>
            <div class="col-md-5 text-right">
                <div>
                    <span class="w-50 d-inline-block"> NCH:</span> <Status :type="1" :data="!resultData.prescriptionPatient.registration"/>
                </div>
                <div>
                        <span class="w-50 d-inline-block">CH-GB:</span> <Status :type="1" :data="isGb()"/>
                </div>

                <div>
                        <span class="w-50 d-inline-block">CH-NGB:</span> <Status :type="1" :data="resultData.prescriptionPatient.registration && (!isGb())"/>
                </div>
            
        </div>
        </div>
        <div class="row">
            <div class="col-md-12 py-2">Date:{{showVisitDate(resultData)}}</div>
        </div>
        <div class="row">
            <div class="col-md-6">
               Patient Name: {{resultData.prescriptionPatient.fullName}}
            </div>
            <div class="col-md-4">
               Age: {{resultData.prescriptionPatient.age}}
            </div>
             <div class="col-md-2 text-right">
               Gender: {{resultData.prescriptionPatient.gender}}
            </div>
        </div>
        <div class="row py-3">
            <div class="col-md-3">
                <div class="border p-2">
                    C/C<br>
                    {{resultData.symptoms}}
                </div>
                <div class="mt-2 border p-2">
                    <div class="border-bottom mb-2 d-inline-block border-bottom border-dark">Family History</div><br>
                    <span class="w-50 d-inline-block"><span class="w-50 d-inline-block"> DM:</span> <Status :type="1" :data="resultData.familyHistory && resultData.familyHistory.dm"/></span>
                    <span class="w-50 d-inline-block"><span class="w-50 d-inline-block"> HTN:</span> <Status :type="1" :data="resultData.familyHistory && resultData.familyHistory.htn"/></span>
                    <span class="w-50 d-inline-block"><span class="w-50 d-inline-block"> Asthma:</span> <Status :type="1" :data="resultData.familyHistory && resultData.familyHistory.asthma"/></span>
                    <span class="w-50 d-inline-block"><span class="w-50 d-inline-block"> TB:</span> <Status :type="1" :data="resultData.familyHistory && resultData.familyHistory.tb"/></span>
                   
                </div>
                <div class="mt-2 border p-2">
                    <div class="border-bottom mb-2 d-inline-block border-bottom border-dark">Personal History</div><br>
                    <span class="w-50 d-inline-block"><span class="w-50 d-inline-block"> DM:</span> <Status :type="1"  :data="resultData.personalHistory && resultData.personalHistory.dm"/></span>
                    <span class="w-50 d-inline-block"><span class="w-50 d-inline-block"> HTN:</span> <Status :type="1" :data="resultData.personalHistory && resultData.personalHistory.htn"/></span>
                    <span class="w-50 d-inline-block"><span class="w-50 d-inline-block"> Asthma:</span> <Status :type="1" :data="resultData.personalHistory && resultData.personalHistory.asthma"/></span>
                    <span class="w-50 d-inline-block"><span class="w-50 d-inline-block"> TB:</span> <Status :type="1" :data="resultData.personalHistory && resultData.personalHistory.tb"/></span>
                    <span class="w-50 d-inline-block"><span class="w-50 d-inline-block"> PUD:</span> <Status :type="1" :data="resultData.personalHistory && resultData.personalHistory.pud"/></span>
                </div>
                 <div class="mt-2 border p-2">

                        G/E: <br/>
                        Blood Pressure: {{showValue(resultData.generalExamination,"bloodPressure")}}<br/>
                        Pulse: {{showValue(resultData.generalExamination,"pulse")}}<br/>
                        Tempurature: {{showValue(resultData.generalExamination,"tempurature")}}<br/>
                        Weight: {{showValue(resultData.generalExamination,"weight")}}<br/>

                 </div>

                  <div class="mt-2 border p-2">
                      P/A/E:<br/> {{showValue(resultData.generalExamination,"pae")}}
                  </div>

            </div>
            <div class="col-md-9 py-2 border">
                <div class="">
                    <h4>Rx</h4><br>
                    <div class="pb-4">
                    <div class="mb-2" v-for="(rs,i) in resultData.recommendedMedicines" :key="i">
                        <span class="ml-4">{{(i+1)}}. </span>
                        <span><strong>{{rs.medicine.name}}</strong></span><br>
                        <span class="ml-5">{{showFeedingRule(rs.rule)}}</span>
                        <span class="ml-2">{{rs.duration}}</span>
                        <span>{{rs.durationUnit}}</span> 
                    </div>
                    </div>
                    <div class="mb-5 py-2  border-top ">
                        <h6 class="d-inline-block">Advice:</h6> {{resultData.advice}}
                        <div class="" v-for="(rs,i) in resultData.recommendedTests" :key="i" >
                            {{rs.service.name}}
                        </div>
                    </div>

                    <div class="pt-4">
                        <div class="col-md-2 offset-md-10 text-center border-top border-dark py-1">Doctor</div>
                    </div>
                </div>
            </div>
        </div>
        
        </section>
    </vue-html2pdf>
        <h5 class="text-center mt-3">Center: {{resultData.center.name}} <a @click="printPrescription()"  class="btn btn-sm btn-primary cursor-pointer"><b-icon-printer></b-icon-printer></a></h5>
        <div class="row" >
            <div class="col-md-5"></div>
            <div class="col-md-2 mt-3 text-center"><h6 class="border p-1">{{title}}</h6></div>
            <div class="col-md-5 text-right">
                <div>
                    <span class="w-50 d-inline-block"> NCH:</span> <Status :type="1" :data="!resultData.prescriptionPatient.registration"/>
                </div>
                <div>
                        <span class="w-50 d-inline-block">CH-GB:</span> <Status :type="1" :data="isGb()"/>
                </div>

                <div>
                        <span class="w-50 d-inline-block">CH-NGB:</span> <Status :type="1" :data="resultData.prescriptionPatient.registration && (!isGb())"/>
                </div>
            
        </div>
        </div>
        <div class="row">
            <div class="col-md-12 py-2">Date:{{showVisitDate(resultData)}}</div>
        </div>
        <div class="row">
            <div class="col-md-6">
               Patient Name: {{resultData.prescriptionPatient.fullName}}
            </div>
            <div class="col-md-4">
               Age: {{resultData.prescriptionPatient.age}}
            </div>
             <div class="col-md-2 text-right">
               Gender: {{resultData.prescriptionPatient.gender}}
            </div>
        </div>
        <div class="row py-3">
            <div class="col-md-3">
                <div class="border p-2">
                    C/C<br>
                    {{resultData.symptoms}}
                </div>
                <div class="mt-2 border p-2">
                    <div class="border-bottom mb-2 d-inline-block border-bottom border-dark">Family History</div><br>
                    <span class="w-50 d-inline-block"><span class="w-50 d-inline-block"> DM:</span> <Status :type="1" :data="resultData.familyHistory && resultData.familyHistory.dm"/></span>
                    <span class="w-50 d-inline-block"><span class="w-50 d-inline-block"> HTN:</span> <Status :type="1" :data="resultData.familyHistory && resultData.familyHistory.htn"/></span>
                    <span class="w-50 d-inline-block"><span class="w-50 d-inline-block"> Asthma:</span> <Status :type="1" :data="resultData.familyHistory && resultData.familyHistory.asthma"/></span>
                    <span class="w-50 d-inline-block"><span class="w-50 d-inline-block"> TB:</span> <Status :type="1" :data="resultData.familyHistory && resultData.familyHistory.tb"/></span>
                   
                </div>
                <div class="mt-2 border p-2">
                    <div class="border-bottom mb-2 d-inline-block border-bottom border-dark">Personal History</div><br>
                    <span class="w-50 d-inline-block"><span class="w-50 d-inline-block"> DM:</span> <Status :type="1"  :data="resultData.personalHistory && resultData.personalHistory.dm"/></span>
                    <span class="w-50 d-inline-block"><span class="w-50 d-inline-block"> HTN:</span> <Status :type="1" :data="resultData.personalHistory && resultData.personalHistory.htn"/></span>
                    <span class="w-50 d-inline-block"><span class="w-50 d-inline-block"> Asthma:</span> <Status :type="1" :data="resultData.personalHistory && resultData.personalHistory.asthma"/></span>
                    <span class="w-50 d-inline-block"><span class="w-50 d-inline-block"> TB:</span> <Status :type="1" :data="resultData.personalHistory && resultData.personalHistory.tb"/></span>
                    <span class="w-50 d-inline-block"><span class="w-50 d-inline-block"> PUD:</span> <Status :type="1" :data="resultData.personalHistory && resultData.personalHistory.pud"/></span>
                </div>
                 <div class="mt-2 border p-2">

                        G/E: <br/>
                        Blood Pressure: {{showValue(resultData.generalExamination,"bloodPressure")}}<br/>
                        Pulse: {{showValue(resultData.generalExamination,"pulse")}}<br/>
                        Tempurature: {{showValue(resultData.generalExamination,"tempurature")}}<br/>
                        Weight: {{showValue(resultData.generalExamination,"weight")}}<br/>

                 </div>

                  <div class="mt-2 border p-2">
                      P/A/E:<br/> {{showValue(resultData.generalExamination,"pae")}}
                  </div>

            </div>
            <div class="col-md-9 py-2 border">
                <div class="">
                    <h4>Rx</h4><br>
                    <div class="pb-4">
                    <div class="mb-2" v-for="(rs,i) in resultData.recommendedMedicines" :key="i">
                        <span class="ml-4">{{(i+1)}}. </span>
                        <span><strong>{{rs.medicine.name}}</strong></span><br>
                        <span class="ml-5">{{showFeedingRule(rs.rule)}}</span>
                        <span class="ml-2">{{rs.duration}}</span>
                        <span>{{rs.durationUnit}}</span> 
                    </div>
                    </div>
                    <div class="mb-5 py-2  border-top ">
                        <h6 class="d-inline-block">Advice:</h6> {{resultData.advice}}
                        <div class="" v-for="(rs,i) in resultData.recommendedTests" :key="i" >
                            {{rs.service.name}}
                        </div>
                    </div>

                    <div class="pt-4">
                        <div class="col-md-2 offset-md-10 text-center border-top border-dark py-1">Doctor</div>
                    </div>
                </div>
            </div>
        </div>
        
    </div>
</template>
<script>
import { PrescriptionService, FeedingRuleService } from '@/services';
import VueHtml2pdf from 'vue-html2pdf'

export default {
    data(){
        return {
            title:'Prescription',
            id: this.$route.params.id,
            patientId:this.$route.params.patientId,
            invoiceId:this.$route.params.invoiceId,
            resultData:{
                center:{name:''},
                prescriptionPatient:{registration:null},
                //recommendedMedicines:[]
                },
           feedingRules:[],    
        }
    },
    mounted(){
        this.fetchFeedingRules();
        if(this.patientId !=undefined && this.invoiceId!=undefined){
            this.fetchPrescriptionByPatientAndInvoice(this.patientId,this.invoiceId);
        }else{
            this.fetchPrescriptionById(this.id);
        } 
        
    },
    methods:{
        fetchPrescriptionById(id){
            (new PrescriptionService()).getPrescriptionById(id).then(result=>{
                this.resultData = result;
                 console.log(this.resultData.recommendedMedicines);
            })
        },
         fetchPrescriptionByPatientAndInvoice(patientId,invoiceId){
            (new PrescriptionService()).getPrescriptionByPatientAndInvoice(patientId,invoiceId).then(result=>{
                this.resultData = result;
                 //console.log(this.resultData.recommendedMedicines);
            })
        },
        showVisitDate(resultData){
            return new Date(resultData.visitDate).toLocaleString().substr(0,10).replace(',','');
        },
        isGb(){
            const patient = this.resultData.prescriptionPatient;
          if(patient.registration!=null){
            return patient.registration.gb
         }
         return false;
      },
       fetchFeedingRules() {
        new FeedingRuleService().getFeedingRules().then(result => {
          this.feedingRules = result;
        });
      },
      showFeedingRule(id){
         const feedingRule =  this.feedingRules.filter(m=>m.id==id);
         return feedingRule[0].rule+' ('+feedingRule[0].feedingTime+')';
      },
      showValue(obj,key){
         if(obj!=undefined){
             return obj[key];
         } 
      },
     
      printPrescription(){
            this.$refs.html2Pdf.generatePdf()
      }
    },
    components: {
        VueHtml2pdf
    }
}
</script>

