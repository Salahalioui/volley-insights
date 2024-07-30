<template>
    <div v-if="game" class="stat-screen p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 class="text-3xl font-bold mb-6 text-center">Game Statistics</h2>
      
      <!-- Filters -->
      <div class="mb-6 flex flex-wrap justify-between items-center">
        <div class="flex items-center space-x-4">
          <label class="font-semibold">Set:</label>
          <select v-model="selectedSet" class="p-2 border rounded">
            <option value="all">All Sets</option>
            <option v-for="n in game.sets.length" :key="n" :value="n">Set {{ n }}</option>
          </select>
        </div>
        <button @click="exportStats" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">
          Export Stats
        </button>
      </div>
  
      <!-- Team Score Summary -->
      <div class="mb-8 bg-white p-4 rounded-lg shadow">
        <h3 class="text-2xl font-semibold mb-4">Score Summary</h3>
        <div class="flex justify-between">
          <div class="text-center">
            <p class="text-xl font-bold">Our Team</p>
            <p class="text-3xl">{{ teamScore }}</p>
            <p>Sets Won: {{ setsWon.team }}</p>
          </div>
          <div class="text-center">
            <p class="text-xl font-bold">{{ opponentTeam }}</p>
            <p class="text-3xl">{{ opponentScore }}</p>
            <p>Sets Won: {{ setsWon.opponent }}</p>
          </div>
        </div>
      </div>
  
      <!-- Team Performance -->
      <div class="mb-8 bg-white p-4 rounded-lg shadow">
        <h3 class="text-2xl font-semibold mb-4">Team Performance</h3>
        <div class="flex flex-wrap justify-between">
          <div class="w-full md:w-1/2 mb-4">
            <RadarChart :data="teamPerformanceData" />
          </div>
          <div class="w-full md:w-1/2 mb-4">
            <DonutChart :data="pointsDistributionData" />
          </div>
        </div>
        <div class="mt-4">
          <h4 class="text-xl font-semibold mb-2">Team Stats</h4>
          <ul class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <li v-for="(value, key) in teamStats" :key="key" class="bg-gray-100 p-2 rounded">
              <span class="font-semibold">{{ formatStat(key) }}:</span> {{ value }}
            </li>
          </ul>
        </div>
      </div>
  
      <!-- Player Statistics -->
      <div class="mb-8 bg-white p-4 rounded-lg shadow">
        <h3 class="text-2xl font-semibold mb-4">Player Statistics</h3>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="bg-gray-200">
                <th class="p-2 text-left">Player</th>
                <th class="p-2 text-left">Points</th>
                <th class="p-2 text-left">Errors</th>
                <th class="p-2 text-left">Serves</th>
                <th class="p-2 text-left">Attacks</th>
                <th class="p-2 text-left">Blocks</th>
                <th class="p-2 text-left">Digs</th>
                <th class="p-2 text-left">Sets</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="player in playerStats" :key="player.id" class="border-b">
                <td class="p-2">{{ player.name }}</td>
                <td class="p-2">{{ player.points }}</td>
                <td class="p-2">{{ player.errors }}</td>
                <td class="p-2">{{ player.serves }}</td>
                <td class="p-2">{{ player.attacks }}</td>
                <td class="p-2">{{ player.blocks }}</td>
                <td class="p-2">{{ player.digs }}</td>
                <td class="p-2">{{ player.sets }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
  
      <!-- Player Performance Charts -->
      <div class="mb-8 bg-white p-4 rounded-lg shadow">
        <h3 class="text-2xl font-semibold mb-4">Player Performance</h3>
        <div v-for="stat in ['points', 'attacks', 'blocks', 'digs']" :key="stat" class="mb-4">
          <h4 class="text-xl font-semibold mb-2">{{ formatStat(stat) }}</h4>
          <BarChart :data="getPlayerPerformanceData(stat)" />
        </div>
      </div>
    </div>
    <div v-else class="p-4 text-center text-xl">
      <p>No game data available.</p>
    </div>
  </template>
  
  <script>
  import { ref, computed } from 'vue';
  import { RadarChart, DonutChart, BarChart } from 'vue-data-ui';
  
  export default {
    name: 'StatScreen',
    components: {
      RadarChart,
      DonutChart,
      BarChart
    },
    props: {
      game: {
        type: Object,
        required: true
      }
    },
    setup(props) {
      const selectedSet = ref('all');
  
      const currentSetData = computed(() => {
        if (selectedSet.value === 'all') {
          return props.game.sets.flatMap(set => set.events);
        }
        return props.game.sets[selectedSet.value - 1]?.events || [];
      });
  
      const teamScore = computed(() => props.game.sets.reduce((sum, set) => sum + set.teamScore, 0));
      const opponentScore = computed(() => props.game.sets.reduce((sum, set) => sum + set.opponentScore, 0));
      const opponentTeam = computed(() => props.game.opponentTeam);
  
      const setsWon = computed(() => ({
        team: props.game.sets.filter(set => set.teamScore > set.opponentScore).length,
        opponent: props.game.sets.filter(set => set.opponentScore > set.teamScore).length
      }));
  
      const getPlayerStat = (playerId, statType) => {
        return currentSetData.value.filter(event => 
          event.player === playerId && 
          (statType === 'points' ? event.result === 'point' :
           statType === 'errors' ? event.result === 'error' :
           statType === event.action)
        ).length;
      };
  
      const playerStats = computed(() => {
        return props.game.players.map(playerId => {
          const player = props.game.playerDetails.find(p => p.id === playerId);
          return {
            id: playerId,
            name: player.name,
            points: getPlayerStat(playerId, 'points'),
            errors: getPlayerStat(playerId, 'errors'),
            serves: getPlayerStat(playerId, 'serve'),
            attacks: getPlayerStat(playerId, 'spike'),
            blocks: getPlayerStat(playerId, 'block'),
            digs: getPlayerStat(playerId, 'dig'),
            sets: getPlayerStat(playerId, 'set')
          };
        });
      });
  
      const teamStats = computed(() => ({
        totalPoints: teamScore.value,
        aces: currentSetData.value.filter(e => e.action === 'serve' && e.result === 'point').length,
        attackPoints: currentSetData.value.filter(e => e.action === 'spike' && e.result === 'point').length,
        blockPoints: currentSetData.value.filter(e => e.action === 'block' && e.result === 'point').length,
        digs: currentSetData.value.filter(e => e.action === 'dig').length,
        assists: currentSetData.value.filter(e => e.action === 'set').length,
        errors: currentSetData.value.filter(e => e.result === 'error').length
      }));
  
      const teamPerformanceData = computed(() => ({
        labels: ['Serves', 'Attacks', 'Blocks', 'Digs', 'Sets'],
        datasets: [{
          label: 'Team Performance',
          data: [
            teamStats.value.aces,
            teamStats.value.attackPoints,
            teamStats.value.blockPoints,
            teamStats.value.digs,
            teamStats.value.assists
          ]
        }]
      }));
  
      const pointsDistributionData = computed(() => [
        { name: 'Aces', value: teamStats.value.aces },
        { name: 'Attack Points', value: teamStats.value.attackPoints },
        { name: 'Block Points', value: teamStats.value.blockPoints },
        { name: 'Opponent Errors', value: teamStats.value.totalPoints - teamStats.value.aces - teamStats.value.attackPoints - teamStats.value.blockPoints }
      ]);
  
      const getPlayerPerformanceData = (stat) => ({
        labels: playerStats.value.map(p => p.name),
        datasets: [{
          label: formatStat(stat),
          data: playerStats.value.map(p => p[stat])
        }]
      });
  
      const formatStat = (stat) => {
        return stat.charAt(0).toUpperCase() + stat.slice(1);
      };
  
      const exportStats = () => {
        // Implement export functionality (e.g., to CSV)
        const csvContent = [
          ['Player', 'Points', 'Errors', 'Serves', 'Attacks', 'Blocks', 'Digs', 'Sets'],
          ...playerStats.value.map(p => [p.name, p.points, p.errors, p.serves, p.attacks, p.blocks, p.digs, p.sets])
        ].map(e => e.join(",")).join("\n");
  
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        if (link.download !== undefined) {
          const url = URL.createObjectURL(blob);
          link.setAttribute("href", url);
          link.setAttribute("download", `game_stats_${selectedSet.value === 'all' ? 'all_sets' : `set_${selectedSet.value}`}.csv`);
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      };
  
      return {
        selectedSet,
        teamScore,
        opponentScore,
        opponentTeam,
        setsWon,
        playerStats,
        teamStats,
        teamPerformanceData,
        pointsDistributionData,
        getPlayerPerformanceData,
        formatStat,
        exportStats
      };
    }
  }
  </script>
  