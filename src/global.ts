import { VirtualNode } from './dom/tree'

export const elements: { [uuid: string]: HTMLElement } = {}

export let tree: VirtualNode = VirtualNode.empty()

export let current: VirtualNode = new VirtualNode(
  tree.tag,
  tree.props,
  tree.children,
  tree.uuid
)

export let diggy: number = 0

let HTML_ROOT: HTMLElement = document.createElement('div')

export default {
  elements,
  tree,
  diggy,
  HTML_ROOT,
  current,
}
