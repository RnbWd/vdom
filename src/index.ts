/** @jsx h */
import './assets/css/style.css'
import { drawTree } from 'fp-ts/lib/Tree'

import { h, render } from './dom/h'
import { replace } from './dom/methods'
import global, { diggy } from './global'

// const title = document.createElement('h1')
// title.textContent = 'Hello Poi!'
// title.className = 'title'

// const tip = document.createElement('div')
// tip.textContent = 'Edit src/index.ts and save to reload.'
// tip.className = 'tip'

const tip = h('p', { class: 'tip' }, 'hi')
const title = h('h1', { class: 'title' }, 'Hello Poi!')
const item = h('li', {}, 'stuff')
const list = h('ul', {}, item, item, item, item)

function draw() {
  return drawTree(global.tree.map(x => x.tag))
}

global.tree = h('div', { class: 'app' }, title, tip, list)
// global.tree = global.tree.deleteAt(tip.uuid)

const root = document.getElementById('app')
if (root) {
  render(global.tree)(root)
}

const nlist = list.prepend(item)
console.log(tip.uuid)
console.log(list.uuid)
console.log(title.uuid)

replace(list.uuid)(nlist)

console.log(draw())
