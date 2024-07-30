<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded-lg shadow-lg">
        <p class="mb-4">{{ message }}</p>
        <div class="flex justify-end space-x-2">
          <button @click="$emit('cancel')" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
          <button @click="$emit('confirm')" class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Confirm</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ConfirmationModal',
    props: {
      message: {
        type: String,
        required: true
      }
    }
  }
  </script>
  