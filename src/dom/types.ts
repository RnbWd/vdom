import { VirtualNode } from './tree'

export type vType = 'Element' | 'Text'

export type children = VirtualNode[]

export interface Attributes {
  [attr: string]: string
}

export interface VNode {
  tag: string
  props: Attributes
  uuid: string
}
