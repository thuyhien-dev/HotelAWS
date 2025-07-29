import React, { useEffect, useState } from "react";
import axios from "axios";
import Toast from './components/Toast';
import ComplexTable from './components/ComplexTable';
import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper();

export default function BookingManagement() {
  const [bookings, setBookings] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [toast, setToast] = useState(null);
  const [services, setServices] = useState([]);
  const [bookingDetails, setBookingDetails] = useState([]);
  const [selectedBookingForService, setSelectedBookingForService] = useState(null);
  const [serviceModalVisible, setServiceModalVisible] = useState(false);
  const [roomTypes, setRoomTypes] = useState([]);
  const [serviceForm, setServiceForm] = useState({ serviceId: "", quantity: 1 });

  const [invoiceModal, setInvoiceModal] = useState({
    visible: false,
    invoice: null,
  });



  const [formData, setFormData] = useState({
    checkInDate: "",
    checkOutDate: "",
    customerId: "",
    roomId: "",
    status: "",
  });

  useEffect(() => {
    fetchBookings();
    fetchCustomers();
    fetchRooms();
    fetchRoomTypes();
    fetchServices();
    const params = new URLSearchParams(window.location.search);
    const message = params.get('message');
    if (message) {
      setToast({ message, type: 'success' });
      params.delete('message');
      const newUrl = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
      window.history.replaceState({}, '', newUrl);
    }
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/bookings");
      const dataWithPaymentStatus = res.data.map(b => ({
        ...b,
        paymentStatus: b.paymentStatus || (Math.random() > 0.5 ? "Đang thanh toán" : "Đã hoàn thành")
      }));
      setBookings(dataWithPaymentStatus);
    } catch (error) {
      showToast("Lỗi khi tải danh sách đặt phòng", "error");
    }
  };

  const fetchRoomTypes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/room-types");
      setRoomTypes(res.data);
    } catch (error) {
      console.error(error)
      showToast("Lỗi khi tải loại phòng", "error");
    }
  };

  const handlePaymentClick = async (booking) => {
    try {
      if (booking.paymentStatus === "Hoàn thành") {
        const res = await axios.get(`http://localhost:5000/api/invoices`);
        const foundInvoice = res.data.find(inv => inv.bookingId === booking.bookingId);
        if (foundInvoice) {
          setInvoiceModal({ visible: true, invoice: foundInvoice });
          return;
        }
      }

      const checkIn = new Date(booking.checkInDate);
      const checkOut = new Date(booking.checkOutDate);
      const diffTime = checkOut - checkIn;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      const room = rooms.find(r => r.roomId === booking.roomId);
      if (!room) throw new Error("Không tìm thấy phòng");
      const roomType = roomTypes.find(rt => rt.roomTypeId === Number(room.roomTypeId));

      if (!roomType) throw new Error("Không tìm thấy loại phòng");

      const pricePerNight = roomType.pricePerNight || 0;

      const resDetails = await axios.get("http://localhost:5000/api/booking-details");
      const detailsForBooking = resDetails.data.filter(bd => bd.bookingId === booking.bookingId);

      let totalServiceAmount = 0;
      detailsForBooking.forEach(detail => {
        const service = services.find(s => s.serviceId === detail.serviceId);
        if (service) {
          totalServiceAmount += service.price * detail.quantity;
        }
      });

      const amount = diffDays * pricePerNight + totalServiceAmount;

      const response = await axios.post('http://localhost:5000/api/invoices/vnpay/create', {
        id: booking.bookingId,
        amount,
      });

      const { paymentUrl } = response.data;
      window.location.href = paymentUrl;

    } catch (error) {
      console.error("Lỗi khi xử lý thanh toán:", error);
      showToast("Không thể tạo thanh toán", "error");
    }
  };



  const fetchCustomers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/customers");
      setCustomers(res.data);
    } catch (error) {
      showToast("Lỗi khi tải danh sách khách hàng", "error");
    }
  };


  const fetchRooms = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/rooms");
      setRooms(res.data);
    } catch (error) {
      showToast("Lỗi khi tải danh sách phòng", "error");
    }
  };

  const showToast = (msg, type) => setToast({ message: msg, type });
  const closeToast = () => setToast(null);

  const openModalForCreate = () => {
    setEditingBooking(null);
    setFormData({
      checkInDate: "",
      checkOutDate: "",
      customerId: "",
      roomId: "",
      status: "",
    });
    setModalVisible(true);
  };

  const openModalForEdit = (booking) => {
    setEditingBooking(booking);
    setFormData({
      checkInDate: booking.checkInDate || "",
      checkOutDate: booking.checkOutDate || "",
      customerId: booking.customerId || "",
      roomId: booking.roomId || "",
      status: booking.status || "",
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
        checkInDate: formData.checkInDate,
        checkOutDate: formData.checkOutDate,
        customerId: Number(formData.customerId),
        roomId: Number(formData.roomId),
        status: "Đang đặt",
        paymentStatus: "Đang thanh toán"
      };

      if (editingBooking) {
        await axios.put(
          `http://localhost:5000/api/bookings/${editingBooking.bookingId}`,
          payload
        );
        showToast("Cập nhật đơn đặt phòng thành công!", "success");
      } else {
        await axios.post("http://localhost:5000/api/bookings", payload);
        showToast("Thêm đơn đặt phòng thành công!", "success");
      }
      closeModal();
      fetchBookings();
    } catch (error) {
      console.error("Lỗi khi lưu đơn đặt phòng:", error);
      showToast("Lỗi khi lưu đơn đặt phòng", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa đơn đặt phòng này?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/bookings/${id}`);
      showToast("Xoá đơn đặt phòng thành công!", "success");
      fetchBookings();
    } catch {
      showToast("Lỗi khi xoá đơn đặt phòng", "error");
    }
  };
  const openServiceModal = (booking) => {
    setSelectedBookingForService(booking);
    fetchBookingDetails(booking.bookingId);
    setServiceModalVisible(true);
  };


  const fetchBookingDetails = async (bookingId) => {
    try {
      const res = await axios.get("http://localhost:5000/api/booking-details");
      setBookingDetails(res.data.filter(bd => bd.bookingId === bookingId));
    } catch (error) {
      showToast("Lỗi khi tải dịch vụ đặt phòng", "error");
    }
  };

  const fetchServices = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/services");
      setServices(res.data);
    } catch (error) {
      showToast("Lỗi khi tải danh sách dịch vụ", "error");
    }
  };

  const addServiceToBooking = async () => {
    if (!serviceForm.serviceId || !serviceForm.quantity) return;

    try {
      await axios.post("http://localhost:5000/api/booking-details", {
        bookingId: selectedBookingForService.bookingId,
        serviceId: Number(serviceForm.serviceId),
        quantity: Number(serviceForm.quantity),
      });
      showToast("Thêm dịch vụ thành công", "success");
      fetchBookingDetails(selectedBookingForService.bookingId);
      setServiceForm({ serviceId: "", quantity: 1 });
    } catch (err) {
      showToast("Thêm dịch vụ thất bại", "error");
    }
  };

  const deleteService = async (bookingId, serviceId) => {
    try {
      await axios.delete(`http://localhost:5000/api/booking-details`, {
        params: { bookingId, serviceId },
      });
      showToast("Xoá dịch vụ thành công", "success");
      fetchBookingDetails(bookingId);
    } catch (error) {
      console.error("Lỗi khi xoá dịch vụ:", error);
      showToast("Xoá dịch vụ thất bại", "error");
    }
  };

  const columnsData = [
    columnHelper.accessor("bookingId", {
      header: () => <span className="font-bold">Booking ID</span>,
      cell: info => info.getValue(),
    }),
    columnHelper.accessor("checkInDate", {
      header: () => <span className="font-bold">Ngày nhận phòng</span>,
      cell: info => info.getValue(),
    }),
    columnHelper.accessor("checkOutDate", {
      header: () => <span className="font-bold">Ngày trả phòng</span>,
      cell: info => info.getValue(),
    }),
    columnHelper.accessor("customerId", {
      header: () => <span className="font-bold">Khách hàng</span>,
      cell: info => {
        const cust = customers.find(c => c.customerId === info.getValue());
        return cust ? cust.name : info.getValue();
      },
    }),
    columnHelper.accessor("roomId", {
      header: () => <span className="font-bold">Phòng</span>,
      cell: info => {
        const room = rooms.find(r => r.roomId === info.getValue());
        return room ? room.roomId : info.getValue();
      },
    }),
    columnHelper.accessor("status", {
      header: () => <span className="font-bold">Trạng thái</span>,
      cell: info => {
        const status = info.getValue();
        let colorClass = "bg-gray-200 text-gray-800";
        if (status === "Đang đặt") colorClass = "bg-yellow-100 text-yellow-800";
        else if (status === "Hoàn thành") colorClass = "bg-green-100 text-green-800";
        else if (status === "Đã huỷ") colorClass = "bg-red-100 text-red-800";

        return (
          <span className={`px-2 py-1 rounded text-sm font-medium ${colorClass}`}>
            {status}
          </span>
        );
      },
    }),
    columnHelper.accessor("paymentStatus", {
      header: () => <span className="font-bold">Trạng thái thanh toán</span>,
      cell: info => {
        const booking = info.row.original;
        const status = info.getValue();
        let colorClass = "bg-gray-200 text-gray-800";
        if (status === "Đang thanh toán") colorClass = "bg-yellow-100 text-yellow-800";
        else if (status === "Hoàn thành") colorClass = "bg-green-100 text-green-800";

        return (
          <button
            className={`px-2 py-1 rounded text-sm font-medium ${colorClass} underline`}
            onClick={() => handlePaymentClick(booking)}
          >
            {status}
          </button>
        );
      },
    }),

    columnHelper.display({
      id: "actions",
      header: () => <span className="font-bold">Hành động</span>,
      cell: ({ row }) => {
        const booking = row.original;

        const handleChangeStatus = async (booking, newStatus) => {
          try {
            const updatePayload = {
              checkInDate: booking.checkInDate,
              checkOutDate: booking.checkOutDate,
              customerId: booking.customerId,
              roomId: booking.roomId,
              status: newStatus,
            };

            await axios.put(`http://localhost:5000/api/bookings/${booking.bookingId}`, updatePayload);

            if (newStatus === "Hoàn thành") {
              await axios.patch(`http://localhost:5000/api/rooms/${booking.roomId}/status`, {
                status: "available"
              });
            }

            showToast(`Cập nhật trạng thái thành "${newStatus}"`, "success");
            fetchBookings();
            fetchRooms();
          } catch (error) {
            console.error("Lỗi cập nhật trạng thái:", error);
            showToast("Cập nhật trạng thái thất bại", "error");
          }
        };

        return (
          <div className="flex flex-col gap-1">
            <div className="flex gap-2">
              <button
                className="px-3 py-1 rounded-md text-white bg-purple-500 hover:bg-purple-600 text-sm"
                onClick={() => openServiceModal(booking)}
              >
                Dịch vụ
              </button>
              <button
                className="px-3 py-1 rounded-md text-white bg-blue-500 hover:bg-blue-600 text-sm"
                onClick={() => openModalForEdit(booking)}
              >
                Sửa
              </button>
              <button
                className="px-3 py-1 rounded-md text-white bg-red-500 hover:bg-red-600 text-sm"
                onClick={() => handleDelete(booking.bookingId)}
              >
                Xoá
              </button>
            </div>

            {booking.status === "Đang đặt" && (
              <div className="flex gap-2 mt-1">
                <button
                  className="px-3 py-1 rounded-md text-white bg-green-500 hover:bg-green-600 text-sm"
                  onClick={() => handleChangeStatus(booking, "Hoàn thành")}
                >
                  ✅ Trả phòng
                </button>
                <button
                  className="px-3 py-1 rounded-md text-white bg-yellow-500 hover:bg-yellow-600 text-sm"
                  onClick={() => handleChangeStatus(booking, "Đã huỷ")}
                >
                  ❌ Huỷ
                </button>
              </div>
            )}
          </div>
        );
      },
    })
  ];

  return (
    <div className="container mt-4">
      <button
        className="mb-4 px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition"
        onClick={openModalForCreate}
      >
        ➕ Thêm đặt phòng mới
      </button>

      <ComplexTable
        title="Danh sách đặt phòng"
        tableData={bookings}
        columnsData={columnsData}
      />

      {/* Modal */}
      {modalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h5 className="text-xl font-semibold">
                {editingBooking ? "Sửa đặt phòng" : "Thêm đặt phòng mới"}
              </h5>
              <button
                className="text-gray-500 hover:text-red-500 transition"
                onClick={closeModal}
              >
                ✕
              </button>
            </div>

            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Ngày nhận phòng</label>
                <input
                  type="date"
                  name="checkInDate"
                  value={formData.checkInDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Ngày trả phòng</label>
                <input
                  type="date"
                  name="checkOutDate"
                  value={formData.checkOutDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Khách hàng</label>
                <select
                  name="customerId"
                  value={formData.customerId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Chọn khách hàng --</option>
                  {customers.map(c => (
                    <option key={c.customerId} value={c.customerId}>
                      {c.customerId} - {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Phòng</label>
                <select
                  name="roomId"
                  value={formData.roomId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Chọn phòng --</option>
                  {rooms
                    .filter(r => r.status === "available")
                    .map(r => (
                      <option key={r.roomId} value={r.roomId}>
                        {r.roomId}
                      </option>
                    ))}
                </select>
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
                {editingBooking ? "Lưu thay đổi" : "Thêm"}
              </button>
            </div>
          </div>
        </div>
      )}
      {serviceModalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-xl">
            <div className="px-6 py-4 border-b flex justify-between">
              <h5 className="text-xl font-semibold">Quản lý dịch vụ cho Booking #{selectedBookingForService.bookingId}</h5>
              <button onClick={() => setServiceModalVisible(false)}>✕</button>
            </div>

            <div className="px-6 py-4 space-y-4">
              <div className="flex gap-2">
                <select
                  name="serviceId"
                  value={serviceForm.serviceId}
                  onChange={(e) => setServiceForm({ ...serviceForm, serviceId: e.target.value })}
                  className="flex-1 border rounded px-2 py-1"
                >
                  <option value="">-- Chọn dịch vụ --</option>
                  {services.map(s => (
                    <option key={s.serviceId} value={s.serviceId}>{s.name}</option>
                  ))}
                </select>
                <input
                  type="number"
                  value={serviceForm.quantity}
                  min="1"
                  onChange={(e) => setServiceForm({ ...serviceForm, quantity: Number(e.target.value) })}
                  className="w-20 border rounded px-2 py-1"
                  placeholder="Số lượng"
                />
                {selectedBookingForService.status !== "Hoàn thành" && (
                  <button
                    className="bg-green-600 text-white px-4 py-1 rounded"
                    onClick={addServiceToBooking}
                  >
                    ➕ Thêm
                  </button>
                )}
              </div>

              <table className="w-full text-sm border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-2 py-1 border">Tên dịch vụ</th>
                    <th className="px-2 py-1 border">Số lượng</th>
                    <th className="px-2 py-1 border">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {bookingDetails.map(detail => {
                    const service = services.find(s => s.serviceId === detail.serviceId);
                    const price = service?.price || 0;
                    const lineTotal = price * detail.quantity;

                    return (
                      <tr key={detail.bookingDetailId}>
                        <td className="px-2 py-1 border">{service?.name || detail.serviceId}</td>
                        <td className="px-2 py-1 border text-center">{detail.quantity}</td>
                        <td className="px-2 py-1 border text-right">{price.toLocaleString()}₫</td>
                        <td className="px-2 py-1 border text-right font-semibold">{lineTotal.toLocaleString()}₫</td>
                        <td className="px-2 py-1 border text-center">
                          <button
                            className="bg-red-500 text-white px-2 py-1 rounded"
                            onClick={() => deleteService(detail.bookingId, detail.serviceId)}
                          >
                            ❌ Xoá
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-100 font-bold">
                    <td colSpan="3" className="px-2 py-2 text-right">Tổng tiền:</td>
                    <td className="px-2 py-2 text-right">
                      {bookingDetails.reduce((sum, detail) => {
                        const service = services.find(s => s.serviceId === detail.serviceId);
                        const price = service?.price || 0;
                        return sum + price * detail.quantity;
                      }, 0).toLocaleString()}₫
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}

      {invoiceModal.visible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h5 className="text-lg font-bold">Thông tin hoá đơn</h5>
              <button onClick={() => setInvoiceModal({ visible: false, invoice: null })}>✕</button>
            </div>
            <div className="px-6 py-4 space-y-2 text-sm">
              <p><strong>ID hoá đơn:</strong> {invoiceModal.invoice.invoiceId}</p>
              <p><strong>ID đơn đặt phòng:</strong> {invoiceModal.invoice.bookingId}</p>
              <p><strong>Ngày tạo:</strong> {new Date(invoiceModal.invoice.createdAt).toLocaleString()}</p>
              <p><strong>Tổng tiền:</strong> {invoiceModal.invoice.totalAmount.toLocaleString()}₫</p>
            </div>
            <div className="px-6 py-3 border-t text-right">
              <button
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                onClick={() => setInvoiceModal({ visible: false, invoice: null })}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}


      {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}
    </div>
  );
}
