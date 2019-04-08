/** @jsx h */
import './assets/css/style.css'
import { drawTree } from 'fp-ts/lib/Tree'

import { h } from './dom/h'
import { renderRoot, update } from './dom/methods'
import global from './global'
window.global = global
window.h = h
window.draw = draw
const tip = h('p', { class: 'tip' }, 'hi')
const title = h('h1', { class: 'title' }, 'Hello Poi!')
const item = h('li', {}, 'vdom')
const list = h('ul', {}, item.clone(), item.clone(), item.clone(), item.clone())

function draw() {
  return drawTree(global.tree.map(x => `${x.tag} - ${x.uuid.slice(0, 3)}`))
}

global.tree = h('div', { class: 'app' }, title, tip, list)

const root = document.getElementById('app')
if (root) {
  renderRoot(root)
}

global.tree = global.tree.replace(
  global.tree.children[0].uuid,
  h('h1', { class: 'title' }, 'Empyrean')
)

global.tree = global.tree.replace(
  global.tree.children[0].uuid,
  global.tree.children[0].append(tip)
)

global.tree = global.tree.replace(
  global.tree.children[0].uuid,
  global.tree.children[0].append(tip).append(tip)
)

global.tree = global.tree.delete(global.tree.children[1].uuid)

global.tree = global.tree.delete(global.tree.children[0].children[1].uuid)

global.tree = global.tree.replace(
  global.tree.children[0].children[1].uuid,
  h('h1', { class: 'title' }, 'vdom')
)

setInterval(update, 100)
