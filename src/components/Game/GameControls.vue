<template>
    <div class="game-controls">
      <div class="button-group">
        <button @click="undoLastEvent" class="btn btn-yellow" :disabled="!canUndo" :class="{ 'btn-disabled': !canUndo }">
          <span class="icon">↩</span>
          <span class="text">Undo</span>
        </button>
        <button @click="redoLastEvent" class="btn btn-green" :disabled="!canRedo" :class="{ 'btn-disabled': !canRedo }">
          <span class="icon">↪</span>
          <span class="text">Redo</span>
        </button>
      </div>
      <button @click="toggleGameStatus" class="btn btn-blue" :class="{ 'btn-paused': game.status !== 'in_progress' }">
        <span class="icon">{{ game.status === 'in_progress' ? '⏸' : '▶' }}</span>
        <span class="text">{{ game.status === 'in_progress' ? 'Pause' : 'Resume' }}</span>
      </button>
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
    flex-direction: column;
    align-items: center;
    padding: 1rem;
    gap: 1rem;
  }
  
  .button-group {
    display: flex;
    gap: 0.5rem;
  }
  
  .btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.25rem;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .btn:hover:not(:disabled) {
    opacity: 0.8;
  }
  
  .btn-yellow { background-color: #fbbf24; color: #000; }
  .btn-green { background-color: #34d399; color: #000; }
  .btn-blue { background-color: #3b82f6; color: #fff; }
  
  .btn-disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .btn-paused {
    background-color: #ef4444;
  }
  
  .icon {
    font-size: 1.25rem;
    margin-right: 0.5rem;
  }
  
  @media (min-width: 768px) {
    .game-controls {
      flex-direction: row;
      justify-content: flex-end;
    }
  
    .button-group {
      order: 2;
    }
  
    .btn-blue {
      order: 1;
    }
  }
  </style>