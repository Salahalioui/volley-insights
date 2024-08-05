<template>
    <div class="stat-group bg-gray-50 p-4 rounded-lg shadow-sm">
      <h4 class="text-lg font-medium mb-3 flex items-center">
        <i :class="[group.icon, 'mr-2 text-blue-500']"></i>{{ group.title }}
      </h4>
      <div v-for="(value, key) in group.stats" :key="key" class="stat-card mb-4">
        <h5 class="text-sm font-medium text-gray-600 mb-1">{{ formatKey(key) }}</h5>
        <div v-if="isPercentage(value)" class="relative pt-1">
          <div class="overflow-hidden h-2 mb-2 text-xs flex rounded bg-blue-200">
            <div
              class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
              :style="{ width: `${value}%` }"
            ></div>
          </div>
          <p class="text-right text-sm font-semibold text-blue-600">{{ value.toFixed(2) }}%</p>
        </div>
        <div v-else-if="typeof value === 'object'" class="text-sm">
          <ul v-if="Array.isArray(value)">
            <li v-for="(item, index) in value" :key="index" class="mb-1">
              {{ item }}
            </li>
          </ul>
          <ul v-else>
            <li v-for="(subValue, subKey) in value" :key="subKey" class="mb-1">
              {{ formatKey(subKey) }}: {{ formatValue(subValue) }}
            </li>
          </ul>
        </div>
        <p v-else class="text-lg font-semibold text-blue-600">{{ value }}</p>
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
      formatValue(value) {
        if (typeof value === 'number') {
          return value.toFixed(2);
        }
        return value;
      },
      isPercentage(value) {
        return typeof value === 'number' && value >= 0 && value <= 100;
      },
    },
  };
  </script>