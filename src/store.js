import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    controls: [
      {
        value: 0,
        title: 'Контролл 1',
        id: 1,
        helper: {
          title: 'Сумма',
          command: {
            type: 'sum',
            value: null,
            command_bound: [2, 3],
          },
          bound: [],
        },
      },
      {
        value: 0,
        title: 'Контролл 2',
        id: 2,
        helper: {
          title: 'Константа',
          command: {
            type: 'const',
            value: 1000,
            command_bound: [3],
          },
          bound: [3],
        },
      },
      {
        value: 0,
        title: 'Контролл 3',
        id: 3,
        helper: {
          title: null,
          command: null,
          bound: [2],
        },
      },
    ],
  },
  getters: {
    getControls: state => state.controls,
    getControlIndex: state => id => state.controls.findIndex(control => control.id === id),
    getControl: state => id => state.controls.find(control => control.id === id),
  },
  mutations: {
    /**
     * Запись нового значения контролла
     *
     * @param state
     * @param data {Object}
     * @param {Number} data.control - новые данные контрола
     * @param {Number} data.controlIndex - id контрола
     */
    'CHANGE_CONTROL_VALUE': (state, data) => {
      state.controls[data.controlIndex] = data.control;
    },
  },
  actions: {
    /**
     * Обновление данных контрола в "базе".
     * Передаются все данные как в put запросе, вдруг понадобится поменять что-то ещё, кроме value.
     *
     * @param state
     * @param getters
     * @param commit
     *
     * @param {Object} control
     * @param {Number} control.id - id контрола
     * @param {Number} control.value - значение контрола
     * @param {String} control.title - имя контрола
     *
     * @param {Object} [control.helper] - помощник контрола
     * @param {String} [control.helper.title] - название хелпера
     * @param {Array} [control.helper.bound] - id контроллов связанных с текущим
     *
     * @param {Object} [control.helper.command] - объект описывающий что должна делать кнопка помощник
     * @param {String} [control.helper.command.type] - тип кнопки помощника. const (константа), sum (суммирование)
     * @param {Number} [control.helper.command.value] - значение для константы
     * @param {Array} [control.helper.command.command_bound] - id контролов, которые связаны командой
     * (например при суммирование значения определённых контролов)
     *
     * @return {Promise<Object>} control - обновлённые данные контрола в "базе"
     */
    'CHANGE_CONTROL_VALUE': ({state, getters, commit}, control) => {
      return new Promise((resolve, reject) => {
        try {
          const controlToChangeIndex = getters.getControlIndex(control.id);
          commit('CHANGE_CONTROL_VALUE', {controlIndex: controlToChangeIndex, control});

          resolve(state.controls[controlToChangeIndex]);
        } catch (error) {
          reject(error);
        }
      })
    },
  }
})
