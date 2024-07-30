<template>
    <div v-if="game" class="stat-screen p-4 bg-gray-100 min-h-screen">
      <h2 class="text-2xl md:text-3xl font-bold mb-6 text-center text-indigo-700">Game Statistics</h2>
      
      <!-- Filters and Export -->
      <div class="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div class="flex items-center space-x-4 w-full sm:w-auto">
          <label class="font-semibold text-gray-700">Set:</label>
          <select v-model="selectedSet" class="p-2 border rounded w-full sm:w-auto bg-white shadow-sm focus:ring focus:ring-indigo-200">
            <option value="all">All Sets</option>
            <option v-for="n in game.sets.length" :key="n" :value="n">Set {{ n }}</option>
          </select>
        </div>
        <div class="flex space-x-2 w-full sm:w-auto">
          <button @click="exportStats('csv')" class="flex-1 sm:flex-none bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition shadow">
            Export CSV
          </button>
          <button @click="exportStats('pdf')" class="flex-1 sm:flex-none bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition shadow">
            Export PDF
          </button>
        </div>
      </div>
  
      <!-- Game Summary -->
      <div class="mb-8 bg-white p-4 rounded-lg shadow-md">
        <h3 class="text-xl md:text-2xl font-semibold mb-4 text-indigo-600">Game Summary</h3>
        <div class="flex justify-between">
          <div class="text-center flex-1">
            <p class="text-lg font-bold text-gray-800">Our Team</p>
            <p class="text-2xl md:text-3xl font-bold text-indigo-600">{{ teamScore }}</p>
            <p class="text-sm text-gray-600">Sets Won: {{ setsWon.team }}</p>
          </div>
          <div class="text-center flex-1">
            <p class="text-lg font-bold text-gray-800">{{ opponentTeam }}</p>
            <p class="text-2xl md:text-3xl font-bold text-indigo-600">{{ opponentScore }}</p>
            <p class="text-sm text-gray-600">Sets Won: {{ setsWon.opponent }}</p>
          </div>
        </div>
        <div class="mt-4">
          <h4 class="text-lg font-semibold mb-2 text-gray-700">Set Scores</h4>
          <div class="flex flex-wrap justify-around gap-2">
            <div v-for="(set, index) in game.sets" :key="index" class="text-center bg-gray-100 p-2 rounded">
              <p class="font-bold text-sm text-gray-700">Set {{ index + 1 }}</p>
              <p class="text-indigo-600">{{ set.teamScore }} - {{ set.opponentScore }}</p>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Team Performance -->
      <div class="mb-8 bg-white p-4 rounded-lg shadow-md">
        <h3 class="text-xl md:text-2xl font-semibold mb-4 text-indigo-600">Team Performance</h3>
        <div class="flex flex-col md:flex-row justify-between gap-4">
          <div class="w-full md:w-1/2 mb-4">
            <RadarChart :data="teamPerformanceData" />
          </div>
          <div class="w-full md:w-1/2 mb-4">
            <DonutChart :data="pointsDistributionData" />
          </div>
        </div>
        <div class="mt-4">
          <h4 class="text-lg font-semibold mb-2 text-gray-700">Team Stats</h4>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            <div v-for="(value, key) in teamStats" :key="key" class="bg-gray-100 p-3 rounded text-center shadow">
              <p class="font-semibold text-sm text-gray-600">{{ formatStat(key) }}</p>
              <p class="text-xl font-bold text-indigo-600">{{ value }}</p>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Player Statistics -->
      <div class="mb-8 bg-white p-4 rounded-lg shadow-md overflow-x-auto">
        <h3 class="text-xl md:text-2xl font-semibold mb-4 text-indigo-600">Player Statistics</h3>
        <table class="w-full min-w-max">
          <thead>
            <tr class="bg-gray-200">
              <th v-for="header in playerStatsHeaders" :key="header" class="p-2 text-left text-sm font-semibold text-gray-600">
                {{ formatStat(header) }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="player in playerStats" :key="player.id" class="border-b hover:bg-gray-50">
              <td v-for="header in playerStatsHeaders" :key="header" class="p-2 text-sm">
                {{ player[header] }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <!-- Player Performance Charts -->
      <div class="mb-8 bg-white p-4 rounded-lg shadow-md">
        <h3 class="text-xl md:text-2xl font-semibold mb-4 text-indigo-600">Player Performance</h3>
        <div v-for="stat in ['points', 'attacks', 'blocks', 'digs', 'serves', 'sets']" :key="stat" class="mb-6">
          <h4 class="text-lg font-semibold mb-2 text-gray-700">{{ formatStat(stat) }}</h4>
          <BarChart :data="getPlayerPerformanceData(stat)" />
        </div>
      </div>
  
      <!-- Rotation Effectiveness -->
      <div class="mb-8 bg-white p-4 rounded-lg shadow-md">
        <h3 class="text-xl md:text-2xl font-semibold mb-4 text-indigo-600">Rotation Effectiveness</h3>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div v-for="rotation in rotationEffectiveness" :key="rotation.position" class="bg-gray-100 p-3 rounded text-center shadow">
            <p class="font-semibold text-sm text-gray-600">Rotation {{ rotation.position }}</p>
            <p class="text-xl font-bold text-indigo-600">{{ rotation.effectiveness.toFixed(2) }}</p>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="p-4 text-center text-xl text-gray-600">
      <p>No game data available.</p>
    </div>
  </template>
  
  <script>
  import { ref, computed } from 'vue';
  import { RadarChart, DonutChart, BarChart } from 'vue-data-ui';
  import { jsPDF } from "jspdf";
  import "jspdf-autotable";
  
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
  
      const playerStatsHeaders = ['name', 'points', 'errors', 'serves', 'aces', 'attacks', 'kills', 'blocks', 'digs', 'sets', 'assists'];
  
      const playerStats = computed(() => {
        return props.game.players.map(playerId => {
          const player = props.game.playerDetails.find(p => p.id === playerId);
          return {
            id: playerId,
            name: player.name,
            points: getPlayerStat(playerId, 'points'),
            errors: getPlayerStat(playerId, 'errors'),
            serves: getPlayerStat(playerId, 'serve'),
            aces: currentSetData.value.filter(e => e.player === playerId && e.action === 'serve' && e.result === 'point').length,
            attacks: getPlayerStat(playerId, 'spike'),
            kills: currentSetData.value.filter(e => e.player === playerId && e.action === 'spike' && e.result === 'point').length,
            blocks: getPlayerStat(playerId, 'block'),
            digs: getPlayerStat(playerId, 'dig'),
            sets: getPlayerStat(playerId, 'set'),
            assists: currentSetData.value.filter(e => e.player === playerId && e.action === 'set' && e.result === 'point').length
          };
        });
      });
  
      const teamStats = computed(() => ({
        totalPoints: teamScore.value,
        aces: currentSetData.value.filter(e => e.action === 'serve' && e.result === 'point').length,
        attackPoints: currentSetData.value.filter(e => e.action === 'spike' && e.result === 'point').length,
        blockPoints: currentSetData.value.filter(e => e.action === 'block' && e.result === 'point').length,
        digs: currentSetData.value.filter(e => e.action === 'dig').length,
        assists: currentSetData.value.filter(e => e.action === 'set' && e.result === 'point').length,
        errors: currentSetData.value.filter(e => e.result === 'error').length,
        sideouts: calculateSideouts()
      }));
  
      const calculateSideouts = () => {
        let sideouts = 0;
        let lastServingTeam = null;
        for (const event of currentSetData.value) {
          if (event.result === 'point') {
            if (lastServingTeam === 'opponent') {
              sideouts++;
            }
            lastServingTeam = 'team';
          } else if (event.result === 'error') {
            if (lastServingTeam === 'team') {
              sideouts++;
            }
            lastServingTeam = 'opponent';
          }
        }
        return sideouts;
      };
  
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
  
      const rotationEffectiveness = computed(() => {
        const rotations = [1, 2, 3, 4, 5, 6];
        return rotations.map(position => {
          const eventsInRotation = currentSetData.value.filter(e => e.rotation === position);
          const pointsScored = eventsInRotation.filter(e => e.result === 'point').length;
          const totalEvents = eventsInRotation.length;
          const effectiveness = totalEvents > 0 ? pointsScored / totalEvents : 0;
          return { position, effectiveness };
        });
      });
  
      const formatStat = (stat) => {
        return stat.split(/(?=[A-Z])/).join(' ').replace(/\b\w/g, l => l.toUpperCase());
      };
  
      const exportStats = (format) => {
        if (format === 'csv') {
          exportCsv();
        } else if (format === 'pdf') {
          exportPdf();
        }
      };
  
      const exportCsv = () => {
        const headers = playerStatsHeaders.map(formatStat);
        const csvContent = [
          headers.join(','),
          ...playerStats.value.map(p => playerStatsHeaders.map(header => p[header]).join(','))
        ].join('\n');
  
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
  
      const exportPdf = () => {
      const doc = new jsPDF();
      
      // Title
      doc.setFontSize(18);
      doc.text("Volley Insights - Game Statistics", 14, 22);
      
      // Game Summary
      doc.setFontSize(14);
      doc.text(`${props.game.name} - ${formatDate(props.game.date)}`, 14, 32);
      doc.setFontSize(12);
      doc.text(`Our Team ${teamScore.value} - ${opponentScore.value} ${opponentTeam.value}`, 14, 40);
      
      // Player Stats Table
      doc.autoTable({
        head: [playerStatsHeaders.map(formatStat)],
        body: playerStats.value.map(p => playerStatsHeaders.map(header => p[header])),
        startY: 50
      });
      
      // Team Stats
      const teamStatsStartY = doc.lastAutoTable.finalY + 10;
      doc.setFontSize(14);
      doc.text("Team Statistics", 14, teamStatsStartY);
      doc.setFontSize(12);
      let yOffset = teamStatsStartY + 10;
      Object.entries(teamStats.value).forEach(([key, value]) => {
        doc.text(`${formatStat(key)}: ${value}`, 14, yOffset);
        yOffset += 7;
      });

      // Rotation Effectiveness
      doc.addPage();
      doc.setFontSize(14);
      doc.text("Rotation Effectiveness", 14, 20);
      doc.autoTable({
        head: [["Rotation", "Effectiveness"]],
        body: rotationEffectiveness.value.map(r => [r.position, r.effectiveness.toFixed(2)]),
        startY: 30
      });

      // Save the PDF
      doc.save(`game_stats_${selectedSet.value === 'all' ? 'all_sets' : `set_${selectedSet.value}`}.pdf`);
    };

    const formatDate = (dateString) => {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return {
      selectedSet,
      teamScore,
      opponentScore,
      opponentTeam,
      setsWon,
      playerStats,
      playerStatsHeaders,
      teamStats,
      teamPerformanceData,
      pointsDistributionData,
      rotationEffectiveness,
      getPlayerPerformanceData,
      formatStat,
      exportStats
    };
  }
}
</script>

<style scoped>
.stat-screen {
  font-family: 'Inter', sans-serif;
}

/* Additional styles for better mobile experience */
@media (max-width: 640px) {
  .stat-screen h2 {
    font-size: 1.5rem;
  }

  .stat-screen h3 {
    font-size: 1.25rem;
  }

  .stat-screen h4 {
    font-size: 1.1rem;
  }

  .stat-screen table {
    font-size: 0.875rem;
  }
}
</style>