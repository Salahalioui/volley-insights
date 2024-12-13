<template>
  <div class="stats-guide bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen p-4 sm:p-8">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-4xl sm:text-5xl font-bold mb-8 text-center text-blue-600 animate-fade-in">
        {{ $t('volleyInsightsStatsGuide') }}
      </h1>

      <!-- Introduction -->
      <section class="mb-12 bg-white p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
        <h2 class="text-3xl font-semibold mb-4 text-blue-700">{{ $t('introduction') }}</h2>
        <p class="text-lg text-gray-700 mb-4 leading-relaxed">
          {{ $t('introductionContent') }}
        </p>
      </section>

      <!-- Table of Contents -->
      <nav class="mb-12 bg-white p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
        <h2 class="text-2xl font-semibold mb-4 text-blue-700">{{ $t('tableOfContents') }}</h2>
        <ul class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <li v-for="section in sections" :key="section.id">
            <a :href="`#${section.id}`" class="text-blue-600 hover:text-blue-800 transition-colors duration-300">
              {{ $t(section.title) }}
            </a>
          </li>
        </ul>
      </nav>

      <!-- Dynamic Sections -->
      <section v-for="section in sections" :key="section.id" :id="section.id" class="mb-12 bg-white p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
        <h2 class="text-3xl font-semibold mb-4" :class="section.titleColor">{{ $t(section.title) }}</h2>
        <div v-html="$t(section.content)" class="text-lg text-gray-700 leading-relaxed"></div>
      </section>
    </div>
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n';

export default {
  name: 'StatsGuide',
  setup() {
    
    // eslint-disable-next-line no-unused-vars
    const { t } = useI18n();

    return {
      sections: [
        {
          id: 'team-stats',
          title: 'teamStats',
          titleColor: 'text-blue-700',
          content: 'teamStatsContent'
        },
        {
          id: 'individual-player-basic-stats',
          title: 'individualPlayerBasicStats',
          titleColor: 'text-green-700',
          content: 'individualPlayerBasicStatsContent'
        },
        {
          id: 'individual-player-advanced-stats',
          title: 'individualPlayerAdvancedStats',
          titleColor: 'text-purple-700',
          content: 'individualPlayerAdvancedStatsContent'
        },
        {
          id: 'chart-types',
          title: 'chartTypesAndInterpretation',
          titleColor: 'text-red-700',
          content: 'chartTypesAndInterpretationContent'
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