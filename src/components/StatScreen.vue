<template>
  <div class="stat-screen p-4 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-4">Game Statistics</h2>
    
    <!-- Set Tabs -->
    <div class="tabs mb-4 flex justify-center">
      <button v-for="set in game.sets" :key="set.setNumber"
              @click="selectSet(set.setNumber)"
              :class="['tab', selectedSet === set.setNumber ? 'tab-active' : '']">
        Set {{ set.setNumber }}
      </button>
      <button @click="selectSet(0)" :class="['tab', selectedSet === 0 ? 'tab-active' : '']">
        Full Game
      </button>
    </div>
    
    <!-- Statistics Display -->
    <div v-if="selectedSet === 0">
      <h3 class="text-xl font-semibold mb-2">Full Game Statistics</h3>
      <div class="stats-grid">
        <div class="stat-card" v-for="player in game.playerDetails" :key="player.id">
          <h4 class="font-bold">{{ player.name }} (#{{ player.shirtNumber }})</h4>
          <p>Points: {{ getPlayerStat(player.id, 'points') }}</p>
          <p>Errors: {{ getPlayerStat(player.id, 'errors') }}</p>
          <p>Serves: {{ getPlayerStat(player.id, 'serves') }}</p>
          <p>Attacks: {{ getPlayerStat(player.id, 'attacks') }}</p>
          <p>Blocks: {{ getPlayerStat(player.id, 'blocks') }}</p>
        </div>
      </div>
    </div>
    <div v-else>
      <h3 class="text-xl font-semibold mb-2">Set {{ selectedSet }} Statistics</h3>
      <div class="stats-grid">
        <div class="stat-card" v-for="player in game.playerDetails" :key="player.id">
          <h4 class="font-bold">{{ player.name }} (#{{ player.shirtNumber }})</h4>
          <p>Points: {{ getPlayerSetStat(player.id, selectedSet, 'points') }}</p>
          <p>Errors: {{ getPlayerSetStat(player.id, selectedSet, 'errors') }}</p>
          <p>Serves: {{ getPlayerSetStat(player.id, selectedSet, 'serves') }}</p>
          <p>Attacks: {{ getPlayerSetStat(player.id, selectedSet, 'attacks') }}</p>
          <p>Blocks: {{ getPlayerSetStat(player.id, selectedSet, 'blocks') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    game: Object
  },
  data() {
    return {
      selectedSet: 0
    };
  },
  methods: {
    selectSet(setNumber) {
      this.selectedSet = setNumber;
    },
    getPlayerStat(playerId, statType) {
      let count = 0;
      this.game.sets.forEach(set => {
        count += set.events.filter(event => 
          event.player === playerId && 
          (statType === 'points' ? event.result === 'point' :
           statType === 'errors' ? event.result === 'error' :
           statType === 'serves' ? event.action === 'serve' :
           statType === 'attacks' ? event.action === 'spike' :
           statType === 'blocks' ? event.action === 'block' : false)
        ).length;
      });
      return count;
    },
    getPlayerSetStat(playerId, setNumber, statType) {
      const set = this.game.sets.find(set => set.setNumber === setNumber);
      if (!set) return 0;
      return set.events.filter(event => 
        event.player === playerId && 
        (statType === 'points' ? event.result === 'point' :
         statType === 'errors' ? event.result === 'error' :
         statType === 'serves' ? event.action === 'serve' :
         statType === 'attacks' ? event.action === 'spike' :
         statType === 'blocks' ? event.action === 'block' : false)
      ).length;
    }
  }
};
</script>

<style scoped>
.stat-screen {
  max-width: 800px;
  margin: 0 auto;
}

.tabs {
  margin-bottom: 1rem;
}

.tab {
  padding: 0.5rem 1rem;
  margin: 0 0.25rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.tab:hover {
  background-color: #e5e7eb;
}

.tab-active {
  background-color: #3b82f6;
  color: white;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.stat-card {
  padding: 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  background-color: #f9fafb;
}
</style>
