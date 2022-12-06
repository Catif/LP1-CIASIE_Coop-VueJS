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
      console.log("avant le if:", data.token);
      if (data.token) {
        console.log("dans le if:", data.token);
        const memberId = data.member.id;

        const response = await api.get(
          `members/${memberId}/signedin?token=${data.token}`
        );
        const data = await response;

        if (!data.token) {
          return false;
        }

        return true;
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