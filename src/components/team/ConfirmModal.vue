<template>
    <div v-if="showConfirmModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded-lg shadow-xl">
        <h3 class="text-xl font-bold mb-4">Confirm Removal</h3>
        <p>Are you sure you want to remove {{ playerToRemove?.name }}?</p>
        <div class="mt-4 flex justify-end space-x-3">
          <button @click="$emit('cancel-remove')" class="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">Cancel</button>
          <button @click="$emit('remove-player')" class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">Remove</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ConfirmModal',
    props: {
      showConfirmModal: Boolean,
      playerToRemove: Object
    }
  };
  </script>
  
  <style scoped>
  </style>

