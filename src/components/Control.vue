<template>
  <div class="control-wrap" v-click-outside="hideInputAndSave">
    <span class="control-title">{{currentControl.title}} {{index}}</span>

    <button class="control-btn"
            tabindex="0"
            v-if="!currentControl.isActive"
            @click="openInput"
    >
      <span class="control-btn__text">{{makeSpaces}}</span>
      <img src="../assets/icons/down.svg" width="6" alt="">
    </button>

    <ControlInput v-if="currentControl.isActive"
                  @pass-input-value="saveValue"
                  :index="index"
                  :passValue="Number(this.inputValue)"
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
    },
    data() {
      return {
        inputValue: 0,
      }
    },
    computed: {
      ...mapGetters({
        controls: 'controls',
      }),
      currentControl() {
        return this.controls[this.index];
      },
      makeString() {
        return String(this.currentControl.value);
      },
      makeSpaces() {
        return this.makeString.replace(/[^0-9.]/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, " ");
      },
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
      /**
       * Получает значение из инпута и записывает его себе
       *
       * @param value {String}
       */
      saveValue(value) {
        this.inputValue = value;
      },
      openInput() {
        this.inputValue = this.currentControl.value;

        this.changeControlStatus({
          isActive: true,
          index: this.index
        })
      },
      hideInputAndSave() {
        if (this.currentControl.isActive) {
          this.hideInputAndSaveData({
            currentControlName: this.currentControl.name,
            name: 'model',
            value: Number(this.inputValue),
            index: this.index
          });
        }
      },
    },
    directives: {
      'click-outside': {
        bind: function (el, binding, vNode) {
          // Provided expression must evaluate to a function.
          if (typeof binding.value !== 'function') {
            const compName = vNode.context.name;
            let warn = `[Vue-click-outside:] provided expression '${binding.expression}' is not a function, but has to be`;
            if (compName) {
              warn += `Found in component '${compName}'`
            }

            console.warn(warn);
          }
          // Define Handler and cache it on the element
          const bubble = binding.modifiers.bubble;
          const handler = (e) => {
            if (bubble || (!el.contains(e.target) && el !== e.target)) {
              binding.value(e)
            }
          };
          el.__vueClickOutside__ = handler;

          // add Event Listeners
          document.addEventListener('click', handler);
        },

        unbind: function (el, binding) {
          // Remove Event Listeners
          document.removeEventListener('click', el.__vueClickOutside__);
          el.__vueClickOutside__ = null

        }
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