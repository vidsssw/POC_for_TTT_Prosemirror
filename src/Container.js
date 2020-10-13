import "./editor.css";
 
import React,{useRef} from 'react';
import {schema} from 'prosemirror-schema-basic';
import {useProseMirror, ProseMirror} from 'use-prosemirror';
import {Schema, DOMParser} from "prosemirror-model"
import {addListNodes} from "prosemirror-schema-list"
import {exampleSetup} from "prosemirror-example-setup"

function Container() {
  const mySchema = new Schema({
    nodes: addListNodes(schema.spec.nodes, "paragraph block*", "block"),
    marks: schema.spec.marks
  })
  const [state, setState] = useProseMirror({schema:mySchema,plugins:exampleSetup({schema: mySchema})});
  const viewRef = useRef();
  console.log("state",state)
  return (<div id="editor" >
  <ProseMirror   ref={viewRef} state={state} onChange={setState} />
  </div>)
 
};

export default Container;