<template>
    <span>
        <span class="badge badge-success" v-if="data">Yes</span>
        <span class="badge badge-danger" v-if="!data">No</span>
    </span>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class Status extends Vue {

    @Prop()data!: boolean;
}
</script>