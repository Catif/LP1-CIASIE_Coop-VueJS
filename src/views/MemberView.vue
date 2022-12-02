<script setup>
const listMembers = reactive([])

onMounted(() => {
  api.get('members').then(data => {
    listMembers = data
    console.log(listMembers);
  })
})
</script>

<template>
  <div>
    <h1>Bienvenue !</h1>
  </div>
</template>
