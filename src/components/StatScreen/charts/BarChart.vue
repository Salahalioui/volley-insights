<template>
    <div class="bar-chart-container bg-white rounded-xl shadow-lg p-6 mb-8">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-2xl font-bold text-gray-800 flex items-center">
          <svg class="w-6 h-6 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
          {{ chartTitle }}
        </h2>
        <div class="flex space-x-2">
          <button @click="downloadCSV" class="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-200">
            CSV
          </button>
          <button @click="downloadImage" class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200">
            PNG
          </button>
        </div>
      </div>
      <div class="chart-wrapper relative" :style="{ height: chartHeight }">
        <canvas ref="chartCanvas"></canvas>
        <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
          <div class="loader"></div>
        </div>
      </div>
      <div v-if="error" class="mt-4 text-red-500 text-center">
        {{ error }}
      </div>
    </div>
  </template>
  
  <script>
  import { defineComponent, onMounted, ref, watch, computed } from 'vue';
  import { Chart as ChartJS, BarController, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
  
  ChartJS.register(BarController, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
  
  export default defineComponent({
    name: 'BarChart',
    props: {
      chartData: {
        type: Object,
        required: true,
      },
      chartOptions: {
        type: Object,
        default: () => ({}),
      },
      chartTitle: {
        type: String,
        default: 'Bar Chart',
      },
      chartHeight: {
        type: String,
        default: '400px',
      },
    },
    setup(props) {
      const chartCanvas = ref(null);
      let chartInstance = null;
      const loading = ref(false);
      const error = ref(null);
  
      const defaultOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: props.chartTitle,
          },
        },
      };
  
      const mergedOptions = computed(() => ({
        ...defaultOptions,
        ...props.chartOptions,
      }));
  
      const renderChart = () => {
        loading.value = true;
        error.value = null;
  
        try {
          if (chartInstance) {
            chartInstance.destroy();
          }
          chartInstance = new ChartJS(chartCanvas.value, {
            type: 'bar',
            data: props.chartData,
            options: mergedOptions.value,
          });
        } catch (e) {
          error.value = 'Error rendering chart. Please check your data.';
        } finally {
          loading.value = false;
        }
      };
  
      const downloadCSV = () => {
        const csvContent = "data:text/csv;charset=utf-8," 
          + props.chartData.labels.join(",") + "\n"
          + props.chartData.datasets.map(ds => ds.data.join(",")).join("\n");
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "chart_data.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };
  
      const downloadImage = () => {
        const link = document.createElement('a');
        link.download = 'chart.png';
        link.href = chartCanvas.value.toDataURL('image/png');
        link.click();
      };
  
      onMounted(() => {
        renderChart();
      });
  
      watch(
        () => props.chartData,
        () => {
          renderChart();
        },
        { deep: true }
      );
  
      watch(
        () => props.chartOptions,
        () => {
          renderChart();
        },
        { deep: true }
      );
  
      return {
        chartCanvas,
        loading,
        error,
        downloadCSV,
        downloadImage,
      };
    },
  });
  </script>
  
  <style scoped>
  .loader {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  </style>