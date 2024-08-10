<template>
  <form @submit.prevent="savePlayer" class="mb-6 bg-white p-6 rounded-lg shadow">
    <h3 class="text-xl font-semibold mb-4">{{ t(currentPlayer.id ? 'editPlayer' : 'addPlayer') }}</h3>
    <div class="space-y-4">
      <div>
        <label for="playerName" class="block text-sm font-medium text-gray-700 mb-1">{{ t('playerName') }}</label>
        <input id="playerName" :value="currentPlayer.name" @input="updatePlayer('name', $event.target.value)" :placeholder="t('enterPlayerName')" required
               class="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300 transition duration-300"
               maxlength="50"> 
      </div>
      <div>
        <label for="shirtNumber" class="block text-sm font-medium text-gray-700 mb-1">{{ t('shirtNumber') }}</label>
        <input id="shirtNumber" :value="currentPlayer.shirtNumber" @input="updatePlayer('shirtNumber', $event.target.value)" 
               :placeholder="t('enterShirtNumber')" type="number" required
               class="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300 transition duration-300"
               :class="{ 'border-red-500': shirtNumberError }"
               min="1"> 
        <span v-if="shirtNumberError" class="text-red-500 text-sm">{{ t(shirtNumberError) }}</span>
      </div>
      <div>
        <label for="playerRole" class="block text-sm font-medium text-gray-700 mb-1">{{ t('playerRole') }}</label>
        <select id="playerRole" :value="currentPlayer.role" @change="updatePlayer('role', $event.target.value)" required
                class="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300 transition duration-300">
          <option value="">{{ t('selectRole') }}</option>
          <option v-for="role in roles" :key="role" :value="role">{{ $t(role) }}</option>
        </select>
      </div>
    </div>
    <button type="submit" 
            class="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-300 mt-6">
      {{ t(currentPlayer.id ? 'updatePlayer' : 'addPlayer') }}
    </button>
  </form>
</template>

<script>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

export default {
  name: 'PlayerForm',
  props: {
    currentPlayer: Object,
    roles: Array,
    shirtNumberError: String
  },
  emits: ['save-player', 'update:currentPlayer'],
  setup(props, { emit }) {
    const { t } = useI18n();

    const translatedRoles = computed(() => 
      props.roles.map(role => ({
        key: role,
        value: t(role)
      }))
    );

    const savePlayer = () => {
      emit('save-player');
    };

    const updatePlayer = (field, value) => {
      emit('update:currentPlayer', { ...props.currentPlayer, [field]: value });
    };

    return { 
      t,
      translatedRoles,
      savePlayer,
      updatePlayer
    };
  }
};
</script>