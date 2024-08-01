<template>
  <div v-if="notification" 
       :class="['fixed bottom-4 right-4 p-3 rounded-lg shadow-lg', 
                notification.type === 'success' ? 'bg-green-500' : 'bg-red-500', 
                'text-white transition duration-300 ease-in-out']">
    {{ notification.message }}
  </div>
</template>

<script>
export default {
  name: 'PlayerNotification',
  props: {
    notification: Object
  }
};
</script>

<style scoped>
</style>
