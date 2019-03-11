import nanoid from 'nanoid'
import { Attributes } from './types'
import { VirtualNode } from './tree'
import { createElement } from './element'

let HTML_ROOT: HTMLElement = document.createElement('div')

const textNodes = (child: string | VirtualNode) =>
  typeof child === 'string'
    ? new VirtualNode('text', { content: child }, [])
    : child

export const h = (
  tag: string,
  props: Attributes,
  ...children: Array<VirtualNode | string>
) => new VirtualNode(tag, props, children.map(textNodes), nanoid())

export const render = (tree: VirtualNode) => (
  root: HTMLElement = HTML_ROOT
) => {
  HTML_ROOT = root
  root.appendChild(createElement(tree))
}
