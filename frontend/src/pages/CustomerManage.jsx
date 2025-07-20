import React, { useEffect, useState } from "react";
import axios from "axios";
import Toast from '../components/Layout/Toast';

export default function Customer() {
  const [customers, setCustomers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    phone: "",
  });

  const showToast = (msg, type) => {
    setToast({ message: msg, type });
  };

  const closeToast = () => setToast(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/customers");
      setCustomers(res.data);
    } catch (err) {
      showToast("Lỗi khi lấy danh sách khách hàng", "error");
    }
  };

  const openModalForCreate = () => {
    setEditingCustomer(null);
    setFormData({ email: "", name: "", phone: "" });
    setModalVisible(true);
  };

  const openModalForEdit = (customer) => {
    setEditingCustomer(customer);
    setFormData({
      email: customer.email,
      name: customer.name,
      phone: customer.phone,
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
      if (editingCustomer) {
        await axios.put(`http://localhost:5000/api/customers/${editingCustomer.customerId}`, formData);
        showToast("Cập nhật khách hàng thành công!", "success");
      } else {
        await axios.post("http://localhost:5000/api/customers", formData);
        showToast("Thêm khách hàng thành công!", "success");
      }
      closeModal();
      fetchCustomers();
    } catch (error) {
      showToast("Lỗi khi lưu khách hàng", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xoá khách hàng này?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/customers/${id}`);
      showToast("Xoá khách hàng thành công!", "success");
      fetchCustomers();
    } catch {
      showToast("Lỗi khi xoá khách hàng", "error");
    }
  };

  return (
    <div className="container mt-4">
      <h3>Quản lý khách hàng</h3>
      <button className="btn btn-success mb-3" onClick={openModalForCreate}>
        Thêm khách hàng mới
      </button>

      <table className="table table-bordered">
        <thead className="thead-dark">
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Tên</th>
            <th>Điện thoại</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((cus) => (
            <tr key={cus.customerId}>
              <td>{cus.customerId}</td>
              <td>{cus.email}</td>
              <td>{cus.name}</td>
              <td>{cus.phone}</td>
              <td>
                <button
                  className="btn btn-primary btn-sm me-2"
                  onClick={() => openModalForEdit(cus)}
                >
                  Sửa
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(cus.customerId)}
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
                  {editingCustomer ? "Sửa khách hàng" : "Thêm khách hàng mới"}
                </h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
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
                  <label className="form-label">Tên khách hàng</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Số điện thoại</label>
                  <input
                    type="text"
                    className="form-control"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeModal}>
                  Huỷ
                </button>
                <button className="btn btn-primary" onClick={handleSave}>
                  {editingCustomer ? "Lưu thay đổi" : "Thêm"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}
    </div>
  );
}
