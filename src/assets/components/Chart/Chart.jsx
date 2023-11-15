import React, { useEffect } from 'react'
import { fetchData } from '../../../utils/fetchData';
import { showChart } from '../../../utils/showChart';

const Chart = () => {

  useEffect(()=> {

    // สร้าง object Root ของ amCharts5 และผูกกับ HTML 
    var root = am5.Root.new("chartdiv");

    const url = 'https://woramet-bar-chart-race.onrender.com/api/data';
    fetchData(url).then(data=>{showChart(root, data)})
    
    return () => {
        // ทำลาย หรือลบทิ้ง object Root
        root.dispose();
    };

  }, [])

  return (
    <div>
      <div id="chartdiv" style={{ width: '100%', height: '550px' }}></div>
    </div>
  )
}

export default Chart
