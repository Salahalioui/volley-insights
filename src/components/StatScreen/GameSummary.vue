<template>
  <div id="game-summary" class="game-summary bg-white rounded-lg shadow-md p-6 mb-6">
    <h3 class="text-xl font-semibold mb-4">{{ $t('gameSummary') }}</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="game-info">
        <p class="text-gray-600">
          <span class="font-medium">{{ $t('date') }}:</span> {{ formattedDate }}
        </p>
        <p class="text-gray-600">
          <span class="font-medium">{{ $t('opponent') }}:</span> {{ game.opponentTeam }}
        </p>
        <p class="text-gray-600">
          <span class="font-medium">{{ $t('location') }}:</span> {{ game.location || $t('notSpecified') }}
        </p>
      </div>
      <div class="game-status">
        <p class="text-gray-600">
          <span class="font-medium">{{ $t('status') }}:</span> 
          <span :class="statusClass">{{ $t(game.status) }}</span>
        </p>
        <p class="text-gray-600">
          <span class="font-medium">{{ $t('score') }}:</span> 
          <span class="text-lg font-bold">
            {{ game.setsWon.team }} - {{ game.setsWon.opponent }}
          </span>
        </p>
        <p class="text-gray-600" v-if="game.status === 'completed'">
          <span class="font-medium">{{ $t('result') }}:</span>
          <span :class="resultClass">{{ $t(gameResult) }}</span>
        </p>
      </div>
    </div>
    <div class="mt-4">
      <h4 class="text-lg font-semibold mb-2">{{ $t('setScores') }}</h4>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ 'set' }}</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ $t('team') }}</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ $t('opponent') }}</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(set, index) in game.sets" :key="index">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ index + 1 }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ set.teamScore }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ set.opponentScore }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

export default {
  name: 'GameSummary',
  props: {
    game: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const { t, d } = useI18n();

    const formattedDate = computed(() => {
      return d(new Date(props.game.date), 'long');
    });

    const statusClass = computed(() => {
      return {
        'text-green-500': props.game.status === 'completed',
        'text-yellow-500': props.game.status === 'in_progress',
        'text-red-500': props.game.status === 'not_started'
      };
    });

    const gameResult = computed(() => {
      if (props.game.status !== 'completed') return 'notApplicable';
      return props.game.setsWon.team > props.game.setsWon.opponent ? 'win' : 'loss';
    });

    const resultClass = computed(() => {
      return gameResult.value === 'win' ? 'text-green-500' : 'text-red-500';
    });

    return {
      t,
      formattedDate,
      statusClass,
      gameResult,
      resultClass
    };
  }
};
</script>

<style scoped>
.game-summary {
  @apply transition-all duration-300 ease-in-out;
}
</style>
