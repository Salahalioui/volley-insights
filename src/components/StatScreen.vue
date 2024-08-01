<template>
  <div class="stat-screen p-4 sm:p-6 bg-gray-100 rounded-lg shadow-md max-w-4xl mx-auto">
    <h2 class="text-3xl font-bold mb-6 text-gray-800">Advanced Game Statistics</h2>
    
    <!-- Set Tabs -->
    <div class="mb-6">
      <ul class="flex border-b">
        <li v-for="set in game.sets" :key="set.setNumber" class="mr-1">
          <a 
            :class="['bg-white inline-block py-2 px-4 text-blue-700 hover:text-blue-800 font-semibold', { 'border-l border-t border-r rounded-t': selectedSet === set.setNumber }]"
            href="#" 
            @click.prevent="selectSet(set.setNumber)"
          >
            Set {{ set.setNumber }}
          </a>
        </li>
        <li class="mr-1">
          <a 
            :class="['bg-white inline-block py-2 px-4 text-blue-700 hover:text-blue-800 font-semibold', { 'border-l border-t border-r rounded-t': selectedSet === 'fullGame' }]"
            href="#" 
            @click.prevent="selectSet('fullGame')"
          >
            Full Game
          </a>
        </li>
      </ul>
    </div>

    <!-- Advanced Statistics Display -->
    <div v-if="selectedSet === 'fullGame'">
      <h3 class="text-xl font-bold mb-4">Full Game Advanced Statistics</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="stat in advancedStats" :key="stat.title" class="p-4 bg-white rounded-lg shadow">
          <h4 class="font-semibold text-lg mb-2">{{ stat.title }}</h4>
          <p>{{ stat.value }}</p>
        </div>
      </div>
    </div>
    <div v-else>
      <h3 class="text-xl font-bold mb-4">Set {{ selectedSet }} Advanced Statistics</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="stat in advancedStats" :key="stat.title" class="p-4 bg-white rounded-lg shadow">
          <h4 class="font-semibold text-lg mb-2">{{ stat.title }}</h4>
          <p>{{ stat.value }}</p>
        </div>
      </div>
    </div>

    <!-- Individual Player Advanced Performance -->
    <div class="player-performance mt-6">
      <h3 class="text-xl font-bold mb-4">Individual Player Advanced Performance</h3>
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white">
          <thead class="bg-gray-200">
            <tr>
              <th class="py-2 px-4 text-left">Player</th>
              <th class="py-2 px-4 text-left">Efficiency</th>
              <th class="py-2 px-4 text-left">Serve Success Rate</th>
              <th class="py-2 px-4 text-left">Spike Success Rate</th>
              <th class="py-2 px-4 text-left">Hitting Percentage</th>
              <th class="py-2 px-4 text-left">Service Efficiency</th>
              <th class="py-2 px-4 text-left">Blocking Efficiency</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="player in game.players" :key="player" class="border-b">
              <td class="py-2 px-4">{{ getPlayerName(player) }}</td>
              <td class="py-2 px-4">{{ calculatePlayerEfficiency(player) }}</td>
              <td class="py-2 px-4">{{ calculatePlayerSuccessRate(player, 'serve') }}</td>
              <td class="py-2 px-4">{{ calculatePlayerSuccessRate(player, 'spike') }}</td>
              <td class="py-2 px-4">{{ calculatePlayerHittingPercentage(player) }}</td>
              <td class="py-2 px-4">{{ calculatePlayerServiceEfficiency(player) }}</td>
              <td class="py-2 px-4">{{ calculatePlayerBlockingEfficiency(player) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    game: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      selectedSet: 'fullGame',
    };
  },
  computed: {
    advancedStats() {
      const stats = this.selectedSet === 'fullGame' ? this.computeFullGameStats('advanced') : this.computeSetStats(this.selectedSet, 'advanced');
      return stats;
    }
  },
  methods: {
    selectSet(setNumber) {
      this.selectedSet = setNumber;
    },
    computeFullGameStats(type) {
      const stats = [];
      if (type === 'advanced') {
        stats.push({ title: 'Efficiency', value: this.calculateEfficiency() });
        stats.push({ title: 'Serve Success Rate', value: this.calculateSuccessRate('serve') });
        stats.push({ title: 'Spike Success Rate', value: this.calculateSuccessRate('spike') });
        stats.push({ title: 'Hitting Percentage', value: this.calculateHittingPercentage() });
        stats.push({ title: 'Service Efficiency', value: this.calculateServiceEfficiency() });
        stats.push({ title: 'Blocking Efficiency', value: this.calculateBlockingEfficiency() });
      }
      return stats;
    },
    computeSetStats(setNumber, type) {
      const set = this.game.sets.find(s => s.setNumber === setNumber);
      const stats = [];
      if (set && type === 'advanced') {
        stats.push({ title: 'Efficiency', value: this.calculateEfficiency(set) });
        stats.push({ title: 'Serve Success Rate', value: this.calculateSuccessRate('serve', set) });
        stats.push({ title: 'Spike Success Rate', value: this.calculateSuccessRate('spike', set) });
        stats.push({ title: 'Hitting Percentage', value: this.calculateHittingPercentage(set) });
        stats.push({ title: 'Service Efficiency', value: this.calculateServiceEfficiency(set) });
        stats.push({ title: 'Blocking Efficiency', value: this.calculateBlockingEfficiency(set) });
      }
      return stats;
    },
    calculateEfficiency(set = null) {
      const events = set ? set.events : this.game.sets.flatMap(s => s.events);
      const totalActions = events.length;
      const successfulActions = events.filter(event => event.result === 'point').length;
      return totalActions > 0 ? ((successfulActions / totalActions) * 100).toFixed(2) + '%' : '0%';
    },
    calculateSuccessRate(action, set = null) {
      const events = set ? set.events : this.game.sets.flatMap(s => s.events);
      const totalActions = events.filter(event => event.action === action).length;
      const successfulActions = events.filter(event => event.action === action && event.result === 'point').length;
      return totalActions > 0 ? ((successfulActions / totalActions) * 100).toFixed(2) + '%' : '0%';
    },
    calculateHittingPercentage(set = null) {
      const events = set ? set.events : this.game.sets.flatMap(s => s.events);
      const kills = events.filter(event => event.action === 'spike' && event.result === 'point').length;
      const errors = events.filter(event => event.action === 'spike' && event.result === 'error').length;
      const attempts = events.filter(event => event.action === 'spike').length;
      return attempts > 0 ? (((kills - errors) / attempts) * 100).toFixed(2) + '%' : '0%';
    },
    calculateServiceEfficiency(set = null) {
      const events = set ? set.events : this.game.sets.flatMap(s => s.events);
      const points = events.filter(event => event.action === 'serve' && event.result === 'point').length;
      const errors = events.filter(event => event.action === 'serve' && event.result === 'error').length;
      return (points - errors).toString();
    },
    calculateBlockingEfficiency(set = null) {
      const events = set ? set.events : this.game.sets.flatMap(s => s.events);
      const points = events.filter(event => event.action === 'block' && event.result === 'point').length;
      const errors = events.filter(event => event.action === 'block' && event.result === 'error').length;
      return (points - errors).toString();
    },
    getPlayerName(playerId) {
      const player = this.game.playerDetails.find(p => p.id === playerId);
      return player ? player.name : 'Unknown Player';
    },
    calculatePlayerEfficiency(playerId) {
      const events = this.selectedSet === 'fullGame' ? this.game.sets.flatMap(s => s.events) : this.game.sets.find(s => s.setNumber === this.selectedSet).events;
      const totalActions = events.filter(event => event.player === playerId).length;
      const successfulActions = events.filter(event => event.player === playerId && event.result === 'point').length;
      return totalActions > 0 ? ((successfulActions / totalActions) * 100).toFixed(2) + '%' : '0%';
    },
    calculatePlayerSuccessRate(playerId, action) {
      const events = this.selectedSet === 'fullGame' ? this.game.sets.flatMap(s => s.events) : this.game.sets.find(s => s.setNumber === this.selectedSet).events;
      const totalActions = events.filter(event => event.player === playerId && event.action === action).length;
      const successfulActions = events.filter(event => event.player === playerId && event.action === action && event.result === 'point').length;
      return totalActions > 0 ? ((successfulActions / totalActions) * 100).toFixed(2) + '%' : '0%';
    },
    calculatePlayerHittingPercentage(playerId) {
      const events = this.selectedSet === 'fullGame' ? this.game.sets.flatMap(s => s.events) : this.game.sets.find(s => s.setNumber === this.selectedSet).events;
      const kills = events.filter(event => event.player === playerId && event.action === 'spike' && event.result === 'point').length;
      const errors = events.filter(event => event.player === playerId && event.action === 'spike' && event.result === 'error').length;
      const attempts = events.filter(event => event.player === playerId && event.action === 'spike').length;
      return attempts > 0 ? (((kills - errors) / attempts) * 100).toFixed(2) + '%' : '0%';
    },
    calculatePlayerServiceEfficiency(playerId) {
      const events = this.selectedSet === 'fullGame' ? this.game.sets.flatMap(s => s.events) : this.game.sets.find(s => s.setNumber === this.selectedSet).events;
      const points = events.filter(event => event.player === playerId && event.action === 'serve' && event.result === 'point').length;
      const errors = events.filter(event => event.player === playerId && event.action === 'serve' && event.result === 'error').length;
      return (points - errors).toString();
    },
    calculatePlayerBlockingEfficiency(playerId) {
      const events = this.selectedSet === 'fullGame' ? this.game.sets.flatMap(s => s.events) : this.game.sets.find(s => s.setNumber === this.selectedSet).events;
      const points = events.filter(event => event.player === playerId && event.action === 'block' && event.result === 'point').length;
      const errors = events.filter(event => event.player === playerId && event.action === 'block' && event.result === 'error').length;
      return (points - errors).toString();
    }
  }
};
</script>

<style scoped>
.stat-screen {
  max-width: 800px;
  margin: auto;
}

.stat-screen h2 {
  text-align: center;
}

.stat-screen h3 {
  text-align: center;
}

.stat-screen .stat-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  background-color: #fff;
}

.stat-screen .stat-card h4 {
  margin-bottom: 8px;
  font-size: 1.1rem;
  color: #333;
}

.stat-screen .stat-card p {
  margin: 0;
  font-size: 1rem;
  color: #666;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 0.5rem 1rem;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

thead {
  background-color: #edf2f7;
}
</style>
