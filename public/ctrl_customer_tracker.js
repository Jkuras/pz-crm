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
  var authentication=firebase.auth()
  var user=null


  var in_store_number
  var ptr_in_store_number="in_store_number"

  var all_customers, all_timesheets, all_totals, all_turnaways;
  $('#date').val(getTodaysDate())
  $('#21on_date').val(getTwentyOneOnDate())
  //getDataBaseInfo(true, true, true, true)
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
    updateUI(true, true, true, true)
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
    $('#admin_profile_button').css('background-color', '#F44336')

    $('#admin_customer_body').toggle(true)
    $('#admin_turnaway_body').toggle(false)
    $('#admin_timesheet_body').toggle(false)
    $('#admin_profile_body').toggle(false)

    updateUI(true, true, true, true)
  })

  $('#admin_timesheet_button').click(function(){
    $('#admin_customer_tracking_button').css('background-color', '#F44336')
    $('#admin_timesheet_button').css('background-color', '#4CAF50')
    $('#admin_turnaway_button').css('background-color', '#F44336')
    $('#admin_profile_button').css('background-color', '#F44336')

    $('#admin_customer_body').toggle(false)
    $('#admin_turnaway_body').toggle(false)
    $('#admin_timesheet_body').toggle(true)
    $('#admin_profile_body').toggle(false)
  })

  $('#admin_turnaway_button').click(function(){
    $('#admin_customer_tracking_button').css('background-color', '#F44336')
    $('#admin_timesheet_button').css('background-color', '#F44336')
    $('#admin_turnaway_button').css('background-color', '#4CAF50')
    $('#admin_profile_button').css('background-color', '#F44336')

    $('#admin_customer_body').toggle(false)
    $('#admin_turnaway_body').toggle(true)
    $('#admin_timesheet_body').toggle(false)
    $('#admin_profile_body').toggle(false)
  })

  $('#admin_profile_button').click(function(){
    $('#admin_customer_tracking_button').css('background-color', '#F44336')
    $('#admin_timesheet_button').css('background-color', '#F44336')
    $('#admin_turnaway_button').css('background-color', '#F44336')
    $('#admin_profile_button').css('background-color', '#4CAF50')

    $('#admin_customer_body').toggle(false)
    $('#admin_turnaway_body').toggle(false)
    $('#admin_timesheet_body').toggle(false)
    $('#admin_profile_body').toggle(true)
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
    if(parseInt(in_store_number)+1>16){
      var $toastContent = $('<span>Store At Capacity! Start A Line!</span>');
      Materialize.toast($toastContent, 10000);
    } else {
      in_store_number=parseInt(in_store_number)+1
      saveSingleToLocalStorage(ptr_in_store_number, in_store_number)
      all_customers[getTodaysDate()][getTime()]=parseInt(all_customers[getTodaysDate()][getTime()])+1
      var refString=authentication.currentUser.uid +"/customers/" + getTodaysDate() + "/" + getTime()
      saveToDataBase(refString, all_customers[getTodaysDate()][getTime()])
      refString=authentication.currentUser.uid +"/total/" + getTodaysDate()
      saveToDataBase(refString, getDailyTotal(getTodaysDate()))
      var in_store_progress = ((in_store_number/16)*100).toString() + '%'
      $('#in_store_progress').css('width', in_store_progress)
      $('#in_store_number').val(in_store_number)
      console.log(in_store_progress)
      drawTodaysTrackingChart()
    }

  })

  $('#minus_customer').click(function(){
    in_store_number=parseInt(in_store_number)-1
    saveSingleToLocalStorage(ptr_in_store_number, in_store_number)

    all_customers[getTodaysDate()][getTime()]=all_customers[getTodaysDate()][getTime()]-1
    var refString=authentication.currentUser.uid +"/customers/" + getTodaysDate() + "/" + getTime()
    saveToDataBase(refString, all_customers[getTodaysDate()][getTime()])
    refString=authentication.currentUser.uid +"/total/" + getTodaysDate()
    saveToDataBase(refString, getDailyTotal(getTodaysDate()))
    var in_store_progress = ((in_store_number/16)*100).toString() + '%'
    $('#in_store_progress').css('width', in_store_progress)
    $('#in_store_number').val(in_store_number)
console.log(in_store_progress)
    drawTodaysTrackingChart()
  })

  $('#leaving_customer').click(function(){

    in_store_number=parseInt(in_store_number)-1
    saveSingleToLocalStorage(ptr_in_store_number, in_store_number)
    var in_store_progress = ((in_store_number/16)*100).toString() + '%'
    $('#in_store_progress').css('width', in_store_progress)
    $('#in_store_number').val(in_store_number)
    console.log(in_store_progress)
  })

  $('#entering_customer').click(function(){
    if(parseInt(in_store_number)+1>16){
      var $toastContent = $('<span>Store At Capacity! Start A Line!</span>');
      Materialize.toast($toastContent, 10000);
    } else {
      in_store_number=parseInt(in_store_number)+1
      saveSingleToLocalStorage(ptr_in_store_number, in_store_number)
      var in_store_progress = ((in_store_number/16)*100).toString() + '%'
      $('#in_store_progress').css('width', in_store_progress)
      $('#in_store_number').val(in_store_number)
      console.log(in_store_progress)
    }

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
    var refString=authentication.currentUser.uid +"/turnaways/" + getTodaysDate()
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
    all_timesheets[getTodaysDate()][name.toString().toUpperCase()]=new Timesheet(name)
    var refString=authentication.currentUser.uid +"/timesheets/" + getTodaysDate()
    saveToDataBase(refString, all_timesheets[getTodaysDate()])

  })

  $("#save_employee_button").click(function(){
    var keys = Object.keys(all_timesheets[getTodaysDate()])
    for (var i = 0; i < keys.length ; i++){
        name_key=keys[i].toString().toUpperCase()
        all_timesheets[getTodaysDate()][name_key].name=$('#ename_'+i).val()
        all_timesheets[getTodaysDate()][name_key].start=$('#estart_'+i).val()
        all_timesheets[getTodaysDate()][name_key].break_1_out=$('#ebreak1out_'+i).val()
        all_timesheets[getTodaysDate()][name_key].break_1_in=$('#ebreak1in_'+i).val()
        all_timesheets[getTodaysDate()][name_key].lunch_out=$('#elunchout_'+i).val()
        all_timesheets[getTodaysDate()][name_key].lunch_in=$('#elunchin_'+i).val()
        all_timesheets[getTodaysDate()][name_key].break_2_out=$('#ebreak2out_'+i).val()
        all_timesheets[getTodaysDate()][name_key].break_2_in=$('#ebreak2in_'+i).val()
        all_timesheets[getTodaysDate()][name_key].out=$('#eend_'+i).val()
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
          all_timesheets[getTodaysDate()][name_key].total=total_time
        }
        //until they enter a end and start time, total hours is 0
        else {
          all_timesheets[getTodaysDate()][name_key].total=0
        }

      }
      var refString=authentication.currentUser.uid +"/timesheets/"+getTodaysDate()
      saveToDataBase(refString, all_timesheets[getTodaysDate()], true)
      updateUI(false, true, false)
  })

  $("#load_timesheet").click(function(){
    var selected_name=getSelectedEmployee()
    var employee_timesheet=[]
    var pay_period_total = 0
    var keys = getPayPeriodKeys($('#select_time_period').val())
    for(var i=0; i<keys.length; i++){
      if(all_timesheets[keys[i]] && all_timesheets[keys[i]][selected_name]){
        employee_timesheet.push(new Timesheet(keys[i], all_timesheets[keys[i]][selected_name].start, all_timesheets[keys[i]][selected_name].break_1_out, all_timesheets[keys[i]][selected_name].break_1_in, all_timesheets[keys[i]][selected_name].lunch_out, all_timesheets[keys[i]][selected_name].lunch_in, all_timesheets[keys[i]][selected_name].break_2_out, all_timesheets[keys[i]][selected_name].break_2_in, all_timesheets[keys[i]][selected_name].out, all_timesheets[keys[i]][selected_name].total))
      }
    }
    $('#by_person_table').empty()
    for(var i=0;i<employee_timesheet.length;i++){
      pay_period_total += parseFloat(employee_timesheet[i].total)
      var e=$(
        '<tr><td><input id="name_'+i+'" type="text"></input></td><td><input id="start_' +i +'" type="text" class="timepicker" ></td><td><input id="break1out_'+i+'" type="text" class="timepicker"></td><td><input id="break1in_'+i+'" type="text" class="timepicker"></td><td><input id="lunchout_'+i+'" type="text" class="timepicker"></td><td><input id="lunchin_'+i+'"  type="text" class="timepicker"></td><td><input id="break2out_'+i+'" type="text" class="timepicker"></td><td><input id="break2in_'+i+'" type="text" class="timepicker"></td><td><input id="end_'+i+'" type="text" class="timepicker"></td><td><input  id="total_'+i+'"type="text"></input></td></tr>'
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
      if(employee_timesheet[i].start != '00:00' && employee_timesheet[i].end != '00:00') {
        var lunch = false
        if(employee_timesheet[i].lunch_out != '00:00') {
          lunch = true
        }


        $('#total_' +i).val(getTotalTime(employee_timesheet[i].start, employee_timesheet[i].out, lunch))
      }
    }
    $('#pay_period_total').val(pay_period_total)
    $('.timepicker').pickatime({
      default: 'now', // Set default time: 'now', '1:30AM', '16:30'
      fromnow: 0,       // set default time to * milliseconds from now (using with default = 'now')
      twelvehour: false, // Use AM/PM or 24-hour format
      donetext: 'OK', // text for done-button
      cleartext: 'Clear', // text for clear-button
      autoclose: false, // automatic close timepicker
      ampmclickable: true, // make AM PM clickable
      aftershow: function(){

      } //Function for after opening timepicker
    });
  })

  $('#save_timesheet').click(function(){
    var selected_name=getSelectedEmployee()
    var selected_pay_period=getPayPeriodKeys($('#select_time_period').val())


    for(var i = 0; i < $('#by_person_table').children().length; i++){
      var mdate = $('#name_' + i).val()
      var refString = authentication.currentUser.uid +"/timesheets/" + mdate + '/' + selected_name
      var total_time = 0
      var lunch = false
      if($('#start_'+i).val() != '00:00' && $('#end_'+i).val() != '00:00') {
        if ($('#lunchout_'+i).val()!='00:00') {
          lunch = true
        }
        total_time=getTotalTime($('#start_'+i).val(), $('#end_'+i).val(), lunch)
        //TODO: HERE
        $('#total_' + i).val(total_time)
      }
      var data = new Timesheet(selected_name, $('#start_' + i).val(), $('#break1out_' + i).val(), $('#break1in_' + i).val(), $('#lunchout_' + i).val(), $('#lunchin_' + i).val(), $('#break2out_' + i).val(), $('#break2in_' + i).val(), $('#end_' + i).val(), total_time)
      saveToDataBase(refString, data, true)
    }

  })

  $('#submit_timesheet').click(function(){
    var selected_name=getSelectedEmployee()
    var selected_date=parseDate($("#mdate").val())
    var refString= authentication.currentUser.uid +'/timesheets/' + selected_date + '/' + selected_name
    var data = new Timesheet(selected_name, $("#mstart").val(), $("#mbreak1out").val(), $("#mbreak1in").val(), $("#mlunchout").val(), $("#mlunchin").val(), $("#mbreak2out").val(), $("#mbreak2in").val(), $("#mend").val())
    saveToDataBase(refString, data)
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
    $('.timepicker').pickatime({
      default: 'now', // Set default time: 'now', '1:30AM', '16:30'
      fromnow: 0,       // set default time to * milliseconds from now (using with default = 'now')
      twelvehour: false, // Use AM/PM or 24-hour format
      donetext: 'OK', // text for done-button
      cleartext: 'Clear', // text for clear-button
      autoclose: false, // automatic close timepicker
      ampmclickable: true, // make AM PM clickable
      aftershow: function(){

      } //Function for after opening timepicker
    });

  })

  $('#apply_filter').click(function(){
    var selected_filter = $('#select_filter').val()
     if(selected_filter==1){
       filterByDay($('#select_by_day').val(), $('#select_num_by_day').val())
     } else if(selected_filter==2){
       filterByWeek($('#by_week_start_date').val())
     } else if(selected_filter==3){
       filterDailyAverages($('#select_daily_average').val())
     } else if(selected_filter==4){
       filterTopFive($('#select_top_5').val())
     }
  })

  $('#select_filter').change(function(){
    if($('#select_filter').val()==1){
      $('#by_day_filter').toggle(true)
      $('#by_week_filter').toggle(false)
      $('#top_5_filter').toggle(false)
      $('#daily_average_filter').toggle(false)
    }
    if($('#select_filter').val()==2){
      $('#by_day_filter').toggle(false)
      $('#by_week_filter').toggle(true)
      $('#top_5_filter').toggle(false)
      $('#daily_average_filter').toggle(false)
    }
    if($('#select_filter').val()==3){
      $('#by_day_filter').toggle(false)
      $('#by_week_filter').toggle(false)
      $('#top_5_filter').toggle(false)
      $('#daily_average_filter').toggle(true)
    }
    if($('#select_filter').val()==4){
      $('#by_day_filter').toggle(false)
      $('#by_week_filter').toggle(false)
      $('#top_5_filter').toggle(true)
      $('#daily_average_filter').toggle(false)
    }
  })

  $('#submit_edit_customer').click(function(){
    var data = parseInt($('#edit_customer_input').val())
    var time_keys = Object.keys(all_customers[getTodaysDate()])
    var refString = authentication.currentUser.uid +"/customers/" + getTodaysDate() + "/" + time_keys[$('#select_edit_customer').val()-1]
    saveToDataBase(refString, data, true)
  })

  $('#select_edit_customer').change(function(){
    var keys = Object.keys(all_customers)
    if($('#select_edit_customer').val()==1){
      $('#edit_customer_input').val(all_customers[getTodaysDate()]['08:00'])
    }
    if($('#select_edit_customer').val()==2){
      $('#edit_customer_input').val(all_customers[getTodaysDate()]['08:30'])
    }
    if($('#select_edit_customer').val()==3){
      $('#edit_customer_input').val(all_customers[getTodaysDate()]['09:00'])
    }
    if($('#select_edit_customer').val()==4){
      $('#edit_customer_input').val(all_customers[getTodaysDate()]['09:30'])
    }
    if($('#select_edit_customer').val()==5){
      $('#edit_customer_input').val(all_customers[getTodaysDate()]['10:00'])
    }
    if($('#select_edit_customer').val()==6){
      $('#edit_customer_input').val(all_customers[getTodaysDate()]['10:30'])
    }
    if($('#select_edit_customer').val()==7){
      $('#edit_customer_input').val(all_customers[getTodaysDate()]['11:00'])
    }
    if($('#select_edit_customer').val()==8){
      $('#edit_customer_input').val(all_customers[getTodaysDate()]['11:30'])
    }
    if($('#select_edit_customer').val()==9){
      $('#edit_customer_input').val(all_customers[getTodaysDate()]['12:00'])
    }
    if($('#select_edit_customer').val()==10){
      $('#edit_customer_input').val(all_customers[getTodaysDate()]['12:30'])
    }
    if($('#select_edit_customer').val()==11){
      $('#edit_customer_input').val(all_customers[getTodaysDate()]['13:00'])
    }
    if($('#select_edit_customer').val()==12){
      $('#edit_customer_input').val(all_customers[getTodaysDate()]['13:30'])
    }
    if($('#select_edit_customer').val()==13){
      $('#edit_customer_input').val(all_customers[getTodaysDate()]['14:00'])
    }
    if($('#select_edit_customer').val()==14){
      $('#edit_customer_input').val(all_customers[getTodaysDate()]['14:30'])
    }
    if($('#select_edit_customer').val()==15){
      $('#edit_customer_input').val(all_customers[getTodaysDate()]['15:00'])
    }
    if($('#select_edit_customer').val()==16){
      $('#edit_customer_input').val(all_customers[getTodaysDate()]['15:30'])
    }
    if($('#select_edit_customer').val()==17){
      $('#edit_customer_input').val(all_customers[getTodaysDate()]['16:00'])
    }
    if($('#select_edit_customer').val()==18){
      $('#edit_customer_input').val(all_customers[getTodaysDate()]['16:30'])
    }
    if($('#select_edit_customer').val()==19){
      $('#edit_customer_input').val(all_customers[getTodaysDate()]['17:00'])
    }
    if($('#select_edit_customer').val()==20){
      $('#edit_customer_input').val(all_customers[getTodaysDate()]['17:30'])
    }
    if($('#select_edit_customer').val()==21){
      $('#edit_customer_input').val(all_customers[getTodaysDate()]['18:00'])
    }
    if($('#select_edit_customer').val()==22){
      $('#edit_customer_input').val(all_customers[getTodaysDate()]['18:30'])
    }
    if($('#select_edit_customer').val()==23){
      $('#edit_customer_input').val(all_customers[getTodaysDate()]['19:00'])
    }
    if($('#select_edit_customer').val()==24){
      $('#edit_customer_input').val(all_customers[getTodaysDate()]['19:30'])
    }
    if($('#select_edit_customer').val()==25){
      $('#edit_customer_input').val(all_customers[getTodaysDate()]['20:00'])
    }
    if($('#select_edit_customer').val()==26){
      $('#edit_customer_input').val(all_customers[getTodaysDate()]['20:30'])
    }
    if($('#select_edit_customer').val()==27){
      $('#edit_customer_input').val(all_customers[getTodaysDate()]['21:00'])
    }
    if($('#select_edit_customer').val()==28){
      $('#edit_customer_input').val(all_customers[getTodaysDate()]['21:30'])
    }
    if($('#select_edit_customer').val()==29){
      $('#edit_customer_input').val(all_customers[getTodaysDate()]['22:00'])
    }
    if($('#select_edit_customer').val()==30){
      $('#edit_customer_input').val(all_customers[getTodaysDate()]['22:30'])
    }
  })

  $('#sign_in_button').click(function(){
    var email = $('#email').val()
    var password = $('#password').val()
    if(ValidateEmail(email)){
      signInUser(email, password)
    }
  })

  $('#sign_up_button').click(function(){
    var email = $('#email').val()
    var password = $('#password').val()
    if(ValidateEmail(email)){
      createNewUser(email, password)
    }
  })

  $('#sign_out_button').click(function(){
    authentication.signOut()
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
      firebase.database().ref(authentication.currentUser.uid+'/customers').on('value', function(snapshot){
        //pull all customers
        if(!snapshot.val()){
          all_customers={}
        } else {
          all_customers=snapshot.val();
        }

        //if there is not already tracking info for today..
        if(!all_customers[getTodaysDate()]){
          //make a new tracking sheet and save it to the db
          all_customers[getTodaysDate()]=new Tracker()
          database.ref(authentication.currentUser.uid+'/customers/'+getTodaysDate()).set(all_customers[getTodaysDate()])
        }
        //on data change, write proper values to UI
        updateUI(true, false, false, false)
        if(authentication.currentUser.uid){
          var refString=authentication.currentUser.uid+"/customers"
          saveToDataBase(refString, all_customers)
        }
      })


    }
    if(timesheets){
      firebase.database().ref(authentication.currentUser.uid+'/timesheets').on('value', function(snapshot){
        all_timesheets=snapshot.val();
        //Materialize.toast('Timesheet History Loaded!', 2000)
        updateUI(false, true, false, false)
        if(authentication.currentUser.uid){
          var refString=authentication.currentUser.uid+"/timesheets"
          saveToDataBase(refString, all_timesheets)
        }
      })

    }
    if(turnaways){
      firebase.database().ref(authentication.currentUser.uid+'/turnaways').on('value', function(snapshot){
        all_turnaways=snapshot.val();
        //Materialize.toast('Turnaway History Loaded!', 2000)
        updateUI(false, false, true, false)
        if(authentication.currentUser.uid){
          var refString=authentication.currentUser.uid+"/turnaways"
          saveToDataBase(refString, all_turnaways)
        }
      })

    }
    if(totals){
      firebase.database().ref(authentication.currentUser.uid+'/total').on('value', function(snapshot){
        all_totals=snapshot.val()

        updateUI(false, false, false, true)
        //console.log(user)
        if(authentication.currentUser.uid){
          var refString=authentication.currentUser.uid+"/total"
          saveToDataBase(refString, all_totals)
        }
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
    firebase.database().ref(authentication.currentUser.uid+'/customers/' + getTodaysDate()).set(all_customers[getTodaysDate()]).then(function(){
      Materialize.toast('Customer Log Saved', 2000)
    })
    // firebase.database().ref('turnaways/' + date).set(all_turnaways[date]).then(function(){
    //   Materialize.toast('Turnaway Log Saved', 2000)
    // })
    // firebase.database().ref('timesheets/' + date).set(all_timesheets[date]).then(function(){
    //   Materialize.toast('Timesheets Saved', 2000)
    // })
    firebase.database().ref(authentication.currentUser.uid+'/total/' + getTodaysDate()).set( getDailyTotal(getTodaysDate())).then(function(){
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
    var in_store_progress = ((in_store_number/16)*100).toString() + '%'
    $('#in_store_progress').css('width', in_store_progress)
    $('#in_store_number').val(in_store_number)
console.log(in_store_progress)
  }

  function filterByDay(day, numDays){
    var selected_day = ""
    if (day == 1) {
      selected_day="Monday"
    } else if (day == 2) {
      selected_day="Tuesday"
    } else if (day == 3) {
      selected_day="Wednesday"
    } else if (day == 4) {
      selected_day="Thursday"
    } else if (day == 5) {
      selected_day="Friday"
    } else if (day == 6) {
      selected_day="Saturday"
    } else if (day == 7) {
      selected_day="Sunday"
    }
    var keys = Object.keys(all_totals)
    var filtered_list = {}
    var filtered_tracking={}
    var e = 0
    for(var i = keys.length-1; i > 0; i--){
      if(parseWeekday(keys[i])==selected_day){
        filtered_list[keys[i]]=all_totals[keys[i]]
        filtered_tracking[keys[i]]=all_customers[keys[i]]
      }
      if(Object.keys(filtered_list).length == numDays){
        break
      }
      e++
    }
    drawDailyTotalHistoryChart(filtered_list)
    drawCustomerTrackingHistoryChart(filtered_tracking)
  }

  function filterByWeek(startDay){
    //TODO: add catch for invalid start dates
    var filtered_totals={}
    var filtered_tracking={}
    var start_date=parseDate(startDay)
    var keys=Object.keys(all_totals)
    for(var i = keys.indexOf(start_date); i < keys.indexOf(start_date)+7; i++){
      if(all_totals[keys[i]]){
        filtered_totals[keys[i]] = all_totals[keys[i]]
      }
      if(all_customers[keys[i]]){
        filtered_tracking[keys[i]] = all_customers[keys[i]]
      }

    }

    drawDailyTotalHistoryChart(filtered_totals)
    drawCustomerTrackingHistoryChart(filtered_tracking)
  }

  function filterDailyAverages(days){
    //TODO: find averages for daily tracking (aka cry and die)
    var named_days = {}
    var named_tracking = {}
    for(var i = 0; i<days.length; i++){
      var e = ""
      if (days[i] == 1) {
        e="Monday"
      } else if (days[i] == 2) {
        e="Tuesday"
      } else if (days[i] == 3) {
        e="Wednesday"
      } else if (days[i] == 4) {
        e="Thursday"
      } else if (days[i] == 5) {
        e="Friday"
      } else if (days[i] == 6) {
        e="Saturday"
      } else if (days[i] == 7) {
        e="Sunday"
      }
      named_days[e]=0
      named_tracking[e] = new Tracker()
    }
    var keys = Object.keys(named_days)
    var total_keys = Object.keys(all_totals)
    var customer_keys = Object.keys(all_customers)
    for(var i = 0; i<keys.length; i++){
      //Calculate the average of daily totals one by one
      var daily_average = 0
      var divide_by = 0
      for(var o = 0; o<total_keys.length; o++){
        if(parseWeekday(total_keys[o])==keys[i]){
          daily_average+=all_totals[total_keys[o]]
          divide_by++
        }
      }
      named_days[keys[i]]=daily_average/divide_by
      divide_by = 0
      var half_hour_keys = Object.keys(named_tracking[keys[i]])
      //go through the list of all customer tracking objects
      for(var x = 0; x<customer_keys.length; x++){
        //find all the trackers that correspond to the current day (keys[i] is the current day)
        if(parseWeekday(customer_keys[x])==keys[i]){

          for (var y = 0; y < half_hour_keys.length; y++){
            named_tracking[keys[i]][half_hour_keys[y]] = named_tracking[keys[i]][half_hour_keys[y]] + all_customers[customer_keys[x]][half_hour_keys[y]]
          }
          divide_by++
        }
      }
      for(var l = 0; l < half_hour_keys.length; l++){
        named_tracking[keys[i]][half_hour_keys[l]]=named_tracking[keys[i]][half_hour_keys[l]]/divide_by
      }


    }
    //half-hourly averages

    drawCustomerTrackingHistoryChart(named_tracking)
    drawDailyTotalHistoryChart(named_days)
  }

  function filterTopFive(range){
    //TODO: add filters
    var top_5_totals = {}

    var keys = Object.keys(all_totals)
    var values = Object.values(all_totals)
    for(var i = 0; i < values.length; i++){
      if(i<5){
        top_5_totals[keys[i]]=values[i]
      } else {
        for(var e = 0; e < 5; e++){
          var top_5_keys = Object.keys(top_5_totals)
          if(values[i]>top_5_totals[top_5_keys[e]]){
            //if it is greater than another total, add it in and...

            top_5_totals[keys[i]]=values[i]

            //remove the lowest total
            delete top_5_totals[top_5_keys[indexOfSmallest(Object.values(top_5_totals))]]
            break
          }
        }

      }
    }
    console.log(top_5_totals)
    var top_5_keys = Object.keys(top_5_totals)
    var top_5_tracking = {}
    top_5_tracking[top_5_keys[0]]=all_customers[top_5_keys[0]]
    top_5_tracking[top_5_keys[1]]=all_customers[top_5_keys[1]]
    top_5_tracking[top_5_keys[2]]=all_customers[top_5_keys[2]]
    top_5_tracking[top_5_keys[3]]=all_customers[top_5_keys[3]]
    top_5_tracking[top_5_keys[4]]=all_customers[top_5_keys[4]]

    drawDailyTotalHistoryChart(top_5_totals)
    drawCustomerTrackingHistoryChart(top_5_tracking)
  }

  function indexOfSmallest(a) {
   var lowest = 0;
   for (var i = 1; i < a.length; i++) {
    if (a[i] < a[lowest]) lowest = i;
   }
   return lowest;
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

  function drawCustomerTrackingHistoryChart(mdata){

    var keys = Object.keys(mdata)
    //keys = keys.slice(Math.max(keys.length-7, 1))
    var graph_data = [["Time"]]
    for(var i = 0; i<keys.length;i++){
      graph_data[0][i+1]=keys[i]
      var daily_keys = Object.keys(mdata[keys[i]])
      for (var h = 0;h<daily_keys.length; h++) {

        if(!graph_data[h+1]) {
          graph_data[h+1]=[]
        }
        if (!graph_data[h+1][i+1]){
          graph_data[h+1][i+1]=0
        }
        graph_data[h+1][0]=daily_keys[h]
        graph_data[h+1][i+1]=mdata[keys[i]][daily_keys[h]]
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

  function drawDailyTotalHistoryChart(mdata){
    var keys = Object.keys(mdata)
    var graph_data = [["Date", "Total", {role: 'style'}]]
    var color_counter=0
    for (var i = 0; i <keys.length; i++){
      var color = ''
      if (color_counter==0){
        color='blue'
      } else if (color_counter==1){
        color='red'
      } else if (color_counter==2){
        color='orange'
      } else if (color_counter==3){
        color='green'
      } else if (color_counter==4) {
        color='purple'
      } else if (color_counter==5) {
        color='#01a0ff'
      } else if (color_counter==6) {
        color='pink'
      }
      graph_data.push([keys[i], mdata[keys[i]], color])
      color_counter++
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

  function getPayPeriodKeys(e){
    var year = new Date().getFullYear()
    var keys = []
    if(e==1){
      for(var i = 0; i <15; i++){
        if(i+1<10){
          keys.push(year + '-01-0' + (i+1))
        } else {
          keys.push(year + '-01-' + (i+1))
        }
      }
    }
    if(e==2){
      for(var i = 16; i <32; i++){
        keys.push(year + '-01-' + i)
      }
    }
    if(e==3){
      for(var i = 0; i <15; i++){
        if(i+1<10){
          keys.push(year + '-02-0' + (i+1))
        } else {
          keys.push(year + '-02-' + (i+1))
        }
      }
    }
    if(e==4){
      for(var i = 16; i <30; i++){
        keys.push(year + '-02-' + i)
      }
    }
    if(e==5){
      for(var i = 0; i <15; i++){
        if(i+1<10){
          keys.push(year + '-03-0' + (i+1))
        } else {
          keys.push(year + '-03-' + (i+1))
        }
      }
    }
    if(e==6){
      for(var i = 16; i <32; i++){
        keys.push(year + '-03-' + i)
      }
    }
    if(e==7){
      for(var i = 0; i <15; i++){
        if(i+1<10){
          keys.push(year + '-04-0' + (i+1))
        } else {
          keys.push(year + '-04-' + (i+1))
        }
      }
    }
    if(e==8){
      for(var i = 16; i <31; i++){
        keys.push(year + '-04-' + i)
      }
    }
    if(e==9){
      for(var i = 0; i <15; i++){
        if(i+1<10){
          keys.push(year + '-05-0' + (i+1))
        } else {
          keys.push(year + '-05-' + (i+1))
        }
      }
    }
    if(e==10){
      for(var i = 16; i <32; i++){
        keys.push(year + '-05-' + i)
      }
    }
    if(e==11){
      for(var i = 0; i <15; i++){
        if(i+1<10){
          keys.push(year + '-06-0' + (i+1))
        } else {
          keys.push(year + '-06-' + (i+1))
        }
      }
    }
    if(e==12){
      for(var i = 16; i <31; i++){
        keys.push(year + '-06-' + i)
      }
    }
    if(e==13){
      for(var i = 0; i <15; i++){
        if(i+1<10){
          keys.push(year + '-07-0' + (i+1))
        } else {
          keys.push(year + '-07-' + (i+1))
        }
      }
    }
    if(e==14){
      for(var i = 16; i <32; i++){
        keys.push(year + '-07-' + i)
      }
    }
    if(e==15){
      for(var i = 0; i <15; i++){
        if(i+1<10){
          keys.push(year + '-08-0' + (i+1))
        } else {
          keys.push(year + '-08-' + (i+1))
        }
      }
    }
    if(e==16){
      for(var i = 16; i <32; i++){
        keys.push(year + '-08-' + i)
      }
    }
    if(e==17){
      for(var i = 0; i <15; i++){
        if(i+1<10){
          keys.push(year + '-09-0' + (i+1))
        } else {
          keys.push(year + '-09-' + (i+1))
        }
      }
    }
    if(e==18){
      for(var i = 16; i <31; i++){
        keys.push(year + '-09-' + i)
      }
    }
    if(e==19){
      for(var i = 0; i <15; i++){
        if(i+1<10){
          keys.push(year + '-10-0' + (i+1))
        } else {
          keys.push(year + '-10-' + (i+1))
        }
      }
    }
    if(e==20){
      for(var i = 16; i <32; i++){
        keys.push(year + '-10-' + i)
      }
    }
    if(e==21){
      for(var i = 0; i <15; i++){
        if(i+1<10){
          keys.push(year + '-11-0' + (i+1))
        } else {
          keys.push(year + '-11-' + (i+1))
        }
      }
    }
    if(e==22){
      for(var i = 16; i <31; i++){
        keys.push(year + '-11-' + i)
      }
    }
    if(e==23){
      for(var i = 0; i <15; i++){
        if(i+1<10){
          keys.push(year + '-12-0' + (i+1))
        } else {
          keys.push(year + '-12-' + (i+1))
        }
      }
    }
    if(e==24){
      for(var i = 16; i <32; i++){
        keys.push(year + '-12-' + i)
      }
    }

    return keys
  }

  function getSelectedEmployee(){
    var selected_name = ""
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
    return selected_name.toUpperCase()
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

  function parseWeekday(date){
    var mdate = "invalid_date"
    var e = new Date(date)
    var o = e.getDay()
    if (o==6){
      mdate="Sunday"
    } else if (o==0){
      mdate="Monday"
    } else if (o==1){
      mdate="Tuesday"
    } else if (o==2){
      mdate="Wednesday"
    } else if (o==3){
      mdate="Thursday"
    } else if (o==4){
      mdate="Friday"
    } else if (o==5){
      mdate="Saturday"
    }
    return mdate
  }

  function ValidateEmail(mail) {
   if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
    {
      return (true)
    }
      alert("You have entered an invalid email address!")
      return (false)
  }

  function createNewUser(email, password){
    authentication.createUserWithEmailAndPassword(email, password).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
    });
  }

  function signInUser(email, password){
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
    });
  }

  authentication.onAuthStateChanged(function(user){
    user = authentication.currentUser
    if(user){
      $('#no_user').toggle(false)
      $('#signed_in').toggle(true)

      getDataBaseInfo(true, true, true, true)
      if(user.displayName){
        $('#welcome_text').text('Wecome, ' +user.displayName+"!")
      } else {
        $('#welcome_text').text('Wecome, ' +user.email+"!")
      }

    } else {
      $('#no_user').toggle(true)
      $('#signed_in').toggle(false)
    }
  })

  function updateUI(customers, timesheets, turnaways, totals){


    if(all_customers && customers) {
      $('#current_half_number').val(all_customers[getTodaysDate()][getTime()])
      $('#todays_total').val(getDailyTotal(getTodaysDate()))
      drawTodaysTrackingChart()
      var keys = Object.keys(all_customers)
      var last_week = {}
      var e = 0
      if(keys.length>7){
        for (var i = keys.length-7; i<keys.length; i++){
          last_week[keys[i]]=all_customers[keys[i]]
          e++
        }
        drawCustomerTrackingHistoryChart(last_week)
      } else {
        drawCustomerTrackingHistoryChart(all_customers)
      }



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

          } //Function for after opening timepicker
        });
      }
    }
    if(all_totals && totals) {

      var keys = Object.keys(all_totals)
      var last_week = {}
      var e = 0
      if(keys.length>7){
        for (var i = keys.length-7; i<keys.length; i++){
          last_week[keys[i]]=all_totals[keys[i]]
          e++
        }
        drawDailyTotalHistoryChart(last_week)
      } else {
        drawDailyTotalHistoryChart(all_totals)
      }

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
    updateUI(true, true, true, true)
  });

    //Materialize initialization
    $('#modal1').modal();
    $('#modal2').modal();
    $('#modal3').modal();
    $('#modal4').modal();
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
