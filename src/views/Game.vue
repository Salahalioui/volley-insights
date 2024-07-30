<template>
    <div v-if="game" class="game-page p-2 md:p-4 max-w-4xl mx-auto">
      <h1 class="text-2xl md:text-3xl font-bold mb-4">{{ game.name }}</h1>
      
      <!-- Game Info and Controls -->
      <div class="game-info-controls mb-4 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div class="game-info p-2 md:p-4 bg-gray-100 rounded-lg mb-2 md:mb-0">
          <p><strong>Date:</strong> {{ formatDate(game.date) }}</p>
          <p><strong>Opponent:</strong> {{ game.opponentTeam }}</p>
          <p><strong>Status:</strong> {{ game.status }}</p>
        </div>
        <div class="game-controls flex flex-wrap justify-start md:justify-end">
          <button @click="undoLastEvent" class="bg-yellow-500 text-white p-2 rounded mr-2 mb-2 md:mb-0" :disabled="!canUndo">Undo</button>
          <button @click="redoLastEvent" class="bg-green-500 text-white p-2 rounded mr-2 mb-2 md:mb-0" :disabled="!canRedo">Redo</button>
          <button @click="toggleGameStatus" class="bg-blue-500 text-white p-2 rounded mb-2 md:mb-0">
            {{ game.status === 'in_progress' ? 'Pause Game' : 'Resume Game' }}
          </button>
        </div>
      </div>
  
      <!-- Scoreboard -->
      <div class="scoreboard mb-4 p-2 md:p-4 bg-blue-100 rounded-lg flex justify-between items-center">
        <div class="team-score text-center">
          <h2 class="text-lg md:text-xl font-bold">Our Team</h2>
          <p class="text-3xl md:text-4xl font-bold">{{ currentSet.teamScore }}</p>
          <button @click="adjustScore('team', 1)" class="bg-green-500 text-white p-1 rounded mr-1">+</button>
          <button @click="adjustScore('team', -1)" class="bg-red-500 text-white p-1 rounded">-</button>
        </div>
        <div class="set-info text-center">
          <p class="text-xl md:text-2xl font-bold">Set {{ game.currentSet }}</p>
          <p class="text-lg md:text-xl">{{ setsWon.team }} - {{ setsWon.opponent }}</p>
        </div>
        <div class="opponent-score text-center">
          <h2 class="text-lg md:text-xl font-bold">{{ game.opponentTeam }}</h2>
          <p class="text-3xl md:text-4xl font-bold">{{ currentSet.opponentScore }}</p>
          <button @click="adjustScore('opponent', 1)" class="bg-green-500 text-white p-1 rounded mr-1">+</button>
          <button @click="adjustScore('opponent', -1)" class="bg-red-500 text-white p-1 rounded">-</button>
        </div>
      </div>
  
      <!-- Event Input Toggle -->
      <div class="mb-4 flex justify-center">
        <button @click="toggleInputMethod" class="bg-purple-500 text-white p-2 rounded">
          Switch to {{ isAdvancedInput ? 'Basic' : 'Advanced' }} Input
        </button>
      </div>
  
      <!-- Basic Event Input -->
      <div v-if="!isAdvancedInput" class="event-input mb-4">
        <h2 class="text-xl font-bold mb-2">Record Event</h2>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
          <button v-for="playerId in currentRotation" :key="playerId"
                  @click="selectPlayer(playerId)"
                  :class="['p-2 rounded text-white', currentEvent.player === playerId ? 'bg-blue-600' : 'bg-blue-400']">
            {{ getPlayerName(playerId) }}
          </button>
        </div>
        <div class="grid grid-cols-3 gap-2 mt-2">
          <button v-for="action in ['serve', 'receive', 'set', 'spike', 'block', 'dig']" :key="action"
                  @click="selectAction(action)"
                  :class="['p-2 rounded text-white', currentEvent.action === action ? 'bg-green-600' : 'bg-green-400']">
            {{ action }}
          </button>
        </div>
        <div class="grid grid-cols-3 gap-2 mt-2">
          <button v-for="result in ['point', 'error', 'continue']" :key="result"
                  @click="selectResult(result)"
                  :class="['p-2 rounded text-white', currentEvent.result === result ? 'bg-red-600' : 'bg-red-400']">
            {{ result }}
          </button>
        </div>
        <button @click="recordEvent" class="mt-2 bg-purple-500 text-white p-2 rounded w-full">
          Record Event
        </button>
      </div>
  
      <!-- Advanced Event Input -->
      <div v-else class="event-input mb-4">
        <h2 class="text-xl font-bold mb-2">Advanced Event Input</h2>
        <div class="grid grid-cols-2 gap-2">
          <select v-model="currentEvent.player" class="p-2 border rounded">
            <option value="">Select Player</option>
            <option v-for="playerId in currentRotation" :key="playerId" :value="playerId">
              {{ getPlayerName(playerId) }}
            </option>
          </select>
          <select v-model="currentEvent.action" class="p-2 border rounded">
            <option value="">Select Action</option>
            <option value="serve">Serve</option>
            <option value="receive">Receive</option>
            <option value="set">Set</option>
            <option value="spike">Spike</option>
            <option value="block">Block</option>
            <option value="dig">Dig</option>
          </select>
          <select v-model="currentEvent.type" class="p-2 border rounded">
            <option value="">Type of Action</option>
            <option v-for="type in getActionTypes" :key="type" :value="type">{{ type }}</option>
          </select>
          <select v-model="currentEvent.evaluation" class="p-2 border rounded">
            <option value="">Evaluation</option>
            <option v-for="evaluation in getEvaluations" :key="evaluation" :value="evaluation">{{ evaluation }}</option>
          </select>
          <select v-model="currentEvent.result" class="p-2 border rounded">
            <option value="">Result</option>
            <option value="point">Point</option>
            <option value="error">Error</option>
            <option value="continue">Continue</option>
          </select>
          <input v-model="currentEvent.target" placeholder="Target (if needed)" class="p-2 border rounded">
        </div>
        <button @click="recordAdvancedEvent" class="mt-2 bg-purple-500 text-white p-2 rounded w-full">
          Record Advanced Event
        </button>
      </div>
  
      <!-- Substitution Section -->
      <div class="substitution mb-4">
        <h2 class="text-xl font-bold mb-2">Substitutions</h2>
        <div class="grid grid-cols-2 gap-2">
          <select v-model="substitution.outPlayer" class="p-2 border rounded">
            <option value="">Player Out</option>
            <option v-for="playerId in currentRotation" :key="playerId" :value="playerId">
              {{ getPlayerName(playerId) }}
            </option>
          </select>
          <select v-model="substitution.inPlayer" class="p-2 border rounded">
            <option value="">Player In</option>
            <option v-for="playerId in benchPlayers" :key="playerId" :value="playerId">
              {{ getPlayerName(playerId) }}
            </option>
          </select>
        </div>
        <button @click="makeSubstitution" class="mt-2 bg-yellow-500 text-white p-2 rounded w-full">
          Substitute
        </button>
      </div>
  
      <!-- Rotation Tracker -->
      <div class="rotation-tracker mb-4">
        <h2 class="text-xl font-bold mb-2">Current Rotation</h2>
        <div class="relative w-full aspect-[3/2] bg-blue-100 border-2 border-blue-500 rounded-lg" style="max-height: 200px;">
          <!-- Back Row -->
          <div v-for="(position, index) in [1, 6, 5]" :key="position" 
               class="absolute w-[25%] text-center p-1"
               :style="{
                 top: '10%',
                 left: index === 0 ? '10%' : index === 1 ? '37.5%' : '65%',
                 fontSize: '0.8rem'
               }">
            <p class="font-bold">P{{ position }}</p>
            <p>{{ getPlayerName(currentRotation[position - 1]) }}</p>
          </div>
          <!-- Front Row -->
          <div v-for="(position, index) in [2, 3, 4]" :key="position"
               class="absolute w-[25%] text-center p-1"
               :style="{
                 bottom: '10%',
                 left: index === 0 ? '10%' : index === 1 ? '37.5%' : '65%',
                 fontSize: '0.8rem'
               }">
            <p class="font-bold">P{{ position }}</p>
            <p>{{ getPlayerName(currentRotation[position - 1]) }}</p>
          </div>
        </div>
      </div>
  
      <!-- Player Statistics -->
      <div class="player-statistics mb-4">
        <h2 class="text-xl font-bold mb-2">Player Statistics</h2>
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white">
            <thead class="bg-gray-100">
              <tr>
                <th class="py-2 px-4 text-left">Player</th>
                <th class="py-2 px-4 text-left">Points</th>
                <th class="py-2 px-4 text-left">Errors</th>
                <th class="py-2 px-4 text-left">Serves</th>
                <th class="py-2 px-4 text-left">Attacks</th>
                <th class="py-2 px-4 text-left">Blocks</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="playerId in game.players" :key="playerId">
                <td class="py-2 px-4">{{ getPlayerName(playerId) }}</td>
                <td class="py-2 px-4">{{ getPlayerStat(playerId, 'points') }}</td>
                <td class="py-2 px-4">{{ getPlayerStat(playerId, 'errors') }}</td>
                <td class="py-2 px-4">{{ getPlayerStat(playerId, 'serves') }}</td>
                <td class="py-2 px-4">{{ getPlayerStat(playerId, 'attacks') }}</td>
                <td class="py-2 px-4">{{ getPlayerStat(playerId, 'blocks') }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
  
      <!-- Recent Events -->
      <div class="recent-events">
        <h2 class="text-xl font-bold mb-2">Recent Events</h2>
        <ul class="space-y-2">
          <li v-for="event in recentEvents" :key="event.id" class="p-2 bg-gray-100 rounded text-sm">
            <template v-if="event.type === 'substitution'">
              Substitution: {{ getPlayerName(event.outPlayer) }} out, {{ getPlayerName(event.inPlayer) }} in
            </template>
            <template v-else>
              {{ getPlayerName(event.player) }} - {{ event.action }} 
              <template v-if="event.type">- {{ event.type }}</template>
              <template v-if="event.evaluation">- {{ event.evaluation }}</template>
              - {{ event.result }}
              <template v-if="event.target">- Target: {{ event.target }}</template>
            </template>
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  
  export default {
    name: 'GameView',
    setup() {
      const route = useRoute();
      const router = useRouter();
      const game = ref(null);
      const currentEvent = ref({ player: '', action: '', type: '', evaluation: '', result: '', target: '' });
      const substitution = ref({ outPlayer: '', inPlayer: '' });
      const players = ref([]);
      const undoStack = ref([]);
      const redoStack = ref([]);
      const isAdvancedInput = ref(false);
  
      onMounted(() => {
        const games = JSON.parse(localStorage.getItem('games') || '[]');
        game.value = games.find(g => g.id === parseInt(route.params.id));
        if (!game.value) {
          router.push({ name: 'Home' });
          return;
        }
        
        const storedPlayers = JSON.parse(localStorage.getItem('players') || '[]');
        players.value = storedPlayers;
  
        if (game.value.sets.length === 0) {
          startNewSet();
        }
  
        if (!game.value.currentRotation) {
          game.value.currentRotation = [...game.value.initialRotation];
        }
  
        if (!game.value.status) {
          game.value.status = 'not_started';
        }
      });
  
      const currentSet = computed(() => {
        return game.value.sets[game.value.currentSet - 1] || { teamScore: 0, opponentScore: 0, events: [] };
      });
  
      const currentRotation = computed(() => {
        return game.value.currentRotation;
      });
  
      const benchPlayers = computed(() => {
        return game.value.players.filter(playerId => !currentRotation.value.includes(playerId));
      });
  
      const setsWon = computed(() => {
      const team = game.value.sets.filter(set => set.teamScore > set.opponentScore).length;
      const opponent = game.value.sets.filter(set => set.opponentScore > set.teamScore).length;
      return { team, opponent };
    });

    const recentEvents = computed(() => {
      return currentSet.value.events.slice(-5).reverse();
    });

    const canUndo = computed(() => undoStack.value.length > 0);
    const canRedo = computed(() => redoStack.value.length > 0);

    const getActionTypes = computed(() => {
      switch (currentEvent.value.action) {
        case 'serve':
          return ['Float', 'Jump', 'Topspin'];
        case 'receive':
          return ['Forearm', 'Overhead'];
        case 'set':
          return ['Front', 'Back', 'Jump'];
        case 'spike':
          return ['Power', 'Off-speed', 'Tip'];
        case 'block':
          return ['Stuff', 'Soft'];
        case 'dig':
          return ['Forearm', 'Overhead', 'Dive'];
        default:
          return [];
      }
    });

    const getEvaluations = computed(() => {
      return ['Perfect', 'Good', 'OK', 'Poor'];
    });

    const getPlayerName = (playerId) => {
      const player = players.value.find(p => p.id === playerId);
      return player ? player.name : 'Unknown Player';
    };

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString();
    };

    const startNewSet = () => {
      game.value.sets.push({
        setNumber: game.value.sets.length + 1,
        teamScore: 0,
        opponentScore: 0,
        events: []
      });
      game.value.currentSet = game.value.sets.length;
      saveGame();
    };

    const recordEvent = () => {
      if (!currentEvent.value.player || !currentEvent.value.action || !currentEvent.value.result) {
        alert('Please fill in all required event details');
        return;
      }

      const event = {
        id: Date.now(),
        ...currentEvent.value
      };

      undoStack.value.push({ type: 'event', data: { ...currentSet.value } });
      redoStack.value = [];

      currentSet.value.events.push(event);

      if (event.result === 'point') {
        currentSet.value.teamScore++;
        rotateTeam();
      } else if (event.result === 'error') {
        currentSet.value.opponentScore++;
      }

      checkSetEnd();

      // Reset current event
      currentEvent.value = { player: '', action: '', type: '', evaluation: '', result: '', target: '' };

      saveGame();
    };

    const recordAdvancedEvent = () => {
      if (!currentEvent.value.player || !currentEvent.value.action || !currentEvent.value.type || 
          !currentEvent.value.evaluation || !currentEvent.value.result) {
        alert('Please fill in all required event details');
        return;
      }

      recordEvent(); // Use the same logic as basic event recording
    };

    const rotateTeam = () => {
      game.value.currentRotation.unshift(game.value.currentRotation.pop());
    };

    const makeSubstitution = () => {
      if (!substitution.value.outPlayer || !substitution.value.inPlayer) {
        alert('Please select both players for substitution');
        return;
      }

      const outIndex = currentRotation.value.indexOf(substitution.value.outPlayer);
      if (outIndex === -1) {
        alert('Selected player is not in the current rotation');
        return;
      }

      undoStack.value.push({ 
        type: 'substitution', 
        data: { 
          rotation: [...game.value.currentRotation],
          events: [...currentSet.value.events]
        } 
      });
      redoStack.value = [];

      // Update rotation
      game.value.currentRotation[outIndex] = substitution.value.inPlayer;

      // Record substitution event
      currentSet.value.events.push({
        id: Date.now(),
        type: 'substitution',
        outPlayer: substitution.value.outPlayer,
        inPlayer: substitution.value.inPlayer
      });

      // Reset substitution form
      substitution.value = { outPlayer: '', inPlayer: '' };

      saveGame();
    };

    const checkSetEnd = () => {
      const { teamScore, opponentScore } = currentSet.value;
      const isRegularSet = game.value.currentSet < 5;
      const pointsToWin = isRegularSet ? 25 : 15;
      const twoPointLead = Math.abs(teamScore - opponentScore) >= 2;

      if ((teamScore >= pointsToWin || opponentScore >= pointsToWin) && twoPointLead) {
        endSet(teamScore > opponentScore ? 'team' : 'opponent');
      }
    };

    const endSet = (winner) => {
      if (winner === 'team') {
        setsWon.value.team++;
      } else {
        setsWon.value.opponent++;
      }

      if (setsWon.value.team === 3 || setsWon.value.opponent === 3) {
        endGame();
      } else {
        startNewSet();
      }
    };

    const endGame = () => {
      game.value.status = 'completed';
      saveGame();
      // Redirect to results page or show game summary
      router.push({ name: 'GameSummary', params: { id: game.value.id } });
    };

    const saveGame = () => {
      const games = JSON.parse(localStorage.getItem('games') || '[]');
      const index = games.findIndex(g => g.id === game.value.id);
      if (index !== -1) {
        games[index] = game.value;
        localStorage.setItem('games', JSON.stringify(games));
      }
    };

    const undoLastEvent = () => {
      if (undoStack.value.length === 0) return;

      const lastAction = undoStack.value.pop();
      redoStack.value.push({ type: lastAction.type, data: { ...currentSet.value } });

      if (lastAction.type === 'event') {
        Object.assign(currentSet.value, lastAction.data);
      } else if (lastAction.type === 'substitution') {
        game.value.currentRotation = [...lastAction.data.rotation];
        currentSet.value.events = [...lastAction.data.events];
      }

      saveGame();
    };

    const redoLastEvent = () => {
      if (redoStack.value.length === 0) return;

      const nextAction = redoStack.value.pop();
      undoStack.value.push({ type: nextAction.type, data: { ...currentSet.value } });

      if (nextAction.type === 'event') {
        Object.assign(currentSet.value, nextAction.data);
      } else if (nextAction.type === 'substitution') {
        game.value.currentRotation = [...nextAction.data.rotation];
        currentSet.value.events = [...nextAction.data.events];
      }

      saveGame();
    };

    const adjustScore = (team, amount) => {
      undoStack.value.push({ type: 'score', data: { ...currentSet.value } });
      redoStack.value = [];

      if (team === 'team') {
        currentSet.value.teamScore += amount;
      } else {
        currentSet.value.opponentScore += amount;
      }

      checkSetEnd();
      saveGame();
    };

    const toggleGameStatus = () => {
      if (game.value.status === 'not_started') {
        game.value.status = 'in_progress';
      } else if (game.value.status === 'in_progress') {
        game.value.status = 'paused';
      } else if (game.value.status === 'paused') {
        game.value.status = 'in_progress';
      }
      saveGame();
    };

    const getPlayerStat = (playerId, statType) => {
      return currentSet.value.events.filter(event => 
        event.player === playerId && 
        (statType === 'points' ? event.result === 'point' :
         statType === 'errors' ? event.result === 'error' :
         statType === event.action)
      ).length;
    };

    const toggleInputMethod = () => {
      isAdvancedInput.value = !isAdvancedInput.value;
    };

    const selectPlayer = (playerId) => {
      currentEvent.value.player = playerId;
    };

    const selectAction = (action) => {
      currentEvent.value.action = action;
    };

    const selectResult = (result) => {
      currentEvent.value.result = result;
    };

    return {
      game,
      currentEvent,
      currentSet,
      currentRotation,
      benchPlayers,
      setsWon,
      recentEvents,
      substitution,
      canUndo,
      canRedo,
      isAdvancedInput,
      getActionTypes,
      getEvaluations,
      getPlayerName,
      formatDate,
      recordEvent,
      recordAdvancedEvent,
      makeSubstitution,
      undoLastEvent,
      redoLastEvent,
      adjustScore,
      toggleGameStatus,
      getPlayerStat,
      toggleInputMethod,
      selectPlayer,
      selectAction,
      selectResult
    };
  }
};
</script>

  