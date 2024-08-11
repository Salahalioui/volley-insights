<template>
  <div class="stat-screen bg-gray-100 min-h-screen">
    <header class="bg-blue-600 text-white p-4 shadow-md">
      <h2 class="text-2xl font-bold">{{ $t('gameStatistics') }}</h2>
    </header>

    <nav class="bg-white shadow-md">
      <ul class="flex">
        <li 
          @click="setActiveTab('set')" 
          :class="{ 'active': activeTab === 'set' }" 
          class="tab-item"
        >
          {{ $t('setStats') }}
        </li>
        <li 
          @click="setActiveTab('game')" 
          :class="{ 'active': activeTab === 'game' }" 
          class="tab-item"
        >
          {{ $t('gameStats') }}
        </li>
      </ul>
    </nav>

    <main class="p-4">
      <transition name="fade" mode="out-in">
        <GameSummary 
          v-if="activeTab === 'game'" 
          :game="game" 
        />
      </transition>

      <transition name="fade" mode="out-in">
        <TeamStats 
          v-if="activeTab === 'set' || activeTab === 'game'" 
          :game="game" 
          :currentSetNumber="currentSetNumber" 
          :getPlayerName="getPlayerName" 
        />
      </transition>

      <PlayerStats
        :game="game"
        :selectedPlayer="selectedPlayer"
        :getPlayerName="getPlayerName"
        :currentSetNumber="currentSetNumber"  
        @player-selected="handlePlayerSelected"
      />
    </main>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import GameSummary from './StatScreen/GameSummary.vue';
import TeamStats from './StatScreen/TeamStats.vue';
import PlayerStats from './StatScreen/PlayerStats.vue';

export default {
  name: 'StatScreen',
  components: {
    GameSummary,
    TeamStats,
    PlayerStats
  },
  props: {
    game: {
      type: Object,
      required: true,
    },
    getPlayerName: {
      type: Function,
      required: true,
    },
  },
  setup(props) {
    const { t } = useI18n();
    const activeTab = ref('set');
    const selectedPlayer = ref(null);

    const currentSetNumber = computed(() => {
      return activeTab.value === 'set' ? props.game.currentSet : null;
    });

    const setActiveTab = (tab) => {
      activeTab.value = tab;
    };

    const handlePlayerSelected = (playerId) => {
      selectedPlayer.value = playerId;
    };

    return {
      t,
      activeTab,
      selectedPlayer,
      currentSetNumber,
      setActiveTab,
      handlePlayerSelected
    };
  }
};
</script>




<style scoped>
.tab-item {
  @apply px-4 py-2 cursor-pointer transition-colors duration-200;
}
.tab-item.active {
  @apply bg-blue-600 text-white;
}
.fade-enter-active, 
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, 
.fade-leave-to {
  opacity: 0;
}
</style>
