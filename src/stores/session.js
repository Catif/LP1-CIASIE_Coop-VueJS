import { defineStore } from "pinia";
import { useRouter } from "vue-router";

export const useSessionStore = defineStore(
  "session",
  () => {
    const data = reactive({
      member: {},
      token: "",
    });

    function setSession(m, t) {
      data.member = m;
      data.token = t;
    }

    function emptySession() {
      data.member = {};
      data.token = "";
    }

    async function isValid() {
      if (data.token) {
        const memberId = data.member.id;

        return await api.get(
          `members/${memberId}/signedin?token=${data.token}`
        ).then(dataResponse => {
          if (dataResponse.token) {
            return true
          } else {
            emptySession()
            return false
          }
        });

      } else {
        return false;
      }
    }

    return { data, setSession, emptySession, isValid };
  },
  {
    persist: true,
  }
);