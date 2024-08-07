<template>
    <div class="performance-bar">
      <h5 class="text-sm font-medium text-gray-700 mb-1">{{ title }}</h5>
      <div class="relative pt-1">
        <div class="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
          <div 
            :style="{ width: `${(value / max) * 100}%` }" 
            class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
          ></div>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold inline-block text-blue-600">
            {{ value }}{{ unit }}
          </span>
          <span class="text-xs font-semibold inline-block text-gray-600">
            {{ max }}{{ unit }}
          </span>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'PerformanceBar',
    props: {
      title: String,
      value: Number,
      max: Number,
      unit: String
    }
  };
  </script>
  