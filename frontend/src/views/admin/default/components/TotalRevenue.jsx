import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  MdArrowDropUp,
  MdOutlineCalendarToday,
  MdBarChart,
} from "react-icons/md";
import Card from "components/card";
import LineChart from "components/charts/LineChart";
import basePath from "../../../../utils/basePath"; 

const TotalRevenue = () => {
  const [revenueData, setRevenueData] = useState({
    labels: [],   
    seriesData: [], 
  });

  useEffect(() => {
    const fetchMonthlyRevenue = async () => {
      try {
        const res = await axios.get(`${basePath}/invoices/monthly-revenue`);
        const data = res.data;

        const labels = data.map(item => `Tháng ${item.month}`);
        const seriesData = data.map(item => item.revenue);

        setRevenueData({ labels, seriesData });
      } catch (error) {
        console.error("Lỗi lấy doanh thu tháng:", error);
      }
    };

    fetchMonthlyRevenue();
  }, []);

  const lineChartOptions = {
    chart: {
      id: "monthly-revenue-chart",
      toolbar: { show: false },
    },
    xaxis: {
      categories: revenueData.labels,
    },
    stroke: {
      curve: "smooth",
    },
    colors: ["#4f46e5"],
    dataLabels: { enabled: false },
    yaxis: {
      labels: {
        formatter: function (val) {
          return val.toLocaleString("vi-VN") + "₫";
        },
      },
    },
  };

  const lineChartSeries = [
    {
      name: "Doanh thu",
      data: revenueData.seriesData,
    },
  ];

  const totalRevenue = revenueData.seriesData.reduce((a, b) => a + b, 0);

  return (
    <Card extra="!p-[20px] text-center">
      <div className="flex justify-between">
        <button className="linear mt-1 flex items-center justify-center gap-2 rounded-lg bg-lightPrimary p-2 text-gray-600 transition duration-200 hover:cursor-pointer hover:bg-gray-100 active:bg-gray-200 dark:bg-navy-700 dark:hover:opacity-90 dark:active:opacity-80">
          <MdOutlineCalendarToday />
          <span className="text-sm font-medium text-gray-600">Năm nay</span>
        </button>
        <button className="!linear z-[1] flex items-center justify-center rounded-lg bg-lightPrimary p-2 text-brand-500 !transition !duration-200 hover:bg-gray-100 active:bg-gray-200 dark:bg-navy-700 dark:text-white dark:hover:bg-white/20 dark:active:bg-white/10">
          <MdBarChart className="h-6 w-6" />
        </button>
      </div>

      <div className="flex h-full w-full flex-row justify-between sm:flex-wrap lg:flex-nowrap 2xl:overflow-hidden">
        <div className="flex flex-col">
          <p className="mt-[20px] text-3xl font-bold text-navy-700 dark:text-white">
            {totalRevenue.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
          </p>
          <div className="flex flex-col items-start">
            <p className="mt-2 text-sm text-gray-600">Tổng doanh thu</p>
            <div className="flex flex-row items-center justify-center">
              <MdArrowDropUp className="font-medium text-green-500" />
              <p className="text-sm font-bold text-green-500"> +2.45% </p>
            </div>
          </div>
        </div>
        <div className="h-full w-full">
          <LineChart options={lineChartOptions} series={lineChartSeries} />
        </div>
      </div>
    </Card>
  );
};

export default TotalRevenue;
