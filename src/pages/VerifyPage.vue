<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" lg="6" md="8">
        <v-card class="mx-auto my-4">
          <v-card-title class="text-h4 text-center">
            Discord Verification
          </v-card-title>

          <v-card-text class="text-center">
            <v-img
              alt="Discord Logo"
              class="mx-auto mb-4"
              src="https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png"
              width="150"
            />

            <p v-if="isLoading" class="text-body-1 mb-4">
              Processing your verification...
            </p>

            <p v-else-if="isVerified" class="text-body-1 mb-4 text-success">
              Your Discord account has been successfully verified!
            </p>

            <p v-else-if="error" class="text-body-1 mb-4 text-error">
              {{ error }}
            </p>

            <p v-else class="text-body-1 mb-4">
              We're linking your Discord account to your NATCA profile.
            </p>

            <v-alert v-if="discordId" class="mb-4" type="info">
              Discord ID: {{ discordId }}
            </v-alert>
          </v-card-text>

          <v-card-actions class="justify-center">
            <v-btn
              v-if="!isVerified && !isLoading"
              color="primary"
              :disabled="!discordId || !isAuthenticated"
              @click="verifyDiscordAccount"
            >
              Verify Discord Account
            </v-btn>

            <v-btn
              v-if="isVerified"
              color="success"
              to="/"
            >
              Return to Home
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import { useAuth0 } from '@auth0/auth0-vue'

  const route = useRoute()
  const { user, isAuthenticated } = useAuth0()

  const discordId = ref(null)
  const isLoading = ref(false)
  const isVerified = ref(false)
  const error = ref(null)

  onMounted(() => {
    // Extract discord_id from query parameters
    discordId.value = route.query.discord || null

    if (!discordId.value) {
      error.value = 'No Discord ID provided. Please try again with a valid Discord ID.'
    }
  })

  const verifyDiscordAccount = async () => {
    if (!isAuthenticated.value || !user.value) {
      error.value = 'You must be logged in to verify your Discord account.'
      return
    }

    if (!discordId.value) {
      error.value = 'No Discord ID provided. Please try again with a valid Discord ID.'
      return
    }

    isLoading.value = true
    error.value = null

    try {
      // Extract auth0_id from the authenticated user
      const auth0Id = user.value.sub

      // This is a stub function - in production, this would call the Supabase edge function
      // For now, we'll simulate a successful verification after a short delay
      console.log('Sending verification data to Supabase edge function:')
      console.log('Discord ID:', discordId.value)
      console.log('Auth0 ID:', auth0Id)

      // Simulate API call to Supabase edge function
      setTimeout(() => {
        // In a real implementation, this would be:
        // const { data, error } = await supabase.functions.invoke('verify-discord', {
        //   body: { discord_id: discordId.value, auth0_id: auth0Id }
        // })

        isLoading.value = false
        isVerified.value = true
      }, 2000)
    } catch (err) {
      isLoading.value = false
      error.value = 'An error occurred during verification. Please try again later.'
      console.error('Verification error:', err)
    }
  }
</script>

<style scoped>
.text-success {
  color: #4caf50;
}

.text-error {
  color: #f44336;
}
</style>
