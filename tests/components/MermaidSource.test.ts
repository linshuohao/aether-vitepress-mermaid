import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import MermaidSource from '../../src/components/MermaidSource.vue'

describe('MermaidSource', () => {
  it('renders the raw code inside a collapsible <details>', () => {
    const wrapper = mount(MermaidSource, {
      props: { code: 'flowchart TD\n  A --> B' }
    })

    expect(wrapper.find('details').exists()).toBe(true)
    expect(wrapper.find('pre code').text()).toBe('flowchart TD\n  A --> B')
  })

  it('is collapsed by default', () => {
    const wrapper = mount(MermaidSource, { props: { code: 'A --> B' } })
    expect(wrapper.find('details').attributes('open')).toBeUndefined()
  })
})
