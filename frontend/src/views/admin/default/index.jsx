import React, { useEffect, useState } from "react";
import axios from "axios";
import basePath from "../../../utils/basePath"; 

import WeeklyRevenue from "views/admin/default/components/WeeklyRevenue";
import TotalRevenue from "views/admin/default/components/TotalRevenue";
import PieChartCard from "views/admin/default/components/PieChartCard";
import { IoMdHome } from "react-icons/io";
import { IoDocuments } from "react-icons/io5";
import { MdBarChart, MdDashboard } from "react-icons/md";

import { columnsDataCheck } from "./variables/columnsData";
import Widget from "components/widget/Widget";
import CheckTable from "views/admin/default/components/CheckTable";
import DailyTraffic from "views/admin/default/components/DailyTraffic";
import tableDataCheck from "./variables/tableDataCheck.json";

const useEntityCount = (endpoint) => {
  const [count, setCount] = useState(0);

  const fetchCount = async () => {
    try {
      const res = await axios.get(`${basePath}/${endpoint}/count`);
      setCount(res.data.count);
    } catch (error) {
      console.error(`Lỗi khi đếm ${endpoint}:`, error);
    }
  };

  useEffect(() => {
    fetchCount();
  }, [endpoint]);

  return count;
};

const useTotalRevenue = () => {
  const [revenue, setRevenue] = useState(0);

  const fetchRevenue = async () => {
    try {
      const res = await axios.get(`${basePath}/invoices/total-revenue`);
      setRevenue(res.data.totalRevenue);
    } catch (err) {
      console.error('Lỗi khi lấy tổng doanh thu:', err);
    }
  };

  useEffect(() => {
    fetchRevenue();
  }, []);

  return revenue;
};


const Dashboard = () => {
  const serviceCount = useEntityCount("services");
  const customerCount = useEntityCount("customers");
  const accountCount = useEntityCount("accounts");
  const bookingCount = useEntityCount("bookings");
  const roomCount = useEntityCount("rooms");
  const revenue = useTotalRevenue();

  return (
    <div>
      {/* Card widget */}
      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-6">
        <Widget
          icon={<MdBarChart className="h-7 w-7" />}
          title={"Khách hàng"}
          subtitle={`${customerCount} khách hàng`}
        />
        <Widget
          icon={<IoDocuments className="h-6 w-6" />}
          title={"Phòng"}
          subtitle={`${roomCount} phòng`}
        />
        <Widget
          icon={<MdBarChart className="h-7 w-7" />}
          title={"Dịch vụ"}
          subtitle={`${serviceCount} dịch vụ`}
        />
        <Widget
          icon={<MdDashboard className="h-6 w-6" />}
          title={"Đơn đặt"}
          subtitle={`${bookingCount} đơn`}
        />
        <Widget
          icon={<IoMdHome className="h-6 w-6" />}
          title={"Tài khoản"}
          subtitle={`${accountCount} tài khoản`}
        />
        <Widget
          icon={<MdBarChart className="h-7 w-7" />}
          title={"Doanh thu"}
          subtitle={revenue.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
        />
      </div>

      <br />
      <br />
      <br />
      {/* Charts */}
      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        <TotalRevenue />
        <CheckTable
          columnsData={columnsDataCheck}
          tableData={tableDataCheck}
        />
      </div>
    </div>
  );
};

export default Dashboard;
