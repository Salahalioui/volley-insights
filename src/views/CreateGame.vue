<template>
    <div class="create-game p-6 bg-gray-100 rounded-lg shadow-md max-w-4xl mx-auto">
      <h2 class="text-2xl font-bold mb-4 text-gray-800">Create New Game</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <form @submit.prevent="createGame" class="space-y-6">
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
                        @change="updateCourtPreview"
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
  
        <!-- Court Preview -->
        <div class="court-preview">
          <h3 class="text-lg font-semibold mb-2">Court Preview</h3>
          <canvas ref="courtCanvas" width="400" height="300" class="border border-gray-300"></canvas>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted, watch } from 'vue';
  import { useRouter } from 'vue-router';
  
  export default {
    name: 'CreateGame',
    setup() {
      const router = useRouter();
      const gameName = ref('');
      const gameDate = ref('');
      const players = ref([]);
      const selectedPlayers = ref([]);
      const initialRotation = ref(Array(6).fill(''));
      const courtCanvas = ref(null);
  
      onMounted(() => {
        const storedPlayers = localStorage.getItem('players');
        if (storedPlayers) {
          players.value = JSON.parse(storedPlayers);
        }
        drawCourt();
      });
  
      watch(initialRotation, () => {
        updateCourtPreview();
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
               selectedPlayers.value.length >= 6 &&
               isRotationValid.value;
      });
  
      const createGame = () => {
        if (!isFormValid.value) return;
  
        const gameData = {
          id: Date.now(),
          name: gameName.value,
          date: gameDate.value,
          players: selectedPlayers.value,
          initialRotation: initialRotation.value,
        };
  
        // Save the game to local storage
        const games = JSON.parse(localStorage.getItem('games') || '[]');
        games.push(gameData);
        localStorage.setItem('games', JSON.stringify(games));
  
        // Navigate to the game page
        router.push({ name: 'Game', params: { id: gameData.id } });
      };
  
      const drawCourt = () => {
        const canvas = courtCanvas.value;
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
  
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
  
        // Draw court outline
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.strokeRect(10, 10, width - 20, height - 20);
  
        // Draw center line
        ctx.beginPath();
        ctx.moveTo(width / 2, 10);
        ctx.lineTo(width / 2, height - 10);
        ctx.stroke();
  
        // Draw attack line
        const attackLineOffset = (height - 20) / 3;
        ctx.beginPath();
        ctx.moveTo(10, 10 + attackLineOffset);
        ctx.lineTo(width - 10, 10 + attackLineOffset);
        ctx.stroke();
  
        ctx.beginPath();
        ctx.moveTo(10, height - 10 - attackLineOffset);
        ctx.lineTo(width - 10, height - 10 - attackLineOffset);
        ctx.stroke();
      };
  
      const updateCourtPreview = () => {
        drawCourt();
        const canvas = courtCanvas.value;
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
  
        // Player positions
        const positions = [
          { x: width * 0.25, y: height * 0.2 },
          { x: width * 0.5, y: height * 0.2 },
          { x: width * 0.75, y: height * 0.2 },
          { x: width * 0.75, y: height * 0.5 },
          { x: width * 0.5, y: height * 0.5 },
          { x: width * 0.25, y: height * 0.5 },
        ];
  
        // Draw players
        initialRotation.value.forEach((playerId, index) => {
          if (playerId) {
            const player = players.value.find(p => p.id === playerId);
            if (player) {
              ctx.beginPath();
              ctx.arc(positions[index].x, positions[index].y, 15, 0, 2 * Math.PI);
              ctx.fillStyle = '#4CAF50';
              ctx.fill();
              ctx.fillStyle = '#FFF';
              ctx.font = '12px Arial';
              ctx.textAlign = 'center';
              ctx.fillText(player.name.charAt(0), positions[index].x, positions[index].y + 4);
            }
          }
        });
      };
  
      return {
        gameName,
        gameDate,
        players,
        selectedPlayers,
        initialRotation,
        courtCanvas,
        getPlayerName,
        createGame,
        isRotationValid,
        isFormValid,
        updateCourtPreview,
      };
    }
  };
  </script>
  