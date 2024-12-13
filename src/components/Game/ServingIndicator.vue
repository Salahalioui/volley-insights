<template>
  <div class="serving-indicator bg-purple-100 rounded-lg p-3 sm:p-4 shadow-md flex items-center justify-between">
    <div class="serving-team flex items-center">
      <span class="icon text-2xl sm:text-3xl mr-2" :class="{ 'text-pink-500': isOpponentServing, 'text-purple-500': !isOpponentServing }">
        🏐
      </span>
      <p class="team-name text-sm sm:text-base font-bold" :class="{ 'text-pink-700': isOpponentServing, 'text-purple-700': !isOpponentServing }">
        {{ isOpponentServing ? game.opponentTeam : $t('ourTeam') }}
      </p>
    </div>
    <button 
      @click="toggleServingTeam" 
      class="btn-switch text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-2 rounded-md font-bold transition-colors duration-300"
      :class="{ 'bg-pink-500 hover:bg-pink-600': isOpponentServing, 'bg-purple-500 hover:bg-purple-600': !isOpponentServing }"
    >
      {{ isOpponentServing ? $t('serveLeft') : $t('serveRight') }}
    </button>
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n';

export default {
  props: {
    isOpponentServing: Boolean,
    game: Object
  },
  emits: ['toggleServingTeam'],
  setup(props, { emit }) {
    const { t } = useI18n();

    const toggleServingTeam = () => {
      emit('toggleServingTeam');
    };

    return { t, toggleServingTeam };
  }
};
</script>

<style scoped>
@keyframes bounce {
  from { transform: translateY(0); }
  to { transform: translateY(-3px); }
}

.icon {
  animation: bounce 0.8s infinite alternate;
}

@media (max-width: 640px) {
  .serving-indicator {
    @apply p-2;
  }
}
</style>
