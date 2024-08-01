<template>
    <div class="recent-events">
      <h2 class="title">Recent Events</h2>
      <ul class="events-list">
        <li v-for="event in recentEvents" :key="event.id" class="event-item">
          <div class="event-icon" :class="getEventIconClass(event)"></div>
          <div class="event-content">
            <template v-if="event.type === 'substitution'">
              <span class="event-action">Substitution:</span>
              <span class="player-name">{{ getPlayerName(event.outPlayer) }}</span> out,
              <span class="player-name">{{ getPlayerName(event.inPlayer) }}</span> in
            </template>
            <template v-else>
              <span class="player-name">{{ getPlayerName(event.player) }}</span>
              <span class="event-action">{{ event.action }}</span>
              <span v-if="event.type" class="event-detail">{{ event.type }}</span>
              <span v-if="event.evaluation" class="event-detail">{{ event.evaluation }}</span>
              <span class="event-result">{{ event.result }}</span>
              <span v-if="event.target" class="event-detail">Target: {{ event.target }}</span>
            </template>
          </div>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      recentEvents: Array,
      getPlayerName: Function
    },
    methods: {
      getEventIconClass(event) {
        // Define icon classes based on event type or action
        const iconClasses = {
          substitution: 'icon-substitution',
          serve: 'icon-serve',
          attack: 'icon-attack',
          block: 'icon-block',
          // Add more event types as needed
        };
        return iconClasses[event.type] || iconClasses[event.action] || 'icon-default';
      }
    }
  };
  </script>
  
  <style scoped>
  .recent-events {
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
  
  .events-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .event-item {
    display: flex;
    align-items: center;
    background-color: white;
    border-radius: 0.5rem;
    padding: 0.75rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    transition: transform 0.2s ease-in-out;
  }
  
  .event-item:hover {
    transform: translateY(-2px);
  }
  
  .event-icon {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    margin-right: 0.75rem;
    flex-shrink: 0;
    background-color: #e5e7eb;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .event-content {
    flex-grow: 1;
    font-size: 0.875rem;
    color: #4b5563;
  }
  
  .player-name {
    font-weight: bold;
    color: #1f2937;
  }
  
  .event-action {
    font-weight: 600;
    color: #4b5563;
  }
  
  .event-detail {
    color: #6b7280;
    margin-left: 0.25rem;
  }
  
  .event-result {
    font-weight: 600;
    color: #059669;
    margin-left: 0.25rem;
  }
  
  /* Icon classes - replace with actual icons or SVGs */
  .icon-substitution::before { content: '↔'; }
  .icon-serve::before { content: '🏐'; }
  .icon-attack::before { content: '💥'; }
  .icon-block::before { content: '🛡'; }
  .icon-default::before { content: '•'; }
  
  @media (max-width: 640px) {
    .recent-events {
      padding: 1rem;
    }
  
    .title {
      font-size: 1.25rem;
    }
  
    .event-item {
      padding: 0.5rem;
    }
  
    .event-icon {
      width: 1.5rem;
      height: 1.5rem;
      margin-right: 0.5rem;
    }
  
    .event-content {
      font-size: 0.75rem;
    }
  }
  </style>