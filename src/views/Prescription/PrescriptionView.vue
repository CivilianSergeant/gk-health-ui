<template>
    <div>
        <h5>Prescription View </h5>
        <p>Please Replace this tags with original data</p>
    </div>
</template>
<script>
import { PrescriptionService } from '@/services';
export default {
    data(){
        return {
            id: this.$route.params.id
        }
    },
    mounted(){
        this.fetchPrescriptionById(this.id)
    },
    methods:{
        fetchPrescriptionById(id){
            (new PrescriptionService()).getPrescriptionById(id).then(result=>{
                console.log(result);
            })
        }
    }
}
</script>

