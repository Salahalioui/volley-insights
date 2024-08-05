<template>
    <div class="player-stats mb-6">
      <h3 class="text-lg font-semibold mb-2">Individual Player Stats</h3>
      <select
        v-model="selectedPlayerId"
        class="w-full p-2 border rounded-md mb-4"
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
  
      <div v-if="selectedPlayerId">
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