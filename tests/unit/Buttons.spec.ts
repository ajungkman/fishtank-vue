import { expect } from "chai"
import sinon, { spy, stub, restore } from 'sinon'
import Vue from 'vue'
import { mount } from "@vue/test-utils"
import { kebabCase } from 'lodash'
import {
  BaseButton,
  ButtonPrimary,
  ButtonSecondary,
  ButtonDestructive,
} from "@/index"

describe('Buttons', () => {
  describe('BaseButton', () => {
    it('fires click handler when the button is clicked', () => {
      let clickHandler = spy()
      let ButtonWrapper = Vue.extend({
        components: {
          BaseButton
        },
        render(h) {
          return h(BaseButton, {
            on: {
              click: clickHandler
            }
          })
        }
      })

      let wrapper = mount(ButtonWrapper)
      let button = wrapper.find('button')

      button.trigger('click')
      sinon.assert.called(clickHandler)
    })

    it('fires arbitrary event handlers when appropriate event triggered', () => {
      let customHandler = spy()
      let wrapper = mount(BaseButton, {
        listeners: {
          custom: customHandler,
        }
      })
      let button = wrapper.find('button')

      button.trigger('custom')
      sinon.assert.called(customHandler)
    })

    context('disabled property is true', () => {
      let propsData = { disabled: true }

      it('has a disabled class', () => {
        let wrapper = mount(BaseButton, { propsData })

        expect(wrapper.classes()).to.include('ft-button--disabled')
      })

      it('does not fire click handlers', () => {
        let clickHandler = spy()
        let ButtonWrapper = Vue.extend({
          components: {
            BaseButton
          },
          render(h) {
            return h(BaseButton, {
              props: {
                disabled: true,
              },
              on: {
                click: clickHandler
              }
            })
          }
        })

        let wrapper = mount(ButtonWrapper)
        let button = wrapper.find('button')

        button.trigger('click')
        sinon.assert.notCalled(clickHandler)
      })
    })
  })

  ;[
    ButtonPrimary,
    ButtonSecondary,
    ButtonDestructive
  ].forEach(Button => {
    let buttonName: string = (Button as any).options.name

    describe(buttonName, () => {
      it('shows the provided content', () =>{
        let wrapper = mount(Button,{
          slots: {
            default: 'The Button Text'
          }
        })

        expect(wrapper.text()).to.equal('The Button Text')
      })

      it('adds the modifier class to the base button component', () =>{
        let wrapper = mount(Button)
        let base = wrapper.find(BaseButton)

        let expectedClass = `ft-button--${kebabCase(buttonName.replace(/^Button/, ''))}`
        expect(wrapper.classes()).to.include(expectedClass)
      })

      it('delegates events to the base button class', () => {
        let clickHandler = spy()
        let wrapper = mount(Button, {
          listeners: {
            click: clickHandler
          }
        })
        let base = wrapper.find(BaseButton)
        base.trigger('click')

        sinon.assert.called(clickHandler)
      })

      it('passes all attribute bindings down to base button', () => {
        let wrapper = mount(Button, {
          attrs: {
            disabled: true
          }
        })
        let base = wrapper.find(BaseButton)

        expect(base.classes()).to.include('ft-button--disabled')
      })
    })
  })
})