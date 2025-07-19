import React, { useEffect, useState } from "react";
import axios from "axios";
import Toast from '../components/Layout/Toast';

export default function RoomType() {
  const [roomTypes, setRoomTypes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRoomType, setEditingRoomType] = useState(null);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    pricePerNight: "",
  });
  const showToast = (msg, type) => {
    setToast({ message: msg, type });
  };

  const closeToast = () => {
    setToast(null);
  };

  useEffect(() => {
    fetchRoomTypes();
  }, []);

  const fetchRoomTypes = async () => {
    const res = await axios.get("http://localhost:5000/api/room-types");
    setRoomTypes(res.data);
  };

  const openModalForCreate = () => {
    setEditingRoomType(null);
    setFormData({ name: "", description: "", pricePerNight: "" });
    setModalVisible(true);
  };

  const openModalForEdit = (roomType) => {
    setEditingRoomType(roomType);
    setFormData({
      name: roomType.name,
      description: roomType.description,
      pricePerNight: roomType.pricePerNight,
    });
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      if (editingRoomType) {
        await axios.put(
          `http://localhost:5000/api/room-types/${editingRoomType.roomTypeId}`,
          formData
        );
        showToast('Cập nhật loại phòng thành công!', 'success');
      } else {
        await axios.post("http://localhost:5000/api/room-types", formData);
        showToast('Thêm loại phòng thành công!', 'success');
      }
      closeModal();
      fetchRoomTypes();
    } catch (error) {
      console.error("Lỗi khi lưu loại phòng:", error);
      showToast('Lỗi khi lưu loại phòng', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa loại phòng này?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/room-types/${id}`);
      showToast('Xoá loại phòng thành công!', 'success');
      fetchRoomTypes();
    } catch {
      showToast('Lỗi khi xoá loại phòng', 'error');
    }
  };

  return (
    <div className="container mt-4">
      <h3>Quản lý loại phòng</h3>
      <button className="btn btn-success mb-3" onClick={openModalForCreate}>
        Thêm loại phòng mới
      </button>

      <table className="table table-bordered">
        <thead className="thead-dark">
          <tr>
            <th>ID</th>
            <th>Tên loại</th>
            <th>Mô tả</th>
            <th>Giá mỗi đêm</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {roomTypes.map((rt) => (
            <tr key={rt.roomTypeId}>
              <td>{rt.roomTypeId}</td>
              <td>{rt.name}</td>
              <td>{rt.description}</td>
              <td>{rt.pricePerNight}</td>
              <td>
                <button
                  className="btn btn-primary btn-sm me-2"
                  onClick={() => openModalForEdit(rt)}
                >
                  Sửa
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(rt.roomTypeId)}
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
                  {editingRoomType ? "Sửa loại phòng" : "Thêm loại phòng mới"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Tên loại phòng</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Mô tả</label>
                  <textarea
                    className="form-control"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Giá mỗi đêm</label>
                  <input
                    type="number"
                    className="form-control"
                    name="pricePerNight"
                    value={formData.pricePerNight}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeModal}>
                  Huỷ
                </button>
                <button className="btn btn-primary" onClick={handleSave}>
                  {editingRoomType ? "Lưu thay đổi" : "Thêm"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
