
var wb_button = document.createElement("button");
document.body.appendChild(wb_button);
wb_button.textContent = "Get Data";

document.body.appendChild(document.createElement("br"));
document.body.appendChild(document.createElement("br"));
document.body.appendChild(document.createElement("br"));

var countryCode1 = "";
var countryCode2 = "";
var topicCode = "";
var indicatorCode = "";
var year;

var wb_table = document.createElement("div");
document.body.appendChild(wb_table);
var table = document.createElement("table");
wb_table.appendChild(table);
var rootUrl = "http://api.worldbank.org/";

var dataColumn1 = [];
var dataColumn2 = [];
function drawTable(tab, size) {
  var tableHeader = document.createElement("thead");
  tab.appendChild(tableHeader);
  var headerRow = document.createElement("tr");
  tableHeader.appendChild(headerRow);
  var idHead = document.createElement("th");
  headerRow.appendChild(idHead);
  idHead.textContent = "Number";
  var topicHead = document.createElement("th");
  headerRow.appendChild(topicHead);
  topicHead.textContent = "Topic";
  var indicatorHead = document.createElement("th");
  headerRow.appendChild(indicatorHead);
  indicatorHead.textContent = "Indicator";
  var descHead = document.createElement("th");
  headerRow.appendChild(descHead);
  descHead.textContent = "Indicator Description";
  var dataHead1 = document.createElement("th");
  headerRow.appendChild(dataHead1);
  dataHead1.textContent = document.getElementById(countryCode1+"1")
                          .textContent;
  var dataHead2 = document.createElement("th");
  headerRow.appendChild(dataHead2);
  dataHead2.textContent = document.getElementById(countryCode2+"2")
                          .textContent;
  var headerRow = document.createElement("tr");
  tableHeader.appendChild(headerRow);
  var tableBody = document.createElement("tbody");
  table.appendChild(tableBody);
  var topicText = document.getElementById(topicCode).textContent;
  for (var i = 0; i < size; i++)
  {
    var row = document.createElement("tr");
    var idData = document.createElement("td");
    var topicData = document.createElement("td");
    var indicatorData = document.createElement("td");
    var descData = document.createElement("td");
    var data1 = document.createElement("td");
    var data2 = document.createElement("td");
    dataColumn1[i] = data1;
    dataColumn2[i] = data2;
    data1.id = indicatorsArray[2*i] + "1";
    data2.id = indicatorsArray[2*i] + "2";
    tableBody.appendChild(row);
    row.appendChild(idData);
    row.appendChild(topicData);
    row.appendChild(indicatorData);
    row.appendChild(descData);
    row.appendChild(data1);
    row.appendChild(data2);
    idData.textContent = i + 1;
    topicData.textContent = topicText;
    indicatorData.textContent = indicatorsArray[2*i];
    descData.textContent = indicatorsArray[2*i+1];
  }
}

function displayData1(arr)
{
  console.log(arr.length);
  for (var i = 0; i < arr.length; i++)
  {
    if (arr[i] === null)
      dataColumn1[i].textContent = "N/A";
    else
      dataColumn1[i].textContent = arr[i];
  }
}

function displayData2(arr)
{
  for (var i = 0; i < arr.length; i++)
  {
    if (arr[i] === null)
      dataColumn2[i].textContent = "N/A";
    else
      dataColumn2[i].textContent = arr[i];
  }
}

function worldBankApiCall(dataTypeUrl, prefixType, year, pageNum) {
  var dateParameter = "";
  if (year !== null)
    dateParameter = "&date=" + year + ":" + year;
  var wbScript = document.createElement("script");
  wbScript.src = rootUrl + dataTypeUrl + "?page=" + pageNum
                 + "&per_page=100&format=jsonP&prefix=" + prefixType
                 + dateParameter;
  document.body.appendChild(wbScript);
}

var topicsArray = [];
function get_topics (jsonpData) {
  var pageCount = jsonpData[0].pages;
  var data = jsonpData[1];
  for (var i = 0; i < data.length; i++)
  {
    topicsArray.push([data[i].id, data[i].value]);
    //dataArr.push([data[i].id, data[i].name]);
  }
  if (jsonpData[0].page < pageCount)
  {
    worldBankApiCall("topics/", "get_topics", null, jsonpData[0].page + 1);
  }
  else
  {
    for (var j = 0; j < topicsArray.length; j++)
    {
      var option = document.createElement("option");
      option.value = topicsArray[j][0];
      option.textContent = topicsArray[j][1];
      option.id = topicsArray[j][0];
      document.getElementById("topic").appendChild(option);
    }
  }
}

