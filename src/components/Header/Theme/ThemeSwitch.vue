<template>
  <!-- Use the `checked` state to conditionally style the button. -->
  <Switch v-model="enabled" as="template" v-slot="{ checked }">
    <button
      class="relative inline-flex h-7 w-12 items-center rounded-full"
      :class="checked ? 'bg-[#446f81]' : 'bg-sky-200'"
    >
      <span class="sr-only">Theme switcher</span>
      <span
        :class="`${checked ? 'translate-x-6 bg-[--bg-header-color-dark]' : 'translate-x-1 bg-sky-500 '}`"
        class="flex h-5 w-5 transform items-center justify-center rounded-full transition"
      >
        <PhMoon v-if="checked" weight="fill" />
        <PhSun v-else weight="fill" class="text-yellow-50" />
      </span>
    </button>
  </Switch>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, watch } from 'vue'
import { Switch } from '@headlessui/vue'
import { PhMoon, PhSun } from '@phosphor-icons/vue'

const enabled = ref(false)
watch(enabled, () => {
  document.documentElement.classList.toggle('dark')
  localStorage.setItem(
    'mineeWebsiteTheme',
    `${document.documentElement.classList.contains('dark') ? 'dark' : 'light'}`
  )
})

onBeforeMount(() => {
  const mineeWebsiteTheme = localStorage.getItem('mineeWebsiteTheme')
  if (!mineeWebsiteTheme) enabled.value = false
  else enabled.value = mineeWebsiteTheme === 'dark' ? true : false
})
</script>
