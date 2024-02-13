<template>
  <div class="relative mx-auto w-[98%] bg-inherit sm:w-[80%] xl:w-[60%]">
    <div class="my-4 flex items-center justify-between">
      <div class="flex items-center gap-2 text-[--light-text-color] dark:text-[--dark-text-color]">
        <span class="">{{ mode.toUpperCase() }} </span>
        <span v-if="remaining != 0" class="font-[digital] text-xl">{{
          remaining % stepFrequency === 0
            ? formatTime(remaining / stepFrequency)
            : formatTime(Math.ceil(remaining / stepFrequency))
        }}</span>
      </div>
      <TimerThemePicker v-model:timer-color="timerColor" />
    </div>
    <div class="flex justify-center">
      <div>
        <svg
          :width="tVars.widthTimer"
          :height="tVars.heightTimer"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g transform="scale(-1, 1)" class="origin-center">
            <circle
              v-bind:cx="tVars.cx"
              v-bind:cy="tVars.cy"
              v-bind:r="tVars.r + tVars.biggerCircleOffset"
              class="fill-white stroke-gray-200 stroke-2"
            />

            <circle
              v-bind:cx="tVars.cxU"
              v-bind:cy="tVars.cyU"
              v-bind:r="tVars.rSmall"
              :class="`${!(remaining % stepFrequency) && mode === 'rest' ? 'fill-rose-500' : 'fill-stone-400'}`"
            />
            <circle
              v-bind:cx="tVars.cxL"
              v-bind:cy="tVars.cyL"
              v-bind:r="tVars.rSmall"
              class="fill-stone-300"
            />
            <circle
              v-bind:cx="tVars.cxR"
              v-bind:cy="tVars.cyR"
              v-bind:r="tVars.rSmall"
              class="fill-stone-300"
            />
            <circle
              v-bind:cx="tVars.cxD"
              v-bind:cy="tVars.cyD"
              v-bind:r="tVars.rSmall"
              class="fill-stone-300"
            />

            <g :transform="`rotate(-90,${tVars.cx},${tVars.cy})`">
              <circle
                v-bind:cx="tVars.cx"
                v-bind:cy="tVars.cy"
                v-bind:r="tVars.r"
                :style="{ fill: `${timerColor}` }"
                class="stroke-stone-300"
              />
              <path v-bind:d="d_path" class="fill-white transition-colors" />
            </g>
          </g>
        </svg>
        <div class="mt-8 flex h-10 justify-center gap-8">
          <button
            v-if="!isPaused"
            @click="startTimer"
            class="rounded-lg bg-lime-500 p-1 px-3 text-xl font-semibold text-white shadow-md transition-all hover:shadow-lime-600 dark:bg-lime-600"
          >
            {{ isStarted ? 'Restart' : 'Start' }}
          </button>
          <button
            v-else
            @click="continueTimer"
            class="rounded-lg bg-green-400 p-1 px-3 text-xl text-white shadow-md transition-all hover:shadow-green-400 dark:bg-green-600"
          >
            Continue
          </button>
          <button
            v-if="isStarted"
            @click="stopTimer"
            class="rounded-lg bg-red-500 p-1 px-3 text-xl text-white shadow-md transition-all hover:shadow-red-400 dark:bg-red-600"
          >
            Stop
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref, toRaw, watch } from 'vue'
import { stepFrequency, one_minute, getTimerParameters } from '@/workers/helpers'
import TimerThemePicker from '@/components/Home/TimerTheme/TimerThemePicker.vue'
import { useTimesStore } from '@/stores/timesStore'
import { formatTime } from '@/globalHelpers/globalHelpers'

const timesStore = useTimesStore()
const times = timesStore.times

const remaining = ref(times.focus * stepFrequency * one_minute)

const isPaused = ref(false)
const isStarted = ref(false)
const mode = ref('focus')

const timerColor = ref<string>('')

const timerWorker = new Worker(new URL('../workers/timer.ts', import.meta.url), { type: 'module' })
timerWorker.onmessage = (e: any) => {
  x.value = e.data[0]
  y.value = e.data[1]
  remaining.value = e.data[2]
  mode.value = e.data[3]
}

const tVars = ref(getTimerParameters(window.innerWidth))
window.addEventListener('resize', () => {
  tVars.value = getTimerParameters(window.innerWidth)
  timerWorker.postMessage({ type: 'stop' })
  timerWorker.postMessage({
    type: 'start',
    times: { focus: times.focus, rest: times.rest },
    remaining: remaining.value,
    cx: tVars.value.cx,
    cy: tVars.value.cy,
    r: tVars.value.r
  })
})

const x = ref(tVars.value.cx + tVars.value.r)
const y = ref(tVars.value.cy)

const d_path = computed(() => {
  if (y.value <= tVars.value.cy)
    return `M ${tVars.value.cx}, ${tVars.value.cy} L ${tVars.value.cx + tVars.value.r}, ${tVars.value.cy} A ${tVars.value.r},${tVars.value.r} 0 0,0 ${x.value},${y.value} Z`
  else
    return `M ${tVars.value.cx}, ${tVars.value.cy} L ${tVars.value.cx + tVars.value.r}, ${tVars.value.cy} A ${tVars.value.r},${tVars.value.r} 0 1,0 ${x.value},${y.value} Z`
})

watch(times, () => {
  timerWorker.postMessage({ type: 'stop' })
  remaining.value = times.focus * stepFrequency * one_minute
  isStarted.value = false
  isPaused.value = false
  x.value = tVars.value.cx + tVars.value.r
  y.value = tVars.value.cy
})

const startTimer = () => {
  isStarted.value = true
  remaining.value = times.focus * stepFrequency * one_minute
  timerWorker.postMessage({ type: 'stop' })
  timerWorker.postMessage({
    type: 'start',
    times: { focus: times.focus, rest: times.rest },
    remaining: remaining.value,
    mode: 'focus',
    cx: tVars.value.cx,
    cy: tVars.value.cy,
    r: tVars.value.r
  })
}

const continueTimer = () => {
  isPaused.value = false
  timerWorker.postMessage({
    type: 'start',
    times: { focus: times.focus, rest: times.rest },
    remaining: remaining.value,
    cx: tVars.value.cx,
    cy: tVars.value.cy,
    r: tVars.value.r
  })
}

const stopTimer = () => {
  timerWorker.postMessage({ type: 'stop' })
  isPaused.value = true
}

// const onVisibilityHandler = (e: any) => {
//   if (document.visibilityState === 'hidden') {
//     if (!isPaused.value && isStarted.value) {
//       clearInterval(timer)
//       timeSwitchedTab = new Date().getTime()
//     }
//   }
//   if (document.visibilityState === 'visible') {
//     if (!isPaused.value && isStarted.value) {
//       const tab
//     }
//   }
// }

// onMounted(() => {
//   addEventListener('visibilitychange', onVisibilityHandler)
// })
// onUnmounted(() => {
//   removeEventListener('visibilitychange', onVisibilityHandler)
// })
</script>

<style>
.sh {
  box-shadow: -3px 11px 5px 0px rgba(0, 0, 0, 0.75);
}
@font-face {
  font-family: digital;
  src: url('@/assets/digital-7.ttf');
}
</style>
