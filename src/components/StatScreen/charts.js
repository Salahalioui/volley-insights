// src/components/StatScreen/charts.js

import { defineComponent } from 'vue';
import { Pie, Bar } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale)

export const PieChart = defineComponent({
  extends: Pie,
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  updated() { // Use updated lifecycle hook
    if (this.$data._chart) { // Check if chart is initialized
      this.$data._chart.config.data = this.data;
      this.$data._chart.update();
    }
  }
});

export const BarChart = defineComponent({
  extends: Bar,
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  updated() { // Use updated lifecycle hook
    if (this.$data._chart) { // Check if chart is initialized
      this.$data._chart.config.data = this.data;
      this.$data._chart.update();
    }
  }
});