

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
    this.time = new Date().getHours() + ":" + new Date().getMinutes()
    this.reason = reason
  }

  function Timesheet(name){
    this.name=name
    this.start='00:00'
    this.break_1_out='00:00'
    this.break_1_in='00:00'
    this.lunch_out='00:00'
    this.lunch_in='00:00'
    this.break_2_out='00:00'
    this.break_2_in='00:00'
    this.out='00:00'
    this.total=0
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
  var date = new Date().toJSON().slice(0,10)

  var in_store_number
  var ptr_in_store_number="in_store_number"

  var all_customers, all_timesheets, all_totals, all_turnaways;
  $('#date').val(date)
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

    in_store_number=parseInt(in_store_number)+1
    saveSingleToLocalStorage(ptr_in_store_number, in_store_number)
    console.log(getTime())
    all_customers[date][getTime()]=parseInt(all_customers[date][getTime()])+1
    var refString="customers/" + date + "/" + getTime()
    saveToDataBase(refString, all_customers[date][getTime()])
    refString="total/" + date
    saveToDataBase(refString, getDailyTotal(date))

    $('#in_store_number').val(in_store_number)

    drawTodaysTrackingChart()
  })

  $('#minus_customer').click(function(){
    in_store_number=parseInt(in_store_number)-1
    saveSingleToLocalStorage(ptr_in_store_number, in_store_number)

    all_customers[date][getTime()]=all_customers[date][getTime()]-1
    var refString="customers/" + date + "/" + getTime()
    saveToDataBase(refString, all_customers[date][getTime()])
    refString="total/" + date
    saveToDataBase(refString, getDailyTotal(date))

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
    if (!all_turnaways[date]){
      all_turnaways[date]=[]
    }
    all_turnaways[date].push(new Turnaway(name, reason))
    var refString="turnaways/" + date
    saveToDataBase(refString, all_turnaways[date])
  })

  $('#new_timesheet_button').click(function(){
    if (!all_timesheets){
      all_timesheets={}
      all_timesheets[date]={}
    }
    if ( !all_timesheets[date]) {
      all_timesheets[date] = {}
    }
    var name = $("#timesheet_name").val()
    all_timesheets[date][name]=new Timesheet(name)
    var refString="timesheets/" + date
    saveToDataBase(refString, all_timesheets[date])

  })

  $("#save_employee_button").click(function(){
    var keys = Object.keys(all_timesheets[date])
    for (var i = 0; i < keys.length ; i++){
        all_timesheets[date][keys[i]].name=$('#name_'+i).val()
        all_timesheets[date][keys[i]].start=$('#start_'+i).val()
        all_timesheets[date][keys[i]].break_1_out=$('#break1out_'+i).val()
        all_timesheets[date][keys[i]].break_1_in=$('#break1in_'+i).val()
        all_timesheets[date][keys[i]].lunch_out=$('#lunchout_'+i).val()
        all_timesheets[date][keys[i]].lunch_in=$('#lunchin_'+i).val()
        all_timesheets[date][keys[i]].break_2_out=$('#break2out_'+i).val()
        all_timesheets[date][keys[i]].break_2_in=$('#break2in_'+i).val()
        all_timesheets[date][keys[i]].out=$('#end_'+i).val()
        //When they enter a start and end time, calculate the total
        if($('#start_'+i).val()!='00:00' && $('#end_'+i).val()!='00:00') {
          var start=$('#start_'+i).val()
          var end=$('#end_'+i).val()
          var lunch=false
          //if they took a lunch set it to true
          if($('#lunchout_'+i).val()!='00:00') {
            lunch=true
          }
          //get total time
          var total_time=getTotalTime(start, end, lunch)
          all_timesheets[date][keys[i]].total=total_time
        }
        //until they enter a end and start time, total hours is 0
        else {
          all_timesheets[date][keys[i]].total=0
        }

      }
      var refString="timesheets/"+date
      saveToDataBase(refString, all_timesheets[date])
      updateUI(false, true, false)
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
      $('#current_half_number').val(all_customers[date][getTime()])
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
        if(!all_customers[date]){
          //make a new tracking sheet and save it to the db
          all_customers[date]=new Tracker()
          database.ref('customers/'+date).set(all_customers[date])
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
        console.log(all_totals)
        updateUI(false, false, false, true)
      })
    }
  }

  function saveToDataBase(ref, data){
    database.ref(ref).set(data)
  }

  function saveAllToDataBase() {
    firebase.database().ref('customers/' + date).set(all_customers[date]).then(function(){
      Materialize.toast('Customer Log Saved', 2000)
    })
    // firebase.database().ref('turnaways/' + date).set(all_turnaways[date]).then(function(){
    //   Materialize.toast('Turnaway Log Saved', 2000)
    // })
    // firebase.database().ref('timesheets/' + date).set(all_timesheets[date]).then(function(){
    //   Materialize.toast('Timesheets Saved', 2000)
    // })
    firebase.database().ref('total/' + date).set( getDailyTotal(date)).then(function(){
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

    if(!isNaN(localStorage.getItem(ptr_in_store_number))){
      in_store_number=localStorage.getItem(ptr_in_store_number)
    } else{
      in_store_number=0
    }
    $('#in_store_number').val(in_store_number)

  }

  function drawTodaysTrackingChart() {
    var keys = Object.keys(all_customers[date])
    var graph_data = [["Time", "Customers"]]
    for(var i = 0; i<keys.length; i++){
      var key = keys[i]
      graph_data[i+1]=[keys[i], all_customers[date][key]]
    }

    var data = google.visualization.arrayToDataTable(graph_data);

    var options = {
      title: 'Customer Log',
      hAxis: {title: 'Time',  titleTextStyle: {color: '#333'}},
      vAxis: {minValue: 0}
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
      console.log(graph_data)
    }
    var data = google.visualization.arrayToDataTable(graph_data);

    var options = {
      title: 'Customer Tracking History',
      hAxis: {title: 'Date',  titleTextStyle: {color: '#333'}},
      vAxis: {minValue: 0}
    };

    var chart = new google.visualization.AreaChart(document.getElementById('manager_chart2_div'));
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
        color='yellow'
      }
      graph_data.push([keys[i], all_totals[keys[i]], color])
    }
    var data = google.visualization.arrayToDataTable(graph_data);

   var options = {
     title: 'Customer Tracking History',
     hAxis: {title: 'Time',  titleTextStyle: {color: '#333'}},
     vAxis: {minValue: 0}
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
    console.log(e)
    var o = e.getFullYear()-21+"-"
    if(parseInt(e.getMonth()+1)<10) {
      o = o +'0'+parseInt(e.getMonth()+1) +'-'
    }
    if(e.getDate()<10){
      o = o+"0"+e.getDate()
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

  function updateUI(customers, timesheets, turnaways, totals){


    if(all_customers && customers) {
      $('#current_half_number').val(all_customers[date][getTime()])
      $('#todays_total').val(getDailyTotal(date))
      drawTodaysTrackingChart()
    }

    if(all_turnaways && turnaways){
      if ( all_turnaways[date] ) {
        $('#turnaway_table_body').empty()
        for (var i = 0; i<all_turnaways[date].length; i++){
          var e = $('<tr><td>' + all_turnaways[date][i].name + '</td><td>' + all_turnaways[date][i].time + '</td><td>' + all_turnaways[date][i].reason + '</td></tr>')
          $('#turnaway_table_body').append(e)
        }
      }
    }

    if(all_timesheets && timesheets) {
      if ( all_timesheets[date] ) {
        $('#timesheet_table').empty()
        var keys = Object.keys(all_timesheets[date])
        for (var i = 0; i < keys.length ; i++){

            var e=$(
              '<tr><td><input id="name_'+i+'" type="text"></input></td><td><input id="start_' +i +'" type="text" class="timepicker"></td><td><input id="break1out_'+i+'" type="text" class="timepicker"></td><td><input id="break1in_'+i+'" type="text" class="timepicker"></td><td><input id="lunchout_'+i+'" type="text" class="timepicker"></td><td><input id="lunchin_'+i+'"  type="text" class="timepicker"></td><td><input id="break2out_'+i+'" type="text" class="timepicker"></td><td><input id="break2in_'+i+'" type="text" class="timepicker"></td><td><input id="end_'+i+'" type="text" class="timepicker"></td><td><input  id="total_'+i+'"type="text"></input></td></tr>'
            )
            $('#timesheet_table').append(e)

            $('#name_'+i).val(all_timesheets[date][keys[i]].name)
            $('#start_'+i).val(all_timesheets[date][keys[i]].start)
            $('#break1out_'+i).val(all_timesheets[date][keys[i]].break_1_out)
            $('#break1in_'+i).val(all_timesheets[date][keys[i]].break_1_in)
            $('#lunchout_'+i).val(all_timesheets[date][keys[i]].lunch_out)
            $('#lunchin_'+i).val(all_timesheets[date][keys[i]].lunch_in)
            $('#break2out_'+i).val(all_timesheets[date][keys[i]].break_2_out)
            $('#break2in_'+i).val(all_timesheets[date][keys[i]].break_2_in)
            $('#end_'+i).val(all_timesheets[date][keys[i]].out)
            $('#total_'+i).val(all_timesheets[date][keys[i]].total)

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
    $('#modal2').modal();
    $('#modal3').modal();
    $('.collapsible').collapsible();
    $('select').material_select();

  ////////////////////////////////////////////////////
  //STOP FUNCTION SETUPS/////////////////////////////\
  ////////////////////////////////////////////////////

})
