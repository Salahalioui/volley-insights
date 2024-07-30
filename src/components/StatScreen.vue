<template>
    <div v-if="game" class="stat-screen p-4">
      <h2 class="text-2xl font-bold mb-4">Game Statistics</h2>
      
      <!-- Team Score Summary -->
      <div class="mb-6">
        <h3 class="text-xl font-semibold mb-2">Score Summary</h3>
        <div class="flex justify-between">
          <div>
            <p class="font-bold">Our Team: {{ teamScore }}</p>
            <p>Sets Won: {{ setsWon.team }}</p>
          </div>
          <div>
            <p class="font-bold">{{ opponentTeam }}: {{ opponentScore }}</p>
            <p>Sets Won: {{ setsWon.opponent }}</p>
          </div>
        </div>
      </div>
  
      <!-- Player Statistics -->
      <div v-if="playerStats.length > 0" class="mb-6">
        <h3 class="text-xl font-semibold mb-2">Player Statistics</h3>
        <table class="w-full">
          <thead>
            <tr>
              <th class="text-left">Player</th>
              <th class="text-left">Points</th>
              <th class="text-left">Errors</th>
              <th class="text-left">Serves</th>
              <th class="text-left">Attacks</th>
              <th class="text-left">Blocks</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="player in playerStats" :key="player.id">
              <td>{{ player.name }}</td>
              <td>{{ player.points }}</td>
              <td>{{ player.errors }}</td>
              <td>{{ player.serves }}</td>
              <td>{{ player.attacks }}</td>
              <td>{{ player.blocks }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-else>No player statistics available.</p>
  
      <!-- Team Performance Chart -->
      <div v-if="hasTeamPerformanceData" class="mb-6">
        <h3 class="text-xl font-semibold mb-2">Team Performance</h3>
        <RadarChart :data="teamPerformanceData" />
      </div>
  
      <!-- Points Distribution Chart -->
      <div v-if="hasPointsDistributionData" class="mb-6">
        <h3 class="text-xl font-semibold mb-2">Points Distribution</h3>
        <DonutChart :data="pointsDistributionData" />
      </div>
    </div>
    <div v-else class="p-4">
      <p>No game data available.</p>
    </div>
  </template>
  
  <script>
  import { computed } from 'vue';
  import { RadarChart, DonutChart } from 'vue-data-ui';
  
  export default {
    name: 'StatScreen',
    components: {
      RadarChart,
      DonutChart
    },
    props: {
      game: {
        type: Object,
        required: true
      }
    },
    setup(props) {
      const currentSet = computed(() => props.game?.sets?.[props.game.currentSet - 1] || { teamScore: 0, opponentScore: 0, events: [] });
  
      const teamScore = computed(() => currentSet.value.teamScore || 0);
      const opponentScore = computed(() => currentSet.value.opponentScore || 0);
      const opponentTeam = computed(() => props.game?.opponentTeam || 'Opponent');
  
      const setsWon = computed(() => ({
        team: props.game?.sets?.filter(set => set.teamScore > set.opponentScore).length || 0,
        opponent: props.game?.sets?.filter(set => set.opponentScore > set.teamScore).length || 0
      }));
  
      const playerStats = computed(() => {
        if (!props.game?.players || !props.game?.playerDetails) return [];
        return props.game.players.map(playerId => {
          const player = props.game.playerDetails.find(p => p.id === playerId);
          if (!player) return null;
          return {
            id: playerId,
            name: player.name,
            points: getPlayerStat(playerId, 'points'),
            errors: getPlayerStat(playerId, 'errors'),
            serves: getPlayerStat(playerId, 'serves'),
            attacks: getPlayerStat(playerId, 'attacks'),
            blocks: getPlayerStat(playerId, 'blocks')
          };
        }).filter(player => player !== null);
      });
  
      const getPlayerStat = (playerId, statType) => {
        return currentSet.value.events?.filter(event => 
          event.player === playerId && 
          (statType === 'points' ? event.result === 'point' :
           statType === 'errors' ? event.result === 'error' :
           statType === event.action)
        ).length || 0;
      };
  
      const teamPerformanceData = computed(() => ({
        labels: ['Serves', 'Attacks', 'Blocks', 'Digs', 'Sets'],
        datasets: [{
          label: 'Team Performance',
          data: [
            currentSet.value.events?.filter(e => e.action === 'serve').length || 0,
            currentSet.value.events?.filter(e => e.action === 'spike').length || 0,
            currentSet.value.events?.filter(e => e.action === 'block').length || 0,
            currentSet.value.events?.filter(e => e.action === 'dig').length || 0,
            currentSet.value.events?.filter(e => e.action === 'set').length || 0
          ]
        }]
      }));
  
      const pointsDistributionData = computed(() => {
        const serve = currentSet.value.events?.filter(e => e.action === 'serve' && e.result === 'point').length || 0;
        const attack = currentSet.value.events?.filter(e => e.action === 'spike' && e.result === 'point').length || 0;
        const block = currentSet.value.events?.filter(e => e.action === 'block' && e.result === 'point').length || 0;
        const opponentError = currentSet.value.events?.filter(e => e.result === 'error').length || 0;
  
        return [
          { name: 'Serve', value: serve },
          { name: 'Attack', value: attack },
          { name: 'Block', value: block },
          { name: 'Opponent Error', value: opponentError }
        ];
      });
  
      const hasTeamPerformanceData = computed(() => teamPerformanceData.value.datasets[0].data.some(value => value > 0));
      const hasPointsDistributionData = computed(() => pointsDistributionData.value.some(item => item.value > 0));
  
      return {
        teamScore,
        opponentScore,
        opponentTeam,
        setsWon,
        playerStats,
        teamPerformanceData,
        pointsDistributionData,
        hasTeamPerformanceData,
        hasPointsDistributionData
      };
    }
  }
  </script>
  