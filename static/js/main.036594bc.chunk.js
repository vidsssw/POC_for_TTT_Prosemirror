(this.webpackJsonpprosemirror_poc=this.webpackJsonpprosemirror_poc||[]).push([[0],{201:function(e,t,n){"use strict";n.r(t);var r=n(74),o=n(75),i=n(23),a=n(82);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));n(9);var s=n(2).Plugin,c=n(22),l=c.Decoration,d=c.DecorationSet,u=n(1),m=u.Schema,p=u.DOMParser,h=n(2),g=h.EditorState,f=h.NodeSelection,v=n(22).EditorView,y=n(199),w=y.schema,b=y.nodes,S=n(200).exampleSetup,x={inline:!0,attrs:{src:{},width:{default:"5em"},alt:{default:null},title:{default:null},alignment:{default:"center"}},group:"inline",draggable:!0,parseDOM:[{priority:51,tag:"img[src][width]",getAttrs:function(e){return{src:e.getAttribute("src"),title:e.getAttribute("title"),alt:e.getAttribute("alt"),width:e.getAttribute("width"),alignment:"center"===e.getAttribute("class")?"center":"right"===e.getAttribute("class")?"right":"left"}}}],toDOM:function(e){var t={style:"width: ".concat(e.attrs.width)};return["div",Object(i.a)(Object(i.a)({},e.attrs),t)]}};var k=function(){function e(t,n,o){Object(r.a)(this,e);var i=document.createElement("div");i.style.position="relative",i.style.width=t.attrs.width,i.style.display="block",i.style.lineHeight="0",i.style.marginLeft="auto",i.style.marginRight="auto";var a=document.createElement("img");a.setAttribute("src",t.attrs.src),a.style.width="100%";var s=document.createElement("span");s.style.position="absolute",s.style.bottom="0px",s.style.right="0px",s.style.width="10px",s.style.height="10px",s.style.border="3px solid black",s.style.borderTop="none",s.style.borderLeft="none",s.style.display="none",s.style.cursor="nwse-resize",s.onmousedown=function(e){e.preventDefault();var r=e.pageX,a=(e.pageY,parseFloat(getComputedStyle(i).fontSize)),s=parseFloat(t.attrs.width.match(/(.+)em/)[1]),c=function(e){var t=e.pageX,n=(e.pageY,(t-r)/a);i.style.width="".concat(s+n,"em")};document.addEventListener("mousemove",c),document.addEventListener("mouseup",(function e(r){r.preventDefault(),document.removeEventListener("mousemove",c),document.removeEventListener("mouseup",e);var a=o(),s=n.state.tr.setNodeMarkup(o(),null,{src:t.attrs.src,width:i.style.width}),l=s.doc.resolve(a),d=new f(l);s=s.setSelection(d),n.dispatch(s)}))},i.appendChild(s),i.appendChild(a),this.dom=i,this.img=a,this.handle=s}return Object(o.a)(e,[{key:"selectNode",value:function(){this.img.classList.add("ProseMirror-selectednode"),this.handle.style.display=""}},{key:"deselectNode",value:function(){this.img.classList.remove("ProseMirror-selectednode"),this.handle.style.display="none"}}]),e}(),E=new s({state:{init:function(){return d.empty},apply:function(e,t){t=t.map(e.mapping,e.doc);var n=e.getMeta(this);if(console.log("act",n),n&&n.add){var r=document.createElement("placeholder"),o=l.widget(n.add.pos,r,{id:n.add.id});t=t.add(e.doc,[o])}else n&&n.remove&&(t=t.remove(t.find(null,null,(function(e){return e.id==n.remove.id}))));return t}},props:{decorations:function(e){return this.getState(e)}}});document.querySelector("#image-upload").addEventListener("change",(function(e){M.state.selection.$from.parent.inlineContent&&e.target.files.length&&function(e,t){var n={},r=e.state.tr;r.selection.empty||r.deleteSelection();r.setMeta(E,{add:{id:n,pos:r.selection.from}}),e.dispatch(r),function(e){var t=new FileReader;return new Promise((function(n,r){t.onload=function(){return n(t.result)},t.onerror=function(){return r(t.error)},setTimeout((function(){return t.readAsDataURL(e)}),1500)}))}(t).then((function(t){var r=function(e,t){var n=E.getState(e).find(null,null,(function(e){return e.id==t}));return n.length?n[0].from:null}(e.state,n);null!=r&&(console.log(L.nodes,"nodes"),e.dispatch(e.state.tr.replaceWith(r,r,L.nodes.resizableImage.create({src:"https://cdn.vox-cdn.com/thumbor/PSLYCBn2BjUj8Zdbf4BD6SMus-0=/0x0:1800x1179/920x613/filters:focal(676x269:964x557):format(webp)/cdn.vox-cdn.com/uploads/chorus_image/image/66741310/3zlqxf_copy.0.jpg"})).setMeta(E,{remove:{id:n}})))}),(function(){e.dispatch(r.setMeta(E,{remove:{id:n}}))}))}(M,e.target.files[0]),M.focus()})),document.querySelector("#image-upload").addEventListener("click",(function(e){return e.target.value=""}));var L=new m({nodes:Object(i.a)(Object(i.a)({},b),{},{resizableImage:x}),marks:w.spec.marks});var M=new v(document.querySelector("#editor"),{state:g.create({doc:p.fromSchema(L).parse(document.querySelector("#content")),plugins:S({schema:L}).concat(E)}),nodeViews:{resizableImage:function(e,t,n){return new k(e,t,n)}}});Object(a.a)(M),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))},83:function(e,t,n){e.exports=n(201)}},[[83,1,2]]]);
//# sourceMappingURL=main.036594bc.chunk.js.map