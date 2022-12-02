import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useSessionStore = defineStore('session', () => {
  const data = reactive({
    member: {},
    token: ''
  })

  function setSession(m,t){
    data.member = m;
    data.token = t;
  }
  
  function emptySession(){
    data.member = {};
    data.token = '';
  }

  return { data, setSession, emptySession }
}, {
  persist: true,
})
