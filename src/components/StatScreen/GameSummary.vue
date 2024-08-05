<template>
    <div class="game-summary mb-6">
      <button @click="toggleSection" class="section-header">
        <div class="flex items-center">
          <i class="fas fa-trophy text-yellow-500 mr-2"></i>
          <h3 class="text-xl font-semibold">Game Summary</h3>
        </div>
        <i :class="['fas', isOpen ? 'fa-chevron-up' : 'fa-chevron-down', 'transition-transform duration-300']"></i>
      </button>
      <transition name="fade">
        <div v-if="isOpen" class="section-content bg-white p-6 rounded-md shadow-md">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="mb-2"><span class="font-semibold text-gray-700">Game:</span> {{ game.name }}</p>
              <p class="mb-2"><span class="font-semibold text-gray-700">Opponent:</span> {{ game.opponentTeam }}</p>
            </div>
            <div>
              <p class="mb-2"><span class="font-semibold text-gray-700">Date:</span> {{ formatDate(game.date) }}</p>
              <p class="mb-2">
                <span class="font-semibold text-gray-700">Sets Won:</span>
                <span class="text-green-600 font-bold">{{ game.setsWon.team }}</span> -
                <span class="text-red-600 font-bold">{{ game.setsWon.opponent }}</span>
              </p>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      game: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        isOpen: true,
      };
    },
    methods: {
      formatDate(dateString) {
        return new Date(dateString).toLocaleDateString();
      },
      toggleSection() {
        this.isOpen = !this.isOpen;
      },
    },
  };
  </script>
  
  <style scoped>
  
  .section-header {
    @apply flex justify-between items-center w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-300 ease-in-out;
  }
  
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s, max-height 0.3s;
    max-height: 1000px;
    overflow: hidden;
  }
  
  .fade-enter, .fade-leave-to {
    opacity: 0;
    max-height: 0;
  }
  </style>