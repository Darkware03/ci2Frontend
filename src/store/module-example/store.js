// eslint-disable-next-line no-unused-vars
import Vue from 'vue'
import { firebaseAuth, firebaseDb } from 'boot/firebase'
let mensajeRef

const state = {
  usrDetail: {},
  users: {},
  messages: {}
}

const mutations = {
  setusrDetail (state, payload) {
    state.usrDetail = payload
  },
  addUser (state, payload) {
    Vue.set(state.users, payload.userId, payload.usrDetails)
  },
  updateuser (state, payload) {
    Object.assign(state.users[payload.userId], payload.usrDetails)
  },
  addMessage (state, payload) {
    Vue.set(state.messages, payload.messageId, payload.messageDetails)
  },
  clearMessages (state) {
    state.messages = {}
  }
}

const actions = {
  // eslint-disable-next-line no-empty-pattern
  Ingresar ({}, payload) {
    firebaseAuth.signInWithEmailAndPassword(
      payload.email,
      payload.password)
      .then(response => {
        console.log(response)
      })
      .catch(error => {
        console.log(error.message + '__' + 'email:' + payload.email + 'pass:' + payload.password)
      })
  },
  // eslint-disable-next-line no-empty-pattern
  CrearUsuario ({}, payload) {
    firebaseAuth.createUserWithEmailAndPassword(payload.email,
      payload.password)
      .then(response => {
        console.log(response)
        const userId = firebaseAuth.currentUser.uid
        firebaseDb.ref('users/' + userId).set({
          name: payload.name,
          email: payload.email,
          online: true
        })
      })
      .catch(error => {
        console.log(error.message + '__' + 'email:' + payload.email + 'pass:' + payload.password)
      })
  },
  logout () {
    firebaseAuth.signOut()
  },
  // comprueba si ha iniciado session y si lo ha hecho pues en main layout ejecuto que me muestre el nombre de usuario y en app vue solo lo monto
  handleAuthStateChanged: function ({ commit, dispatch, state }) {
    firebaseAuth.onAuthStateChanged(user => {
      if (user) {
        const userId = firebaseAuth.currentUser.uid
        // User is signed in.
        firebaseDb.ref('users/' + userId).once('value', snapshot => {
          console.log('snaphot:', snapshot)
          const usrDetail = snapshot.val()
          console.log('userDet:', usrDetail)
          commit('setusrDetail', {
            name: usrDetail.name,
            email: usrDetail.email,
            userId: userId
          })
        })
        dispatch('firebaseUpdateUser', {
          userId: state.usrDetail.userId,
          updates: {
            online: true
          }
        })
        dispatch('firebaseObtenerUsuarios')
        this.$router.push('/user')
      } else {
        dispatch('firebaseUpdateUser', {
          userId: state.usrDetail.userId,
          updates: {
            online: false
          }
        })
        // error
        commit('setusrDetail', {})
        this.$router.replace('/')
      }
    })
  },
  // eslint-disable-next-line no-empty-pattern
  firebaseUpdateUser ({}, payload) {
    if (payload.userId) {
      console.log('payload:', payload)
      firebaseDb.ref('users/' + payload.userId).update(payload.updates)
    }
  },
  firebaseObtenerUsuarios ({ commit }) {
    firebaseDb.ref('users').on('child_added', snapshot => {
      const usrDetails = snapshot.val()
      const userId = snapshot.key
      commit('addUser', {
        userId,
        usrDetails
      })
    })
    firebaseDb.ref('users').on('child_changed', snapshot => {
      const usrDetails = snapshot.val()
      const userId = snapshot.key
      commit('updateuser', {
        userId,
        usrDetails
      })
    })
  },
  // eslint-disable-next-line no-empty-pattern
  firebaseGetMessages ({ commit, state }, otherUserId) {
    console.log('otherUserId:', otherUserId)
    const userId = state.usrDetail.userId
    mensajeRef = firebaseDb.ref('chats/' + userId + '/' + otherUserId)
    mensajeRef.on('child_added', snapshot => {
      const messageDetails = snapshot.val()
      const messageId = snapshot.key
      commit('addMessage', {
        messageId,
        messageDetails
      })
    })
  },
  firebaseStopGettingMessages ({ commit }) {
    if (mensajeRef) {
      mensajeRef.off('child_added')
      commit('clearMessages')
    }
  },
  // eslint-disable-next-line no-empty-pattern
  firebaseSendMessage ({}, payload) {
    firebaseDb.ref('chats/' + state.usrDetail.userId + '/' + payload.idOtrousuario).push(payload.message)
    payload.from = 'them'
    firebaseDb.ref('chats/' + payload.idOtrousuario + '/' + state.usrDetail.userId).push(payload.message)
  }
}

const getters = {
  users: state => {
    const usersfiltered = {}
    Object.keys(state.users).forEach(k => {
      if (k !== state.usrDetail.userId) {
        usersfiltered[k] = state.users[k]
      }
    })
    return usersfiltered
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
