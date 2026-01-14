import React, { useState } from "react";
import { Form, Input, Button, Typography, message, Divider } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { useForgetPasswordMutation } from "../../redux/apiSlices/authSlice";
import { useNavigate } from "react-router-dom";

const { Text, Title } = Typography;

const ForgetPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [forgetPassword] = useForgetPasswordMutation();
  const navigate = useNavigate();

  const onFinish = async (values: { email: string }) => {
    setLoading(true);

    try {
      const result = await forgetPassword({ email: values.email }).unwrap();

      form.resetFields();
      if (result) {
        navigate(`/reset-password?email=${encodeURIComponent(values.email)}`);
      }
    } catch (error: any) {
      message.error(
        error?.data?.message ||
        error?.message ||
        "Failed to send reset code. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: "#fff",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <div
        style={{
          width: 450,
          maxWidth: "97vw",
          boxShadow: "0 8px 32px 0 rgba(41,61,136,0.12), 0 1.5px 4px rgba(54,123,245,0.07)",
          borderRadius: 18,
          padding: "38px 36px 34px 36px",
          zIndex: 1,
          minHeight: 350,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          background: "#fff"
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: 18,
          }}
        >
          <img
            src="./src/assets/alpha_logo.svg"
            alt="Logo"
            style={{
              width: 54,
              height: 54,
              borderRadius: "100px",
              marginBottom: 8,
            }}
          />
          <Title
            level={3}
            style={{
              margin: 0,
              fontWeight: 700,
              fontSize: 27,
              letterSpacing: "0.01em",
              textAlign: "center",
              lineHeight: 1.19,
            }}
          >
            Forgot Password
          </Title>
          <Text
            style={{
              fontWeight: 500,
              fontSize: 15,
              marginTop: 4,
              textAlign: "center",
              display: "block",
              maxWidth: 360,
            }}
          >
            Enter your email address below and we'll send you a code to reset
            your password.
          </Text>
        </div>
        <Divider style={{ marginBottom: 24, marginTop: 0 }} />
        <Form
          form={form}
          name="forget-password"
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
          style={{ width: "100%" }}
          initialValues={{ email: "" }}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter your email address." },
              { type: "email", message: "This is not a valid email address." },
            ]}
          >
            <Input
              prefix={<MailOutlined style={{ marginRight: 5 }} />}
              placeholder="user@email.com"
              autoComplete="email"
              size="large"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
            >
              Send Code
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default ForgetPassword;
