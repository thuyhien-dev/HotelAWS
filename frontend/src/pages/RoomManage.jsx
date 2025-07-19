import React, { useEffect, useState } from "react";
import axios from "axios";
import Toast from '../components/Layout/Toast';

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]); // state lưu loại phòng
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    floor: "",
    roomTypeId: "",
    status: "",
    img: null,
  });

  // Load phòng
  useEffect(() => {
    fetchRooms();
    fetchRoomTypes(); // load loại phòng
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/rooms");
      setRooms(res.data);
    } catch (error) {
      showToast("Lỗi khi tải phòng", "error");
    }
  };

  // Load loại phòng
  const fetchRoomTypes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/room-types");
      console.log(res.data)
      setRoomTypes(res.data);
    } catch (error) {
      console.error("Lỗi khi tải loại phòng:", error);
    }
  };

  const showToast = (msg, type) => {
    setToast({ message: msg, type });
  };
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, img: e.target.files[0] }));
  };

  const handleSave = async () => {
    try {
      const data = new FormData();
      data.append("floor", formData.floor);
      data.append("roomTypeId", formData.roomTypeId);
      data.append("status", formData.status);
      if (formData.img) data.append("img", formData.img);
      console.log("Sending data:", {
        floor: formData.floor,
        roomTypeId: formData.roomTypeId,
        status: formData.status,
        img: formData.img
      });

      if (editingRoom) {
        await axios.put(
          `http://localhost:5000/api/rooms/${editingRoom.roomId}`,
          data,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        showToast("Cập nhật phòng thành công!", "success");
      } else {
        await axios.post(
          "http://localhost:5000/api/rooms",
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
      await axios.delete(`http://localhost:5000/api/rooms/${id}`);
      showToast("Xoá phòng thành công!", "success");
      fetchRooms();
    } catch {
      showToast("Lỗi khi xoá phòng", "error");
    }
  };

  // Map trạng thái hiển thị
  const statusLabels = {
    occupied: "Đã đặt",
    available: "Còn trống",
  };

  return (
    <div className="container mt-4">
      <h3>Quản lý phòng</h3>
      <button className="btn btn-success mb-3" onClick={openModalForCreate}>
        Thêm phòng mới
      </button>

      <table className="table table-bordered">
        <thead className="thead-dark">
          <tr>
            <th>ID</th>
            <th>Tầng</th>
            <th>Ảnh</th>
            <th>Loại phòng</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room.roomId}>
              <td>{room.roomId}</td>
              <td>{room.floor}</td>
              <td>
                {room.img ? (
                  <img
                    src={room.img}
                    alt={`Room ${room.roomId}`}
                    style={{ width: 80, height: 60, objectFit: "cover" }}
                  />
                ) : (
                  "Chưa có ảnh"
                )}
              </td>
              <td>
                {
                  roomTypes.find(rt => rt.roomTypeId === Number(room.roomTypeId))?.name
                  || 'Không rõ'
                }
              </td>

              <td>{statusLabels[room.status] || room.status}</td>
              <td>
                <button
                  className="btn btn-primary btn-sm me-2"
                  onClick={() => openModalForEdit(room)}
                >
                  Sửa
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(room.roomId)}
                >
                  Xoá
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
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
                  {editingRoom ? "Sửa phòng" : "Thêm phòng mới"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Tầng</label>
                  <input
                    type="number"
                    className="form-control"
                    name="floor"
                    value={formData.floor}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Loại phòng</label>
                  <select
                    className="form-control"
                    name="roomTypeId"
                    value={formData.roomTypeId}
                    onChange={handleInputChange}
                  >
                    <option value="">-- Chọn loại phòng --</option>
                    {roomTypes.map((rt) => (
                      <option key={rt.roomTypeId} value={rt.roomTypeId}>
                        {rt.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Trạng thái</label>
                  <select
                    className="form-control"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="">-- Chọn trạng thái --</option>
                    <option value="available">Còn trống</option>
                    <option value="occupied">Đã đặt</option>
                  </select>
                </div>


                <div className="mb-3">
                  <label className="form-label">Ảnh phòng</label>
                  <input
                    type="file"
                    className="form-control"
                    name="img"
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeModal}>
                  Huỷ
                </button>
                <button className="btn btn-primary" onClick={handleSave}>
                  {editingRoom ? "Lưu thay đổi" : "Thêm"}
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
