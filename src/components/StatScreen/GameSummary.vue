<template>
  <div class="game-summary bg-white rounded-lg shadow-md p-6 mb-6">
    <h3 class="text-xl font-semibold mb-4">Game Summary</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="game-info">
        <p class="text-gray-600">
          <span class="font-medium">Date:</span> {{ formattedDate }}
        </p>
        <p class="text-gray-600">
          <span class="font-medium">Opponent:</span> {{ game.opponentTeam }}
        </p>
        <p class="text-gray-600">
          <span class="font-medium">Location:</span> {{ game.location || 'Not specified' }}
        </p>
      </div>
      <div class="game-status">
        <p class="text-gray-600">
          <span class="font-medium">Status:</span> 
          <span :class="statusClass">{{ capitalizedStatus }}</span>
        </p>
        <p class="text-gray-600">
          <span class="font-medium">Score:</span> 
          <span class="text-lg font-bold">
            {{ game.setsWon.team }} - {{ game.setsWon.opponent }}
          </span>
        </p>
        <p class="text-gray-600" v-if="game.status === 'completed'">
          <span class="font-medium">Result:</span>
          <span :class="resultClass">{{ gameResult }}</span>
        </p>
      </div>
    </div>
    <div class="mt-4">
      <h4 class="text-lg font-semibold mb-2">Set Scores</h4>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Set</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Opponent</th>
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

export default {
  name: 'GameSummary',
  props: {
    game: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const formattedDate = computed(() => {
      return new Date(props.game.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    });

    const capitalizedStatus = computed(() => {
      return props.game.status.charAt(0).toUpperCase() + props.game.status.slice(1);
    });

    const statusClass = computed(() => {
      return {
        'text-green-500': props.game.status === 'completed',
        'text-yellow-500': props.game.status === 'in_progress',
        'text-red-500': props.game.status === 'not_started'
      };
    });

    const gameResult = computed(() => {
      if (props.game.status !== 'completed') return 'N/A';
      return props.game.setsWon.team > props.game.setsWon.opponent ? 'Win' : 'Loss';
    });

    const resultClass = computed(() => {
      return gameResult.value === 'Win' ? 'text-green-500' : 'text-red-500';
    });

    return {
      formattedDate,
      capitalizedStatus,
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
