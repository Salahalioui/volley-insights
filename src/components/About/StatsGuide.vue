<template>
    <div class="stats-guide bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen p-4 sm:p-8">
      <div class="max-w-6xl mx-auto">
        <h1 class="text-4xl sm:text-5xl font-bold mb-8 text-center text-blue-600 animate-fade-in">
          Volley Insights: Statistics Guide
        </h1>
  
        <!-- Introduction -->
        <section class="mb-12 bg-white p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
          <h2 class="text-3xl font-semibold mb-4 text-blue-700">Introduction</h2>
          <p class="text-lg text-gray-700 mb-4 leading-relaxed">
            Welcome to the Volley Insights Statistics Guide! This comprehensive guide will help you understand and interpret the various statistics available in the app, giving you a deeper understanding of individual and team performance in volleyball.
          </p>
        </section>
  
        <!-- Table of Contents -->
        <nav class="mb-12 bg-white p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
          <h2 class="text-2xl font-semibold mb-4 text-blue-700">Table of Contents</h2>
          <ul class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <li v-for="section in sections" :key="section.id">
              <a :href="`#${section.id}`" class="text-blue-600 hover:text-blue-800 transition-colors duration-300">
                {{ section.title }}
              </a>
            </li>
          </ul>
        </nav>
  
        <!-- Dynamic Sections -->
        <section v-for="section in sections" :key="section.id" :id="section.id" class="mb-12 bg-white p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
          <h2 class="text-3xl font-semibold mb-4" :class="section.titleColor">{{ section.title }}</h2>
          <div v-html="section.content" class="text-lg text-gray-700 leading-relaxed"></div>
        </section>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'StatsGuide',
    data() {
      return {
        sections: [
          {
            id: 'team-stats',
            title: 'Team Stats',
            titleColor: 'text-blue-700',
            content: `
              <p>These statistics provide an overview of the team's overall performance:</p>
              <ul class="list-disc list-inside space-y-2">
                <li><strong>Total Points:</strong> The total number of points your team has scored. A basic but fundamental indicator of success.</li>
                <li><strong>Total Errors:</strong> The total number of errors your team has made. Minimizing errors is crucial for consistent performance.</li>
                <li><strong>Serve Efficiency:</strong> (Points + Continues - Errors) / Total Serve Attempts. Measures how effective your team's serves are in generating points or putting pressure on the opponent.</li>
                <li><strong>Attack Efficiency:</strong> (Kills - Errors) / Total Attack Attempts. The most important offensive statistic in volleyball. Measures how effectively your team converts attacks into points.</li>
                <li><strong>Block Efficiency:</strong> (Points + Continues - Errors) / Total Block Attempts. Measures the effectiveness of your team's blocking at the net.</li>
                <li><strong>Side Out Percentage:</strong> (Points Scored When Receiving) / (Total Times Receiving). Reflects your team's ability to side out (win a point) when the opponent is serving.</li>
                <li><strong>Break Point Percentage:</strong> (Points Scored When Serving) / (Total Times Serving). Measures your team's ability to score points when they are serving.</li>
                <li><strong>Rotation Effectiveness (Receive-Block-Attack):</strong> Calculated for each unique player rotation on the court. Provides three percentages: Receive Effectiveness, Block Effectiveness, and Attack Effectiveness.</li>
              </ul>
            `
          },
          {
            id: 'individual-player-basic-stats',
            title: 'Individual Player Basic Stats',
            titleColor: 'text-green-700',
            content: `
              <p>These statistics track individual player performance across different skills:</p>
              <h3 class="text-xl font-semibold mt-4 mb-2">Serve</h3>
              <ul class="list-disc list-inside space-y-2">
                <li><strong>Total Attempts:</strong> Number of serves taken.</li>
                <li><strong>Points:</strong> Number of aces (serves directly resulting in a point).</li>
                <li><strong>Errors:</strong> Number of service faults.</li>
                <li><strong>Efficiency:</strong> (Points - Errors) / Total Serve Attempts</li>
              </ul>
              <h3 class="text-xl font-semibold mt-4 mb-2">Reception</h3>
              <ul class="list-disc list-inside space-y-2">
                <li><strong>Total Attempts:</strong> Number of receptions taken.</li>
                <li><strong>Points:</strong> Number of receptions directly resulting in a point.</li>
                <li><strong>Errors:</strong> Number of reception errors.</li>
                <li><strong>Efficiency:</strong> (Continues + Points) / Total Reception Attempts</li>
              </ul>
              <h3 class="text-xl font-semibold mt-4 mb-2">Set</h3>
              <ul class="list-disc list-inside space-y-2">
                <li><strong>Total Attempts:</strong> Number of sets made.</li>
                <li><strong>Points:</strong> Number of sets directly resulting in a point.</li>
                <li><strong>Errors:</strong> Number of setting errors.</li>
                <li><strong>Efficiency:</strong> (Continues + Points - Errors) / Total Set Attempts</li>
              </ul>
              <h3 class="text-xl font-semibold mt-4 mb-2">Attack</h3>
              <ul class="list-disc list-inside space-y-2">
                <li><strong>Total Attempts:</strong> Number of attacks made.</li>
                <li><strong>Points (Kills):</strong> Number of successful attacks resulting in points.</li>
                <li><strong>Errors:</strong> Number of attack errors.</li>
                <li><strong>Efficiency:</strong> (Kills - Errors) / Total Attack Attempts</li>
              </ul>
              <h3 class="text-xl font-semibold mt-4 mb-2">Block</h3>
              <ul class="list-disc list-inside space-y-2">
                <li><strong>Total Attempts:</strong> Number of block attempts.</li>
                <li><strong>Points:</strong> Number of blocks directly resulting in points.</li>
                <li><strong>Errors:</strong> Number of block errors.</li>
                <li><strong>Efficiency:</strong> (Points + Continues - Errors) / Total Block Attempts</li>
              </ul>
              <h3 class="text-xl font-semibold mt-4 mb-2">Dig</h3>
              <ul class="list-disc list-inside space-y-2">
                <li><strong>Total Attempts:</strong> Number of digs attempted.</li>
                <li><strong>Valid Attempts (Continues):</strong> Number of digs that kept the ball in play.</li>
                <li><strong>Errors:</strong> Number of digging errors (rare).</li>
              </ul>
            `
          },
          {
            id: 'individual-player-advanced-stats',
            title: 'Individual Player Advanced Stats',
            titleColor: 'text-purple-700',
            content: `
              <p>These statistics provide a more detailed and nuanced understanding of player performance:</p>
              <h3 class="text-xl font-semibold mt-4 mb-2">Serve</h3>
              <ul class="list-disc list-inside space-y-2">
                <li><strong>Ace Serve Percentage:</strong> (Points - Errors) / Total Attempts * 100</li>
                <li><strong>Valid Serve Percentage:</strong> (Perfect + Good - Errors) / Total Attempts * 100</li>
                <li><strong>Points per Serve Type:</strong> Breakdown of points scored by each serve type (Float, Jump, Topspin).</li>
                <li><strong>Points per Serve Target:</strong> For each zone: (Points Scored in Zone) / (Attempts to Zone) * 100</li>
              </ul>
              <h3 class="text-xl font-semibold mt-4 mb-2">Reception</h3>
              <ul class="list-disc list-inside space-y-2">
                <li><strong>Valid Reception Percentage:</strong> (Perfect + Good - Errors) / Total Attempts * 100</li>
              </ul>
              <h3 class="text-xl font-semibold mt-4 mb-2">Set</h3>
              <ul class="list-disc list-inside space-y-2">
                <li><strong>Successful Set Percentage:</strong> (Perfect + Good) / Total Attempts * 100</li>
                <li><strong>Set Target Distribution:</strong> Breakdown of sets to each target player or zone.</li>
              </ul>
              <h3 class="text-xl font-semibold mt-4 mb-2">Attack</h3>
              <ul class="list-disc list-inside space-y-2">
                <li><strong>Kill Percentage:</strong> (Kills - Errors) / Total Attempts * 100</li>
                <li><strong>Valid Attack Percentage:</strong> (Perfect + Good - Errors) / Total Attempts * 100</li>
                <li><strong>Points per Attack Type:</strong> Breakdown of points scored by each attack type (Power, Off-speed, Tip).</li>
                <li><strong>Points per Attack Target:</strong> For each zone: (Points Scored in Zone) / (Attempts to Zone) * 100</li>
              </ul>
            `
          },
          {
            id: 'chart-types',
            title: 'Chart Types and Interpretation',
            titleColor: 'text-red-700',
            content: `
              <h3 class="text-xl font-semibold mt-4 mb-2">Bar Charts</h3>
              <p><strong>Purpose:</strong> Bar charts are used to compare different categories of data using rectangular bars. The height of each bar represents the value of the corresponding category.</p>
              <p><strong>Use in Volley Insights:</strong> You can use bar charts to visualize:</p>
              <ul class="list-disc list-inside space-y-2">
                <li>Individual player stats for different actions (e.g., points, errors, efficiency for serving, attacking, etc.).</li>
                <li>Team stats for different skills (e.g., serve efficiency, attack efficiency, etc.).</li>
                <li>Rotation effectiveness for each rotation, showing the effectiveness for receive, block, and attack side-by-side.</li>
              </ul>
              <p><strong>Interpretation:</strong></p>
              <ul class="list-disc list-inside space-y-2">
                <li>Longer bars represent higher values.</li>
                <li>You can easily compare the performance of different players or the team's effectiveness in different skills by looking at the relative heights of the bars.</li>
              </ul>
              <h3 class="text-xl font-semibold mt-4 mb-2">Pie Charts</h3>
              <p><strong>Purpose:</strong> Pie charts are used to show the proportion of different parts of a whole. Each slice of the pie represents a category, and the size of the slice is proportional to its value.</p>
              <p><strong>Use in Volley Insights:</strong> You can use pie charts to visualize:</p>
              <ul class="list-disc list-inside space-y-2">
                <li>Distribution of points scored by different actions (e.g., kills, blocks, aces).</li>
                <li>Set target distribution for a setter, showing the percentage of sets to different attackers or zones.</li>
                <li>Points per serve type or attack type, showing the proportion of points scored from each type.</li>
              </ul>
              <p><strong>Interpretation:</strong></p>
              <ul class="list-disc list-inside space-y-2">
                <li>Larger slices represent a greater proportion of the whole.</li>
                <li>You can quickly see which categories dominate or contribute the most.</li>
              </ul>
              <h3 class="text-xl font-semibold mt-4 mb-2">Benefits of Using Charts</h3>
              <ul class="list-disc list-inside space-y-2">
                <li><strong>Easy to Understand:</strong> Charts make it easy to grasp complex data at a glance.</li>
                <li><strong>Visually Appealing:</strong> Charts are more engaging and visually interesting than just looking at tables of numbers.</li>
                <li><strong>Identify Trends:</strong> Charts can help you identify patterns and trends in the data, such as which player is consistently scoring the most points or which rotation has the highest attack effectiveness.</li>
              </ul>
            `
          }
        ],
        selectedChartType: 'bar',
        selectedDataSet: 'playerStats'
      };
    }
  };
  </script>
  
  <style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

section {
  animation: fadeIn 0.5s ease-out;
}

.animate-fade-in {
  animation: fadeIn 1s ease-out;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .stats-guide {
    padding: 2rem 1rem;
  }

  h1 {
    font-size: 2.5rem;
  }

  h2 {
    font-size: 2rem;
  }

  h3 {
    font-size: 1.5rem;
  }

  .text-lg {
    font-size: 1rem;
  }
}

/* Additional styles for better readability */
.list-disc {
  margin-left: 1.5rem;
}

.space-y-2 > * + * {
  margin-top: 0.5rem;
}

.text-blue-600 {
  color: #2563eb;
}

.text-blue-700 {
  color: #1d4ed8;
}

.text-green-700 {
  color: #15803d;
}

.text-purple-700 {
  color: #7e22ce;
}

.text-red-700 {
  color: #b91c1c;
}

.hover\:shadow-xl:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.rounded-xl {
  border-radius: 0.75rem;
}

.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
</style>