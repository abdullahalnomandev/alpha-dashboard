import { useState, useRef, useMemo } from "react";
import JoditEditor from "jodit-react";

export default function About() {
  const editor = useRef(null);
  const [content, setContent] = useState(`
    <ul>
      <li>Track all your fitness goals</li>
      <li>Read motivational articles</li>
      <li>Share your journey with friends</li>
    </ul>
    <p><strong>Start typing your own story below!</strong></p>
  `);

  // Responsive logic for mobile
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 600;

  const editorHeight = isMobile ? 450 : 600; // mobile: more than 400, desktop: 700

  const config = useMemo(
    () => ({
      placeholder: "Start typing...",
      toolbarAdaptive: false,
      buttons: "paragraph,bold,italic,ul,ol,font,fontsize,align,table,brush",
      height: editorHeight,
    }),
    [editorHeight]
  );

  // Remove padding on mobile, keep on desktop
  const containerStyle = isMobile
    ? { margin: "0 auto", boxSizing: "border-box", padding: 0 }
    : { margin: "0 auto", boxSizing: "border-box", padding: 24 };

  return (
    <div style={{ ...containerStyle, boxSizing: "border-box" }}>
      <JoditEditor
        ref={editor}
        value={content}
        config={config}
        tabIndex={1}
        onBlur={newContent => setContent(newContent)}
        onChange={() => {}}
      />
    </div>
  );
}