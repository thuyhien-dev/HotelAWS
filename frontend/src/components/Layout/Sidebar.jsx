import React from 'react';

function Sidebar() {
    return (
        <aside className="app-sidebar bg-body-secondary shadow" data-bs-theme="dark">
            <div className="sidebar-brand">
                <a href="./index.html" className="brand-link">
                    <img src="/img/AdminLTELogo.png" alt="AdminLTE Logo" className="brand-image opacity-75 shadow" />
                    <span className="brand-text fw-light">AdminLTE 4</span>
                </a>
            </div>
            <div className="sidebar-wrapper">
                <nav className="mt-2">
                    <ul className="nav sidebar-menu flex-column" data-lte-toggle="treeview" role="navigation"
                        aria-label="Main navigation" data-accordion="false" id="navigation">
                        <li className="nav-item menu-open">
                            <a href="#" className="nav-link active">
                                <i className="nav-icon bi bi-speedometer"></i>
                                <p>
                                    Dashboard
                                    <i className="nav-arrow bi bi-chevron-right"></i>
                                </p>
                            </a>
                            <ul className="nav nav-treeview">
                                <li className="nav-item">
                                    <a href="./index.html" className="nav-link active">
                                        <i className="nav-icon bi bi-circle"></i>
                                        <p>Dashboard v1</p>
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a href="./index2.html" className="nav-link">
                                        <i className="nav-icon bi bi-circle"></i>
                                        <p>Dashboard v2</p>
                                    </a>
                                </li>
                            </ul>
                        </li>
                        <li className="nav-item">
                            <a href="./generate/theme.html" className="nav-link">
                                <i className="nav-icon bi bi-palette"></i>
                                <p>Theme Generate</p>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a href="#" className="nav-link">
                                <i className="nav-icon bi bi-box-seam-fill"></i>
                                <p>
                                    Widgets
                                    <i className="nav-arrow bi bi-chevron-right"></i>
                                </p>
                            </a>
                            <ul className="nav nav-treeview">
                                <li className="nav-item">
                                    <a href="./widgets/small-box.html" className="nav-link">
                                        <i className="nav-icon bi bi-circle"></i>
                                        <p>Small Box</p>
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a href="./widgets/info-box.html" className="nav-link">
                                        <i className="nav-icon bi bi-circle"></i>
                                        <p>info Box</p>
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a href="./widgets/cards.html" className="nav-link">
                                        <i className="nav-icon bi bi-circle"></i>
                                        <p>Cards</p>
                                    </a>
                                </li>
                            </ul>
                        </li>
                        <li className="nav-item">
                            <a href="#" className="nav-link">
                                <i className="nav-icon bi bi-clipboard-fill"></i>
                                <p>
                                    Layout Options
                                    <span className="nav-badge badge text-bg-secondary me-3">6</span>
                                    <i className="nav-arrow bi bi-chevron-right"></i>
                                </p>
                            </a>
                            <ul className="nav nav-treeview">
                                <li className="nav-item">
                                    <a href="./layout/unfixed-sidebar.html" className="nav-link">
                                        <i className="nav-icon bi bi-circle"></i>
                                        <p>Default Sidebar</p>
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a href="./layout/fixed-sidebar.html" className="nav-link">
                                        <i className="nav-icon bi bi-circle"></i>
                                        <p>Fixed Sidebar</p>
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a href="./layout/fixed-header.html" className="nav-link">
                                        <i className="nav-icon bi bi-circle"></i>
                                        <p>Fixed Header</p>
                                    </a>
                                </li>
                            </ul>
                        </li>
                        <li className="nav-item">
                            <a href="#" className="nav-link">
                                <i className="nav-icon bi bi-pencil-square"></i>
                                <p>
                                    Forms
                                    <i className="nav-arrow bi bi-chevron-right"></i>
                                </p>
                            </a>
                            <ul className="nav nav-treeview">
                                <li className="nav-item">
                                    <a href="./forms/general.html" className="nav-link">
                                        <i className="nav-icon bi bi-circle"></i>
                                        <p>General Elements</p>
                                    </a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </nav>
            </div>
        </aside>
    );
}

export default Sidebar;
