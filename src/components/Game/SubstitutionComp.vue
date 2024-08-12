<template>
  <div class="substitution bg-white rounded-lg p-3 sm:p-4 shadow-md">
    <h2 class="title text-lg sm:text-xl font-bold mb-2 text-gray-800">{{ $t('substitutions') }}</h2>
    <div class="player-selection flex flex-row justify-between items-center space-x-2">
      <div class="select-wrapper flex-1">
        <select v-model="selectedOutPlayer" class="form-select text-sm sm:text-base" :aria-label="$t('playerOut')">
          <option value="">{{ $t('playerOut') }}</option>
          <option v-for="playerId in currentRotation" :key="playerId" :value="playerId">
            {{ getPlayerName(playerId) }}
          </option>
        </select>
      </div>
      <div class="select-wrapper flex-1">
        <select v-model="selectedInPlayer" class="form-select text-sm sm:text-base" :aria-label="$t('playerIn')">
          <option value="">{{ $t('playerIn') }}</option>
          <option v-for="playerId in benchPlayers" :key="playerId" :value="playerId">
            {{ getPlayerName(playerId) }}
          </option>
        </select>
      </div>
    </div>
    <button @click="makeSubstitution" class="btn-substitute mt-2 w-full" :disabled="!canSubstitute">
      {{ $t('substitute') }}
    </button>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';

export default {
  props: {
    currentRotation: Array,
    benchPlayers: Array,
    getPlayerName: Function
  },
  emits: ['makeSubstitution'],
  setup(props, { emit }) {  // Add the { emit } destructuring here
    const { t } = useI18n();
    const selectedOutPlayer = ref('');
    const selectedInPlayer = ref('');

    const canSubstitute = computed(() => {
      return selectedOutPlayer.value && selectedInPlayer.value;
    });

    const makeSubstitution = () => {
      if (canSubstitute.value) {
        emit('makeSubstitution', {  // Use emit instead of this.$emit
          outPlayer: selectedOutPlayer.value,
          inPlayer: selectedInPlayer.value
        });
        resetSelection();
      }
    };

    const resetSelection = () => {
      selectedOutPlayer.value = '';
      selectedInPlayer.value = '';
    };

    return {
      t,
      selectedOutPlayer,
      selectedInPlayer,
      canSubstitute,
      makeSubstitution,
      resetSelection
    };
  }
};
</script>

<style scoped>
.form-select {
  @apply w-full py-1 px-2 border-2 border-yellow-400 rounded-md bg-white text-yellow-800 transition-colors duration-300 ease-in-out;
}

.form-select:focus {
  @apply outline-none border-yellow-500 ring-2 ring-yellow-200;
}

.btn-substitute {
  @apply py-2 px-4 bg-yellow-400 text-yellow-800 rounded-md font-bold text-sm sm:text-base transition-colors duration-300 ease-in-out;
}

.btn-substitute:hover:not(:disabled) {
  @apply bg-yellow-500;
}

.btn-substitute:disabled {
  @apply opacity-50 cursor-not-allowed;
}

@media (max-width: 640px) {
  .substitution {
    @apply p-2;
  }
  
  .title {
    @apply text-base mb-1;
  }
  
  .form-select, .btn-substitute {
    @apply text-xs py-1 px-2;
  }
}
</style>