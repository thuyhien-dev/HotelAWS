import PieChart from "components/charts/PieChart";
import { pieChartData, pieChartOptions } from "variables/charts";
import Card from "components/card";
import basePath from "../../../../utils/basePath"; 

import React, { useEffect, useState } from 'react';

const PieChartCard = () => {
  const [series, setSeries] = useState([0, 0]);

  useEffect(() => {
    fetch(`${basePath}/rooms/status-count`)
      .then(res => res.json())
      .then(({ available, occupied }) => {
        setSeries([available, occupied]);
      })
      .catch(err => console.error(err));
  }, []);

  const labels = ["Available", "Occupied"];
  const options = {
    ...pieChartOptions,
    labels,
  };

  return (
    <Card extra="rounded-[20px] p-3">
      <h4 className="text-lg font-bold">Phòng hiện tại</h4>
      <PieChart options={options} series={series} />
      <div className="flex justify-around mt-4">
        <div>
          <div className="flex items-center">
            <div className="h-2 w-2 rounded-full bg-brand-500" />
            <p className="ml-1 text-sm">Available</p>
          </div>
          <p className="font-bold">{Math.round((series[0] / (series[0]+series[1] || 1)) * 100)}%</p>
        </div>
        <div>
          <div className="flex items-center">
            <div className="h-2 w-2 rounded-full bg-[#6AD2FF]" />
            <p className="ml-1 text-sm">Occupied</p>
          </div>
          <p className="font-bold">{Math.round((series[1] / (series[0]+series[1] || 1)) * 100)}%</p>
        </div>
      </div>
    </Card>
  );
};
export default PieChartCard;
