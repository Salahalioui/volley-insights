<template>
  <div class="substitution">
    <h2 class="title">{{ $t('substitutions') }}</h2>
    <div class="player-selection">
      <div class="select-wrapper">
        <label for="player-out">{{ $t('playerOut') }}</label>
        <select id="player-out" v-model="selectedOutPlayer" class="form-select">
          <option value="">{{ $t('selectPlayer') }}</option>
          <option v-for="playerId in currentRotation" :key="playerId" :value="playerId">
            {{ getPlayerName(playerId) }}
          </option>
        </select>
      </div>
      <div class="swap-icon">↔️</div>
      <div class="select-wrapper">
        <label for="player-in">{{ $t('playerIn') }}</label>
        <select id="player-in" v-model="selectedInPlayer" class="form-select">
          <option value="">{{ $t('selectPlayer') }}</option>
          <option v-for="playerId in benchPlayers" :key="playerId" :value="playerId">
            {{ getPlayerName(playerId) }}
          </option>
        </select>
      </div>
    </div>
    <button @click="makeSubstitution" class="btn btn-substitute" :disabled="!canSubstitute">
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
  setup() {
    const { t } = useI18n();
    const selectedOutPlayer = ref('');
    const selectedInPlayer = ref('');

    const canSubstitute = computed(() => {
      return selectedOutPlayer.value && selectedInPlayer.value;
    });

    const makeSubstitution = () => {
      if (canSubstitute.value) {
        this.$emit('makeSubstitution', {
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
.substitution {
  background-color: #ffffff;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #000000;
}

.player-selection {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.select-wrapper {
  flex: 1;
}

.swap-icon {
  font-size: 1.5rem;
  color: #0e5792;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #000000;
}

.form-select {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #fbbf24;
  border-radius: 0.5rem;
  background-color: white;
  font-size: 1rem;
  color: #92400e;
  transition: border-color 0.3s ease;
}

.form-select:focus {
  outline: none;
  border-color: #f59e0b;
}

.btn-substitute {
  width: 100%;
  padding: 1rem;
  background-color: #fbbf24;
  color: #92400e;
  border: none;
  border-radius: 0.5rem;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-substitute:hover:not(:disabled) {
  background-color: #f59e0b;
}

.btn-substitute:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 640px) {
  .player-selection {
    flex-direction: column;
  }

  .swap-icon {
    transform: rotate(90deg);
    margin: 0.5rem 0;
  }
}
</style>