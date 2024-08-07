<template>
  <div class="player-stats bg-white rounded-lg shadow-md mb-8">
    <div class="p-6 border-b border-gray-200">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center">
          <i class="fas fa-user-circle text-blue-500 text-2xl mr-3"></i>
          <h3 class="text-xl font-semibold">Individual Player Stats</h3>
        </div>
        <div v-if="game.inputMethod === 'advanced'" class="flex space-x-2">
          <button @click="toggleAdvancedStats" class="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200">
            {{ showAdvancedStats ? 'Hide Advanced' : 'Show Advanced' }}
          </button>
          <button @click="toggleVisualizations" class="px-3 py-1 text-sm bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors duration-200">
            {{ showVisualizations ? 'Hide Charts' : 'Show Charts' }}
          </button>
        </div>
      </div>
      <div class="relative">
        <select
          v-model="selectedPlayerId"
          class="w-full p-3 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          @change="emitPlayerSelected"
        >
          <option value="" disabled>Select a player</option>
          <option
            v-for="player in game.playerDetails"
            :key="player.id"
            :value="player.id"
          >
            {{ player.name }}
          </option>
        </select>
        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <i class="fas fa-chevron-down"></i>
        </div>
      </div>
    </div>

    <transition name="fade" mode="out-in">
      <div v-if="selectedPlayerId" key="stats" class="p-6">
        <BasicPlayerStats
          :playerId="selectedPlayerId"
          :game="game"
          :currentSetNumber="currentSetNumber"
          :getPlayerName="getPlayerName"
        />

        <transition name="fade">
          <AdvancedPlayerStats
            v-if="game.inputMethod === 'advanced' && showAdvancedStats"
            :playerId="selectedPlayerId"
            :game="game"
            :currentSetNumber="currentSetNumber"
            :getPlayerName="getPlayerName"
          />
        </transition>

        <transition name="fade">
          <PlayerStatsVisualizations
            v-if="game.inputMethod === 'advanced' && showVisualizations"
            :playerId="selectedPlayerId"
            :game="game"
            :currentSetNumber="currentSetNumber"
          />
        </transition>
      </div>
      <div v-else key="no-player" class="text-center text-gray-500 py-8">
        <i class="fas fa-user-slash text-4xl mb-4"></i>
        <p>Please select a player to view their stats</p>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import BasicPlayerStats from './BasicPlayerStats.vue';
import AdvancedPlayerStats from './AdvancedPlayerStats.vue';
import PlayerStatsVisualizations from './NewPlayerStatsVisualizations.vue';

export default {
  name: 'PlayerStats',
  components: { 
    BasicPlayerStats, 
    AdvancedPlayerStats,
    PlayerStatsVisualizations
  },
  props: {
    game: {
      type: Object,
      required: true,
    },
    selectedPlayer: {
      type: Number,
      default: null
    },
    getPlayerName: {
      type: Function,
      required: true,
    },
    currentSetNumber: {
      type: Number,
    },
  },
  setup(props, { emit }) {
    const selectedPlayerId = ref(props.selectedPlayer);
    const showAdvancedStats = ref(false);
    const showVisualizations = ref(false);

    watch(() => props.selectedPlayer, (newVal) => {
      selectedPlayerId.value = newVal;
    });

    const emitPlayerSelected = () => {
      emit('player-selected', selectedPlayerId.value);
    };

    const toggleAdvancedStats = () => {
      showAdvancedStats.value = !showAdvancedStats.value;
    };

    const toggleVisualizations = () => {
      showVisualizations.value = !showVisualizations.value;
    };

    return {
      selectedPlayerId,
      showAdvancedStats,
      showVisualizations,
      emitPlayerSelected,
      toggleAdvancedStats,
      toggleVisualizations,
    };
  },
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
