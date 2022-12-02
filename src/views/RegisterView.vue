<script setup>
import Alert from '@/components/Alert.vue'

import {useRouter} from 'vue-router';
const router = useRouter();

const member = reactive({
  fullname: '',
  email: '',
  password: '',
})

const error = ref('');

let register = () => {
  error.value = '';
  api.post('members',{body: member}).then(data => {
    if (data.message){
      error.value = data.message
    } else {
      router.push('/login')
    }
  }).catch(errorRes => {
    console.error(errorRes)
  })
}

</script>

<template>
  <div>
    <Alert v-if="error" :type="'error'" :message="error" />

    <h1>Page d'inscription</h1>

    <form @submit.prevent="register">
      <div class="form-group">
        <label for="fullname">Nom complet</label>
        <input type="text" v-model="member.fullname" require>
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" v-model="member.email" require>
      </div>
      <div class="form-group">
        <label for="password">Mot de passe</label>
        <input type="password" v-model="member.password" require>
      </div>
      <div class="list-button">
        <button class="btn-primary">Inscription</button>
        <router-link to="/login" class="btn-secondary">Déjà membre ?</router-link>
      </div>
    </form>
  </div>
</template>
