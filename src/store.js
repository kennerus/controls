import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    controls: [
      {
        value: 0,
        title: 'Контролл',
        name: 'main',
        helper: {
          title: 'Сумма',
        },
        isActive: false
      },
      {
        value: 0,
        title: 'Контролл',
        name: 'model',
        helper: {
          title: 'Константа',
        },
        isActive: false
      },
      {
        value: 0,
        title: 'Контролл',
        name: 'model',
        isActive: false
      },
    ],
    constValue: 1000,
  },
  getters: {
    controls: state => state.controls,
  },
  mutations: {
    /**
     * Запись нового значения контролла
     *
     * @param state
     * @param data {Object}
     * @param data.value {String || Number} - новое значение
     * @param data.index {Number} - индекс текущего контролла в массиве
     */
    'CHANGE_CONTROL_VALUE': (state, data) => {
      state.controls[data.index].value = data.value;
    },
    /**
     * Изменение статуса контролла
     *
     * @param state
     * @param data {Object}
     * @param data.isActive {Boolean} - если true - показывает инпут, false - спрятать
     * @param data.index {Number} - индекс текущего контролла в массиве
     */
    'CHANGE_CONTROL_STATUS': (state, data) => {
      state.controls[data.index].isActive = data.isActive;
    },
    /**
     * Суммировать данные двух других контроллов
     *
     * @param state
     * @param names {Object} - объект имён контроллов
     * @param names.main {String} - имя контролла, в который будет записываться сумма
     * @param names.model {String} - имя контроллов, которые будут суммироваться
     */
    'CALCULATE_CONTROLS_VALUE_AND_SET_TO_MAIN': (state, names) => {
      const controls = state.controls.filter(control => control.name === names.model);
      let calculatedValue = 0;

      for (let i = 0; i < controls.length; i++) {
        calculatedValue = Number(calculatedValue) + Number(controls[i].value);
      }
      const main = state.controls.find(control => control.name === names.main);
      main.value = calculatedValue;
    },
    /**
     * Связь между вторым и третьим контроллом. Если изменяется один, меняется второй
     *
     * @param state
     * @param data {Object}
     * @param data.name {String} - имя контроллов, которые связываются
     * @param data.value {Number} - значение контролла, которое будет присваиваться
     */
    'BIND_CONTROLLERS_VALUE': (state, data) => {
      const controls = state.controls.filter(control => control.name === data.name);

      for (let i = 0; i < controls.length; i++) {
          controls[i].value = data.value;
      }
    },
    /**
     * Переключение между контроллами табом (вниз)
     *
     * @param state
     * @param index {Number} - индекс текущего контролла в массиве
     */
    'SWITCH_BETWEEN_INPUTS_TAB': (state, index) => {
      state.controls[index].isActive = false;

      if (index === state.controls.length - 1) {
        state.controls[0].isActive = true;
      } else {
        state.controls[index + 1].isActive = true;
      }
    },
    /**
     * Переключение между контроллами shift+tab (вверх)
     *
     * @param state
     * @param index {Number} - индекс текущего контролла в массиве
     */
    'SWITCH_BETWEEN_INPUTS_SHIFT_TAB': (state, index) => {
      state.controls[index].isActive = false;

      if (index === 0) {
        state.controls[state.controls.length - 1].isActive = true;
      } else {
        state.controls[index - 1].isActive = true;
      }
    },
  },
  actions: {
    /**
     * Прячет текущий инпут и сохраняет значение в стор
     *
     * @param commit
     * @param data {Object}
     * @param data.name {String} - имя контроллов, которые связаны
     * @param data.currentControlName {String} - имя текущего контролла
     * @param data.value {Number} - значение, которое будет сохранено
     * @param data.index {Number} - индекс текущего контролла в массиве
     */
    'HIDE_INPUT_AND_SAVE_DATA': ({commit}, data) => {
      if (data.currentControlName === data.name) {
        commit('BIND_CONTROLLERS_VALUE', {
          name: data.name,
          value: data.value,
          index: data.index
        });
      }

      commit('CHANGE_CONTROL_VALUE', {
        value: data.value,
        index: data.index
      });

      commit('CHANGE_CONTROL_STATUS', {
        isActive: false,
        index: data.index
      })
    }
  }
})
