import React, { useEffect, useState } from "react";
import axios from "axios";
import Toast from './components/Toast';
import ComplexTable from './components/ComplexTable';
import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper();

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    phone: "",
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/customers");
      setCustomers(res.data);
    } catch (error) {
      showToast("Lỗi khi tải khách hàng", "error");
    }
  };

  const showToast = (msg, type) => setToast({ message: msg, type });
  const closeToast = () => setToast(null);

  const openModalForCreate = () => {
    setEditingCustomer(null);
    setFormData({ email: "", name: "", phone: "" });
    setModalVisible(true);
  };

  const openModalForEdit = (customer) => {
    setEditingCustomer(customer);
    setFormData({
      email: customer.email || "",
      name: customer.name || "",
      phone: customer.phone || "",
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
      // Basic validation email and phone (can extend)
      if (!formData.email || !formData.name) {
        showToast("Email và tên không được để trống", "error");
        return;
      }

      const payload = {
        email: formData.email,
        name: formData.name,
        phone: formData.phone,
      };

      if (editingCustomer) {
        await axios.put(`http://localhost:5000/api/customers/${editingCustomer.customerId}`, payload);
        showToast("Cập nhật khách hàng thành công!", "success");
      } else {
        await axios.post("http://localhost:5000/api/customers", payload);
        showToast("Thêm khách hàng thành công!", "success");
      }
      closeModal();
      fetchCustomers();
    } catch (error) {
      console.error("Lỗi khi lưu khách hàng:", error);
      showToast("Lỗi khi lưu khách hàng", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa khách hàng này?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/customers/${id}`);
      showToast("Xoá khách hàng thành công!", "success");
      fetchCustomers();
    } catch {
      showToast("Lỗi khi xoá khách hàng", "error");
    }
  };

  const columnsData = [
    columnHelper.accessor("customerId", {
      header: () => <span className="font-bold">ID</span>,
      cell: info => info.getValue(),
    }),
    
    columnHelper.accessor("email", {
      header: () => <span className="font-bold">Email</span>,
      cell: info => info.getValue(),
    }),
    columnHelper.accessor("name", {
      header: () => <span className="font-bold">Tên khách hàng</span>,
      cell: info => info.getValue(),
    }),
    columnHelper.accessor("phone", {
      header: () => <span className="font-bold">Số điện thoại</span>,
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
            onClick={() => handleDelete(row.original.customerId)}
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
        ➕ Thêm khách hàng mới
      </button>

      <ComplexTable
        title="Danh sách khách hàng"
        tableData={customers}
        columnsData={columnsData}
      />

      {/* Modal */}
      {modalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h5 className="text-xl font-semibold">
                {editingCustomer ? "Sửa khách hàng" : "Thêm khách hàng mới"}
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
                <label className="block text-sm font-medium mb-1">Tên khách hàng</label>
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
                <label className="block text-sm font-medium mb-1">Số điện thoại</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                {editingCustomer ? "Lưu thay đổi" : "Thêm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}
    </div>
  );
}
