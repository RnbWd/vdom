import nanoid from 'nanoid'
import { Tree } from 'fp-ts/lib/Tree'
import {
  findIndex,
  cons,
  snoc,
  unsafeInsertAt,
  unsafeDeleteAt,
} from 'fp-ts/lib/Array'

import { VNode, Attributes } from './types'

const URI = 'VNode'

export class VirtualNode extends Tree<VNode> {
  constructor(
    readonly tag: string,
    readonly props: Attributes,
    readonly children: VirtualNode[],
    readonly uuid: string = nanoid()
  ) {
    super({ tag, props, uuid }, children)
  }

  static empty() {
    return new VirtualNode('div', {}, [])
  }

  public of(
    tag: string,
    props: Attributes,
    children: VirtualNode[],
    uuid?: string
  ) {
    return new VirtualNode(tag, props, children, uuid)
  }

  public childrenUuids(children: VirtualNode[] = this.children) {
    return this.children.map(({ uuid }: VirtualNode) => uuid)
  }

  public detectChange(children: VirtualNode[]) {
    // console.log(this.uuid)
    console.log(JSON.stringify(this.childrenUuids()))

    return (
      JSON.stringify(this.childrenUuids()) !==
      JSON.stringify(this.childrenUuids(children))
    )
  }

  public append(vnode: VirtualNode) {
    return new VirtualNode(this.tag, this.props, snoc(this.children, vnode))
  }

  public prepend(vnode: VirtualNode) {
    return new VirtualNode(this.tag, this.props, cons(vnode, this.children))
  }

  public insertAt(uuid: string, vnode: VirtualNode) {
    const children = findIndex<VirtualNode>(
      this.children,
      (item: VirtualNode) => item.uuid === uuid
    )
      .map<VirtualNode[]>((i: number) =>
        unsafeInsertAt(i, vnode, this.children)
      )
      .getOrElseL(
        (): VirtualNode[] =>
          this.children.map((node: VirtualNode) => node.insertAt(uuid, vnode))
      )

    return this.detectChange(children)
      ? new VirtualNode(this.tag, this.props, children)
      : this
  }

  public deleteAt(uuid: string) {
    const children = findIndex<VirtualNode>(
      this.children,
      (item: VirtualNode) => item.uuid === uuid
    )
      .map<VirtualNode[]>((i: number) => unsafeDeleteAt(i, this.children))
      .getOrElseL(
        (): VirtualNode[] =>
          this.children.map((node: VirtualNode) => node.deleteAt(uuid))
      )

    return this.detectChange(children)
      ? new VirtualNode(this.tag, this.props, children)
      : this
  }
}
