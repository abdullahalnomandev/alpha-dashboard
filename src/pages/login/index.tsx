import React from "react";
import { Form, Input, Button, Typography, message, Divider } from "antd";
import {
    EyeInvisibleOutlined,
    EyeOutlined,
    LockOutlined,
    MailOutlined,
    // UserOutlined, // not used
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { setToLocalStorage } from "../../services/auth.service";
import { useLoginMutation } from "../../redux/apiSlices/authSlice";

const { Text, Title } = Typography;

// Use default (light) background and theme
const beautifyBgGradient = "#f5f6fa"; // light neutral background
const loginBoxShadow =
  "0 8px 32px 0 rgba(41,61,136,0.12), 0 1.5px 4px rgba(54,123,245,0.07)";

// Main Page
const LoginPage: React.FC = () => {

  const [form] = Form.useForm();
  const [login, { isLoading: loading }] = useLoginMutation();

  const onFinish = async (values: { email: string; password: string }) => {
    try {
      // @ts-ignore
      const result = await login({ ...values }).unwrap ? await login({ ...values }).unwrap() : await login({ ...values });

      console.log(result)
      
      if (result?.data?.token) {
        message.success("Sign in successful!");
        setToLocalStorage(result?.data?.token);
      }
    } catch (err: any) {
      let errorObj = err;
      if (typeof err === "object" && err !== null) {
        if ((err as any).data) {
          errorObj = (err as any).data;
        }
      }
      if (errorObj?.errorMessages?.length) {
        message.error(errorObj.errorMessages[0].message);
      } else if (errorObj?.message) {
        message.error(errorObj.message);
      } else {
        message.error("Sign in failed. Please try again.");
      }
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: beautifyBgGradient,
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "inherit",
      }}
    >
      {/* No decorative dark shapes for a lighter feel */}
      <div
        style={{
          width: 450,
          maxWidth: "97vw",
          boxShadow: loginBoxShadow,
          background: "#fff",
          borderRadius: 18,
          padding: "38px 36px 34px 36px",
          border: "1px solid #f0f0f0",
          zIndex: 1,
          minHeight: 415,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backdropFilter: "none",
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
              border: "2.5px solid #a3e63522",
              boxShadow: "0 2px 10px #e7fee733",
              background: "#fff",
            }}
          />
          <Title
            level={3}
            style={{
              color: "#20405e",
              margin: 0,
              fontWeight: 700,
              fontSize: 27,
              letterSpacing: "0.01em",
              textAlign: "center",
              lineHeight: 1.19,
            }}
          >
            Welcome Back
          </Title>
          <Text
            style={{
              color: "#4b5563",
              fontWeight: 500,
              fontSize: 15,
              marginTop: 4,
            }}
          >
            Please sign in to your account
          </Text>
        </div>
        <Divider
          style={{ marginBottom: 24, marginTop: 0, borderColor: "#eee" }}
        />
        <Form
          form={form}
          name="login"
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
          style={{ width: "100%" }}
          initialValues={{ email: "", password: "" }}
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
              className="login-placeholder-gray"
            />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please enter your password." },
              { min: 6, message: "Password must be at least 6 characters." },
            ]}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined style={{ marginRight: 5 }} />}
              placeholder="Enter your password"
              autoComplete="current-password"
              className="login-placeholder-gray"
              style={{ color: "inherit", cursor: "pointer" }}
              iconRender={visible =>
                visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: 10,
            }}
          >
            <Link to="/forget-password">
              <Text
                style={{
                  color: "#2596be",
                }}
              >Forgot password?</Text>
            </Link>
          </div>
          <Form.Item>
            <Button
              style={{ color: "white" }}
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
            >
              Sign in
            </Button>
          </Form.Item>
        </Form>
        {/* Custom CSS to set placeholder color to gray */}
        <style>
          {`
          .login-placeholder-gray::placeholder {
            color: #a0aec0 !important;
            opacity: 1 !important;
          }
          /* For password input inside .ant-input-affix-wrapper */
          .login-placeholder-gray input::placeholder {
            color: #a0aec0 !important;
            opacity: 1 !important;
          }
          `}
        </style>
      </div>
    </div>
  );
};

export default LoginPage;
