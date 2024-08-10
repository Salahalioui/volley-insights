<template>
  <div class="mb-6 flex flex-col sm:flex-row gap-4">
    <input 
      :value="searchQuery" 
      @input="$emit('update:searchQuery', $event.target.value)"
      type="text" 
      :placeholder="$t('searchPlayers')" 
      class="flex-grow p-3 border rounded-lg focus:ring focus:ring-blue-300 transition duration-300"
    >
    <select 
      :value="roleFilter"
      @change="$emit('update:roleFilter', $event.target.value)"
      class="p-3 border rounded-lg focus:ring focus:ring-blue-300 transition duration-300"
    >
      <option value="">{{ $t('allRoles') }}</option>
      <option v-for="role in translatedRoles" :key="role.key" :value="role.key">{{ role.value }}</option>
    </select>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

export default {
  name: 'SearchFilter',
  props: {
    searchQuery: String,
    roleFilter: String,
    uniqueRoles: Array
  },
  setup(props) {
    const { t } = useI18n();

    const translatedRoles = computed(() => 
      props.uniqueRoles.map(role => ({
        key: role,
        value: t(role)
      }))
    );

    return {
      t,
      translatedRoles
    };
  }
};
</script>

<style scoped>
</style>