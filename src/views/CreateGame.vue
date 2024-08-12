<template>
  <div class="create-game p-4 sm:p-6 bg-gray-100 rounded-lg shadow-md max-w-3xl mx-auto">
    <h2 class="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">{{ $t('createNewGame') }}</h2>

    <form @submit.prevent="showConfirmationModal" class="space-y-6">
      <!-- Game Name -->
      <div class="form-group">
        <label for="gameName" class="form-label">{{ $t('gameName') }}</label>
        <input type="text" id="gameName" v-model="gameName" required class="form-input" :placeholder="$t('enterGameName')" @blur="v$.gameName.$touch()">
        <p v-if="v$.gameName.$error" class="text-red-500 text-sm mt-1">{{ $t('gameNameRequired') }}</p>
      </div>

      <!-- Game Date and Time -->
      <div class="form-group grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label for="gameDate" class="form-label">{{ $t('gameDate') }}</label>
          <input type="date" id="gameDate" v-model="gameDate" required class="form-input" @blur="v$.gameDate.$touch()">
          <p v-if="v$.gameDate.$error" class="text-red-500 text-sm mt-1">{{ $t('gameDateRequired') }}</p>
        </div>
        <div>
          <label for="gameTime" class="form-label">{{ $t('gameTime') }}</label>
          <input type="time" id="gameTime" v-model="gameTime" required class="form-input" @blur="v$.gameTime.$touch()">
          <p v-if="v$.gameTime.$error" class="text-red-500 text-sm mt-1">{{ $t('gameTimeRequired') }}</p>
        </div>
      </div>

      <!-- Opponent Team Name -->
      <div class="form-group">
        <label for="opponentTeam" class="form-label">{{ $t('opponentTeamName') }}</label>
        <input type="text" id="opponentTeam" v-model="opponentTeam" required class="form-input" :placeholder="$t('enterOpponentTeamName')" @blur="v$.opponentTeam.$touch()">
        <p v-if="v$.opponentTeam.$error" class="text-red-500 text-sm mt-1">{{ $t('opponentTeamRequired') }}</p>
      </div>

      <!-- Location -->
      <div class="form-group">
        <label for="location" class="form-label">{{ $t('location') }}</label>
        <input type="text" id="location" v-model="location" required class="form-input" :placeholder="$t('enterGameLocation')" @blur="v$.location.$touch()">
        <p v-if="v$.location.$error" class="text-red-500 text-sm mt-1">{{ $t('locationRequired') }}</p>
      </div>

      <!-- Player Selection -->
      <div class="form-group">
        <fieldset>
          <legend class="form-label mb-2">{{ $t('selectPlayers') }}</legend>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            <div v-for="player in players" :key="player.id" class="flex items-center bg-white p-2 rounded-lg shadow-sm">
              <input type="checkbox" :id="'player-' + player.id" v-model="selectedPlayers" :value="player.id" class="form-checkbox" @change="v$.selectedPlayers.$touch()">
              <label :for="'player-' + player.id" class="ml-2 text-sm text-gray-900 flex-grow">
                {{ player.name }} (#{{ player.shirtNumber }}) - <span class="text-xs text-gray-500">({{ $t(player.role) }})</span>
              </label>
            </div>
          </div>
        </fieldset>
        <p v-if="v$.selectedPlayers.$error" class="text-red-500 text-sm mt-2">
          {{ $t('selectMinimumPlayers') }}
        </p>
      </div>

      <!-- Initial Rotation -->
      <div v-if="selectedPlayers.length >= 6" class="form-group">
        <fieldset>
          <legend class="form-label mb-2">{{ $t('setInitialRotation') }}</legend>
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
                <select v-model="initialRotation[position - 1]" class="w-full p-1 text-sm rounded" @change="v$.initialRotation.$touch()">
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
        </fieldset>
        <p v-if="v$.initialRotation.$error" class="text-red-500 text-sm mt-2">
          {{ $t('assignUniquePlayer') }}
        </p>
      </div>

      <!-- Input Method Selection -->
      <div class="form-group">
        <fieldset>
          <legend class="form-label mb-2">{{ $t('selectInputMethod') }}</legend>
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
        </fieldset>
        <p v-if="v$.inputMethod.$error" class="text-red-500 text-sm mt-2">
          {{ $t('selectInputMethodPrompt') }}
        </p>
      </div>

      <button type="submit" 
              :disabled="v$.$invalid"
              :class="['w-full p-3 rounded transition duration-300', 
                       !v$.$invalid ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed']">
        {{ $t('createGame') }}
      </button>
    </form>

    <!-- Confirmation Modal -->
    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center p-4" @click.self="showModal = false">
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
            <button @click="createGame" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300" :disabled="isCreating">
              {{ isCreating ? $t('creating') : $t('confirm') }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script>
import { ref,  onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useVuelidate } from '@vuelidate/core';
import { required, minLength } from '@vuelidate/validators';

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
    const showModal = ref(false);
    const isCreating = ref(false);

    const rules = {
      gameName: { required, minLength: minLength(3) },
      gameDate: { required },
      gameTime: { required },
      opponentTeam: { required },
      location: { required },
      selectedPlayers: { required, minLength: minLength(6) },
      initialRotation: { 
        required,
        isValid: (value) => isRotationValid(value)
      },
      inputMethod: { required }
    };

    const v$ = useVuelidate(rules, { 
      gameName, 
      gameDate, 
      gameTime, 
      opponentTeam, 
      location, 
      selectedPlayers, 
      initialRotation, 
      inputMethod 
    });

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

    const selectInputMethod = (method) => {
      inputMethod.value = method;
    };

    const showConfirmationModal = async () => {
      const isFormCorrect = await v$.value.$validate();
      if (isFormCorrect) {
        showModal.value = true;
      }
    };

    const createGame = async () => {
      isCreating.value = true;
      try {
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

        showModal.value = false;
        alert(t('gameCreatedSuccessfully'));
        router.push({ name: 'GameView', params: { id: gameData.id } });
      } catch (error) {
        console.error('Error creating game:', error);
        alert(t('errorCreatingGame'));
      } finally {
        isCreating.value = false;
      }
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
      showModal,
      isCreating,
      v$,
      getPlayerName,
      getPlayerShirtNumber,
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
