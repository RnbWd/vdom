import { VirtualNode } from './tree'
import { createElement } from './element'
import global from '../global'

export const replace = (uuid: string) => (vnode: VirtualNode) => {
  global.diggy = global.diggy + 1
  global.elements[uuid] &&
    global.elements[uuid].replaceWith(createElement(vnode))
  global.tree = global.tree.insertAt(uuid, vnode).deleteAt(uuid)
}

export const insert = (uuid: string) => (vnode: VirtualNode) => {
  global.elements[uuid] &&
    global.elements[uuid].replaceWith(createElement(vnode))
  global.tree = global.tree.insertAt(uuid, vnode).deleteAt(uuid)
}

export const append = (uuid: string) => (vnode: VirtualNode) => {
  global.elements[uuid] &&
    global.elements[uuid].replaceWith(createElement(vnode))
  global.tree = global.tree.insertAt(uuid, vnode).deleteAt(uuid)
}

export const prepend = (uuid: string) => (vnode: VirtualNode) => {
  global.elements[uuid] &&
    global.elements[uuid].replaceWith(createElement(vnode))
  global.tree = global.tree.insertAt(uuid, vnode).deleteAt(uuid)
}
