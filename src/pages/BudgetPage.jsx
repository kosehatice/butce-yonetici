import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Input, Table, DatePicker, Form, Typography, message, Card } from "antd";
import { useNavigate, Link } from "react-router-dom";
import dayjs from "dayjs";

const { Title } = Typography;

const apiUrl = "https://v1.nocodeapi.com/hk3525/google_sheets/fAxSQgGRxxBrYUSb?tabId=data";

const BudgetPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [filterDate, setFilterDate] = useState(null);
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(apiUrl);
      const rows = res.data.data.slice(1).map((row, index) => ({
        key: index,
        date: row[0],
        income: row[1],
        expense: row[2],
      }));
      setData(rows);
    } catch (err) {
      message.error("Veriler alınamadı.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = async (values) => {
    const newRow = [
      dayjs(values.date).format("YYYY-MM-DD"),
      values.income || "",
      values.expense || "",
      "hatice",
      "1234"
    ];

    try {
      await axios.post(apiUrl, { data: [newRow] });
      message.success("Kayıt eklendi.");
      form.resetFields();
      fetchData();
    } catch (err) {
      message.error("Kayıt eklenemedi.");
    }
  };

  const handleDelete = async (record) => {
    const rowIndex = data.findIndex(
      (item) => item.date === record.date && item.income === record.income && item.expense === record.expense
    );

    if (rowIndex !== -1) {
      try {
        await axios.delete(`${apiUrl}&row=${rowIndex + 2}`);
        message.success("Kayıt silindi.");
        fetchData();
      } catch (err) {
        message.error("Silme işlemi başarısız.");
      }
    }
  };

  const filteredData = filterDate
    ? data.filter((item) => item.date === dayjs(filterDate).format("YYYY-MM-DD"))
    : data;

  const columns = [
    { title: "Tarih", dataIndex: "date", key: "date" },
    {
      title: "Gelir", dataIndex: "income", key: "income",
      render: text => <span style={{ color: "#52c41a", fontWeight: 'bold' }}>{text}</span>
    },
    {
      title: "Gider", dataIndex: "expense", key: "expense",
      render: text => <span style={{ color: "#f5222d", fontWeight: 'bold' }}>{text}</span>
    },
    {
      title: "İşlem",
      render: (_, record) => (
        <Button danger type="primary" onClick={() => handleDelete(record)} style={{ backgroundColor: '#ff4d4f', borderColor: '#ff4d4f' }}>
          Sil
        </Button>
      ),
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #6e8efb, #a777e3)",
      padding: "40px",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <Card
        style={{
          maxWidth: 900,
          margin: "0 auto",
          borderRadius: 15,
          boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
          backgroundColor: "rgba(255,255,255,0.9)"
        }}
      >
        {/* Üst menü: başlık + çıkış + profil */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <Title level={2} style={{ color: "#722ed1" }}>Bütçe Yönetimi</Title>
          <div style={{ display: "flex", gap: "8px" }}>
            <Button type="default">
              <Link to="/profile">Profil Sayfasına Git</Link>
            </Button>
            <Button
              onClick={handleLogout}
              type="primary"
              danger
              style={{
                backgroundColor: "#ff4d4f",
                borderColor: "#ff4d4f",
                fontWeight: "bold",
                boxShadow: "0 4px 8px rgba(255,77,79,0.5)"
              }}
            >
              Çıkış Yap
            </Button>
          </div>
        </div>

        {/* Ekleme Formu */}
        <Form
          layout="inline"
          onFinish={handleAdd}
          form={form}
          style={{ marginBottom: 24, justifyContent: 'center' }}
        >
          <Form.Item name="date" rules={[{ required: true, message: "Tarih girin" }]}>
            <DatePicker style={{ width: 150 }} />
          </Form.Item>
          <Form.Item name="income">
            <Input placeholder="Gelir" style={{ width: 120 }} />
          </Form.Item>
          <Form.Item name="expense">
            <Input placeholder="Gider" style={{ width: 120 }} />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                backgroundColor: "#722ed1",
                borderColor: "#722ed1",
                fontWeight: "bold",
                boxShadow: "0 4px 8px rgba(114,46,209,0.4)"
              }}
            >
              Ekle
            </Button>
          </Form.Item>
        </Form>

        {/* Tarih Filtreleme */}
        <div style={{ marginBottom: 20, textAlign: 'center' }}>
          <DatePicker
            onChange={(date) => setFilterDate(date)}
            placeholder="Tarihe göre filtrele"
            style={{ width: 200, marginRight: 8 }}
          />
          <Button
            onClick={() => setFilterDate(null)}
            style={{
              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
              borderRadius: 4,
              border: "1px solid #d9d9d9",
            }}
          >
            Filtreyi Temizle
          </Button>
        </div>

        {/* Tablo */}
        <Table
          dataSource={filteredData}
          columns={columns}
          loading={loading}
          pagination={{ pageSize: 5 }}
          bordered={false}
          rowClassName={(record, index) =>
            index % 2 === 0 ? "table-row-light" : "table-row-dark"
          }
          style={{
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
          }}
        />
      </Card>

      <style>{`
        .table-row-light {
          background-color: #fafafa;
        }
        .table-row-dark {
          background-color: #f5f5f5;
        }
        .ant-table-thead > tr > th {
          background-color: #722ed1;
          color: white;
          font-weight: 600;
        }
        .ant-table-tbody > tr:hover > td {
          background-color: #d6bcfa !important;
          transition: background-color 0.3s ease;
          cursor: pointer;
        }
        .ant-btn-danger:hover, .ant-btn-danger:focus {
          background-color: #a8071a !important;
          border-color: #a8071a !important;
          box-shadow: 0 0 10px #a8071a !important;
        }
        .ant-btn-primary:hover, .ant-btn-primary:focus {
          box-shadow: 0 0 8px #722ed1 !important;
        }
      `}</style>
    </div>
  );
};

export default BudgetPage;
