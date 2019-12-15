<template>
  <div class="control-wrap">
    <span class="control-title">{{control.title}} </span>

    <button type="button"
            class="control-btn"
            tabindex="0"
            v-if="selectedControlId !== control.id"

            @click="changeStateHandler(false, control.id)"
    >
      <span class="control-btn__text">{{formatNumber}}</span>
      <img src="../assets/icons/down.svg" width="6" alt="">
    </button>

    <keep-alive v-else>
      <ControlInput :control="control"
                    :value="control.value"

                    @input="inputHandler"
                    @change="changeStateHandler($event, control.id)"
                    @switchControl="switchControlHandler"
                    @submit="submitHandler"
      />
    </keep-alive>
  </div>
</template>

<script>
  import {mapGetters, mapMutations, mapActions} from 'vuex';
  import ControlInput from './ControlInput';

  export default {
    name: 'Control',
    components: {ControlInput},
    props: {
      selectedControlId: {
        type: [Number, null],
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
      formatNumber() {
        const valueString = this.control.value.toString();
        return valueString.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
      },
    },
    data() {
      return {
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

      changeStateHandler(clickAwayClose, controlId) {
        if (clickAwayClose === false) this.$emit('change', controlId);

        this.$nextTick(() => {
          if (clickAwayClose && this.selectedControlId === controlId) this.$emit('change', controlId);
        })
      },

      inputHandler(value) {
        this.$emit('input', value);
      },

      switchControlHandler(order) {
        this.$emit('switchControl', {order, controlId: this.control.id});
      },

      submitHandler(value) {
        this.$emit('submit', {value, control: this.control});
      },
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
    position: relative;
    z-index: 1;

    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 116px;
    height: 30px;
    padding: 5px 10px;
    box-sizing: border-box;

    background-color: transparent;
    border: 0;
    cursor: pointer;
  }

  .control-btn:hover {
    color: #385469;
  }

  .control-btn__text {
    margin-right: 6px;
  }
</style>