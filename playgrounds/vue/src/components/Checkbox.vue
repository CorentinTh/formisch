<script setup lang="ts">
import type { FieldElementProps } from '@formisch/vue';
import { computed } from 'vue';
import InputErrors from './InputErrors.vue';

interface CheckboxProps {
  class?: string;
  label?: string;
  value?: string;
  required?: boolean;
  errors: [string, ...string[]] | null;
  props: FieldElementProps;
}

const props = defineProps<CheckboxProps>();
const model = defineModel<string[] | boolean | undefined>({ required: true });

const checked = computed(() => {
  if (Array.isArray(model.value)) {
    return props.value !== undefined && model.value.includes(props.value);
  }
  return model.value;
});

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (Array.isArray(model.value)) {
    if (props.value !== undefined) {
      if (target.checked) {
        console.log('Adding value:', props.value);
        model.value = [...model.value, props.value];
      } else {
        model.value = model.value.filter((v) => v !== props.value);
      }
    }
  } else {
    model.value = target.checked;
  }
};
</script>

<template>
  <div :class="['px-8 lg:px-10', props.class]">
    <label class="flex select-none space-x-4 font-medium md:text-lg lg:text-xl">
      <input
        v-bind="props.props"
        :id="props.props.name"
        class="mt-1 h-4 w-4 cursor-pointer lg:mt-1 lg:h-5 lg:w-5"
        :value="value"
        :checked="checked"
        @input="handleInput"
        :required="required"
        :aria-invalid="!!errors"
        :aria-errormessage="`${props.props.name}-error`"
        type="checkbox"
      />
      <span>{{ label }}</span>
      <span v-if="required" class="ml-1 text-red-600 dark:text-red-400">*</span>
    </label>
    <InputErrors :name="props.props.name" :errors="errors" />
  </div>
</template>
