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

          <circle
            v-bind:cx="tVars.cx"
            v-bind:cy="tVars.cy"
            v-bind:r="tVars.r"
            :style="{ fill: `${timerColor}` }"
            class="stroke-stone-300"
          />
          <path
            :transform="`rotate(-90,${tVars.cx},${tVars.cy}) `"
            v-bind:d="d_path"
            class="fill-stone-100 transition-colors"
          />
        </svg>
        <div class="mt-8 flex h-10 justify-center gap-8">
          <button
            v-if="!isPaused"
            @click="startTimer"
            class="rounded-lg bg-lime-500 p-1 px-3 text-xl font-semibold text-white shadow-md transition-all dark:bg-lime-600 sm:hover:shadow-lime-600"
          >
            {{ isStarted ? 'Restart' : 'Start' }}
          </button>
          <button
            v-else
            @click="continueTimer"
            class="rounded-lg bg-green-400 p-1 px-3 text-xl text-white shadow-md transition-all dark:bg-green-600 sm:hover:shadow-green-400"
          >
            Continue
          </button>
          <button
            v-if="isStarted"
            @click="stopTimer"
            class="rounded-lg bg-red-500 p-1 px-3 text-xl text-white shadow-md transition-all dark:bg-red-600 sm:hover:shadow-red-400"
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
import focusSound from '@/assets/sound/focus.mp3'
import restSound from '@/assets/sound/rest.mp3'

const audioFocus = new Audio(focusSound)
const audioRest = new Audio(restSound)

const timesStore = useTimesStore()
const times = timesStore.times

const remaining = ref(times.focus * stepFrequency * one_minute)

const isPaused = ref(false)
const isStarted = ref(false)
const mode = ref('focus')
const prevMode = ref('')

const timerColor = ref<string>('')

const timerWorker = new Worker(new URL('../workers/timer.ts', import.meta.url), { type: 'module' })
timerWorker.onmessage = async (e: any) => {
  x.value = e.data[0]
  y.value = e.data[1]
  remaining.value = e.data[2]
  mode.value = e.data[3]
  if ((prevMode.value === '' || prevMode.value === 'rest') && mode.value === 'focus') {
    await audioFocus.play()
  } else if (prevMode.value === 'focus' && mode.value === 'rest') {
    await audioRest.play()
  }
  prevMode.value = mode.value
}

const tVars = ref(getTimerParameters(window.innerWidth))
window.addEventListener('resize', () => {
  tVars.value = getTimerParameters(window.innerWidth)
  timerWorker.postMessage({ type: 'stop' })
  if (isStarted.value)
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
    return `M ${tVars.value.cx}, ${tVars.value.cy} L ${tVars.value.cx + tVars.value.r}, ${tVars.value.cy} A ${tVars.value.r},${tVars.value.r} 0 1,1 ${x.value},${y.value} Z`
  else
    return `M ${tVars.value.cx}, ${tVars.value.cy} L ${tVars.value.cx + tVars.value.r}, ${tVars.value.cy} A ${tVars.value.r},${tVars.value.r} 0 0,1 ${x.value},${y.value} Z`
})

watch(times, () => {
  timerWorker.postMessage({ type: 'stop' })
  remaining.value = times.focus * stepFrequency * one_minute
  isStarted.value = false
  isPaused.value = false
  prevMode.value = ''
  x.value = tVars.value.cx + tVars.value.r
  y.value = tVars.value.cy
})

const startTimer = () => {
  prevMode.value = ''
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
