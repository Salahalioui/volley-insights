<template>
    <div class="rotation-tracker">
      <h2 class="title">Current Rotation</h2>
      <div class="court">
        <!-- Back Row -->
        <div v-for="position in [1, 6, 5]" :key="position" 
             class="player back-row"
             :class="`player-${position}`">
          <div class="player-info">
            <span class="position">P{{ position }}</span>
            <span class="name">{{ getPlayerName(currentRotation[position - 1]) }}</span>
          </div>
        </div>
        <!-- Front Row -->
        <div v-for="position in [2, 3, 4]" :key="position"
             class="player front-row"
             :class="`player-${position}`">
          <div class="player-info">
            <span class="position">P{{ position }}</span>
            <span class="name">{{ getPlayerName(currentRotation[position - 1]) }}</span>
          </div>
        </div>
        <!-- Net -->
        <div class="net"></div>
      </div>
      <button @click="rotateManually" class="btn-rotate">
        Rotate Manually
      </button>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      currentRotation: Array,
      getPlayerName: Function
    },
    emits: ['rotateManually'],
    methods: {
      rotateManually() {
        this.$emit('rotateManually');
      }
    }
  };
  </script>
  
  <style scoped>
  .rotation-tracker {
    background-color: #e0f2fe;
    border-radius: 1rem;
    padding: 1.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .title {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 1rem;
    color: #0369a1;
  }
  
  .court {
    position: relative;
    width: 100%;
    aspect-ratio: 3 / 2;
    max-height: 300px;
    border: 3px solid #0284c7;
    border-radius: 0.5rem;
    background-color: #f0f9ff;
    margin-bottom: 1rem;
  }
  
  .player {
    position: absolute;
    width: 30%;
    height: 40%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .player-info {
    background-color: #0284c7;
    color: white;
    padding: 0.5rem;
    border-radius: 0.5rem;
    text-align: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .position {
    display: block;
    font-weight: bold;
    font-size: 1.2rem;
  }
  
  .name {
    display: block;
    font-size: 0.9rem;
  }
  
  .back-row {
    top: 5%;
  }
  
  .front-row {
    bottom: 5%;
  }
  
  .player-1 { left: 5%; }
  .player-6 { left: 35%; }
  .player-5 { right: 5%; }
  .player-2 { left: 5%; }
  .player-3 { left: 35%; }
  .player-4 { right: 5%; }
  
  .net {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 2px;
    background-color: #0284c7;
  }
  
  .btn-rotate {
    width: 100%;
    padding: 1rem;
    background-color: #0284c7;
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-size: 1.1rem;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .btn-rotate:hover {
    background-color: #0369a1;
  }
  
  @media (max-width: 640px) {
    .court {
      max-height: 250px;
    }
  
    .position {
      font-size: 1rem;
    }
  
    .name {
      font-size: 0.8rem;
    }
  }
  </style>