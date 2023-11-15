export function showChart(root, jsonData){

    if (root && !root.isDisposed()) {

        am5.ready(function() {
        const allData = jsonData['formattedData']
        const regionData = jsonData['regionData']
        const imgData = jsonData['imgData']

        // Create root element
        // https://www.amcharts.com/docs/v5/getting-started/#Root_element
        // var root = am5.Root.new("chartdiv");
      
        // กำหนดการจัดรูปแบบตัวเลข
        root.numberFormatter.setAll({
        // (จัดรูปแบบเป็นแบบมี comma และไม่มีค่าอะไรต่อหลังทศนิยม)
        numberFormat: "#,###.",
        // numberFormat: "#a",
      
        // Group only into M (millions), and B (billions)
        bigNumberPrefixes: [
          { number: 1e6, suffix: "M" },
          { number: 1e9, suffix: "B" }
        ],
      
        // Do not use small number prefixes at all
        // กำหนดให้ไม่มีคำนำหน้า (prefix) ใด ๆ
        smallNumberPrefixes: []
        });
      
        // speed
        var stepDuration = 500;
        
        // Set themes
        // https://www.amcharts.com/docs/v5/concepts/themes/
        // สร้าง object ของธีมที่ชื่อ "Animated" และผูกกับ Root ของ amCharts5
        // themes "Animated" มักจะมีการเพิ่มเอฟเฟ็กต์แอนิเมชันที่ทำให้แผนภูมิหรือกราฟมีการเคลื่อนไหว.
        root.setThemes([am5themes_Animated.new(root)]); 
        
        // Create chart
        // https://www.amcharts.com/docs/v5/charts/xy-chart/
        var chart = root.container.children.push(am5xy.XYChart.new(root, {
            // ลากแผนภูมิไปทางแนวแกน X
            panX: true,
            // ลากแผนภูมิไปทางแนวแกน Y
            panY: true,
            // ไม่สามารถลากแผนภูมิไปทางแนวแกน X
            wheelX: "none",
            // ไม่สามารถลากแผนภูมิไปทางแนวแกน Y
            wheelY: "none"
        }));

        // We don't want zoom-out button to appear while animating, so we hide it at all
        chart.zoomOutButton.set("forceHidden", true);

        // Create axes
        // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
        var yRenderer = am5xy.AxisRendererY.new(root, {
            // ระยะห่างแกน
            minGridDistance: 20,
            // ค่ามากอยู่บน
            inversed: true,
        });
        // hide grid
        yRenderer.grid.template.set("visible", false);
        
        var yAxis = chart.yAxes.push(am5xy.CategoryAxis.new(root, {
            // Deviation ส่วนเบี่ยงเบน
            maxDeviation: 0,
            categoryField: "myCountry",
            // ใช้ในการวาดแกน Y
            renderer: yRenderer,
        }));

        var xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
            maxDeviation: 0,
            min: 0,
            // ทำให้ค่า Min และ Max นั้นเป็นค่าที่ต้องการอย่างเคร่งครัด
            strictMinMax: true,
            // กำหนดค่า extraMax เพื่อเพิ่มค่าสูงสุด (max value) อีก 0.1 ของช่วง
            extraMax: 0.1,
            renderer: am5xy.AxisRendererX.new(root, {
                // x axis to top, ตรงกันข้าม
                opposite: true
            }),
        }));
        
        // กำหนดระยะเวลาที่ใช้ในการทำนายข้อมูลในกรณีที่มีการเปลี่ยนแปลง
        xAxis.set("interpolationDuration", stepDuration / 10);
        // กำหนดฟังก์ชันที่ทำให้การทำนายเป็นเส้นตรง (linear interpolation)
        xAxis.set("interpolationEasing", am5.ease.linear);
    
        // Add series
        // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
        var series = chart.series.push(am5xy.ColumnSeries.new(root, {
            xAxis: xAxis,
            yAxis: yAxis,
            valueXField: "value",
            categoryYField: "myCountry"
        }));
        
        // Rounded corners for columns
        // corner radius bottom-right, corner radius top-right
        series.columns.template.setAll({ cornerRadiusBR: 5, cornerRadiusTR: 5 });

        // ขนาดกราฟ
        series.columns.template.setAll({ height : 50});
    
        // Make each column to be of a different color
        series.columns.template.adapters.add("fill", function (fill, target) {
        const countryname = target.dataItem.dataContext.myCountry;
        if (regionData[countryname] == "Asia"){
          return am5.color("#5040E7");
        }else if (regionData[countryname] == "Europe"){
          return am5.color("#855DE5");
        }
        else if (regionData[countryname] == "Africa"){
          return am5.color("#FFA500");
        }
        else if (regionData[countryname] == "Oceania"){
          return am5.color("#FF0000");
        }
        else if (regionData[countryname] == "Americas"){
          return am5.color("#FFEA00");
        }
          return am5.color("#CCCCCC"); // Gray or any other default color
        });
 
        series.columns.template.adapters.add("stroke", function (stroke, target) {
        // return chart.get("colors").getIndex(series.columns.indexOf(target));
        const countryname = target.dataItem.dataContext.myCountry;
        if (regionData[countryname] == "Asia"){
          return am5.color("#5040E7");
        }else if (regionData[countryname] == "Europe"){
          return am5.color("#855DE5");
        }
        else if (regionData[countryname] == "Oceania"){
          return am5.color("#F98A32");
        }
        else if (regionData[countryname] == "Americas"){
          return am5.color("#F9B432");
        }
        else if (regionData[countryname] == "Africa"){
          return am5.color("#F9C732");
        }
          return am5.color("#CCCCCC"); // Gray or any other default color
        });
      
        // // Add label bullet
        series.bullets.push(function () {
            return am5.Bullet.new(root, {
            //ข้อความอยู่ปลายกราฟ
            locationX: 1,
            sprite: am5.Label.new(root, {
                // ค่าของข้อมูลบนกราฟ (จัดรูปแบบเป็นแบบมี comma และไม่มีค่าอะไรต่อหลังทศนิยม)
                text: "{valueXWorking.formatNumber('#,###.')}",
                centerX: am5.p120,
                centerY: am5.p50,
                populateText: true
            })
            });
        });

        var year = 1950;

        let index = 0;
        series.bullets.push(function() {
            const flagImg = imgData[series.dataItems[index].dataContext["myCountry"]]
            index++
            var bulletContainer = am5.Container.new(root, { centerX: 55});
            var maskCircle = bulletContainer.children.push(am5.Circle.new(root,{radius: 20}));
            var imageContainer = bulletContainer.children.push(am5.Container.new(root, { mask: maskCircle}))
            imageContainer.children.push( am5.Picture.new(root, {
                src: flagImg,
                centerX: am5.p50,
                centerY: am5.p50,
                width: 58,
                height: 40
            }));

            return am5.Bullet.new(root, {
                locationX: 1,
                sprite: bulletContainer
            });
        })
   
        var label = chart.plotContainer.children.push(am5.Label.new(root, {
            text: "2002",
            fontSize: "4em",
            opacity: 0.5,
            x: am5.p100,
            y: am5.p100,
            centerY: am5.p100,
            centerX: am5.p100,
        }));

        var label2 = chart.plotContainer.children.push(am5.Label.new(root, {
            text: "",
            fontSize: "3em",
            opacity: 0.5,
            x: am5.p100,
            y: am5.p100,
            centerY: am5.p100,
            centerX: am5.p100,
        }));
      
        // Get series item by category
        function getSeriesItem(category) {
            for (var i = 0; i < series.dataItems.length; i++) {
              var dataItem = series.dataItems[i];
              if (dataItem.get("categoryY") == category) {
                  return dataItem;
              }
            }
        }
      
        // Axis sorting
        function sortCategoryAxis() {

            // sort by value
            series.dataItems.sort(function (x, y) {
                // ค่ามากอยู่บน
                return y.get("valueX") - x.get("valueX"); // descending
                // return x.get("valueX") - y.get("valueX"); // ascending
            });
            
            // go through each axis item
            am5.array.each(yAxis.dataItems, function (dataItem) {
            
            // get corresponding series item
            // รับค่ารายการ series ที่เกี่ยวข้อง
            var seriesDataItem = getSeriesItem(dataItem.get("category"));
        
            if (seriesDataItem) {
                // get index of series data item
                var index = series.dataItems.indexOf(seriesDataItem);
                // calculate delta position
                // คำนวณ delta position หรือตำแหน่งที่เปลี่ยนแปลงไป เทียบกับ index ของ dataItem ที่กำลังพิจารณา
                var deltaPosition = (index - dataItem.get("index", 0)) / series.dataItems.length;
                // set index to be the same as series data item index
                if (dataItem.get("index") != index) {
                  dataItem.set("index", index);
                  // set deltaPosition instanlty
                  dataItem.set("deltaPosition", -deltaPosition);
                  // animate delta position to 0
                  dataItem.animate({
                      key: "deltaPosition",
                      to: 0,
                      duration: stepDuration / 2,
                      easing: am5.ease.out(am5.ease.cubic)
                });
                }
            }
        });
        // sort axis items by index.
        // This changes the order instantly, but as deltaPosition is set, they keep in the same places and then animate to true positions.
        // เรียงลำดับ dataItems ของแกน Y ของแผนภูมิหรือ กราฟที่เกี่ยวข้องกับ yAxis
        yAxis.dataItems.sort(function (x, y) {
          return x.get("index") - y.get("index");
        });
      }
      
      // update data with values each 0.1 sec
      var interval = setInterval(function () {
        year++;
      
        // if (year > 2018) {
        if (year > 2020) {
          clearInterval(interval);
          clearInterval(sortInterval);
        }
      
        updateData();
      }, stepDuration);
      
      var sortInterval = setInterval(function () {
        sortCategoryAxis();
      }, 100);
      
      //เตรียมข้อมูลที่จะแสดงบนกราฟ
      function setInitialData() {
        var d = allData[year];
        
        for (var n in d) {
          series.data.push({ myCountry: n, value: d[n] });
          yAxis.data.push({ myCountry: n });
        }
      }
      
      function updateData() {
        var itemsWithNonZero = 0;
        if (allData[year]) {
            //แสดงค่ายอดรวมสะสมในแต่ละปี
            const totalPopulation = Object.values(allData[year]).reduce((sum, value) => sum + value, 0);
            // console.log(totalPopulation);
            label.set("text", year.toString()+"\n");
            label2.set("text", "Total "+ addCommas(totalPopulation))
            
            am5.array.each(series.dataItems, function (dataItem) {
                var category = dataItem.get("categoryY");
                var value = allData[year][category];

                // console.log(category);
                if (value > 0) {
                    itemsWithNonZero++;
                }
            
                dataItem.animate({
                    key: "valueX",
                    to: value,
                    duration: stepDuration,
                    easing: am5.ease.linear
                });
                dataItem.animate({
                    key: "valueXWorking",
                    to: value,
                    duration: stepDuration,
                    easing: am5.ease.linear
                });
          });
      
          // yAxis.zoom(0, itemsWithNonZero / yAxis.dataItems.length);
          // แสดงแค่ 8 กราฟ
          yAxis.zoom(0, 8 / yAxis.dataItems.length);
        }
      }
      setInitialData();
      setTimeout(function () {
        year++;
        updateData();
      }, 50);
      
      // Make stuff animate on load
      // https://www.amcharts.com/docs/v5/concepts/animations/
      // series.appear(1000);
      series.appear(100);
      chart.appear(1000, 100);
      }); // end am5.ready()
    }
}

function addCommas(nStr){
    nStr += '';
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}