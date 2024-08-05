// src\components\Game\SubstitutionComp.vue
<template>
  <div class="substitution">
    <h2 class="title">Substitutions</h2>
    <div class="player-selection">
      <div class="select-wrapper">
        <label for="player-out">Player Out</label>
        <select id="player-out" v-model="selectedOutPlayer" class="form-select">
          <option value="">Select player</option>
          <option v-for="playerId in currentRotation" :key="playerId" :value="playerId">
            {{ getPlayerName(playerId) }}
          </option>
        </select>
      </div>
      <div class="swap-icon">↔️</div>
      <div class="select-wrapper">
        <label for="player-in">Player In</label>
        <select id="player-in" v-model="selectedInPlayer" class="form-select">
          <option value="">Select player</option>
          <option v-for="playerId in benchPlayers" :key="playerId" :value="playerId">
            {{ getPlayerName(playerId) }}
          </option>
        </select>
      </div>
    </div>
    <button @click="makeSubstitution" class="btn btn-substitute" :disabled="!canSubstitute">
      Substitute
    </button>
  </div>
</template>

<script>
export default {
  props: {
    currentRotation: Array,
    benchPlayers: Array,
    getPlayerName: Function
  },
  emits: ['makeSubstitution'],
  data() {
    return {
      selectedOutPlayer: '',
      selectedInPlayer: ''
    };
  },
  computed: {
    canSubstitute() {
      return this.selectedOutPlayer && this.selectedInPlayer;
    }
  },
  methods: {
    makeSubstitution() {
      if (this.canSubstitute) {
        this.$emit('makeSubstitution', {
          outPlayer: this.selectedOutPlayer,
          inPlayer: this.selectedInPlayer
        });
        this.resetSelection();
      }
    },
    resetSelection() {
      this.selectedOutPlayer = '';
      this.selectedInPlayer = '';
    }
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