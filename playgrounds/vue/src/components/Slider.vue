<script setup lang="ts">
import type { FieldElementProps } from '@formisch/vue';
import InputErrors from './InputErrors.vue';
import InputLabel from './InputLabel.vue';

interface SliderProps {
  class?: string;
  label?: string;
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
  errors: [string, ...string[]] | null;
  props: FieldElementProps;
}

const props = defineProps<SliderProps>();
const model = defineModel<number | undefined>({ required: true });
</script>

<template>
  <div :class="['px-8 lg:px-10', props.class]">
    <InputLabel :name="props.props.name" :label="label" :required="required" />
    <input
      v-model.number="model"
      v-bind="props.props"
      :id="props.props.name"
      class="w-full"
      :min="min"
      :max="max"
      :step="step"
      :required="required"
      :aria-invalid="!!errors"
      :aria-errormessage="`${props.props.name}-error`"
      type="range"
    />
    <InputErrors :name="props.props.name" :errors="errors" />
  </div>
</template>
