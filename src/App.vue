<template>
  <HeaderNav />
  <RouterView />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import HeaderNav from './components/Header/HeaderNav.vue'
import { onBeforeMount } from 'vue'
import { useTimesStore } from './stores/timesStore'

const timerStore = useTimesStore()
onBeforeMount(() => {
  const mineeSettings = localStorage.getItem('mineeSettings')
  if (mineeSettings) {
    const mineeSettingsParsed = JSON.parse(mineeSettings)
    timerStore.times.focus = mineeSettingsParsed.focus
    timerStore.times.rest = mineeSettingsParsed.rest
  }
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap');
</style>
