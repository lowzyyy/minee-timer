<template>
  <div class="relative z-20 w-36">
    <Listbox v-model="selectedColor">
      <ListboxButton
        class="relative flex w-full items-center rounded-xl py-2 pl-3 pr-2 outline-none"
        :style="{ backgroundColor: `${selectedColor.code}` }"
        >{{ selectedColor.name }}
        <PhCaretUpDown size="14" class="absolute right-2" />
      </ListboxButton>
      <transition
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="transform  opacity-0"
        enter-to-class="transform opacity-100"
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <ListboxOptions
          class="absolute my-1 w-full outline-none first:[&>li]:rounded-t-md last:[&>li]:rounded-b-md"
        >
          <ListboxOption
            v-for="color in colors"
            :key="color.id"
            :value="color"
            :style="{ backgroundColor: `${color.code}` }"
          >
            <li class="px-2 py-1">
              {{ color.name }}
            </li>
          </ListboxOption>
        </ListboxOptions>
      </transition>
    </Listbox>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, watch } from 'vue'
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'
import { PhCaretUpDown } from '@phosphor-icons/vue'

defineProps<{ timerColor: string }>()
const emit = defineEmits(['update:timerColor'])

const colors = [
  { id: 0, name: 'Pastel Marine', code: '#a2bcd3' },
  { id: 1, name: 'Yellow', code: '#f7bc18' },
  { id: 2, name: 'Aqua mint', code: '#b4d7d2' },
  { id: 3, name: 'Cherry Red', code: '#c5234e' },
  { id: 4, name: 'Indie Pink', code: '#fcccda' },
  { id: 5, name: 'Lilac Snow', code: '#dac9e8' },
  { id: 6, name: 'Cocoa Beige', code: '#cdc0bc' }
]
const selectedColor = ref(colors[0])
watch(selectedColor, () => {
  localStorage.setItem('mineeTimerTheme', JSON.stringify(selectedColor.value.id))
  emit('update:timerColor', selectedColor.value.code)
})

onBeforeMount(() => {
  const mineeTimerTheme = localStorage.getItem('mineeTimerTheme')
  if (mineeTimerTheme) {
    const i = +mineeTimerTheme
    selectedColor.value = colors[i]
    emit('update:timerColor', colors[i].code)
  } else emit('update:timerColor', selectedColor.value.code)
})
</script>
