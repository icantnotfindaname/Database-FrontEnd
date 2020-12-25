<template>
<div>
  <MHeader></MHeader>
  <router-view> </router-view>
</div>
  
</template>

<script>
import MHeader from "@/common/MHeader";
export default {
  components:{
    MHeader
  } 
}
</script>

<style>

</style>