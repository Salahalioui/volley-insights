<template>
    <div v-if="game" class="game-page p-2 md:p-4 max-w-4xl mx-auto">
      <h1 class="text-2xl md:text-3xl font-bold mb-4 text-center">{{ game.name }}</h1>
      
      <!-- Game Info and Controls -->
      <div class="game-info-controls mb-4 flex flex-col md:flex-row justify-between items-start md:items-center bg-gray-100 rounded-lg p-4">
        <div class="game-info mb-2 md:mb-0">
          <p><strong>Date:</strong> {{ formatDate(game.date) }}</p>
          <p><strong>Opponent:</strong> {{ game.opponentTeam }}</p>
          <p><strong>Status:</strong> {{ game.status }}</p>
        </div>
        <div class="game-controls flex flex-wrap justify-center md:justify-end mt-2 md:mt-0">
          <button @click="undoLastEvent" class="btn btn-yellow mr-2 mb-2" :disabled="!canUndo">Undo</button>
          <button @click="redoLastEvent" class="btn btn-green mr-2 mb-2" :disabled="!canRedo">Redo</button>
          <button @click="toggleGameStatus" class="btn btn-blue mb-2">
            {{ game.status === 'in_progress' ? 'Pause Game' : 'Resume Game' }}
          </button>
        </div>
      </div>
  
      <!-- Scoreboard -->
      <div v-if="currentSet" class="scoreboard mb-4 p-4 bg-blue-100 rounded-lg flex justify-between items-center">
        <div class="team-score text-center">
          <h2 class="text-lg md:text-xl font-bold">Our Team</h2>
          <p class="text-3xl md:text-4xl font-bold">{{ currentSet.teamScore }}</p>
          <div class="flex justify-center mt-2">
            <button @click="adjustScore('team', 1)" class="btn btn-green mr-1">+</button>
            <button @click="adjustScore('team', -1)" class="btn btn-red">-</button>
          </div>
        </div>
        <div class="set-info text-center">
      <p class="text-xl md:text-2xl font-bold">Set {{ game.currentSet }}</p>
      <p class="text-lg md:text-xl">{{ setsWon.team }} - {{ setsWon.opponent }}</p>
    </div>
        <div class="opponent-score text-center">
          <h2 class="text-lg md:text-xl font-bold">{{ game.opponentTeam }}</h2>
          <p class="text-3xl md:text-4xl font-bold">{{ currentSet.opponentScore }}</p>
          <div class="flex justify-center mt-2">
            <button @click="adjustScore('opponent', 1)" class="btn btn-green mr-1">+</button>
            <button @click="adjustScore('opponent', -1)" class="btn btn-red">-</button>
          </div>
        </div>
      </div>
  
      <!-- Serving Team Switch -->
      <div class="serving-indicator mb-4 text-center p-2 bg-purple-100 rounded-lg">
        <p class="text-lg font-bold mb-2">
          Serving Team: {{ isOpponentServing ? game.opponentTeam : 'Our Team' }}
        </p>
        <button @click="toggleServingTeam" class="btn btn-purple">
          Switch Serving Team
        </button>
      </div>
  
      <!-- Event Input Toggle -->
      <div class="mb-4 flex justify-center">
        <button @click="toggleInputMethod" class="btn btn-purple">
          Switch to {{ isAdvancedInput ? 'Basic' : 'Advanced' }} Input
        </button>
      </div>
  
      <!-- Basic Event Input -->
      <div v-if="!isAdvancedInput" class="event-input mb-4 bg-gray-100 rounded-lg p-4">
        <h2 class="text-xl font-bold mb-2">Record Event</h2>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-2 mb-2">
          <button v-for="playerId in currentRotation" :key="playerId"
                  @click="selectPlayer(playerId)"
                  :class="['btn', currentEvent.player === playerId ? 'btn-blue-active' : 'btn-blue']">
            {{ getPlayerName(playerId) }}
          </button>
        </div>
        <div class="grid grid-cols-3 gap-2 mb-2">
          <button v-for="action in ['serve', 'receive', 'set', 'spike', 'block', 'dig']" :key="action"
                  @click="selectAction(action)"
                  :class="['btn', currentEvent.action === action ? 'btn-green-active' : 'btn-green']">
            {{ action }}
          </button>
        </div>
        <div class="grid grid-cols-3 gap-2 mb-2">
          <button v-for="result in ['point', 'error', 'continue']" :key="result"
                  @click="selectResult(result)"
                  :class="['btn', currentEvent.result === result ? 'btn-red-active' : 'btn-red']">
            {{ result }}
          </button>
        </div>
        <button @click="recordEvent" class="btn btn-purple w-full">
          Record Event
        </button>
      </div>
  
      <!-- Advanced Event Input -->
      <div v-else class="event-input mb-4 bg-gray-100 rounded-lg p-4">
        <h2 class="text-xl font-bold mb-2">Advanced Event Input</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
          <select v-model="currentEvent.player" class="form-select">
            <option value="">Select Player</option>
            <option v-for="playerId in currentRotation" :key="playerId" :value="playerId">
              {{ getPlayerName(playerId) }}
            </option>
          </select>
          <select v-model="currentEvent.action" class="form-select">
            <option value="">Select Action</option>
            <option value="serve">Serve</option>
            <option value="receive">Receive</option>
            <option value="set">Set</option>
            <option value="spike">Spike</option>
            <option value="block">Block</option>
            <option value="dig">Dig</option>
          </select>
          <select v-if="currentEvent.action" v-model="currentEvent.type" class="form-select">
            <option value="">Type of Action</option>
            <option v-for="type in getActionTypes" :key="type" :value="type">{{ type }}</option>
          </select>
          <select v-if="currentEvent.action" v-model="currentEvent.evaluation" class="form-select">
            <option value="">Evaluation</option>
            <option v-for="evaluation in getEvaluations" :key="evaluation" :value="evaluation">{{ evaluation }}</option>
          </select>
          <select v-model="currentEvent.result" class="form-select">
            <option value="">Result</option>
            <option value="point">Point</option>
            <option value="error">Error</option>
            <option value="continue">Continue</option>
          </select>
          <select v-if="['serve', 'spike', 'set'].includes(currentEvent.action)" v-model="currentEvent.target" class="form-select">
            <option value="">Target</option>
            <option v-for="target in getTargets" :key="target" :value="target">{{ target }}</option>
          </select>
        </div>
        <button @click="recordAdvancedEvent" class="btn btn-purple w-full mt-2">
          Record Advanced Event
        </button>
      </div>
  
      <!-- Substitution Section -->
      <div class="substitution mb-4 bg-yellow-100 rounded-lg p-4">
        <h2 class="text-xl font-bold mb-2">Substitutions</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
          <select v-model="substitution.outPlayer" class="form-select">
            <option value="">Player Out</option>
            <option v-for="playerId in currentRotation" :key="playerId" :value="playerId">
              {{ getPlayerName(playerId) }}
            </option>
          </select>
          <select v-model="substitution.inPlayer" class="form-select">
            <option value="">Player In</option>
            <option v-for="playerId in benchPlayers" :key="playerId" :value="playerId">
              {{ getPlayerName(playerId) }}
            </option>
          </select>
        </div>
        <button @click="makeSubstitution" class="btn btn-yellow w-full mt-2">
          Substitute
        </button>
      </div>
  
      <!-- Rotation Tracker -->
      <div class="rotation-tracker mb-4 bg-blue-100 rounded-lg p-4">
        <h2 class="text-xl font-bold mb-2">Current Rotation</h2>
        <div class="relative w-full aspect-[3/2] border-2 border-blue-500 rounded-lg" style="max-height: 200px;">
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
        <button @click="rotateManually" class="btn btn-blue w-full mt-2">
          Rotate Manually
        </button>
      </div>
  
      <!-- Player Statistics -->
      <div class="player-statistics mb-4 bg-gray-100 rounded-lg p-4">
        <h2 class="text-xl font-bold mb-2">Player Statistics</h2>
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white">
            <thead class="bg-gray-200">
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
              <tr v-for="playerId in game.players" :key="playerId" class="border-b">
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
      <div class="recent-events bg-gray-100 rounded-lg p-4">
        <h2 class="text-xl font-bold mb-2">Recent Events</h2>
        <ul class="space-y-2">
          <li v-for="event in recentEvents" :key="event.id" class="p-2 bg-white rounded text-sm shadow">
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
  
      <!-- Stat Screen Toggle -->
      <button @click="toggleStatScreen" class="btn btn-blue mt-4 w-full">
        {{ showStatScreen ? 'Hide Stats' : 'Show Stats' }}
      </button>
  
      <!-- Stat Screen Component -->
      <StatScreen v-if="showStatScreen" :game="gameWithPlayerDetails" />
    </div>
  </template>
  
  <script>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import StatScreen from '../components/StatScreen.vue';

