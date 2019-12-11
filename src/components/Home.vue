<template>
  <div class="home">
    <h1 class="title">Три взаимодействующих контрола</h1>

    <Control v-for="control in controls"
             :key="control.id"
             :control="control"
             :selectedControlId="selectedControlId"

             @change="toggleControl"
             @switchControl="switchControlHandler"
             @submit="saveControl($event, control.id)"
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
        controls: [],
        selectedControlId: null,
      }
    },
    methods: {
      toggleControl(controlId) {
        this.selectedControlId = this.selectedControlId === controlId ? null : controlId;
      },

      /**
       * Переключение контролов табом
       *
       * @param {Object} switchData
       * @param {String} switchData.order - порядок переключения prev/next
       * @param {Number} switchData.controlId - id контрола с которого переключается
       */
      switchControlHandler(switchData) {
        const {order, controlId} = switchData;
        const lastControlIndex = this.controls.length - 1;
        const controlIdIndex = this.controls.findIndex(control => control.id === controlId);

        const orders = {
          next: () => {
            if (controlIdIndex === lastControlIndex) {
              return this.controls[0].id;
            } else {
              return this.controls[controlIdIndex + 1].id
            }
          },

          prev: () => {
            if (controlIdIndex === 0) {
              return this.controls[lastControlIndex].id;
            } else {
              return this.controls[controlIdIndex - 1].id;
            }
          },
        };

        this.selectedControlId = orders[order]();
      },

      saveControl(value, controlId) {
      },
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