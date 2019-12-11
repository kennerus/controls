<!--
    использован input[type=text] потому, что если использовать number при вводе строки value инпута полностью обнуляется,
    даже если ранее было введено какое-нибудь число
-->
<template>
  <div class="input-wrap"
       v-on-clickaway="hideInputAndSave"
  >
    <input type="text"
           class="input"
           ref="myInput"
           :value="inputValue"

           @input="inputHandler"
           @keydown.38="increment"
           @keydown.40="decrement"
           @keydown.esc="hideInput(false)"
           @keydown.enter="hideInputAndSave(false)"
           @keydown.tab.prevent="tabStep"
    >

    <button type="button"
            class="increment"

            @click="increment"
    >
      <img src="../assets/icons/input_up.svg" width="8" alt="">
    </button>

    <button type="button"
            class="decrement"

            @click="decrement"
    >
      <img src="../assets/icons/input_down.svg" width="8" alt="">
    </button>

    <button type="button"
            class="helper"
            v-if="control.helper"

            @[control.helper.event]="helperMethodCall(control.name)"
    >
      {{helperTitle()}}
    </button>
  </div>
</template>

<script>
  import { mixin as clickaway } from 'vue-clickaway';
  import {mapState, mapGetters, mapMutations, mapActions} from 'vuex';

  export default {
    name: "ControlInput",
    mixins: [clickaway],
    props: {
      value: {
        type: [Number, String],
      },
      control: {
        type: Object,
        default: () => ({
          value: 0,
          title: 'Контролл',
          name: 'main',
          id: 1,
          helper: {
            title: 'Сумма',
          },
        }),
      },
    },
    created() {
      this.inputValue = this.value;
    },
    mounted() {
      this.$nextTick(() => this.$refs.myInput.select());
    },
    data() {
      return {
        inputValue: 0,
      }
    },
    methods: {
      ...mapMutations({
        changeControlStatus: 'CHANGE_CONTROL_STATUS',
        calculateControlsValueAndSetToMain: 'CALCULATE_CONTROLS_VALUE_AND_SET_TO_MAIN',
        bindControllersValue: 'BIND_CONTROLLERS_VALUE',
        switchInputsTab: 'SWITCH_BETWEEN_INPUTS_TAB',
        switchInputsShiftTab: 'SWITCH_BETWEEN_INPUTS_SHIFT_TAB',
      }),

      ...mapActions({
        hideInputAndSaveData: 'HIDE_INPUT_AND_SAVE_DATA',
      }),

      /**
       * У некоторых инпутов может не быть кнопки помощника, поэтому проверяем есть ли кнопка
       */
      helperTitle() {
        return this.control.helper ? this.control.helper.title : '';
      },

      increment() {
        this.inputValue++;
      },

      decrement() {
        if (this.inputValue > 0) this.inputValue--;
      },

      hideInput(clickAway) {
        this.$emit('change', clickAway);
      },

      hideInputAndSave(clickAway = false) {
        this.hideInput(clickAway);
        this.$emit('submit', this.inputValue);
      },

      tabStep(e) {
        this.$emit('switchControl', e.shiftKey ? 'prev' : 'next');
        this.hideInputAndSave(false);
      },

      /**
       * При вводе символов нужно обновлять value инпута, иначе в инпуте будут показываться другие символы
       *
       * @param {Object} event
       */
      inputHandler(event) {
        let {value} = event.target;

        const clearValue = value.replace(/[^0-9.]/g, '');
        event.target.value = clearValue;
        this.inputValue = Number(clearValue);
      },

      /**
       * Событие, которое вешается на кнопку помощник
       *
       * @param name {String} - имя контролла
       */
      helperMethodCall(name) {
        if (name === 'main') {
          this.calculateControlsValueAndSetToMain({
            main: 'main',
            model: 'model'
          });
          this.inputValue = this.control.value;
        } else if (name === 'model') {
          this.inputValue = this.constValue;
        }
      },
    },
  }
</script>

<style scoped>
  .input-wrap {
    position: relative;
    z-index: 1;

    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .input {
    width: 116px;
    height: 30px;
    padding: 5px 10px;
    box-sizing: border-box;

    background-color: #fafafa;
    border: 1px solid #DDDDDD;
  }

  .increment,
  .decrement {
    position: absolute;
    top: 3px;
    right: 10px;
    z-index: 2;

    padding: 0;

    line-height: 1;

    background-color: transparent;
    border: none;
    cursor: pointer;
  }

  .decrement {
    top: auto;
    bottom: 3px;
  }

  .helper {
    position: absolute;
    bottom: -12px;
    z-index: 1;

    padding: 0;

    font-size: 11px;
    color: #42A4F4;

    background-color: transparent;
    border: none;
    cursor: pointer;
  }

  input[type=number]::-webkit-inner-spin-button {

  }
</style>