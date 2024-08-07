// src\components\Game\GameControls.vue
<template>
  <div class="game-controls">
    <button @click="toggleGameStatus" class="btn btn-control" :class="{ 'btn-paused': game.status !== 'in_progress' }">
      <span class="icon">
        {{ game.status === 'in_progress' ? '⏸' : '▶' }}
      </span>
      <span class="text">
        {{ game.status === 'in_progress' ? 'Pause' : 'Resume' }}
      </span>
    </button>
    <div class="button-group">
      <button @click="undoLastEvent" class="btn btn-undo" :disabled="!canUndo" :class="{ 'btn-disabled': !canUndo }">
        <span class="icon">↩</span>
      </button>
      <button @click="redoLastEvent" class="btn btn-redo" :disabled="!canRedo" :class="{ 'btn-disabled': !canRedo }">
        <span class="icon">↪</span>
      </button>
    </div>
  </div>
</template>
  <script>
  export default {
    props: {
      canUndo: Boolean,
      canRedo: Boolean,
      game: Object
    },
    emits: ['undoLastEvent', 'redoLastEvent', 'toggleGameStatus'],
    methods: {
      undoLastEvent() {
        this.$emit('undoLastEvent');
      },
      redoLastEvent() {
        this.$emit('redoLastEvent');
      },
      toggleGameStatus() {
        this.$emit('toggleGameStatus');
      }
    }
  };
  </script>
  <style scoped>
  .game-controls {
    display: flex;
    flex-direction: column; /* Start with column for mobile */
    align-items: center;
    justify-content: center; /* Center horizontally */
    padding: 1rem;
    gap: 1rem;
  }
  
  .button-group {
    display: flex;
    gap: 1rem; /* More space between undo/redo */
  }
  
  .btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.8rem 1.2rem; /* Increased padding */
    border: none;
    border-radius: 0.5rem; /* Larger border radius */
    font-size: 1.1rem; /* Larger font size */
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .btn:hover:not(:disabled) {
    opacity: 0.8;
  }
  
  .btn-control { /* Style for the play/pause button */
    background-color: #3b82f6; 
    color: #fff; 
    width: 100%; /* Full width for better mobile use */
  }
  
  .btn-undo { 
    background-color: #fbbf24; 
    color: #000; 
  }
  
  .btn-redo { 
    background-color: #34d399; 
    color: #000; 
  }
  
  .btn-disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .btn-paused {
    background-color: #ef4444;
  }
  
  .icon {
    font-size: 1.5rem; /* Larger icons */
  }
  
  /* Media query for larger screens (optional) */
  @media (min-width: 768px) {
    .game-controls {
      flex-direction: row; /* Switch to row layout */
      justify-content: flex-end; 
    }
  
    .button-group {
      order: 2;
    }
  
    .btn-control {
      order: 1;
      width: auto; /* Reset width on larger screens */
    }
  }
  </style>