import InputField from "components/fields/InputField";
import { FcGoogle } from "react-icons/fc";
import Checkbox from "components/checkbox";

export default function SignIn() {
  return (
    <div className="mt-16 mb-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
      {/* Sign in section */}
      <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
        <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
          Đăng Nhập
        </h4>
        <p className="mb-9 ml-1 text-base text-gray-600">
          Nhập email và mật khẩu để đăng nhập
        </p>
        {/* Email */}
        <InputField
          variant="auth"
          extra="mb-3"
          label="Email*"
          placeholder="mail@simmmple.com"
          id="email"
          type="text"
        />

        {/* Password */}
        <InputField
          variant="auth"
          extra="mb-3"
          label="Password*"
          placeholder="Min. 8 characters"
          id="password"
          type="password"
        />
        {/* Checkbox */}
        <div className="mb-4 flex items-center justify-between px-2">
          <div className="flex items-center">
            <Checkbox />
            <p className="ml-2 text-sm font-medium text-navy-700 dark:text-white">
              Ghi nhớ
            </p>
          </div>
          <a
            className="text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
            href=" "
          >
            Quên mật khẩu?
          </a>
        </div>
        <button className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200">
          Đăng nhập
        </button>
      </div>
    </div>
  );
}
