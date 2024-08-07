<template>
  <div v-if="game" class="game-page p-2 md:p-4 max-w-4xl mx-auto">
    <h1 class="text-2xl md:text-3xl font-bold mb-4 text-center">{{ game.name }}</h1>
    
    <!-- Game Info and Controls -->
    <div class="game-info-controls mb-4 flex flex-col items-center bg-gray-100 rounded-lg p-4">
  <div class="game-info text-center mb-2"> <p><strong>{{ game.opponentTeam }}</strong> </p>
    <p class="text-sm text-gray-600">
      {{ formatDate(game.date) }} 
    </p>
    <p>
      <span 
        class="status-indicator"
        :class="{ 
          'in-progress': game.status === 'in_progress', 
          'paused': game.status === 'paused',
          'not-started': game.status === 'not_started' || game.status === 'completed' 
        }"
      > 
        {{ game.status === 'in_progress' ? 'In Progress' : game.status === 'paused' ? 'Paused' : game.status }} 
      </span>
    </p>
  </div>

  <GameControls 
    :canUndo="canUndo"
    :canRedo="canRedo"
    :game="game"
    @undoLastEvent="undoLastEvent"
    @redoLastEvent="redoLastEvent"
    @toggleGameStatus="toggleGameStatus"
  />
</div>

    <!-- Scoreboard -->
    <GameScoreboard
      :currentSet="currentSet"
      :game="game"
      :setsWon="setsWon"
      @adjustScore="adjustScore"
    />

    <!-- Serving Team Switch -->
    <ServingIndicator
      :isOpponentServing="isOpponentServing"
      :game="game"
      @toggleServingTeam="toggleServingTeam"
    />

    <!-- Event Input -->
    <EventInput
      :currentRotation="currentRotation"
      :isAdvancedInput="game.inputMethod === 'advanced'"
      :getPlayerName="getPlayerName"
      :getActionTypes="getActionTypes"
      :getEvaluations="getEvaluations"
      :getTargets="getTargets"
      @selectPlayer="selectPlayer"
      @selectAction="selectAction"
      @selectResult="selectResult"
      @recordEvent="recordEvent"
      @recordAdvancedEvent="recordAdvancedEvent"
    />

    <!-- Substitution Section -->
    <PlayerSubstitution
      :currentRotation="currentRotation"
      :benchPlayers="benchPlayers"
      :getPlayerName="getPlayerName"
      @makeSubstitution="makeSubstitution"
    />

    <!-- Rotation Tracker -->
    <RotationTracker
      :currentRotation="currentRotation"
      :getPlayerName="getPlayerName"
      @rotateManually="rotateManually"
    />

    <!-- Player Statistics -->
    <PlayerStatistics
      :game="game"
      :getPlayerName="getPlayerName"
      :getPlayerStat="getPlayerStat"
    />

    <!-- Recent Events -->
    <RecentEvents
      :recentEvents="recentEvents"
      :getPlayerName="getPlayerName"
    />

    <!-- Stat Screen Toggle -->
    <button @click="toggleStatScreen" class="btn btn-blue mt-4 w-full">
      {{ showStatScreen ? 'Hide Stats' : 'Show Stats' }}
    </button>

    <!-- Stat Screen Component -->
    <StatScreen v-if="showStatScreen" :game="gameWithPlayerDetails" :getPlayerName="getPlayerName" />
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { cloneDeep } from 'lodash'; // Import cloneDeep for deep copying
import StatScreen from '../components/StatScreen.vue';
import EventInput from '../components/Game/EventInput.vue';
import GameScoreboard from '../components/Game/ScoreboardComp.vue';
import RotationTracker from '../components/Game/RotationTracker.vue';
import PlayerSubstitution from '../components/Game/SubstitutionComp.vue';
import PlayerStatistics from '../components/Game/PlayerStatistics.vue';
import RecentEvents from '../components/Game/RecentEvents.vue';
import GameControls from '../components/Game/GameControls.vue';
import ServingIndicator from '../components/Game/ServingIndicator.vue';

