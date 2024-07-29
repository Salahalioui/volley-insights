<template>
    <div class="create-game p-6 bg-gray-100 rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 class="text-2xl font-bold mb-4 text-gray-800">Create New Game</h2>
      
      <form @submit.prevent="showConfirmationModal" class="space-y-6">
        <!-- Game Name -->
        <div>
          <label for="gameName" class="block text-sm font-medium text-gray-700">Game Name</label>
          <input type="text" id="gameName" v-model="gameName" required
                 class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
        </div>
  
        <!-- Game Date -->
        <div>
          <label for="gameDate" class="block text-sm font-medium text-gray-700">Game Date</label>
          <input type="date" id="gameDate" v-model="gameDate" required
                 class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
        </div>
  
        <!-- Opponent Team Name -->
        <div>
          <label for="opponentTeam" class="block text-sm font-medium text-gray-700">Opponent Team Name</label>
          <input type="text" id="opponentTeam" v-model="opponentTeam" required
                 class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
        </div>
  
        <!-- Game Rules -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Game Rules</label>
          <div class="mt-2 space-y-2">
            <div>
              <label for="numberOfSets" class="block text-sm text-gray-600">Number of Sets</label>
              <select id="numberOfSets" v-model="numberOfSets"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
                <option value="3">Best of 3</option>
                <option value="5">Best of 5</option>
              </select>
            </div>
            <div>
              <label for="pointsPerSet" class="block text-sm text-gray-600">Points per Set</label>
              <input type="number" id="pointsPerSet" v-model="pointsPerSet" min="15" max="30"
                     class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
            </div>
          </div>
        </div>
  
        <!-- Player Selection -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Select Players (minimum 6)</label>
          <div class="mt-2 grid grid-cols-2 gap-2">
            <div v-for="player in players" :key="player.id" class="flex items-center">
              <input type="checkbox" :id="'player-' + player.id" v-model="selectedPlayers" :value="player.id"
                     class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
              <label :for="'player-' + player.id" class="ml-2 block text-sm text-gray-900">
                {{ player.name }} ({{ player.role }})
              </label>
            </div>
          </div>
          <p v-if="selectedPlayers.length < 6" class="mt-2 text-sm text-red-600">
            Please select at least 6 players.
          </p>
        </div>
  
        <!-- Initial Rotation -->
        <div v-if="selectedPlayers.length >= 6">
          <label class="block text-sm font-medium text-gray-700">Set Initial Rotation</label>
          <div class="mt-2 grid grid-cols-3 gap-4">
            <div v-for="position in 6" :key="position" class="text-center">
              <label :for="'position-' + position" class="block text-xs font-medium text-gray-700">Position {{ position }}</label>
              <select :id="'position-' + position" v-model="initialRotation[position - 1]"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
                <option value="">Select player</option>
                <option v-for="playerId in selectedPlayers" :key="playerId" :value="playerId">
                  {{ getPlayerName(playerId) }}
                </option>
              </select>
            </div>
          </div>
          <p v-if="!isRotationValid" class="mt-2 text-sm text-red-600">
            Please assign a unique player to each position.
          </p>
        </div>
  
        <button type="submit" 
                :disabled="!isFormValid"
                :class="['w-full p-2 rounded transition duration-300', 
                         isFormValid ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed']">
          Create Game
        </button>
      </form>
  
      <!-- Confirmation Modal -->
      <div v-if="showModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
        <div class="bg-white p-5 rounded-lg shadow-xl max-w-md">
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
      const numberOfSets = ref('3');
      const pointsPerSet = ref(25);
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
          numberOfSets: parseInt(numberOfSets.value),
          pointsPerSet: pointsPerSet.value,
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
        router.push({ name: 'Game', params: { id: gameData.id } });
      };
  
      return {
        gameName,
        gameDate,
        opponentTeam,
        numberOfSets,
        pointsPerSet,
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
  