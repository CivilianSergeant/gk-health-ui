<template>
    <span>
        <span v-if="type==1">
            <input type="checkbox" checked v-if="data" />
           <input type="checkbox" v-if="!data" />
        </span>
        
        <span v-if="type==undefined">
            <span class="badge badge-success" v-if="data">Yes</span>
            <span class="badge badge-danger" v-if="!data">No</span>
        </span>
         
    </span>
    
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class Status extends Vue {

    @Prop()data!: boolean;
    @Prop()type!: number;
}
</script>