import React, { useEffect, useState } from "react";
import axios from "axios";
import Toast from './components/Toast';
import ComplexTable from './components/ComplexTable';
import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper();

export default function RoomTypes() {
  const [roomTypes, setRoomTypes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRoomType, setEditingRoomType] = useState(null);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    pricePerNight: "",
  });

  useEffect(() => {
    fetchRoomTypes();
  }, []);

  const fetchRoomTypes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/room-types");
      setRoomTypes(res.data);
    } catch (error) {
      showToast("Lỗi khi tải loại phòng", "error");
    }
  };

  const showToast = (msg, type) => setToast({ message: msg, type });
  const closeToast = () => setToast(null);

  const openModalForCreate = () => {
    setEditingRoomType(null);
    setFormData({ name: "", description: "", pricePerNight: "" });
    setModalVisible(true);
  };

  const openModalForEdit = (roomType) => {
    setEditingRoomType(roomType);
    setFormData({
      name: roomType.name || "",
      description: roomType.description || "",
      pricePerNight: roomType.pricePerNight || "",
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
      const payload = {
        name: formData.name,
        description: formData.description,
        pricePerNight: Number(formData.pricePerNight),
      };

      if (editingRoomType) {
        await axios.put(
          `http://localhost:5000/api/room-types/${editingRoomType.roomTypeId}`,
          payload
        );
        showToast("Cập nhật loại phòng thành công!", "success");
      } else {
        await axios.post("http://localhost:5000/api/room-types", payload);
        showToast("Thêm loại phòng thành công!", "success");
      }
      closeModal();
      fetchRoomTypes();
    } catch (error) {
      console.error("Lỗi khi lưu loại phòng:", error);
      showToast("Lỗi khi lưu loại phòng", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa loại phòng này?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/room-types/${id}`);
      showToast("Xoá loại phòng thành công!", "success");
      fetchRoomTypes();
    } catch {
      showToast("Lỗi khi xoá loại phòng", "error");
    }
  };

  const columnsData = [
    columnHelper.accessor("roomTypeId", {
      header: () => <span className="font-bold">ID</span>,
      cell: info => info.getValue(),
    }),
    columnHelper.accessor("name", {
      header: () => <span className="font-bold">Tên loại phòng</span>,
      cell: info => info.getValue(),
    }),
    columnHelper.accessor("description", {
      header: () => <span className="font-bold">Mô tả</span>,
      cell: info => info.getValue(),
    }),
    columnHelper.accessor("pricePerNight", {
      header: () => <span className="font-bold">Giá mỗi đêm (VNĐ)</span>,
      cell: info => info.getValue().toLocaleString('vi-VN'),
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
            onClick={() => handleDelete(row.original.roomTypeId)}
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
        ➕ Thêm loại phòng mới
      </button>

      <ComplexTable
        title="Danh sách loại phòng"
        tableData={roomTypes}
        columnsData={columnsData}
      />

      {/* Modal */}
      {modalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h5 className="text-xl font-semibold">
                {editingRoomType ? "Sửa loại phòng" : "Thêm loại phòng mới"}
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
                <label className="block text-sm font-medium mb-1">Tên loại phòng</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Mô tả</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Giá mỗi đêm (VNĐ)</label>
                <input
                  type="number"
                  name="pricePerNight"
                  value={formData.pricePerNight}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min={0}
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
                {editingRoomType ? "Lưu thay đổi" : "Thêm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}
    </div>
  );
}
