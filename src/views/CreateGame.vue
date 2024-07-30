<template>
    <div class="create-game p-4 sm:p-6 bg-gray-100 rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 class="text-2xl font-bold mb-6 text-gray-800">Create New Game</h2>
      
      <form @submit.prevent="showConfirmationModal" class="space-y-6">
        <!-- Game Name -->
        <div class="form-group">
          <label for="gameName" class="form-label">Game Name</label>
          <input type="text" id="gameName" v-model="gameName" required class="form-input">
        </div>
  
        <!-- Game Date -->
        <div class="form-group">
          <label for="gameDate" class="form-label">Game Date</label>
          <input type="date" id="gameDate" v-model="gameDate" required class="form-input">
        </div>
  
        <!-- Opponent Team Name -->
        <div class="form-group">
          <label for="opponentTeam" class="form-label">Opponent Team Name</label>
          <input type="text" id="opponentTeam" v-model="opponentTeam" required class="form-input">
        </div>
  
        <!-- Player Selection -->
        <div class="form-group">
          <label class="form-label mb-2">Select Players (minimum 6)</label>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div v-for="player in players" :key="player.id" class="flex items-center">
              <input type="checkbox" :id="'player-' + player.id" v-model="selectedPlayers" :value="player.id" class="form-checkbox">
              <label :for="'player-' + player.id" class="ml-2 text-sm text-gray-900">
                {{ player.name }} ({{ player.role }})
              </label>
            </div>
          </div>
          <p v-if="selectedPlayers.length < 6" class="mt-2 text-sm text-red-600">
            Please select at least 6 players.
          </p>
        </div>
  
        <!-- Initial Rotation -->
        <div v-if="selectedPlayers.length >= 6" class="form-group">
          <label class="form-label mb-2">Set Initial Rotation</label>
          <div class="relative w-full aspect-[3/2] bg-blue-100 border-2 border-blue-500 rounded-lg p-2">
            <!-- Court layout -->
            <div class="grid grid-cols-3 grid-rows-2 gap-2 h-full">
              <div v-for="i in 6" :key="i" class="flex items-center justify-center">
                <select v-model="initialRotation[i-1]" class="w-full p-1 text-sm rounded">
                  <option value="">Position {{ i }}</option>
                  <option v-for="playerId in selectedPlayers" :key="playerId" :value="playerId">
                    {{ getPlayerName(playerId) }}
                  </option>
                </select>
              </div>
            </div>
          </div>
          <p v-if="!isRotationValid" class="mt-2 text-sm text-red-600">
            Please assign a unique player to each position.
          </p>
        </div>
  
        <button type="submit" 
                :disabled="!isFormValid"
                :class="['w-full p-3 rounded transition duration-300', 
                         isFormValid ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed']">
          Create Game
        </button>
      </form>
  
      <!-- Confirmation Modal -->
      <div v-if="showModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center p-4">
        <div class="bg-white p-5 rounded-lg shadow-xl max-w-md w-full">
          <h3 class="text-lg font-bold mb-2">Confirm Game Creation</h3>
          <p class="mb-4">Are you sure you want to create this game?</p>
          <div class="flex justify-end space-x-2">
            <button @click="showModal = false" class="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">Cancel</button>
            <button @click="createGame" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Confirm</button>
          </div>
        </div>
      </div>
    </div>
  </template>  
  
  <script>
  import { ref, computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  
  export default {
    name: 'CreateGame',
    setup() {
      const router = useRouter();
      const gameName = ref('');
      const gameDate = ref('');
      const opponentTeam = ref('');
      const players = ref([]);
      const selectedPlayers = ref([]);
      const initialRotation = ref(Array(6).fill(''));
      const showModal = ref(false);
  
      onMounted(() => {
        const storedPlayers = localStorage.getItem('players');
        if (storedPlayers) {
          players.value = JSON.parse(storedPlayers);
        }
      });
  
      const getPlayerName = (playerId) => {
        const player = players.value.find(p => p.id === playerId);
        return player ? player.name : '';
      };
  
      const isRotationValid = computed(() => {
        const filledPositions = initialRotation.value.filter(p => p !== '');
        const uniquePositions = new Set(filledPositions);
        return filledPositions.length === 6 && uniquePositions.size === 6;
      });
  
      const isFormValid = computed(() => {
        return gameName.value.trim() !== '' &&
               gameDate.value !== '' &&
               opponentTeam.value.trim() !== '' &&
               selectedPlayers.value.length >= 6 &&
               isRotationValid.value;
      });
  
      const showConfirmationModal = () => {
        if (isFormValid.value) {
          showModal.value = true;
        }
      };
  
      const createGame = () => {
        const gameData = {
          id: Date.now(),
          name: gameName.value,
          date: gameDate.value,
          opponentTeam: opponentTeam.value,
          players: selectedPlayers.value,
          initialRotation: initialRotation.value,
          sets: [],
          currentSet: 1,
          status: 'not_started'
        };
  
        // Save the game to local storage
        const games = JSON.parse(localStorage.getItem('games') || '[]');
        games.push(gameData);
        localStorage.setItem('games', JSON.stringify(games));
  
        // Navigate to the game page
        router.push({ name: 'GameView', params: { id: gameData.id } });
      };
  
      return {
        gameName,
        gameDate,
        opponentTeam,
        players,
        selectedPlayers,
        initialRotation,
        showModal,
        getPlayerName,
        isRotationValid,
        isFormValid,
        showConfirmationModal,
        createGame,
      };
    }
  };
  </script>
  <style scoped>
  .form-group {
    margin-bottom: 1rem;
  }
  
  .form-label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: #4a5568;
    margin-bottom: 0.25rem;
  }
  
  .form-input {
    display: block;
    width: 100%;
    padding: 0.5rem;
    font-size: 1rem;
    line-height: 1.5;
    color: #4a5568;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid #e2e8f0;
    border-radius: 0.25rem;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  }
  
  .form-input:focus {
    border-color: #63b3ed;
    outline: 0;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
  }
  
  .form-checkbox {
    border-radius: 0.25rem;
    border-color: #e2e8f0;
    color: #4299e1;
  }
  
  .form-checkbox:focus {
    border-color: #63b3ed;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
  }
  </style>