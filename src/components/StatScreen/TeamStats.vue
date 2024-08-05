<template>
    <div class="team-stats mb-6">
      <button @click="toggleSection" class="section-header">
        <h3 class="text-lg font-semibold">Team Stats</h3>
        <i :class="['fas', isOpen ? 'fa-chevron-up' : 'fa-chevron-down']"></i>
      </button>
      <div v-if="isOpen" class="section-content bg-white p-4 rounded-md shadow-sm">
        <table class="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr>
              <th class="px-4 py-2 text-left border border-gray-300">
                Stat Category
              </th>
              <th class="px-4 py-2 text-left border border-gray-300">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr class="bg-gray-100">
              <td class="px-4 py-2 border border-gray-300">Total Points</td>
              <td class="px-4 py-2 border border-gray-300">
                {{ getTeamTotalPoints() }} 
              </td>
            </tr>
            <tr>
              <td class="px-4 py-2 border border-gray-300">Total Errors</td>
              <td class="px-4 py-2 border border-gray-300">
                {{ getTeamTotalErrors() }} 
              </td>
            </tr>
            <tr class="bg-gray-100">
              <td class="px-4 py-2 border border-gray-300">
                Serve Efficiency
              </td>
              <td class="px-4 py-2 border border-gray-300">
                {{ getTeamServeEfficiency().toFixed(2) }} 
              </td>
            </tr>
            <tr>
              <td class="px-4 py-2 border border-gray-300">
                Attack Efficiency
              </td>
              <td class="px-4 py-2 border border-gray-300">
                {{ getTeamAttackEfficiency().toFixed(2) }} 
              </td>
            </tr>
            <tr class="bg-gray-100">
              <td class="px-4 py-2 border border-gray-300">
                Block Efficiency
              </td>
              <td class="px-4 py-2 border border-gray-300">
                {{ getTeamBlockEfficiency().toFixed(2) }} 
              </td>
            </tr>
            <tr>
              <td class="px-4 py-2 border border-gray-300">
                Side Out Percentage
              </td>
              <td class="px-4 py-2 border border-gray-300">
                {{ getTeamSideOutPercentage().toFixed(2) }} 
              </td>
            </tr>
            <tr class="bg-gray-100">
              <td class="px-4 py-2 border border-gray-300">
                Break Point Percentage
              </td>
              <td class="px-4 py-2 border border-gray-300">
                {{ getTeamBreakPointPercentage().toFixed(2) }} 
              </td>
            </tr>
          </tbody>
        </table>
  
        <!-- Rotation Effectiveness Table -->
        <table class="w-full table-auto mt-4">
          <thead>
            <tr>
              <th class="px-4 py-2 text-left border border-gray-300">
                Rotation (Player Names)
              </th>
              <th class="px-4 py-2 text-left border border-gray-300">
                Receive Effectiveness
              </th>
              <th class="px-4 py-2 text-left border border-gray-300">
                Block Effectiveness
              </th>
              <th class="px-4 py-2 text-left border border-gray-300">
                Attack Effectiveness
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(data, rotationKey) in getTeamRotationEffectiveness()" 
              :key="rotationKey"
            >
              <td class="px-4 py-2 border border-gray-300">
                {{
                  rotationKey
                    .split("-")
                    .map(
                      (playerId, index) =>
                        `P${index + 1}: ${getPlayerName(parseInt(playerId))}`
                    )
                    .join(", ")
                }}
              </td>
              <td class="px-4 py-2 border border-gray-300">
                {{ data.receiveEffectiveness }}
              </td>
              <td class="px-4 py-2 border border-gray-300">
                {{ data.blockEffectiveness }}
              </td>
              <td class="px-4 py-2 border border-gray-300">
                {{ data.attackEffectiveness }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
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
      getTeamServeEfficiency() {
        return statsUtils.getTeamServeEfficiency(this.game, this.currentSetNumber);
      },
      getTeamAttackEfficiency() {
        return statsUtils.getTeamAttackEfficiency(this.game, this.currentSetNumber);
      },
      getTeamBlockEfficiency() {
        return statsUtils.getTeamBlockEfficiency(this.game, this.currentSetNumber);
      },
      getTeamSideOutPercentage() {
        return statsUtils.getTeamSideOutPercentage(this.game, this.currentSetNumber);
      },
      getTeamBreakPointPercentage() {
        return statsUtils.getTeamBreakPointPercentage(this.game, this.currentSetNumber);
      },
      getTeamRotationEffectiveness() {
        return statsUtils.getTeamRotationEffectiveness(this.game, this.currentSetNumber, this.getPlayerName); 
      },
    },
  };
  </script>