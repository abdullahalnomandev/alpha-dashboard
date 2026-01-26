import { Form, Input, Modal, Upload } from "antd";
import { useEffect, useState, useRef } from "react";
import Editor from "react-simple-wysiwyg";
import { UploadOutlined } from "@ant-design/icons";
import { imageUrl } from "../../redux/api/baseApi";

// StoryModal: reused logic/structure from ExclusiveOfferModel but for stories
export const StoryModal: React.FC<{
  open: boolean;
  loading: boolean;
  editClub: {
    _id: string;
    name: string;
    image?: string | string[];
    description?: string;
  } | null;
  onClose: () => void;
  onAdd: (formData: FormData) => Promise<void>;
  onUpdate: (id: string, formData: FormData) => Promise<void>;
}> = ({ open, loading, editClub, onClose, onAdd, onUpdate }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);
  const [html, setHtml] = useState<string>("");
  const originalImagesRef = useRef<{ [uid: string]: string }>({});
  const [removedFiles, setRemovedFiles] = useState<string[]>([]);

  // Initialize fields and fileList
  useEffect(() => {
    if (editClub) {
      form.setFieldsValue({
        title: editClub.name,
      });
      setHtml(editClub.description || "");
      // Support multiple existing images properly
      const existingImages = editClub.image;
      let newFileList: any[] = [];
      let origImagesMap: { [uid: string]: string } = {};
      if (Array.isArray(existingImages)) {
        newFileList = existingImages.map((img: string, idx: number) => {
          const uid = String(-1 - idx);
          origImagesMap[uid] = img;
          return {
            uid,
            name: img.split("/").pop() || `image-${idx + 1}.png`,
            status: "done",
            url: img.startsWith("http") ? img : `${imageUrl}/${img.replace(/^\/+/, "")}`,
          };
        });
      } else if (typeof existingImages === "string") {
        const uid = "-1";
        origImagesMap[uid] = existingImages;
        newFileList = [
          {
            uid,
            name: existingImages.split("/").pop() || "image.png",
            status: "done",
            url: existingImages.startsWith("http")
              ? existingImages
              : `${imageUrl}/${existingImages.replace(/^\/+/, "")}`,
          },
        ];
      } else {
        newFileList = [];
      }
      setFileList(newFileList);
      originalImagesRef.current = origImagesMap;
      setRemovedFiles([]);
    } else {
      setFileList([]);
      form.resetFields();
      setHtml("");
      originalImagesRef.current = {};
      setRemovedFiles([]);
    }
    // eslint-disable-next-line
  }, [editClub, form]);

  const handleRemove = (file: any) => {
    // Track removal for original images only
    if (file.status === "done" && file.uid && originalImagesRef.current[file.uid]) {
      setRemovedFiles(prev => {
        if (prev.includes(originalImagesRef.current[file.uid])) return prev;
        return [...prev, originalImagesRef.current[file.uid]];
      });
    }
    return true;
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formData = new FormData();

      if (values.title) formData.append("title", values.title);

      if (html && html.trim()) {
        formData.append("description", html);
      } else {
        formData.append("description", "");
      }

      // Append all new files
      fileList.forEach(file => {
        if (file.originFileObj) {
          formData.append("image", file.originFileObj);
        }
      });
      // Add removed files info (for backend deletions)
      if (removedFiles.length > 0) {
        removedFiles.forEach(imgPath => {
          formData.append("removedFiles[]", imgPath);
        });
      }

      if (editClub) {
        await onUpdate(editClub._id, formData);
      } else {
        await onAdd(formData);
      }
      form.resetFields();
      setFileList([]);
      setHtml("");
      setRemovedFiles([]);
      originalImagesRef.current = {};
    } catch (e) {
      // Ignore validation error UI
    }
  };

  return (
    <Modal
      open={open}
      title={editClub ? "Edit Story" : "Add Story"}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={loading}
      okText={editClub ? "Update" : "Create"}
      width={600}
      destroyOnHidden
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: "Please enter story title" }]}
        >
          <Input placeholder="Story title" />
        </Form.Item>
        <Form.Item
          label="Description"
          required={false}
          style={{ marginBottom: 24 }}
        >
          <Editor
            value={html}
            onChange={e => setHtml(e.target.value)}
            aria-multiline
            style={{ minHeight: 150, height: 150 }}
            placeholder="Write story description"
          />
        </Form.Item>
        <Form.Item label="Image">
          <Upload.Dragger
            multiple
            beforeUpload={file => {
              const isJpgOrPng =
                file.type === "image/jpeg" ||
                file.type === "image/png" ||
                file.type === "image/jpg";
              if (!isJpgOrPng) {
                Modal.error({
                  title: "Invalid file type",
                  content: "Only .jpeg, .png, .jpg file supported",
                });
              }
              return false;
            }}
            accept=".jpeg,.jpg,.png"
            fileList={fileList}
            onChange={info => setFileList(info.fileList)}
            listType="picture"
            onRemove={handleRemove}
            style={{ width: "100%" }}
          >
            <div
              style={{
                width: "100%",
                minHeight: 150,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <UploadOutlined style={{ fontSize: 32, color: '#999' }} />
              <p style={{ margin: 8, fontWeight: 500 }}>
                Please upload image(s) <br />
                <span style={{ color: "#888", fontWeight: 400, fontSize: 13 }}>
                  Recommended size: <strong>390 x 220</strong>
                </span>
              </p>
            </div>
          </Upload.Dragger>
        </Form.Item>
      </Form>
    </Modal>
  );
};
