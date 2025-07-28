import React from "react";

import {
  MdDashboard,
  MdPeople,
  MdCategory,
  MdMeetingRoom,
  MdRoomService,
  MdPerson,
  MdLock,
} from "react-icons/md";


// Admin Imports
import MainDashboard from "views/admin/default";
import Profile from "views/admin/profile";
import Service from "views/admin/tables/Service";
import Room from "views/admin/tables/Room";
import RoomType from "views/admin/tables/RoomType";
import Customer from "views/admin/tables/Customer";
import Account from "views/admin/tables/Account";
import Booking from "views/admin/tables/Booking";

import SignIn from "views/auth/SignIn";


const routes = [
  {
    name: "Trang Quản Trị",
    layout: "/admin",
    path: "default",
    icon: <MdDashboard className="h-6 w-6" />,
    component: <MainDashboard />,
  },
  {
    name: "Quản lý người dùng",
    layout: "/admin",
    path: "account",
    icon: <MdPeople className="h-6 w-6" />,
    component: <Account />,
  },
  {
    name: "Quản lý loại",
    layout: "/admin",
    path: "roomType",
    icon: <MdCategory className="h-6 w-6" />,
    component: <RoomType />,
  },
  {
    name: "Quản lý phòng",
    layout: "/admin",
    path: "room",
    icon: <MdMeetingRoom className="h-6 w-6" />,
    component: <Room />,
  },
  {
    name: "Quản lý dịch vụ",
    layout: "/admin",
    path: "service",
    icon: <MdRoomService className="h-6 w-6" />,
    component: <Service />,
  },
  {
    name: "Quản lý khách hàng",
    layout: "/admin",
    path: "customer",
    icon: <MdPeople className="h-6 w-6" />,
    component: <Customer />,
  },
  {
    name: "Quản lý đơn đặt",
    layout: "/admin",
    path: "booking",
    icon: <MdPeople className="h-6 w-6" />,
    component: <Booking />,
  },
  {
    name: "Quản lý thanh toán",
    layout: "/admin",
    path: "invoice",
    icon: <MdPeople className="h-6 w-6" />,
    component: <Booking />,
  },
  {
    name: "Profile",
    layout: "/admin",
    path: "profile",
    icon: <MdPerson className="h-6 w-6" />,
    component: <Profile />,
  },
  {
    name: "Sign In",
    layout: "/auth",
    path: "sign-in",
    icon: <MdLock className="h-6 w-6" />,
    component: <SignIn />,
  }
];

export default routes;
