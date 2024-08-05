<template>
  <div class="event-input">
    <h2 class="title">Record Event</h2>
    <div v-if="!isAdvancedInput" class="simple-input">
      <div class="player-buttons"> 
        <button 
          v-for="playerId in currentRotation" 
          :key="playerId"
          @click="selectedPlayer = playerId"
          :class="['btn', 'btn-player', { 'active': selectedPlayer === playerId }]"
        >
          <span class="player-name">{{ getPlayerName(playerId) }}</span> 
        </button>
      </div>
      <div class="action-buttons">
        <button 
          v-for="action in actions" 
          :key="action"
          @mouseover="selectedAction = action"
          :class="['btn', 'btn-action', { 'active': selectedAction === action }]"
        >
          <span class="action-text">{{ action }}</span> 
        </button>
      </div>
      <div class="result-buttons">
        <button 
          v-for="result in results" 
          :key="result"
          @click="recordEvent({ player: selectedPlayer, action: selectedAction, result: result })"
          :class="['btn', 'btn-result', result === 'point' ? 'btn-point' : result === 'error' ? 'btn-error' : result === 'continue' ? 'btn-continue' : '']"
        >
          <span class="result-text">{{ result }}</span> 
        </button>
      </div>
    </div>
    <div v-else class="advanced-input">
      <div class="input-grid">
        <select v-model="selectedPlayer" class="form-select">
          <option value="">Select Player</option>
          <option v-for="playerId in currentRotation" :key="playerId" :value="playerId">
            {{ getPlayerName(playerId) }}
          </option>
        </select>
        <select v-model="selectedAction" class="form-select">
          <option value="">Select Action</option>
          <option v-for="action in actions" :key="action" :value="action">{{ action }}</option>
        </select>
        <select v-if="selectedAction" v-model="selectedType" class="form-select">
          <option value="">Type of Action</option>
          <option v-for="type in getActionTypes(selectedAction)" :key="type" :value="type">{{ type }}</option>
        </select>
        <select v-if="selectedAction" v-model="selectedEvaluation" class="form-select">
          <option value="">Evaluation</option>
          <option v-for="evaluation in getEvaluations" :key="evaluation" :value="evaluation">{{ evaluation }}</option>
        </select>
        <select v-model="selectedResult" class="form-select">
          <option value="">Result</option>
          <option v-for="result in results" :key="result" :value="result">{{ result }}</option>
        </select>
        <select v-if="['serve', 'spike', 'set'].includes(selectedAction)" v-model="selectedTarget" class="form-select">
          <option value="">Target</option>
          <option v-for="target in getTargets(selectedAction)" :key="target" :value="target">{{ target }}</option>
        </select>
      </div>
      <button @click="recordAdvancedEvent" class="btn btn-record">
        Record Advanced Event
      </button>
    </div>
  </div>
</template>

<script>
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
    recordEvent(eventData) { 
      if (!eventData.player || !eventData.action || !eventData.result) {
        alert('Please fill in all required event details'); 
        return; 
      }
      this.$emit('recordEvent', eventData);
      this.resetSelection();
    },
    recordAdvancedEvent() {
      console.log('Advanced Event selected:', this.selectedPlayer, this.selectedAction, this.selectedType, this.selectedEvaluation, this.selectedResult, this.selectedTarget);
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
  .player-buttons, 
.action-buttons, 
.result-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); /* Adjust minmax for button size */
  gap: 1rem; 
}

.player-name,
.action-text,
.result-text {
    font-weight: bold;
    font-size: 1.15rem; /* Adjust font size as needed */
}

/* Color-coding for results */
.btn-point {
  background-color: #48bb78; /* Green for Point */
  color: white;
}

.btn-error {
  background-color: #f72424; /* Red for Error */
  color: white;
}

.btn-continue {
  background-color: #ed8e36; /* Orange for Continue */
  color: white;
}
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
  
  .player-buttons, .action-buttons, .result-buttons {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 0.5rem;
  }
  
  .btn {
    padding: 0.75rem 1rem;
    border: none;
    border-radius: 0.5rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .btn-player {
    background-color: #60a5fa;
    color: white;
  }
  
  .btn-action {
    background-color: #73d334;
    color: white;
  }
  
  
  .btn-record {
    background-color: #8b5cf6;
    color: white;
    padding: 1rem;
    font-size: 1.1rem;
  }
  
  .btn:hover, .btn.active {
    opacity: 0.8;
    transform: translateY(-2px);
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
  
  @media (max-width: 640px) {
    .player-buttons, .action-buttons, .result-buttons {
      grid-template-columns: repeat(2, 1fr);
    }
    
    .input-grid {
      grid-template-columns: 1fr;
    }
  }
  </style>