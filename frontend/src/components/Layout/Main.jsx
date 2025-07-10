import React from "react";

export default function Main({ children }) {
  return (
    <main className="app-main">
      <div className="app-content-header">
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-6"><h3 className="mb-0">Dashboard</h3></div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-end">
                <li className="breadcrumb-item"><a href="#">Home</a></li>
                <li className="breadcrumb-item active">Dashboard</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
      <div className="app-wrapper">
        <div className="container-fluid">
          {children}
        </div>
      </div>
    </main>
  );
}
