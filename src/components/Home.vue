<template>
  <div class="home">
    <h1 class="title">Три взаимодействующих контрола</h1>

    <Control v-for="(control, index) in controls"
             :key="control.title + index"
             :index="index"
             :control="control"

             @change="saveControl"
    />
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';
  import Control from './Control';

  export default {
    name: 'home',
    components: {
      Control
    },
    computed: {
      ...mapGetters({
        getControls: 'getControls',
      })
    },
    // сделаем вид, что получили данные о контролах с бэка
    mounted() {
      window.setTimeout(() => this.controls = this.getControls, 200);
    },
    data() {
      return {
        controls: []
      }
    },
    methods: {
      saveControl(control) {

      }
    },

  }
</script>

<style scoped>
  .home {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .title {
    max-width: 300px;
    font-size: 24px;
    font-weight: normal;
  }
</style>