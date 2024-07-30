<template>
    <div class="my-team p-4 sm:p-6 bg-gray-100 rounded-lg shadow-md max-w-4xl mx-auto">
      <h2 class="text-2xl font-bold mb-6 text-gray-800">My Team</h2>
      
      <!-- Search Input -->
      <div class="mb-6">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Search players..." 
          class="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300 transition duration-300"
        >
      </div>
      
      <!-- Player List -->
      <TransitionGroup name="list" tag="ul" class="space-y-3 mb-6">
        <li v-for="player in filteredPlayers" :key="player.id" 
            class="bg-white p-4 rounded-lg shadow flex flex-col sm:flex-row justify-between items-start sm:items-center transition duration-300 ease-in-out hover:bg-gray-50">
          <span class="mb-2 sm:mb-0">
            <span class="font-semibold">{{ player.name }}</span>
            <span class="text-gray-600 ml-2">#{{ player.shirtNumber }} - {{ player.role }}</span>
          </span>
          <div class="space-x-2">
            <button @click="editPlayer(player)" class="text-blue-500 hover:text-blue-700 transition duration-300">Edit</button>
            <button @click="removePlayer(player)" class="text-red-500 hover:text-red-700 transition duration-300">Remove</button>
          </div>
        </li>
      </TransitionGroup>
  
      <!-- Add/Edit Player Form -->
      <form @submit.prevent="savePlayer" class="mb-6 bg-white p-6 rounded-lg shadow">
        <h3 class="text-xl font-semibold mb-4">{{ currentPlayer.id ? 'Edit' : 'Add' }} Player</h3>
        <div class="space-y-4">
          <div>
            <label for="playerName" class="block text-sm font-medium text-gray-700 mb-1">Player Name</label>
            <input id="playerName" v-model="currentPlayer.name" placeholder="Enter player name" required
                   class="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300 transition duration-300">
          </div>
          <div>
            <label for="shirtNumber" class="block text-sm font-medium text-gray-700 mb-1">Shirt Number</label>
            <input id="shirtNumber" v-model="currentPlayer.shirtNumber" placeholder="Enter shirt number" type="number" required
                   class="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300 transition duration-300">
          </div>
          <div>
            <label for="playerRole" class="block text-sm font-medium text-gray-700 mb-1">Player Role</label>
            <select id="playerRole" v-model="currentPlayer.role" required
                    class="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300 transition duration-300">
              <option value="">Select Role</option>
              <option value="Setter">Setter</option>
              <option value="Outside Hitter">Outside Hitter</option>
              <option value="Opposite">Opposite</option>
              <option value="Middle Blocker">Middle Blocker</option>
              <option value="Libero">Libero</option>
            </select>
          </div>
        </div>
        <button type="submit" 
                class="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-300 mt-6">
          {{ currentPlayer.id ? 'Update' : 'Add' }} Player
        </button>
      </form>
  
      <!-- Import/Export Buttons -->
      <div class="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
        <button @click="exportPlayers" 
                class="flex-1 bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition duration-300">
          Export Players
        </button>
        <label class="flex-1 bg-purple-500 text-white p-3 rounded-lg hover:bg-purple-600 transition duration-300 cursor-pointer text-center">
          Import Players
          <input type="file" @change="importPlayers" accept=".json,.csv" class="hidden">
        </label>
      </div>
  
      <!-- Notification -->
      <Transition name="fade">
        <div v-if="notification" class="fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-lg shadow-lg">
          {{ notification }}
        </div>
      </Transition>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted } from 'vue';
  
  export default {
    name: 'MyTeam',
    setup() {
      const players = ref([]);
      const searchQuery = ref('');
      const currentPlayer = ref({
        id: null,
        name: '',
        shirtNumber: '',
        role: ''
      });
      const notification = ref('');
  
      const showNotification = (message) => {
        notification.value = message;
        setTimeout(() => {
          notification.value = '';
        }, 3000);
      };
  
      const loadPlayers = () => {
        const storedPlayers = localStorage.getItem('players');
        if (storedPlayers) {
          players.value = JSON.parse(storedPlayers);
        }
      };
  
      const savePlayers = () => {
        localStorage.setItem('players', JSON.stringify(players.value));
      };
  
      const savePlayer = () => {
        if (currentPlayer.value.id) {
          const index = players.value.findIndex(p => p.id === currentPlayer.value.id);
          players.value[index] = { ...currentPlayer.value };
          showNotification('Player updated successfully');
        } else {
          players.value.push({
            ...currentPlayer.value,
            id: Date.now()
          });
          showNotification('Player added successfully');
        }
        savePlayers();
        resetForm();
      };
  
      const editPlayer = (player) => {
        currentPlayer.value = { ...player };
      };
  
      const removePlayer = (player) => {
        players.value = players.value.filter(p => p.id !== player.id);
        savePlayers();
        showNotification('Player removed successfully');
      };
  
      const resetForm = () => {
        currentPlayer.value = { id: null, name: '', shirtNumber: '', role: '' };
      };
  
      const exportPlayers = () => {
        const dataStr = JSON.stringify(players.value);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        const exportFileDefaultName = 'players.json';
  
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        showNotification('Players exported successfully');
      };
  
      const importPlayers = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const importedPlayers = JSON.parse(e.target.result);
            players.value = importedPlayers;
            savePlayers();
            showNotification('Players imported successfully');
          } catch (error) {
            console.error('Error parsing JSON:', error);
            showNotification('Error: Invalid JSON file');
          }
        };
        reader.readAsText(file);
      };
  
      const filteredPlayers = computed(() => {
        return players.value.filter(player => 
          player.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          player.shirtNumber.toString().includes(searchQuery.value) ||
          player.role.toLowerCase().includes(searchQuery.value.toLowerCase())
        );
      });
  
      onMounted(() => {
        loadPlayers();
      });
  
      return {
        players,
        searchQuery,
        currentPlayer,
        notification,
        filteredPlayers,
        savePlayer,
        editPlayer,
        removePlayer,
        exportPlayers,
        importPlayers
      };
    }
  };
  </script>
  
  <style scoped>
  .list-enter-active,
  .list-leave-active {
    transition: all 0.5s ease;
  }
  .list-enter-from,
  .list-leave-to {
    opacity: 0;
    transform: translateX(30px);
  }
  
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  </style>
  <style scoped>
  .list-enter-active,
  .list-leave-active {
    transition: all 0.5s ease;
  }
  .list-enter-from,
  .list-leave-to {
    opacity: 0;
    transform: translateY(30px);
  }
  
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  </style>
  