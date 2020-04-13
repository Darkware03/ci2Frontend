<template>
  <q-page class="flex column" ref="pageChat">
    <q-banner class="bg-grey-4 text-center"
    v-if="!otrosDetalles.online">
      {{otrosDetalles.name}} is offline :(
    </q-banner>
    <div class="q-pa-md column col justify-end"
    :class="{ 'invisible' : !showMessages }"
    >
      <q-chat-message
        v-for="(mensaje, key) in messages"
        :name="mensaje.from"
        :text="[mensaje.text]"
        :key="key"
        :sent="mensaje.from==mensajeFrom ? true : false"
      />
    </div>
    <q-footer elevated>
      <q-toolbar>
          <q-input
            class="full-width"
            bg-color="white"
            outlined
            rounded
            v-model="nuevoMensaje"
            label="Escriba su mensaje"
            dense>
            <template v-slot:after>
              <q-btn
                @click="validarEnvioMensajes"
                type="submit"
                color="white"
                round
                dense
                flat
                icon="send" />
            </template>
          </q-input>
      </q-toolbar>
    </q-footer>
  </q-page>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import mixinOtherUserDetails from 'src/mixins/mixins-other-user-details'
export default {
  // lo traigo de mixins
  mixins: [mixinOtherUserDetails],
  data () {
    return {
      showMessages: false,
      nuevoMensaje: '',
      mensajeFrom: ''
    }
  },
  computed: {
    ...mapState('store', ['messages', 'usrDetail'])
  },
  methods: {
    ...mapActions('store', ['firebaseGetMessages',
      'firebaseStopGettingMessages', 'firebaseSendMessage']),
    enviarMensaje: function () {
      this.firebaseSendMessage({
        message: {
          text: this.nuevoMensaje,
          from: this.mensajeFrom
        },
        idOtrousuario: this.$route.params.otherUserId
      })
      this.nuevoMensaje = ''
    },
    validarColoresChat: function () {
      this.mensajeFrom = this.usrDetail.name
    },
    validarEnvioMensajes () {
      if (this.nuevoMensaje !== '') {
        this.enviarMensaje()
      }
    },
    scrolltoBoton () {
      const pageChat = this.$refs.pageChat.$el
      setTimeout(() => {
        window.scroll(0, pageChat.scrollHeight)
      }, 20)
    }
  },
  watch: {
    messages: function (val) {
      console.log('val:', val)
      if (Object.keys(val).length) {
        this.scrolltoBoton()
        setTimeout(() => {
          this.showMessages = true
        }, 200)
      }
    }
  },
  mounted () {
    this.firebaseGetMessages(this.$route.params.otherUserId)
    this.validarColoresChat()
  },
  destroyed () {
    this.firebaseStopGettingMessages()
  }
}
</script>
