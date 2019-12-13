<template>
  <div class="home">
    <h1 class="title">Три взаимодействующих контрола</h1>

    <Control v-for="control in controls"
             :key="control.id"
             :control="control"
             :selectedControlId="selectedControlId"

             @input="inputHandler"
             @change="toggleControl"
             @switchControl="switchControlHandler"
             @submit="saveControl($event, control.id)"
    />
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex';
  import Control from './Control';

  export default {
    name: 'home',
    components: {
      Control
    },
    computed: {
      ...mapGetters({
        getControls: 'getControls',
        getControlIndex: 'getControlIndex',
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
      ...mapMutations({
        CHANGE_CONTROL_VALUE: 'CHANGE_CONTROL_VALUE',
      }),

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
        const controlIdIndex = this.getLocalControlIndex(controlId);

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

      inputHandler(value) {
        const controlsFound = this.findControlsIndexes(value.bound, this.getLocalControlIndex);

        controlsFound.forEach(controlIndex => this.controls[controlIndex].value = value.value);
      },

      findControlsIndexes(boundedControls, findIndexCallback) {
        return boundedControls.map(boundedControlId => findIndexCallback(boundedControlId));
      },

      getLocalControlIndex(controlId) {
        return this.controls.findIndex(control => control.id === controlId);
      },

      saveControl(value, controlId) {
        const controlIndex = this.getLocalControlIndex(controlId);
        this.controls[controlIndex].value = value;
      },

      saveControlToVuex(value, controlId) {
        const vuexControl = this.getControl(controlId);
        const vuexControlsToChange = [...vuexControl, controlId];
        const vuexControlsIndexes = this.findControlsIndexes(vuexControlsToChange);


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