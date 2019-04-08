import { difference } from 'ramda'
import { VirtualNode } from './tree'
import { createElement } from './element'
import global from '../global'

const replaceGlobal = () => {
  global.current = new VirtualNode(
    global.tree.tag,
    global.tree.props,
    global.tree.children,
    global.tree.uuid
  )
}

export const renderRoot = (root?: HTMLElement) => {
  if (root) {
    root.appendChild(createElement(global.tree))
    replaceGlobal()
  }
}

export const changed = () => {}

export const update = () => {
  const [diff1, diff2] = diff(global.current, global.tree)
  if (!diff1.length && !diff2.length) return
  createElement(global.tree)
  const len = Math.max(diff1.length, diff2.length)
  for (var i = 0; i < len; i++) {
    if (diff1[i] instanceof VirtualNode && !diff2[i]) {
      // delete node
      let node = global.elements[(diff1[i] as VirtualNode).uuid]
      node.parentNode && node.parentNode.removeChild(node)
    }
    if (typeof diff1[i] === 'string' && diff2[i]) {
      // replace parent
      let node1 = global.elements[diff1[i] as string]
      let node2 = global.elements[diff2[i].uuid].parentNode
      node1.parentNode && node2 && node1.parentNode.replaceChild(node2, node1)
    }
    if (diff1[i] instanceof VirtualNode && diff2[i]) {
      // replace node
      let node1 = global.elements[(diff1[i] as VirtualNode).uuid]
      let node2 =
        global.elements[`${diff2[i].uuid}-w`] ||
        global.elements[`${diff2[i].uuid}`]
      node1 && node1.parentNode && node1.parentNode.replaceChild(node2, node1)
      if (global.elements[`${diff2[i].uuid}-w`]) {
        global.elements[`${diff2[i].uuid}`] =
          global.elements[`${diff2[i].uuid}-w`]
      }
    }
  }
  replaceGlobal()
}

export const diff = (
  tree1: VirtualNode,
  tree2: VirtualNode
): [VirtualNode[] | string[], VirtualNode[]] => {
  let diff1: VirtualNode[] | VirtualNode[][] | string[] = difference(
    tree1.children,
    tree2.children
  )

  let diff2: VirtualNode[] | VirtualNode[][] | string[] = difference(
    tree2.children,
    tree1.children
  )
  if (recursiveDetectChange(tree1, tree2)) {
    const len = Math.max(diff1.length, diff2.length)
    for (var i = 0; i < len; i++) {
      if (!diff1[i]) {
        diff1[i] = tree1.uuid
      }
      // if (diff1[i] && diff2[i] && diff1[i].tag === diff2[i].tag) {
      //   let [d1, d2] = diff(diff1[i], diff2[i])
      //   if (d1.length && d2.length) {
      //     diff1[i] = d1
      //     diff2[i] = d2
      //   }
      // } else if (!diff1[i]) {
      //   diff1[i] = tree1.uuid
      // }
    }
    return [diff1.flat(), diff2.flat()]
  } else {
    for (var i = 0; i++; i < tree1.children.length) {
      let [d1, d2] = diff(tree1.children[i], tree2.children[i])
      diff1 = diff1.concat(d1)
      diff2 = diff2.concat(d2)
    }
    return [diff1.flat(), diff2.flat()]
  }
}

export const recursiveDetectChange = (
  tree1: VirtualNode,
  tree2: VirtualNode
): boolean => {
  if (tree1.detectChange(tree2.children)) return true
  return tree1.children.reduce(
    (acc: boolean, _: VirtualNode, i: number) =>
      !acc ? recursiveDetectChange(tree1.children[i], tree2.children[i]) : acc,
    false
  )
}
