$(document).ready(function(){

  var config = {
    apiKey: "AIzaSyC00TPfdhQDZ-lqMtgJa9g82sfLjAJ3-g8",
    authDomain: "potzone-crm.firebaseapp.com",
    databaseURL: "https://potzone-crm.firebaseio.com"
  };
  firebase.initializeApp(config);
  google.charts.load('current', {'packages':['corechart']})

  /////////////////////////////////////////////////////
  //START OBJECT SETUPS////////////////////////////////
  /////////////////////////////////////////////////////
  function Turnaway(name, reason){
    this.name = name
    this.time = getCurrentTime()
    this.reason = reason
  }

  function Timesheet(name, start, break_1_out, break_1_in, lunch_out, lunch_in, break_2_out, break_2_in, out, total){
    if (name){
      this.name=name
    } else {
      this.name='no_name'
    }
    if(start){
      this.start=start
    } else {
      this.start='00:00'
    }
    if(break_1_out){
      this.break_1_out=break_1_out
    } else {
      this.break_1_out='00:00'
    }
    if(break_1_in){
      this.break_1_in=break_1_in
    } else {
      this.break_1_in='00:00'
    }
    if(lunch_out){
      this.lunch_out=lunch_out
    } else {
      this.lunch_out='00:00'
    }
    if(lunch_in){
      this.lunch_in=lunch_in
    } else {
      this.lunch_in='00:00'
    }
    if(break_2_out){
      this.break_2_out=break_2_out
    } else {
      this.break_2_out='00:00'
    }
    if(break_2_in){
      this.break_2_in=break_2_in
    } else {
      this.break_2_in='00:00'
    }
    if(out){
      this.out=out
    } else {
      this.out='00:00'
    }
    if(total){
      this.total=total
    } else {
      this.total=0
    }

  }

  function Tracker(){
    return {'08:00':0, '08:30':0, '09:00':0, '09:30':0,'10:00':0, '10:30':0,
      '11:00':0, '11:30':0,'12:00':0, '12:30':0,'13:00':0, '13:30':0,'14:00':0, '14:30':0,
      '15:00':0, '15:30':0,'16:00':0, '16:30':0,'17:00':0, '17:30':0,'18:00':0, '18:30':0,
      '19:00':0, '19:30':0,'20:00':0, '20:30':0,'21:00':0, '21:30':0,'22:00':0, '22:30':0}
  }


  /////////////////////////////////////////////////////
  //END OBJECT SETUPS//////////////////////////////////
  /////////////////////////////////////////////////////


  /////////////////////////////////////////////////////
  //START VARIABLE SETUPS//////////////////////////////
  /////////////////////////////////////////////////////
  var database=firebase.database()


  var in_store_number
  var ptr_in_store_number="in_store_number"

  var all_customers, all_timesheets, all_totals, all_turnaways;
  $('#date').val(getTodaysDate())
  $('#21on_date').val(getTwentyOneOnDate())
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
    drawDailyTotalHistoryChart()
    drawCustomerTrackingHistoryChart()
  })

  $('#show_customer_button').click(function(){
    $('#customer_scroll_body').toggle(true);
    $('#turnaway_scroll_body').toggle(false);
    $('#timesheet_body').toggle(false);
    $('#admin_body').toggle(false);
    drawTodaysTrackingChart()
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

  $('#admin_customer_tracking_button').click(function(){
    $('#admin_customer_tracking_button').css('background-color', '#4CAF50')
    $('#admin_timesheet_button').css('background-color', '#F44336')
    $('#admin_turnaway_button').css('background-color', '#F44336')

    $('#admin_customer_body').toggle(true)
    $('#admin_turnaway_body').toggle(false)
    $('#admin_timesheet_body').toggle(false)

    drawDailyTotalHistoryChart()
    drawCustomerTrackingHistoryChart()
  })

  $('#admin_timesheet_button').click(function(){
    $('#admin_customer_tracking_button').css('background-color', '#F44336')
    $('#admin_timesheet_button').css('background-color', '#4CAF50')
    $('#admin_turnaway_button').css('background-color', '#F44336')

    $('#admin_customer_body').toggle(false)
    $('#admin_turnaway_body').toggle(false)
    $('#admin_timesheet_body').toggle(true)
  })

  $('#admin_turnaway_button').click(function(){
    $('#admin_customer_tracking_button').css('background-color', '#F44336')
    $('#admin_timesheet_button').css('background-color', '#F44336')
    $('#admin_turnaway_button').css('background-color', '#4CAF50')

    $('#admin_customer_body').toggle(false)
    $('#admin_turnaway_body').toggle(true)
    $('#admin_timesheet_body').toggle(false)
  })

  $('#by_person_timesheets').click(function(){
    $('#show_person_timesheets').toggle(true)
    $('#show_date_timesheets').toggle(false)
  })

  $('#by_date_timesheets').click(function(){
    $('#show_person_timesheets').toggle(false)
    $('#show_date_timesheets').toggle(true)
  })

  $('#add_customer').click(function(){

    in_store_number=parseInt(in_store_number)+1
    saveSingleToLocalStorage(ptr_in_store_number, in_store_number)
    all_customers[getTodaysDate()][getTime()]=parseInt(all_customers[getTodaysDate()][getTime()])+1
    var refString="customers/" + getTodaysDate() + "/" + getTime()
    saveToDataBase(refString, all_customers[getTodaysDate()][getTime()])
    refString="total/" + getTodaysDate()
    saveToDataBase(refString, getDailyTotal(getTodaysDate()))

    $('#in_store_number').val(in_store_number)

    drawTodaysTrackingChart()
  })

  $('#minus_customer').click(function(){
    in_store_number=parseInt(in_store_number)-1
    saveSingleToLocalStorage(ptr_in_store_number, in_store_number)

    all_customers[getTodaysDate()][getTime()]=all_customers[getTodaysDate()][getTime()]-1
    var refString="customers/" + getTodaysDate() + "/" + getTime()
    saveToDataBase(refString, all_customers[getTodaysDate()][getTime()])
    refString="total/" + getTodaysDate()
    saveToDataBase(refString, getDailyTotal(getTodaysDate()))

    $('#in_store_number').val(in_store_number)

    drawTodaysTrackingChart()
  })

  $('#leaving_customer').click(function(){

    in_store_number=parseInt(in_store_number)-1
    saveSingleToLocalStorage(ptr_in_store_number, in_store_number)
    $('#in_store_number').val(in_store_number)
  })

  $('#entering_customer').click(function(){

    in_store_number=parseInt(in_store_number)+1
    saveSingleToLocalStorage(ptr_in_store_number, in_store_number)
    $('#in_store_number').val(in_store_number)
  })

  $('#submit_turnaway').click(function(){
    var name = $('#turnaway_name').val();
    var reason = ""
    if($('#turnaway_reason').val()==1){
      reason = "No ID"
    } else if($('#turnaway_reason').val()==2){
      reason = "Expired ID"
    } else if($('#turnaway_reason').val()==3){
      reason = "Fake ID"
    } else if($('#turnaway_reason').val()==4){
      reason = "Underage"
    } else if($('#turnaway_reason').val()==5){
      reason = "Other"
    }
    if(!all_turnaways){
      all_turnaways={}
    }
    if (!all_turnaways[getTodaysDate()]){
      all_turnaways[getTodaysDate()]=[]
    }
    all_turnaways[getTodaysDate()].push(new Turnaway(name, reason))
    var refString="turnaways/" + getTodaysDate()
    saveToDataBase(refString, all_turnaways[getTodaysDate()])
  })

  $('#new_timesheet_button').click(function(){
    if (!all_timesheets){
      all_timesheets={}
      all_timesheets[getTodaysDate()]={}
    }
    if ( !all_timesheets[getTodaysDate()]) {
      all_timesheets[getTodaysDate()] = {}
    }
    var name = $("#timesheet_name").val()
    all_timesheets[getTodaysDate()][name]=new Timesheet(name)
    var refString="timesheets/" + getTodaysDate()
    saveToDataBase(refString, all_timesheets[getTodaysDate()])

  })

  $("#save_employee_button").click(function(){
    var keys = Object.keys(all_timesheets[getTodaysDate()])
    for (var i = 0; i < keys.length ; i++){
        all_timesheets[getTodaysDate()][keys[i]].name=$('#ename_'+i).val()
        all_timesheets[getTodaysDate()][keys[i]].start=$('#estart_'+i).val()
        all_timesheets[getTodaysDate()][keys[i]].break_1_out=$('#ebreak1out_'+i).val()
        all_timesheets[getTodaysDate()][keys[i]].break_1_in=$('#ebreak1in_'+i).val()
        all_timesheets[getTodaysDate()][keys[i]].lunch_out=$('#elunchout_'+i).val()
        all_timesheets[getTodaysDate()][keys[i]].lunch_in=$('#elunchin_'+i).val()
        all_timesheets[getTodaysDate()][keys[i]].break_2_out=$('#ebreak2out_'+i).val()
        all_timesheets[getTodaysDate()][keys[i]].break_2_in=$('#ebreak2in_'+i).val()
        all_timesheets[getTodaysDate()][keys[i]].out=$('#eend_'+i).val()
        //When they enter a start and end time, calculate the total
        if($('#estart_'+i).val()!='00:00' && $('#eend_'+i).val()!='00:00') {
          var start=$('#estart_'+i).val()
          var end=$('#eend_'+i).val()
          var lunch=false
          //if they took a lunch set it to true
          if($('#elunchout_'+i).val()!='00:00') {
            lunch=true
          }
          //get total time
          var total_time=getTotalTime(start, end, lunch)
          all_timesheets[getTodaysDate()][keys[i]].total=total_time
        }
        //until they enter a end and start time, total hours is 0
        else {
          all_timesheets[getTodaysDate()][keys[i]].total=0
        }

      }
      var refString="timesheets/"+getTodaysDate()
      saveToDataBase(refString, all_timesheets[getTodaysDate()], true)
      updateUI(false, true, false)
  })

  $("#load_timesheet").click(function(){
    var selected_name=""
    if($('#select_employee').val()==1){
      selected_name="Craig"
    } else if($('#select_employee').val()==2){
      selected_name="Mallory"
    } else if($('#select_employee').val()==3){
      selected_name="Austin"
    } else if($('#select_employee').val()==4){
      selected_name="James"
    } else if($('#select_employee').val()==5){
      selected_name="Marcus"
    } else if($('#select_employee').val()==6){
      selected_name="Cathy"
    } else if($('#select_employee').val()==7){
      selected_name="Danae"
    } else if($('#select_employee').val()==8){
      selected_name="Kory"
    } else if($('#select_employee').val()==9){
      selected_name="Jesse"
    }
    var employee_timesheet=[]
    var keys = Object.keys(all_timesheets)
    for(var i=0; i<keys.length; i++){
      if(all_timesheets[keys[i]][selected_name]){
        employee_timesheet.push(new Timesheet(keys[i], all_timesheets[keys[i]][selected_name].start, all_timesheets[keys[i]][selected_name].break_1_out, all_timesheets[keys[i]][selected_name].break_1_in, all_timesheets[keys[i]][selected_name].lunch_out, all_timesheets[keys[i]][selected_name].lunch_in, all_timesheets[keys[i]][selected_name].break_2_out, all_timesheets[keys[i]][selected_name].break_2_in, all_timesheets[keys[i]][selected_name].out, all_timesheets[keys[i]][selected_name].total))
      }
    }
    $('#by_person_table').empty()
    for(var i=0;i<employee_timesheet.length;i++){
      var e=$(
        '<tr><td><input id="name_'+i+'" type="text"></input></td><td><input id="start_' +i +'" type="text" ></td><td><input id="break1out_'+i+'" type="text"></td><td><input id="break1in_'+i+'" type="text" class="timepicker"></td><td><input id="lunchout_'+i+'" type="text" class="timepicker"></td><td><input id="lunchin_'+i+'"  type="text" class="timepicker"></td><td><input id="break2out_'+i+'" type="text" class="timepicker"></td><td><input id="break2in_'+i+'" type="text" class="timepicker"></td><td><input id="end_'+i+'" type="text" class="timepicker"></td><td><input  id="total_'+i+'"type="text"></input></td></tr>'
      )
      $('#by_person_table').append(e)
      $('#name_'+i).val(employee_timesheet[i].name)
      $('#start_'+i).val(employee_timesheet[i].start)
      $('#break1out_'+i).val(employee_timesheet[i].break_1_out)
      $('#break1in_'+i).val(employee_timesheet[i].break_1_in)
      $('#lunchout_'+i).val(employee_timesheet[i].lunch_out)
      $('#lunchin_'+i).val(employee_timesheet[i].lunch_in)
      $('#break2out_'+i).val(employee_timesheet[i].break_2_out)
      $('#break2in_'+i).val(employee_timesheet[i].break_2_in)
      $('#end_'+i).val(employee_timesheet[i].out)
      $('#total_'+i).val(employee_timesheet[i].total)
    }

  })

  $("#load_timesheet2").click(function(){
    var selected_dates_timesheets = all_timesheets[parseDate($("#pick_timesheet_date").val())]
    var keys = Object.keys(selected_dates_timesheets)
    $('#by_date_table').empty()
    for(var i = 0; i < keys.length; i++){
      var e=$(
        '<tr><td><input id="iname_'+i+'" type="text"></input></td><td><input id="istart_' +i +'" type="text" ></td><td><input id="ibreak1out_'+i+'" type="text"></td><td><input id="ibreak1in_'+i+'" type="text" class="timepicker"></td><td><input id="ilunchout_'+i+'" type="text" class="timepicker"></td><td><input id="ilunchin_'+i+'"  type="text" class="timepicker"></td><td><input id="ibreak2out_'+i+'" type="text" class="timepicker"></td><td><input id="ibreak2in_'+i+'" type="text" class="timepicker"></td><td><input id="iend_'+i+'" type="text" class="timepicker"></td><td><input  id="itotal_'+i+'"type="text"></input></td></tr>'
      )
      $('#by_date_table').append(e)
      $('#iname_'+i).val(selected_dates_timesheets[keys[i]].name)
      $('#istart_'+i).val(selected_dates_timesheets[keys[i]].start)
      $('#ibreak1out_'+i).val(selected_dates_timesheets[keys[i]].break_1_out)
      $('#ibreak1in_'+i).val(selected_dates_timesheets[keys[i]].break_1_in)
      $('#ilunchout_'+i).val(selected_dates_timesheets[keys[i]].lunch_out)
      $('#ilunchin_'+i).val(selected_dates_timesheets[keys[i]].lunch_in)
      $('#ibreak2out_'+i).val(selected_dates_timesheets[keys[i]].break_2_out)
      $('#ibreak2in_'+i).val(selected_dates_timesheets[keys[i]].break_2_in)
      $('#iend_'+i).val(selected_dates_timesheets[keys[i]].out)
      $('#itotal_'+i).val(selected_dates_timesheets[keys[i]].total)
    }

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
    document.getElementById('clockbox2').innerHTML=""+nhour+":"+nmin+"";
  }

  function halfHourCheck(){
    if(all_customers){
      $('#current_half_number').val(all_customers[getTodaysDate()][getTime()])
    }
  }

  function clearStorage(){
    localStorage.clear()
  }

  function getDataBaseInfo(customers, timesheets, turnaways, totals){
    if(customers){
      firebase.database().ref('customers').on('value', function(snapshot){
        //pull all customers
        all_customers=snapshot.val();
        //if there is not already tracking info for today..
        if(!all_customers[getTodaysDate()]){
          //make a new tracking sheet and save it to the db
          all_customers[getTodaysDate()]=new Tracker()
          database.ref('customers/'+getTodaysDate()).set(all_customers[getTodaysDate()])
        }
        //on data change, write proper values to UI
        updateUI(true, false, false, false)
      })
    }
    if(timesheets){
      firebase.database().ref('timesheets').on('value', function(snapshot){
        all_timesheets=snapshot.val();
        //Materialize.toast('Timesheet History Loaded!', 2000)
        updateUI(false, true, false, false)
      })
    }
    if(turnaways){
      firebase.database().ref('turnaways').on('value', function(snapshot){
        all_turnaways=snapshot.val();
        //Materialize.toast('Turnaway History Loaded!', 2000)
        updateUI(false, false, true, false)
      })
    }
    if(totals){
      firebase.database().ref('total').on('value', function(snapshot){
        all_totals=snapshot.val()

        updateUI(false, false, false, true)
      })
    }
  }

  function saveToDataBase(ref, data, toast){
    if(toast){
      database.ref(ref).set(data).then(function(){
        Materialize.toast('Saved!', 2000)
      })
    } else {
      database.ref(ref).set(data)
    }

  }

  function saveAllToDataBase() {
    firebase.database().ref('customers/' + getTodaysDate()).set(all_customers[getTodaysDate()]).then(function(){
      Materialize.toast('Customer Log Saved', 2000)
    })
    // firebase.database().ref('turnaways/' + date).set(all_turnaways[date]).then(function(){
    //   Materialize.toast('Turnaway Log Saved', 2000)
    // })
    // firebase.database().ref('timesheets/' + date).set(all_timesheets[date]).then(function(){
    //   Materialize.toast('Timesheets Saved', 2000)
    // })
    firebase.database().ref('total/' + getTodaysDate()).set( getDailyTotal(getTodaysDate())).then(function(){
      Materialize.toast('Total Count Saved', 2000)
    })
  }

  function saveSingleToLocalStorage(label, data){
    localStorage.setItem(label, data)
  }

  function saveObjectToLocalStorage(label, data){
    var e=JSON.stringify(data)
    localStorage.setItem(label, e)
  }

  function saveAllToLocalStorage(){

    saveSingleToLocalStorage(ptr_current_half_number, current_half_number)
    saveSingleToLocalStorage(ptr_in_store_number, in_store_number)
  }

  function loadAllFromLocalStorage(){

    if(!isNaN(localStorage.getItem(ptr_in_store_number))){
      in_store_number=localStorage.getItem(ptr_in_store_number)
    } else{
      in_store_number=0
    }
    $('#in_store_number').val(in_store_number)

  }

  function drawTodaysTrackingChart() {
    var keys = Object.keys(all_customers[getTodaysDate()])
    var graph_data = [["Time", "Customers"]]
    for(var i = 0; i<keys.length; i++){
      var key = keys[i]
      graph_data[i+1]=[keys[i], all_customers[getTodaysDate()][key]]
    }

    var data = google.visualization.arrayToDataTable(graph_data);

    var options = {
      title: 'Customer Log',
      hAxis: {title: 'Time',  titleTextStyle: {color: '#333'}},
      vAxis: {minValue: 0},
      legend: {position: 'none'}
    };

    var chart = new google.visualization.AreaChart(document.getElementById('chart_div'));
    chart.draw(data, options);
  }

  function drawCustomerTrackingHistoryChart(){
    var keys = Object.keys(all_customers)
    var graph_data = [["Time"]]
    for(var i = 0; i<keys.length;i++){
      graph_data[0][i+1]=keys[i]
      var daily_keys = Object.keys(all_customers[keys[i]])
      for (var h = 0;h<daily_keys.length; h++) {

        if(!graph_data[h+1]) {
          graph_data[h+1]=[]
        }
        if (!graph_data[h+1][i+1]){
          graph_data[h+1][i+1]=0
        }
        graph_data[h+1][0]=daily_keys[h]
        graph_data[h+1][i+1]=all_customers[keys[i]][daily_keys[h]]
      }
    }
    var data = google.visualization.arrayToDataTable(graph_data);

    var options = {
      title: 'Customer Tracking History',
      hAxis: {title: 'Date',  titleTextStyle: {color: '#333'}},
      vAxis: {minValue: 0},
      curveType: 'function'
    };

    var chart = new google.visualization.LineChart(document.getElementById('manager_chart2_div'));
    chart.draw(data, options);
  }

  function drawDailyTotalHistoryChart(){
    var keys = Object.keys(all_totals)
    var graph_data = [["Date", "Total", {role: 'style'}]]
    for (var i = 0; i <keys.length; i++){
      var color = ''
      if (i==0){
        color='blue'
      } else if (i==1){
        color='red'
      } else if (i==2){
        color='orange'
      } else if (i==3){
        color='green'
      }
      graph_data.push([keys[i], all_totals[keys[i]], color])
    }
    var data = google.visualization.arrayToDataTable(graph_data);

   var options = {
     title: 'Daily Total History',
     hAxis: {title: 'Time',  titleTextStyle: {color: '#333'}},
     vAxis: {minValue: 0},
     legend: {position: 'none'}
   };

   var chart = new google.visualization.BarChart(document.getElementById('manager_chart1_div'));
   chart.draw(data, options);
  }

  function getTime(){
    var mdate=new Date()
    var e = ""
    if (mdate.getHours()<10){
      e="0" + mdate.getHours() + ":"
    }
    else {
      e=e+mdate.getHours() + ":"
    }
    if (mdate.getMinutes()<30){
      e=e + "00"
    }
    else {
      e=e+"30"
    }
    return e
  }

  function getCurrentTime(){
    var d=new Date();
    var nhour=d.getHours(),nmin=d.getMinutes();
    if(nmin<=9) nmin="0"+nmin
    return nhour + ":" + nmin
  }

  function getTotalTime(start, end, lunch){
    start_hours=start.split(":")[0]
    start_minutes=start.split(":")[1]
    end_hours=end.split(":")[0]
    end_minutes=end.split(":")[1]
    var total_hours=end_hours-start_hours
    var total_minutes=end_minutes-start_minutes
    if (lunch){
      total_minutes=total_minutes-30
    }
    //minutes between 0 and 9
    if (total_minutes>=0 && total_minutes<=9) {
      total_minutes='00'
    }
    //minutes between 10 and 22
    else if (total_minutes>=10 && total_minutes<=22) {
      total_minutes='25'
    }
    //minutes between 23 and 37
    else if (total_minutes>=23 && total_minutes<=37) {
      total_minutes='50'
    }
    //minutes between 38 and 52
    else if (total_minutes>=38 && total_minutes<=52) {
      total_minutes='50'
    }
    //round hours UP
    else if (total_minutes>=52 && total_minutes<=59) {
      total_minutes='00'
      total_hours++
    }

    else if (total_minutes<=-1 && total_minutes>=-8){
      total_minutes='00'
    }
    else if (total_minutes<=-9 && total_minutes>=-22){
      total_minutes='75'
      total_hours--
    }
    else if (total_minutes<=-23 && total_minutes>=-37){
      total_minutes='50'
      total_hours--
    }
    else if (total_minutes<=-38 && total_minutes>=-52){
      total_minutes='25'
      total_hours--
    }
    else if (total_minutes<=-53 && total_minutes>=-59){
      total_minutes='00'
      total_hours--
    }
    return total_hours+"."+total_minutes
  }

  function getTwentyOneOnDate(){
    var e = new Date()

    var o = e.getFullYear()-21+"-"
    if(parseInt(e.getMonth()+1)<10) {
      o = o +'0'+parseInt(e.getMonth()+1) +'-'
    } else {
      o = o + parseInt(e.getMonth()+1) + '-'
    }
    if(e.getDate()<10){
      o = o+"0"+e.getDate()
    } else {
      o=o+e.getDate()
    }
    return o;
  }

  function getTodaysDate(){
    var e = new Date()
    var o = e.getFullYear()+"-"
    if(parseInt(e.getMonth()+1)<10) {
      o = o +'0'+parseInt(e.getMonth()+1) +'-'
    } else {
      o = o + parseInt(e.getMonth()+1) + '-'
    }
    if(e.getDate()<10){
      o = o+"0"+e.getDate()
    } else {
      o=o+e.getDate()
    }
    return o;
  }

  function getDailyTotal(edate){
    var e = 0
    var keys = Object.keys(all_customers[edate])
    for (var i = 0; i < keys.length; i++){
      var key = keys[i]
      e = e + all_customers[edate][key]
    }
    return e
  }

  function parseDate(edate){
    var e = edate.split(" ")
    var year = e[2]
    var month = ""
    if(e[1]=="January,") {
      month = "01"
    } else if(e[1]=="February,") {
      month = "02"
    } else if(e[1]=="March,") {
      month = "03"
    } else if(e[1]=="April,") {
      month = "04"
    } else if(e[1]=="May,") {
      month = "05"
    } else if(e[1]=="June,") {
      month = "06"
    } else if(e[1]=="July,") {
      month = "07"
    } else if(e[1]=="August,") {
      month = "08"
    } else if(e[1]=="September,") {
      month = "09"
    } else if(e[1]=="October,") {
      month = "10"
    } else if(e[1]=="November,") {
      month = "11"
    } else if(e[1]=="December,") {
      month = "12"
    }
    var day = ""
    if(parseInt(e[0])>=10) {
      day = e[0]
    } else {
      day = "0" + e[0]
    }
    var parsed_date=year+"-"+month+"-"+day
    return parsed_date
  }

  function updateUI(customers, timesheets, turnaways, totals){


    if(all_customers && customers) {
      $('#current_half_number').val(all_customers[getTodaysDate()][getTime()])
      $('#todays_total').val(getDailyTotal(getTodaysDate()))
      drawTodaysTrackingChart()
      drawCustomerTrackingHistoryChart()
    }

    if(all_turnaways && turnaways){
      if ( all_turnaways[getTodaysDate()] ) {
        $('#turnaway_table_body').empty()
        for (var i = 0; i<all_turnaways[getTodaysDate()].length; i++){
          var e = $('<tr><td>' + all_turnaways[getTodaysDate()][i].name + '</td><td>' + all_turnaways[getTodaysDate()][i].time + '</td><td>' + all_turnaways[getTodaysDate()][i].reason + '</td></tr>')
          $('#turnaway_table_body').append(e)
        }
      }
    }

    if(all_timesheets && timesheets) {
      if ( all_timesheets[getTodaysDate()] ) {
        $('#timesheet_table').empty()
        var keys = Object.keys(all_timesheets[getTodaysDate()])
        for (var i = 0; i < keys.length ; i++){

            var e=$(
              '<tr><td><input id="ename_'+i+'" type="text"></input></td><td><input id="estart_' +i +'" type="text" class="timepicker"></td><td><input id="ebreak1out_'+i+'" type="text" class="timepicker"></td><td><input id="ebreak1in_'+i+'" type="text" class="timepicker"></td><td><input id="elunchout_'+i+'" type="text" class="timepicker"></td><td><input id="elunchin_'+i+'"  type="text" class="timepicker"></td><td><input id="ebreak2out_'+i+'" type="text" class="timepicker"></td><td><input id="ebreak2in_'+i+'" type="text" class="timepicker"></td><td><input id="eend_'+i+'" type="text" class="timepicker"></td><td><input  id="etotal_'+i+'"type="text"></input></td></tr>'
            )
            $('#timesheet_table').append(e)

            $('#ename_'+i).val(all_timesheets[getTodaysDate()][keys[i]].name)
            $('#estart_'+i).val(all_timesheets[getTodaysDate()][keys[i]].start)
            $('#ebreak1out_'+i).val(all_timesheets[getTodaysDate()][keys[i]].break_1_out)
            $('#ebreak1in_'+i).val(all_timesheets[getTodaysDate()][keys[i]].break_1_in)
            $('#elunchout_'+i).val(all_timesheets[getTodaysDate()][keys[i]].lunch_out)
            $('#elunchin_'+i).val(all_timesheets[getTodaysDate()][keys[i]].lunch_in)
            $('#ebreak2out_'+i).val(all_timesheets[getTodaysDate()][keys[i]].break_2_out)
            $('#ebreak2in_'+i).val(all_timesheets[getTodaysDate()][keys[i]].break_2_in)
            $('#eend_'+i).val(all_timesheets[getTodaysDate()][keys[i]].out)
            $('#etotal_'+i).val(all_timesheets[getTodaysDate()][keys[i]].total)

          }

        $('.timepicker').pickatime({
          default: 'now', // Set default time: 'now', '1:30AM', '16:30'
          fromnow: 0,       // set default time to * milliseconds from now (using with default = 'now')
          twelvehour: false, // Use AM/PM or 24-hour format
          donetext: 'OK', // text for done-button
          cleartext: 'Clear', // text for clear-button
          autoclose: false, // automatic close timepicker
          ampmclickable: true, // make AM PM clickable
          aftershow: function(){
            console.log('lalal')
          } //Function for after opening timepicker
        });
      }
    }
    if(all_totals && totals) {
      drawDailyTotalHistoryChart()
    }
  }

  //create trigger to resizeEnd event
  $(window).resize(function() {
    if(this.resizeTO) clearTimeout(this.resizeTO);
    this.resizeTO = setTimeout(function() {
        $(this).trigger('resizeEnd');
    }, 500);
  });

  //redraw graph when window resize is completed
  $(window).on('resizeEnd', function() {
    drawTodaysTrackingChart();
    drawDailyTotalHistoryChart()
    drawCustomerTrackingHistoryChart()
  });


    //Materialize initialization
    $('#modal1').modal();
    $('#modal3').modal();
    $('select').material_select();
    $('.datepicker').pickadate({
      selectMonths: true, // Creates a dropdown to control month
      selectYears: 15, // Creates a dropdown of 15 years to control year,
      today: 'Today',
      clear: 'Clear',
      close: 'Ok',
      closeOnSelect: false // Close upon selecting a date,
    });

  ////////////////////////////////////////////////////
  //STOP FUNCTION SETUPS/////////////////////////////\
  ////////////////////////////////////////////////////

})
