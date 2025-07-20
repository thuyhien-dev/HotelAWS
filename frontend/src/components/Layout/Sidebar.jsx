import React from 'react';

function Sidebar() {
    return (
        <aside className="app-sidebar bg-body-secondary shadow" data-bs-theme="dark">
            <div className="sidebar-brand">
                <a href="/admin" className="brand-link">
                    <img src="/img/AdminLTELogo.png" alt="AdminLTE Logo" className="brand-image opacity-75 shadow" />
                    <span className="brand-text fw-light">AdminLTE 4</span>
                </a>
            </div>
            <div className="sidebar-wrapper">
                <nav className="mt-2">
                    <ul className="nav sidebar-menu flex-column" data-lte-toggle="treeview" role="navigation"
                        aria-label="Main navigation" data-accordion="false" id="navigation">

                        <li className="nav-item">
                            <a href="/admin" className="nav-link">
                                <i className="nav-icon bi bi-speedometer2"></i>
                                <p>Dashboard</p>
                            </a>
                        </li>

                        <li className="nav-item">
                            <a href="/admin/roomTypes" className="nav-link">
                                <i className="nav-icon bi bi-layout-text-window"></i>
                                <p>Quản lý loại phòng</p>
                            </a>
                        </li>

                        <li className="nav-item">
                            <a href="/admin/rooms" className="nav-link">
                                <i className="nav-icon bi bi-door-open"></i>
                                <p>Quản lý phòng</p>
                            </a>
                        </li>

                        <li className="nav-item">
                            <a href="/admin/bookings" className="nav-link">
                                <i className="nav-icon bi bi-calendar-check"></i>
                                <p>Quản lý đặt phòng</p>
                            </a>
                        </li>

                        <li className="nav-item">
                            <a href="/admin/invoices" className="nav-link">
                                <i className="nav-icon bi bi-file-earmark-text"></i>
                                <p>Quản lý hoá đơn</p>
                            </a>
                        </li>

                        <li className="nav-item">
                            <a href="/admin/accounts" className="nav-link">
                                <i className="nav-icon bi bi-person-badge"></i>
                                <p>Quản lý người dùng</p>
                            </a>
                        </li>

                        <li className="nav-item">
                            <a href="/admin/customers" className="nav-link">
                                <i className="nav-icon bi bi-person-lines-fill"></i>
                                <p>Quản lý khách hàng</p>
                            </a>
                        </li>

                        <li className="nav-item">
                            <a href="/admin/services" className="nav-link">
                                <i className="nav-icon bi bi-tools"></i>
                                <p>Quản lý dịch vụ</p>
                            </a>
                        </li>

                    </ul>
                </nav>
            </div>
        </aside>
    );
}

export default Sidebar;
