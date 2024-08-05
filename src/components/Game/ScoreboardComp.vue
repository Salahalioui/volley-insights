// src\components\Game\ScoreboardComp.vue
<template>
  <div class="scoreboard">
    <div class="team-score">
      <h3 class="team-name">Our Team</h3> 
      <div class="score-container">
        <p class="score">{{ currentSet.teamScore }}</p>
        <div class="score-buttons">
          <button @click="handleAdjustScore('team', 1)" class="btn btn-increment" aria-label="Increase Our Team score">+</button>
          <button @click="handleAdjustScore('team', -1)" class="btn btn-decrement" aria-label="Decrease Our Team score">-</button>
        </div>
      </div> 
    </div>
    <div class="set-info">
      <p class="sets-won">{{ setsWon.team }} - {{ setsWon.opponent }}</p>
      <p class="current-set">Set {{ game.currentSet }}</p>
    </div>
    <div class="team-score">
      <h3 class="team-name">{{ game.opponentTeam }}</h3> 
      <div class="score-container">
        <p class="score">{{ currentSet.opponentScore }}</p>
        <div class="score-buttons">
          <button @click="handleAdjustScore('opponent', 1)" class="btn btn-increment" aria-label="Increase Opponent score">+</button>
          <button @click="handleAdjustScore('opponent', -1)" class="btn btn-decrement" aria-label="Decrease Opponent score">-</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    currentSet: Object,
    game: Object,
    setsWon: Object
  },
  emits: ['adjustScore'],
  methods: {
    handleAdjustScore(team, amount) {
      this.$emit('adjustScore', team, amount);
    }
  }
};
</script>
<style scoped>
.scoreboard {
  display: flex;
  flex-direction: column; /* Mobile-first: Stack vertically */
  align-items: center;
  background-color: #e0f2fe;
  border-radius: 1rem;
  padding: 1rem; 
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.team-score {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%; /* Take up full width on mobile */
  margin-bottom: 1rem;
}

.team-name {
  font-size: 1 rem; /* Larger for better visibility */
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.score-container {
  display: flex;
  flex-direction: row;
  align-items: center; /* Align score and buttons */
  gap: 1rem;
}

.score {
  font-size: 3rem; /* Larger score */
  font-weight: bold;
  line-height: 1;
}

.score-buttons {
  display: flex;
  flex-direction: row; /* Stack buttons vertically */
  gap: 0.5rem;
}

.btn {
  width: 2rem;
  height: 2rem;
  font-size: 1rem; 
  font-weight: bold;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-increment {
  background-color: #34d399;
  color: #fff;
}

.btn-decrement {
  background-color: #f87171;
  color: #fff;
}

.btn:hover {
  opacity: 0.8;
}

.set-info {
  text-align: center;
  margin-bottom: 1rem;
}

.current-set {
  font-size: 1.25rem; 
  font-weight: bold;
}

.sets-won {
  font-size: 1.5rem; 
  font-weight: bold;
}

/* Optional: Larger screen layout */
@media (min-width: 640px) {
  .scoreboard {
    flex-direction: row;
    justify-content: space-around; /* More balanced spacing */
  }
  .team-score {
    margin-bottom: 0; /* Reset margin for row layout */
    width: auto;  /* Teams scores take natural width */
  }

  .score-buttons {
    flex-direction: row; /* Buttons back to horizontal */
  }
}
</style>