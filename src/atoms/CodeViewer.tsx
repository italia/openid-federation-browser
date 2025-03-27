import React, { useEffect } from "react";
import Prism from "prismjs";
import "prismjs/themes/prism-coy.css";
import "prismjs/components/prism-json";

export interface CodeViewerProps {
  code: string;
  language: string;
}

export const CodeViewer = ({ code, language }: CodeViewerProps) => {
  useEffect(() => {
    Prism.highlightAll();
  }, []);

  return (
    <div className="Code">
      <pre>
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  );
};
