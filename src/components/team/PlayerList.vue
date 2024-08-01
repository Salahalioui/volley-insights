<template>
    <TransitionGroup name="list" tag="ul" class="space-y-3 mb-6">
      <li v-for="player in filteredPlayers" :key="player.id" 
          class="bg-white p-4 rounded-lg shadow flex flex-col sm:flex-row justify-between items-start sm:items-center transition duration-300 ease-in-out hover:bg-gray-50">
        <div class="flex items-center mb-2 sm:mb-0">
          <div class="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center mr-3">
            {{ player.name.charAt(0) }}
          </div>
          <span>
            <span class="font-semibold">{{ player.name }}</span>
            <span class="text-gray-600 ml-2">#{{ player.shirtNumber }} - {{ player.role }}</span>
          </span>
        </div>
        <div class="space-x-2">
          <button @click="$emit('edit-player', player)" class="text-blue-500 hover:text-blue-700 transition duration-300">
            <i class="fas fa-edit"></i> Edit
          </button>
          <button @click="$emit('confirm-remove-player', player)" class="text-red-500 hover:text-red-700 transition duration-300">
            <i class="fas fa-trash"></i> Remove
          </button>
        </div>
      </li>
    </TransitionGroup>
  </template>
  
  <script>
  export default {
    name: 'PlayerList',
    props: {
      filteredPlayers: Array
    }
  };
  </script>
  
  <style scoped>
  .list-enter-active,
  .list-leave-active {
    transition: all 0.5s ease;
  }
  .list-enter-from,
  .list-leave-to {
    opacity: 0;
    transform: translateY(30px);
  }
  </style>
  