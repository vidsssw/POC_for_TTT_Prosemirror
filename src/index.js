import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import applyDevTools from "prosemirror-dev-tools";
import "./editor.css";
import {addListNodes} from "prosemirror-schema-list"
import { EditorState,NodeSelection } from "prosemirror-state";
import {Schema, DOMParser} from "prosemirror-model"
import { EditorView } from "prosemirror-view";
import { schema , nodes } from "prosemirror-schema-basic";
const {exampleSetup, buildMenuItems} = require("prosemirror-example-setup")
//const {blockTypeItem} = require("prosemirror-menu")
const {MenuItem} = require("prosemirror-menu")

const resizableImage = {
  inline: true,
  attrs: {
    src: {},
    width: {default: "10em"},
    alt: {default: null},
    title: {default: null}
  },
  group: "inline",
  draggable: true,
  parseDOM: [{
    priority: 51, // must be higher than the default image spec
    tag: "img[src][width]", 
    getAttrs(dom) {
      return {
        src: dom.getAttribute("src"),
        title: dom.getAttribute("title"),
        alt: dom.getAttribute("alt"),
        width: dom.getAttribute("width")
      }
    }
  }],
  // TODO if we don't define toDom, something weird happens: dragging the image will not move it but clone it. Why?
  toDOM(node) {
    const attrs = {style: `width: ${node.attrs.width}`}
    return ["span", { ...node.attrs, ...attrs }] 
  }
}

const mySchema = new Schema({
  nodes: { ...nodes, resizableImage },
  marks: schema.spec.marks
})

function getFontSize(element) {
  return parseFloat(getComputedStyle(element).fontSize);
}

class FootnoteView {
  constructor(node, view, getPos) {    
    const outer = document.createElement("span")
    outer.style.position = "relative"
    outer.style.width = node.attrs.width
    //outer.style.border = "1px solid blue"
    outer.style.display = "inline-block"
    //outer.style.paddingRight = "0.25em"
    outer.style.lineHeight = "0"; // necessary so the bottom right arrow is aligned nicely
    
    const img = document.createElement("img")
    img.setAttribute("src", node.attrs.src)
    img.style.width = "100%"
    //img.style.border = "1px solid red"
    
    const handle = document.createElement("span")
    handle.style.position = "absolute"
    handle.style.bottom = "0px"
    handle.style.right = "0px"
    handle.style.width = "10px"
    handle.style.height = "10px"
    handle.style.border = "3px solid black"
    handle.style.borderTop = "none"
    handle.style.borderLeft = "none"
    handle.style.display = "none"
    handle.style.cursor = "nwse-resize"
    
    handle.onmousedown = function(e) {
      e.preventDefault()
      
      const startX = e.pageX;
      const startY = e.pageY;
      
      const fontSize = getFontSize(outer)
      
      const startWidth = parseFloat(node.attrs.width.match(/(.+)em/)[1])
            
      const onMouseMove = (e) => {
        const currentX = e.pageX;
        const currentY = e.pageY;
        
        const diffInPx = currentX - startX
        const diffInEm = diffInPx / fontSize
                
        outer.style.width = `${startWidth + diffInEm}em`
      }
      
      const onMouseUp = (e) => {        
        e.preventDefault()
        
        document.removeEventListener("mousemove", onMouseMove)
        document.removeEventListener("mouseup", onMouseUp)
        let saveThisPos = getPos()   
        let transaction = view.state.tr.setNodeMarkup(getPos(), null, {src: node.attrs.src, width: outer.style.width} )
        let resolvedPos = transaction.doc.resolve(saveThisPos)
        let nodeSelection = new NodeSelection(resolvedPos)
        transaction = transaction.setSelection(nodeSelection);
        view.dispatch(transaction)
      }
      
      document.addEventListener("mousemove", onMouseMove)
      document.addEventListener("mouseup", onMouseUp)
    }
    
    outer.appendChild(handle)
    outer.appendChild(img)
        
    this.dom = outer
    this.img = img
    this.handle = handle
  }
  
  selectNode() {
    this.img.classList.add("ProseMirror-selectednode")
    
    this.handle.style.display = ""
  }

  deselectNode() {
    this.img.classList.remove("ProseMirror-selectednode")
    
    this.handle.style.display = "none"
  }
}

// ===============================================================

function makeImageMenuItem(options) {
  let command = (state, dispatch) => {
    const nodeName = state.selection && state.selection.node && state.selection.node.type.name;
    
    if (nodeName === "image" || nodeName === "resizableImage") {
      if (dispatch) {
        const nodeType = nodeName === "image" 
          ? mySchema.nodes.resizableImage
          : mySchema.nodes.image
        
        const tr = state.tr.replaceSelectionWith(nodeType.create({src: state.selection.node.attrs.src}))

        dispatch(tr)
      }
    
      return true
    }
    
    return false
  }
  
  let passedOptions = {
    run: command,
    enable(state, dispatch) { return command(state, dispatch) },
    active(state, dispatch) {
      const nodeName = state.selection && state.selection.node && state.selection.node.type.name;
      return nodeName === "resizableImage"
    }
  }
  
  for (let prop in options) passedOptions[prop] = options[prop]
  
  return new MenuItem(passedOptions)
}

// ===============================================================

const makeImage = makeImageMenuItem({ label: "resizable" });

const menu = buildMenuItems(mySchema)

menu.blockMenu[0].push(makeImage)

const plugins = exampleSetup({schema: mySchema, menuContent: menu.fullMenu})

const view = new EditorView(document.querySelector("#root"), {
  state: EditorState.create({
    schema:mySchema,
    plugins
  }),
  nodeViews: {
    resizableImage(node, view, getPos) { return new FootnoteView(node, view, getPos) }
  }
})

applyDevTools(view);



// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
