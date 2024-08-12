<template>
  <TransitionGroup name="list" tag="ul" class="space-y-3 mb-6">
    <li v-for="player in filteredPlayers" :key="player.id" 
        class="bg-white p-4 rounded-lg shadow flex flex-col sm:flex-row justify-between items-start sm:items-center transition duration-300 ease-in-out hover:bg-gray-50">
      <div class="flex items-center mb-2 sm:mb-0">
        <div class="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center mr-3" :aria-hidden="true">
          {{ player.name.charAt(0).toUpperCase() }}
        </div>
        <span>
          <span class="font-semibold">{{ player.name }}</span>
          <span class="text-gray-600 ml-2" :aria-label="$t('playerInfo', { number: player.shirtNumber, role: $t(player.role) })">
            #{{ player.shirtNumber }} - {{ $t(player.role) }}
          </span>
        </span>
      </div>
      <div class="space-x-2 mt-2 sm:mt-0">
        <button 
          @click="$emit('edit-player', player)" 
          class="text-blue-500 hover:text-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-md px-2 py-1"
          :aria-label="$t('editPlayer', { name: player.name })"
        >
          <i class="fas fa-edit" aria-hidden="true"></i> {{ $t('edit') }}
        </button>
        <button 
          @click="$emit('confirm-remove-player', player)" 
          class="text-red-500 hover:text-red-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-300 rounded-md px-2 py-1"
          :aria-label="$t('removePlayer', { name: player.name })"
        >
          <i class="fas fa-trash" aria-hidden="true"></i> {{ $t('remove') }}
        </button>
      </div>
    </li>
  </TransitionGroup>
  <p v-if="filteredPlayers.length === 0" class="text-gray-500 text-center">{{ $t('noPlayersFound') }}</p>
</template>

<script>
import { useI18n } from 'vue-i18n';

export default {
  name: 'PlayerList',
  props: {
    filteredPlayers: {
      type: Array,
      required: true
    }
  },
  setup() {
    const { t } = useI18n();
    return { t };
  }
};
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-leave-active {
  position: absolute;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

@media (prefers-reduced-motion: reduce) {
  .list-enter-active,
  .list-leave-active,
  .list-enter-from,
  .list-leave-to {
    transition: none;
    transform: none;
  }
}
</style>
