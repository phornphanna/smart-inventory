<template>
  <FullScreenLayout>
    <div class="relative min-h-screen bg-white dark:bg-gray-900">
      <div class="flex min-h-screen flex-col lg:flex-row">

        <!-- ================= LEFT SIDE ================= -->
        <div
          class="flex w-full flex-1 flex-col px-6 py-8 sm:px-10 lg:w-1/2 lg:px-16"
        >
          <!-- Back -->
          <div class="w-full max-w-md mx-auto">
            <router-link
              to="/forgot-password"
              class="inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-400"
            >
              <i class="bi bi-arrow-left"></i>
              Back to Forgot Password
            </router-link>
          </div>

          <!-- Main -->
          <div
            class="flex flex-1 items-center justify-center w-full max-w-md mx-auto"
          >
            <div class="w-full">

              <!-- ================= HEADER ================= -->
              <div class="mb-8 text-center">

                <!-- Icon -->
                <div
                  class="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 dark:bg-brand-500/10"
                >
                  <i
                    class="bi bi-shield-lock text-3xl text-brand-500 dark:text-brand-400"
                  ></i>
                </div>

                <h1
                  class="mb-3 text-2xl font-semibold text-gray-800 dark:text-white/90"
                >
                  Verify Your Email
                </h1>

                <p
                  class="mx-auto max-w-sm text-sm leading-6 text-gray-500 dark:text-gray-400"
                >
                  Enter the 6-digit verification code we sent to your email
                  address.
                </p>

                <!-- Email -->
                <div
                  v-if="authStore.resetEmail"
                  class="mt-4 flex items-center justify-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  <i class="bi bi-envelope text-brand-500"></i>

                  <span>
                    {{ authStore.resetEmail }}
                  </span>
                </div>
              </div>

              <!-- ================= OTP CARD ================= -->
              <div
                class="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900 sm:p-8"
              >
                <form @submit="onSubmit">
                  <div class="space-y-6">

                    <!-- OTP INPUT -->
                    <div>
                      <label
                        for="otp"
                        class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Verification Code
                        <span class="text-error-500">*</span>
                      </label>

                      <input
                        id="otp"
                        v-model="otp"
                        name="otp"
                        type="text"
                        inputmode="numeric"
                        maxlength="6"
                        autocomplete="one-time-code"
                        placeholder="000000"
                        @input="handleOtpInput"
                        class="h-14 w-full rounded-xl border bg-transparent px-4 text-center text-2xl font-semibold tracking-[0.45em] text-gray-800 outline-none transition placeholder:text-gray-300 focus:ring-4 dark:text-white/90 dark:placeholder:text-gray-700"
                        :class="
                          otpError
                            ? 'border-error-500 focus:border-error-500 focus:ring-error-500/10'
                            : 'border-gray-300 focus:border-brand-500 focus:ring-brand-500/10 dark:border-gray-700 dark:focus:border-brand-500'
                        "
                      />

                      <!-- Error -->
                      <p
                        v-if="otpError"
                        class="mt-2 flex items-center gap-1 text-sm text-error-500"
                      >
                        <i class="bi bi-exclamation-circle"></i>
                        {{ otpError }}
                      </p>
                    </div>

                    <!-- VERIFY BUTTON -->
                    <button
                      type="submit"
                      :disabled="authStore.loading || !canVerify"
                      class="flex h-12 w-full items-center justify-center rounded-xl bg-brand-500 px-4 text-sm font-semibold text-white shadow-theme-xs transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <span
                        v-if="authStore.loading"
                        class="flex items-center gap-2"
                      >
                        <i class="bi bi-arrow-repeat animate-spin text-lg"></i>
                        Verifying...
                      </span>

                      <span
                        v-else
                        class="flex items-center gap-2"
                      >
                        <i class="bi bi-shield-check"></i>
                        Verify OTP
                      </span>
                    </button>

                    <!-- RESEND -->
                    <div class="text-center">
                      <p class="text-sm text-gray-500 dark:text-gray-400">
                        Didn't receive the code?
                      </p>

                      <button
                        type="button"
                        :disabled="
                          resendLoading ||
                          resendCooldown > 0
                        "
                        @click="handleResendOtp"
                        class="mt-2 text-sm font-medium text-brand-500 transition hover:text-brand-600 disabled:cursor-not-allowed disabled:opacity-50 dark:text-brand-400 dark:hover:text-brand-300"
                      >
                        <span v-if="resendLoading">
                          <i
                            class="bi bi-arrow-repeat mr-1 animate-spin"
                          ></i>
                          Sending...
                        </span>

                        <span v-else-if="resendCooldown > 0">
                          Resend OTP in {{ resendCooldown }}s
                        </span>

                        <span v-else>
                          Resend OTP
                        </span>
                      </button>
                    </div>

                    <!-- CHANGE EMAIL -->
                    <div class="border-t border-gray-100 pt-5 text-center dark:border-gray-800">
                      <router-link
                        to="/forgot-password"
                        class="text-sm text-gray-500 transition hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-400"
                      >
                        <i class="bi bi-pencil mr-1"></i>
                        Use a different email
                      </router-link>
                    </div>

                  </div>
                </form>
              </div>

              <!-- SECURITY INFO -->
              <div
                class="mt-6 flex items-start gap-3 rounded-xl bg-gray-50 p-4 dark:bg-white/[0.03]"
              >
                <i
                  class="bi bi-shield-check mt-0.5 text-lg text-brand-500"
                ></i>

                <p
                  class="text-xs leading-5 text-gray-500 dark:text-gray-400"
                >
                  Never share your verification code with anyone. This code
                  is only used to verify your password reset request.
                </p>
              </div>

            </div>
          </div>
        </div>

        <!-- ================= RIGHT SIDE ================= -->
        <div
          class="relative hidden min-h-screen w-1/2 overflow-hidden bg-brand-950 lg:block"
        >
          <img
            src="/images/logo/signin.png"
            alt="Smart Inventory"
            class="absolute inset-0 h-full w-full object-cover"
          />

          <!-- Overlay -->
          <div
            class="absolute inset-0 bg-brand-950/50"
          ></div>

          <!-- Right Content -->
          <div
            class="relative z-10 flex h-full items-center justify-center px-12"
          >
            <div class="max-w-md text-center text-white">

              <div
                class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm"
              >
                <i class="bi bi-shield-check text-4xl"></i>
              </div>

              <h2 class="mb-4 text-3xl font-semibold">
                Verify Your Identity
              </h2>

              <p class="text-sm leading-7 text-white/70">
                We've sent a secure verification code to your email.
                Verify the code to continue resetting your password.
              </p>

            </div>
          </div>
        </div>

      </div>
    </div>
  </FullScreenLayout>
