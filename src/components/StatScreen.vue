<template>
  <div class="stat-screen p-4 sm:p-6 bg-gray-100 rounded-lg shadow-md max-w-4xl mx-auto">
    <h2 class="text-3xl font-bold mb-6 text-gray-800 text-center">
      Game Statistics
    </h2>

    <!-- Filter Section (Tabs) -->
    <div class="filter-section flex space-x-4 mb-4">
      <button
        @click="setActiveTab('set')"
        :class="{ 'active': activeTab === 'set' }"
        class="px-4 py-2 rounded-md bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Set Stats
      </button>
      <button
        @click="setActiveTab('game')"
        :class="{ 'active': activeTab === 'game' }"
        class="px-4 py-2 rounded-md bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Game Stats
      </button>
    </div>

    <GameSummary v-if="activeTab === 'game'" :game="game" />

    <TeamStats 
      v-if="activeTab === 'set' || activeTab === 'game'" 
      :game="game" 
      :currentSetNumber="currentSetNumber" 
      :getPlayerName="getPlayerName" 
    />

    <PlayerStats
      :game="game"
      :selectedPlayer="selectedPlayer"
      :getPlayerName="getPlayerName"
      :currentSetNumber="currentSetNumber"  
      @player-selected="selectedPlayer = $event" 
    />

  </div>
</template>

<script>
import GameSummary from './StatScreen/GameSummary.vue';
import TeamStats from './StatScreen/TeamStats.vue';
import PlayerStats from './StatScreen/PlayerStats.vue';

export default {
  props: {
    game: {
      type: Object,
      required: true,
    },
    getPlayerName: {
      type: Function,
      required: true,
    },
  },
  components: { GameSummary, TeamStats, PlayerStats }, 
  data() {
    return {
      activeTab: 'set',
      selectedPlayer: null,
    };
  },
  computed: {
    currentSetNumber() {
      return this.activeTab === 'set' ? this.game.currentSet : null;
    },
  },
  mounted() {
    if (this.game.playerDetails && this.game.playerDetails.length > 0) {
      this.selectedPlayer = this.game.playerDetails[0].id;
    }
  },
  methods: {
    setActiveTab(tab) {
      this.activeTab = tab;
    },
  },
};
</script>