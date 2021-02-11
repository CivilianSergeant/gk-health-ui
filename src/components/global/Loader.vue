<template>
    <div  class="col-md-12 d-flex justify-content-center">
        <span  class="badge badge-info px-2 py-2">Loading ...</span>
      </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Loader extends Vue {
    name="Loader"
}
</script>

