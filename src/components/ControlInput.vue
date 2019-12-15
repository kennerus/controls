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
           @keydown.38="incrementValue"
           @keydown.40="decrementValue"
           @keydown.esc="hideInputNoSave(false)"
           @keydown.enter="hideInputAndSave(false)"
           @keydown.tab.prevent="tabStep"
    >

    <button type="button"
            class="increment"

            @click="incrementValue"
    >
      <img src="../assets/icons/input_up.svg" width="8" alt="">
    </button>

    <button type="button"
            class="decrement"

            @click="decrementValue"
    >
      <img src="../assets/icons/input_down.svg" width="8" alt="">
    </button>

    <button type="button"
            class="helper"
            v-if="control.helper.command"

            @keydown.esc="hideInputNoSave(false)"
            @click="commandHandler"
    >
      {{control.helper.title}}
    </button>
  </div>
</template>

<script>
  import { mixin as clickaway } from 'vue-clickaway';

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
      sumCallback: {
        type: Function
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
      incrementValue() {
        this.inputValue++;
      },

      decrementValue() {
        if (this.inputValue > 0) this.inputValue--;
      },

      hideInput(clickAway = false) {
        this.$emit('change', clickAway);
      },

      saveData() {
        this.$emit('submit', this.inputValue);
      },

      /**
       * Закрытие инпута без сохранения данных
       */
      hideInputNoSave() {
        this.hideInput();
        this.emitValueBound(0);
      },

      /**
       * Эмит данных наверх с сохранением. Указывает как был закрыт инпут
       *
       * @param {Boolean=false} clickAway - клик вне инпута
       */
      hideInputAndSave(clickAway = false) {
        this.hideInput(clickAway);
        this.saveData();
      },

      /**
       * Переключение между инпутами tab/shift+tab с сохранением данных
       */
      tabStep(e) {
        this.saveData();
        this.$emit('switchControl', e.shiftKey ? 'prev' : 'next');
      },

      /**
       * При вводе символов нужно обновлять value инпута, иначе в инпуте будут показываться другие символы
       * Помимо этого записывает данные в связанный инпут, если надо
       *
       * @param {Object} event
       */
      inputHandler(event) {
        const {value} = event.target;

        const clearValue = value.replace(/[^0-9.]/g, '');
        event.target.value = clearValue;
        this.setValue(clearValue);
      },

      /**
       * Запись данных в инпут для связанного инпута
       */
      setValue(value) {
        this.inputValue = Number(value);
        this.emitValueBound(this.inputValue);
      },

      /**
       * Эмитит данные для связанного инпута
       */
      emitValueBound(value) {
        const {bound} = this.control.helper;
        if (bound.length) this.$emit('input', {value, bound});
      },

      sumHandler() {
        this.inputValue = this.sumCallback(this.control);
      },

      constHandler() {
        this.setValue(this.control.helper.command.value);
      },

      /**
       * Обработчик клика на кнопку помощник
       */
      commandHandler() {
        const commands = {
          sum: this.sumHandler,
          const: this.constHandler,
        };

        commands[this.control.helper.command.type]();
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