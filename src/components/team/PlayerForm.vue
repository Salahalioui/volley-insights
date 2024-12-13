<template>
  <form @submit.prevent="savePlayer" class="mb-6 bg-white p-6 rounded-lg shadow">
    <h3 class="text-xl font-semibold mb-4">{{ t(currentPlayer.id ? 'editPlayer' : 'addPlayer') }}</h3>
    <div class="space-y-4">
      <div>
        <label for="playerName" class="block text-sm font-medium text-gray-700 mb-1">{{ t('playerName') }}</label>
        <input 
          id="playerName" 
          v-model="localPlayer.name" 
          :placeholder="t('enterPlayerName')" 
          required
          class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition duration-300"
          maxlength="50"
          :aria-invalid="v$.name.$error"
          @blur="v$.name.$touch"
        > 
        <span v-if="v$.name.$error" class="text-red-500 text-sm">{{ t('nameRequired') }}</span>
      </div>
      <div>
        <label for="shirtNumber" class="block text-sm font-medium text-gray-700 mb-1">{{ t('shirtNumber') }}</label>
        <input 
          id="shirtNumber" 
          v-model.number="localPlayer.shirtNumber" 
          :placeholder="t('enterShirtNumber')" 
          type="number" 
          required
          class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition duration-300"
          :class="{ 'border-red-500': v$.shirtNumber.$error || shirtNumberError }"
          min="1"
          :aria-invalid="v$.shirtNumber.$error || !!shirtNumberError"
          @blur="v$.shirtNumber.$touch"
        > 
        <span v-if="v$.shirtNumber.$error" class="text-red-500 text-sm">{{ t('shirtNumberRequired') }}</span>
        <span v-else-if="shirtNumberError" class="text-red-500 text-sm">{{ t(shirtNumberError) }}</span>
      </div>
      <div>
        <label for="playerRole" class="block text-sm font-medium text-gray-700 mb-1">{{ t('playerRole') }}</label>
        <select 
          id="playerRole" 
          v-model="localPlayer.role" 
          required
          class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition duration-300 appearance-none bg-white"
          :aria-invalid="v$.role.$error"
          @blur="v$.role.$touch"
        >
          <option value="">{{ t('selectRole') }}</option>
          <option v-for="role in roles" :key="role" :value="role">{{ $t(role) }}</option>
        </select>
        <span v-if="v$.role.$error" class="text-red-500 text-sm">{{ t('roleRequired') }}</span>
      </div>
    </div>
    <button 
      type="submit" 
      class="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-300 mt-6 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2"
      :disabled="v$.$invalid"
    >
      {{ t(currentPlayer.id ? 'updatePlayer' : 'addPlayer') }}
    </button>
  </form>
</template>

<script>
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useVuelidate } from '@vuelidate/core';
import { required, minValue } from '@vuelidate/validators';

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
    const localPlayer = ref({ ...props.currentPlayer });

    const rules = computed(() => ({
      name: { required },
      shirtNumber: { required, minValue: minValue(1) },
      role: { required }
    }));

    const v$ = useVuelidate(rules, localPlayer);

    watch(localPlayer, (newValue) => {
      emit('update:currentPlayer', newValue);
    }, { deep: true });

    const savePlayer = async () => {
      const isFormCorrect = await v$.value.$validate();
      if (isFormCorrect) {
        emit('save-player');
      }
    };

    return { 
      t,
      localPlayer,
      v$,
      savePlayer
    };
  }
};
</script>

<style scoped>
select {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}

@media (prefers-reduced-motion: reduce) {
  * {
    transition: none !important;
  }
}
</style>
