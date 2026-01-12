import { Button, Form, Input, Modal, Upload, Row, Col } from "antd";
import { useEffect, useState } from "react";
import Editor from "react-simple-wysiwyg";
import { UploadOutlined } from "@ant-design/icons";
import { imageUrl } from "../../redux/api/baseApi";

export const SponsorModel: React.FC<{
  open: boolean;
  loading: boolean;
  editSponsor: {
    _id: string;
    logo?: string; // keep logo
    title: string;
    location?: string;
    description?: string;
    image?: string; // keep image
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
  } | null;
  onClose: () => void;
  onAdd: (formData: FormData) => Promise<void>;
  onUpdate: (id: string, formData: FormData) => Promise<void>;
}> = ({ open, loading, editSponsor, onClose, onAdd, onUpdate }) => {
  const [form] = Form.useForm();
  const [imageFileList, setImageFileList] = useState<any[]>([]);
  const [logoFileList, setLogoFileList] = useState<any[]>([]);
  const [html, setHtml] = useState<string>("");

  // Populate form fields on edit
  useEffect(() => {
    if (editSponsor) {
      form.setFieldsValue({
        title: editSponsor.title || "",
        location: editSponsor.location || "",
      });
      setHtml(editSponsor.description || "");
      setImageFileList([]);
      setLogoFileList([]);
    } else {
      setImageFileList([]);
      setLogoFileList([]);
      form.resetFields();
      setHtml("");
    }
    // eslint-disable-next-line
  }, [editSponsor, form]);

  // If editSponsor changes and it has a logo/image, set files for display
  useEffect(() => {
    if (editSponsor) {
      // For logo
      if (editSponsor.logo) {
        setLogoFileList([
          {
            uid: "logo-1",
            name: editSponsor.logo.split("/").pop() || "logo.png",
            status: "done",
            url: editSponsor.logo.startsWith("http") ? editSponsor.logo : imageUrl + editSponsor.logo,
          },
        ]);
      }
      // For image
      if (editSponsor.image) {
        setImageFileList([
          {
            uid: "image-1",
            name: editSponsor.image.split("/").pop() || "image.png",
            status: "done",
            url: editSponsor.image.startsWith("http") ? editSponsor.image : imageUrl + editSponsor.image,
          },
        ]);
      }
    }
  }, [editSponsor]);

  const handleSubmit = async () => {
    const formData = new FormData();
    const values = form.getFieldsValue();

    // Add required fields
    if ("title" in values) {
      formData.append("title", values.title);
    }
    if ("location" in values) {
      formData.append("location", values.location);
    }

    if (html && html.trim()) {
      formData.append("description", html);
    } else {
      formData.append("description", "");
    }

    // Add files if new ones are selected, otherwise leave as is for PATCH
    if (imageFileList.length > 0 && imageFileList[0].originFileObj) {
      formData.append("image", imageFileList[0].originFileObj);
    }
    if (logoFileList.length > 0 && logoFileList[0].originFileObj) {
      formData.append("logo", logoFileList[0].originFileObj);
    }

    if (editSponsor) {
      await onUpdate(editSponsor._id, formData);
    } else {
      await onAdd(formData);
    }
    form.resetFields();
    setImageFileList([]);
    setLogoFileList([]);
    setHtml("");
  };

  const imageUploadProps = {
    beforeUpload: (file: any) => {
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
    },
    accept: ".jpeg,.jpg,.png",
    fileList: imageFileList,
    onChange: (info: any) => {
      setImageFileList(info.fileList.slice(-1));
    },
    listType: "picture" as const,
    maxCount: 1,
  };

  const logoUploadProps = {
    beforeUpload: (file: any) => {
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
    },
    accept: ".jpeg,.jpg,.png",
    fileList: logoFileList,
    onChange: (info: any) => {
      setLogoFileList(info.fileList.slice(-1));
    },
    listType: "picture" as const,
    maxCount: 1,
  };

  return (
    <Modal
      open={open}
      title={editSponsor ? "Edit Sponsor" : "Add Sponsor"}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={loading}
      okText={editSponsor ? "Update" : "Create"}
      width={600}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          title: editSponsor?.title || "",
          location: editSponsor?.location || "",
        }}
      >
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: "Please enter sponsor title" }]}
        >
          <Input placeholder="Sponsor Title" />
        </Form.Item>
        <Form.Item
          label="Location"
          name="location"
          rules={[{ required: true, message: "Please enter sponsor location" }]}
        >
          <Input placeholder="Location" />
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
            placeholder="Write sponsor description"
          />
        </Form.Item>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Logo">
              <Upload {...logoUploadProps}>
                <Button icon={<UploadOutlined />}>Select Logo</Button>
              </Upload>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Image">
              <Upload {...imageUploadProps}>
                <Button icon={<UploadOutlined />}>Select Image</Button>
              </Upload>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
