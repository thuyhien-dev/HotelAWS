import React, { useEffect, useState } from "react";
import axios from "axios";
import Toast from '../components/Layout/Toast';

export default function AccountManagement() {
  const [accounts, setAccounts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    role: ""
  });

  const showToast = (msg, type) => {
    setToast({ message: msg, type });
  };

  const closeToast = () => {
    setToast(null);
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/accounts");
      setAccounts(res.data);
    } catch (err) {
      showToast("Lỗi khi tải danh sách tài khoản", "error");
    }
  };

  const openModalForCreate = () => {
    setEditingAccount(null);
    setFormData({
      email: "",
      name: "",
      password: "",
      role: ""
    });
    setModalVisible(true);
  };

  const openModalForEdit = (account) => {
    setEditingAccount(account);
    setFormData({
      email: account.email,
      name: account.name,
      password: "",
      role: account.role,
    });
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      if (!formData.email || !formData.name || (!editingAccount && !formData.password) || !formData.role) {
        showToast("Vui lòng nhập đầy đủ thông tin", "error");
        return;
      }

      const payload = {
        email: formData.email,
        name: formData.name,
        role: formData.role,
      };
      if (formData.password) payload.password = formData.password;

      if (editingAccount) {
        await axios.put(`http://localhost:5000/api/accounts/${editingAccount.accountId}`, payload);
        showToast("Cập nhật tài khoản thành công!", "success");
      } else {
        await axios.post("http://localhost:5000/api/accounts", payload);
        showToast("Thêm tài khoản thành công!", "success");
      }

      closeModal();
      fetchAccounts();
    } catch (error) {
      console.error(error);
      showToast("Lỗi khi lưu tài khoản", "error");
    }
  };

  const handleDelete = async (accountId) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa tài khoản này?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/accounts/${accountId}`);
      showToast("Xóa tài khoản thành công!", "success");
      fetchAccounts();
    } catch {
      showToast("Lỗi khi xóa tài khoản", "error");
    }
  };

  return (
    <div className="container mt-4">
      <h3>Quản lý tài khoản</h3>
      <button className="btn btn-success mb-3" onClick={openModalForCreate}>
        Thêm tài khoản mới
      </button>

      <table className="table table-bordered">
        <thead className="thead-dark">
          <tr>
            <th>Account ID</th>
            <th>Email</th>
            <th>Tên</th>
            <th>Role</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((acc) => (
            <tr key={acc.accountId}>
              <td>{acc.accountId}</td>
              <td>{acc.email}</td>
              <td>{acc.name}</td>
              <td>
                {acc.role === "admin" ? "Quản trị viên" :
                  acc.role === "employee" ? "Nhân viên" : acc.role}
              </td>

              <td>
                <button
                  className="btn btn-primary btn-sm me-2"
                  onClick={() => openModalForEdit(acc)}
                >
                  Sửa
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(acc.accountId)}
                >
                  Xoá
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalVisible && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingAccount ? "Sửa tài khoản" : "Thêm tài khoản mới"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body">
                {editingAccount && (
                  <div className="mb-3">
                    <label className="form-label">Account ID</label>
                    <input
                      type="number"
                      className="form-control"
                      value={editingAccount.accountId}
                      disabled
                    />
                  </div>
                )}

                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Tên</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Mật khẩu {editingAccount && "(Để trống nếu không đổi)"}
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Quyền</label>
                  <select
                    className="form-control"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                  >
                    <option value="">-- Chọn vai trò --</option>
                    <option value="admin">Quản trị viên</option>
                    <option value="employee">Nhân viên</option>
                  </select>
                </div>

              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeModal}>
                  Huỷ
                </button>
                <button className="btn btn-primary" onClick={handleSave}>
                  {editingAccount ? "Lưu thay đổi" : "Thêm"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={closeToast} />
      )}
    </div>
  );
}