export default {
  name: 'GameView',
  components: {
    StatScreen,
    EventInput,
    GameScoreboard,
    RotationTracker,
    PlayerSubstitution,
    PlayerStatistics,
    RecentEvents,
    GameControls,
    ServingIndicator
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
    const setsWon = ref({ team: 0, opponent: 0 });

    onMounted(() => {
      try {
        const games = JSON.parse(localStorage.getItem('games') || '[]');
        game.value = games.find(g => g.id === parseInt(route.params.id));
        if (!game.value) {
          router.push({ name: 'Home' });
          return;
        }
        // Load isOpponentServing if it exists
        const savedServingState = localStorage.getItem(`game-${game.value.id}-serving`);
        if (savedServingState) {
          isOpponentServing.value = JSON.parse(savedServingState);
        }
        // Load game status
        const savedGameStatus = localStorage.getItem(`game-${game.value.id}-status`);
        if (savedGameStatus) {
          game.value.status = savedGameStatus; 
        }
        // Load currentRotation 
        const savedRotation = localStorage.getItem(`game-${game.value.id}-rotation`);
        if (savedRotation) {
          game.value.currentRotation = JSON.parse(savedRotation);
        } 
        const savedSetsWon = localStorage.getItem(`game-${game.value.id}-setsWon`);
        if (savedSetsWon) {
          setsWon.value = JSON.parse(savedSetsWon);
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

        if (!game.value.setsWon) { 
          game.value.setsWon = { team: 0, opponent: 0 };
        } else {
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

    const getActionTypes =  (action) => {
      console.log('getActionTypes called');
      switch (action) {
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
    };

    const getEvaluations = computed(() => {
      return ['Perfect', 'Good', 'OK', 'Poor'];
    });

    const getTargets = (action) => {
      console.log('getTargets called');
      if (['serve', 'spike'].includes(action)) {
        return ['Zone 1', 'Zone 2', 'Zone 3', 'Zone 4', 'Zone 5', 'Zone 6'];
      } else if (action === 'set') {
        return ['2', '3', '4', 'Back Row'];
      }
      return [];
    };

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
      localStorage.setItem(`game-${game.value.id}-rotation`, JSON.stringify(game.value.currentRotation)); // Save rotation
      saveGame();
    };

     // Save serving state to local storage whenever it changes
     const toggleServingTeam = () => {
      isOpponentServing.value = !isOpponentServing.value;
      localStorage.setItem(`game-${game.value.id}-serving`, JSON.stringify(isOpponentServing.value));
    };

    const recordEvent = (event) => {
      if (!event.player || !event.action || !event.result) {
        alert('Please fill in all required event details');
        return;
      }

      const newEvent = {
        id: Date.now(),
        ...event,
        rotation: [...game.value.currentRotation],
        servingTeam: isOpponentServing.value ? 'opponent' : 'team' // Add servingTeam
      };

      undoStack.value.push({ 
        type: 'event', 
        data: { 
          set: cloneDeep(currentSet.value), // Deep copy
          rotation: [...game.value.currentRotation],
          isOpponentServing: isOpponentServing.value,
          endedSet: false, // Flag for set end
          endedGame: false // Flag for game end
        } 
      });
      redoStack.value = [];

      currentSet.value.events.push(newEvent);

      if (newEvent.result === 'point') {
        currentSet.value.teamScore++;
        if (isOpponentServing.value) {
          rotateTeam();
          isOpponentServing.value = false;
        }
      } else if (newEvent.result === 'error') {
        currentSet.value.opponentScore++;
        if (!isOpponentServing.value) {
          isOpponentServing.value = true;
        }
      }

      checkSetEnd();

      saveGame();
    };

    const recordAdvancedEvent = (event) => {
      if (!event.player || !event.action || !event.type || 
          !event.evaluation || !event.result) {
        alert('Please fill in all required event details');
        return;
      }

      recordEvent(event); // Use the same logic as basic event recording
    };

    const makeSubstitution = (substitution) => {
      if (!substitution.outPlayer || !substitution.inPlayer) {
        alert('Please select both players for substitution');
        return;
      }

      const outIndex = currentRotation.value.indexOf(substitution.outPlayer);
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

      game.value.currentRotation[outIndex] = substitution.inPlayer;

      currentSet.value.events.push({
        id: Date.now(),
        type: 'substitution',
        outPlayer: substitution.outPlayer,
        inPlayer: substitution.inPlayer
      });

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
        game.value.setsWon.team++;
      } else {
        setsWon.value.opponent++;
        game.value.setsWon.opponent++;
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
      router.push({ name: 'StatScreen', params: { id: game.value.id } }); // Redirect to StatScreen
    };

    const saveGame = () => {
      if (!game.value) return;
      const games = JSON.parse(localStorage.getItem('games') || '[]');
      const index = games.findIndex(g => g.id === game.value.id);
      if (index !== -1) {
        games[index] = game.value;
        localStorage.setItem('games', JSON.stringify(games));
      }
      localStorage.setItem(`game-${game.value.id}-serving`, JSON.stringify(isOpponentServing.value));
      localStorage.setItem(`game-${game.value.id}-rotation`, JSON.stringify(game.value.currentRotation)); 
      localStorage.setItem(`game-${game.value.id}-setsWon`, JSON.stringify(setsWon.value)); // Save setsWon
    };

    const undoLastEvent = () => {
      if (undoStack.value.length === 0) return;

      const lastAction = undoStack.value.pop();
      // Create a deep copy of the current state *before* undoing 
      redoStack.value.push({
        type: lastAction.type,
        data: {
          set: cloneDeep(currentSet.value), // Deep copy 
          rotation: [...game.value.currentRotation], 
          isOpponentServing: isOpponentServing.value,
          setsWon: { ...setsWon.value }, // Capture setsWon 
          gameStatus: game.value.status // Capture game status
        }
      });

      if (lastAction.type === 'event' || lastAction.type === 'score') {
        Object.assign(currentSet.value, lastAction.data.set);
        game.value.currentRotation = [...lastAction.data.rotation];
        isOpponentServing.value = lastAction.data.isOpponentServing;
        setsWon.value = { ...lastAction.data.setsWon }; // Restore setsWon
        
        // Check if we need to revert a set end or game end
        if (lastAction.data.endedSet) {
          game.value.sets.pop(); // Remove the last set
          game.value.currentSet--; 
        } 
        if (lastAction.data.endedGame) {
          game.value.status = 'in_progress'; // Revert to in progress
        }
      } else if (lastAction.type === 'substitution') {
        game.value.currentRotation = [...lastAction.data.rotation];
        currentSet.value.events = [...lastAction.data.events]; 
      }

      saveGame();
    };

    const redoLastEvent = () => {
      if (redoStack.value.length === 0) return;

      const nextAction = redoStack.value.pop();

      // Deep copy for undo stack
      undoStack.value.push({
        type: nextAction.type,
        data: {
          set: cloneDeep(currentSet.value),
          rotation: [...game.value.currentRotation],
          isOpponentServing: isOpponentServing.value,
          setsWon: { ...setsWon.value },
          gameStatus: game.value.status
        }
      });

      if (nextAction.type === 'event' || nextAction.type === 'score') {
        Object.assign(currentSet.value, nextAction.data.set);
        game.value.currentRotation = [...nextAction.data.rotation];
        isOpponentServing.value = nextAction.data.isOpponentServing;
        setsWon.value = { ...nextAction.data.setsWon };

        // Redo set end or game end
        if (nextAction.data.endedSet) {
          startNewSet(); // Restart the set that was ended
        }
        if (nextAction.data.endedGame) {
          game.value.status = 'completed'; 
        }
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

      // Save the game status to localStorage immediately:
      localStorage.setItem(`game-${game.value.id}-status`, game.value.status);

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
.status-indicator { 
  padding: 0.2rem 0.6rem; /* Adjust as needed */
  border-radius: 4px;
  font-weight: 500;
}

.status-indicator.in-progress {
  background-color: #48bb78; /* Green */
  color: white;
}

.status-indicator.paused {
  background-color: #f56565; /* Red */
  color: white; 
}

.status-indicator.not-started {
  background-color: #a0aec0; /* Gray */
  color: white;
}
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
