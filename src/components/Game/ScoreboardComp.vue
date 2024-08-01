<template>
  <div class="scoreboard">
    <div class="team-score">
      <h2 class="team-name">Our Team</h2>
      <p class="score">{{ currentSet.teamScore }}</p>
      <div class="score-buttons">
        <button @click="handleAdjustScore('team', 1)" class="btn btn-increment" aria-label="Increase Our Team score">+</button>
        <button @click="handleAdjustScore('team', -1)" class="btn btn-decrement" aria-label="Decrease Our Team score">-</button>
      </div>
    </div>
    <div class="set-info">
      <p class="current-set">Set {{ game.currentSet }}</p>
      <p class="sets-won">{{ setsWon.team }} - {{ setsWon.opponent }}</p>
    </div>
    <div class="team-score">
      <h2 class="team-name">{{ game.opponentTeam }}</h2>
      <p class="score">{{ currentSet.opponentScore }}</p>
      <div class="score-buttons">
        <button @click="handleAdjustScore('opponent', 1)" class="btn btn-increment" aria-label="Increase Opponent score">+</button>
        <button @click="handleAdjustScore('opponent', -1)" class="btn btn-decrement" aria-label="Decrease Opponent score">-</button>
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
  flex-direction: column;
  align-items: center;
  background-color: #e0f2fe;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.team-score {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1.5rem;
}

.team-name {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.score {
  font-size: 3rem;
  font-weight: bold;
  line-height: 1;
  margin-bottom: 0.5rem;
}

.score-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn {
  width: 2.5rem;
  height: 2.5rem;
  font-size: 1.5rem;
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
  margin-bottom: 1.5rem;
}

.current-set {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
}

.sets-won {
  font-size: 1.25rem;
}

@media (min-width: 640px) {
  .scoreboard {
    flex-direction: row;
    justify-content: space-between;
  }

  .team-score {
    margin-bottom: 0;
  }

  .set-info {
    margin-bottom: 0;
  }
}

@media (min-width: 768px) {
  .team-name {
    font-size: 1.5rem;
  }

  .score {
    font-size: 4rem;
  }

  .current-set {
    font-size: 2rem;
  }

  .sets-won {
    font-size: 1.5rem;
  }
}
</style>