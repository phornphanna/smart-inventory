```vue
<template>
  <FullScreenLayout>
    <div class="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div
        class="relative flex lg:flex-row w-full h-screen justify-center flex-col dark:bg-gray-900"
      >
        <!-- Left -->
        <div class="flex flex-col flex-1 lg:w-1/2 w-full">
          <div class="w-full max-w-md pt-10 mx-auto"></div>

          <div
            class="flex flex-col justify-center flex-1 w-full max-w-md mx-auto"
          >
            <div>
              <!-- Header -->
              <div class="mb-5 sm:mb-8">
                <h1
                  class="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md"
                >
                  Create New Password
                </h1>

                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Enter your new password and confirm it below.
                </p>
              </div>

              <!-- Form -->
              <form @submit="onSubmit">
                <div class="space-y-5">

                  <!-- New Password -->
                  <div>
                    <label
                      for="newPassword"
                      class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                    >
                      New Password
                      <span class="text-error-500">*</span>
                    </label>

                    <div class="relative">
                      <input
                        v-model="newPassword"
                        :type="showNewPassword ? 'text' : 'password'"
                        id="newPassword"
                        name="newPassword"
                        placeholder="Enter new password"
                        class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 px-4 ltr:pr-11 rtl:pl-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                      />

                      <!-- Eye -->
                      <span
                        @click="showNewPassword = !showNewPassword"
                        class="absolute z-30 text-gray-500 -translate-y-1/2 cursor-pointer ltr:right-4 rtl:left-4 top-1/2 dark:text-gray-400"
                      >
                        <svg
                          v-if="!showNewPassword"
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M10.0002 4.04297C6.48191 4.04297 3.49489 6.30917 2.4155 9.4593C2.3615 9.61687 2.3615 9.78794 2.41549 9.94552C3.49488 13.0957 6.48191 15.3619 10.0002 15.3619C13.5184 15.3619 16.5055 13.0957 17.5849 9.94555C17.6389 9.78797 17.6389 9.6169 17.5849 9.45932C16.5055 6.30919 13.5184 4.04297 10.0002 4.04297ZM10.0002 5.54297C7.23361 5.54297 4.86803 7.26761 3.92328 9.70241C4.86804 12.1372 7.23361 13.8619 10.0002 13.8619C12.7667 13.8619 15.1323 12.1372 16.0771 9.70243C15.1323 7.26762 12.7667 5.54297 10.0002 5.54297ZM10.0002 7.84413C8.96527 7.84413 8.13333 8.67606 8.13333 9.70231C8.13333 10.7286 8.96527 11.5605 10.0002 11.5605C11.0326 11.5605 11.8646 10.7286 11.8646 9.70231C11.8646 8.67606 11.0326 7.84413 10.0002 7.84413Z"
                            fill="#98A2B3"
                          />
                        </svg>

                        <svg
                          v-else
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M4.63803 3.57709C4.34513 3.2842 3.87026 3.2842 3.57737 3.57709C3.28447 3.86999 3.28447 4.34486 3.57737 4.63775L4.85323 5.91362C3.74609 6.84199 2.89363 8.06395 2.4155 9.45936C2.3615 9.61694 2.3615 9.78801 2.41549 9.94558C3.49488 13.0957 6.48191 15.3619 10.0002 15.3619C11.255 15.3619 12.4422 15.0737 13.4994 14.5598L15.3625 16.4229C15.6554 16.7158 16.1302 16.7158 16.4231 16.4229C16.716 16.13 16.716 15.6551 16.4231 15.3622L4.63803 3.57709ZM12.3608 13.4212L10.4475 11.5079C10.3061 11.5423 10.1584 11.5606 10.0064 11.5606H9.99151C8.96527 11.5606 8.13333 10.7286 8.13333 9.70237C8.13333 9.5461 8.15262 9.39434 8.18895 9.24933L5.91885 6.97923C5.03505 7.69015 4.34057 8.62704 3.92328 9.70247C4.86803 12.1373 7.23361 13.8619 10.0002 13.8619C10.8326 13.8619 11.6287 13.7058 12.3608 13.4212Z"
                            fill="#98A2B3"
                          />
                        </svg>
                      </span>
                    </div>

                    <p
                      v-if="newPasswordError"
                      class="mt-1.5 text-sm text-error-500"
                    >
                      {{ newPasswordError }}
                    </p>
                  </div>

                  <!-- Confirm Password -->
                  <div>
                    <label
                      for="confirmPassword"
                      class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                    >
                      Confirm New Password
                      <span class="text-error-500">*</span>
                    </label>

                    <div class="relative">
                      <input
                        v-model="confirmPassword"
                        :type="
                          showConfirmPassword ? 'text' : 'password'
                        "
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="Confirm your new password"
                        class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 px-4 ltr:pr-11 rtl:pl-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                      />

                      <!-- Eye -->
                      <span
                        @click="
                          showConfirmPassword = !showConfirmPassword
                        "
                        class="absolute z-30 text-gray-500 -translate-y-1/2 cursor-pointer ltr:right-4 rtl:left-4 top-1/2 dark:text-gray-400"
                      >
                        <svg
                          v-if="!showConfirmPassword"
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M10.0002 4.04297C6.48191 4.04297 3.49489 6.30917 2.4155 9.4593C2.3615 9.61687 2.3615 9.78794 2.41549 9.94552C3.49488 13.0957 6.48191 15.3619 10.0002 15.3619C13.5184 15.3619 16.5055 13.0957 17.5849 9.94555C17.6389 9.78797 17.6389 9.6169 17.5849 9.45932C16.5055 6.30919 13.5184 4.04297 10.0002 4.04297ZM10.0002 5.54297C7.23361 5.54297 4.86803 7.26761 3.92328 9.70241C4.86804 12.1372 7.23361 13.8619 10.0002 13.8619C12.7667 13.8619 15.1323 12.1372 16.0771 9.70243C15.1323 7.26762 12.7667 5.54297 10.0002 5.54297ZM10.0002 7.84413C8.96527 7.84413 8.13333 8.67606 8.13333 9.70231C8.13333 10.7286 8.96527 11.5605 10.0002 11.5605C11.0326 11.5605 11.8646 10.7286 11.8646 9.70231C11.8646 8.67606 11.0326 7.84413 10.0002 7.84413Z"
                            fill="#98A2B3"
                          />
                        </svg>

                        <svg
                          v-else
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M4.63803 3.57709C4.34513 3.2842 3.87026 3.2842 3.57737 3.57709C3.28447 3.86999 3.28447 4.34486 3.57737 4.63775L4.85323 5.91362C3.74609 6.84199 2.89363 8.06395 2.4155 9.45936C2.3615 9.61694 2.3615 9.78801 2.41549 9.94558C3.49488 13.0957 6.48191 15.3619 10.0002 15.3619C11.255 15.3619 12.4422 15.0737 13.4994 14.5598L15.3625 16.4229C15.6554 16.7158 16.1302 16.7158 16.4231 16.4229C16.716 16.13 16.716 15.6551 16.4231 15.3622L4.63803 3.57709ZM12.3608 13.4212L10.4475 11.5079C10.3061 11.5423 10.1584 11.5606 10.0064 11.5606H9.99151C8.96527 11.5606 8.13333 10.7286 8.13333 9.70237C8.13333 9.5461 8.15262 9.39434 8.18895 9.24933L5.91885 6.97923C5.03505 7.69015 4.34057 8.62704 3.92328 9.70247C4.86803 12.1373 7.23361 13.8619 10.0002 13.8619C10.8326 13.8619 11.6287 13.7058 12.3608 13.4212Z"
                            fill="#98A2B3"
                          />
                        </svg>
                      </span>
                    </div>

                    <p
                      v-if="confirmPasswordError"
                      class="mt-1.5 text-sm text-error-500"
                    >
                      {{ confirmPasswordError }}
                    </p>
                  </div>

                  <!-- Password Rules -->
                  <div
                    class="rounded-lg bg-gray-50 p-4 dark:bg-white/5"
                  >
                    <p
                      class="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Password must contain:
                    </p>

                    <ul class="space-y-1 text-xs text-gray-500 dark:text-gray-400">
                      <li>• At least 6 characters</li>
                      <li>• A new password that matches confirmation</li>
                    </ul>
                  </div>

                  <!-- Submit -->
                  <div>
                    <button
                      type="submit"
                      :disabled="loading"
                      class="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      <span
                        v-if="loading"
                        class="flex items-center justify-center gap-2"
                      >
                        <i class="bi bi-arrow-repeat animate-spin"></i>
                        Resetting Password...
                      </span>

                      <span v-else>
                        Reset Password
                      </span>
                    </button>
                  </div>

                  <!-- Back -->
                  <div class="text-center">
                    <router-link
                      to="/signin"
                      class="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                    >
                      ← Back to Sign In
                    </router-link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        <!-- Right Image -->
        <div
          class="lg:w-1/2 w-full h-full hidden lg:block relative overflow-hidden bg-brand-950"
        >
          <img
            src="/images/logo/signin.png"
            alt="Smart Inventory"
            class="signin-img-right"
          />
        </div>
      </div>
    </div>
  </FullScreenLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/authStore'
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue'

const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)
const loading = ref(false)

const schema = yup.object({
  newPassword: yup
    .string()
    .required('New password is required')
    .min(6, 'Password must be at least 6 characters'),

  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf(
      [yup.ref('newPassword')],
      'Passwords do not match'
    ),
})

const { handleSubmit } = useForm({
  validationSchema: schema,
})

const {
  value: newPassword,
  errorMessage: newPasswordError,
} = useField<string>('newPassword')

const {
  value: confirmPassword,
  errorMessage: confirmPasswordError,
} = useField<string>('confirmPassword')


    const onSubmit = handleSubmit(async (values) => {
  try {
    const email = sessionStorage.getItem('forgotEmail')
    const otp = sessionStorage.getItem('otpVerified')
    console.log(email , otp);
    if (!email || !otp) {
      toast.error('Reset session expired. Please try again.')

      router.push('/forgot-password');

      return
    }

   const result =  await authStore.newPassword(
      email,
      otp,
      values.newPassword
    )

    if(result.success){
        toast.success('Password has been reset successfully. You can now login.!')

    // Clear reset information
    sessionStorage.removeItem('forgotEmail')
    sessionStorage.removeItem('otpVerified')

    // Go to Sign In
    router.push('/signin')
    } else {
        toast.error(result.message);
    }
  } catch (error) {
    console.error(error)

    toast.error(
      authStore.error || 'Unable to reset password.'
    )
  }
})


</script>
