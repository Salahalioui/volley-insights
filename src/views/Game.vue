<template>
    <div class="game-page p-6 bg-gray-100 min-h-screen">
      <div v-if="game" class="max-w-4xl mx-auto">
        <h1 class="text-2xl font-bold mb-4">{{ game.name }}</h1>
        
        <!-- Game Info Section -->
        <div class="bg-white p-4 rounded-lg shadow mb-4">
          <p><strong>Date:</strong> {{ formatDate(game.date) }}</p>
          <p><strong>Current Set:</strong> {{ currentSet }}</p>
        </div>
  
        <!-- Scoreboard -->
        <div class="bg-white p-4 rounded-lg shadow mb-4 flex justify-between items-center">
          <div>
            <h2 class="text-xl font-semibold">Your Team</h2>
            <div class="text-3xl font-bold">{{ score.team }}</div>
            <div class="space-x-2">
              <button @click="updateScore('team', 1)" class="bg-blue-500 text-white px-2 py-1 rounded">+</button>
              <button @click="updateScore('team', -1)" class="bg-red-500 text-white px-2 py-1 rounded">-</button>
            </div>
          </div>
          <div>
            <h2 class="text-xl font-semibold">Opponent</h2>
            <div class="text-3xl font-bold">{{ score.opponent }}</div>
            <div class="space-x-2">
              <button @click="updateScore('opponent', 1)" class="bg-blue-500 text-white px-2 py-1 rounded">+</button>
              <button @click="updateScore('opponent', -1)" class="bg-red-500 text-white px-2 py-1 rounded">-</button>
            </div>
          </div>
        </div>
  
        <!-- Event Input -->
        <div class="bg-white p-4 rounded-lg shadow mb-4">
          <h2 class="text-xl font-semibold mb-2">Record Event</h2>
          <div class="flex space-x-2 mb-2">
            <select v-model="event.player" class="border rounded p-2">
              <option value="">Select Player</option>
              <option v-for="playerId in game.players" :key="playerId" :value="playerId">
                {{ getPlayerName(playerId) }}
              </option>
            </select>
            <select v-model="event.action" class="border rounded p-2">
              <option value="">Select Action</option>
              <option value="serve">Serve</option>
              <option value="receive">Receive</option>
              <option value="set">Set</option>
              <option value="spike">Spike</option>
              <option value="block">Block</option>
              <option value="dig">Dig</option>
            </select>
            <select v-model="event.result" class="border rounded p-2">
              <option value="">Select Result</option>
              <option value="point">Point</option>
              <option value="error">Error</option>
              <option value="continue">In Play</option>
            </select>
          </div>
          <button @click="recordEvent" class="bg-green-500 text-white px-4 py-2 rounded">Record Event</button>
        </div>
  
        <!-- Rotation Tracker -->
        <div class="bg-white p-4 rounded-lg shadow mb-4">
          <h2 class="text-xl font-semibold mb-2">Current Rotation</h2>
          <div class="grid grid-cols-3 gap-4">
            <div v-for="(playerId, index) in currentRotation" :key="index" class="text-center p-2 border rounded">
              <p class="font-semibold">Position {{ index + 1 }}</p>
              <p>{{ getPlayerName(playerId) }}</p>
            </div>
          </div>
          <button @click="rotateTeam" class="mt-2 bg-blue-500 text-white px-4 py-2 rounded">Rotate Team</button>
        </div>
      </div>
      <div v-else class="text-center text-xl">Loading game data...</div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted, computed } from 'vue';
  import { useRoute } from 'vue-router';
  
  export default {
    name: 'GameView',
    setup() {
      const route = useRoute();
      const game = ref(null);
      const currentSet = ref(1);
      const score = ref({ team: 0, opponent: 0 });
      const event = ref({ player: '', action: '', result: '' });
      const currentRotation = ref([]);
  
      const loadGame = () => {
        const games = JSON.parse(localStorage.getItem('games') || '[]');
        game.value = games.find(g => g.id.toString() === route.params.id);
        if (game.value) {
          currentRotation.value = [...game.value.initialRotation];
        }
      };
  
      onMounted(loadGame);
  
      const players = computed(() => {
        const storedPlayers = JSON.parse(localStorage.getItem('players') || '[]');
        return storedPlayers.filter(player => game.value.players.includes(player.id));
      });
  
      const getPlayerName = (playerId) => {
        const player = players.value.find(p => p.id === playerId);
        return player ? player.name : 'Unknown Player';
      };
  
      const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
      };
  
      const updateScore = (team, points) => {
        score.value[team] += points;
        if (score.value[team] < 0) score.value[team] = 0;
        checkSetEnd();
      };
  
      const checkSetEnd = () => {
        const setPoint = 25; // You might want to make this configurable
        if (score.value.team >= setPoint || score.value.opponent >= setPoint) {
          if (Math.abs(score.value.team - score.value.opponent) >= 2) {
            alert(`Set ${currentSet.value} ended!`);
            currentSet.value++;
            score.value = { team: 0, opponent: 0 };
          }
        }
      };
  
      const recordEvent = () => {
        if (event.value.player && event.value.action && event.value.result) {
          console.log('Event recorded:', event.value);
          // Here you would typically save this event to your game log
          if (event.value.result === 'point') {
            updateScore('team', 1);
          } else if (event.value.result === 'error') {
            updateScore('opponent', 1);
          }
          event.value = { player: '', action: '', result: '' }; // Reset form
        } else {
          alert('Please fill in all event details');
        }
      };
  
      const rotateTeam = () => {
        currentRotation.value.unshift(currentRotation.value.pop());
      };
  
      return {
        game,
        currentSet,
        score,
        event,
        currentRotation,
        getPlayerName,
        formatDate,
        updateScore,
        recordEvent,
        rotateTeam
      };
    }
  };
  </script>
  