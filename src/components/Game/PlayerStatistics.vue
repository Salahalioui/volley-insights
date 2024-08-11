<template>
  <div class="player-statistics">
    <h2 class="title">{{ $t('playerStatistics') }}</h2>
    <div class="table-container">
      <table class="stats-table">
        <thead>
          <tr>
            <th>{{ $t('player') }}</th>
            <th>{{ $t('points') }}</th>
            <th>{{ $t('errors') }}</th>
            <th>{{ $t('serves') }}</th>
            <th>{{ $t('attacks') }}</th>
            <th>{{ $t('blocks') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="playerId in game.players" :key="playerId">
            <td class="player-name">{{ getPlayerName(playerId) }}</td>
            <td>
              <span class="stat-value">{{ getPlayerStat(playerId, 'points') }}</span>
            </td>
            <td>
              <span class="stat-value">{{ getPlayerStat(playerId, 'errors') }}</span>
            </td>
            <td>
              <span class="stat-value">{{ getPlayerStat(playerId, 'serves') }}</span>
            </td>
            <td>
              <span class="stat-value">{{ getPlayerStat(playerId, 'attacks') }}</span>
            </td>
            <td>
              <span class="stat-value">{{ getPlayerStat(playerId, 'blocks') }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n';

export default {
  props: {
    game: Object,
    getPlayerName: Function,
    getPlayerStat: Function
  },
  setup() {
    const { t } = useI18n();
    return { t };
  }
};
</script>
  
  <style scoped>
  .player-statistics {
    background-color: #f3f4f6;
    border-radius: 1rem;
    padding: 1.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .title {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 1rem;
    color: #1f2937;
  }
  
  .table-container {
    overflow-x: auto;
    background-color: white;
    border-radius: 0.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }
  
  .stats-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
  }
  
  .stats-table th,
  .stats-table td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .stats-table th {
    background-color: #e5e7eb;
    font-weight: bold;
    color: #4b5563;
    text-transform: uppercase;
    font-size: 0.875rem;
    letter-spacing: 0.05em;
  }
  
  .stats-table tr:last-child td {
    border-bottom: none;
  }
  
  .player-name {
    font-weight: bold;
    color: #1f2937;
  }
  
  .stat-value {
    display: inline-block;
    padding: 0.25rem 0.5rem;
    background-color: #e5e7eb;
    border-radius: 0.25rem;
    font-weight: bold;
    color: #4b5563;
  }
  
  @media (max-width: 640px) {
    .stats-table th,
    .stats-table td {
      padding: 0.75rem 0.5rem;
      font-size: 0.875rem;
    }
  
    .title {
      font-size: 1.25rem;
    }
  }
  </style>