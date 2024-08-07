<template>
  <div class="basic-stats mb-6">
    <button @click="toggleSection" class="section-header">
      <div class="flex items-center">
        <i class="fas fa-user-chart text-green-500 mr-2"></i>
        <h3 class="text-xl font-semibold">Basic Stats</h3>
      </div>
      <i :class="['fas', isOpen ? 'fa-chevron-up' : 'fa-chevron-down', 'transition-transform duration-300']"></i>
    </button>
    <transition name="fade">
      <div v-if="isOpen" class="section-content bg-white p-6 rounded-md shadow-md">
        <div class="overflow-x-auto">
          <table class="w-full table-auto border-collapse border border-gray-300">
            <thead class="bg-gray-100">
              <tr>
                <th class="px-4 py-2 text-left border border-gray-300">Stat Category</th>
                <th class="px-4 py-2 text-left border border-gray-300">Total Attempts</th>
                <th class="px-4 py-2 text-left border border-gray-300">Points</th>
                <th class="px-4 py-2 text-left border border-gray-300">Errors</th>
                <th class="px-4 py-2 text-left border border-gray-300">Efficiency (%)</th> 
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="(stat, index) in playerStats" 
                :key="index" 
                :class="{ 'bg-gray-50': index % 2 === 0 }" 
                class="hover:bg-gray-100 transition-colors duration-150"
              >
                <td class="px-4 py-2 border border-gray-300 font-medium">{{ stat.category }}</td>
                <td class="px-4 py-2 border border-gray-300">{{ stat.totalAttempts }}</td>
                <td class="px-4 py-2 border border-gray-300">{{ stat.points }}</td>
                <td class="px-4 py-2 border border-gray-300">{{ stat.errors }}</td>
                <td class="px-4 py-2 border border-gray-300">{{ stat.efficiency }}</td> 
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import * as statsUtils from './statsUtils';

export default {
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
  data() {
    return {
      isOpen: true,
    };
  },
  computed: {
    playerStats() {
      return [
        {
          category: 'Serve',
          ...statsUtils.getServeStats(this.game, this.playerId, this.currentSetNumber),
        },
        {
          category: 'Reception',
          ...statsUtils.getReceptionStats(this.game, this.playerId, this.currentSetNumber),
        },
        {
          category: 'Setting',
          ...statsUtils.getSettingStats(this.game, this.playerId, this.currentSetNumber),
        },
        {
          category: 'Attack',
          ...statsUtils.getAttackStats(this.game, this.playerId, this.currentSetNumber),
        },
        {
          category: 'Block',
          ...statsUtils.getBlockStats(this.game, this.playerId, this.currentSetNumber),
        },
        {
          category: 'Dig',
          ...statsUtils.getDigStats(this.game, this.playerId, this.currentSetNumber),
        },
      ].map(stat => ({
        ...stat,
        // Efficiency is now always a percentage 
        efficiency: (stat.efficiency * 100).toFixed(2) + '%', 
      }));
    },
  },
  methods: {
    toggleSection() {
      this.isOpen = !this.isOpen;
    },
  },
};
</script>