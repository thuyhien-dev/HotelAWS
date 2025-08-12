import React, { useEffect, useState } from "react";
import basePath from "../../../utils/basePath"; 

const ProfileOverview = () => {
  const [profile, setProfile] = useState({
    email: "",
    name: "",
  });
  const [loading, setLoading] = useState(true);
  const [profileMsg, setProfileMsg] = useState(null);

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [passwordMsg, setPasswordMsg] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const email = localStorage.getItem("userEmail");
        if (!email) throw new Error("Không có email người dùng");

        const res = await fetch(`${basePath}/auth/profile?email=${encodeURIComponent(email)}`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!res.ok) throw new Error("Không lấy được thông tin user");
        const data = await res.json();

        setProfile({ email: data.user.email, name: data.user.name || "" });
      } catch (error) {
        console.error(error);
        setProfileMsg("Lỗi khi tải thông tin người dùng");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);


  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileMsg(null);

    try {
      const res = await fetch(`${basePath}/auth/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(profile),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Cập nhật thất bại");
      setProfileMsg(data.message);
    } catch (error) {
      setProfileMsg(error.message);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (!passwordData.oldPassword || !passwordData.newPassword) {
      setPasswordMsg("Vui lòng điền đầy đủ thông tin mật khẩu");
      return;
    }

    try {
      const email = localStorage.getItem("userEmail");
      if (!email) {
        setPasswordMsg("Bạn chưa đăng nhập hoặc không có email");
        return;
      }

      const payload = {
        email,
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      };

      const res = await fetch(`${basePath}/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Đổi mật khẩu thất bại");
      setPasswordMsg(data.message);

      setPasswordData({ oldPassword: "", newPassword: "" });
    } catch (error) {
      setPasswordMsg(error.message);
    }
  };


  if (loading) return <div>Đang tải thông tin...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Cập nhật thông tin cá nhân</h2>

      <form onSubmit={handleProfileUpdate} className="mb-8">
        <div className="mb-4">
          <label className="block mb-1 font-medium" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={profile.email}
            disabled
            className="w-full border border-gray-300 rounded p-2 bg-gray-100 cursor-not-allowed"
          />
          <small className="text-gray-500">Email không thể thay đổi</small>
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium" htmlFor="name">
            Họ và tên
          </label>
          <input
            type="text"
            id="name"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            className="w-full border border-gray-300 rounded p-2"
            required
          />
        </div>

        {profileMsg && (
          <p className="mb-4 text-sm text-green-600">{profileMsg}</p>
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Cập nhật thông tin
        </button>
      </form>

      <hr className="mb-8" />

      <h2 className="text-2xl font-bold mb-4">Đổi mật khẩu</h2>
      <form onSubmit={handleChangePassword}>
        <div className="mb-4">
          <label className="block mb-1 font-medium" htmlFor="oldPassword">
            Mật khẩu cũ
          </label>
          <input
            type="password"
            id="oldPassword"
            value={passwordData.oldPassword}
            onChange={(e) =>
              setPasswordData({ ...passwordData, oldPassword: e.target.value })
            }
            className="w-full border border-gray-300 rounded p-2"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium" htmlFor="newPassword">
            Mật khẩu mới
          </label>
          <input
            type="password"
            id="newPassword"
            value={passwordData.newPassword}
            onChange={(e) =>
              setPasswordData({ ...passwordData, newPassword: e.target.value })
            }
            className="w-full border border-gray-300 rounded p-2"
            required
          />
        </div>

        {passwordMsg && (
          <p className={`mb-4 text-sm ${passwordMsg.includes("thành công") ? "text-green-600" : "text-red-600"}`}>
            {passwordMsg}
          </p>
        )}

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Đổi mật khẩu
        </button>
      </form>
    </div>
  );
};

export default ProfileOverview;
