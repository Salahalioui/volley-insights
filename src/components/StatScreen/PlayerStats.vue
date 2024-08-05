<template>
  <div class="player-stats mb-8 bg-white p-6 rounded-lg shadow-md">
    <div class="flex items-center mb-4">
      <i class="fas fa-user-circle text-blue-500 text-2xl mr-3"></i>
      <h3 class="text-xl font-semibold">Individual Player Stats</h3>
    </div>
    <div class="relative mb-6">
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

    <transition name="fade" mode="out-in">
      <div v-if="selectedPlayerId" key="stats">
        <BasicPlayerStats
          :playerId="selectedPlayerId"
          :game="game"
          :currentSetNumber="currentSetNumber"
          :getPlayerName="getPlayerName"
        />

        <AdvancedPlayerStats
          v-if="game.inputMethod === 'advanced'"
          :playerId="selectedPlayerId"
          :game="game"
          :currentSetNumber="currentSetNumber"
          :getPlayerName="getPlayerName"
        />
      </div>
      <div v-else key="no-player" class="text-center text-gray-500 py-8">
        <i class="fas fa-user-slash text-4xl mb-4"></i>
        <p>Please select a player to view their stats</p>
      </div>
    </transition>
  </div>
</template>

<script>
import BasicPlayerStats from './BasicPlayerStats.vue';
import AdvancedPlayerStats from './AdvancedPlayerStats.vue';

export default {
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
  components: { BasicPlayerStats, AdvancedPlayerStats },
  data() {
    return {
      selectedPlayerId: this.selectedPlayer,
    };
  },
  watch: {
    selectedPlayer(newVal) {
      this.selectedPlayerId = newVal;
    }
  },
  methods: {
    emitPlayerSelected() {
      this.$emit('player-selected', this.selectedPlayerId);
    },
  },
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>