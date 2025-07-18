<template>
  <v-btn
    v-if="!isAuthenticated"
    color="primary"
    @click="login"
  >
    Login
  </v-btn>
  <v-btn
    v-else
    color="error"
    @click="logout"
  >
    Logout
  </v-btn>
</template>

<script setup>
  import { useAuth0 } from '@auth0/auth0-vue';

  const { loginWithRedirect, logout: auth0Logout, isAuthenticated } = useAuth0();

  const login = () => {
    loginWithRedirect();
  };

  const logout = () => {
    auth0Logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  };
</script>
