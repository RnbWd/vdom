import { Either, right, left } from 'fp-ts/lib/Either'

import { VNode, Attributes, children } from './types'
import { VirtualNode } from './tree'
import global from '../global'

const elEither = (vnode: VNode): Either<string, string> =>
  vnode.tag === 'text' ? left(vnode.props.content) : right(vnode.tag)

const tap = (f: (v: HTMLElement) => void) => (v: HTMLElement) => {
  f(v)
  return v
}

const addAttributes = (props: Attributes) => (el: HTMLElement) => {
  Object.keys(props).forEach((attr: string) =>
    el.setAttribute(attr, props[attr])
  )
}

const globalUuid = (uuid: string) => (el: HTMLElement) => {
  if (!global.elements[uuid]) {
    global.elements[uuid] = el
  } else {
    global.elements[`${uuid}-w`] = el
  }
}

const addChildren = (children: children) => (el: HTMLElement) => {
  children
    .map(createElement)
    .map((child: HTMLElement | Text) => el.appendChild(child))
}

export function createElement(vnode: VirtualNode) {
  return elEither(vnode)
    .bimap(
      (text: string) => document.createTextNode(text),
      (tag: string) => document.createElement(tag)
    )
    .map(tap(addAttributes(vnode.props)))
    .map(tap(addChildren(vnode.children)))
    .map(tap(globalUuid(vnode.uuid)))
    .fold<HTMLElement | Text>((el: Text) => el, (el: HTMLElement) => el)
}
