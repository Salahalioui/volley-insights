<template>
    <div class="results-screen p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 class="text-3xl font-bold mb-6 text-center">Recent Games</h2>
  
      <!-- Filter, Sort, and Import/Export Options -->
      <div class="mb-4 flex flex-wrap justify-between items-center">
        <div class="flex space-x-2 mb-2 sm:mb-0">
          <select v-model="statusFilter" class="p-2 border rounded">
            <option value="all">All Games</option>
            <option value="completed">Completed</option>
            <option value="in_progress">In Progress</option>
          </select>
          <select v-model="sortOption" class="p-2 border rounded">
            <option value="date">Sort by Date</option>
            <option value="name">Sort by Name</option>
          </select>
        </div>
        <div class="flex space-x-2">
          <button @click="exportAllGames" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">
            Export All Games
          </button>
          <label class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition cursor-pointer">
            Import Games
            <input type="file" @change="importGames" accept=".json" class="hidden">
          </label>
        </div>
      </div>
  
      <!-- Game List -->
      <div class="game-list space-y-4">
        <div v-for="game in filteredAndSortedGames" :key="game.id" 
             class="game-item bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow duration-200">
          <div class="flex justify-between items-center">
            <h3 class="text-xl font-semibold">{{ game.name }}</h3>
            <span class="text-sm" :class="{'text-green-500': game.status === 'completed', 'text-yellow-500': game.status === 'in_progress'}">
              {{ formatStatus(game.status) }}
            </span>
          </div>
          <p class="text-gray-600">{{ formatDate(game.date) }}</p>
          <p class="mt-2">
            <span class="font-semibold">Our Team:</span> {{ getGameScore(game).team }} - 
            <span class="font-semibold">{{ game.opponentTeam }}:</span> {{ getGameScore(game).opponent }}
          </p>
          <div class="mt-4 flex justify-end space-x-2">
            <button v-if="game.status === 'completed'" 
                    @click="viewGameStats(game.id)"
                    class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
              View Stats
            </button>
            <button v-else 
                    @click="continueGame(game.id)"
                    class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">
              Continue Game
            </button>
            <button @click="exportGame(game)"
                    class="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition">
              Export
            </button>
          </div>
        </div>
      </div>
  
      <!-- Pagination -->
      <div v-if="totalPages > 1" class="pagination mt-6 flex justify-center space-x-2">
        <button v-for="page in totalPages" :key="page" 
                @click="currentPage = page"
                :class="['px-3 py-1 rounded', currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-200']">
          {{ page }}
        </button>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed } from 'vue';
  import { useRouter } from 'vue-router';
  
  export default {
    name: 'ResultsScreen',
    setup() {
      const router = useRouter();
      const games = ref([]);
      const statusFilter = ref('all');
      const sortOption = ref('date');
      const currentPage = ref(1);
      const gamesPerPage = 10;
  
      const fetchGames = () => {
        const storedGames = localStorage.getItem('games');
        if (storedGames) {
          games.value = JSON.parse(storedGames);
        }
      };
  
      fetchGames();
  
      const filteredAndSortedGames = computed(() => {
        let filtered = games.value;
        if (statusFilter.value !== 'all') {
          filtered = filtered.filter(game => game.status === statusFilter.value);
        }
        
        const sorted = filtered.sort((a, b) => {
          if (sortOption.value === 'date') {
            return new Date(b.date) - new Date(a.date);
          } else {
            return a.name.localeCompare(b.name);
          }
        });
  
        const startIndex = (currentPage.value - 1) * gamesPerPage;
        const endIndex = startIndex + gamesPerPage;
        return sorted.slice(startIndex, endIndex);
      });
  
      const totalPages = computed(() => {
        return Math.ceil(games.value.length / gamesPerPage);
      });
  
      const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
      };
  
      const formatStatus = (status) => {
        return status === 'completed' ? 'Completed' : 'In Progress';
      };
  
      const getGameScore = (game) => {
        const teamScore = game.sets.reduce((sum, set) => sum + set.teamScore, 0);
        const opponentScore = game.sets.reduce((sum, set) => sum + set.opponentScore, 0);
        return { team: teamScore, opponent: opponentScore };
      };
  
      const viewGameStats = (gameId) => {
        router.push({ name: 'GameStats', params: { id: gameId } });
      };
  
      const continueGame = (gameId) => {
        router.push({ name: 'GameView', params: { id: gameId } });
      };
  
      const exportGame = (game) => {
        const gameJson = JSON.stringify(game);
        const blob = new Blob([gameJson], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `game_${game.id}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      };
  
      const exportAllGames = () => {
        const gamesJson = JSON.stringify(games.value);
        const blob = new Blob([gamesJson], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'all_games.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      };
  
      const importGames = (event) => {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            try {
              const importedGames = JSON.parse(e.target.result);
              if (Array.isArray(importedGames)) {
                // Importing multiple games
                games.value = [...games.value, ...importedGames];
              } else {
                // Importing a single game
                games.value.push(importedGames);
              }
              localStorage.setItem('games', JSON.stringify(games.value));
              alert('Games imported successfully!');
            } catch (error) {
              console.error('Error importing games:', error);
              alert('Error importing games. Please check the file format.');
            }
          };
          reader.readAsText(file);
        }
      };
  
      return {
        games,
        statusFilter,
        sortOption,
        currentPage,
        filteredAndSortedGames,
        totalPages,
        formatDate,
        formatStatus,
        getGameScore,
        viewGameStats,
        continueGame,
        exportGame,
        exportAllGames,
        importGames
      };
    }
  };
  </script>
  