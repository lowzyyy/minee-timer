<template>
  <header
    class="flex w-full justify-center bg-[--bg-header-color] text-[--light-text-color] dark:bg-[--bg-header-color-dark] dark:text-[--dark-text-color]"
  >
    <div class="flex w-[95%] items-center justify-between p-2 text-center sm:w-[80%] xl:w-[60%]">
      <span class="text-xl">Minee Online</span>
      <div class="flex items-center gap-4">
        <div class="flex gap-2">
          <PhGear weight="duotone" size="28" @click="showSettings = true" class="cursor-pointer" />
        </div>

        <SettingsDialog :show="showSettings" v-model:isOpen="showSettings" />
        <ThemeSwitch />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { PhGear } from '@phosphor-icons/vue'
import { ref } from 'vue'
import ThemeSwitch from '@/components/Header/Theme/ThemeSwitch.vue'
import SettingsDialog from '@/components/Header/Settings/SettingsDialog.vue'

const showSettings = ref(false)
</script>

<style scoped></style>
