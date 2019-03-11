import { VirtualNode } from './dom/tree'

export const elements: { [uuid: string]: HTMLElement } = {}

export let tree: VirtualNode = VirtualNode.empty()

export let diggy: number = 0

export default {
  elements,
  tree,
  diggy,
}
