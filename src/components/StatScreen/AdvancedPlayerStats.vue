<template>
    <div class="advanced-stats">
      <button @click="toggleSection" class="section-header">
        <h3 class="text-lg font-semibold">Advanced Stats</h3>
        <i :class="['fas', isOpen ? 'fa-chevron-up' : 'fa-chevron-down']"></i>
      </button>
      <div v-if="isOpen" class="section-content bg-white p-4 rounded-md shadow-sm">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <!-- Serve Advanced Stats -->
          <div class="stat-group">
            <h4 class="text-md font-medium mb-2">
              <i class="fas fa-volleyball-ball mr-2"></i>Serve
            </h4>
            <div class="stat-card">
              <h5>Ace Serve Percentage</h5>
              <div 
                class="progress-bar" 
                :style="{ width: getAdvancedServeStats().aceServePercentage + '%' }"
              ></div>
              <p class="stat-value">{{ getAdvancedServeStats().aceServePercentage.toFixed(2) }}%</p>
            </div>
            <div class="stat-card">
              <h5>Valid Serve Percentage</h5>
              <div 
                class="progress-bar" 
                :style="{ width: getAdvancedServeStats().validServePercentage + '%' }"
              ></div>
              <p class="stat-value">{{ getAdvancedServeStats().validServePercentage.toFixed(2) }}%</p>
            </div>
  
            <!-- Points per Serve Type -->
            <div v-if="Object.keys(getAdvancedServeStats().typePerPoint).length > 0" class="stat-card">
              <h5>Points per Serve Type</h5>
              <ul>
                <li 
                  v-for="(points, type) in getAdvancedServeStats().typePerPoint" 
                  :key="type"
                >
                  {{ type }}: {{ points }} point{{ points > 1 ? 's' : '' }}
                </li>
              </ul>
            </div>
  
            <!-- Points per Serve Target -->
            <div v-if="Object.keys(getAdvancedServeStats().targetPerPoint).length > 0" class="stat-card">
              <h5>Points per Serve Target</h5>
              <ul>
                <li 
                  v-for="(data, target) in getAdvancedServeStats().targetPerPoint" 
                  :key="target"
                >
                  {{ target }}: {{ data.points }} / {{ data.attempts }} ({{ (data.percentage * 100).toFixed(2) }}%)
                </li>
              </ul>
            </div>
          </div>
  
          <!-- Reception Advanced Stats -->
          <div class="stat-group">
            <h4 class="text-md font-medium mb-2">
              <i class="fas fa-hands mr-2"></i>Reception
            </h4>
            <div class="stat-card">
              <h5>Valid Reception Percentage</h5>
              <div 
                class="progress-bar" 
                :style="{ width: getAdvancedReceptionStats().validReceptionPercentage + '%' }"
              ></div>
              <p class="stat-value">{{ getAdvancedReceptionStats().validReceptionPercentage.toFixed(2) }}%</p>
            </div>
          </div>
  
          <!-- Setting Advanced Stats -->
          <div class="stat-group">
            <h4 class="text-md font-medium mb-2">
              <i class="fas fa-hand-point-up mr-2"></i>Setting
            </h4>
            <div class="stat-card">
              <h5>Successful Set Percentage</h5>
              <div 
                class="progress-bar" 
                :style="{ width: getAdvancedSettingStats().successfulSetPercentage + '%' }"
              ></div>
              <p class="stat-value">{{ getAdvancedSettingStats().successfulSetPercentage.toFixed(2) }}%</p>
            </div>
  
            <!-- Set Target Distribution -->
            <div v-if="Object.keys(getAdvancedSettingStats().setTargetDistribution).length > 0" class="stat-card">
              <h5>Set Target Distribution</h5>
              <ul>
                <li 
                  v-for="(count, target) in getAdvancedSettingStats().setTargetDistribution" 
                  :key="target"
                >
                  {{ target }}: {{ count }} set{{ count > 1 ? 's' : '' }}
                </li>
              </ul>
            </div>
          </div>
  
          <!-- Attack Advanced Stats -->
          <div class="stat-group">
            <h4 class="text-md font-medium mb-2">
              <i class="fas fa-fist-raised mr-2"></i>Attack
            </h4>
            <div class="stat-card">
              <h5>Kill Percentage</h5>
              <div 
                class="progress-bar" 
                :style="{ width: getAdvancedAttackStats().killPercentage + '%' }"
              ></div>
              <p class="stat-value">{{ getAdvancedAttackStats().killPercentage.toFixed(2) }}%</p>
            </div>
            <div class="stat-card">
              <h5>Valid Attack Percentage</h5>
              <div 
                class="progress-bar" 
                :style="{ width: getAdvancedAttackStats().validAttackPercentage + '%' }"
              ></div>
              <p class="stat-value">{{ getAdvancedAttackStats().validAttackPercentage.toFixed(2) }}%</p>
            </div>
  
            <!-- Points per Attack Type -->
            <div v-if="Object.keys(getAdvancedAttackStats().typePerPoint).length > 0" class="stat-card">
              <h5>Points per Attack Type</h5>
              <ul>
                <li 
                  v-for="(points, type) in getAdvancedAttackStats().typePerPoint" 
                  :key="type"
                >
                  {{ type }}: {{ points }} point{{ points > 1 ? 's' : '' }}
                </li>
              </ul>
            </div>
  
            <!-- Points per Attack Target -->
            <div v-if="Object.keys(getAdvancedAttackStats().targetPerPoint).length > 0" class="stat-card">
              <h5>Points per Attack Target</h5>
              <ul>
                <li 
                  v-for="(data, target) in getAdvancedAttackStats().targetPerPoint" 
                  :key="target"
                >
                  {{ target }}: {{ data.points }} / {{ data.attempts }} ({{ (data.percentage * 100).toFixed(2) }}%)
                </li>
              </ul>
            </div>
          </div>
  
          <!-- Block Advanced Stats -->
          <div class="stat-group">
            <h4 class="text-md font-medium mb-2">
              <i class="fas fa-shield-alt mr-2"></i>Block
            </h4>
            <div class="stat-card">
              <h5>Block Efficiency</h5>
              <div 
                class="progress-bar" 
                :style="{ width: getBlockStats().efficiency + '%' }"
              ></div>
              <p class="stat-value">{{ getBlockStats().efficiency.toFixed(2) }}</p>
            </div>
          </div>
  
          <!-- Dig Advanced Stats -->
          <div class="stat-group">
            <h4 class="text-md font-medium mb-2">
              <i class="fas fa-hand-paper mr-2"></i>Dig
            </h4>
            <!-- (No additional advanced stats for dig are included) -->
          </div>
        </div>
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
        required: true 
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
      getAdvancedServeStats() {
        return statsUtils.getAdvancedServeStats(this.game, this.playerId, this.currentSetNumber);
      },
      getAdvancedReceptionStats() {
        return statsUtils.getAdvancedReceptionStats(this.game, this.playerId, this.currentSetNumber);
      },
      getAdvancedSettingStats() {
        return statsUtils.getAdvancedSettingStats(this.game, this.playerId, this.currentSetNumber);
      },
      getAdvancedAttackStats() {
        return statsUtils.getAdvancedAttackStats(this.game, this.playerId, this.currentSetNumber);
      },
      getBlockStats() {
        return statsUtils.getBlockStats(this.game, this.playerId, this.currentSetNumber);
      },
    },
  };
  </script>