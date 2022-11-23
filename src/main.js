import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import store from '@/store/index'
import firebase from 'firebase'
import FontAwesome from '@/plugins/FontAwesome'

// Initialize Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyCj1tqql2EBrhi0VzaDPylHMIyVvC3CQiM',
  authDomain: 'vue-school-form-63fb7.firebaseapp.com',
  projectId: 'vue-school-form-63fb7',
  storageBucket: 'vue-school-form-63fb7.appspot.com',
  messagingSenderId: '153929599126',
  appId: '1:153929599126:web:9efb50dccd6a83b635dab7'
}
const firebaseApp = firebase.initializeApp(firebaseConfig)
const db = firebaseApp.firestore()
export default db

const forumApp = createApp(App)
forumApp.use(router)
forumApp.use(store)
forumApp.use(FontAwesome)

const requireComponent = require.context('./components', true, /App[A-Z]\w+\.(vue|js)$/)
requireComponent.keys().forEach(function (fileName) {
  let baseComponentConfig = requireComponent(fileName)
  baseComponentConfig = baseComponentConfig.default || baseComponentConfig
  const baseComponentName = baseComponentConfig.name || (
    fileName
      .replace(/^.+\//, '')
      .replace(/\.\w+$/, '')
  )
  forumApp.component(baseComponentName, baseComponentConfig)
})

forumApp.mount('#app')
