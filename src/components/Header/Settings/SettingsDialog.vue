<template>
  <!-- <div class="fixed inset-0 flex items-center justify-center">
    <button
      type="button"
      @click="openModal"
      class="rounded-md bg-black/20 px-4 py-2 text-sm font-medium text-white hover:bg-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
    >
      Open dialog
    </button>
  </div> -->
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="closeModal" class="relative z-10">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/25" />
      </TransitionChild>
      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="dg w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-xl transition-all"
            >
              <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                Timer settings (max 180 min)
              </DialogTitle>
              <form @submit="onSubmit">
                <div class="mt-4 flex justify-between">
                  <div class="flex w-[130px] flex-col gap-1 xs:w-[180px]">
                    <label for="timeFocus">Focus</label>
                    <input
                      id=""
                      v-model="focus"
                      type="number"
                      name="timeFocus"
                      max="180"
                      min="1"
                      class="rounded-md bg-blue-300/25 p-1 pl-2 outline-none invalid:bg-red-400/25"
                    />
                  </div>
                  <div class="flex w-[130px] flex-col gap-1 xs:w-[180px]">
                    <label for="timeRest">Rest</label>
                    <input
                      v-model="rest"
                      type="number"
                      name="timeRest"
                      max="180"
                      min="1"
                      id=""
                      class="rounded-md bg-blue-300/25 p-1 pl-2 outline-none invalid:bg-red-400/25"
                    />
                  </div>
                </div>
                <div class="mt-4">
                  <button
                    type="submit"
                    :disabled="focus.toString().length === 0 || rest.toString().length === 0"
                    class="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-normal text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:bg-gray-300"
                  >
                    Save !
                  </button>
                </div>
              </form>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'
import { useTimesStore } from '@/stores/timesStore'

defineProps<{
  isOpen: boolean
}>()
const emit = defineEmits(['update:isOpen'])

const timesStore = useTimesStore()

const focus = ref(timesStore.times.focus)
const rest = ref(timesStore.times.rest)

watch([focus, rest], () => {})

const closeModal = () => {
  emit('update:isOpen', false)
}

const onSubmit = (e: any) => {
  e.preventDefault()
  timesStore.times.focus = focus.value
  timesStore.times.rest = rest.value
  localStorage.setItem(
    'mineeSettings',
    JSON.stringify({
      focus: focus.value,
      rest: rest.value
    })
  )
  emit('update:isOpen', false)
}
</script>

<style scoped>
@media (pointer: coarse) {
  .dg {
    position: absolute;
    top: 18%;
  }
}
</style>
