<template>
  <FullScreenLayout>
    <div class="relative min-h-screen bg-white dark:bg-gray-900">
      <div class="flex min-h-screen flex-col lg:flex-row">

        <!-- ================= LEFT SIDE ================= -->
        <div class="flex w-full flex-1 flex-col px-6 py-8 sm:px-10 lg:w-1/2 lg:px-16">
          <!-- Back to Sign In -->
          <div class="w-full max-w-md mx-auto">
            <router-link to="/signin"
              class="inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-400">
              <i class="bi bi-arrow-left"></i>
              Back to Sign In
            </router-link>
          </div>

          <!-- Main Content -->
          <div class="flex flex-1 items-center justify-center w-full max-w-md mx-auto">
            <div class="w-full">

              <!-- Header -->
              <div class="mb-8 text-center">

                <!-- Icon -->
                <div
                  class="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 dark:bg-brand-500/10">
                  <i class="bi bi-key text-3xl text-brand-500 dark:text-brand-400"></i>
                </div>

                <h1 class="mb-3 text-2xl font-semibold text-gray-800 dark:text-white/90">
                  Forgot Password?
                </h1>

                <p class="mx-auto max-w-sm text-sm leading-6 text-gray-500 dark:text-gray-400">
                  Don't worry. Enter your email address and we'll send you
                  a verification code to reset your password.
                </p>
              </div>

              <!-- Form Card -->
              <div
                class="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900 sm:p-8">
                <form @submit="onSubmit">
                  <div class="space-y-6">

                    <!-- Email -->
                    <div>
                      <label for="email" class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email Address
                        <span class="text-error-500">*</span>
                      </label>

                      <div class="relative">
                        <!-- Email Icon -->
                        <span class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                          <i class="bi bi-envelope text-lg"></i>
                        </span>

                        <input id="email" v-model="email" name="email" type="email" autocomplete="email"
                          placeholder="Enter your email address"
                          class="h-12 w-full rounded-xl border bg-transparent pl-11 pr-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:ring-4 dark:text-white/90 dark:placeholder:text-gray-600"
                          :class="emailError
                              ? 'border-error-500 focus:border-error-500 focus:ring-error-500/10'
                              : 'border-gray-300 focus:border-brand-500 focus:ring-brand-500/10 dark:border-gray-700 dark:focus:border-brand-500'
                            " />
                      </div>

                      <!-- Error -->
                      <p v-if="emailError" class="mt-2 flex items-center gap-1 text-sm text-error-500">
                        <i class="bi bi-exclamation-circle"></i>
                        {{ emailError }}
                      </p>
                    </div>

                    <!-- Send OTP -->
                    <button type="submit" :disabled="authStore.loading"
                      class="flex h-12 w-full items-center justify-center rounded-xl bg-brand-500 px-4 text-sm font-semibold text-white shadow-theme-xs transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60">
                      <span v-if="authStore.loading" class="flex items-center gap-2">
                        <i class="bi bi-arrow-repeat animate-spin text-lg"></i>
                        Sending OTP...
                      </span>

                      <span v-else class="flex items-center gap-2">
                        <i class="bi bi-send"></i>
                        Send Verification Code
                      </span>
                    </button>

                    <!-- Back -->
                    <div class="text-center">
                      <router-link to="/signin"
                        class="inline-flex items-center gap-1 text-sm font-medium text-brand-500 transition hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300">
                        <i class="bi bi-arrow-left"></i>
                        Back to Sign In
                      </router-link>
                    </div>

                  </div>
                </form>
              </div>

              <!-- Security Message -->
              <div class="mt-6 flex items-start gap-3 rounded-xl bg-gray-50 p-4 dark:bg-white/[0.03]">
                <i class="bi bi-shield-check mt-0.5 text-lg text-brand-500"></i>

                <p class="text-xs leading-5 text-gray-500 dark:text-gray-400">
                  For your security, we will send a one-time verification
                  code to the email address associated with your account.
                </p>
              </div>

            </div>
          </div>
        </div>

        <!-- ================= RIGHT SIDE ================= -->
        <div class="relative hidden min-h-screen w-1/2 overflow-hidden bg-brand-950 lg:block">
          <img src="/images/logo/signin.png" alt="Smart Inventory"
            class="absolute inset-0 h-full w-full object-cover" />

          <!-- Overlay -->
          <div class="absolute inset-0 bg-brand-950/50"></div>

          <!-- Right Content -->
          <div class="relative z-10 flex h-full items-center justify-center px-12">
            <div class="max-w-md text-center text-white">

              <!-- Icon -->
              <div
                class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
                <i class="bi bi-lock text-4xl"></i>
              </div>

              <h2 class="mb-4 text-3xl font-semibold">
                Reset Your Password
              </h2>

              <p class="text-sm leading-7 text-white/70">
                Enter your registered email address and we'll help you
                securely recover access to your Smart Inventory account.
              </p>

            </div>
          </div>
        </div>

      </div>
    </div>
  </FullScreenLayout>
</template>


<script setup lang="ts">
// import { computed } from 'vue'
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
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address'),
})

const { handleSubmit } = useForm({
  validationSchema: schema,
})

// =====================================================
// EMAIL FIELD
// =====================================================

const {
  value: email,
  errorMessage: emailError,
} = useField<string>('email', undefined, {
  initialValue: '',
})

// =====================================================
// BUTTON STATE
// =====================================================

// const canSubmit = computed(() => {
//   return Boolean(email.value?.trim())
// })

// =====================================================
// SEND OTP
// =====================================================

const onSubmit = handleSubmit(async (values) => {
  try {
    const result = await authStore.forgotPassword(values.email)
    
    if (!result.success) {
      toast.error(result.message)
    } else {
       sessionStorage.setItem('forgotEmail', values.email);
      toast.success('Verification code sent to your email.')
      router.push('/verify-otp')
    }
  } catch {
    toast.error(
      authStore.error || 'Unable to send verification code.'
    )
  }
})
</script>