

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
  var current_half_number
  var fresh_load=0

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
  var ptr_all_turnaways="all_turnaways"

  var all_customers, all_timesheets, all_totals, all_turnaways;
  getDataBaseInfo(true, true, true)
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
  $('#clear_button').click(function(){
    clearStorage()
    location.reload();
    Materialize.toast('Local Storage Cleared!', 4000)
  })

  $('#save_button').click(function(){
    saveAllToDataBase()
  })

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

    all_customers[date][getTime()]=all_customers[date][getTime()]+1
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
    console.log('leaving customer')
    in_store_number=parseInt(in_store_number)-1
    saveSingleToLocalStorage(ptr_in_store_number, in_store_number)
    $('#in_store_number').val(in_store_number)
  })

  $('#entering_customer').click(function(){
    console.log('entering customer')
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
    var name = $("#timesheet_name").val()
    all_timesheets[date][name]=new Timesheet(name)
    var refString="timesheets/" + date
    saveToDataBase(refString, all_timesheets[date])
    console.log("added")
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

  function getDataBaseInfo(customers, timesheets, turnaways){
    if(customers){
      firebase.database().ref('customers').on('value', function(snapshot){
        //pull all customers
        all_customers=snapshot.val();
        //if there is not already tracking info for today..
        if(!all_customers[date]){
          //make a new tracking sheet and save it to the db
          all_customers[date]=new Tracker()
          database.ref('customers/'+date).set(all_customers[date]).then(console.log('saveeed'))
        }
        //on data change, write proper values to UI
        updateUI()
      })
    }
    if(timesheets){
      firebase.database().ref('timesheets').on('value', function(snapshot){
        all_timesheets=snapshot.val();
        //Materialize.toast('Timesheet History Loaded!', 2000)
      })
    }
    if(turnaways){
      firebase.database().ref('turnaways').on('value', function(snapshot){
        all_turnaways=snapshot.val();
        //Materialize.toast('Turnaway History Loaded!', 2000)
        updateUI()
      })
    }
  }

  function saveToDataBase(ref, data){
    database.ref(ref).set(data).then(console.log('saved to db'))
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

  function getTime(){
    var mdate=new Date()
    var e = mdate.getHours() + ":"
    if (mdate.getMinutes()<30){
      e=e + "00"
    }
    else {
      e=e+"30"
    }
    return e
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

  function updateUI(){
    console.log(all_turnaways)

    if(all_customers) {
      $('#current_half_number').val(all_customers[date][getTime()])
      $('#todays_total').val(getDailyTotal(date))
      drawTodaysTrackingChart()
    }

    if(all_turnaways){
      if ( all_turnaways[date] ) {
        for (var i = 0; i<all_turnaways[date].length; i++){
          var e = $('<tr><td>' + all_turnaways[date][i].name + '</td><td>' + all_turnaways[date][i].time + '</td><td>' + all_turnaways[date][i].reason + '</td></tr>')
          $('#turnaway_table_body').append(e)
        }
      }
    }

    if(all_timesheets) {
      if ( all_timesheets[date] ) {
        console.log(all_timesheets[date])
        var keys = Object.keys(all_timesheets[date])
        for (var i = 0; i < keys.length ; i++){
          var e=$(
            '<tr><td><input id="name_'+i+'" type="text"></input></td><td><input id="start_' +i +'" type="text" class="timepicker"></td><td><input id="break1out_'+i+'" type="text" class="timepicker"></td><td><input id="break1in_'+i+'" type="text" class="timepicker"></td><td><input id="lunchout_'+i+'" type="text" class="timepicker"></td><td><input id="lunchin_'+i+'"  type="text" class="timepicker"></td><td><input id="break2out_'+i+'" type="text" class="timepicker"></td><td><input id="break2in_'+i+'" type="text" class="timepicker"></td><td><input id="end_'+i+'" type="text" class="timepicker"></td><td id="total_'+i+'">0</td></tr>'
          )
          $('#timesheet_table').append(e)
          console.log(all_timesheets[date][keys[i]].name)
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
          canceltext: 'Cancel', // Text for cancel-button
          autoclose: false, // automatic close timepicker
          ampmclickable: true, // make AM PM clickable
          aftershow: function(){} //Function for after opening timepicker
        });
      }
    }

  }

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
