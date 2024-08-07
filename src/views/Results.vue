<template>
    <div class="results-screen p-4 sm:p-6 bg-gray-100 min-h-screen">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-3xl font-bold mb-8 text-center text-gray-800">Recent Games</h2>
  
        <!-- Search, Filter, Sort, and Import/Export Options -->
        <div class="mb-6 space-y-4">
          <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div class="relative flex-grow">
              <input 
                v-model="searchQuery" 
                placeholder="Search games..." 
                class="p-3 pl-10 border rounded-lg w-full focus:ring-2 focus:ring-blue-300 transition duration-300"
              >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <select 
                v-model="statusFilter" 
                class="p-3 border rounded-lg focus:ring-2 focus:ring-blue-300 transition duration-300"
              >
                <option value="all">All Games</option>
                <option value="completed">Completed</option>
                <option value="in_progress">In Progress</option>
              </select>
              <select 
                v-model="sortOption" 
                class="p-3 border rounded-lg focus:ring-2 focus:ring-blue-300 transition duration-300"
              >
                <option value="date">Sort by Date</option>
                <option value="name">Sort by Name</option>
              </select>
            </div>
          </div>
          <div class="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
            <button 
              @click="exportAllGames" 
              class="bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 transition duration-300 w-full sm:w-auto flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export All Games
            </button>
            <label class="bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition duration-300 cursor-pointer text-center w-full sm:w-auto flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Import Games
              <input type="file" @change="importGames" accept=".json" class="hidden">
            </label>
          </div>
        </div>
  
        <!-- Game List -->
        <TransitionGroup name="list" tag="div" class="game-list space-y-4">
          <div 
            v-for="game in paginatedGames" 
            :key="game.id" 
            class="game-item bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
              <h1 class="text-xl font-semibold text-gray-800">{{ game.name }}</h1>
              <span 
                class="text-sm font-medium px-3 py-1 rounded-full mt-2 sm:mt-0"
                :class="{
                  'bg-green-100 text-green-800': game.status === 'completed',
                  'bg-yellow-100 text-yellow-800': game.status === 'in_progress'
                }"
              >
                {{ formatStatus(game.status) }}
              </span>
            </div>
            <p class="text-gray-600 mb-2">{{ formatDate(game.date) }}</p>
            <p class="text-lg font-medium mb-4">
              <span class="text-blue-600">Our Team:</span> {{ getGameScore(game).team }} - 
              <span class="text-red-600">{{ game.opponentTeam }}:</span> {{ getGameScore(game).opponent }}
            </p>
            <div class="flex flex-wrap justify-end space-x-2 space-y-2 sm:space-y-0">
              <button 
                v-if="game.status === 'completed'" 
                @click="viewGameStats(game.id)"
                class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                View Stats
              </button>
              <button 
                v-else 
                @click="continueGame(game.id)"
                class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Continue Game
              </button>
              <button 
                @click="exportGame(game)"
                class="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition duration-300 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export
              </button>
              <button 
                @click="deleteGame(game.id)"
                class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
          </div>
        </TransitionGroup>
  
        <!-- Pagination -->
        <div v-if="totalPages > 1" class="pagination mt-8 flex justify-center space-x-2">
          <button 
            @click="currentPage--" 
            :disabled="currentPage === 1" 
            class="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition duration-300 disabled:opacity-50 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </button>
          <button 
            v-for="page in displayedPages" 
            :key="page" 
            @click="currentPage = page"
            :class="[
              'px-4 py-2 rounded-lg transition duration-300',
              currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
            ]"
          >
            {{ page }}
          </button>
          <button 
            @click="currentPage++" 
            :disabled="currentPage === totalPages" 
            class="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition duration-300 disabled:opacity-50 flex items-center"
          >
            Next
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
  
        <!-- Loading and Error States -->
        <div v-if="isLoading" class="text-center mt-8 text-gray-600">
          <svg class="animate-spin h-8 w-8 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading games...
        </div>
        <div v-if="error" class="text-center mt-8 text-red-500 bg-red-100 p-4 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {{ error }}
        </div>
  
        <!-- Confirmation Modal -->
        <ConfirmationModal 
          v-if="showDeleteConfirmation"
          :message="'Are you sure you want to delete this game?'"
          @confirm="confirmDelete"
          @cancel="cancelDelete"
        />
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import ConfirmationModal from '../components/ConfirmationModal.vue';
  
  export default {
    name: 'ResultsScreen',
    components: {
      ConfirmationModal
    },
    setup() {
      const router = useRouter();
      const games = ref([]);
      const statusFilter = ref('all');
      const sortOption = ref('date');
      const searchQuery = ref('');
      const currentPage = ref(1);
      const gamesPerPage = 10;
      const isLoading = ref(true);
      const error = ref(null);
      const showDeleteConfirmation = ref(false);
      const gameToDelete = ref(null);
  
      const fetchGames = async () => {
        isLoading.value = true;
        error.value = null;
        try {
          const storedGames = localStorage.getItem('games');
          if (storedGames) {
            games.value = JSON.parse(storedGames);
          }
        } catch (err) {
          console.error('Error fetching games:', err);
          error.value = 'Failed to load games. Please try again.';
        } finally {
          isLoading.value = false;
        }
      };
  
      onMounted(fetchGames);
  
      const filteredAndSortedGames = computed(() => {
        let filtered = games.value;
        if (statusFilter.value !== 'all') {
          filtered = filtered.filter(game => game.status === statusFilter.value);
        }
        if (searchQuery.value) {
          const query = searchQuery.value.toLowerCase();
          filtered = filtered.filter(game => 
            game.name.toLowerCase().includes(query) ||
            game.opponentTeam.toLowerCase().includes(query)
          );
        }
        
        return filtered.sort((a, b) => {
          if (sortOption.value === 'date') {
            return new Date(b.date) - new Date(a.date);
          } else {
            return a.name.localeCompare(b.name);
          }
        });
      });
  
      const totalPages = computed(() => {
        return Math.ceil(filteredAndSortedGames.value.length / gamesPerPage);
      });
  
      const paginatedGames = computed(() => {
        const startIndex = (currentPage.value - 1) * gamesPerPage;
        const endIndex = startIndex + gamesPerPage;
        return filteredAndSortedGames.value.slice(startIndex, endIndex);
      });
  
      const displayedPages = computed(() => {
        const range = 2;
        const start = Math.max(1, currentPage.value - range);
        const end = Math.min(totalPages.value, currentPage.value + range);
        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
      });
  
      watch([statusFilter, sortOption, searchQuery], () => {
        currentPage.value = 1;
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
        router.push({ name: 'StatScreen', params: { id: gameId } });
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
  
      const deleteGame = (gameId) => {
        gameToDelete.value = gameId;
        showDeleteConfirmation.value = true;
      };
  
      const confirmDelete = () => {
        games.value = games.value.filter(game => game.id !== gameToDelete.value);
        localStorage.setItem('games', JSON.stringify(games.value));
        showDeleteConfirmation.value = false;
        gameToDelete.value = null;
      };
  
      const cancelDelete = () => {
        showDeleteConfirmation.value = false;
        gameToDelete.value = null;
      };
  
      return {
        games,
        statusFilter,
        sortOption,
        searchQuery,
        currentPage,
        paginatedGames,
        totalPages,
        displayedPages,
        isLoading,
        error,
        showDeleteConfirmation,
        formatDate,
        formatStatus,
        getGameScore,
        viewGameStats,
        continueGame,
        exportGame,
        exportAllGames,
        importGames,
        deleteGame,
        confirmDelete,
        cancelDelete
      };
    }
  };
  </script>
  
  <style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>
  