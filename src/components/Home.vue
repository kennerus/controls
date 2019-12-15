<template>
  <div class="home">
    <h1 class="title">Три взаимодействующих контрола</h1>

    <Control v-for="control in controls"
             :key="control.id"
             :control="control"
             :selectedControlId="selectedControlId"
             :sumCallback="sumInputs"

             @input="inputHandler"
             @change="toggleControl"
             @switchControl="switchControlHandler"
             @submit="saveControl"
    />
  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex';
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
      ...mapActions({
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
        const controlIdIndex = this.getControlIndex(controlId);

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

      /**
       * Обновление данных связанного инпута
       *
       * @param {Object} data
       * @param {Number} data.value - записываемое значение
       * @param {Array} data.bound - связанные инпуты
       */
      inputHandler(data) {
        const controlsFound = this.findControlsIndexes(data.bound, this.getControlIndex);

        controlsFound.forEach(controlIndex => this.controls[controlIndex].value = data.value);
      },

      /**
       * Возвращает индексы найденных контролов
       */
      findControlsIndexes(boundedControls, findIndexCallback) {
        return boundedControls.map(boundedControlId => findIndexCallback(boundedControlId));
      },

      getControlIndex(controlId) {
        return this.controls.findIndex(control => control.id === controlId);
      },

      /**
       * Обновление value контрола перед записью во vuex
       */
      formControlData(data) {
        const control = data.control;
        control.value = data.value;

        return control;
      },

      /**
       * Запись параметров в vuex и обновление в компоненте
       * Делаем вид, что это put запрос к бэку
       *
       * @param {Object} data
       * @param {Number} data.value - новое значение контрола
       * @param {Object} data.control - данные контрола
       */
      saveControl(data) {
        const newControlData = this.formControlData(data);

        this.CHANGE_CONTROL_VALUE(newControlData)
          .then(response => this.saveControlHandler(response))
          .catch(error => {
            // на текущем проекте, я обычно вызываю метод обработчик ошибки,
            // который в попапе показывает ошибку с бека. тут его упрощённая версия
            console.log(error);
            alert(error);
          });
      },

      /**
       * Обновление данных контрола в компоненте
       */
      saveControlHandler(response) {
        const controlIndex = this.getControlIndex(response.id);
        this.controls[controlIndex] = response;
      },

      /**
       * Суммирование инпутов
       *
       * @param {Object} sumControl - контрол, хелпер которого суммирует определённые инпуты
       * @return {Number} - сумма инпутов
       */
      sumInputs(sumControl) {
        const {command_bound} = sumControl.helper.command;
        const controlsToSum = this.controls.filter(control => command_bound.find(boundedControl => boundedControl === control.id));

        return controlsToSum.reduce((sum, currentControl) => sum + currentControl.value, 0);
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