<template>
  <div class="advanced-stats mb-6">
    <button @click="toggleSection" class="section-header w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors duration-200 rounded-t-md">
      <div class="flex items-center">
        <i class="fas fa-chart-line text-blue-500 mr-2"></i>
        <h3 class="text-xl font-semibold">{{ $t('advancedStats') }}</h3>
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
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <StatGroup v-for="(group, index) in statGroups" :key="index" :group="group" />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import * as statsUtils from './statsUtils';
import StatGroup from './StatGroup.vue';

export default {
  name: 'AdvancedPlayerStats',
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
  },
  setup(props) {
    const { t } = useI18n();
    const isOpen = ref(true);

    const statGroups = computed(() => [
      {
        title: t('serve'),
        icon: 'fas fa-volleyball-ball',
        stats: statsUtils.getAdvancedServeStats(props.game, props.playerId, props.currentSetNumber),
      },
      {
        title: t('reception'),
        icon: 'fas fa-hands',
        stats: statsUtils.getAdvancedReceptionStats(props.game, props.playerId, props.currentSetNumber),
      },
      {
        title: t('setting'),
        icon: 'fas fa-hand-point-up',
        stats: statsUtils.getAdvancedSettingStats(props.game, props.playerId, props.currentSetNumber),
      },
      {
        title: t('attack'),
        icon: 'fas fa-fist-raised',
        stats: statsUtils.getAdvancedAttackStats(props.game, props.playerId, props.currentSetNumber),
      },
      {
        title: t('block'),
        icon: 'fas fa-shield-alt',
        stats: statsUtils.getBlockStats(props.game, props.playerId, props.currentSetNumber),
      },
      {
        title: t('dig'),
        icon: 'fas fa-hand-paper',
        stats: statsUtils.getDigStats ? statsUtils.getDigStats(props.game, props.playerId, props.currentSetNumber) : {},
      },
    ]);

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
      statGroups,
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