export default {
  name: 'GameView',
  components: {
    StatScreen
  },
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
    const isOpponentServing = ref(false);
    const setsWon = ref({ team: 0, opponent: 0 }); // Declare setsWon as a ref
  

    onMounted(() => {
      try {
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

        // Initialize setsWon if it doesn't exist in loaded game data
        if (!game.value.setsWon) { 
          game.value.setsWon = { team: 0, opponent: 0 };
        } else {
          // Update the ref with the loaded values
          setsWon.value = { ...game.value.setsWon }; 
        }

      } catch (error) {
        console.error("Error loading game data:", error);
        alert("An error occurred while loading the game. Please try again.");
        router.push({ name: 'Home' });
      }
    });

    const currentSet = computed(() => {
      return game.value && game.value.sets[game.value.currentSet - 1]
        ? game.value.sets[game.value.currentSet - 1]
        : { teamScore: 0, opponentScore: 0, events: [] };
    });

    const currentRotation = computed(() => {
      return game.value ? game.value.currentRotation : [];
    });

    const benchPlayers = computed(() => {
      return game.value ? game.value.players.filter(playerId => !currentRotation.value.includes(playerId)) : [];
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

    const getTargets = computed(() => {
      if (['serve', 'spike'].includes(currentEvent.value.action)) {
        return ['Zone 1', 'Zone 2', 'Zone 3', 'Zone 4', 'Zone 5', 'Zone 6'];
      } else if (currentEvent.value.action === 'set') {
        return ['2', '3', '4', 'Back Row'];
      }
      return [];
    });

    const getPlayerName = (playerId) => {
      const player = players.value.find(p => p.id === playerId);
      return player ? player.name : 'Unknown Player';
    };

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString();
    };

    const startNewSet = () => {
      if (!game.value) return;
      game.value.sets.push({
        setNumber: game.value.sets.length + 1,
        teamScore: 0,
        opponentScore: 0,
        events: []
      });
      game.value.currentSet = game.value.sets.length;
      saveGame();
    };

    const rotateTeam = () => {
      if (!game.value || !game.value.currentRotation) return;
      game.value.currentRotation = [
        ...game.value.currentRotation.slice(1),
        game.value.currentRotation[0]
      ];
    };

    const rotateManually = () => {
      rotateTeam();
      saveGame();
    };

    const toggleServingTeam = () => {
      isOpponentServing.value = !isOpponentServing.value;
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

      undoStack.value.push({ 
        type: 'event', 
        data: { 
          set: { ...currentSet.value }, 
          rotation: [...game.value.currentRotation],
          isOpponentServing: isOpponentServing.value
        } 
      });
      redoStack.value = [];

      currentSet.value.events.push(event);

      if (event.result === 'point') {
        currentSet.value.teamScore++;
        if (isOpponentServing.value) {
          rotateTeam();
          isOpponentServing.value = false;
        }
      } else if (event.result === 'error') {
        currentSet.value.opponentScore++;
        if (!isOpponentServing.value) {
          isOpponentServing.value = true;
        }
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
    setsWon.value.team++; // Increment setsWon.value
    game.value.setsWon.team++; // Update game.value.setsWon.team
  } else {
    setsWon.value.opponent++; // Increment setsWon.value
    game.value.setsWon.opponent++; // Update game.value.setsWon.opponent
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
      if (!game.value) return;
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
      redoStack.value.push({ 
        type: lastAction.type, 
        data: { 
          set: { ...currentSet.value }, 
          rotation: [...game.value.currentRotation],
          isOpponentServing: isOpponentServing.value
        } 
      });

      if (lastAction.type === 'event' || lastAction.type === 'score') {
        Object.assign(currentSet.value, lastAction.data.set);
        game.value.currentRotation = [...lastAction.data.rotation];
        isOpponentServing.value = lastAction.data.isOpponentServing;
      } else if (lastAction.type === 'substitution') {
        game.value.currentRotation = [...lastAction.data.rotation];
        currentSet.value.events = [...lastAction.data.events];
      }

      saveGame();
    };

    const redoLastEvent = () => {
      if (redoStack.value.length === 0) return;

      const nextAction = redoStack.value.pop();
      undoStack.value.push({ 
        type: nextAction.type, 
        data: { 
          set: { ...currentSet.value }, 
          rotation: [...game.value.currentRotation],
          isOpponentServing: isOpponentServing.value
        } 
      });

      if (nextAction.type === 'event' || nextAction.type === 'score') {
        Object.assign(currentSet.value, nextAction.data.set);
        game.value.currentRotation = [...nextAction.data.rotation];
        isOpponentServing.value = nextAction.data.isOpponentServing;
      } else if (nextAction.type === 'substitution') {
        game.value.currentRotation = [...nextAction.data.rotation];
        currentSet.value.events = [...nextAction.data.events];
      }

      saveGame();
    };

    const adjustScore = (team, amount) => {
      undoStack.value.push({ 
        type: 'score', 
        data: { 
          set: { ...currentSet.value }, 
          rotation: [...game.value.currentRotation],
          isOpponentServing: isOpponentServing.value
        } 
      });
      redoStack.value = [];

      if (team === 'team') {
        currentSet.value.teamScore += amount;
        if (amount > 0 && isOpponentServing.value) {
          rotateTeam();
          isOpponentServing.value = false;
        }
      } else {
        currentSet.value.opponentScore += amount;
        if (amount > 0 && !isOpponentServing.value) {
          isOpponentServing.value = true;
        }
      }

      checkSetEnd();
      saveGame();
    };

    const toggleGameStatus = () => {
      if (!game.value) return;
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
         statType === 'serves' ? event.action === 'serve' :
         statType === 'attacks' ? event.action === 'spike' :
         statType === 'blocks' ? event.action === 'block' : false)
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
    const showStatScreen = ref(false);
    

    const toggleStatScreen = () => {
      showStatScreen.value = !showStatScreen.value;
    };
    const gameWithPlayerDetails = computed(() => {
      if (!game.value) return null;
      return {
        ...game.value,
        playerDetails: players.value
      };
    });

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
      isOpponentServing,
      getActionTypes,
      getEvaluations,
      getTargets,
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
      selectResult,
      rotateManually,
      toggleServingTeam,
      showStatScreen,
      toggleStatScreen,
      gameWithPlayerDetails
    };
  }
};
</script>
<style scoped>
.btn {
  font-weight: bold;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  transition: background-color 0.3s ease-in-out;
}

