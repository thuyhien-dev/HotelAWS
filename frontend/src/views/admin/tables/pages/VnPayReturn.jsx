import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function VnPayReturn() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleVnPayReturn = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const query = Object.fromEntries(params.entries());

        const res = await axios.get(`http://localhost:5000/api/invoices/vnpay/return`, {
          params: query,
        });

        if (res.status === 200 || res.status === 302) {
          navigate("/admin/booking");
        } else {
          alert("Thanh toán không hợp lệ hoặc thất bại.");
        }
      } catch (error) {
        console.error("Lỗi xác thực VNPAY:", error);
        alert("Có lỗi xảy ra trong quá trình xử lý thanh toán.");
      }
    };

    handleVnPayReturn();
  }, [navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-lg">Đang xử lý thanh toán, vui lòng chờ...</p>
    </div>
  );
}
