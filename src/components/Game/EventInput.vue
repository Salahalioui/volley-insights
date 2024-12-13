<template>
  <div class="event-input">
    <div v-if="!isAdvancedInput" class="simple-input">
      <div class="selection-indicator">
        <span :class="{ 'completed': selectedPlayer }">{{ $t('step1SelectPlayer') }}</span>
        <span :class="{ 'completed': selectedAction }">{{ $t('step2SelectAction') }}</span>
        <span :class="{ 'completed': selectedPlayer && selectedAction }">{{ $t('step3SelectResult') }}</span>
      </div>
      <div class="player-buttons"> 
        <button 
          v-for="playerId in currentRotation" 
          :key="playerId"
          @click="selectPlayer(playerId)"
          :class="['btn', 'btn-player', { 'active': selectedPlayer === playerId }]"
        >
          <span class="player-name">{{ getPlayerName(playerId) }}</span> 
        </button>
      </div>
      <div class="action-buttons">
        <button 
          v-for="action in actions" 
          :key="action"
          @click="selectAction(action)"
          :class="['btn', 'btn-action', { 'active': selectedAction === action }]"
        >
          <span class="action-text">{{ $t(action) }}</span> 
        </button>
      </div>
      <div class="result-buttons">
        <button 
          v-for="result in results" 
          :key="result"
          @click="recordEvent({ player: selectedPlayer, action: selectedAction, result: result })"
          :class="['btn', 'btn-result', result === 'point' ? 'btn-point' : result === 'error' ? 'btn-error' : result === 'continue' ? 'btn-continue' : '']"
          :disabled="!selectedPlayer || !selectedAction"
        >
          <span class="result-text">{{ $t(result) }}</span> 
        </button>
      </div>
    </div>
    <div v-else class="advanced-input">
      <div class="input-grid">
        <select v-model="selectedPlayer" class="form-select">
          <option value="">{{ $t('selectPlayer') }}</option>
          <option v-for="playerId in currentRotation" :key="playerId" :value="playerId">
            {{ getPlayerName(playerId) }}
          </option>
        </select>
        <select v-model="selectedAction" class="form-select">
          <option value="">{{ $t('selectAction') }}</option>
          <option v-for="action in actions" :key="action" :value="action">{{ $t(action) }}</option>
        </select>
        <select v-if="selectedAction" v-model="selectedType" class="form-select">
          <option value="">{{ $t('typeOfAction') }}</option>
          <option v-for="type in getActionTypes(selectedAction)" :key="type" :value="type">{{ $t(type) }}</option>
        </select>
        <select v-if="selectedAction" v-model="selectedEvaluation" class="form-select">
          <option value="">{{ $t('evaluation') }}</option>
          <option v-for="evaluation in getEvaluations" :key="evaluation" :value="evaluation">{{ $t(evaluation) }}</option>
        </select>
        <select v-model="selectedResult" class="form-select">
          <option value="">{{ $t('result') }}</option>
          <option v-for="result in results" :key="result" :value="result">{{ $t(result) }}</option>
        </select>
        <select v-if="['serve', 'spike', 'set'].includes(selectedAction)" v-model="selectedTarget" class="form-select">
          <option value="">{{ $t('target') }}</option>
          <option v-for="target in getTargets(selectedAction)" :key="target" :value="target">{{ $t(target) }}</option>
        </select>
      </div>
      <button @click="recordAdvancedEvent" class="btn btn-record">
        {{ $t('recordAdvancedEvent') }}
      </button>
    </div>
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n';

export default {
  props: {
    currentRotation: Array,
    isAdvancedInput: Boolean,
    getPlayerName: Function,
    getActionTypes: Function,
    getEvaluations: Array,
    getTargets: Function
  },
  emits: ['selectPlayer', 'selectAction', 'selectResult', 'recordEvent', 'recordAdvancedEvent'],
  setup() {
    const { t } = useI18n();
    return { t };
  },
  data() {
    return {
      selectedPlayer: '',
      selectedAction: '',
      selectedType: '',
      selectedEvaluation: '',
      selectedResult: '',
      selectedTarget: '',
      actions: ['serve', 'receive', 'set', 'spike', 'block', 'dig'],
      results: ['point', 'error', 'continue']
    };
  },
  methods: {
    selectPlayer(playerId) {
      this.selectedPlayer = playerId;
      this.$emit('selectPlayer', playerId);
    },
    selectAction(action) {
      this.selectedAction = action;
      this.$emit('selectAction', action);
    },
    recordEvent(eventData) { 
      if (!eventData.player || !eventData.action || !eventData.result) {
        alert(this.t('fillAllEventDetails')); 
        return; 
      }
      this.$emit('recordEvent', eventData);
      this.resetSelection();
    },
    recordAdvancedEvent() {
      if (!this.selectedPlayer || !this.selectedAction || !this.selectedType || !this.selectedEvaluation || !this.selectedResult) {
        alert(this.t('fillAllEventDetails'));
        return;
      }
      this.$emit('recordAdvancedEvent', {
        player: this.selectedPlayer,
        action: this.selectedAction,
        type: this.selectedType,
        evaluation: this.selectedEvaluation,
        result: this.selectedResult,
        target: this.selectedTarget
      });
      this.resetSelection();
    },
    resetSelection() {
      this.selectedPlayer = '';
      this.selectedAction = '';
      this.selectedType = '';
      this.selectedEvaluation = '';
      this.selectedResult = '';
      this.selectedTarget = '';
    }
  }
};
</script>


<style scoped>
.event-input {
  background-color: #f3f4f6;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #374151;
}

.simple-input, .advanced-input {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.player-buttons, 
.action-buttons, 
.result-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem; 
}

.btn {
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn-player {
  background-color: #60a5fa;
  color: white;
}

.btn-action {
  background-color: #73d334;
  color: white;
}

.btn-player.active, .btn-action.active {
  transform: translateY(-4px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 2px solid #3b82f6;
}

.btn-player.active {
  background-color: #3b82f6;
}

.btn-action.active {
  background-color: #10b981;
}

.btn-point {
  background-color: #48bb78;
  color: white;
}

.btn-error {
  background-color: #f72424;
  color: white;
}

.btn-continue {
  background-color: #ed8e36;
  color: white;
}

.btn-record {
  background-color: #8b5cf6;
  color: white;
  padding: 1rem;
  font-size: 1.1rem;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.player-name,
.action-text,
.result-text {
  font-weight: bold;
  font-size: 1.15rem;
}

.input-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.form-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background-color: white;
  font-size: 1rem;
}

.selection-indicator {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0,2rem;
}

.selection-indicator span {
  padding: 0.5rem;
  border-radius: 0.25rem;
  background-color: #e5e7eb;
  color: #6b7280;
}

.selection-indicator span.completed {
  background-color: #10b981;
  color: white;
}

@media (max-width: 640px) {
  .player-buttons, .action-buttons, .result-buttons {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .input-grid {
    grid-template-columns: 1fr;
  }
}
</style>
