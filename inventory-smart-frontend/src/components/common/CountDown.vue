<template>
  <div class="mb-10">
    <div
      class="flex flex-wrap justify-center gap-1 mb-2 font-bold text-title-md text-brand-500 dark:text-brand-400 xl:text-title-lg"
    >
      <!-- timer days -->
      <div v-for="(day, index) in daysArray" :key="index">
        <div v-show="day.visible" class="timer-box">
          <span>{{ day.value }}</span>
        </div>
      </div>

      :

      <!-- timer hours -->
      <div v-for="(hour, index) in hoursArray" :key="index">
        <div v-show="hour.visible" class="timer-box">
          <span>{{ hour.value }}</span>
        </div>
      </div>

      :

      <!-- timer minutes -->
      <div v-for="(minute, index) in minutesArray" :key="index">
        <div v-show="minute.visible" class="timer-box">
          <span>{{ minute.value }}</span>
        </div>
      </div>

      :

      <!-- timer seconds -->
      <div v-for="(second, index) in secondsArray" :key="index">
        <div v-show="second.visible" class="timer-box">
          <span>{{ second.value }}</span>
        </div>
      </div>
    </div>

    <div class="text-base text-center text-gray-500 dark:text-gray-400">
      <div class="flex justify-center gap-0.5">
        <div v-for="(day, index) in daysArray" :key="index">
          <span v-show="day.visible" class="inline-block timer-box">
            <span class="inline-block">{{ day.value }}</span>
          </span>
        </div>

        <div>days left</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface TimeArrayItem {
  value: string
  visible: boolean
  remainingPercentage: number
}

type TimeUnit = 'days' | 'hours' | 'minutes' | 'seconds'

const daysArray = ref<TimeArrayItem[]>([])
const hoursArray = ref<TimeArrayItem[]>([])
const minutesArray = ref<TimeArrayItem[]>([])
const secondsArray = ref<TimeArrayItem[]>([])

const endTime = new Date(
  'December 20, 2025 23:59:59 GMT+0530'
).getTime()

const now = ref<number>(new Date().getTime())
const timeLeft = ref<number>(0)

let counter: ReturnType<typeof setInterval> | null = null

const countdown = () => {
  counter = setInterval(() => {
    now.value = new Date().getTime()
    timeLeft.value = (endTime - now.value) / 1000

    updateTimeArrays()

    if (timeLeft.value <= 0) {
      if (counter) {
        clearInterval(counter)
        counter = null
      }

      resetTimeArrays()
    }
  }, 1000)
}

const format = (value: number): string => {
  if (value < 10) {
    return '0' + Math.floor(value)
  }

  return Math.floor(value).toString()
}

const updateTimeArrays = () => {
  daysArray.value = getTimeArray(
    timeLeft.value / (60 * 60 * 24),
    'days'
  )

  hoursArray.value = getTimeArray(
    (timeLeft.value / (60 * 60)) % 24,
    'hours'
  )

  minutesArray.value = getTimeArray(
    (timeLeft.value / 60) % 60,
    'minutes'
  )

  secondsArray.value = getTimeArray(
    timeLeft.value % 60,
    'seconds'
  )
}

const getMaxValueForUnit = (unit: TimeUnit): number => {
  switch (unit) {
    case 'days':
      return 365

    case 'hours':
      return 24

    case 'minutes':
      return 60

    case 'seconds':
      return 60

    default:
      return 1
  }
}

const getTimeArray = (
  value: number,
  unit: TimeUnit
): TimeArrayItem[] => {
  const stringValue = format(value)

  const percentage =
    (value / getMaxValueForUnit(unit)) * 100

  return stringValue.split('').map((digit) => ({
    value: digit,
    visible: true,
    remainingPercentage: percentage,
  }))
}

const resetTimeArrays = () => {
  daysArray.value = [
    {
      value: '0',
      visible: true,
      remainingPercentage: 0,
    },
  ]

  hoursArray.value = [
    {
      value: '0',
      visible: true,
      remainingPercentage: 0,
    },
  ]

  minutesArray.value = [
    {
      value: '0',
      visible: true,
      remainingPercentage: 0,
    },
  ]

  secondsArray.value = [
    {
      value: '0',
      visible: true,
      remainingPercentage: 0,
    },
  ]
}

onMounted(() => {
  countdown()
})

onUnmounted(() => {
  if (counter) {
    clearInterval(counter)
    counter = null
  }
})
</script>