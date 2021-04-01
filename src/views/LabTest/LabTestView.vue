<template>
    <div>
         <h5 class="text-center mt-3">Center: {{getCenterName}} <a @click="printPrescription()"  class="btn btn-sm btn-primary cursor-pointer"><b-icon-printer></b-icon-printer></a></h5>
        <div class="row">
            <div class="col-md-6">
                SL: {{resultData.id}}<br/>
                Date: {{showCreatedDate(resultData)}}
            </div>
            <div class="col-md-6">
                 <!-- <div>
                    <span class="w-50 d-inline-block"> NCH:</span> <Status :type="1" :data="!resultData.prescriptionPatient.registration"/>
                </div>
                <div>
                        <span class="w-50 d-inline-block">CH-GB:</span> <Status :type="1" :data="isGb()"/>
                </div>

                <div>
                        <span class="w-50 d-inline-block">CH-NGB:</span> <Status :type="1" :data="resultData.prescriptionPatient.registration && (!isGb())"/>
                </div> -->
            </div>
        </div>
        <div class="row  py-3">
            <div class="col-md-3 offset-md-4"><h6 class="text-center border p-2">{{resultData.service.name}}</h6></div>
        </div>
         <div class="row"  v-if="resultData.patient">
            <div class="col-md-6">Patient's Name: {{resultData.patient.fullName}}</div>
            <div class="col-md-3">Age: {{resultData.patient.age}}</div>
            <div class="col-md-3">Sex: {{resultData.patient.gender}}</div>
        </div>
        <div class="row  py-2" v-if="resultData.specimen">
            <div class="col-md-6">Specimen: {{resultData.specimen.name}}</div>
            <!-- <div class="col-md-6">Refd.by: .............</div> -->
        </div> 
        <table class="table table-bordered" v-if="service">
                <thead class="thead-light">
                <tr>
                    <th width="400">Test</th>
                    <th>Result</th>
                    <th>Reference Value</th>
                </tr>
            </thead>

              <tbody>
                     <tr v-for="(td,i) in service.labTestAttributes" :key="i">
                         <td v-if="td.group" colspan="3"><strong>{{td.attributeName}}</strong></td>
                         <td v-if="!td.group">{{td.attributeName}}</td>
                         <td v-if="!td.group">  <span class="pl-4">{{showResult(td)}}</span></td>
                         <td v-if="!td.group" v-html="showRange(td)"></td>
                     </tr>
              </tbody>
        </table>
    </div>
</template>

<script>

import {LabTestService, HealthService}  from "@/services";
import VueHtml2pdf from 'vue-html2pdf';

export default{
     data(){
         return{
             title:"Lab Test Report",
             id:0,
             service:null,
            resultData:{
                service:{name:null}
            },
         }
     },
     computed:{
            getCenterName(){
                return this.$store.getters.center.name;
            }
     },
     mounted(){
            this.id = this.$route.params.id;
            this.fetchLabTestById(this.id);
     },
     methods:{
         fetchLabTestById(id){
              (new LabTestService()).getLabTestById(id).then(result=>{
                this.fetchServiceById(result);
               
            })
         },
         showResult(td){

            const results =  this.resultData.details.filter(m=>m.labTestAttribute.id==td.id);
            console.log(results);
            return results[0].result;
         },
        showRange(attr){
                let range=" ";
                if(attr){
                    if(attr.averageRange){
                        range = attr.averageRange;
                    }
                    if(attr.maleRange){
                        range += "Male: "+attr.maleRange+"<br/>";
                    }
                    if(attr.femaleRange){
                        range += "Female: "+attr.femaleRange+"<br/>";
                    }
                    if(attr.childRange){
                        range += "Child Range: "+attr.childRange+"<br/>";
                    }
                }
                return range;
            },
         fetchServiceById(result){
            this.$store.commit('start');
            (new HealthService()).findServicesById(result.service.serviceId).then(r=>{
                this.service=r;
                
                        this.resultData = result;
                            console.log(this.resultData);
                
                this.$store.commit('finish');
            });
        },
          showCreatedDate(resultData){
            return new Date(resultData.createdAt).toLocaleString().substr(0,10).replace(',','');
        },
        //  printPrescription(){
        //     this.$refs.html2Pdf.generatePdf()
        // }
     },
    //  components: {
    //     VueHtml2pdf
    // }
 }
</script>