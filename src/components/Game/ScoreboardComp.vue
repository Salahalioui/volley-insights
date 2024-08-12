<template>
  <div class="scoreboard bg-blue-100 rounded-xl p-2 sm:p-4 shadow-lg">
    <div class="flex flex-row justify-between items-center">
      <!-- Our Team -->
      <div class="team-score flex-1">
        <h3 class="team-name text-sm sm:text-lg font-bold mb-1 sm:mb-2 text-left">{{ $t('ourTeam') }}</h3> 
        <div class="score-container flex items-center justify-start">
          <button @click="handleAdjustScore('team', -1)" class="btn btn-decrement" :aria-label="$t('decreaseOurTeamScore')">-</button>
          <p class="score mx-2 sm:mx-4 text-2xl sm:text-4xl font-bold">{{ currentSet.teamScore }}</p>
          <button @click="handleAdjustScore('team', 1)" class="btn btn-increment" :aria-label="$t('increaseOurTeamScore')">+</button>
        </div>
      </div>

      <!-- Set Info -->
      <div class="set-info text-center mx-2">
        <p class="sets-won text-lg sm:text-2xl font-bold">{{ setsWon.team }} - {{ setsWon.opponent }}</p>
        <p class="current-set text-xs sm:text-lg font-semibold">{{ 'set' }} {{ game.currentSet }}</p>
      </div>

      <!-- Opponent Team -->
      <div class="team-score flex-1">
        <h3 class="team-name text-sm sm:text-lg font-bold mb-1 sm:mb-2 text-right">{{ game.opponentTeam }}</h3> 
        <div class="score-container flex items-center justify-end">
          <button @click="handleAdjustScore('opponent', -1)" class="btn btn-decrement" :aria-label="$t('decreaseOpponentScore')">-</button>
          <p class="score mx-2 sm:mx-4 text-2xl sm:text-4xl font-bold">{{ currentSet.opponentScore }}</p>
          <button @click="handleAdjustScore('opponent', 1)" class="btn btn-increment" :aria-label="$t('increaseOpponentScore')">+</button>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { useI18n } from 'vue-i18n';

export default {
  props: {
    currentSet: Object,
    game: Object,
    setsWon: Object
  },
  emits: ['adjustScore'],
  setup() {
    const { t } = useI18n();
    return { t };
  },
  methods: {
    handleAdjustScore(team, amount) {
      this.$emit('adjustScore', team, amount);
    }
  }
};
</script>

<style scoped>
.btn {
  @apply w-8 h-8 sm:w-10 sm:h-10 rounded-full text-white font-bold text-sm sm:text-xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 ease-in-out;
}

.btn-increment {
  @apply bg-green-500 hover:bg-green-600 focus:ring-green-400;
}

.btn-decrement {
  @apply bg-red-500 hover:bg-red-600 focus:ring-red-400;
}

@media (max-width: 640px) {
  .scoreboard {
    @apply py-2 px-1;
  }

  .team-name {
    @apply text-xs;
  }

  .score {
    @apply text-xl;
  }

  .sets-won {
    @apply text-base;
  }

  .current-set {
    @apply text-xs;
  }
}
</style>