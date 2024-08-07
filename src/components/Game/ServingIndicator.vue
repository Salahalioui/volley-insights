// src\components\Game\ServingIndicator.vue
<template>
  <div class="serving-indicator">
    <div class="serving-team">
      <span class="icon" :class="{ 'opponent': isOpponentServing }">🏐</span>
      <p class="team-name">
        {{ isOpponentServing ? game.opponentTeam : 'Our Team' }}
      </p>
    </div>
    <button @click="toggleServingTeam" class="btn-switch" :class="{ 'opponent': isOpponentServing }">
      <span class="btn-icon">
        {{ isOpponentServing ? '⬅ Serve' : 'Serve ➡' }} 
      </span>
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
    flex-direction: column; /* Default to column for mobile */
    align-items: center; 
    gap: 1rem;
  }
  
  .serving-team {
    display: flex;
    align-items: center;
    gap: 0.5rem; 
    margin-bottom: 0.5rem; /* Add some space below */
  }
  
  .icon {
    font-size: 2rem; 
    animation: bounce 1s infinite alternate;
  }
  
  .team-name {
    font-size: 1.4rem; /* Slightly larger font size */
    font-weight: bold;
    color: #6b21a8;
  }
  
  .btn-switch {
    background-color: #9333ea;
    color: white;
    border: none;
    border-radius: 0.5rem;
    padding: 0.6rem 1rem; /* Adjusted padding */
    font-size: 1.1rem;  /* Slightly larger font size */
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center; /* Center content */
    width: 100%; /* Full width button */
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
    font-size: 1.3rem; /* Larger icon */
  }
  
  @keyframes bounce {
    from { transform: translateY(0); }
    to { transform: translateY(-5px); }
  }
  
  /* Optional: Larger screen layout */
  @media (min-width: 640px) {
    .serving-indicator {
      flex-direction: row; 
      justify-content: space-between;
    }
  
    .serving-team {
      flex-direction: column; 
      align-items: flex-start; /* Align to the left */
      margin-bottom: 0; 
    }
  
    .icon {
      font-size: 3rem; 
    }
  
    .team-name {
      font-size: 1.5rem; 
    }
  
    .btn-switch {
      width: auto; /* Button takes natural width */
    }
  }
  </style>