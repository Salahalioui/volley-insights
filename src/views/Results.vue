<template>
    <div class="results-screen p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 class="text-3xl font-bold mb-6 text-center">Recent Games</h2>
  
      <!-- Search, Filter, Sort, and Import/Export Options -->
      <div class="mb-4 space-y-4">
        <div class="flex flex-wrap justify-between items-center">
          <input v-model="searchQuery" placeholder="Search games..." class="p-2 border rounded w-full sm:w-auto mb-2 sm:mb-0">
          <div class="flex space-x-2">
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
        </div>
        <div class="flex justify-end space-x-2">
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
      <TransitionGroup name="list" tag="div" class="game-list space-y-4">
        <div v-for="game in paginatedGames" :key="game.id" 
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
          <div class="mt-4 flex flex-wrap justify-end space-x-2 space-y-2">
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
            <button @click="deleteGame(game.id)"
                    class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">
              Delete
            </button>
          </div>
        </div>
      </TransitionGroup>
  
      <!-- Pagination -->
      <div v-if="totalPages > 1" class="pagination mt-6 flex justify-center space-x-2">
        <button @click="currentPage--" :disabled="currentPage === 1" class="px-3 py-1 rounded bg-gray-200 disabled:opacity-50">
          Previous
        </button>
        <button v-for="page in displayedPages" :key="page" 
                @click="currentPage = page"
                :class="['px-3 py-1 rounded', currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-200']">
          {{ page }}
        </button>
        <button @click="currentPage++" :disabled="currentPage === totalPages" class="px-3 py-1 rounded bg-gray-200 disabled:opacity-50">
          Next
        </button>
      </div>
  
      <!-- Loading and Error States -->
      <div v-if="isLoading" class="text-center mt-4">Loading games...</div>
      <div v-if="error" class="text-center mt-4 text-red-500">{{ error }}</div>
  
      <!-- Confirmation Modal -->
      <ConfirmationModal 
        v-if="showDeleteConfirmation"
        :message="'Are you sure you want to delete this game?'"
        @confirm="confirmDelete"
        @cancel="cancelDelete"
      />
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
    transition: all 0.5s ease;
  }
  .list-enter-from,
  .list-leave-to {
    opacity: 0;
    transform: translateX(30px);
  }
  </style>
  