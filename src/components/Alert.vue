<script setup>
const props = defineProps({
  type: String,
  message: String,
});
</script>

<template>
  <div class="alert" :class="props.type">
    {{ props.message }}
  </div>
</template>

<style lang="scss">
.alert {
  width: 100%;
  padding: 10px 20px;
  text-align: center;
  color: white;
  border-radius: 5px;
  font-weight: 800;
}

.alert.error {
  background-color: rgb(161, 3, 3);
}

.alert.success {
  background-color: green;
}
</style>
