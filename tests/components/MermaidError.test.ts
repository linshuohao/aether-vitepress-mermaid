import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import MermaidError from '../../src/components/MermaidError.vue'

describe('MermaidError', () => {
  it('renders the provided error message', () => {
    const wrapper = mount(MermaidError, { props: { message: 'Parse error on line 1' } })
    expect(wrapper.text()).toContain('Parse error on line 1')
  })

  it('exposes an alert role for accessibility', () => {
    const wrapper = mount(MermaidError, { props: { message: 'boom' } })
    expect(wrapper.attributes('role')).toBe('alert')
  })
})
