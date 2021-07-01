<template>
  <div class="col-md-5 text-right">
    <div>
      <span class="w-50 d-inline-block"> GB-NCH:</span>
      <Status :type="1" :data="gbnch" />
    </div>
    <div>
      <span class="w-50 d-inline-block">CH-GB:</span>
      <Status :type="1" :data="gbch" />
    </div>

    <div>
      <span class="w-50 d-inline-block">CH-NGB:</span>
      <Status :type="1" :data="chngb" />
    </div>

    <div>
      <span class="w-50 d-inline-block">NGB-NCH:</span>
      <Status :type="1" :data="ngbnch" />
    </div>
  </div>
</template>


<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class MemberRegStatus extends Vue {
  @Prop() private gbnch!: any;
  @Prop() private gbch!: any;
  @Prop() private chngb!: any;
  @Prop() private ngbnch!: any;
}
</script>