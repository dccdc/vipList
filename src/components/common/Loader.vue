<template>
  <v-dialog
    v-model="show"
    persistent
    width="300"
  >
    <v-card
     style="background-color: #d21f1d;"
      dark
    >
      <v-card-text>
        {{message}}
        <v-progress-linear
          indeterminate
          color="white"
          class="mb-0"
        ></v-progress-linear>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    value: Boolean,
    message: String
  },
  computed: {
    show: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    }
  }
}
</script>
