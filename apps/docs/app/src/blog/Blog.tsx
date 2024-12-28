// "use client";
// import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
// import { LexicalComposer } from "@lexical/react/LexicalComposer";
// import { ContentEditable } from "@lexical/react/LexicalContentEditable";
// import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
// import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
// import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
// import {
//   $isTextNode,
//   DOMConversionMap,
//   DOMExportOutput,
//   DOMExportOutputMap,
//   Klass,
//   LexicalEditor,
//   LexicalNode,
//   ParagraphNode,
//   TextNode,
// } from "lexical";

// import ExampleTheme from "../ExampleTheme";
// import ToolbarPlugin from "../plugins/ToolbarPlugin";
// import { Tooltip } from "antd";

// const placeholder = "Enter some rich text...";

// const editorConfig = {
//   nodes: [ParagraphNode, TextNode],
//   onError(error: Error) {
//     throw error;
//   },
//   theme: ExampleTheme,
// };

// export default function Editor() {
//   return (
//     <LexicalComposer initialConfig={editorConfig}>
//       <div className="editor-container">
//         <ToolbarPlugin />
//         <div className="editor-inner">
//           <Tooltip title="yyyy">
//             <RichTextPlugin
//               contentEditable={
//                 <ContentEditable
//                   className="editor-input"
//                   aria-placeholder={placeholder}
//                   placeholder={
//                     <div className="editor-placeholder">{placeholder}</div>
//                   }
//                 />
//               }
//               ErrorBoundary={LexicalErrorBoundary}
//             />
//           </Tooltip>
//           <HistoryPlugin />
//           <AutoFocusPlugin />
//           {/* <TreeViewPlugin /> */}
//         </div>
//       </div>
//     </LexicalComposer>
//   );
// }