</template>


<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

import { useAuthStore } from '@/stores/authStore'
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue'

// =====================================================
// STORE / ROUTER / TOAST
// =====================================================

const authStore = useAuthStore()
const router = useRouter()
const toast = useToast()

// =====================================================
// VALIDATION
// =====================================================

const schema = yup.object({
  otp: yup
    .string()
    .required('OTP is required')
    .matches(
      /^\d{6}$/,
      'OTP must be exactly 6 digits'
    ),
})

const { handleSubmit } = useForm({
  validationSchema: schema,
})

// =====================================================
// OTP FIELD
// =====================================================

const {
  value: otp,
  errorMessage: otpError,
} = useField<string>('otp', undefined, {
  initialValue: '',
})

// =====================================================
// OTP INPUT
// =====================================================

const handleOtpInput = () => {
  otp.value = (otp.value || '')
    .replace(/\D/g, '')
    .slice(0, 6)
}

// =====================================================
// BUTTON STATE
// =====================================================

const canVerify = computed(() => {
  return /^\d{6}$/.test(otp.value || '')
})

// =====================================================
// VERIFY OTP
// =====================================================

const onSubmit = handleSubmit(async (values) => {
  try {
     const email = sessionStorage.getItem('forgotEmail')

    if (!email) {
      toast.error(
        'Email information is missing.'
      )
      router.push('/forgot-password')
      return
    }

 const result =    await authStore.verifyOtp(  email,
      values.otp
    )
     console.log(result);
    if(!result.success){
        toast.error(result.message)
    } else {
       sessionStorage.setItem('forgotEmail', result.data.email);
       sessionStorage.setItem('otpVerified' , values.otp);
      toast.success(
      'OTP verified successfully.'
    )
    router.push('/new-password')
    }
   

  } catch {
    toast.error(
      authStore.error ||
      'Invalid OTP. Please try again.'
    )
  }
})

// =====================================================
// RESEND OTP
// =====================================================

const resendLoading = ref(false)
const resendCooldown = ref(0)

let cooldownTimer:
  ReturnType<typeof setInterval> | null = null

const handleResendOtp = async () => {
  const email = authStore.resetEmail

  if (!email) {
    toast.error(
      'Email information is missing.'
    )

    router.push('/forgot-password')
    return
  }

  try {
    resendLoading.value = true

    /*
     * Replace this with your real API:
     *
     * await authStore.resendOtp(email)
     */

    await new Promise((resolve) => {
      setTimeout(resolve, 800)
    })

    toast.success(
      'A new verification code has been sent.'
    )

    // Start cooldown
    resendCooldown.value = 60

    cooldownTimer = setInterval(() => {
      resendCooldown.value--

      if (resendCooldown.value <= 0) {
        if (cooldownTimer) {
          clearInterval(cooldownTimer)
          cooldownTimer = null
        }
      }
    }, 1000)

  } catch {
    toast.error(
      authStore.error ||
      'Unable to resend OTP.'
    )
  } finally {
    resendLoading.value = false
  }
}

// =====================================================
// CLEANUP
// =====================================================

onUnmounted(() => {
  if (cooldownTimer) {
    clearInterval(cooldownTimer)
  }
})
</script>