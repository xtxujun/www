<script setup lang="ts">
import SiteNavBar from './SiteNavBar.vue'
import SiteGroupList from './SiteGroupList.vue'
import SiteModal from './SiteModal.vue'
</script>

<template>
  <div text="$text-c-1" z-8>
    <SiteNavBar />
    <SiteGroupList py-28 style="margin-left: auto; margin-right: auto;" />
    <SiteModal />
  </div>
</template>
