<template>
  <div class="player-stats-visualizations mb-6">
    <button @click="toggleSection" class="section-header w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors duration-200 rounded-t-md">
      <div class="flex items-center">
        <i class="fas fa-chart-pie text-purple-500 mr-2"></i>
        <h3 class="text-xl font-semibold">{{ $t('statsVisualizations') }}</h3>
      </div>
      <i :class="['fas', isOpen ? 'fa-chevron-up' : 'fa-chevron-down', 'transition-transform duration-300']"></i>
    </button>
    <transition 
      name="expand" 
      @enter="startTransition" 
      @after-enter="endTransition"
      @before-leave="startTransition" 
      @after-leave="endTransition"
    >
      <div v-if="isOpen" class="section-content bg-white p-6 rounded-b-md shadow-md">
        <div class="mb-4">
          <button 
            v-for="tab in tabs" 
            :key="tab"
            @click="activeTab = tab"
            :class="['px-4 py-2 mr-2 rounded-t-lg', 
                     activeTab === tab ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300']"
          >
            {{ $t(tab) }}
          </button>
        </div>
        <div class="chart-container" style="height: 400px;">
          <component 
            :is="activeChart.type" 
            :chartData="activeChart.data" 
            :options="chartOptions"
          />
        </div>
        <div class="mt-4 text-sm text-gray-600">
          {{ $t(activeChart.description) }}
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import * as statsUtils from './statsUtils';
import PieChart from './charts/PieChart.vue';
import BarChart from './charts/BarChart.vue';

export default {
  name: 'PlayerStatsVisualizations',
  components: {
    PieChart,
    BarChart,
  },
  props: {
    game: {
      type: Object,
      required: true,
    },
    playerId: { 
      type: Number,
      required: true 
    },
    currentSetNumber: {
      type: Number,
    },
  },
  setup(props) {
    const { t } = useI18n();
    const isOpen = ref(true);
    const activeTab = ref('serveTypes');

    const tabs = ['serveTypes', 'serveTargets', 'attackTypes', 'attackTargets'];

    const charts = computed(() => {
      const serveStats = statsUtils.getAdvancedServeStats(props.game, props.playerId, props.currentSetNumber);
      const attackStats = statsUtils.getAdvancedAttackStats(props.game, props.playerId, props.currentSetNumber);

      return {
        'serveTypes': {
          type: 'PieChart',
          data: formatPieChartData(serveStats.typePerPoint),
          description: 'serveTypesDescription'
        },
        'serveTargets': {
          type: 'BarChart',
          data: formatBarChartData(serveStats.targetPerPoint),
          description: 'serveTargetsDescription'
        },
        'attackTypes': {
          type: 'PieChart',
          data: formatPieChartData(attackStats.typePerPoint),
          description: 'attackTypesDescription'
        },
        'attackTargets': {
          type: 'BarChart',
          data: formatBarChartData(attackStats.targetPerPoint),
          description: 'attackTargetsDescription'
        },
      };
    });

    const activeChart = computed(() => charts.value[activeTab.value]);

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
    };

    const formatPieChartData = (data) => {
      if (!data || typeof data !== 'object') {
        return { labels: [t('noData')], datasets: [{ data: [1], backgroundColor: ['#CCCCCC'] }] };
      }
      const labels = Object.keys(data).map(key => t(key));
      const values = Object.values(data);
      return {
        labels,
        datasets: [{
          data: values,
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
        }],
      };
    };

    const formatBarChartData = (data) => {
      if (!data || typeof data !== 'object') {
        return { labels: [t('noData')], datasets: [{ data: [0], backgroundColor: '#CCCCCC' }] };
      }
      const labels = Object.keys(data).map(key => t(key));
      const points = labels.map(target => data[target]?.points || 0);
      const percentages = labels.map(target => (data[target]?.percentage || 0) * 100);
      
      return {
        labels,
        datasets: [
          {
            label: t('points'),
            data: points,
            backgroundColor: '#36A2EB',
          },
          {
            label: t('percentage'),
            data: percentages,
            backgroundColor: '#FF6384',
          },
        ],
      };
    };

    const toggleSection = () => {
      isOpen.value = !isOpen.value;
    };

    const startTransition = (el) => {
      el.style.height = 'auto';
      let endHeight = getComputedStyle(el).height;
      el.style.height = '0px';
      el.offsetHeight; // force repaint
      el.style.height = endHeight;
    };

    const endTransition = (el) => {
      el.style.height = '';
    };

    return {
      t,
      isOpen,
      activeTab,
      tabs,
      activeChart,
      chartOptions,
      toggleSection,
      startTransition,
      endTransition,
    };
  },
};
</script>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: height 0.3s ease-out;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  height: 0;
}

.chart-container {
  width: 100%;
}
</style>
