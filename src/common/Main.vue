<script>
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";


</script>

<template>
  <p>hello world</p>
  <button type="button" class="btn btn-secondary">Secondary</button>
  <font-awesome-icon :icon="['fas', 'magnifying-glass']" />
  <font-awesome-icon :icon="['far', 'bars']" />
  <button type="button" class="btn btn-outline-success">Success</button>
</template>

<style scoped></style>