<template>
  <div class="home bg-gradient-to-b from-blue-50 to-blue-100 min-h-screen p-4 md:p-8">
    <h1 class="text-3xl md:text-5xl font-bold mb-6 text-center text-blue-600 animate-fade-in">
      {{ $t('welcome') }}
    </h1>

    <div class="max-w-4xl mx-auto space-y-6">
      <!-- App Description -->
      <div class="bg-white p-6 rounded-lg shadow-lg transition-transform hover:scale-105">
        <div class="flex items-center mb-4">
          <img src="@/assets/logo.png" alt="Volleyball" class="w-12 h-12 mr-4 animate-bounce" />
          <h2 class="text-2xl font-semibold text-blue-700">{{ $t('elevateAnalysis') }}</h2>
        </div>
        <p class="text-gray-700 text-lg leading-relaxed">
          {{ $t('appDescription') }}
        </p>
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div class="bg-white p-6 rounded-lg shadow-lg transition-transform hover:scale-105">
          <h3 class="text-xl font-semibold mb-4 text-blue-600">{{ $t('startNewGame') }}</h3>
          <p class="text-gray-700 mb-4">
            {{ $t('newGameDescription') }}
          </p>
          <BaseButton @click="navigateToCreateGame" class="w-full bg-blue-500 hover:bg-blue-600 text-white">
            {{ $t('createNewGame') }}
          </BaseButton>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-lg transition-transform hover:scale-105">
          <h3 class="text-xl font-semibold mb-4 text-blue-600">{{ $t('manageTeam') }}</h3>
          <p class="text-gray-700 mb-4">
            {{ $t('manageTeamDescription') }}
          </p>
          <BaseButton @click="navigateToTeam" class="w-full bg-green-500 hover:bg-green-600 text-white">
            {{ $t('goToMyTeam') }}
          </BaseButton>
        </div>
      </div>

      <!-- Recent Games -->
      <div class="bg-white p-6 rounded-lg shadow-lg">
        <h3 class="text-xl font-semibold mb-4 text-blue-600">{{ $t('recentGames') }}</h3>
        <div v-if="recentGames.length > 0" class="space-y-4">
          <div v-for="game in recentGames" :key="game.id" 
               class="p-4 bg-gray-50 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
            <div class="flex flex-col sm:flex-row sm:items-center">
              <span class="text-gray-700 font-semibold mr-4">{{ game.name }}</span>
              <span class="text-gray-500 text-sm">{{ formatDate(game.date) }}</span>
            </div>
            <div class="flex space-x-2">
              <BaseButton v-if="game.status === 'completed'" @click="viewGameStats(game.id)" 
                          size="small" class="bg-blue-500 hover:bg-blue-600 text-white">
                {{ $t('viewStats') }}
              </BaseButton>
              <BaseButton v-else @click="continueGame(game.id)" 
                          size="small" class="bg-green-500 hover:bg-green-600 text-white">
                {{ $t('continueGame') }}
              </BaseButton>
            </div>
          </div>
        </div>
        <p v-else class="text-gray-700">{{ $t('noRecentGames') }}</p>
        <BaseButton @click="navigateToResults" class="mt-4 w-full bg-indigo-500 hover:bg-indigo-600 text-white">
          {{ $t('viewAllGames') }}
        </BaseButton>
      </div>

      <!-- Quick Stats -->
      <div class="bg-white p-6 rounded-lg shadow-lg">
        <h3 class="text-xl font-semibold mb-4 text-blue-600">{{ $t('teamOverview') }}</h3>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard :title="$t('totalGames')" :value="totalGames" color="blue" />
          <StatCard :title="$t('winPercentage')" :value="`${winPercentage}%`" color="green" />
          <StatCard :title="$t('players')" :value="totalPlayers" color="purple" />
          <StatCard :title="$t('topScorer')" :value="topScorer.name" color="red" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import BaseButton from '@/components/common/BaseButton.vue';
import StatCard from '@/components/common/StatCard.vue';

export default {
  name: 'HomeView',
  components: {
    BaseButton,
    StatCard
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
  const storedGames = JSON.parse(localStorage.getItem('games') || '[]');
  const storedPlayers = JSON.parse(localStorage.getItem('players') || '[]');

  recentGames.value = storedGames.slice(-5).reverse();
  totalGames.value = storedGames.length;
  totalPlayers.value = storedPlayers.length;

  // Calculate top scorer (based on all points)
  if (storedGames.length > 0 && storedPlayers.length > 0) {
    const playerScores = {};
    storedGames.forEach(game => {
      game.sets.forEach(set => {
        set.events.forEach(event => {
          if (event.result === 'point') { // Count all points
            playerScores[event.player] = (playerScores[event.player] || 0) + 1;
          }
        });
      });
    });

    // Find the player with the highest score
    const topScorerId = Object.keys(playerScores).length > 0
      ? Object.keys(playerScores).reduce((a, b) => playerScores[a] > playerScores[b] ? a : b)
      : null;

    const topScorerPlayer = storedPlayers.find(player => player.id === parseInt(topScorerId));
    if (topScorerPlayer) {
      topScorer.value = { name: topScorerPlayer.name, points: playerScores[topScorerId] };
    } else {
      topScorer.value = { name: 'N/A', points: 0 };
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
    const viewGameStats = (gameId) => router.push({ name: 'StatScreen', params: { id: gameId } }); // Corrected route name
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