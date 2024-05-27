<template>
      <ion-input :label="label" :type="type" label-placement="floating" :placeholder="placeholder" :value="value" @input="updateValue($event.target.value)" ></ion-input>
  </template>
  
  <script lang="ts">
  import { IonInput } from '@ionic/vue';
  import { defineComponent } from 'vue';
  
  export default defineComponent({
    props: {
      type: String,
      id: {
        type: String,
        required: true,
      },
      value: String,
      placeholder: String,
      label: String
    },
    emits: ['update:modelValue'],
    methods: {
      updateValue(newValue: string) {
        this.$emit('update:modelValue', newValue);
      }
    }
  });
  </script>