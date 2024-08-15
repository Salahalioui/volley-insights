<template>
  <div class="stat-screen bg-gray-100 min-h-screen">
    <header class="bg-blue-600 text-white p-4 shadow-md flex justify-between items-center">
      <h2 class="text-2xl font-bold">{{ $t('gameStatistics') }}</h2>
      <button @click="showExportModal = true" class="bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-100 transition-colors">
        {{ $t('export') }}
      </button>
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

    <main id="stat-screen-content" class="p-4">
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

    <!-- Enhanced Export Modal -->
    <div v-if="showExportModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-lg">
        <h3 class="text-xl font-semibold mb-4">{{ $t('exportOptions') }}</h3>
        
        <!-- Content Selection -->
        <div class="mb-4">
          <h4 class="font-medium mb-2">{{ $t('contentToInclude') }}</h4>
          <div class="space-y-2">
            <label class="flex items-center">
              <input type="checkbox" v-model="exportOptions.gameSummary" class="mr-2">
              <span>{{ $t('gameSummary') }}</span>
            </label>
            <label class="flex items-center">
              <input type="checkbox" v-model="exportOptions.teamStats" class="mr-2">
              <span>{{ $t('teamStats') }}</span>
            </label>
            <label class="flex items-center">
              <input type="checkbox" v-model="exportOptions.playerStats" class="mr-2">
              <span>{{ $t('playerStats') }}</span>
            </label>
          </div>
        </div>

        <!-- PDF Styling Options -->
        <div class="mb-4">
          <h4 class="font-medium mb-2">{{ $t('pdfStyling') }}</h4>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">{{ $t('pageSize') }}</label>
              <select v-model="pdfOptions.format" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                <option value="a4">A4</option>
                <option value="letter">Letter</option>
                <option value="legal">Legal</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">{{ $t('orientation') }}</label>
              <select v-model="pdfOptions.orientation" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                <option value="portrait">{{ $t('portrait') }}</option>
                <option value="landscape">{{ $t('landscape') }}</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Header and Footer -->
        <div class="mb-4">
          <h4 class="font-medium mb-2">{{ $t('headerAndFooter') }}</h4>
          <div class="space-y-2">
            <label class="block">
              <span class="text-sm font-medium text-gray-700">{{ $t('pdfTitle') }}</span>
              <input type="text" v-model="pdfOptions.title" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
            </label>
            <label class="flex items-center">
              <input type="checkbox" v-model="pdfOptions.includeDateTime" class="mr-2">
              <span>{{ $t('includeDatetime') }}</span>
            </label>
            <label class="flex items-center">
              <input type="checkbox" v-model="pdfOptions.includePageNumbers" class="mr-2">
              <span>{{ $t('includePageNumbers') }}</span>
            </label>
          </div>
        </div>

        <div class="mt-6 flex justify-end space-x-3">
          <button @click="showExportModal = false" class="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors">
            {{ $t('cancel') }}
          </button>
          <button @click="exportToPDF" :disabled="isExporting" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50">
            {{ isExporting ? $t('exporting') : $t('exportToPDF') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import html2pdf from 'html2pdf.js';
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
    const isExporting = ref(false);
    const showExportModal = ref(false);
    const exportOptions = ref({
      gameSummary: true,
      teamStats: true,
      playerStats: true
    });
    const pdfOptions = ref({
      format: 'a4',
      orientation: 'portrait',
      title: '',
      includeDateTime: true,
      includePageNumbers: true
    });

    const currentSetNumber = computed(() => {
      return activeTab.value === 'set' ? props.game.currentSet : null;
    });

    const setActiveTab = (tab) => {
      activeTab.value = tab;
    };

    const handlePlayerSelected = (playerId) => {
      selectedPlayer.value = playerId;
    };

    const exportToPDF = async () => {
      if (isExporting.value) return;
      isExporting.value = true;
      showExportModal.value = false;

      const element = document.getElementById('stat-screen-content');
      const clonedElement = element.cloneNode(true);

      // Remove unselected sections
      if (!exportOptions.value.gameSummary) {
        const gameSummary = clonedElement.querySelector('#game-summary');
        if (gameSummary) gameSummary.remove();
      }
      if (!exportOptions.value.teamStats) {
        const teamStats = clonedElement.querySelector('#team-stats');
        if (teamStats) teamStats.remove();
      }
      if (!exportOptions.value.playerStats) {
        const playerStats = clonedElement.querySelector('#player-stats');
        if (playerStats) playerStats.remove();
      }

      // Add custom header
      const header = document.createElement('div');
      header.innerHTML = `<h1 style="text-align: center; color: #2563eb; font-size: 24px; margin-bottom: 20px;">${pdfOptions.value.title || 'Game Statistics'}</h1>`;
      if (pdfOptions.value.includeDateTime) {
        header.innerHTML += `<p style="text-align: center; font-size: 14px; margin-bottom: 20px;">Generated on: ${new Date().toLocaleString()}</p>`;
      }
      clonedElement.insertBefore(header, clonedElement.firstChild);

      const opt = {
        margin: 10,
        filename: `game-statistics-${props.game.id}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { 
          unit: 'mm', 
          format: pdfOptions.value.format, 
          orientation: pdfOptions.value.orientation 
        },
        pagebreak: { mode: 'avoid-all' }
      };

      if (pdfOptions.value.includePageNumbers) {
        opt.footer = {
          height: '20px',
          contents: {
            default: '<span style="color: #444; font-size: 10px; float: right; margin-right: 10px;">Page {{page}} of {{pages}}</span>'
          }
        };
      }

      try {
        await html2pdf().set(opt).from(clonedElement).save();
      } catch (error) {
        console.error('Error exporting PDF:', error);
        // You might want to show an error message to the user here
      } finally {
        isExporting.value = false;
      }
    };

    return {
      t,
      activeTab,
      selectedPlayer,
      currentSetNumber,
      setActiveTab,
      handlePlayerSelected,
      exportToPDF,
      isExporting,
      exportOptions,
      pdfOptions,
      showExportModal
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