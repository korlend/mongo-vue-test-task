
<template>
  <div class="main">
    <donate-block />
  </div>
</template>

<script lang="ts">

import { Options, Vue } from 'vue-class-component';
import DonateBlock from './components/DonateBlock.vue';

@Options({
  components: {
    DonateBlock,
  },
})
export default class App extends Vue {}
</script>

<style>

body {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.main {
  margin-top: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

</style>
