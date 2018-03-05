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
      drawManager1Chart();
    //  console.log(all_customers)
    })
    firebase.database().ref('timesheets').on('value', function(snapshot){
      all_timesheets=snapshot.val();
    //  console.log(all_timesheets)
    })
    firebase.database().ref('total').on('value', function(snapshot){
      all_totals=snapshot.val();
      drawManager2Chart()
    //  console.log(all_totals)
    })
    firebase.database().ref('turnaways').on('value', function(snapshot){
      all_turnaways=snapshot.val();
    //  console.log(all_turnaways)
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


  //END DATA PERSISTANCE

  $('.collapsible').collapsible();
$('select').material_select();
  // //BEGIN ONCLICK SETUPS

  //TODO: add inventory functionality tied to a store map

  $('#leaving_customer').click(function(){
    $('#instore_number').val( function(i, oldval) {
      if($('#instore_number').val()==3){
        return 3
      } else {
        return --oldval;
        //console.log('got em')
      }

    });
    saveSingleNumber("instore_count", $('#instore_number').val())
  })

  $('#entering_customer').click(function(){
    $('#instore_number').val( function(i, oldval) {
        return ++oldval;
    });
    console.log($('#instore_number').val())
    $('#instore_number').val($('#instore_number').val())
    saveSingleNumber("instore_count", $('#instore_number').val())
  })

  //add customer button
  $('#add_customer').click(function(){
    // if($('#instore_number').val()>15){
    //   Materialize.toast("Store At Capacity, Wait Outside!", 5000)
    // } else {
    //   $('#customer_number').val( function(i, oldval) {
    //     return ++oldval;
    //     //console.log('got em')
    //   });
      // $('#instore_number').val( function(i, oldval) {
      //   return ++oldval;
      //   //console.log('got em')
      // });
      // $('#total_number').val( function(i, oldval) {
      //   return ++oldval;
      //   //console.log('got em')
      // });
      // saveSingleNumber("current_count", $('#customer_number').val())
      // saveSingleNumber("total_count", $('#total_number').val())
      // saveSingleNumber("instore_count", $('#instore_number').val())
      // adjustTable(0)
    //}

  })

  //minus customer button
  $('#minus_customer').click(function(){
    $('#customer_number').val( function(i, oldval) {
      return --oldval;
      // console.log('got em')
    });
    $('#instore_number').val( function(i, oldval) {
      if($('#instore_number').val()==3){
        return 3
      } else {
        return --oldval;
        // console.log('got em')
      }
})
    $('#total_number').val( function(i, oldval) {
      return --oldval;
      // console.log('got em')
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



    //submit turnaway button
    $('#submit_turnaway').click(function(){
      turnaway_list.push({name:$('#turnaway_name').val(), date:$('#turnaway_date').val(), reason:$('#reason').val()})
      saveTurnawayList("turnaway_list", turnaway_list)
      // console.log(turnaway_list)
      var e = $('<div class="row"><div class="col s3"><p>'+$('#turnaway_name').val()+'</div><div class="col s3"><p>'+$('#turnaway_date').val()+'</div><div class="col s5"><p>'+$('#reason').val()+'</div></div>')
      $('#turnaway_body').append(e)
      $('#total_turnaway_number').val( function(i, oldval) {
        return ++oldval;
        // console.log('got em')
      });
      saveSingleNumber("turnaway_count", $('#total_turnaway_number').val() )
    })

    $('#new_employee_button').click(function(){
      timesheet_list.push({name:'no_name', start: null, break1out:null, break1in: null, lunch: null,break2out:null, break2in:null, end:null, total:0 })
      saveTimesheetList("timesheet", timesheet_list)
      var e=$(
        '<tr><td><input id="timesheet_name_'+timesheet_list.length+'" style="width:100px"type="text" class="validate"></td><td><input id="timesheet_start_'+timesheet_list.length+'" type="text" class="validate"></td><td><input id="timesheet_break1out_'+timesheet_list.length+'" type="text" class="validate"></td><td><input id="timesheet_break1in_'+timesheet_list.length+'" type="text" class="validate"></td><td><input id="timesheet_lunch_'+timesheet_list.length+'" type="text" class="validate"></td><td><input id="timesheet_break2out_'+timesheet_list.length+'" type="text" class="validate"></td><td>  <input id="timesheet_break2in_'+timesheet_list.length+'" type="text" class="validate"></td><td><input id="' +'timesheet_end_'+timesheet_list.length+'" type="text" class="validate"></td><td><input id="' +"timesheet_total_" +timesheet_list.length +'" type="text" class="validate"></td></tr>'
      )
      $('#timesheet_table').append(e)
      location.reload()
    })

    $('#save_employee_button').change(function(){
      for(var i=0;i<timesheet_list.length;i++){

      }
    })
    //END ONCLICK SETUPS

    //BEGIN RUNNING LOGIC SETUP


    //BEGIN ON CHANGE SECTION

    //END ON CHANGE SECTION

  //BEGIN FUNCTIONS SECTION


  function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
  }

  //draws chart, callback from chart resource loaded
  function drawChart() {
    // console.log(graph_data)

    var data = google.visualization.arrayToDataTable(graph_data);

    var options = {
      title: 'Customer Log',
      hAxis: {title: 'Time',  titleTextStyle: {color: '#333'}},
      vAxis: {minValue: 0}
    };

    var chart = new google.visualization.AreaChart(document.getElementById('chart_div'));
    chart.draw(data, options);
  }

  function drawManager1Chart() {
    var customer_table_data=[["Time"]]

    var e = Object.keys(all_customers);
    for (var i=0; i<e.length; i++) {
      customer_table_data[0][i+1]=e[i];
      var u = all_customers[e[i]];
      for (var x=1; x<all_customers[e[i]].length; x++){
        if(i==0){
          customer_table_data.push([all_customers[e[i]][x][0]])
        }


        customer_table_data[x][i+1]=all_customers[e[i]][x][1]
      }


    }
    customer_table_data=customer_table_data
     var data = google.visualization.arrayToDataTable(customer_table_data);

    var options = {
      title: 'Customer Tracking History',
      hAxis: {title: 'Time',  titleTextStyle: {color: '#333'}},
      vAxis: {minValue: 0}
    };

    var chart = new google.visualization.AreaChart(document.getElementById('manager_chart1_div'));
    chart.draw(data, options);
  }

  function drawManager2Chart() {
    var customer_table_data=[["Date", "Total"]]

    var e = Object.keys(all_totals);
    for (var i=0; i<e.length; i++) {
      // console.log([e[i], all_totals[e[i]]])
      customer_table_data.push([e[i], parseInt(all_totals[e[i]])])

    }
    // console.log(customer_table_data)
    customer_table_data=customer_table_data
     var data = google.visualization.arrayToDataTable(customer_table_data);

    var options = {
      title: 'Customer Total History',
      hAxis: {title: 'Time',  titleTextStyle: {color: '#333'}},
      vAxis: {minValue: 0}
    };

    var chart = new google.visualization.BarChart(document.getElementById('manager_chart2_div'));
    chart.draw(data, options);
  }
//adjust table data

    //END adjustTable
    }
    //END FUNCTIONS SECTION
    //TODO: graphs, lngterm data, manager breakdown
    //TODO: bitcoin mining?
    //TODO: ID scanner
    //TODO: 21+ date
})
