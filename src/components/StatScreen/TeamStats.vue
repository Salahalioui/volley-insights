<template>
  <div class="team-stats bg-white rounded-lg shadow-md mb-6">
    <button @click="toggleSection" class="section-header w-full flex justify-between items-center p-4 hover:bg-gray-50 transition-colors duration-200">
      <div class="flex items-center">
        <i class="fas fa-chart-bar text-blue-500 mr-2"></i>
        <h3 class="text-xl font-semibold">Team Stats</h3>
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
      <div v-if="isOpen" class="section-content p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <StatCard v-for="stat in teamStats" :key="stat.name" :title="stat.name" :value="stat.value" :type="stat.type" />
        </div>

        <h4 class="text-lg font-semibold mb-3">Rotation Effectiveness</h4>
        <div class="overflow-x-auto">
          <table class="w-full table-auto border-collapse border border-gray-300">
            <thead class="bg-gray-100">
              <tr>
                <th class="px-4 py-2 text-left border border-gray-300">Rotation (Player Names)</th>
                <th class="px-4 py-2 text-left border border-gray-300">Effectiveness (%)</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(data, rotationKey) in rotationEffectiveness" :key="rotationKey" class="hover:bg-gray-50 transition-colors duration-200">
                <td class="px-4 py-2 border border-gray-300">
                  {{ formatRotationKey(rotationKey) }} 
                  <span v-if="data.pointsScored" class="text-sm text-gray-500">({{ data.pointsScored }} points)</span>
                </td>
                <td class="px-4 py-2 border border-gray-300">
                  <div class="flex items-center">
                    <div class="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                      <div class="bg-blue-600 h-2.5 rounded-full" :style="{ width: `${data.effectiveness}%` }"></div>
                    </div>
                    <span class="text-sm font-medium">{{ data.effectiveness.toFixed(1) }}%</span>
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
import * as statsUtils from "./statsUtils";
import StatCard from './StatCard.vue';

export default {
  components: { StatCard },
  props: {
    game: {
      type: Object,
      required: true,
    },
    currentSetNumber: {
      type: Number,
      required: true,
    },
    getPlayerName: {
      type: Function,
      required: true,
    },
  },
  setup(props) {
    const isOpen = ref(true);

    const teamStats = computed(() => [
      { name: "Total Points", value: statsUtils.getTeamTotalPoints(props.game, props.currentSetNumber), type: 'number' },
      { name: "Total Errors", value: statsUtils.getTeamTotalErrors(props.game, props.currentSetNumber), type: 'number' },
      { name: "Serve Error %", value: statsUtils.getTeamServeErrorPercentage(props.game, props.currentSetNumber), type: 'percentage' },
      { name: "Attack Efficiency", value: statsUtils.getTeamAttackEfficiency(props.game, props.currentSetNumber) * 100, type: 'percentage' },
      { name: "Block Error %", value: statsUtils.getTeamBlockErrorPercentage(props.game, props.currentSetNumber), type: 'percentage' },
      { name: "Side Out %", value: statsUtils.getTeamSideOutPercentage(props.game, props.currentSetNumber), type: 'percentage' },
      { name: "Break Point %", value: statsUtils.getTeamBreakPointPercentage(props.game, props.currentSetNumber), type: 'percentage' },
    ]);

    const rotationEffectiveness = computed(() => 
      statsUtils.getTeamRotationEffectiveness(props.game, props.currentSetNumber)
    );

    const toggleSection = () => {
      isOpen.value = !isOpen.value;
    };

    const formatRotationKey = (rotationKey) => {
      return rotationKey
        .split('-')
        .map((playerId, index) => `P${index + 1}: ${props.getPlayerName(parseInt(playerId))}`)
        .join(', ');
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
      teamStats,
      rotationEffectiveness,
      toggleSection,
      formatRotationKey,
      startTransition,
      endTransition
    };
  }
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
