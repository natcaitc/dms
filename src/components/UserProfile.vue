<template>
  <div v-if="isAuthenticated && user">
    <v-card class="mx-auto my-4" max-width="400">
      <v-card-title>User Profile</v-card-title>
      <v-card-text>
        <v-avatar class="mb-4" size="100">
          <v-img alt="User Avatar" :src="user.picture"></v-img>
        </v-avatar>
        <p><strong>Name:</strong> {{ user.name }}</p>
        <p><strong>Email:</strong> {{ user.email }}</p>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
  import { useAuth0 } from '@auth0/auth0-vue';

  const { user, isAuthenticated } = useAuth0();
</script>
