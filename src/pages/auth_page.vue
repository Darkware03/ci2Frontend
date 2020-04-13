<template>
  <div class="q-pa-md absolute-center" style="max-width: 400px">
    <q-input
        filled
        v-model="formData.email"
        label="email"
        hint="ingrese su correo electronico"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Por favor ingrese su correo']"
      />
      <q-input
        type="password"
        filled
        v-model="formData.password"
        label="password"
        hint="ingrese su contraseña"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Por favor ingrese su contraseña']"
      />

      <div>
        <q-btn label="Entrar" type="button" color="primary" @click="loguearse"/>
      </div>

    <!--ALERTAAAAAAAA-->
    <q-dialog v-model="alerta">
      <q-card class="bg-red">
        <q-card-section>
          <div class="text-h6 text-white">ATENCION!</div>
        </q-card-section>

        <q-card-section class="q-pt-none text-white">
          Error verifique el ingreso de sus datos por favor
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="white" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  data () {
    return {
      alerta: false,
      formData: {
        email: '',
        password: ''
      }

    }
  },
  methods: {
    ...mapActions('store', ['Ingresar']),
    loguearse () {
      if (this.formData.email !== '') {
        this.Ingresar(this.formData)
        console.log(this.formData)
      } else {
        this.alerta = true
        console.log(this.alert)
      }
    }
  }
}
</script>
