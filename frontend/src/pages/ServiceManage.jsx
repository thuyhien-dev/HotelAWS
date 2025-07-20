import React, { useEffect, useState } from "react";
import axios from "axios";
import Toast from '../components/Layout/Toast';

export default function Service() {
  const [services, setServices] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    unit: "",
  });

  const showToast = (msg, type) => {
    setToast({ message: msg, type });
  };

  const closeToast = () => {
    setToast(null);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const res = await axios.get("http://localhost:5000/api/services");
    setServices(res.data);
  };

  const openModalForCreate = () => {
    setEditingService(null);
    setFormData({ name: "", price: "", unit: "" });
    setModalVisible(true);
  };

  const openModalForEdit = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      price: service.price,
      unit: service.unit,
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
      if (editingService) {
        await axios.put(
          `http://localhost:5000/api/services/${editingService.serviceId}`,
          formData
        );
        showToast("Cập nhật dịch vụ thành công!", "success");
      } else {
        await axios.post("http://localhost:5000/api/services", formData);
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
      await axios.delete(`http://localhost:5000/api/services/${id}`);
      showToast("Xoá dịch vụ thành công!", "success");
      fetchServices();
    } catch {
      showToast("Lỗi khi xoá dịch vụ", "error");
    }
  };

  return (
    <div className="container mt-4">
      <h3>Quản lý dịch vụ</h3>
      <button className="btn btn-success mb-3" onClick={openModalForCreate}>
        Thêm dịch vụ mới
      </button>

      <table className="table table-bordered">
        <thead className="thead-dark">
          <tr>
            <th>ID</th>
            <th>Tên dịch vụ</th>
            <th>Giá</th>
            <th>Đơn vị</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {services.map((svc) => (
            <tr key={svc.serviceId}>
              <td>{svc.serviceId}</td>
              <td>{svc.name}</td>
              <td>{svc.price}</td>
              <td>{svc.unit}</td>
              <td>
                <button
                  className="btn btn-primary btn-sm me-2"
                  onClick={() => openModalForEdit(svc)}
                >
                  Sửa
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(svc.serviceId)}
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
                  {editingService ? "Sửa dịch vụ" : "Thêm dịch vụ mới"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Tên dịch vụ</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Giá</label>
                  <input
                    type="number"
                    className="form-control"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Đơn vị</label>
                  <input
                    type="text"
                    className="form-control"
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeModal}>
                  Huỷ
                </button>
                <button className="btn btn-primary" onClick={handleSave}>
                  {editingService ? "Lưu thay đổi" : "Thêm"}
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
