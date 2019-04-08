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

type Node = {
  tag: string
  props: Attributes
}

export class VirtualNode {
  constructor(
    readonly tag: string,
    readonly props: Attributes,
    readonly children: VirtualNode[],
    readonly uuid: string = nanoid()
  ) {}

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

  public clone(): VirtualNode {
    return new VirtualNode(
      this.tag,
      this.props,
      this.children.map(x => x.clone())
    )
  }

  public childrenUuids(children: VirtualNode[] = this.children) {
    return children.map(({ uuid }: VirtualNode) => uuid)
  }

  public detectChange(children: VirtualNode[]) {
    return (
      JSON.stringify(this.childrenUuids()) !==
      JSON.stringify(this.childrenUuids(children))
    )
  }

  public recursiveDetectChange(
    tree: VirtualNode,
    children: VirtualNode[]
  ): boolean {
    if (tree.detectChange(children)) return true
    return tree.children.reduce(
      (acc: boolean, _: VirtualNode, i: number) =>
        !acc
          ? this.recursiveDetectChange(tree.children[i], children[i].children)
          : acc,
      false
    )
  }

  public append(vnode: VirtualNode) {
    return new VirtualNode(
      this.tag,
      this.props,
      snoc(this.children, vnode.clone()),
      this.uuid
    )
  }

  public prepend(vnode: VirtualNode) {
    return new VirtualNode(
      this.tag,
      this.props,
      cons(vnode.clone(), this.children),
      this.uuid
    )
  }

  public replace(uuid: string, vnode: VirtualNode) {
    return this.insert(uuid, vnode).delete(uuid)
  }

  public delete(uuid: string) {
    const children = findIndex<VirtualNode>(
      this.children,
      (item: VirtualNode) => item.uuid === uuid
    )
      .map<VirtualNode[]>((i: number) => unsafeDeleteAt(i, this.children))
      .getOrElseL(
        (): VirtualNode[] =>
          this.children.map((node: VirtualNode) => node.delete(uuid))
      )

    return this.recursiveDetectChange(this, children)
      ? new VirtualNode(this.tag, this.props, children, this.uuid)
      : this
  }

  public insert(uuid: string, vnode: VirtualNode) {
    const children = findIndex<VirtualNode>(
      this.children,
      (item: VirtualNode) => item.uuid === uuid
    )
      .map<VirtualNode[]>((i: number) =>
        unsafeInsertAt(i, vnode.clone(), this.children)
      )
      .getOrElseL(
        (): VirtualNode[] =>
          this.children.map((node: VirtualNode) =>
            node.insert(uuid, vnode.clone())
          )
      )

    return this.recursiveDetectChange(this, children)
      ? new VirtualNode(this.tag, this.props, children, this.uuid)
      : this
  }
}
