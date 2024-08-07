<template>
    <div class="stat-group bg-gray-50 p-4 rounded-lg shadow-sm">
      <h4 class="text-lg font-medium mb-3 flex items-center">
        <i :class="[group.icon, 'mr-2 text-blue-500']"></i>{{ group.title }}
      </h4>
      <div v-for="(value, key) in group.stats" :key="key" class="stat-card mb-4">
        <h5 class="text-sm font-medium text-gray-600 mb-1">{{ formatKey(key) }}</h5>
  
        <!-- Percentage Stat -->
        <div v-if="isPercentageStat(key)" class="relative pt-1">
          <div class="overflow-hidden h-2 mb-2 text-xs flex rounded bg-blue-200">
            <div class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                 :style="{ width: `${value}%` }"></div>
          </div>
          <p class="text-right text-sm font-semibold text-blue-600">{{ value.toFixed(2) }}%</p>
        </div>
  
        <!-- Raw Count Stat -->
        <p v-else-if="typeof value === 'number'" class="text-lg font-semibold text-blue-600">{{ value }}</p>
  
        <!-- Set Target Distribution -->
        <div v-else-if="key === 'setTargetDistribution'" class="text-sm">
          <ul>
            <li v-for="(count, target) in value" :key="target" class="mb-1">
              {{ formatKey(target) }}: {{ count }} 
            </li>
          </ul>
        </div>
  
        <!-- Other types of stats (e.g., objects) -->
        <p v-else class="text-sm text-gray-600">
          {{ JSON.stringify(value) }}
        </p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      group: {
        type: Object,
        required: true,
      },
    },
    methods: {
      formatKey(key) {
        return key.split(/(?=[A-Z])/).join(' ').replace(/^\w/, c => c.toUpperCase());
      },
      isPercentageStat(key) {
        return ['aceServePercentage', 'validServePercentage', 'validReceptionPercentage',
          'successfulSetPercentage', 'killPercentage', 'validAttackPercentage', 'efficiency'].includes(key);
      },
    },
  };
  </script>
  
  <style scoped>
  .stat-group {
    transition: all 0.3s ease;
  }
  
  .stat-card {
    transition: all 0.2s ease;
  }
  
  .stat-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  </style>
  