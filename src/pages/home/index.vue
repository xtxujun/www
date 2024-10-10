<script setup lang="ts">
import MainHeader from './components/MainHeader.vue'
import MainClock from './components/MainClock.vue'
import MainSearch from './components/MainSearch.vue'
import SiteContainer from './components/SiteContainer.vue'
import MainSetting from './components/MainSetting.vue'

defineOptions({
  name: 'HomePage',
})

const settingStore = useSettingStore()
</script>

<template>
  <TheDoc>
    <div p="12 sm:24" bg="$main-bg-c" w="full sm:auto" :class="{ no_select: settingStore.isSetting }" style="height: 100vh">
      <MainHeader />
      <MainClock v-if="!settingStore.isSetting" />
      <MainSearch v-if="!settingStore.isSetting" my-24 />
      <SiteContainer />
      <MainSetting />
      <TheFooter />
    </div>
  </TheDoc>
</template>

<route lang="json">
{
  "path": "/",
  "children": [
    {
      "name": "setting",
      "path": "setting",
      "component": "@/components/Blank.vue"
    }
  ]
}
</route>
