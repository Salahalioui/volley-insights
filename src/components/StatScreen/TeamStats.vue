<template>
  <div class="team-stats mb-6">
    <button @click="toggleSection" class="section-header">
      <div class="flex items-center">
        <i class="fas fa-chart-bar text-blue-500 mr-2"></i>
        <h3 class="text-xl font-semibold">Team Stats</h3>
      </div>
      <i :class="['fas', isOpen ? 'fa-chevron-up' : 'fa-chevron-down', 'transition-transform duration-300']"></i>
    </button>
    <transition name="fade">
      <div v-if="isOpen" class="section-content bg-white p-6 rounded-md shadow-md">
        <div class="overflow-x-auto">
          <table class="w-full table-auto border-collapse border border-gray-300 mb-6">
            <thead class="bg-gray-100">
              <tr>
                <th class="px-4 py-2 text-left border border-gray-300">Stat Category</th>
                <th class="px-4 py-2 text-left border border-gray-300">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(stat, index) in teamStats" :key="index" :class="{ 'bg-gray-50': index % 2 === 0 }">
                <td class="px-4 py-2 border border-gray-300 font-medium">{{ stat.name }}</td>
                <td class="px-4 py-2 border border-gray-300">
                  <span v-if="stat.type === 'percentage'">{{ stat.value.toFixed(2) }}%</span> 
                  <span v-else>{{ stat.value }}</span> 
                </td>
              </tr>
            </tbody>
          </table>
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
              <tr v-for="(data, rotationKey) in getTeamRotationEffectiveness()" :key="rotationKey" class="hover:bg-gray-50">
                <td class="px-4 py-2 border border-gray-300">
                  {{ formatRotationKey(rotationKey) }} <span v-if="data.pointsScored">({{ data.pointsScored }} points)</span>
                </td>
                <td class="px-4 py-2 border border-gray-300">{{ data.effectiveness }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import * as statsUtils from "./statsUtils";

export default {
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
  data() {
    return {
      isOpen: true,
    };
  },
  computed: {
    teamStats() {
      return [
        { name: "Total Points", value: this.getTeamTotalPoints(), type: 'number' },
        { name: "Total Errors", value: this.getTeamTotalErrors(), type: 'number' },
        { name: "Serve Error Percentage", value: this.getTeamServeErrorPercentage(), type: 'percentage' }, 
        { name: "Attack Efficiency", value: this.getTeamAttackEfficiency(), type: 'percentage' },
        { name: "Block Error Percentage", value: this.getTeamBlockErrorPercentage(), type: 'percentage' }, 
        { name: "Side Out Percentage", value: this.getTeamSideOutPercentage(), type: 'percentage' },
        { name: "Break Point Percentage", value: this.getTeamBreakPointPercentage(), type: 'percentage' },
      ];
    },
  },
  methods: {
    toggleSection() {
      this.isOpen = !this.isOpen;
    },
    getTeamTotalPoints() {
      return statsUtils.getTeamTotalPoints(this.game, this.currentSetNumber);
    },
    getTeamTotalErrors() {
      return statsUtils.getTeamTotalErrors(this.game, this.currentSetNumber);
    },
    getTeamServeErrorPercentage() {
      return statsUtils.getTeamServeErrorPercentage(this.game, this.currentSetNumber);
    },
    getTeamAttackEfficiency() {
      return statsUtils.getTeamAttackEfficiency(this.game, this.currentSetNumber) * 100; 
    },
    getTeamBlockErrorPercentage() {
      return statsUtils.getTeamBlockErrorPercentage(this.game, this.currentSetNumber);
    },
    getTeamSideOutPercentage() {
      return statsUtils.getTeamSideOutPercentage(this.game, this.currentSetNumber);
    },
    getTeamBreakPointPercentage() {
      return statsUtils.getTeamBreakPointPercentage(this.game, this.currentSetNumber);
    },
    getTeamRotationEffectiveness() {
      return statsUtils.getTeamRotationEffectiveness(this.game, this.currentSetNumber);
    },
    formatRotationKey(rotationKey) {
      return rotationKey
        .split('-')
        .map((playerId, index) => `P${index + 1}: ${this.getPlayerName(parseInt(playerId))}`)
        .join(', ');
    },
  },
};
</script>