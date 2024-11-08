/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 88.88888888888889, "KoPercent": 11.11111111111111};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7444444444444445, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "http://www.automationpractice.pl/index.php?id_product=1&controller=product&search_query=shirt&results=1"], "isController": false}, {"data": [0.5, 500, 1500, "http://www.automationpractice.pl/index.php?id_product=1&controller=product"], "isController": false}, {"data": [0.125, 500, 1500, "http://www.automationpractice.pl/index.php"], "isController": false}, {"data": [0.5, 500, 1500, "http://www.automationpractice.pl/index.php?id_category=5&controller=category"], "isController": false}, {"data": [1.0, 500, 1500, "http://www.automationpractice.pl/index.php?controller=order&step=1 (Go Adress)"], "isController": false}, {"data": [0.5, 500, 1500, "http://www.automationpractice.pl/index.php?id_product=2&controller=product"], "isController": false}, {"data": [0.5, 500, 1500, "http://www.automationpractice.pl/index.php?id_product=3&controller=product"], "isController": false}, {"data": [1.0, 500, 1500, "http://www.automationpractice.pl/index.php?id_product=2&controller=product-0"], "isController": false}, {"data": [1.0, 500, 1500, "http://www.automationpractice.pl/index.php?rand=1731034286925 (add shopcart)"], "isController": false}, {"data": [1.0, 500, 1500, "http://www.automationpractice.pl/index.php?id_product=2&controller=product-1"], "isController": false}, {"data": [1.0, 500, 1500, "http://www.automationpractice.pl/index.php?controller=search&orderby=position&orderway=desc&search_query=dress&submit_search="], "isController": false}, {"data": [1.0, 500, 1500, "http://www.automationpractice.pl/index.php?fc=module&module=bankwire&controller=payment"], "isController": false}, {"data": [0.5, 500, 1500, "http://www.automationpractice.pl/index.php?controller=authentication (Submit Form)"], "isController": false}, {"data": [0.5, 500, 1500, "http://www.automationpractice.pl/index.php?id_product=2&controller=product&search_query=dress&results=7"], "isController": false}, {"data": [1.0, 500, 1500, "http://www.automationpractice.pl/index.php?id_product=3&controller=product-0"], "isController": false}, {"data": [1.0, 500, 1500, "http://www.automationpractice.pl/index.php?id_product=3&controller=product-1"], "isController": false}, {"data": [0.5, 500, 1500, "http://www.automationpractice.pl/index.php?id_product=2&controller=product (select product)"], "isController": false}, {"data": [1.0, 500, 1500, "http://www.automationpractice.pl/index.php?controller=order (Go Adress)"], "isController": false}, {"data": [1.0, 500, 1500, "http://www.automationpractice.pl/index.php?id_product=1&controller=product-1"], "isController": false}, {"data": [0.5, 500, 1500, "http://www.automationpractice.pl/index.php?id_category=9&controller=category"], "isController": false}, {"data": [1.0, 500, 1500, "http://www.automationpractice.pl/index.php?controller=authentication (Submit Form)-0"], "isController": false}, {"data": [1.0, 500, 1500, "http://www.automationpractice.pl/index.php?controller=authentication (Submit Form)-1"], "isController": false}, {"data": [1.0, 500, 1500, "http://www.automationpractice.pl/index.php?id_product=1&controller=product-0"], "isController": false}, {"data": [1.0, 500, 1500, "http://www.automationpractice.pl/index.php?controller=search&orderby=position&orderway=desc&search_query=shirt&submit_search="], "isController": false}, {"data": [1.0, 500, 1500, "http://www.automationpractice.pl/index.php?id_product=2&controller=product (select product)-0"], "isController": false}, {"data": [1.0, 500, 1500, "http://www.automationpractice.pl/index.php?id_product=2&controller=product (select product)-1"], "isController": false}, {"data": [1.0, 500, 1500, "http://www.automationpractice.pl/index.php?fc=module&module=bankwire&controller=validation (Expect Order)-1"], "isController": false}, {"data": [1.0, 500, 1500, "http://www.automationpractice.pl/index.php?id_category=9&controller=category-1"], "isController": false}, {"data": [1.0, 500, 1500, "http://www.automationpractice.pl/index.php?controller=order"], "isController": false}, {"data": [0.0, 500, 1500, "http://www.automationpractice.pl/index.php?fc=module&module=bankwire&controller=validation (Expect Order)-0"], "isController": false}, {"data": [1.0, 500, 1500, "http://www.automationpractice.pl/index.php?id_category=9&controller=category-0"], "isController": false}, {"data": [1.0, 500, 1500, "http://www.automationpractice.pl/index.php?id_category=5&controller=category-0"], "isController": false}, {"data": [1.0, 500, 1500, "http://www.automationpractice.pl/index.php?id_category=5&controller=category-1"], "isController": false}, {"data": [0.0, 500, 1500, "http://www.automationpractice.pl/index.php?fc=module&module=bankwire&controller=validation (Expect Order)"], "isController": false}, {"data": [0.5, 500, 1500, "http://www.automationpractice.pl/index.php?controller=order (start buy)"], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler"], "isController": false}, {"data": [1.0, 500, 1500, "http://www.automationpractice.pl/index.php?id_product=1&controller=product&search_query=shirt&results=1-0"], "isController": false}, {"data": [0.5, 500, 1500, "http://www.automationpractice.pl/index.php?id_product=1&controller=product&search_query=shirt&results=1-1"], "isController": false}, {"data": [0.5, 500, 1500, "http://www.automationpractice.pl/index.php?id_product=2&controller=product&search_query=dress&results=7-1"], "isController": false}, {"data": [1.0, 500, 1500, "http://www.automationpractice.pl/index.php?id_product=2&controller=product&search_query=dress&results=7-0"], "isController": false}, {"data": [1.0, 500, 1500, "http://www.automationpractice.pl/index.php?controller=authentication&back=my-account"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 45, 5, 11.11111111111111, 802.8666666666667, 1, 6267, 472.0, 1450.0, 4533.899999999981, 6267.0, 3.347467083240348, 106.1957053624563, 3.374345616677825], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["http://www.automationpractice.pl/index.php?id_product=1&controller=product&search_query=shirt&results=1", 1, 0, 0.0, 824.0, 824, 824, 824.0, 824.0, 824.0, 824.0, 1.2135922330097086, 59.94718977548544, 1.7232061589805827], "isController": false}, {"data": ["http://www.automationpractice.pl/index.php?id_product=1&controller=product", 1, 0, 0.0, 801.0, 801, 801, 801.0, 801.0, 801.0, 801.0, 1.2484394506866416, 61.63194444444444, 1.8092618601747814], "isController": false}, {"data": ["http://www.automationpractice.pl/index.php", 4, 3, 75.0, 1233.25, 577, 1456, 1450.0, 1456.0, 1456.0, 1456.0, 1.2865873271148278, 65.11400872467031, 0.6803584351881634], "isController": false}, {"data": ["http://www.automationpractice.pl/index.php?id_category=5&controller=category", 1, 0, 0.0, 768.0, 768, 768, 768.0, 768.0, 768.0, 768.0, 1.3020833333333333, 70.27435302734375, 1.7751057942708333], "isController": false}, {"data": ["http://www.automationpractice.pl/index.php?controller=order&step=1 (Go Adress)", 1, 0, 0.0, 462.0, 462, 462, 462.0, 462.0, 462.0, 462.0, 2.1645021645021645, 67.27923768939394, 2.3082386363636362], "isController": false}, {"data": ["http://www.automationpractice.pl/index.php?id_product=2&controller=product", 1, 0, 0.0, 865.0, 865, 865, 865.0, 865.0, 865.0, 865.0, 1.1560693641618498, 55.432622832369944, 1.7476517341040463], "isController": false}, {"data": ["http://www.automationpractice.pl/index.php?id_product=3&controller=product", 1, 0, 0.0, 754.0, 754, 754, 754.0, 754.0, 754.0, 754.0, 1.3262599469496021, 59.91871477122016, 2.0204741379310343], "isController": false}, {"data": ["http://www.automationpractice.pl/index.php?id_product=2&controller=product-0", 1, 0, 0.0, 427.0, 427, 427, 427.0, 427.0, 427.0, 427.0, 2.34192037470726, 0.8233313817330211, 1.7701624707259953], "isController": false}, {"data": ["http://www.automationpractice.pl/index.php?rand=1731034286925 (add shopcart)", 1, 0, 0.0, 408.0, 408, 408, 408.0, 408.0, 408.0, 408.0, 2.450980392156863, 2.2882199754901964, 3.0350030637254903], "isController": false}, {"data": ["http://www.automationpractice.pl/index.php?id_product=2&controller=product-1", 1, 0, 0.0, 438.0, 438, 438, 438.0, 438.0, 438.0, 438.0, 2.28310502283105, 108.67044805936074, 1.7257063356164384], "isController": false}, {"data": ["http://www.automationpractice.pl/index.php?controller=search&orderby=position&orderway=desc&search_query=dress&submit_search=", 1, 0, 0.0, 459.0, 459, 459, 459.0, 459.0, 459.0, 459.0, 2.1786492374727673, 159.32223583877996, 1.5935627723311545], "isController": false}, {"data": ["http://www.automationpractice.pl/index.php?fc=module&module=bankwire&controller=payment", 2, 0, 0.0, 460.5, 442, 479, 460.5, 479.0, 479.0, 479.0, 0.2781254345709915, 5.034233329856765, 0.30555772841051315], "isController": false}, {"data": ["http://www.automationpractice.pl/index.php?controller=authentication (Submit Form)", 1, 0, 0.0, 694.0, 694, 694, 694.0, 694.0, 694.0, 694.0, 1.440922190201729, 39.76748243876081, 2.651071685878963], "isController": false}, {"data": ["http://www.automationpractice.pl/index.php?id_product=2&controller=product&search_query=dress&results=7", 1, 0, 0.0, 814.0, 814, 814, 814.0, 814.0, 814.0, 814.0, 1.2285012285012284, 58.932067721130224, 1.917133753071253], "isController": false}, {"data": ["http://www.automationpractice.pl/index.php?id_product=3&controller=product-0", 1, 0, 0.0, 313.0, 313, 313, 313.0, 313.0, 313.0, 313.0, 3.1948881789137378, 1.123202875399361, 2.4336062300319488], "isController": false}, {"data": ["http://www.automationpractice.pl/index.php?id_product=3&controller=product-1", 1, 0, 0.0, 441.0, 441, 441, 441.0, 441.0, 441.0, 441.0, 2.2675736961451247, 101.64886267006803, 1.7272534013605443], "isController": false}, {"data": ["http://www.automationpractice.pl/index.php?id_product=2&controller=product (select product)", 1, 0, 0.0, 801.0, 801, 801, 801.0, 801.0, 801.0, 801.0, 1.2484394506866416, 60.52736813358302, 2.5505227840199747], "isController": false}, {"data": ["http://www.automationpractice.pl/index.php?controller=order (Go Adress)", 1, 0, 0.0, 468.0, 468, 468, 468.0, 468.0, 468.0, 468.0, 2.136752136752137, 65.319093883547, 2.522786458333333], "isController": false}, {"data": ["http://www.automationpractice.pl/index.php?id_product=1&controller=product-1", 1, 0, 0.0, 492.0, 492, 492, 492.0, 492.0, 492.0, 492.0, 2.032520325203252, 99.62525406504065, 1.4727832825203253], "isController": false}, {"data": ["http://www.automationpractice.pl/index.php?id_category=9&controller=category", 1, 0, 0.0, 734.0, 734, 734, 734.0, 734.0, 734.0, 734.0, 1.3623978201634876, 72.09399480585832, 1.9903780653950953], "isController": false}, {"data": ["http://www.automationpractice.pl/index.php?controller=authentication (Submit Form)-0", 1, 0, 0.0, 300.0, 300, 300, 300.0, 300.0, 300.0, 300.0, 3.3333333333333335, 5.91796875, 2.760416666666667], "isController": false}, {"data": ["http://www.automationpractice.pl/index.php?controller=authentication (Submit Form)-1", 1, 0, 0.0, 393.0, 393, 393, 393.0, 393.0, 393.0, 393.0, 2.544529262086514, 65.70799538804071, 2.57434796437659], "isController": false}, {"data": ["http://www.automationpractice.pl/index.php?id_product=1&controller=product-0", 1, 0, 0.0, 309.0, 309, 309, 309.0, 309.0, 309.0, 309.0, 3.236245954692557, 1.137742718446602, 2.3450141585760518], "isController": false}, {"data": ["http://www.automationpractice.pl/index.php?controller=search&orderby=position&orderway=desc&search_query=shirt&submit_search=", 1, 0, 0.0, 470.0, 470, 470, 470.0, 470.0, 470.0, 470.0, 2.127659574468085, 101.70171210106383, 1.5562666223404256], "isController": false}, {"data": ["http://www.automationpractice.pl/index.php?id_product=2&controller=product (select product)-0", 1, 0, 0.0, 305.0, 305, 305, 305.0, 305.0, 305.0, 305.0, 3.278688524590164, 1.1526639344262295, 3.3491290983606556], "isController": false}, {"data": ["http://www.automationpractice.pl/index.php?id_product=2&controller=product (select product)-1", 1, 0, 0.0, 495.0, 495, 495, 495.0, 495.0, 495.0, 495.0, 2.0202020202020203, 97.23405934343434, 2.063604797979798], "isController": false}, {"data": ["http://www.automationpractice.pl/index.php?fc=module&module=bankwire&controller=validation (Expect Order)-1", 1, 0, 0.0, 414.0, 414, 414, 414.0, 414.0, 414.0, 414.0, 2.4154589371980677, 65.59480676328502, 2.847127868357488], "isController": false}, {"data": ["http://www.automationpractice.pl/index.php?id_category=9&controller=category-1", 1, 0, 0.0, 462.0, 462, 462, 462.0, 462.0, 462.0, 462.0, 2.1645021645021645, 113.77375879329004, 1.5811011904761905], "isController": false}, {"data": ["http://www.automationpractice.pl/index.php?controller=order", 1, 0, 0.0, 472.0, 472, 472, 472.0, 472.0, 472.0, 472.0, 2.1186440677966103, 70.23594743114407, 2.557269597457627], "isController": false}, {"data": ["http://www.automationpractice.pl/index.php?fc=module&module=bankwire&controller=validation (Expect Order)-0", 1, 1, 100.0, 5853.0, 5853, 5853, 5853.0, 5853.0, 5853.0, 5853.0, 0.170852554245686, 0.07291266230992653, 0.20856024688194089], "isController": false}, {"data": ["http://www.automationpractice.pl/index.php?id_category=9&controller=category-0", 1, 0, 0.0, 272.0, 272, 272, 272.0, 272.0, 272.0, 272.0, 3.676470588235294, 1.2996897977941175, 2.685546875], "isController": false}, {"data": ["http://www.automationpractice.pl/index.php?id_category=5&controller=category-0", 1, 0, 0.0, 272.0, 272, 272, 272.0, 272.0, 272.0, 272.0, 3.676470588235294, 1.2996897977941175, 2.5060317095588234], "isController": false}, {"data": ["http://www.automationpractice.pl/index.php?id_category=5&controller=category-1", 1, 0, 0.0, 495.0, 495, 495, 495.0, 495.0, 495.0, 495.0, 2.0202020202020203, 108.3175505050505, 1.3770517676767677], "isController": false}, {"data": ["http://www.automationpractice.pl/index.php?fc=module&module=bankwire&controller=validation (Expect Order)", 1, 1, 100.0, 6267.0, 6267, 6267, 6267.0, 6267.0, 6267.0, 6267.0, 0.15956598053295037, 4.401309687649593, 0.38286485758736233], "isController": false}, {"data": ["http://www.automationpractice.pl/index.php?controller=order (start buy)", 1, 0, 0.0, 517.0, 517, 517, 517.0, 517.0, 517.0, 517.0, 1.9342359767891684, 71.70839881528046, 2.049459018375242], "isController": false}, {"data": ["Debug Sampler", 1, 0, 0.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 1000.0, 572.265625, 0.0], "isController": false}, {"data": ["http://www.automationpractice.pl/index.php?id_product=1&controller=product&search_query=shirt&results=1-0", 1, 0, 0.0, 301.0, 301, 301, 301.0, 301.0, 301.0, 301.0, 3.3222591362126246, 1.2620691445182726, 2.3586742109634553], "isController": false}, {"data": ["http://www.automationpractice.pl/index.php?id_product=1&controller=product&search_query=shirt&results=1-1", 1, 0, 0.0, 523.0, 523, 523, 523.0, 523.0, 523.0, 523.0, 1.9120458891013383, 93.72199151529637, 1.3574778919694073], "isController": false}, {"data": ["http://www.automationpractice.pl/index.php?id_product=2&controller=product&search_query=dress&results=7-1", 1, 0, 0.0, 522.0, 522, 522, 522.0, 522.0, 522.0, 522.0, 1.9157088122605364, 91.17015385536398, 1.4947767001915708], "isController": false}, {"data": ["http://www.automationpractice.pl/index.php?id_product=2&controller=product&search_query=dress&results=7-0", 1, 0, 0.0, 291.0, 291, 291, 291.0, 291.0, 291.0, 291.0, 3.4364261168384878, 1.3054392182130585, 2.681352018900344], "isController": false}, {"data": ["http://www.automationpractice.pl/index.php?controller=authentication&back=my-account", 1, 0, 0.0, 378.0, 378, 378, 378.0, 378.0, 378.0, 378.0, 2.6455026455026456, 89.4407242063492, 1.8291170634920635], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["The operation lasted too long: It took 6,267 milliseconds, but should not have lasted longer than 1,000 milliseconds.", 1, 20.0, 2.2222222222222223], "isController": false}, {"data": ["The operation lasted too long: It took 1,450 milliseconds, but should not have lasted longer than 1,000 milliseconds.", 2, 40.0, 4.444444444444445], "isController": false}, {"data": ["The operation lasted too long: It took 5,853 milliseconds, but should not have lasted longer than 1,000 milliseconds.", 1, 20.0, 2.2222222222222223], "isController": false}, {"data": ["The operation lasted too long: It took 1,456 milliseconds, but should not have lasted longer than 1,000 milliseconds.", 1, 20.0, 2.2222222222222223], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 45, 5, "The operation lasted too long: It took 1,450 milliseconds, but should not have lasted longer than 1,000 milliseconds.", 2, "The operation lasted too long: It took 6,267 milliseconds, but should not have lasted longer than 1,000 milliseconds.", 1, "The operation lasted too long: It took 5,853 milliseconds, but should not have lasted longer than 1,000 milliseconds.", 1, "The operation lasted too long: It took 1,456 milliseconds, but should not have lasted longer than 1,000 milliseconds.", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["http://www.automationpractice.pl/index.php", 4, 3, "The operation lasted too long: It took 1,450 milliseconds, but should not have lasted longer than 1,000 milliseconds.", 2, "The operation lasted too long: It took 1,456 milliseconds, but should not have lasted longer than 1,000 milliseconds.", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["http://www.automationpractice.pl/index.php?fc=module&module=bankwire&controller=validation (Expect Order)-0", 1, 1, "The operation lasted too long: It took 5,853 milliseconds, but should not have lasted longer than 1,000 milliseconds.", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["http://www.automationpractice.pl/index.php?fc=module&module=bankwire&controller=validation (Expect Order)", 1, 1, "The operation lasted too long: It took 6,267 milliseconds, but should not have lasted longer than 1,000 milliseconds.", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
