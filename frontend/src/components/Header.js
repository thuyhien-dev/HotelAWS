import React from 'react';

function Header() {
  return (
    <nav className="app-header navbar navbar-expand bg-body">
      <div className="container-fluid">
        <ul className="navbar-nav">
          <li className="nav-item">
            <a className="nav-link" data-lte-toggle="sidebar" href="#" role="button">
              <i className="bi bi-list"></i>
            </a>
          </li>
        </ul>
        <ul className="navbar-nav ms-auto">
          <li className="nav-item dropdown user-menu">
            <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">
              <img
                src="/assets/img/user2-160x160.jpg"
                className="user-image rounded-circle shadow"
                alt="User"
              />
              <span className="d-none d-md-inline">Alexander Pierce</span>
            </a>
            {/* Dropdown Menu */}
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Header;
