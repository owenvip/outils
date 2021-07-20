import { shallowMount } from '@vue/test-utils'
import Cmp from '../src'

describe('Component', () => {
  it('component renders passed', () => {
    const cmp = shallowMount(Cmp)
    expect(cmp).not.toBeUndefined()
  })
})
