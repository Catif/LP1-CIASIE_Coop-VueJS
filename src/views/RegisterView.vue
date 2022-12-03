<script setup>
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



let showPassword = ref(false);

let togglePassword = () => {
  showPassword.value = !showPassword.value
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
        <div class="password">
          <input v-if="!showPassword" type="password" v-model="member.password" require>
          <input v-else type="text" v-model="member.password" require>
          <button type="button" @click="togglePassword">
              <ClosedEye v-if="!showPassword" />
              <OpenEye v-else />
          </button>
        </div>
      </div>
      <div class="list-button">
        <button class="btn-primary">Inscription</button>
        <router-link to="/login" class="btn-secondary">Déjà membre ?</router-link>
      </div>
    </form>
  </div>
</template>

<style lang="scss" scoped>
  .password {
    position: relative;

    input {
      border-radius: 5px;
      width: 100%;
    }
    button {
      height: 100%;
      position: absolute;
      border: none;
      background-color: transparent;
      right: 0;
      top: 0;
      color: #E5E5E5;
      width: 30px;
      border-radius: 0px 5px 5px 0px;
      cursor: pointer;

      display: flex;
      justify-content: center;
      align-items: center;

      svg{
        width: 18px;
        height: 18px;
        color: hsl(212, 90%, 20%);
      }
    }
  }
</style>