<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="">
        <q-btn
          icon="arrow_back"
          flat dense label="Atras"
          v-if="$route.fullPath.includes('/chat')"
          v-go-back.single
        />

        <q-toolbar-title class="absolute-center">
        {{title}}
        </q-toolbar-title>

        <q-btn
          v-if="!usrDetail.userId"
          class="absolute-right q-pr-sm"
          no-caps
          icon="account_circle"
          flat
          dense
          label="login"
          to="/auth"
        />
        <q-btn
          v-else
          @click="logout"
          class="absolute-right q-pr-sm"
          no-caps
          icon="account_circle"
          flat
          label="Logout"
          dense>
        </q-btn>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import mixinOtherUserDetails from 'src/mixins/mixins-other-user-details'
export default {
  mixins: [mixinOtherUserDetails],
  computed: {
    ...mapState('store', ['usrDetail']),
    title () {
      const currentPath = this.$route.fullPath
      if (currentPath === '/') return 'Ci2App'
      else if (currentPath.includes('/chat')) return this.otrosDetalles.name
      else if (currentPath === '/auth') return 'login'
      else if (currentPath === '/user') return 'Pagina inicio'
      else if (currentPath === '/singIn') return 'singIn'
      return ''
    }
  },
  methods: {
    ...mapActions('store', ['logout'])
  }
}
</script>
