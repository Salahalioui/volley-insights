<template>
    <div class="my-team p-4 sm:p-6 bg-gray-100 rounded-lg shadow-md max-w-4xl mx-auto">
      <h2 class="text-3xl font-bold mb-6 text-gray-800">My Team</h2>
      
      <!-- Search and Filter -->
      <div class="mb-6 flex flex-col sm:flex-row gap-4">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Search players..." 
          class="flex-grow p-3 border rounded-lg focus:ring focus:ring-blue-300 transition duration-300"
        >
        <select 
          v-model="roleFilter"
          class="p-3 border rounded-lg focus:ring focus:ring-blue-300 transition duration-300"
        >
          <option value="">All Roles</option>
          <option v-for="role in uniqueRoles" :key="role" :value="role">{{ role }}</option>
        </select>
      </div>
      
      <!-- Player List -->
      <TransitionGroup name="list" tag="ul" class="space-y-3 mb-6">
        <li v-for="player in filteredPlayers" :key="player.id" 
            class="bg-white p-4 rounded-lg shadow flex flex-col sm:flex-row justify-between items-start sm:items-center transition duration-300 ease-in-out hover:bg-gray-50">
          <div class="flex items-center mb-2 sm:mb-0">
            <div class="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center mr-3">
              {{ player.name.charAt(0) }}
            </div>
            <span>
              <span class="font-semibold">{{ player.name }}</span>
              <span class="text-gray-600 ml-2">#{{ player.shirtNumber }} - {{ player.role }}</span>
            </span>
          </div>
          <div class="space-x-2">
            <button @click="editPlayer(player)" class="text-blue-500 hover:text-blue-700 transition duration-300">
              <i class="fas fa-edit"></i> Edit
            </button>
            <button @click="confirmRemovePlayer(player)" class="text-red-500 hover:text-red-700 transition duration-300">
              <i class="fas fa-trash"></i> Remove
            </button>
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
              <option v-for="role in roles" :key="role" :value="role">{{ role }}</option>
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
          <i class="fas fa-file-export mr-2"></i> Export Players
        </button>
        <label class="flex-1 bg-purple-500 text-white p-3 rounded-lg hover:bg-purple-600 transition duration-300 cursor-pointer text-center">
          <i class="fas fa-file-import mr-2"></i> Import Players
          <input type="file" @change="importPlayers" accept=".json" class="hidden">
        </label>
      </div>
  
      <!-- Notification -->
      <Transition name="fade">
        <div v-if="notification" 
             :class="['fixed bottom-4 right-4 p-3 rounded-lg shadow-lg', 
                      notification.type === 'success' ? 'bg-green-500' : 'bg-red-500', 
                      'text-white']">
          {{ notification.message }}
        </div>
      </Transition>
  
      <!-- Confirmation Modal -->
      <div v-if="showConfirmModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div class="bg-white p-6 rounded-lg shadow-xl">
          <h3 class="text-xl font-bold mb-4">Confirm Removal</h3>
          <p>Are you sure you want to remove {{ playerToRemove?.name }}?</p>
          <div class="mt-4 flex justify-end space-x-3">
            <button @click="cancelRemove" class="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">Cancel</button>
            <button @click="removePlayer" class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">Remove</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted } from 'vue';
  
  export default {
    name: 'MyTeam',
    setup() {
      const players = ref([]);
      const searchQuery = ref('');
      const roleFilter = ref('');
      const currentPlayer = ref({
        id: null,
        name: '',
        shirtNumber: '',
        role: ''
      });
      const notification = ref(null);
      const showConfirmModal = ref(false);
      const playerToRemove = ref(null);
  
      const roles = [
        'Setter',
        'Outside Hitter',
        'Opposite',
        'Middle Blocker',
        'Libero'
      ];
  
      const showNotification = (message, type = 'success') => {
        notification.value = { message, type };
        setTimeout(() => {
          notification.value = null;
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
  
      const confirmRemovePlayer = (player) => {
        playerToRemove.value = player;
        showConfirmModal.value = true;
      };
  
      const removePlayer = () => {
        players.value = players.value.filter(p => p.id !== playerToRemove.value.id);
        savePlayers();
        showNotification('Player removed successfully');
        showConfirmModal.value = false;
        playerToRemove.value = null;
      };
  
      const cancelRemove = () => {
        showConfirmModal.value = false;
        playerToRemove.value = null;
      };
  
      const resetForm = () => {
        currentPlayer.value = { id: null, name: '', shirtNumber: '', role: '' };
      };
  
      const exportPlayers = () => {
        const dataStr = JSON.stringify(players.value, null, 2);
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
            showNotification('Error: Invalid JSON file', 'error');
          }
        };
        reader.readAsText(file);
      };
  
      const filteredPlayers = computed(() => {
        return players.value.filter(player => 
          (player.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
           player.shirtNumber.toString().includes(searchQuery.value) ||
           player.role.toLowerCase().includes(searchQuery.value.toLowerCase())) &&
          (roleFilter.value === '' || player.role === roleFilter.value)
        );
      });
  
      const uniqueRoles = computed(() => {
        return [...new Set(players.value.map(player => player.role))];
      });
  
      onMounted(() => {
        loadPlayers();
      });
  
      return {
        players,
        searchQuery,
        roleFilter,
        currentPlayer,
        notification,
        showConfirmModal,
        playerToRemove,
        filteredPlayers,
        uniqueRoles,
        roles,
        savePlayer,
        editPlayer,
        confirmRemovePlayer,
        removePlayer,
        cancelRemove,
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