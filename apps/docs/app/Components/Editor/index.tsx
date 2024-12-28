"use client";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { LocalStoragePlugin } from "../../src/plugins/LocalStorage";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import { LinkNode } from "@lexical/link";
import { CodeNode } from "@lexical/code";
import { TRANSFORMERS } from "@lexical/markdown";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { ActionsPlugin } from "../../src/plugins/Actions";
import { FloatingMenuPlugin } from "../../src/plugins/FloatingMenu";
import CustomOnChangePlugin from "../../src/plugins/CustomOnChangePlugin";

type LexicalEditorProps = {
  config: Parameters<typeof LexicalComposer>["0"]["initialConfig"];
  value: string;
  onChange: (value: string) => void;
};

export function LexicalEditor(props: LexicalEditorProps) {
  return (
    <LexicalComposer initialConfig={props.config}>
      <RichTextPlugin
        contentEditable={<ContentEditable />}
        placeholder={<Placeholder />}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <LocalStoragePlugin namespace={props.config.namespace} />
      <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
      <ActionsPlugin />
      <FloatingMenuPlugin />
      <CustomOnChangePlugin value={props.value} onChange={props.onChange} />
    </LexicalComposer>
  );
}

const Placeholder = () => {
  return (
    <div className="absolute top-[1.125rem] left-[1.125rem] opacity-50">
      Start writing...
    </div>
  );
};

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  name?: string;
}
export default function Editor({ value, onChange }: RichTextEditorProps) {
  const EDITOR_NAMESPACE = "lexical-editor";
  const EDITOR_NODES = [
    CodeNode,
    HeadingNode,
    LinkNode,
    ListNode,
    ListItemNode,
    QuoteNode,
  ];
  const content = localStorage.getItem(EDITOR_NAMESPACE);

  return (
    <div
      id="editor-wrapper"
      className={
        "relative prose prose-slate prose-p:my-0 prose-headings:mb-4 prose-headings:mt-2"
      }
    >
      <LexicalEditor
        config={{
          namespace: EDITOR_NAMESPACE,
          editorState: content,
          nodes: EDITOR_NODES,
          theme: {
            root: "p-4 border-slate-500 border-2 rounded h-full min-h-[200px] focus:outline-none focus-visible:border-black",
            link: "cursor-pointer",
            text: {
              bold: "font-semibold",
              underline: "underline",
              italic: "italic",
              strikethrough: "line-through",
              underlineStrikethrough: "underlined-line-through",
            },
          },
          onError: (error) => {
            console.log(error);
          },
        }}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