.btn-yellow { background-color: #ecc94b; color: white; }
.btn-yellow:hover { background-color: #d69e2e; }
.btn-yellow-active { background-color: #d69e2e; color: white; }

.btn-green { background-color: #48bb78; color: white; }
.btn-green:hover { background-color: #38a169; }
.btn-green-active { background-color: #38a169; color: white; }

.btn-blue { background-color: #4299e1; color: white; }
.btn-blue:hover { background-color: #3182ce; }
.btn-blue-active { background-color: #3182ce; color: white; }

.btn-red { background-color: #f56565; color: white; }
.btn-red:hover { background-color: #e53e3e; }
.btn-red-active { background-color: #e53e3e; color: white; }

.btn-purple { background-color: #9f7aea; color: white; }
.btn-purple:hover { background-color: #805ad5; }
.btn-purple-active { background-color: #805ad5; color: white; }

.form-select {
  display: block;
  width: 100%;
  margin-top: 0.25rem;
  padding: 0.5rem;
  border: 1px solid #d2d6dc;
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.form-select:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(164, 202, 254, 0.45);
  border-color: #a4cafe;
}

.game-page {
  max-width: 56rem;
  margin: 0 auto;
  padding: 0.5rem;
}

@media (min-width: 768px) {
  .game-page {
    padding: 1rem;
  }
}

.game-info-controls,
.scoreboard,
.serving-indicator,
.event-input,
.substitution,
.rotation-tracker,
.player-statistics,
.recent-events {
  margin-bottom: 1rem;
  padding: 1rem;
  border-radius: 0.5rem;
}

.game-info-controls { background-color: #f7fafc; }
.scoreboard { background-color: #ebf8ff; }
.serving-indicator { background-color: #faf5ff; }
.event-input,
.substitution,
.player-statistics,
.recent-events { background-color: #f7fafc; }
.rotation-tracker { background-color: #ebf8ff; }

.rotation-tracker .player-position {
  position: absolute;
  width: 25%;
  text-align: center;
  padding: 0.25rem;
  font-size: 0.8rem;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 0.5rem 1rem;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

thead {
  background-color: #edf2f7;
}
</style>