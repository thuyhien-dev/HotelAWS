import React, { useEffect, useState } from "react";
import axios from "axios";
import Toast from './components/Toast';
import ComplexTable from './components/ComplexTable';
import { createColumnHelper } from "@tanstack/react-table";
import basePath from "../../../utils/basePath"; 

const columnHelper = createColumnHelper();

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    floor: "",
    roomTypeId: "",
    status: "",
    img: null,
  });

  useEffect(() => {
    fetchRooms();
    fetchRoomTypes();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await axios.get(`${basePath}/rooms`);
      setRooms(res.data);
    } catch (error) {
      showToast("Lỗi khi tải phòng", "error");
    }
  };

  const fetchRoomTypes = async () => {
    try {
      const res = await axios.get(`${basePath}/room-types`);
      setRoomTypes(res.data);
    } catch (error) {
      console.error("Lỗi khi tải loại phòng:", error);
    }
  };

  const showToast = (msg, type) => setToast({ message: msg, type });
  const closeToast = () => setToast(null);

  const openModalForCreate = () => {
    setEditingRoom(null);
    setFormData({ floor: "", roomTypeId: "", status: "", img: null });
    setModalVisible(true);
  };

  const openModalForEdit = (room) => {
    setEditingRoom(room);
    setFormData({
      floor: room.floor || "",
      roomTypeId: room.roomTypeId || "",
      status: room.status || "",
      img: null,
    });
    setModalVisible(true);
  };

  const closeModal = () => setModalVisible(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, img: e.target.files[0] }));
  };

  const handleSave = async () => {
    try {
      const data = new FormData();
      data.append("floor", formData.floor);
      data.append("roomTypeId", formData.roomTypeId);
      data.append("status", formData.status);
      if (formData.img) data.append("img", formData.img);

      if (editingRoom) {
        await axios.put(
          `${basePath}/rooms/${editingRoom.roomId}`,
          data,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        showToast("Cập nhật phòng thành công!", "success");
      } else {
        await axios.post(
          `${basePath}/rooms`,
          data,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        showToast("Thêm phòng thành công!", "success");
      }
      closeModal();
      fetchRooms();
    } catch (error) {
      console.error("Lỗi khi lưu phòng:", error);
      showToast("Lỗi khi lưu phòng", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa phòng này?")) return;
    try {
      await axios.delete(`${basePath}/rooms/${id}`);
      showToast("Xoá phòng thành công!", "success");
      fetchRooms();
    } catch {
      showToast("Lỗi khi xoá phòng", "error");
    }
  };

  const statusLabels = {
    occupied: "Đã đặt",
    available: "Còn trống",
  };

  const columnsData = [
    columnHelper.accessor("roomId", {
      header: () => <span className="font-bold">ID</span>,
      cell: info => info.getValue(),
    }),
    columnHelper.accessor("floor", {
      header: () => <span className="font-bold">Tầng</span>,
      cell: info => info.getValue(),
    }),
    columnHelper.accessor("img", {
      header: () => <span className="font-bold">Ảnh</span>,
      cell: info =>
        info.getValue() ? (
          <img
            src={info.getValue()}
            alt={`Room ${info.row.original.roomId}`}
            style={{ width: 80, height: 60, objectFit: "cover" }}
          />
        ) : (
          "Chưa có ảnh"
        ),
    }),
    columnHelper.accessor("roomTypeId", {
      header: () => <span className="font-bold">Loại phòng</span>,
      cell: info => {
        const rt = roomTypes.find(rt => rt.roomTypeId === Number(info.getValue()));
        return rt ? rt.name : "Không rõ";
      },
    }),
    columnHelper.accessor("status", {
      header: () => <span className="font-bold">Trạng thái</span>,
      cell: info => statusLabels[info.getValue()] || info.getValue(),
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
            onClick={() => handleDelete(row.original.roomId)}
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
        ➕ Thêm phòng mới
      </button>

      <ComplexTable
        title="Danh sách phòng"
        tableData={rooms}
        columnsData={columnsData}
      />

      {/* Modal */}
      {modalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h5 className="text-xl font-semibold">
                {editingRoom ? "Sửa phòng" : "Thêm phòng mới"}
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
                <label className="block text-sm font-medium mb-1">Tầng</label>
                <input
                  type="number"
                  name="floor"
                  value={formData.floor}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Loại phòng</label>
                <select
                  name="roomTypeId"
                  value={formData.roomTypeId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Chọn loại phòng --</option>
                  {roomTypes.map(rt => (
                    <option key={rt.roomTypeId} value={rt.roomTypeId}>
                      {rt.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Trạng thái</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Chọn trạng thái --</option>
                  <option value="available">Còn trống</option>
                  <option value="occupied">Đã đặt</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Ảnh phòng</label>
                <input
                  type="file"
                  name="img"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="w-full"
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
                {editingRoom ? "Lưu thay đổi" : "Thêm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}
    </div>
  );
}
