<template>
  <div class="create-game p-4 sm:p-6 bg-gray-100 rounded-lg shadow-md max-w-3xl mx-auto">
    <h2 class="text-3xl font-bold mb-6 text-gray-800">{{ $t('createNewGame') }}</h2>

    <form @submit.prevent="showConfirmationModal" class="space-y-6">
      <!-- Game Name -->
      <div class="form-group">
        <label for="gameName" class="form-label">{{ $t('gameName') }}</label>
        <input type="text" id="gameName" v-model="gameName" required class="form-input" :placeholder="$t('enterGameName')">
      </div>

      <!-- Game Date and Time -->
      <div class="form-group grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label for="gameDate" class="form-label">{{ $t('gameDate') }}</label>
          <input type="date" id="gameDate" v-model="gameDate" required class="form-input">
        </div>
        <div>
          <label for="gameTime" class="form-label">{{ $t('gameTime') }}</label>
          <input type="time" id="gameTime" v-model="gameTime" required class="form-input">
        </div>
      </div>

      <!-- Opponent Team Name -->
      <div class="form-group">
        <label for="opponentTeam" class="form-label">{{ $t('opponentTeamName') }}</label>
        <input type="text" id="opponentTeam" v-model="opponentTeam" required class="form-input" :placeholder="$t('enterOpponentTeamName')">
      </div>

      <!-- Location -->
      <div class="form-group">
        <label for="location" class="form-label">{{ $t('location') }}</label>
        <input type="text" id="location" v-model="location" required class="form-input" :placeholder="$t('enterGameLocation')">
      </div>

      <!-- Player Selection -->
      <div class="form-group">
        <label class="form-label mb-2">{{ $t('selectPlayers') }}</label>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          <div v-for="player in players" :key="player.id" class="flex items-center bg-white p-2 rounded-lg shadow-sm">
            <input type="checkbox" :id="'player-' + player.id" v-model="selectedPlayers" :value="player.id" class="form-checkbox">
            <label :for="'player-' + player.id" class="ml-2 text-sm text-gray-900 flex-grow">
              {{ player.name }} (#{{ player.shirtNumber }}) - <span class="text-xs text-gray-500">({{ $t(player.role) }})</span>
            </label>
          </div>
        </div>
        <p v-if="selectedPlayers.length < 6" class="mt-2 text-sm text-red-600">
          {{ $t('selectMinimumPlayers') }}
        </p>
      </div>

      <!-- Initial Rotation -->
      <div v-if="selectedPlayers.length >= 6" class="form-group">
        <label class="form-label mb-2">{{ $t('setInitialRotation') }}</label>
        <div class="relative w-full aspect-[3/2] bg-blue-100 border-2 border-blue-500 rounded-lg p-2">
          <!-- Court layout (Corrected Order) -->
          <div class="grid grid-cols-3 grid-rows-2 gap-2 h-full">
            <div 
              v-for="(position, index) in [5, 1, 6, 4, 2, 3]" :key="position" 
              class="flex items-center justify-center"
              :style="{
                gridRowStart: index < 3 ? 1 : 2,
                gridColumnStart: index % 3 === 0 ? 3 : index % 3 === 1 ? 1 : 2
              }"
            >
              <select v-model="initialRotation[position - 1]" class="w-full p-1 text-sm rounded">
                <option value="">{{ $t('position', { number: position }) }}</option>
                <option v-for="playerId in selectedPlayers" :key="playerId" :value="playerId">
                  {{ getPlayerName(playerId) }} (#{{ getPlayerShirtNumber(playerId) }})
                </option>
              </select>
            </div>
          </div>
          <!-- Net line -->
          <div class="absolute top-1/2 left-0 right-0 h-0.5 bg-blue-500"></div>
        </div>
        <p v-if="!isRotationValid(initialRotation)" class="mt-2 text-sm text-red-600">
          {{ $t('assignUniquePlayer') }}
        </p>
      </div>

      <!-- Input Method Selection -->
      <div class="form-group">
        <label class="form-label mb-2">{{ $t('selectInputMethod') }}</label>
        <div class="flex gap-4">
          <button 
            type="button"
            :class="['btn', inputMethod === 'basic' ? 'btn-blue' : 'btn-gray']" 
            @click="selectInputMethod('basic')">{{ $t('basic') }}</button>
          <button 
            type="button"
            :class="['btn', inputMethod === 'advanced' ? 'btn-blue' : 'btn-gray']" 
            @click="selectInputMethod('advanced')">{{ $t('advanced') }}</button>
        </div>
        <p v-if="!inputMethodSelected" class="mt-2 text-sm text-red-600">
          {{ $t('selectInputMethodPrompt') }}
        </p>
      </div>

      <button type="submit" 
              :disabled="!isFormValid"
              :class="['w-full p-3 rounded transition duration-300', 
                       isFormValid ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed']">
        {{ $t('createGame') }}
      </button>
    </form>

    <!-- Confirmation Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center p-4">
      <div class="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <h3 class="text-xl font-bold mb-4">{{ $t('confirmGameCreation') }}</h3>
        <div class="mb-4 space-y-2">
          <p><strong>{{ $t('gameName') }}:</strong> {{ gameName }}</p>
          <p><strong>{{ $t('dateAndTime') }}:</strong> {{ gameDate }} {{ gameTime }}</p>
          <p><strong>{{ $t('opponent') }}:</strong> {{ opponentTeam }}</p>
          <p><strong>{{ $t('location') }}:</strong> {{ location }}</p>
          <p><strong>{{ $t('players') }}:</strong> {{ selectedPlayers.length }}</p>
          <p><strong>{{ $t('inputMethod') }}:</strong> {{ $t(inputMethod) }}</p>
        </div>
        <p class="mb-4">{{ $t('confirmGameCreationPrompt') }}</p>
        <div class="flex justify-end space-x-3">
          <button @click="showModal = false" class="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition duration-300">{{ $t('cancel') }}</button>
          <button @click="createGame" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300">{{ $t('confirm') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

export default {
  name: 'CreateGame',
  setup() {
    const { t } = useI18n();
    const router = useRouter();
    const gameName = ref('');
    const gameDate = ref('');
    const gameTime = ref('');
    const opponentTeam = ref('');
    const location = ref('');
    const players = ref([]);
    const selectedPlayers = ref([]);
    const initialRotation = ref(Array(6).fill(''));
    const inputMethod = ref('');
    const inputMethodSelected = ref(true);
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

    const getPlayerShirtNumber = (playerId) => {
      const player = players.value.find(p => p.id === playerId);
      return player ? player.shirtNumber : '';
    };

    const isRotationValid = (rotation) => {
      const filledPositions = rotation.filter(p => p !== '');
      const uniquePositions = new Set(filledPositions);
      return filledPositions.length === 6 && uniquePositions.size === 6;
    };

    const isFormValid = computed(() => {
      return gameName.value.trim() !== '' &&
             gameDate.value !== '' &&
             gameTime.value !== '' &&
             opponentTeam.value.trim() !== '' &&
             location.value.trim() !== '' &&
             selectedPlayers.value.length >= 6 &&
             isRotationValid(initialRotation.value) &&
             inputMethod.value !== '';
    });

    const selectInputMethod = (method) => {
      inputMethod.value = method;
      inputMethodSelected.value = true;
    };

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
        time: gameTime.value,
        opponentTeam: opponentTeam.value,
        location: location.value,
        players: selectedPlayers.value,
        initialRotation: initialRotation.value,
        inputMethod: inputMethod.value,
        sets: [],
        currentSet: 1,
        status: 'not_started'
      };

      const games = JSON.parse(localStorage.getItem('games') || '[]');
      games.push(gameData);
      localStorage.setItem('games', JSON.stringify(games));

      // Reset the form
      gameName.value = '';
      gameDate.value = '';
      gameTime.value = '';
      opponentTeam.value = '';
      location.value = '';
      selectedPlayers.value = [];
      initialRotation.value = Array(6).fill('');
      inputMethod.value = '';

      showModal.value = false;

      alert(t('gameCreatedSuccessfully'));
      router.push({ name: 'GameView', params: { id: gameData.id } });
    };

    return {
      t,
      gameName,
      gameDate,
      gameTime,
      opponentTeam,
      location,
      players,
      selectedPlayers,
      initialRotation,
      inputMethod,
      inputMethodSelected,
      showModal,
      getPlayerName,
      getPlayerShirtNumber,
      isRotationValid,
      isFormValid,
      selectInputMethod,
      showConfirmationModal,
      createGame
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
  color: #374151;
  margin-bottom: 0.25rem;
}

.form-input {
  display: block;
  width: 100%;
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  color: #374151;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.form-input:focus {
  color: #374151;
  background-color: #fff;
  border-color: #2563eb;
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(37, 99, 235, 0.25);
}

.form-checkbox {
  border-radius: 0.25rem;
  border-color: #d1d5db;
  color: #2563eb;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.form-checkbox:focus {
  border-color: #93c5fd;
  box-shadow: 0 0 0 0.2rem rgba(37, 99, 235, 0.25);
}

.btn {
  padding: 0.5rem 1rem;
  font-weight: bold;
  border-radius: 0.25rem;
  transition: background-color 0.3s ease-in-out;
}

.btn-gray { background-color: #d1d5db; color: white; }
.btn-gray:hover { background-color: #9ca3af; }

.btn-blue { background-color: #4299e1; color: white; }
.btn-blue:hover { background-color: #3182ce; }

</style>
