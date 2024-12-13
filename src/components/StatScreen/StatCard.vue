<template>
    <div class="stat-card bg-gray-50 rounded-lg p-4">
      <h4 class="text-sm font-medium text-gray-500 mb-1">{{ title }}</h4>
      <p class="text-2xl font-bold text-gray-900">
        <template v-if="type === 'percentage'">
          {{ formatValue(value) }}
        </template>
        <template v-else>
          {{ value }}
        </template>
      </p>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      title: String,
      value: [Number, String],
      type: {
        type: String,
        default: 'number'
      }
    },
    methods: {
      formatValue(val) {
        if (typeof val === 'number') {
          return val.toFixed(1) + '%';
        }
        return val;
      }
    }
  }
  </script>
  