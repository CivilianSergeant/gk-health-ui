import {
    PatientInvoiceService,
    HealthService,
    FeedingRuleService,
    MedicineService,
    PrescriptionService
  } from "@/services";
  import PatientInfo from '@/components/patientInfo/PatientInfo.vue'
  export default {
    name: "Home",
    data() {
      return {
        title: "Prescription",
        notFound: false,
        patient: null,

        prescription:{
          id:null,
          symptoms:'',
          advice:'',
          generalExamination:{
            bloodPressure:'',
            pulse:'',
            tempurature:'',
            weight:'',
            pae:''
          },
          familyHistory:{
            dm:false,
            htn:false,
            asthma:false,
            tb:false
          },
          personalHistory:{
            dm:false,
            htn:false,
            asthma:false,
            tb:false,
            pud:false,
            previousHistory:'',
          },
          patientInvoice: {},
          prescriptionPatient: {},
          doctor: {},
          visitDate:new Date(),
          nextVisitDate:"",
          new:true
        },

        tests: [],
        invoices: [],
        attributes: [],
        recommendedTests: [],
        feedingRules: [],
        medicines: [],
        recommendedMedicines:[],
        selectedMedicineRow:[],

        invoice: null,
        serviceAutocomplete: null,
        invoiceAutocomplete: null,
        service: null,
        durationUnits: [
          {value:'days', text:'Days'},
          {value:'months', text:'Months'}
        ],
        form: {
          cardRegistration: {
            members: [],
            gb: false,
            startDate: "",
            expiredDate: "",
            validityDuration: 0
          }
        }
      };
    },
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
      }
    },
    mounted() {
      this.$store.commit("clearMessage");
      
      this.fetchLabServices();
      this.fetchFeedingRules();
      this.fetchMedicines();
    },
    components:{
      PatientInfo
    },
    methods: {
      isPaid(d){
        console.log(d);
        return (this.invoice.paidAmount < d.payableAmount)? 'NOT PAID' : 'PAID'
      },
      addMedicine(){
        const medicine = {
          medicine:{},
          rule:'',
          duration:'',
          durationUnit:''
        }
        this.recommendedMedicines.push(medicine);
        this.selectedMedicineRow.push({autocomplete:null})
      },
      removeAttribute(rt, i) {
        rt.attributes.splice(i, 1);
      },
  
      isTestAddedToList(service, showMessage) {
        let valid = true;
        this.recommendedTests.map(ps => {
          if (ps.code == service.code) {
            valid = false;
          }
          return ps;
        });
  
        if (!valid) {
          if (showMessage) {
            this.$store.commit(
              "setErrorMsg",
              "Test [" + service.name + "] already added to the list"
            );
            window.scrollTo(0, 0);
          }
  
          this.$bvModal.hide("modal-1");
          return valid;
        }
        return valid;
      },
  
      addRequiredTest() {
        if (this.service == null) {
          return;
        }
  
        if (!this.isTestAddedToList(this.service, true)) {
          this.service = null;
          this.clearTestSelection();
          return;
        }
  
        this.recommendedTests.push({
          service:{
            serviceId:this.service.serviceId,
            name:this.service.name
          },
          prescription: {}
          // attributes: (this.service.labTestAttributes.map(s => {
          //   const attribute = {labTestAttribute: {id:s.id,attributeName:s.attributeName}}
          //   return (!s.group)? attribute:null;
          // })).filter(s=>s!=null)
        });
        this.clearTestSelection();
      },
      clearTestSelection() {
        this.service = null;
        if (this.serviceAutocomplete.setInputValue != undefined) {
          this.serviceAutocomplete.setInputValue("");
        }
      },
     
      handleAutocomplete(service, autocomplete) {
        this.service = service;
        this.serviceAutocomplete = autocomplete;
        this.fetchServiceDetail();
      },
      handleInvoiceNumberAutocomplete(invoice, autocomplete) {
        new PatientInvoiceService().getInvoiceById(invoice.id).then(result => {
          this.invoice = result;
          this.patient = this.invoice.patient;
          this.prescription.doctor = this.$store.getters.employee;
          this.prescription.center = this.$store.getters.center;
          this.prescription.patientInvoice = {id:this.invoice.id}
          this.prescription.prescriptionPatient = {id:this.patient.id}
          
          this.recommendedMedicines = [];
          this.addMedicine();
          this.addMedicine();
          this.addMedicine();
          this.invoiceAutocomplete = autocomplete;
        });
      },
      handleInvoiceNumberAjaxCall(searchText) {
        if (searchText.length >= 2) {
          new PatientInvoiceService()
            .getInvoiceNumbers(searchText)
            .then(result => {
              this.invoices = result.collection;
            });
        }
      },
      handleMedicineAutocomplete(medicine,autocomplete,index,rowIndex){
        this.recommendedMedicines[rowIndex].medicine = {id:medicine.id,name:medicine.name};
        this.selectedMedicineRow[rowIndex].autocomplete = autocomplete;
      },
      onClearSearch() {
        this.patient = null;
        this.invoice = null;
        this.service = null;
  
        this.$store.commit("clearMessage");
        if(this.$refs.Fileuploader){
          this.$refs.Fileuploader.reset();
        }
        if (this.invoiceAutocomplete != undefined) {
          this.invoiceAutocomplete.setInputValue("");
        }
  
        
      },
      fetchFeedingRules() {
        new FeedingRuleService().getFeedingRules().then(result => {
          result.forEach(r=> this.feedingRules.push({value: r.id,text: r.rule + ' ' + r.feedingTime}))
        });
      },
      fetchMedicines() {
        new MedicineService().getMedicines().then(result => {
          this.medicines = result;
        });
      },
      fetchServiceDetail() {
        new HealthService()
          .findServicesById(this.service.serviceId)
          .then(result => {
            this.service = result;
            this.$store.commit("finish");
          });
      },
      fetchLabServices() {
        this.$store.commit("start");
        new HealthService().getLabServices().then(result => {
          this.$store.commit("finish");
          this.tests = result;
        });
      },
      onSearch() {
        this.patient = null;
  
        this.$store.commit("clearMessage");
      },
      onSubmitPrescription(){
        this.prescription.recommendedTests= this.recommendedTests;
        this.prescription.recommendedMedicines=this.recommendedMedicines;
        
          
        console.log(this.prescription);
        (new PrescriptionService()).savePrescription(this.prescription).then(result=>console.log(result));
      },
      deleteTest(index){
        this.recommendedTests.splice(index,1);
      },
      deleteMedicine(index){
        console.log("test");
        this.recommendedMedicines.splice(index,1);
      }
    }
  };