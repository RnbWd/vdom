import nanoid from 'nanoid'
import { Attributes } from './types'
import { VirtualNode } from './tree'
import { createElement } from './element'
import global from '../global'

const textNodes = (child: string | VirtualNode) =>
  typeof child === 'string'
    ? new VirtualNode('text', { content: child }, [])
    : child

export const h = (
  tag: string,
  props: Attributes,
  ...children: Array<VirtualNode | string>
) => new VirtualNode(tag, props, children.map(textNodes), nanoid())
