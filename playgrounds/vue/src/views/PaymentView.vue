<script setup lang="ts">
import {
  Field,
  Form,
  getInput,
  type SubmitHandler,
  useForm,
} from '@formisch/vue';
import * as v from 'valibot';
import { computed } from 'vue';
import { FormFooter, FormHeader, Select, TextInput } from '../components';

const PaymentFormSchema = v.intersect([
  v.object({
    owner: v.pipe(
      v.string('Please enter your name.'),
      v.nonEmpty('Please enter your name.')
    ),
  }),
  v.variant(
    'type',
    [
      v.object({
        type: v.literal('card'),
        card: v.object({
          number: v.pipe(
            v.string('Please enter your card number.'),
            v.nonEmpty('Please enter your card number.'),
            v.creditCard('The card number is badly formatted.')
          ),
          expiration: v.pipe(
            v.string('Please enter the expiration date.'),
            v.nonEmpty('Please enter the expiration date.'),
            v.regex(
              /^(?:0[1-9]|1[0-2])\/(?:2[5-9]|3[0-9])$/,
              'The expiration date is badly formatted.'
            )
          ),
        }),
      }),
      v.object({
        type: v.literal('paypal'),
        paypal: v.object({
          email: v.pipe(
            v.string('Please enter your PayPal email.'),
            v.nonEmpty('Please enter your PayPal email.'),
            v.email('The email address is badly formatted.')
          ),
        }),
      }),
    ],
    'Please select the payment type.'
  ),
]);

type PaymentFormSchema = typeof PaymentFormSchema;

const paymentForm = useForm({
  schema: PaymentFormSchema,
});

const type = computed(() => getInput(paymentForm, { path: ['type'] }));
</script>

<template>
  <Form
    :of="paymentForm"
    class="space-y-12 md:space-y-14 lg:space-y-16"
    @submit="(output) => console.log(output)"
  >
    <FormHeader :of="paymentForm" heading="Payment form" />
    <div class="space-y-8 md:space-y-10 lg:space-y-12">
      <Field :of="paymentForm" :path="['owner']" v-slot="field">
        <TextInput
          v-model="field.input"
          :props="field.props"
          :errors="field.errors"
          type="text"
          label="Owner"
          placeholder="John Doe"
          required
        />
      </Field>
      <Field :of="paymentForm" :path="['type']" v-slot="field">
        <Select
          v-model="field.input"
          :props="field.props"
          :options="[
            { label: 'Card', value: 'card' },
            { label: 'PayPal', value: 'paypal' },
          ]"
          :errors="field.errors"
          label="Type"
          placeholder="Card or PayPal?"
          required
        />
      </Field>
      <template v-if="type === 'card'">
        <Field :of="paymentForm" :path="['card', 'number']" v-slot="field">
          <TextInput
            v-model="field.input"
            :props="field.props"
            :errors="field.errors"
            type="text"
            label="Number"
            placeholder="1234 1234 1234 1234"
            required
          />
        </Field>
        <Field :of="paymentForm" :path="['card', 'expiration']" v-slot="field">
          <TextInput
            v-model="field.input"
            :props="field.props"
            :errors="field.errors"
            type="text"
            label="Expiration"
            placeholder="MM/YY"
            required
          />
        </Field>
      </template>
      <Field
        v-if="type === 'paypal'"
        :of="paymentForm"
        :path="['paypal', 'email']"
        v-slot="field"
      >
        <TextInput
          v-model="field.input"
          :props="field.props"
          :errors="field.errors"
          type="email"
          label="Email"
          placeholder="example@email.com"
          required
        />
      </Field>
    </div>
    <FormFooter :of="paymentForm" />
  </Form>
</template>
