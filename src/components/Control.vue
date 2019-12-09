<template>
  <div class="control-wrap">
    <span class="control-title">{{control.title}} {{index}}</span>

    <button class="control-btn"
            tabindex="0"
            v-if="!active"

            @click="openInput"
    >
      <span class="control-btn__text">{{makeSpaces}}</span>
      <img src="../assets/icons/down.svg" width="6" alt="">
    </button>

    <ControlInput v-if="active"
                  :index="index"
                  :control="control"
                  :value="JSON.parse(JSON.stringify(control.value))"

                  @submit="handleNewValue"
    />
  </div>
</template>

<script>
  import {mapGetters, mapMutations, mapActions} from 'vuex';
  import ControlInput from './ControlInput';

  export default {
    name: "Control",
    components: {ControlInput},
    props: {
      index: {
        type: Number,
        required: true
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
      }
    },
    computed: {
      makeString() {
        return String(this.control.value);
      },

      makeSpaces() {
        return this.makeString.replace(/[^0-9.]/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, " ");
      },
    },
    mounted() {

    },
    data() {
      return {
        inputValue: 0,
        active: false,
      }
    },
    methods: {
      ...mapMutations({
        changeControlState: 'CHANGE_CONTROL_VALUE',
        changeControlStatus: 'CHANGE_CONTROL_STATUS',
        bindConrollersValue: 'BIND_CONTROLLERS_VALUE',
        hideInputAndSaveData: 'HIDE_INPUT_AND_SAVE_DATA',
      }),

      ...mapActions({
        hideInputAndSaveData: 'HIDE_INPUT_AND_SAVE_DATA',
      }),

      openInput() {
        this.inputValue = this.control.value;
        this.active = true;
      },

      hideInputAndSave() {
        if (this.active) {
          this.hideInputAndSaveData({
            currentControlName: this.control.name,
            name: 'model',
            value: Number(this.inputValue),
            index: this.index
          });
        }
      },

      handleNewValue(value) {

      }
    },
  }
</script>

<style scoped>
  .control-wrap {
    display: flex;
    align-items: center;
    margin-top: 40px;
  }

  .control-title {
    margin-right: 50px;

    font-size: 15px;
    color: #999999;
  }

  .control-btn {
    width: 116px;
    height: 30px;
    padding: 5px 10px;
    box-sizing: border-box;
  }

  .control-btn {
    position: relative;
    z-index: 1;

    display: flex;
    justify-content: flex-start;
    align-items: center;

    background-color: transparent;
    border: 0;
    cursor: pointer;
  }

  .control-btn__text {
    margin-right: 6px;
  }
</style>