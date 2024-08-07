<template>
  <div class="basic-stats mb-6">
    <button @click="toggleSection" class="section-header w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors duration-200 rounded-t-md">
      <div class="flex items-center">
        <i class="fas fa-user-chart text-green-500 mr-2"></i>
        <h3 class="text-xl font-semibold">Basic Stats</h3>
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
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <StatCard v-for="stat in summaryStats" :key="stat.name" :title="stat.name" :value="stat.value" :type="stat.type" />
        </div>
        <div class="overflow-x-auto">
          <table class="w-full table-auto border-collapse border border-gray-300">
            <thead class="bg-gray-100">
              <tr>
                <th class="px-4 py-2 text-left border border-gray-300">Category</th>
                <th class="px-4 py-2 text-left border border-gray-300">Attempts</th>
                <th class="px-4 py-2 text-left border border-gray-300">Points</th>
                <th class="px-4 py-2 text-left border border-gray-300">Errors</th>
                <th class="px-4 py-2 text-left border border-gray-300">Efficiency</th> 
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="stat in playerStats" 
                :key="stat.category" 
                class="hover:bg-gray-50 transition-colors duration-150"
              >
                <td class="px-4 py-2 border border-gray-300 font-medium">{{ stat.category }}</td>
                <td class="px-4 py-2 border border-gray-300">{{ stat.totalAttempts }}</td>
                <td class="px-4 py-2 border border-gray-300">{{ stat.points }}</td>
                <td class="px-4 py-2 border border-gray-300">{{ stat.errors }}</td>
                <td class="px-4 py-2 border border-gray-300">
                  <div class="flex items-center">
                    <div class="w-16 bg-gray-200 rounded-full h-2.5 mr-2">
                      <div class="bg-blue-600 h-2.5 rounded-full" :style="{ width: `${parseFloat(stat.efficiency)}%` }"></div>
                    </div>
                    <span>{{ stat.efficiency }}</span>
                  </div>
                </td> 
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import * as statsUtils from './statsUtils';
import StatCard from './StatCard.vue';

export default {
  components: { StatCard },
  props: {
    game: {
      type: Object,
      required: true,
    },
    playerId: { 
      type: Number,
      required: true,
    },
    currentSetNumber: {
      type: Number,
    },
  },
  setup(props) {
    const isOpen = ref(true);

    const playerStats = computed(() => {
      const categories = ['Serve', 'Reception', 'Setting', 'Attack', 'Block', 'Dig'];
      return categories.map(category => {
        const stats = statsUtils[`get${category}Stats`](props.game, props.playerId, props.currentSetNumber);
        return {
          category,
          ...stats,
          efficiency: (stats.efficiency * 100).toFixed(2) + '%',
        };
      });
    });

    const summaryStats = computed(() => {
      const totalPoints = playerStats.value.reduce((sum, stat) => sum + stat.points, 0);
      const totalErrors = playerStats.value.reduce((sum, stat) => sum + stat.errors, 0);
      const totalAttempts = playerStats.value.reduce((sum, stat) => sum + stat.totalAttempts, 0);
      const overallEfficiency = totalAttempts > 0 ? ((totalPoints - totalErrors) / totalAttempts * 100).toFixed(2) + '%' : '0%';

      return [
        { name: 'Total Points', value: totalPoints, type: 'number' },
        { name: 'Total Errors', value: totalErrors, type: 'number' },
        { name: 'Overall Efficiency', value: overallEfficiency, type: 'percentage' },
      ];
    });

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
      isOpen,
      playerStats,
      summaryStats,
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
</style>
