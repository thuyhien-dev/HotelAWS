import React, { useEffect, useState } from "react";
import axios from "axios";
import Toast from './components/Toast';
import ComplexTable from './components/ComplexTable';
import { createColumnHelper } from "@tanstack/react-table";
import basePath from "../../../utils/basePath"; 

const columnHelper = createColumnHelper();

export default function Services() {
  const [services, setServices] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    unit: "",
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await axios.get(`${basePath}/services`);
      setServices(res.data);
    } catch (error) {
      showToast("Lỗi khi tải dịch vụ", "error");
    }
  };

  const showToast = (msg, type) => setToast({ message: msg, type });
  const closeToast = () => setToast(null);

  const openModalForCreate = () => {
    setEditingService(null);
    setFormData({ name: "", price: "", unit: "" });
    setModalVisible(true);
  };

  const openModalForEdit = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name || "",
      price: service.price || "",
      unit: service.unit || "",
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
      // Validate price is number
      if (isNaN(Number(formData.price)) || Number(formData.price) < 0) {
        showToast("Giá phải là số hợp lệ", "error");
        return;
      }

      const payload = {
        name: formData.name,
        price: Number(formData.price),
        unit: formData.unit,
      };

      if (editingService) {
        await axios.put(`${basePath}/services/${editingService.serviceId}`, payload);
        showToast("Cập nhật dịch vụ thành công!", "success");
      } else {
        await axios.post(`${basePath}/services`, payload);
        showToast("Thêm dịch vụ thành công!", "success");
      }
      closeModal();
      fetchServices();
    } catch (error) {
      console.error("Lỗi khi lưu dịch vụ:", error);
      showToast("Lỗi khi lưu dịch vụ", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa dịch vụ này?")) return;
    try {
      await axios.delete(`${basePath}/services/${id}`);
      showToast("Xoá dịch vụ thành công!", "success");
      fetchServices();
    } catch {
      showToast("Lỗi khi xoá dịch vụ", "error");
    }
  };

  // Tạo columns cho ComplexTable
  const columnsData = [
    columnHelper.accessor("serviceId", {
      header: () => <span className="font-bold">ID</span>,
      cell: info => info.getValue(),
    }),
    columnHelper.accessor("name", {
      header: () => <span className="font-bold">Tên dịch vụ</span>,
      cell: info => info.getValue(),
    }),
    columnHelper.accessor("price", {
      header: () => <span className="font-bold">Giá</span>,
      cell: info => info.getValue().toLocaleString() + " VND",
    }),
    columnHelper.accessor("unit", {
      header: () => <span className="font-bold">Đơn vị</span>,
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
            onClick={() => handleDelete(row.original.serviceId)}
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
        ➕ Thêm dịch vụ mới
      </button>

      <ComplexTable
        title="Danh sách dịch vụ"
        tableData={services}
        columnsData={columnsData}
      />

      {/* Modal */}
      {modalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h5 className="text-xl font-semibold">
                {editingService ? "Sửa dịch vụ" : "Thêm dịch vụ mới"}
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
                <label className="block text-sm font-medium mb-1">Tên dịch vụ</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Giá</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Đơn vị</label>
                <input
                  type="text"
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ví dụ: cái, lượt, giờ..."
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
                {editingService ? "Lưu thay đổi" : "Thêm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}
    </div>
  );
}
