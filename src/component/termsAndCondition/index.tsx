import { useRef, useMemo, useState } from "react";
import JoditEditor from "jodit-react";
import {
  useGetTermsOfServicesQuery,
  usePostTermsOfServicesMutation,
} from "../../redux/apiSlices/settingSlice";
import { Button, message } from "antd";

export default function TermsAndCondition() {
  const editor = useRef(null);

  const { data } = useGetTermsOfServicesQuery(null);
  const [postTermsOfServices, { isLoading: isSaving }] = usePostTermsOfServicesMutation();
  const [isDisable, setIsDisable] = useState(true);

  const description = data?.data?.description || "";

  const isMobile = typeof window !== "undefined" && window.innerWidth <= 600;
  const editorHeight = isMobile ? 450 : 600;

  const config = useMemo(
    () => ({
      placeholder: description ? "Start typing your about content..." : "",
      toolbarAdaptive: false,
      buttons: "paragraph,bold,italic,ul,ol,font,fontsize,lineHeight,align,table,brush",
      height: editorHeight,
    }),
    [editorHeight, description]
  );

  const editorContentRef = useRef(description);

  const handleEditorChange = (newContent: string) => {
    editorContentRef.current = newContent;
    setIsDisable(false);
  };

  const handleSave = async () => {
    try {
      await postTermsOfServices({ description: editorContentRef.current || "" }).unwrap();
      setIsDisable(true);
      message.success("Terms & Conditions section saved successfully!");
    } catch (err) {
      message.error("Failed to save. Please try again.");
    }
  };

  return (
    <div
      style={{
        margin: "0 auto",
        boxSizing: "border-box",
        padding: isMobile ? 0 : 24,
        minHeight: editorHeight,
      }}
    >
      <JoditEditor
        ref={editor}
        value={editorContentRef.current || description}
        config={config}
        tabIndex={1}
        onChange={handleEditorChange}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: 24,
        }}
      >
        <Button
          type="primary"
          size="large"
          style={{ borderRadius: 8, minWidth: 120 }}
          loading={isSaving}
          disabled={isDisable ? true : false}
          onClick={handleSave}
        >
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
}
