import React, { useEffect, useState } from "react";
import axios from "axios";
import Toast from './components/Toast';
import ComplexTable from './components/ComplexTable';
import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper();

export default function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    role: "",
  });

  useEffect(() => {
    fetchAccounts();
  }, []);

  const validatePassword = (password) => {
    const lengthCheck = password.length >= 8;
    const uppercaseCheck = /[A-Z]/.test(password);
    const lowercaseCheck = /[a-z]/.test(password);
    const numberCheck = /[0-9]/.test(password);
    const specialCharCheck = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return lengthCheck && uppercaseCheck && lowercaseCheck && numberCheck && specialCharCheck;
  };


  const fetchAccounts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/accounts");
      setAccounts(res.data);
    } catch (error) {
      showToast("Lỗi khi tải tài khoản", "error");
    }
  };

  const showToast = (msg, type) => setToast({ message: msg, type });
  const closeToast = () => setToast(null);

  const openModalForCreate = () => {
    setEditingAccount(null);
    setFormData({ email: "", name: "", password: "", role: "" });
    setModalVisible(true);
  };

  const openModalForEdit = (account) => {
    setEditingAccount(account);
    setFormData({
      email: account.email || "",
      name: account.name || "",
      password: "", // không hiển thị password cũ
      role: account.role || "",
    });
    setModalVisible(true);
  };

  const closeModal = () => setModalVisible(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      if (!formData.email || !formData.name || !formData.role) {
        showToast("Email, tên và vai trò không được để trống", "error");
        return;
      }

      if (!editingAccount) {
        if (!formData.password) {
          showToast("Mật khẩu không được để trống khi tạo tài khoản mới", "error");
          return;
        }
        if (!validatePassword(formData.password)) {
          showToast("Mật khẩu phải ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt", "error");
          return;
        }
      } else {
        if (formData.password && !validatePassword(formData.password)) {
          showToast("Mật khẩu phải ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt", "error");
          return;
        }
      }

      const payload = {
        email: formData.email,
        name: formData.name,
        role: formData.role,
      };

      if (formData.password) {
        payload.password = formData.password;
      }

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
      console.error("Lỗi khi lưu tài khoản:", error);
      showToast("Lỗi khi lưu tài khoản", "error");
    }
  };

  // tets

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa tài khoản này?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/accounts/${id}`);
      showToast("Xoá tài khoản thành công!", "success");
      fetchAccounts();
    } catch {
      showToast("Lỗi khi xoá tài khoản", "error");
    }
  };

  const columnsData = [
    columnHelper.accessor("accountId", {
      header: () => <span className="font-bold">ID</span>,
      cell: info => info.getValue(),
    }),
    columnHelper.accessor("email", {
      header: () => <span className="font-bold">Email</span>,
      cell: info => info.getValue(),
    }),
    columnHelper.accessor("name", {
      header: () => <span className="font-bold">Tên</span>,
      cell: info => info.getValue(),
    }),
    columnHelper.accessor("role", {
      header: () => <span className="font-bold">Vai trò</span>,
      cell: info => info.getValue(),
    }),
    columnHelper.display({
      id: "actions",
      header: () => <span className="font-bold">Hành động</span>,
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            className="px-3 py-1 rounded-md text-white bg-blue-500 hover:bg-blue-600 text-sm"
            onClick={() => openModalForEdit(row.original)}
          >
            Sửa
          </button>
          <button
            className="px-3 py-1 rounded-md text-white bg-red-500 hover:bg-red-600 text-sm"
            onClick={() => handleDelete(row.original.accountId)}
          >
            Xoá
          </button>
        </div>
      ),
    }),
  ];

  return (
    <div className="container mt-4">
      <button
        className="mb-4 px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition"
        onClick={openModalForCreate}
      >
        ➕ Thêm tài khoản mới
      </button>

      <ComplexTable
        title="Danh sách tài khoản"
        tableData={accounts}
        columnsData={columnsData}
      />

      {/* Modal */}
      {modalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h5 className="text-xl font-semibold">
                {editingAccount ? "Sửa tài khoản" : "Thêm tài khoản mới"}
              </h5>
              <button
                className="text-gray-500 hover:text-red-500 transition"
                onClick={closeModal}
              >
                ✕
              </button>
            </div>

            <div className="px-6 py-4">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Tên</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Mật khẩu {editingAccount ? "(để trống nếu không đổi)" : ""}
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  {...(!editingAccount && { required: true })}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Vai trò</label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  placeholder="Ví dụ: admin, user..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 px-6 py-4 border-t">
              <button
                className="px-4 py-2 rounded-md bg-gray-300 text-gray-700 hover:bg-gray-400 transition"
                onClick={closeModal}
              >
                Huỷ
              </button>
              <button
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
                onClick={handleSave}
              >
                {editingAccount ? "Lưu thay đổi" : "Thêm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}
    </div>
  );
}
