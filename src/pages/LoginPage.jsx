import React, { useState } from "react";
import { Button, Form, Input, Typography, Card, message } from "antd";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (values) => {
    const { name, password } = values;

    // Örnek kullanıcı bilgileri
    if (name === "hatice" && password === "1234") {
      localStorage.setItem("user", JSON.stringify({ name }));
      navigate("/budget");
    } else {
      message.error("Geçersiz kullanıcı adı veya şifre.");
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-pink-100 to-purple-200">
      <Card className="w-full max-w-md shadow-2xl rounded-2xl p-6">
        <Title level={3} className="text-center text-pink-600">
          Giriş Yap
        </Title>
        <Form layout="vertical" onFinish={handleLogin}>
          <Form.Item
            label="Kullanıcı Adı"
            name="name"
            rules={[{ required: true, message: "Lütfen adınızı girin!" }]}
          >
            <Input placeholder="Kullanıcı adı" />
          </Form.Item>

          <Form.Item
            label="Şifre"
            name="password"
            rules={[{ required: true, message: "Lütfen şifrenizi girin!" }]}
          >
            <Input.Password placeholder="Şifre" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Giriş Yap
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center mt-4 text-sm text-gray-600">
          <p>Ad: <strong>hatice</strong> | Şifre: <strong>1234</strong></p>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
