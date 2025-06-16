// LexicalEditor.tsx
import React, { useEffect } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot, $createParagraphNode, $createTextNode } from "lexical";
import { EditorState } from 'lexical';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function LexicalEditor({ value, onChange }: Props) {
  const initialConfig = {
    namespace: 'EventEditor',
    theme: {
      // Optional theme
    },
    onError: (err: Error) => console.error(err),
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="border p-2 rounded min-h-[200px]">
        <RichTextPlugin
          contentEditable={
            <ContentEditable
              className="min-h-[150px] w-full outline-none p-2"
              style={{
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            />
          }
          placeholder={
            <div className="text-gray-400 p-2">
              Enter event description...
            </div>
          }
          ErrorBoundary={({ children }) => <>{children}</>}
        />
        <OnChangePlugin
          onChange={(editorState: EditorState) => {
            editorState.read(() => {
              const root = editorState._nodeMap.get('root');
              const text = root?.getTextContent() ?? '';
              onChange(text);
            });
          }}
        />
      </div>
    </LexicalComposer>
  );
}