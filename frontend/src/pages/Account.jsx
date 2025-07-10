import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function Account() {
  const [profile, setProfile] = useState({ name: "", email: "" });
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:5000/api/auth/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setProfile(data.user);
      })
      .catch((err) => console.error(err));
  }, [token]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Cập nhật thành công");
      } else {
        toast.error(data.message || "Lỗi khi cập nhật");
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi cập nhật");
    }
  };

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (res.ok) {
        console.log("Đổi mật khẩu thành công, mật khẩu mới là:", newPassword);
        toast.success(data.message || "Đổi mật khẩu thành công");
        setOldPassword("");
        setNewPassword("");
      } else {
        console.log("Đổi mật khẩu thất bại:", data.message);
        toast.error(data.message || `Lỗi khi đổi mật khẩu: mã lỗi ${res.status}`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi đổi mật khẩu");
    }
  };



  return (
    <div className="container-fluid">
      <h2 className="mb-4">Thông tin tài khoản</h2>
      <form onSubmit={handleProfileUpdate} className="mb-5">
        <div className="mb-3">
          <label className="form-label">Tên</label>
          <input
            type="text"
            className="form-control"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email (readonly)</label>
          <input type="email" className="form-control" value={profile.email} readOnly />
        </div>
        <button type="submit" className="btn btn-primary">Cập nhật</button>
      </form>

      <h3>Đổi mật khẩu</h3>
      <form onSubmit={handleChangePassword}>
        <div className="mb-3">
          <label className="form-label">Mật khẩu cũ</label>
          <input
            type="password"
            className="form-control"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Mật khẩu mới</label>
          <input
            type="password"
            className="form-control"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-warning">Đổi mật khẩu</button>
      </form>

      <ToastContainer position="top-right" autoClose={false} hideProgressBar />

    </div>
  );
}
