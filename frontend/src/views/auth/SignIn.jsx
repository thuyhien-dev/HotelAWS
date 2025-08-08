import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "components/fields/InputField";
import Checkbox from "components/checkbox";
import Toast from "views/admin/Toast";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toast, setToast] = useState({
    message: "",
    type: "info",
    visible: false,
  });

  const showToast = (message, type = "info", duration = 3000) => {
    setToast({ message, type, visible: true });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, duration);
  };

  const navigate = useNavigate();

  const handleLogin = async () => {
    console.log("Bắt đầu login");

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          showToast(data.message || "Email hoặc mật khẩu không đúng!", "error");
        } else {
          showToast(data.message || "Đăng nhập thất bại!", "error");
        }
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("userEmail", email);


      showToast("Đăng nhập thành công!", "success");

      navigate("/admin/default");

    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      showToast("Có lỗi xảy ra. Vui lòng thử lại sau!", "error");
    }

  };


  return (
    <div className="mt-16 mb-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
      <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
        <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
          Đăng Nhập
        </h4>
        <p className="mb-9 ml-1 text-base text-gray-600">
          Nhập email và mật khẩu để đăng nhập
        </p>

        <InputField
          variant="auth"
          extra="mb-3"
          label="Email*"
          placeholder="test@gmail.com"
          id="email"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <InputField
          variant="auth"
          extra="mb-3"
          label="Password*"
          placeholder="Tối thiểu 8 ký tự"
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="mb-4 flex items-center justify-between px-2">
          <div className="flex items-center">
            <Checkbox />
            <p className="ml-2 text-sm font-medium text-navy-700 dark:text-white">
              Ghi nhớ
            </p>
          </div>
          <a
            className="text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
            href="#"
          >
            Quên mật khẩu?
          </a>
        </div>

        <button
          type="button"
          className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
          onClick={() => {
            console.log("handleLogin được gọi");
            handleLogin();
          }}

        >
          Đăng nhập
        </button>


      </div>
      {toast.visible && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast((prev) => ({ ...prev, visible: false }))}
        />
      )}
    </div>
  );
}
