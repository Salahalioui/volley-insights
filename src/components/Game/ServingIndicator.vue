<template>
    <div class="serving-indicator">
      <div class="serving-team">
        <span class="icon" :class="{ 'opponent': isOpponentServing }">🏐</span>
        <p class="team-name">
          {{ isOpponentServing ? game.opponentTeam : 'Our Team' }}
        </p>
      </div>
      <button @click="toggleServingTeam" class="btn-switch" :class="{ 'opponent': isOpponentServing }">
        <span class="btn-text">Switch Serve</span>
        <span class="btn-icon">⇄</span>
      </button>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      isOpponentServing: Boolean,
      game: Object
    },
    emits: ['toggleServingTeam'],
    methods: {
      toggleServingTeam() {
        this.$emit('toggleServingTeam');
      }
    }
  };
  </script>
  
  <style scoped>
  .serving-indicator {
    background-color: #f3e8ff;
    border-radius: 1rem;
    padding: 1rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  
  .serving-team {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .icon {
    font-size: 2rem;
    animation: bounce 1s infinite alternate;
  }
  
  .team-name {
    font-size: 1.25rem;
    font-weight: bold;
    color: #6b21a8;
  }
  
  .btn-switch {
    background-color: #9333ea;
    color: white;
    border: none;
    border-radius: 0.5rem;
    padding: 0.75rem 1rem;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .btn-switch:hover {
    background-color: #7e22ce;
  }
  
  .btn-switch.opponent {
    background-color: #db2777;
  }
  
  .btn-switch.opponent:hover {
    background-color: #be185d;
  }
  
  .btn-icon {
    font-size: 1.25rem;
  }
  
  @keyframes bounce {
    from { transform: translateY(0); }
    to { transform: translateY(-5px); }
  }
  
  @media (min-width: 640px) {
    .serving-indicator {
      flex-direction: row;
      justify-content: space-between;
    }
  
    .serving-team {
      flex-direction: column;
    }
  
    .icon {
      font-size: 3rem;
    }
  
    .team-name {
      font-size: 1.5rem;
    }
  }
  </style>