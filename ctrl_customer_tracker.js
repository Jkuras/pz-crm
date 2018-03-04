

$(document).ready(function(){
  google.charts.load('current', {'packages':['corechart']})

  /////////////////////////////////////////////////////
  //START OBJECT SETUPS////////////////////////////////
  /////////////////////////////////////////////////////
  function Turnaway(name, reason){
    this.name = name
    this.date = new Date().toJSON().slice(0,10)
    this.time = new Date().getHours() + ":" + new Date().getMinutes()
    this.reason = reason
  }

  function Timesheet(name, start){
    this.name=name
    this.start=start
    this.break_1_out='0:00'
    this.break_1_in='0:00'
    this.lunch_out='0:00'
    this.lunch_in='0:00'
    this.break_2_out='0:00'
    this.break_2_in='0:00'
    this.out='0:00'
    this.total=0
  }


  /////////////////////////////////////////////////////
  //END OBJECT SETUPS//////////////////////////////////
  /////////////////////////////////////////////////////


  /////////////////////////////////////////////////////
  //START VARIABLE SETUPS//////////////////////////////
  /////////////////////////////////////////////////////
  var database=firebase.database()
  var date = new Date().toJSON().slice(0,10)

  var in_store_number
  var current_half_number

  var todays_total
  var todays_tracking
  var todays_turnaways
  var todays_timesheets

  var ptr_in_store_number="in_store_number"
  var ptr_todays_total="todays_total"
  var ptr_current_half_number="current_half_number"

  var ptr_todays_tracking="todays_tracking"
  var ptr_todays_turnaways="todays_turnaways"
  var ptr_todays_timesheets="todays_timesheets"

  var ptr_all_customers="all_customers"
  var ptr_all_timesheets="all_timesheets"
  var ptr_all_totals="all_totals"
  var ptr_all_turnaways="all_turnaways"

  var all_customers, all_timesheets, all_totals, all_turnaways;
  getDataBaseInfo(true, true, true, true)
  loadAllFromLocalStorage()
  getClock();
  halfHourCheck();
  setInterval(halfHourCheck, 1000);
  setInterval(getClock,1000);


  ////////////////////////////////////////////////////
  //STOP VARIABLE SETUPS//////////////////////////////
  ////////////////////////////////////////////////////

  ////////////////////////////////////////////////////
  //START ONCLICK SETUPS//////////////////////////////
  ////////////////////////////////////////////////////
  $('#show_manager_button').click(function(){
    $('#customer_scroll_body').toggle(false);
    $('#turnaway_scroll_body').toggle(false);
    $('#timesheet_body').toggle(false);
    $('#admin_body').toggle(true);
  })

  $('#show_customer_button').click(function(){
    $('#customer_scroll_body').toggle(true);
    $('#turnaway_scroll_body').toggle(false);
    $('#timesheet_body').toggle(false);
    $('#admin_body').toggle(false);
  })

  $('#show_turnaway_button').click(function(){
    $('#customer_scroll_body').toggle(false);
    $('#turnaway_scroll_body').toggle(true);
    $('#timesheet_body').toggle(false);
    $('#admin_body').toggle(false);
  })

  $('#show_timesheet_button').click(function(){
    $('#customer_scroll_body').toggle(false);
    $('#turnaway_scroll_body').toggle(false);
    $('#timesheet_body').toggle(true);
    $('#admin_body').toggle(false);
  })

  $('#add_customer').click(function(){
    var mdate=new Date()

    in_store_number=in_store_number+1
    saveSingleToLocalStorage(ptr_in_store_number, in_store_number)

    todays_total.total=todays_total.total+1
    saveObjectToLocalStorage(ptr_todays_total, todays_total)
    
    current_half_number=current_half_number+1
    saveSingleToLocalStorage(ptr_current_half_number, current_half_number)

    var e = mdate.getHours() + ":"
    if (mdate.getMinutes()<30){
      e=e + "0"
    }
    else {
      e=e+"30"
    }
    todays_tracking[e]=todays_tracking[e]+1
    saveObjectToLocalStorage(ptr_todays_tracking, todays_tracking)

    $('#current_half_number').val(current_half_number)
    $('#todays_total').val(todays_total.total)
    $('#in_store_number').val(in_store_number)

    drawTodaysTrackingChart()
  })
  ////////////////////////////////////////////////////
  //STOP ONCLICK SETUPS///////////////////////////////
  ////////////////////////////////////////////////////


  ////////////////////////////////////////////////////
  //START FUNCTION SETUPS/////////////////////////////
  ////////////////////////////////////////////////////
  function getClock(){
    var d=new Date();
    var nhour=d.getHours(),nmin=d.getMinutes();
    if(nmin<=9) nmin="0"+nmin
    document.getElementById('clockbox').innerHTML=""+nhour+":"+nmin+"";
  }

  function halfHourCheck(){
    var d=new Date();
    var nhour=d.getHours(),nmin=d.getMinutes();
    if(nmin<=9) nmin="0"+nmin
    if(nmin==0 && d.getSeconds()<5){
      current_half_number=0
    }
    if(nmin==30 && d.getSeconds()<5){
      current_half_number=0
    }
    $('#current_half_number').val(current_half_number)
  }

  function getDataBaseInfo(customers, timesheets, totals, turnaways){
    if(customers){
      firebase.database().ref('customers').on('value', function(snapshot){
        all_customers=snapshot.val();
        Materialize.toast('Customer History Loaded!', 2000)
      })
    }
    if(timesheets){
      firebase.database().ref('timesheets').on('value', function(snapshot){
        all_timesheets=snapshot.val();
        Materialize.toast('Timesheet History Loaded!', 2000)
      })
    }
    if(totals){
      firebase.database().ref('total').on('value', function(snapshot){
        all_totals=snapshot.val();
        Materialize.toast('Daily Total History Loaded!', 2000)
      })
    }
    if(turnaways){
      firebase.database().ref('turnaways').on('value', function(snapshot){
        all_turnaways=snapshot.val();
        Materialize.toast('Turnaway History Loaded!', 2000)
      })
    }
  }

  function saveSingleToLocalStorage(label, data){
    localStorage.setItem(label, data)
  }

  function saveObjectToLocalStorage(label, data){
    var e=JSON.stringify(data)
    localStorage.setItem(label, e)
  }

  function saveAllToLocalStorage(){
    saveObjectToLocalStorage(ptr_todays_total, todays_total)
    saveSingleToLocalStorage(ptr_current_half_number, current_half_number)
    saveSingleToLocalStorage(ptr_in_store_number, in_store_number)

    saveObjectToLocalStorage(ptr_todays_tracking, todays_tracking)
    saveObjectToLocalStorage(ptr_todays_turnaways, todays_turnaways)
    saveObjectToLocalStorage(ptr_todays_timesheets, todays_timesheets)

    saveObjectToLocalStorage(ptr_all_totals, all_totals)
    saveObjectToLocalStorage(ptr_all_customers, all_customers)
    saveObjectToLocalStorage(ptr_all_turnaways, all_turnaways)
    saveObjectToLocalStorage(ptr_all_timesheets, all_timesheets)
  }

  function loadAllFromLocalStorage(){
    if(localStorage.getItem(ptr_todays_total)){

      todays_total=JSON.parse(localStorage.getItem(ptr_todays_total))
    } else {
      todays_total={"date":date, "total":0}
    }
    if(localStorage.getItem(ptr_in_store_number)){
      in_store_number=localStorage.getItem(ptr_in_store_number)
    } else{
      in_store_number=0
    }

    if(localStorage.getItem(ptr_todays_tracking)){

      todays_tracking=JSON.parse(localStorage.getItem(ptr_todays_tracking))

    } else {
      console.log('got em')
      todays_tracking={'8:00':0, '8:30':0, '9:00':0, '9:30':0,'10:00':0, '10:30':0,
        '11:00':0, '11:30':0,'12:00':0, '12:30':0,'13:00':0, '13:30':0,'14:00':0, '14:30':0,
        '15:00':0, '15:30':0,'16:00':0, '16:30':0,'17:00':0, '17:30':0,'18:00':0, '18:30':0,
        '19:00':0, '19:30':0,'20:00':0, '20:30':0,'21:00':0, '21:30':0,'22:00':0, '22:30':0,}
    }
    if(localStorage.getItem(ptr_todays_turnaways)){
      todays_turnaways=JSON.parse(localStorage.getItem(ptr_todays_turnaways))
    } else {
      todays_turnaways=[]
    }
    if(localStorage.getItem(ptr_todays_timesheets)){
      todays_timesheets=JSON.parse(localStorage.getItem(ptr_todays_timesheets))
    } else {
      todays_timesheets=[]
    }

    if(localStorage.getItem(ptr_all_totals)){
      all_totals=JSON.parse(localStorage.getItem(ptr_all_totals))
    }
    if(localStorage.getItem(ptr_all_customers)){
      all_customers=JSON.parse(localStorage.getItem(ptr_all_customers))
    }
    if(localStorage.getItem(ptr_all_turnaways)){
      all_turnaways=JSON.parse(localStorage.getItem(ptr_all_turnaways))
    }
    if(localStorage.getItem(ptr_all_timesheets)){
      all_timesheets=JSON.parse(localStorage.getItem(ptr_all_timesheets))
    }

  }

  function drawTodaysTrackingChart() {
    var keys = Object.keys(todays_tracking)
    var graph_data = [["Time", "Customers"]]
    for(var i = 0; i<keys.length; i++){
      var key = keys[i]
      graph_data[i+1]=[keys[i], todays_tracking[key]]
    }

    // var data = google.visualization.arrayToDataTable(graph_data);
    //
    // var options = {
    //   title: 'Customer Log',
    //   hAxis: {title: 'Time',  titleTextStyle: {color: '#333'}},
    //   vAxis: {minValue: 0}
    // };
    //
    // var chart = new google.visualization.AreaChart(document.getElementById('chart_div'));
    // chart.draw(data, options);
  }
  ////////////////////////////////////////////////////
  //STOP FUNCTION SETUPS/////////////////////////////\
  ////////////////////////////////////////////////////

})