var countriesArray = [];
function get_countries (jsonpData) {
  var pageCount = jsonpData[0].pages;
  var data = jsonpData[1];
  for (var i = 0; i < data.length; i++)
  {
    countriesArray.push([data[i].id, data[i].name]);
  }
  if (jsonpData[0].page < pageCount)
  {
    worldBankApiCall("countries/", "get_countries", null, jsonpData[0].page + 1);
  }
  else
  {
    for (var j = 0; j < countriesArray.length; j++)
    {
      var option1 = document.createElement("option");
      option1.value = countriesArray[j][0];
      option1.textContent = countriesArray[j][1];
      option1.id = countriesArray[j][0] + "1";
      var option2 = document.createElement("option");
      option2.value = countriesArray[j][0];
      option2.textContent = countriesArray[j][1];
      option2.id = countriesArray[j][0] + "2";
      document.getElementById("country1").appendChild(option1);
      document.getElementById("country2").appendChild(option2);
    }
  }
}

var idNum = 0;
var indicatorsArray = [];
function get_indicators (jsonpData) {
  var pageCount = jsonpData[0].pages;
  var data = jsonpData[1];
  for (var i = 0; i < data.length; i++)
  {
    indicatorsArray.push(data[i].id);
    indicatorsArray.push(data[i].name);
  }
  if (jsonpData[0].page < pageCount)
  {
    worldBankApiCall("topic/" + topicCode + "/indicator",
                     "get_indicators", null, jsonpData[0].page + 1);
  }
  else
  {
    drawTable(table, jsonpData[0].total);
    worldBankApiCall("countries/" + countryCode1 + "/indicators/" +
                     indicatorsArray[idNum], "get_data1", year, 1);
  }
}

var dataArray1 = [];
function get_data1 (jsonpData) {
  var data = jsonpData[1];
  if (data !== null && data[0].date == year)
    dataArray1.push(data[0].value);
  else
    dataArray1.push(null);
  if (dataArray1.length < (indicatorsArray.length)/2)
  {
    idNum += 2;
    setTimeout(function(){
      worldBankApiCall("countries/" + countryCode1 + "/indicators/" +
                       indicatorsArray[idNum], "get_data1", year, 1);
    }, 500);
  }
  else
  {
    idNum = 0;
    setTimeout(function(){
      worldBankApiCall("countries/" + countryCode2 + "/indicators/" +
                       indicatorsArray[idNum], "get_data2", year, 1);
    }, 500);
  }
}

var dataArray2 = [];
function get_data2 (jsonpData) {
  var data = jsonpData[1];
  if (data !== null && data[0].date == year)
    dataArray2.push(data[0].value);
  else
    dataArray2.push(null);
  if (dataArray2.length < (indicatorsArray.length)/2)
  {
    idNum += 2;
    setTimeout(function(){
      worldBankApiCall("countries/" + countryCode2 + "/indicators/" +
                       indicatorsArray[idNum], "get_data2", year, 1);
    }, 500);
  }
  else
  {
    displayData1(dataArray1);
    displayData2(dataArray2);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  worldBankApiCall("topics/", "get_topics", null, 1);
  worldBankApiCall("countries/", "get_countries", null, 1);
  for (var k = 0; k < 56; k++)
  {
    var option = document.createElement("option");
    option.value = 1960 + k;
    option.textContent = 1960 + k;
    document.getElementById("year").appendChild(option);
  }
  wb_button.addEventListener("click", function (event) {
    idNum = 0;
    countriesArray = [];
    topicsArray = [];
    indicatorsArray = [];
    dataArray1 = [];
    dataArray2 = [];
    wb_table.removeChild(table);
    table = document.createElement("table");
    wb_table.appendChild(table);
    countryCode1 = document.getElementById("country1").value;
    countryCode2 = document.getElementById("country2").value;
    topicCode = document.getElementById("topic").value;
    year = document.getElementById("year").value;
    worldBankApiCall("topic/" + topicCode + "/indicator",
                     "get_indicators", null, 1);
    event.preventDefault();
  });
});


