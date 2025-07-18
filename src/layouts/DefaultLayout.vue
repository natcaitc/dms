<template>
  <v-main>
    <v-navigation-drawer
      class="mynatca-sidebar-bg"
      permanent
      theme="dark"
    >
      <v-img
        aspect-ratio="16/9"
        class="mx-auto mt-6"
        cover
        src="@/assets/natca-logo.png"
        :width="100"
      />

      <v-list v-model:opened="open">
        <v-list-item>
          <a href="https://my.natca.org">
            <v-icon icon="chevron-left" />
            Return to MyNATCA
            <font-awesome-icon icon="fa-kit fa-mynatca-icon" size="2x" />
          </a>
        </v-list-item>
        <v-list-item title="Logos" to="/logos" />

        <!-- Nested items using v-list-group -->
        <v-list-group value="Contracts">
          <template #activator="{ props }">
            <v-list-item
              v-bind="props"
              title="Contracts/MOUs"
            />
          </template>
          <v-list-item title="Slate" />
          <v-list-item title="Purple" />
        </v-list-group>
        <v-list-item title="Charters" />
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      color="#ECECF1"
      density="compact"
      title="NATCA Document Management System"
    >
      <template #append>
        <template v-if="isAuthenticated && user">
          <v-menu>
            <template #activator="{ props }">
              <v-btn append-icon="caret-down" v-bind="props">{{ user.name }}</v-btn>
            </template>

            <v-list>
              <v-list-item>
                <v-avatar class="mr-2" size="40">
                  <v-img alt="User Avatar" :src="user.picture" />
                </v-avatar>
                <div>
                  <h3>{{ user.name }}</h3>
                  <small>{{ user.email }}</small>
                </div>
              </v-list-item>
              <v-list-item
                append-icon="account"
                title="Profile"
                to="/profile"
              />
              <v-list-item
                append-icon="right-from-bracket"
                title="Logout"
                @click="logout"
              />
            </v-list>
          </v-menu>
        </template>
        <LoginButton v-else />
      </template>
    </v-app-bar>
    <router-view />
  </v-main>

  <AppFooter />
</template>

<script setup>
  import AppFooter from '@/components/AppFooter.vue'
  import LoginButton from '@/components/LoginButton.vue'
  import { ref } from 'vue'
  import { useAuth0 } from '@auth0/auth0-vue'

  const open = ref([])
  const { user, isAuthenticated, logout: auth0Logout } = useAuth0()

  const logout = () => {
    auth0Logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    })
  }
</script>

<style scoped>
/* Only affects links within this component */
.v-navigation-drawer a {
  text-decoration: none;
  color: inherit;
}
</style>
