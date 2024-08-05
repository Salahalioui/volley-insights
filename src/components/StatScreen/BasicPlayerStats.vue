<template>
    <div class="basic-stats mb-6">
      <button @click="toggleSection" class="section-header">
        <h3 class="text-lg font-semibold">Basic Stats</h3>
        <i :class="['fas', isOpen ? 'fa-chevron-up' : 'fa-chevron-down']"></i>
      </button>
      <div v-if="isOpen" class="section-content bg-white p-4 rounded-md shadow-sm">
        <table class="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr>
              <th class="px-4 py-2 text-left border border-gray-300">
                Stat Category
              </th>
              <th class="px-4 py-2 text-left border border-gray-300">
                Total Attempts
              </th>
              <th class="px-4 py-2 text-left border border-gray-300">
                Points
              </th>
              <th class="px-4 py-2 text-left border border-gray-300">
                Errors
              </th>
              <th class="px-4 py-2 text-left border border-gray-300">
                Efficiency
              </th>
            </tr>
          </thead>
          <tbody>
            <!-- Serve Stats -->
            <tr class="bg-gray-100">
              <td class="px-4 py-2 border border-gray-300">Serve</td>
              <td class="px-4 py-2 border border-gray-300">
                {{ getServeStats().totalAttempts }}
              </td>
              <td class="px-4 py-2 border border-gray-300">
                {{ getServeStats().points }}
              </td>
              <td class="px-4 py-2 border border-gray-300">
                {{ getServeStats().errors }}
              </td>
              <td class="px-4 py-2 border border-gray-300">
                {{ getServeStats().efficiency.toFixed(2) }}
              </td>
            </tr>
  
            <!-- Reception Stats -->
            <tr>
              <td class="px-4 py-2 border border-gray-300">Reception</td>
              <td class="px-4 py-2 border border-gray-300">
                {{ getReceptionStats().totalAttempts }}
              </td>
              <td class="px-4 py-2 border border-gray-300">
                {{ getReceptionStats().points }}
              </td>
              <td class="px-4 py-2 border border-gray-300">
                {{ getReceptionStats().errors }}
              </td>
              <td class="px-4 py-2 border border-gray-300">
                {{ getReceptionStats().efficiency.toFixed(2) }}
              </td>
            </tr>
  
            <!-- Setting Stats -->
            <tr class="bg-gray-100">
              <td class="px-4 py-2 border border-gray-300">Setting</td>
              <td class="px-4 py-2 border border-gray-300">
                {{ getSettingStats().totalAttempts }}
              </td>
              <td class="px-4 py-2 border border-gray-300">
                {{ getSettingStats().points }}
              </td>
              <td class="px-4 py-2 border border-gray-300">
                {{ getSettingStats().errors }}
              </td>
              <td class="px-4 py-2 border border-gray-300">
                {{ getSettingStats().efficiency.toFixed(2) }}
              </td>
            </tr>
  
            <!-- Attack Stats -->
            <tr>
              <td class="px-4 py-2 border border-gray-300">Attack</td>
              <td class="px-4 py-2 border border-gray-300">
                {{ getAttackStats().totalAttempts }}
              </td>
              <td class="px-4 py-2 border border-gray-300">
                {{ getAttackStats().points }}
              </td>
              <td class="px-4 py-2 border border-gray-300">
                {{ getAttackStats().errors }}
              </td>
              <td class="px-4 py-2 border border-gray-300">
                {{ getAttackStats().efficiency.toFixed(2) }}
              </td>
            </tr>
  
            <!-- Block Stats -->
            <tr class="bg-gray-100">
              <td class="px-4 py-2 border border-gray-300">Block</td>
              <td class="px-4 py-2 border border-gray-300">
                {{ getBlockStats().totalAttempts }}
              </td>
              <td class="px-4 py-2 border border-gray-300">
                {{ getBlockStats().points }}
              </td>
              <td class="px-4 py-2 border border-gray-300">
                {{ getBlockStats().errors }}
              </td>
              <td class="px-4 py-2 border border-gray-300">
                {{ getBlockStats().efficiency.toFixed(2) }}
              </td>
            </tr>
  
            <!-- Dig Stats -->
            <tr>
              <td class="px-4 py-2 border border-gray-300">Dig</td>
              <td class="px-4 py-2 border border-gray-300">
                {{ getDigStats().totalAttempts }}
              </td>
              <td class="px-4 py-2 border border-gray-300">
                {{ getDigStats().validAttempts }}
              </td>
              <td class="px-4 py-2 border border-gray-300">
                {{ getDigStats().errors }}
              </td>
              <td class="px-4 py-2 border border-gray-300">-</td>
            </tr>
          </tbody>
        </table>
      </div>
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
      getServeStats() {
        return statsUtils.getServeStats(this.game, this.playerId, this.currentSetNumber);
      },
      getReceptionStats() {
        return statsUtils.getReceptionStats(this.game, this.playerId, this.currentSetNumber);
      },
      getSettingStats() {
        return statsUtils.getSettingStats(this.game, this.playerId, this.currentSetNumber);
      },
      getAttackStats() {
        return statsUtils.getAttackStats(this.game, this.playerId, this.currentSetNumber);
      },
      getBlockStats() {
        return statsUtils.getBlockStats(this.game, this.playerId, this.currentSetNumber);
      },
      getDigStats() {
        return statsUtils.getDigStats(this.game, this.playerId, this.currentSetNumber);
      },
    },
  };
  </script>