<template>
    <form @submit.prevent="savePlayer" class="mb-6 bg-white p-6 rounded-lg shadow">
      <h3 class="text-xl font-semibold mb-4">{{ currentPlayer.id ? 'Edit' : 'Add' }} Player</h3>
      <div class="space-y-4">
        <div>
          <label for="playerName" class="block text-sm font-medium text-gray-700 mb-1">Player Name</label>
          <input id="playerName" :value="currentPlayer.name" @input="updatePlayer('name', $event.target.value)" placeholder="Enter player name" required
                 class="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300 transition duration-300"
                 maxlength="50"> 
        </div>
        <div>
          <label for="shirtNumber" class="block text-sm font-medium text-gray-700 mb-1">Shirt Number</label>
          <input id="shirtNumber" :value="currentPlayer.shirtNumber" @input="updatePlayer('shirtNumber', $event.target.value)" 
                 placeholder="Enter shirt number" type="number" required
                 class="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300 transition duration-300"
                 :class="{ 'border-red-500': shirtNumberError }"
                 min="1"> 
          <span v-if="shirtNumberError" class="text-red-500 text-sm">{{ shirtNumberError }}</span>
        </div>
        <div>
          <label for="playerRole" class="block text-sm font-medium text-gray-700 mb-1">Player Role</label>
          <select id="playerRole" :value="currentPlayer.role" @change="updatePlayer('role', $event.target.value)" required
                  class="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300 transition duration-300">
            <option value="">Select Role</option>
            <option v-for="role in roles" :key="role" :value="role">{{ role }}</option>
          </select>
        </div>
      </div>
      <button type="submit" 
              class="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-300 mt-6">
        {{ currentPlayer.id ? 'Update' : 'Add' }} Player
      </button>
    </form>
  </template>
  
  <script>
  export default {
    name: 'PlayerForm',
    props: {
      currentPlayer: Object,
      roles: Array,
      shirtNumberError: String
    },
    emits: ['save-player', 'update:currentPlayer'],
    methods: {
      savePlayer() {
        this.$emit('save-player');
      },
      updatePlayer(field, value) {
        this.$emit('update:currentPlayer', { ...this.currentPlayer, [field]: value });
      }
    }
  };
  </script>
  
  <style scoped>
  </style>
  