<template>
  <div class="advanced-stats mb-6">
    <button @click="toggleSection" class="section-header">
      <div class="flex items-center">
        <i class="fas fa-chart-line text-blue-500 mr-2"></i>
        <h3 class="text-xl font-semibold">Advanced Stats</h3>
      </div>
      <i :class="['fas', isOpen ? 'fa-chevron-up' : 'fa-chevron-down', 'transition-transform duration-300']"></i>
    </button>
    <transition name="fade">
      <div v-if="isOpen" class="section-content bg-white p-6 rounded-md shadow-md">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatGroup v-for="(group, index) in statGroups" :key="index" :group="group" />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import * as statsUtils from './statsUtils';
import StatGroup from './StatGroup.vue';

export default {
  components: {
    StatGroup,
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
    statGroups() {
      return [
        {
          title: 'Serve',
          icon: 'fas fa-volleyball-ball',
          stats: this.getAdvancedServeStats(),
        },
        {
          title: 'Reception',
          icon: 'fas fa-hands',
          stats: this.getAdvancedReceptionStats(),
        },
        {
          title: 'Setting',
          icon: 'fas fa-hand-point-up',
          stats: this.getAdvancedSettingStats(),
        },
        {
          title: 'Attack',
          icon: 'fas fa-fist-raised',
          stats: this.getAdvancedAttackStats(),
        },
        {
          title: 'Block',
          icon: 'fas fa-shield-alt',
          stats: this.getBlockStats(),
        },
        {
          title: 'Dig',
          icon: 'fas fa-hand-paper',
          stats: {},
        },
      ];
    },
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

<style scoped>
.section-header {
  @apply flex justify-between items-center w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-300 ease-in-out;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s, max-height 0.3s;
  max-height: 2000px;
  overflow: hidden;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
  max-height: 0;
}
</style>