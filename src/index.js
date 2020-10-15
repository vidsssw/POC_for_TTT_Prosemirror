import applyDevTools from "prosemirror-dev-tools";
import * as serviceWorker from './serviceWorker';
import {addListNodes} from "prosemirror-schema-list"
const {Plugin} = require("prosemirror-state")
const {Decoration, DecorationSet} = require("prosemirror-view")

const {Schema,DOMParser} = require("prosemirror-model")
const {EditorState,NodeSelection} = require("prosemirror-state")
const {EditorView} = require("prosemirror-view")
const {schema,nodes} = require("prosemirror-schema-basic")
const {exampleSetup} = require("prosemirror-example-setup")

const resizableImage = {
  inline: true,
  attrs: {
    src: {},
    width: {default: "5em"},
    alt: {default: null},
    title: {default: null},
    alignment: { default: "center" }
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
        width: dom.getAttribute("width"),
        alignment: dom.getAttribute("class")==="center" ? "center" : (dom.getAttribute("class")==="right" ? "right" : "left"),
      }
    }
  }],
  // TODO if we don't define toDom, something weird happens: dragging the image will not move it but clone it. Why?
  toDOM(node) {
    const attrs = {style: `width: ${node.attrs.width}`}
    return ["div", { ...node.attrs, ...attrs }] 
  }
}

function getFontSize(element) {
  return parseFloat(getComputedStyle(element).fontSize);
}

class FootnoteView {
  constructor(node, view, getPos) {    
    const outer = document.createElement("div")
    outer.style.position = "relative"
    outer.style.width = node.attrs.width
    //outer.style.border = "1px solid blue"
    outer.style.display = "block"
    //outer.style.paddingRight = "0.25em"
    outer.style.lineHeight = "0"; // necessary so the bottom right arrow is aligned nicely
    outer.style.marginLeft='auto';
    outer.style.marginRight='auto';
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


let placeholderPlugin = new Plugin({
  state: {
    init() { return DecorationSet.empty },
    apply(tr, set) {
      // Adjust decoration positions to changes made by the transaction
      set = set.map(tr.mapping, tr.doc)
      // See if the transaction adds or removes any placeholders
      let action = tr.getMeta(this)
      console.log("act",action)
      if (action && action.add) {
        let widget = document.createElement("placeholder")
        let deco = Decoration.widget(action.add.pos, widget, {id: action.add.id})
        set = set.add(tr.doc, [deco])
      } else if (action && action.remove) {
        set = set.remove(set.find(null, null,
                                  spec => spec.id == action.remove.id))
      }
      return set
    }
  },
  props: {
    decorations(state) { return this.getState(state) }
  }
})

function findPlaceholder(state, id) {
  let decos = placeholderPlugin.getState(state)
  let found = decos.find(null, null, spec => spec.id == id)
  return found.length ? found[0].from : null
}


document.querySelector("#image-upload").addEventListener("change", e => {
  if (view.state.selection.$from.parent.inlineContent && e.target.files.length)
    startImageUpload(view, e.target.files[0])
  view.focus()
})

document.querySelector("#image-upload").addEventListener("click",e=>e.target.value='')

const mySchema = new Schema({
  nodes: { ...nodes, resizableImage },
  marks: schema.spec.marks
})

function startImageUpload(view, file) {
  // A fresh object to act as the ID for this upload
  let id = {}

  // Replace the selection with a placeholder
  let tr = view.state.tr
  
  if (!tr.selection.empty) tr.deleteSelection()
  tr.setMeta(placeholderPlugin, {add: {id, pos: tr.selection.from }})
  view.dispatch(tr)

  uploadFile(file).then(url => {
    let pos = findPlaceholder(view.state, id)
    // If the content around the placeholder has been deleted, drop
    // the image
    if (pos == null) return
    // Otherwise, insert it at the placeholder's position, and remove
    // the placeholder
    console.log(mySchema.nodes,"nodes")
    view.dispatch(view.state.tr
                  .replaceWith(pos, pos, mySchema.nodes.resizableImage.create({src: 'https://cdn.vox-cdn.com/thumbor/PSLYCBn2BjUj8Zdbf4BD6SMus-0=/0x0:1800x1179/920x613/filters:focal(676x269:964x557):format(webp)/cdn.vox-cdn.com/uploads/chorus_image/image/66741310/3zlqxf_copy.0.jpg'}))
                  .setMeta(placeholderPlugin, {remove: {id}}))
  }, () => {
    // On failure, just clean up the placeholder
    view.dispatch(tr.setMeta(placeholderPlugin, {remove: {id}}))
  })
}

// This is just a dummy that loads the file and creates a data URL.
// You could swap it out with a function that does an actual upload
// and returns a regular URL for the uploaded file.
function uploadFile(file) {
  let reader = new FileReader
  return new Promise((accept, fail) => {
    reader.onload = () => accept(reader.result)
    reader.onerror = () => fail(reader.error)
    // Some extra delay to make the asynchronicity visible
    setTimeout(() => reader.readAsDataURL(file), 1500)
  })
}



let view  = new EditorView(document.querySelector("#editor"), {
  state: EditorState.create({
    doc: DOMParser.fromSchema(mySchema).parse(document.querySelector("#content")),
    plugins: exampleSetup({schema:mySchema}).concat(placeholderPlugin)
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
