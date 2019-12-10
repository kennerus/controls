<template>
  <div class="input-wrap"
       v-on-clickaway="hideInput"
  >
    <input type="text"
           class="input"
           ref="myInput"
           :value="value"

           @input="writeDigits($event.target.value)"
           @keydown.38="increment"
           @keydown.40="decrement"
           @keyup.esc="switchInputState"
           @keyup.enter="hideInputAndSave"
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
            @click="helperMethodCall(control.name)"
    >
      {{helperTitle}}
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
      index: {
        type: Number,
        required: true
      },
      passValue: {
        type: Number,
        default: 0
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
    data() {
      return {
      }
    },
    computed: {
      ...mapState({
        constValue: state => state.constValue
      }),

      /**
       * У некоторых инпутов может не быть кнопки помощника, поэтому проверяем есть ли кнопка
       */
      helperTitle() {
        if (this.control.helper) {
          return this.control.helper.title
        }
      },
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

      hideInput() {
        this.$emit('change');
      },

      async switchInputState() {
        this.inputValue = this.control.value;

        await this.changeControlStatus({
          isActive: !this.control.isActive,
          index: this.index
        })
      },

      /**
       * При вводе символов проверяет регуляркой и если символ не цифра - возвращает пустую строку
       * метод replace работает только со строкой
       *
       * @param value {String}
       */
      writeDigits(value) {
        this.$emit('input', value.replace(/[^0-9.]/g, ''));
      },

      hideInputAndSave() {
        if (this.control.isActive) {
          this.hideInputAndSaveData({
            currentControlName: this.control.name,
            name: 'model',
            value: Number(this.inputValue),
            index: this.index
          });
        }
      },

      increment() {
        this.inputValue++;
        this.$emit('pass-input-value', this.inputValue);
      },

      decrement() {
        if (this.inputValue > 0) {
          this.inputValue--;
          this.$emit('pass-input-value', this.inputValue);
        }
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

        this.$emit('pass-input-value', this.inputValue);
      },

      async tabStep(e) {
        this.$emit('tab', this.control.id);
        if (e.shiftKey) {
          // await this.switchInputsShiftTab(Number(this.index));
        } else {
          // await this.switchInputsTab(Number(this.index));
        }
      }
    },
    beforeMount() {
      this.inputValue = this.passValue;
    },
    mounted() {
      this.$refs.myInput.select();
    }
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
</style>