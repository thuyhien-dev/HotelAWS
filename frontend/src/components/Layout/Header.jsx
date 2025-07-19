
function Header() {
  return (
    <nav className="app-header navbar navbar-expand bg-body">
      <div className="container-fluid">
        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <a className="nav-link" data-widget="navbar-search" href="#" role="button">
              <i className="bi bi-search"></i>
            </a>
          </li>
          <li className="nav-item dropdown">
            <a className="nav-link" data-bs-toggle="dropdown" href="#">
              <i className="bi bi-chat-text"></i>
              <span className="navbar-badge badge text-bg-danger">3</span>
            </a>
            <div className="dropdown-menu dropdown-menu-lg dropdown-menu-end">
              <div className="dropdown-divider"></div>
              <a href="#" className="dropdown-item">
                <div className="d-flex">
                  <div className="flex-shrink-0">
                    <img src="/img/user8-128x128.jpg" alt="User Avatar"
                      className="img-size-50 rounded-circle me-3" />
                  </div>
                  <div className="flex-grow-1">
                    <h3 className="dropdown-item-title">
                      John Pierce
                      <span className="float-end fs-7 text-secondary">
                        <i className="bi bi-star-fill"></i>
                      </span>
                    </h3>
                    <p className="fs-7">I got your message bro</p>
                    <p className="fs-7 text-secondary">
                      <i className="bi bi-clock-fill me-1"></i> 4 Hours Ago
                    </p>
                  </div>
                </div>
              </a>
              <div className="dropdown-divider"></div>
              <a href="#" className="dropdown-item dropdown-footer">See All Messages</a>
            </div>
          </li>
          <li className="nav-item dropdown user-menu">
            <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">
              <img src="/img/user2-160x160.jpg" className="user-image rounded-circle shadow" alt="User Image" />
              <span className="d-none d-md-inline">Quản trị viên</span>
            </a>
            <ul className="dropdown-menu dropdown-menu-lg dropdown-menu-end">
              <li className="user-header text-bg-primary">
                <img src="/img/user2-160x160.jpg" className="rounded-circle shadow" alt="User Image" />
                <p>
                  Admin
                  <small>Since 2025</small>
                </p>
              </li>
              <li className="user-footer">
                <a href="/account" className="btn btn-default btn-flat">Tài khoản</a>
                <a href="/logout" className="btn btn-default btn-flat float-end">Đăng xuất</a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Header;
