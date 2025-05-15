import React from 'react';
import { Typography, Card } from 'antd';

const { Title, Paragraph } = Typography;

const ProfilePage = () => {
  const user = JSON.parse(localStorage.getItem("user")) || {
    name: "Bilinmiyor",
    email: "Bilinmiyor"
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-yellow-100 to-pink-200">
      <Card className="max-w-md w-full shadow-xl rounded-2xl p-6">
        <Title level={3} className="text-center text-pink-600">Profil Bilgileri</Title>
        <Paragraph><b>İsim:</b> {user.name}</Paragraph>
        <Paragraph><b>E-posta:</b> {user.email || "hatice@example.com"}</Paragraph>
      </Card>
    </div>
  );
};

export default ProfilePage;
