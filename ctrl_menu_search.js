$(document).ready(function(){
  $('.parallax').parallax();
  $('select').material_select();
  $('.carousel.carousel-slider').carousel({fullWidth: true});
  $('.menu_height').matchHeight()
  var slider = document.getElementById('thc_potency_range');
    noUiSlider.create(slider, {
     start: [1, 30],
     connect: true,
     step: 1,
     orientation: 'horizontal', // 'horizontal' or 'vertical'
     range: {
       'min': 0,
       'max': 100
     },
     format: wNumb({
       decimals: 0
     })
    });
  var slider = document.getElementById('cbd_potency_range');
    noUiSlider.create(slider, {
     start: [1, 30],
     connect: true,
     step: 1,
     orientation: 'horizontal', // 'horizontal' or 'vertical'
     range: {
       'min': 0,
       'max': 100
     },
     format: wNumb({
       decimals: 0
     })
    });

  $('#home').click(function(){
    $('#menu_div').toggle(false)
    $('#menu_results').toggle(false)
    $('#menu_carousel').toggle(false)
    $('#home_find_us').toggle(true)
    $('#home_div').toggle(true)
    $('#home_about').toggle(true)
    $('#faq_div').toggle(false)
    $('.carousel.carousel-slider').carousel({fullWidth: true});
  })

  $('#menu').click(function(){
    $('#menu_div').toggle(true)
    $('#menu_results').toggle(true)
    $('#menu_carousel').toggle(true)
    $('#home_find_us').toggle(false)
    $('#home_div').toggle(false)
    $('#home_about').toggle(false)
    $('#faq_div').toggle(false)
    $('.carousel.carousel-slider').carousel({fullWidth: true});
  })

  $('#faq').click(function(){
    $('#menu_div').toggle(false)
    $('#menu_results').toggle(false)
    $('#menu_carousel').toggle(false)
    $('#home_find_us').toggle(true)
    $('#home_div').toggle(false)
    $('#home_about').toggle(false)
    $('#faq_div').toggle(false)
    $('.carousel.carousel-slider').carousel({fullWidth: true});
  })

  /////////////////////////////////////////////////////////////////////////////////////////
  //START MENU LOGIC///////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  $('#tacoma_menu').click(function(){
    $('#tacoma_menu').css('background-color', '#c0ffad' )
    $('#port_orchard_menu').css('background-color', '#ffffff')
  })
  $('#port_orchard_menu').click(function(){
    $('#port_orchard_menu').css('background-color', '#c0ffad' )
    $('#tacoma_menu').css('background-color', '#ffffff')
  })
  $('#toggle_filter').click(function(){
    $('#quick_search').toggle()
    $('#advanced_search').toggle()
  })
  /////////////////////////////////////////////////////////////////////////////////////////
  //END MENU LOGIC/////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
})
