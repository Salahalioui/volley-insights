<template>
    <div class="home bg-gray-100 min-h-screen p-6 md:p-10">
      <h1 class="text-4xl font-bold mb-8 text-center text-blue-600 md:text-5xl">
        Welcome to Volley Insights
      </h1>
  
      <div class="max-w-4xl mx-auto">
        <!-- App Description -->
        <div class="bg-white p-6 rounded-lg shadow-md mb-8 md:mb-10">
          <div class="flex items-center mb-4 md:mb-6">
            <img src="@/assets/logo.png" alt="Volleyball" class="w-12 h-12 mr-4" />
            <h2 class="text-2xl font-semibold">Elevate Your Volleyball Analysis</h2>
          </div>
          <p class="text-gray-700 text-lg">
            Volley Insights is your comprehensive tool for volleyball match analysis.
            Record games, track player performance, and gain valuable insights to
            improve your team's strategy.
          </p>
        </div>
  
        <!-- Quick Actions -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 md:mb-10">
          <div class="bg-white p-6 rounded-lg shadow-md">
            <h3 class="text-xl font-semibold mb-4">Start a New Game</h3>
            <p class="text-gray-700 mb-4">
              Record a new match with real-time event tracking and advanced statistics.
            </p>
            <BaseButton @click="navigateToCreateGame" class="w-full">Create New Game</BaseButton>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-md">
            <h3 class="text-xl font-semibold mb-4">Manage Your Team</h3>
            <p class="text-gray-700 mb-4">
              Update your roster, add players, and manage team information.
            </p>
            <BaseButton @click="navigateToTeam" class="w-full">Go to My Team</BaseButton>
          </div>
        </div>
  
        <!-- Recent Games -->
        <div class="bg-white p-6 rounded-lg shadow-md mb-8 md:mb-10">
          <h3 class="text-xl font-semibold mb-4">Recent Games</h3>
          <div v-if="recentGames.length > 0">
            <div v-for="game in recentGames" :key="game.id" class="mb-4 p-4 bg-gray-100 rounded flex justify-between items-center">
              <div class="flex items-center">
                <span class="text-gray-700 mr-4">{{ game.name }}</span>
                <span class="text-gray-500 text-sm">{{ formatDate(game.date) }}</span>
              </div>
              <div>
                <BaseButton v-if="game.status === 'completed'" @click="viewGameStats(game.id)" size="small" class="mr-2">
                  View Stats
                </BaseButton>
                <BaseButton v-else @click="continueGame(game.id)" size="small">
                  Continue Game
                </BaseButton>
              </div>
            </div>
          </div>
          <p v-else class="text-gray-700">No recent games. Start by creating a new game!</p>
          <BaseButton @click="navigateToResults" class="mt-4 w-full">
            View All Games
          </BaseButton>
        </div>
  
        <!-- Quick Stats -->
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h3 class="text-xl font-semibold mb-4">Team Overview</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="text-center">
              <p class="text-2xl font-bold text-blue-600">{{ totalGames }}</p>
              <p class="text-gray-700 text-lg">Total Games</p>
            </div>
            <div class="text-center">
              <p class="text-2xl font-bold text-green-600">{{ winPercentage }}%</p>
              <p class="text-gray-700 text-lg">Win Percentage</p>
            </div>
            <div class="text-center">
              <p class="text-2xl font-bold text-purple-600">{{ totalPlayers }}</p>
              <p class="text-gray-700 text-lg">Players</p>
            </div>
            <div class="text-center">
              <p class="text-2xl font-bold text-red-600">{{ topScorer.name }}</p>
              <p class="text-gray-700 text-lg">Top Scorer</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import BaseButton from '@/components/common/BaseButton.vue';
  
  export default {
    name: 'HomeView',
    components: {
      BaseButton
    },
    setup() {
      const router = useRouter();
      const recentGames = ref([]);
      const totalGames = ref(0);
      const totalPlayers = ref(0);
      const topScorer = ref({ name: 'N/A', points: 0 });
  
      onMounted(() => {
        fetchData();
      });
  
      const fetchData = () => {
        // Fetch games data
        const storedGames = JSON.parse(localStorage.getItem('games') || '[]');
        recentGames.value = storedGames.slice(-5).reverse(); // Get last 5 games
        totalGames.value = storedGames.length;
  
        // Fetch players data
        const storedPlayers = JSON.parse(localStorage.getItem('players') || '[]');
        totalPlayers.value = storedPlayers.length;
  
        // Calculate top scorer
        if (storedGames.length > 0 && storedPlayers.length > 0) {
          const playerScores = {};
          storedGames.forEach(game => {
            game.sets.forEach(set => {
              set.events.forEach(event => {
                if (event.action === 'spike' && event.result === 'point') {
                  playerScores[event.player] = (playerScores[event.player] || 0) + 1;
                }
              });
            });
          });
          const topScorerId = Object.keys(playerScores).reduce((a, b) => playerScores[a] > playerScores[b] ? a : b);
          const topScorerPlayer = storedPlayers.find(player => player.id === parseInt(topScorerId));
          if (topScorerPlayer) {
            topScorer.value = { name: topScorerPlayer.name, points: playerScores[topScorerId] };
          }
        }
      };
  
      const winPercentage = computed(() => {
        const completedGames = recentGames.value.filter(game => game.status === 'completed');
        const wins = completedGames.filter(game => {
          const teamSets = game.sets.filter(set => set.teamScore > set.opponentScore).length;
          return teamSets > game.sets.length / 2;
        }).length;
        return completedGames.length > 0 ? Math.round((wins / completedGames.length) * 100) : 0;
      });
  
      const navigateToCreateGame = () => router.push('/create-game');
      const navigateToTeam = () => router.push('/team');
      const navigateToResults = () => router.push('/results');
      const viewGameStats = (gameId) => router.push({ name: 'GameStats', params: { id: gameId } });
      const continueGame = (gameId) => router.push({ name: 'GameView', params: { id: gameId } });
  
      const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
      };
  
      return {
        recentGames,
        totalGames,
        totalPlayers,
        topScorer,
        winPercentage,
        navigateToCreateGame,
        navigateToTeam,
        navigateToResults,
        viewGameStats,
        continueGame,
        formatDate
      };
    }
  };
  </script>
  