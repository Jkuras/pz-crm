$(document).ready(function() {
  // Initialize Firebase
  // TODO: Replace with your project's customized code snippet
  var config = {
    apiKey: "AIzaSyC00TPfdhQDZ-lqMtgJa9g82sfLjAJ3-g8",
    authDomain: "potzone-crm.firebaseapp.com",
    databaseURL: "https://potzone-crm.firebaseio.com"
  };
  firebase.initializeApp(config);
  //BEGIN VARIABLE SETUPS
    var secret_button_count=0;
    var turnaway_list=[];
    var timesheet_list=[];
    var graph_data=[
      ['Time', 'Customers'],
      ['8:00',  0],
      ['8:30',  0],
      ['9:00',  0],
      ['9:30',  0],
      ['10:00',  0],
      ['10:30',  0],
      ['11:00',  0],
      ['11:30',  0],
      ['12:00',  0],
      ['12:30',  0],
      ['13:00',  0],
      ['13:30',  0],
      ['14:00',  0],
      ['14:30',  0],
      ['15:00',  0],
      ['15:30',  0],
      ['16:00',  0],
      ['16:30',  0],
      ['17:00',  0],
      ['17:30',  0],
      ['18:00',  0],
      ['18:30',  0],
      ['19:00',  0],
      ['19:30',  0],
      ['20:00',  0],
      ['20:30',  0],
      ['21:00',  0],
      ['21:30',  0],
      ['22:00',  0],
      ['22:30',  0]
    ];
    var all_customers, all_timesheets, all_totals, all_turnaways;
    firebase.database().ref('customers').on('value', function(snapshot){
      all_customers=snapshot.val();
      console.log(all_customers)
    })
    firebase.database().ref('timesheets').on('value', function(snapshot){
      all_timesheets=snapshot.val();
      console.log(all_timesheets)
    })
    firebase.database().ref('total').on('value', function(snapshot){
      all_totals=snapshot.val();
      console.log(all_totals)
    })
    firebase.database().ref('turnaways').on('value', function(snapshot){
      all_turnaways=snapshot.val();
      console.log(all_turnaways)
    })

  //END VARIABLE SETUPS

  //Charts SETUP
    // Load the Visualization API and the corechart package.
    google.charts.load('current', {'packages':['corechart']});

    // Set a callback to run when the Google Visualization API is loaded.
    google.charts.setOnLoadCallback(drawChart);
  //end charts  setups


  //BEGIN DATA PERSISTANCE
  //turnaway info
    if(localStorage.getItem('turnaway_list')){
      turnaway_list=JSON.parse(localStorage.getItem('turnaway_list'))
      for(var i = 0; i<turnaway_list.length; i++){
        var e = $('<div class="row"><div class="col s3"><p>'+turnaway_list[i].name+'</div><div class="col s3"><p>'+turnaway_list[i].date+'</div><div class="col s5"><p>'+turnaway_list[i].reason+'</div></div>')
        $('#turnaway_body').append(e)
      }
    }
    //turnaway info
      if(localStorage.getItem('timesheet')){
        timesheet_list=JSON.parse(localStorage.getItem('timesheet'))
        for(var i = 0; i<timesheet_list.length; i++){
          var e=$(
            '<tr><td><input id="timesheet_name_'+i+'" style="width:100px"type="text" class="validate"></td><td><input id="timesheet_start_'+i+'" type="text" class="validate"></td><td><input id="timesheet_break1out_'+i+'" type="text" class="validate"></td><td><input id="timesheet_break1in_'+i+'" type="text" class="validate"></td><td><input id="timesheet_lunch_'+i+'" type="text" class="validate"></td><td><input id="timesheet_break2out_'+i+'" type="text" class="validate"></td><td>  <input id="timesheet_break2in_'+i+'" type="text" class="validate"></td><td><input id="' +'timesheet_end_'+i+'" type="text" class="validate"></td><td><input id="' +"timesheet_total_" +i +'" type="number" class="validate"></td></tr>'
          )
          $('#timesheet_table').append(e)
          $('#timesheet_name_'+i).val(timesheet_list[i].name)
          $('#timesheet_start_'+i).val(timesheet_list[i].start)
          $('#timesheet_break1out_'+i).val(timesheet_list[i].break1out)
          $('#timesheet_break1in_'+i).val(timesheet_list[i].break1in)
          $('#timesheet_lunch_'+i).val(timesheet_list[i].lunch)
          $('#timesheet_break2out_'+i).val(timesheet_list[i].break2out)
          $('#timesheet_break2in_'+i).val(timesheet_list[i].break2in)
          $('#timesheet_end_'+i).val(timesheet_list[i].end)
          $('#timesheet_total_'+i).val(timesheet_list[i].total)
        }
      }
  //names and dates
    if(localStorage.getItem('names')){
      $('#names').val(localStorage.getItem("names"))
    }
    if(localStorage.getItem('date')){
      $('#date').val(localStorage.getItem("date"))
    }
  //current count
    if(localStorage.getItem("current_count")){
      $('#customer_number').val(localStorage.getItem("current_count"))
    }
  //total counts
    if(localStorage.getItem("total_count")){
      $('#total_number').val(localStorage.getItem("total_count"))
    }
    if(localStorage.getItem("turnaway_count")){
      $('#total_turnaway_number').val(localStorage.getItem("turnaway_count"))
    }
  //Table info
    if(localStorage.getItem("8_count")){
      $('#8_count').val(localStorage.getItem("8_count"))
      graph_data[1][1]=parseInt(localStorage.getItem("8_count"))
    }
    if(localStorage.getItem("830_count")){
      $('#830_count').val(localStorage.getItem("830_count"))
      graph_data[2][1]=parseInt(localStorage.getItem("830_count"))
    }
    if(localStorage.getItem("9_count")){
      $('#9_count').val(localStorage.getItem("9_count"))
      graph_data[3][1]=parseInt(localStorage.getItem("9_count"))
    }
    if(localStorage.getItem("930_count")){
      $('#930_count').val(localStorage.getItem("930_count"))
      graph_data[4][1]=parseInt(localStorage.getItem("930_count"))
    }
    if(localStorage.getItem("10_count")){
      $('#10_count').val(localStorage.getItem("10_count"))
      graph_data[5][1]=parseInt(localStorage.getItem("10_count"))
    }
    if(localStorage.getItem("1030_count")){
      $('#1030_count').val(localStorage.getItem("1030_count"))
      graph_data[6][1]=parseInt(localStorage.getItem("1030_count"))
    }
    if(localStorage.getItem("11_count")){
      $('#11_count').val(localStorage.getItem("11_count"))
      graph_data[7][1]=parseInt(localStorage.getItem("11_count"))
    }
    if(localStorage.getItem("1130_count")){
      $('#1130_count').val(localStorage.getItem("1130_count"))
      graph_data[8][1]=parseInt(localStorage.getItem("1130_count"))
    }
    if(localStorage.getItem("12_count")){
      $('#12_count').val(localStorage.getItem("12_count"))
      graph_data[9][1]=parseInt(localStorage.getItem("12_count"))
    }
    if(localStorage.getItem("1230_count")){
      $('#1230_count').val(localStorage.getItem("1230_count"))
      graph_data[10][1]=parseInt(localStorage.getItem("1230_count"))
    }
    if(localStorage.getItem("13_count")){
      $('#13_count').val(localStorage.getItem("13_count"))
      graph_data[11][1]=parseInt(localStorage.getItem("13_count"))
    }
    if(localStorage.getItem("1330_count")){
      $('#1330_count').val(localStorage.getItem("1330_count"))
      graph_data[12][1]=parseInt(localStorage.getItem("1330_count"))
    }
    if(localStorage.getItem("14_count")){
      $('#14_count').val(localStorage.getItem("14_count"))
      graph_data[13][1]=parseInt(localStorage.getItem("14_count"))
    }
    if(localStorage.getItem("1430_count")){
      $('#1430_count').val(localStorage.getItem("1430_count"))
      graph_data[14][1]=parseInt(localStorage.getItem("1430_count"))
    }
    if(localStorage.getItem("15_count")){
      $('#15_count').val(localStorage.getItem("15_count"))
      graph_data[15][1]=parseInt(localStorage.getItem("15_count"))
    }
    if(localStorage.getItem("1530_count")){
      $('#1530_count').val(localStorage.getItem("1530_count"))
      graph_data[16][1]=parseInt(localStorage.getItem("1530_count"))
    }
    if(localStorage.getItem("16_count")){
      $('#16_count').val(localStorage.getItem("16_count"))
      graph_data[17][1]=parseInt(localStorage.getItem("16_count"))
    }
    if(localStorage.getItem("1630_count")){
      $('#1630_count').val(localStorage.getItem("1630_count"))
      if(isNaN(localStorage.getItem("1630_count"))){
        graph_data[18][1]=0
      } else {
        graph_data[18][1]=parseInt(localStorage.getItem("1630_count"))
      }
    }
    if(localStorage.getItem("17_count")){
      $('#17_count').val(localStorage.getItem("17_count"))
      graph_data[19][1]=parseInt(localStorage.getItem("17_count"))
    }
    if(localStorage.getItem("1730_count")){
      $('#1730_count').val(localStorage.getItem("1730_count"))
      if(isNaN(localStorage.getItem("1730_count"))){
        graph_data[20][1]=0
      } else {
        graph_data[20][1]=parseInt(localStorage.getItem("1730_count"))
      }
    }
    if(localStorage.getItem("18_count")){
      $('#18_count').val(localStorage.getItem("18_count"))
      graph_data[21][1]=parseInt(localStorage.getItem("18_count"))
    }
    if(localStorage.getItem("1830_count")){
      $('#1830_count').val(localStorage.getItem("1830_count"))
      if(isNaN(localStorage.getItem("1830_count"))){
        graph_data[22][1]=0
      } else {
        graph_data[22][1]=parseInt(localStorage.getItem("1830_count"))
      }
    }
    if(localStorage.getItem("19_count")){
      $('#19_count').val(localStorage.getItem("19_count"))
      graph_data[23][1]=parseInt(localStorage.getItem("19_count"))
    }
    if(localStorage.getItem("1930_count")){
      $('#1930_count').val(localStorage.getItem("1930_count"))
      graph_data[24][1]=parseInt(localStorage.getItem("1930_count"))
    }
    if(localStorage.getItem("20_count")){
      $('#20_count').val(localStorage.getItem("20_count"))
      graph_data[25][1]=parseInt(localStorage.getItem("20_count"))
    }
    if(localStorage.getItem("2030_count")){
      $('#2030_count').val(localStorage.getItem("2030_count"))
      graph_data[26][1]=parseInt(localStorage.getItem("2030_count"))
    }
    if(localStorage.getItem("21_count")){
      $('#21_count').val(localStorage.getItem("21_count"))
      graph_data[27][1]=parseInt(localStorage.getItem("21_count"))
    }
    if(localStorage.getItem("2130_count")){
      $('#2130_count').val(localStorage.getItem("2130_count"))
      graph_data[28][1]=parseInt(localStorage.getItem("2130_count"))
    }
    if(localStorage.getItem("22_count")){
      $('#22_count').val(localStorage.getItem("22_count"))
      graph_data[29][1]=parseInt(localStorage.getItem("22_count"))
    }
    if(localStorage.getItem("2230_count")){
      $('#2230_count').val(localStorage.getItem("2230_count"))
      graph_data[30][1]=parseInt(localStorage.getItem("2230_count"))
    }

    if(localStorage.getItem("instore_count")){
      $('#instore_number').val(localStorage.getItem("instore_count"))
    }

  //END DATA PERSISTANCE

  $('.collapsible').collapsible();
$('select').material_select();
  // //BEGIN ONCLICK SETUPS
  $('#new_employee_button').click(function(){
    timesheet_list.push({name:'no_name', start: null, break1out:null, break1in: null, lunch: null,break2out:null, break2in:null, end:null, total:0 })
    saveTimesheetList("timesheet", timesheet_list)
    var e=$(
      '<tr><td><input id="timesheet_name_'+timesheet_list.length+'" style="width:100px"type="text" class="validate"></td><td><input id="timesheet_start_'+timesheet_list.length+'" type="text" class="validate"></td><td><input id="timesheet_break1out_'+timesheet_list.length+'" type="text" class="validate"></td><td><input id="timesheet_break1in_'+timesheet_list.length+'" type="text" class="validate"></td><td><input id="timesheet_lunch_'+timesheet_list.length+'" type="text" class="validate"></td><td><input id="timesheet_break2out_'+timesheet_list.length+'" type="text" class="validate"></td><td>  <input id="timesheet_break2in_'+timesheet_list.length+'" type="text" class="validate"></td><td><input id="' +'timesheet_end_'+timesheet_list.length+'" type="text" class="validate"></td><td><input id="' +"timesheet_total_" +timesheet_list.length +'" type="text" class="validate"></td></tr>'
    )
    $('#timesheet_table').append(e)
    location.reload()
  })
  //TODO: add inventory functionality tied to a store map

  $('#leaving_customer').click(function(){
    $('#instore_number').val( function(i, oldval) {
      if($('#instore_number').val()==3){
        return 3
      } else {
        return --oldval;
        console.log('got em')
      }

    });
    saveSingleNumber("instore_count", $('#instore_number').val())
  })

  //manager screen buttong
  $('#show_manager_button').click(function(){
    secret_button_count++
    if(secret_button_count==25){
      $('#doorperson_screen').toggle(false)
      $('#manager_screen').toggle(true)
    }
  })

  $('#return_todoor_button').click(function(){
    secret_button_count=0;
    $('#doorperson_screen').toggle(true)
    $('#manager_screen').toggle(false)
  })

  //Set up customer log/turnaway/secret buttons (nav bar buttons)
  $('#show_customer_button').click(function(){
    $('#customer_scroll_body').toggle(true);
    $('#turnaway_scroll_body').toggle(false);
    $('#timesheet_body').toggle(false);
  })
  $('#show_turnaway_button').click(function(){
    $('#customer_scroll_body').toggle(false);
    $('#turnaway_scroll_body').toggle(true);
    $('#timesheet_body').toggle(false);
  })
  $('#show_secret_button').click(function(){
    $('#customer_scroll_body').toggle(false);
    $('#turnaway_scroll_body').toggle(false);
    $('#timesheet_body').toggle(true);
  })

  //add customer button
  $('#add_customer').click(function(){
    if($('#instore_number').val()>15){
      Materialize.toast("Store At Capacity, Wait Outside!", 5000)
    } else {
      $('#customer_number').val( function(i, oldval) {
        return ++oldval;
        console.log('got em')
      });
      $('#instore_number').val( function(i, oldval) {
        return ++oldval;
        console.log('got em')
      });
      $('#total_number').val( function(i, oldval) {
        return ++oldval;
        console.log('got em')
      });
      saveSingleNumber("current_count", $('#customer_number').val())
      saveSingleNumber("total_count", $('#total_number').val())
      saveSingleNumber("instore_count", $('#instore_number').val())
      adjustTable(0)
    }

  })

  //minus customer button
  $('#minus_customer').click(function(){
    $('#customer_number').val( function(i, oldval) {
      return --oldval;
      console.log('got em')
    });
    $('#instore_number').val( function(i, oldval) {
      if($('#instore_number').val()==3){
        return 3
      } else {
        return --oldval;
        console.log('got em')
      }
})
    $('#total_number').val( function(i, oldval) {
      return --oldval;
      console.log('got em')
    });
    saveSingleNumber("current_count", $('#customer_number').val())
    saveSingleNumber("total_count", $('#total_number').val())
    adjustTable(1)
  })



  //save data sheet button
  $('#save_button').click(function(){
    var text_to_save;
    var file_name;
    saveAll();
    file_name= $('#date').val() + '_customer_count'
    text_to_save = $('#names').val() + ', ' + $('#date').val() + ' total: ' + $('#total_number').val()+"\r\n"+'TURNAWAYS:'
    for(var i=0; i<turnaway_list.length; i++){
      text_to_save=text_to_save + "\r\n" + turnaway_list[i].name + ' ' +turnaway_list[i].date + ' ' + turnaway_list[i].reason
    }
    text_to_save=text_to_save+"\r\n" + "TIMESHEET:"
    for(var x=0; x<timesheet_list.length; x++){
      var sub_string = '';
      if(timesheet_list[x].name!=null && timesheet_list[x].name!=''){
        sub_string=sub_string + 'Name: ' + timesheet_list[x].name
      }
      if(timesheet_list[x].start!=null && timesheet_list[x].start!=''){
        sub_string=sub_string + ', Start: ' + timesheet_list[x].start
      }
      if(timesheet_list[x].break1out!=null && timesheet_list[x].break1out!=''){
        sub_string=sub_string +  ', Break 1 Out: ' + timesheet_list[x].break1out
      }
      if(timesheet_list[x].break1in!=null && timesheet_list[x].break1in!=''){
        sub_string=sub_string +  ', Break 1 In: ' + timesheet_list[x].break1in
      }
      if(timesheet_list[x].lunch!=null && timesheet_list[x].lunch!=''){
        sub_string=sub_string + ', Lunch: ' + timesheet_list[x].lunch
      }
      if(timesheet_list[x].break2out!=null && timesheet_list[x].break2out!=''){
        sub_string=sub_string +  ', Break 2 Out: ' + timesheet_list[x].break2out
      }
      if(timesheet_list[x].break2in!=null && timesheet_list[x].break2in!=''){
        sub_string=sub_string +  ', Break 2 In: ' + timesheet_list[x].break2in
      }
      if(timesheet_list[x].end!=null && timesheet_list[x].end!=''){
        sub_string=sub_string + ', End: ' + timesheet_list[x].end
      }
      if(timesheet_list[x].total!=null && timesheet_list[x].total!=''){
        sub_string=sub_string + ', Total: ' +timesheet_list[x].total
      }
      text_to_save = text_to_save + "\r\n" + sub_string
    }
    download(text_to_save, file_name, 'text/plain')
  })

  //quicksave current info
  $('#quicksave_button').click(function(){
    saveAll()
    var date=new Date();
    var date_ref=(date.getMonth()+1) + '-' + date.getDate() + '-' + date.getFullYear()
    firebase.database().ref('customers/' + date_ref).set(graph_data).then(function(){
      Materialize.toast('Customer Log Saved', 2000)
    })
    firebase.database().ref('turnaways/' + date_ref).set(turnaway_list).then(function(){
      Materialize.toast('Turnaway Log Saved', 2000)
    })
    firebase.database().ref('timesheets/' + date_ref).set(timesheet_list).then(function(){
      Materialize.toast('Timesheets Saved', 2000)
    })
    firebase.database().ref('total/' + date_ref).set( $('#total_number').val()).then(function(){
      Materialize.toast('Total Count Saved', 2000)
    })
  })

  $('#clear_button').click(function(){
    clearStorage()
    location.reload();
    Materialize.toast('Local Storage Cleared!', 4000)
  })

    //open turnaway window buttong
    $('#modal1').modal();
    $('#modal2').modal();

    //submit turnaway button
    $('#submit_turnaway').click(function(){
      turnaway_list.push({name:$('#turnaway_name').val(), date:$('#turnaway_date').val(), reason:$('#reason').val()})
      saveTurnawayList("turnaway_list", turnaway_list)
      console.log(turnaway_list)
      var e = $('<div class="row"><div class="col s3"><p>'+$('#turnaway_name').val()+'</div><div class="col s3"><p>'+$('#turnaway_date').val()+'</div><div class="col s5"><p>'+$('#reason').val()+'</div></div>')
      $('#turnaway_body').append(e)
      $('#total_turnaway_number').val( function(i, oldval) {
        return ++oldval;
        console.log('got em')
      });
      saveSingleNumber("turnaway_count", $('#total_turnaway_number').val() )
    })
    //END ONCLICK SETUPS

    //BEGIN RUNNING LOGIC SETUP
    //get and adjust clock every second(?)ish
    GetClock();
    setInterval(GetClock,1000);
    //END RUNNING LOGIC SETUP

  //BEGIN FUNCTIONS SECTION

  //clear all local localStorage
  function clearStorage(){
    localStorage.clear()
  }
  //save single number to local storage
  function saveSingleNumber(label, number){
    localStorage.setItem(label, number)
  }

  function saveSingleString(label, string){
    localStorage.setItem(label, string)
  }

  //save turnaway list
  function saveTurnawayList(label, list){
    var stringedList = JSON.stringify(list);
    localStorage.setItem(label, stringedList)
  }

  //save turnaway list
  function saveTimesheetList(label, list){
    var stringedList = JSON.stringify(list);
    localStorage.setItem(label, stringedList)
  }

  //save all page data
  function saveAll(){
    saveSingleNumber("8_count", $('#8_count').val())
    saveSingleNumber("830_count", $('#830_count').val())
    saveSingleNumber("9_count", $('#9_count').val())
    saveSingleNumber("930_count", $('#930_count').val())
    saveSingleNumber("10_count", $('#10_count').val())
    saveSingleNumber("1030_count", $('#1030_count').val())
    saveSingleNumber("11_count", $('#11_count').val())
    saveSingleNumber("1130_count", $('#1130_count').val())
    saveSingleNumber("12_count", $('#12_count').val())
    saveSingleNumber("1230_count", $('#1230_count').val())
    saveSingleNumber("13_count", $('#13_count').val())
    saveSingleNumber("1330_count", $('#1330_count').val())
    saveSingleNumber("14_count", $('#14_count').val())
    saveSingleNumber("1430_count", $('#1430_count').val())
    saveSingleNumber("15_count", $('#15_count').val())
    saveSingleNumber("1530_count", $('#1530_count').val())
    saveSingleNumber("16_count", $('#16_count').val())
    saveSingleNumber("1630_count", $('#1630_count').val())
    saveSingleNumber("17_count", $('#17_count').val())
    saveSingleNumber("1730_count", $('#1730_count').val())
    saveSingleNumber("18_count", $('#18_count').val())
    saveSingleNumber("1830_count", $('#1830_count').val())
    saveSingleNumber("19_count", $('#19_count').val())
    saveSingleNumber("1930_count", $('#1930_count').val())
    saveSingleNumber("20_count", $('#20_count').val())
    saveSingleNumber("2030_count", $('#2030_count').val())
    saveSingleNumber("21_count", $('#21_count').val())
    saveSingleNumber("2130_count", $('#2130_count').val())
    saveSingleNumber("22_count", $('#22_count').val())
    saveSingleNumber("2230_count", $('#2230_count').val())

    saveSingleNumber("total_count", $('#total_number').val())
    saveSingleNumber("current_count", $('#customer_number').val())
    saveSingleNumber("turnaway_count", $('#total_turnaway_number').val())

    saveSingleString("names", $('#names').val())
    saveSingleString("date", $('#date').val())

    for(var i=0;i<timesheet_list.length;i++){

      timesheet_list[i].name=$('#timesheet_name_'+i).val()
      timesheet_list[i].start=$('#timesheet_start_'+i).val()
      timesheet_list[i].break1out=$('#timesheet_break1out_'+i).val()
      timesheet_list[i].break1in=$('#timesheet_break1in_'+i).val()
      timesheet_list[i].lunch=$('#timesheet_lunch_'+i).val()
      timesheet_list[i].break2out=$('#timesheet_break2out_'+i).val()
      timesheet_list[i].break2in=$('#timesheet_break2in_'+i).val()
      timesheet_list[i].end=$('#timesheet_end_'+i).val()
      timesheet_list[i].total=$('#timesheet_total_'+i).val()

    }
    console.log(timesheet_list)
    console.log('lala')
    saveTimesheetList("timesheet", timesheet_list)

    Materialize.toast('Data saved to browser storage!', 4000)
  }
  //download data sheet
  function download(data, filename, type) {
      var file = new Blob([data], {type: type});
      if (window.navigator.msSaveOrOpenBlob) // IE10+
          window.navigator.msSaveOrOpenBlob(file, filename);
      else { // Others
          var a = document.createElement("a"),
                  url = URL.createObjectURL(file);
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          setTimeout(function() {
              document.body.removeChild(a);
              window.URL.revokeObjectURL(url);
          }, 0);
      }
  }
  //clock handler
  function GetClock(){
    var d=new Date();
    var nhour=d.getHours(),nmin=d.getMinutes();
    if(nmin<=9) nmin="0"+nmin
    if(nmin==0 && d.getSeconds()<5){
      $('#customer_number').val(0)
      localStorage.setItem("current_count", 0)
    }
    if(nmin==30 && d.getSeconds()<5){
      $('#customer_number').val(0)
      localStorage.setItem("current_count", 0)
    }

    document.getElementById('clockbox').innerHTML=""+nhour+":"+nmin+"";
  }


  //draws chart, callback from chart resource loaded
  function drawChart() {
    console.log(graph_data)
    var data = google.visualization.arrayToDataTable(graph_data);

    var options = {
      title: 'Customer Log',
      hAxis: {title: 'Time',  titleTextStyle: {color: '#333'}},
      vAxis: {minValue: 0}
    };

    var chart = new google.visualization.AreaChart(document.getElementById('chart_div'));
    chart.draw(data, options);
  }
//adjust table data
    function adjustTable(operation){
      var d=new Date();
      var hours=d.getHours();
      var minutes=d.getMinutes();
      console.log(hours+'' +minutes)

      //8
      if(hours==8){
        if(minutes<30) {
          if(operation==0){
            $('#8_count').val( function(i, oldval) {
              graph_data[1][1]=parseInt(oldval)+1
              drawChart()
              return ++oldval;
              console.log('got em')

            });
          } else {
            $('#8_count').val( function(i, oldval) {
              graph_data[1][1]=parseInt(oldval)-1
              drawChart()
              return --oldval;
              console.log('got em')
            });
          }
          saveSingleNumber("8_count", $('#8_count').val())

        } else {
          if(operation==0){
            $('#830_count').val( function(i, oldval) {
              graph_data[2][1]=parseInt(oldval)+1
              drawChart()
              return ++oldval;
              console.log('got em')
            });
          } else {
            $('#830_count').val( function(i, oldval) {
              graph_data[2][1]=parseInt(oldval)-1
              drawChart()
              return --oldval;
              console.log('got em')
            });
          }
          saveSingleNumber("830_count", $('#830_count').val())
        }
      }
      //9
      if(hours==9){
        if(minutes<30) {
          if(operation==0){
            $('#9_count').val( function(i, oldval) {
              graph_data[3][1]=parseInt(oldval)+1
              drawChart()
              return ++oldval;
              console.log('got em')
            });
          } else {
            $('#9_count').val( function(i, oldval) {
              graph_data[3][1]=parseInt(oldval)-1
              drawChart()
              return --oldval;
              console.log('got em')
            });
          }
          saveSingleNumber("9_count", $('#9_count').val())
        } else {
          if(operation==0){
            $('#930_count').val( function(i, oldval) {
              graph_data[4][1]=parseInt(oldval)+1
              drawChart()
              return ++oldval;
              console.log('got em')
            });
          } else {
            $('#930_count').val( function(i, oldval) {
              graph_data[4][1]=parseInt(oldval)-1
              drawChart()
              return --oldval;
              console.log('got em')
            });
          }
          saveSingleNumber("930_count", $('#930_count').val())
        }
      }
      //10
      if(hours==10){
        if(minutes<30) {
          if(operation==0){
            $('#10_count').val( function(i, oldval) {
              graph_data[5][1]=parseInt(oldval)+1
              drawChart()
              return ++oldval;
              console.log('got em')
            });
          } else {
            $('#10_count').val( function(i, oldval) {
              graph_data[5][1]=parseInt(oldval)-1
              drawChart()
              return --oldval;
              console.log('got em')
            });
          }
          saveSingleNumber("10_count", $('#10_count').val())
        } else {
          if(operation==0){
            $('#1030_count').val( function(i, oldval) {
              graph_data[6][1]=parseInt(oldval)+1
              drawChart()
              return ++oldval;
              console.log('got em')
            });
          } else {
            $('#1030_count').val( function(i, oldval) {
              graph_data[6][1]=parseInt(oldval)-1
              drawChart()
              return --oldval;
              console.log('got em')
            });
          }
          saveSingleNumber("1030_count", $('#1030_count').val())
        }
      }
      //11
      if(hours==11){
        if(minutes<30) {
          if(operation==0){
            $('#11_count').val( function(i, oldval) {
              graph_data[7][1]=parseInt(oldval)+1
              drawChart()
              return ++oldval;
              console.log('got em')
            });
          } else {
            $('#11_count').val( function(i, oldval) {
              graph_data[7][1]=parseInt(oldval)-1
              drawChart()
              return --oldval;
              console.log('got em')
            });
          }
            saveSingleNumber("11_count", $('#11_count').val())
        } else {
          if(operation==0){
            $('#1130_count').val( function(i, oldval) {
              graph_data[8][1]=parseInt(oldval)+1
              drawChart()
              return ++oldval;
              console.log('got em')
            });
          } else {
            $('#1130_count').val( function(i, oldval) {
              graph_data[8][1]=parseInt(oldval)-1
              drawChart()
              return --oldval;
              console.log('got em')
            });
          }
            saveSingleNumber("1130_count", $('#1130_count').val())
        }
      }
      //12
      if(hours==12){
        if(minutes<30) {
          if(operation==0){
            $('#12_count').val( function(i, oldval) {
              graph_data[9][1]=parseInt(oldval)+1
              drawChart()
              return ++oldval;
              console.log('got em')
            });
          } else {
            $('#12_count').val( function(i, oldval) {
              graph_data[9][1]=parseInt(oldval)-1
              drawChart()
              return --oldval;
              console.log('got em')
            });
          }
            saveSingleNumber("12_count", $('#12_count').val())
        } else {
          if(operation==0){
            $('#1230_count').val( function(i, oldval) {
              graph_data[10][1]=parseInt(oldval)+1
              drawChart()
              return ++oldval;
              console.log('got em')
            });
          } else {
            $('#1230_count').val( function(i, oldval) {
              graph_data[10][1]=parseInt(oldval)-1
              drawChart()
              return --oldval;
              console.log('got em')
            });
          }
            saveSingleNumber("1230_count", $('#1230_count').val())
        }
      }
      //13
      if(hours==13){
        if(minutes<30) {
          if(operation==0){
            $('#13_count').val( function(i, oldval) {
              graph_data[11][1]=parseInt(oldval)+1
              drawChart()
              return ++oldval;
              console.log('got em')
            });
          } else {
            $('#13_count').val( function(i, oldval) {
              graph_data[11][1]=parseInt(oldval)-1
              drawChart()
              return --oldval;
              console.log('got em')
            });
          }
            saveSingleNumber("13_count", $('#13_count').val())
        } else {
          if(operation==0){
            $('#1330_count').val( function(i, oldval) {
              graph_data[12][1]=parseInt(oldval)+1
              drawChart()
              return ++oldval;
              console.log('got em')
            });
          } else {
            $('#1330_count').val( function(i, oldval) {
              graph_data[12][1]=parseInt(oldval)-1
              drawChart()
              return --oldval;
              console.log('got em')
            });
          }
            saveSingleNumber("1330_count", $('#1330_count').val())
        }
      }
      //14
      if(hours==14){
        if(minutes<30) {
          if(operation==0){
            $('#14_count').val( function(i, oldval) {
              graph_data[13][1]=parseInt(oldval)+1
              drawChart()
              return ++oldval;
              console.log('got em')
            });
          } else {
            $('#14_count').val( function(i, oldval) {
              graph_data[13][1]=parseInt(oldval)-1
              drawChart()
              return --oldval;
              console.log('got em')
            });
          }
            saveSingleNumber("14_count", $('#14_count').val())
        } else {
          if(operation==0){
            $('#1430_count').val( function(i, oldval) {
              graph_data[14][1]=parseInt(oldval)+1
              drawChart()
              return ++oldval;
              console.log('got em')
            });
          } else {
            $('#1430_count').val( function(i, oldval) {
              graph_data[14][1]=parseInt(oldval)-1
              drawChart()
              return --oldval;
              console.log('got em')
            });
          }
            saveSingleNumber("1430_count", $('#1430_count').val())
        }
      }
      //15
      if(hours==15){
        if(minutes<30) {
          if(operation==0){
            $('#15_count').val( function(i, oldval) {
              graph_data[15][1]=parseInt(oldval)+1
              drawChart()
              return ++oldval;
              console.log('got em')
            });
          } else {
            $('#15_count').val( function(i, oldval) {
              graph_data[15][1]=parseInt(oldval)-1
              drawChart()
              return --oldval;
              console.log('got em')
            });
          }
            saveSingleNumber("15_count", $('#15_count').val())
        } else {
          if(operation==0){
            $('#1530_count').val( function(i, oldval) {
              graph_data[16][1]=parseInt(oldval)+1
              drawChart()
              return ++oldval;
              console.log('got em')
            });
          } else {
            $('#1530_count').val( function(i, oldval) {
              graph_data[16][1]=parseInt(oldval)-1
              drawChart()
              return --oldval;
              console.log('got em')
            });
          }
            saveSingleNumber("1530_count", $('#1530_count').val())
        }
      }
      //16
      if(hours==16){
        if(minutes<30) {
          if(operation==0){
            $('#16_count').val( function(i, oldval) {
              graph_data[17][1]=parseInt(oldval)+1
              drawChart()
              return ++oldval;
              console.log('got em')
            });
          } else {
            $('#16_count').val( function(i, oldval) {
              graph_data[17][1]=parseInt(oldval)-1
              drawChart()
              return --oldval;
              console.log('got em')
            });
          }
            saveSingleNumber("16_count", $('#16_count').val())
        } else {
          if(operation==0){
            $('#1630_count').val( function(i, oldval) {
              graph_data[18][1]=parseInt(oldval)+1
              drawChart()
              return ++oldval;
              console.log('got em')
            });
          } else {
            $('#1630_count').val( function(i, oldval) {
              graph_data[18][1]=parseInt(oldval)-1
              drawChart()
              return --oldval;
              console.log('got em')
            });
          }
            saveSingleNumber("1630_count", $('#1630_count').val())
        }
      }
      //17
      if(hours==17){
        if(minutes<30) {
          if(operation==0){
            $('#17_count').val( function(i, oldval) {
              graph_data[19][1]=parseInt(oldval)+1
              drawChart()
              return ++oldval;
              console.log('got em')
            });
          } else {
            $('#17_count').val( function(i, oldval) {
              graph_data[19][1]=parseInt(oldval)-1
              drawChart()
              return --oldval;
              console.log('got em')
            });
          }
            saveSingleNumber("17_count", $('#17_count').val())
        } else {
          if(operation==0){
            $('#1730_count').val( function(i, oldval) {
              graph_data[20][1]=parseInt(oldval)+1
              drawChart()
              return ++oldval;
              console.log('got em')
            });
          } else {
            $('#1730_count').val( function(i, oldval) {
              graph_data[20][1]=parseInt(oldval)-1
              drawChart()
              return --oldval;
              console.log('got em')
            });
          }
            saveSingleNumber("1730_count", $('#1730_count').val())
        }
      }
      //18
      if(hours==18){
        if(minutes<30) {
          if(operation==0){
            $('#18_count').val( function(i, oldval) {
              graph_data[21][1]=parseInt(oldval)+1
              drawChart()
              return ++oldval;
              console.log('got em')
            });
          } else {
            $('#18_count').val( function(i, oldval) {
              graph_data[21][1]=parseInt(oldval)-1
              drawChart()
              return --oldval;
              console.log('got em')
            });
          }
            saveSingleNumber("18_count", $('#18_count').val())
        } else {
          if(operation==0){
            $('#1830_count').val( function(i, oldval) {
              graph_data[22][1]=parseInt(oldval)+1
              drawChart()
              return ++oldval;
              console.log('got em')
            });
          } else {
            $('#1830_count').val( function(i, oldval) {
              graph_data[22][1]=parseInt(oldval)-1
              drawChart()
              return --oldval;
              console.log('got em')
            });
          }
            saveSingleNumber("1830_count", $('#1830_count').val())
        }
      }
      //19
      if(hours==19){
        if(minutes<30) {
          if(operation==0){
            $('#19_count').val( function(i, oldval) {
              graph_data[23][1]=parseInt(oldval)+1
              drawChart()
              return ++oldval;
              console.log('got em')
            });
          } else {
            $('#19_count').val( function(i, oldval) {
              graph_data[23][1]=parseInt(oldval)-1
              drawChart()
              return --oldval;
              console.log('got em')
            });
          }
            saveSingleNumber("19_count", $('#19_count').val())
        } else {
          if(operation==0){
            $('#1930_count').val( function(i, oldval) {
              graph_data[24][1]=parseInt(oldval)+1
              drawChart()
              return ++oldval;
              console.log('got em')
            });
          } else {
            $('#1930_count').val( function(i, oldval) {
              graph_data[24][1]=parseInt(oldval)-1
              drawChart()
              return --oldval;
              console.log('got em')
            });
          }
            saveSingleNumber("1930_count", $('#1930_count').val())
        }
      }
      //20
      if(hours==20){
        if(minutes<30) {
          if(operation==0){
            $('#20_count').val( function(i, oldval) {
              graph_data[25][1]=parseInt(oldval)+1
              drawChart()
              return ++oldval;
              console.log('got em')
            });
          } else {
            $('#20_count').val( function(i, oldval) {
              graph_data[25][1]=parseInt(oldval)-1
              drawChart()
              return --oldval;
              console.log('got em')
            });
          }
            saveSingleNumber("20_count", $('#20_count').val())
        } else {
          if(operation==0){
            $('#2030_count').val( function(i, oldval) {
              graph_data[26][1]=parseInt(oldval)+1
              drawChart()
              return ++oldval;
              console.log('got em')
            });
          } else {
            $('#2030_count').val( function(i, oldval) {
              graph_data[26][1]=parseInt(oldval)-1
              drawChart()
              return --oldval;
              console.log('got em')
            });
          }
            saveSingleNumber("2030_count", $('#2030_count').val())
        }
      }
      //21
      if(hours==21){
        if(minutes<30) {
          if(operation==0){
            $('#21_count').val( function(i, oldval) {
              graph_data[27][1]=parseInt(oldval)+1
              drawChart()
              return ++oldval;
              console.log('got em')
            });
          } else {
            $('#21_count').val( function(i, oldval) {
              graph_data[27][1]=parseInt(oldval)-1
              drawChart()
              return --oldval;
              console.log('got em')
            });
          }
            saveSingleNumber("21_count", $('#21_count').val())
        } else {
          if(operation==0){
            $('#2130_count').val( function(i, oldval) {
              graph_data[28][1]=parseInt(oldval)+1
              drawChart()
              return ++oldval;
              console.log('got em')
            });
          } else {
            $('#2130_count').val( function(i, oldval) {
              graph_data[28][1]=parseInt(oldval)-1
              drawChart()
              return --oldval;
              console.log('got em')
            });
          }
            saveSingleNumber("2130_count", $('#2130_count').val())
        }
      }
      //22
      if(hours==22){
        if(minutes<30) {
          if(operation==0){
            $('#22_count').val( function(i, oldval) {
              graph_data[29][1]=parseInt(oldval)+1
              drawChart()
              return ++oldval;
              console.log('got em')
            });
          } else {
            $('#22_count').val( function(i, oldval) {
              graph_data[29][1]=parseInt(oldval)-1
              drawChart()
              return --oldval;
              console.log('got em')
            });
          }
            saveSingleNumber("22_count", $('#22_count').val())
        } else {
          if(operation==0){
            $('#2230_count').val( function(i, oldval) {
              graph_data[30][1]=parseInt(oldval)+1
              drawChart()
              return ++oldval;
              console.log('got em')
            });
          } else {
            $('#2230_count').val( function(i, oldval) {
              graph_data[30][1]=parseInt(oldval)-1
              drawChart()
              return --oldval;
              console.log('got em')
            });
          }
            saveSingleNumber("2230_count", $('#2230_count').val())
        }
      }

    //END adjustTable
    }
    //END FUNCTIONS SECTION
    //TODO: graphs, lngterm data, manager breakdown
    //TODO: bitcoin mining?
    //TODO: ID scanner
    //TODO: 21+ date
})
