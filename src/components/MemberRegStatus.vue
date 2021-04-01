<template>
     <div class="col-md-5 text-right">
                <div>
                    <span class="w-50 d-inline-block"> NCH:</span> <Status :type="1" :data="nch"/>
                </div>
                <div>
                        <span class="w-50 d-inline-block">CH-GB:</span> <Status :type="1" :data="chgb"/>
                </div>

                <div>
                        <span class="w-50 d-inline-block">CH-NGB:</span> <Status :type="1" :data="chngb"/>
                </div>
            
        </div>
</template>


<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class MemberRegStatus extends Vue {
    @Prop() private nch!: any;
    @Prop() private chgb!: any;
    @Prop() private chngb!: any;

}
</script>