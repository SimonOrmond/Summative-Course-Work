document.addEventListener('DOMContentLoaded', function () {
  const details_form = document.getElementById('Form');
  const review = document.getElementById('submitReview');
  const current_date = new Date();
  const month_next = document.getElementById('month_next');
  const month_prev = document.getElementById('month_prev');
  const month = document.getElementById('month');
  let months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  let days_of_months = [31,28,31,30,31,30,31,31,30,31,30,31];
  let current_month = months[current_date.getMonth()];
  month.textContent = current_month;
  let month_index = months.indexOf(current_month);
  
  const year_next = document.getElementById('year_next');
  const year_prev = document.getElementById('year_prev');
  const year = document.getElementById('year');
  year.textContent = current_date.getFullYear();

  const clear_dates = document.getElementById('clear_dates');
  const calendar = document.getElementById("calendar");

  let bookedDates = []
  let weekday_data = [[3, 6, 0, 3, 5, 1, 3, 6, 2, 4, 0, 2],[5, 1, 1, 4, 6, 2, 4, 0, 3, 5, 1, 3],[6, 2, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4],[0, 3, 3, 6, 1, 4, 6, 2, 5, 0, 3, 5],[1, 4, 5, 1, 3, 6, 1, 4, 0, 2, 5, 0],[3, 6, 6, 2, 4, 0, 2, 5, 1, 3, 6, 1],[4, 0, 0, 3, 5, 1, 3, 6, 2, 4, 0, 2],[5, 1, 1, 4, 6, 2, 4, 0, 3, 5, 1, 3],[6, 2, 3, 6, 1, 4, 6, 2, 5, 0, 3, 5],[1, 4, 4, 0, 2, 5, 0, 3, 6, 1, 4, 6],[2, 5, 5, 1, 3, 6, 1, 4, 0, 2, 5, 0],[3, 6, 6, 2, 4, 0, 2, 5, 1, 3, 6, 1],[4, 0, 1, 4, 6, 2, 4, 0, 3, 5, 1, 3],[6, 2, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4],[0, 3, 3, 6, 1, 4, 6, 2, 5, 0, 3, 5]];
  
  loadBookings();

  let day_pressed = false;
  let value1 = '';
  let value2 = '';
  let month1 = '';
  let month2 = '';
  let year1 = '';
  let year2 = '';

  let dates_completed = false;
  
  calendar.addEventListener("click", function (event) {
      if (event.target.classList.contains("days_buttons")) {
        const btn = event.target; 
        const day = Number(btn.value);
        if(day_pressed == false && dates_completed==false){
            value1 = day;
            month1 = month_index + 1;
            year1 = current_year;
            day_pressed = true;
            btn.style.backgroundColor="#1abc9c";
        }else if(day_pressed==true && dates_completed==false){
            dates_completed = true;
            value2 = day;
            month2 = month_index + 1;
            year2 = current_year;
            btn.style.backgroundColor="#1abc9c";
            let days = document.querySelectorAll('.days_list');
            let buttons = document.querySelectorAll('.days_buttons');
            for(i=0;i<days.length;i++){
              if(Number(days[i].textContent) > value1 & Number(days[i].textContent < value2)){
                days[i].style.backgroundColor = 'lightblue';
                buttons[i].style.backgroundColor = 'lightblue';
              };
            };
        }};
    });
  
  //use of async function and await learnt by debugging with ChatGPT-5

  async function loadBookings() {
    const response = await fetch("/bookings");
    if(!response.ok){
      alert('Problem with GET request: ' + response.statusText);
      return;
      };
    const bookingData = await response.json();

    bookedDates = bookingData.flatMap(
      booking => booking.bookingData.booked_dates
    );
    load_dates();
    console.log(bookedDates);
  };

  month_next.addEventListener('click', function () {
    nextmonth();
    load_dates();
  });
  month_prev.addEventListener('click', function () {
    prevmonth();
    load_dates();
  });
  year_next.addEventListener('click', function () {
    nextyear();
    load_dates();
  });
  year_prev.addEventListener('click', function () {
    prevyear();
    load_dates();
  });
  clear_dates.addEventListener('click', function() {
    cleardates();
  });

  details_form.addEventListener('submit', function(event) {
    event.preventDefault();
    if (dates_completed==false){
      alert('Please select dates first');
      return;
    }else if(!document.getElementById('firstName').value){
      alert('Please enter your first name first');
      return;
    }else if(!document.getElementById('email').value){
      alert('Please enter your email first');
      return;
    }
    
    const date1 = month1 + "/" + value1 + "/" + year1;
    const date2 = month2 + "/" + value2 + "/" + year2;
    const dates = generateDateRange(date1, date2);
    const bookingData = {
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        booked_dates: dates
      };
    console.log(bookingData)
    fetch('/bookings', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json'
        },
        body: JSON.stringify({ bookingData })
      })
        .then(res => res.json())
        .then(data => {
          dates_completed = false;
          day_pressed = false;
          loadBookings();
          alert('Booking successful');
        })
        .catch(err => console.error(err));
  });

  function generateDateRange(start, end) {
    let dates = [];
    const current = new Date(start);
    const last = new Date(end);

    while (current <= last) {
      dates.push(current.toISOString().split('T')[0]);
      current.setDate(current.getDate() + 1);
    };
    return dates;
  };
  
  function load_dates(){
    document.querySelectorAll('.days_list').forEach(e => e.remove());
    current_year = Number(year.textContent);
    let weekday_offset = weekday_data[current_year-2020][month_index];
    for(i=0;i<weekday_offset;i++){
      const placeholder = document.createElement("li");
      const button = document.createElement("button");
      button.className = 'days_buttons';
      placeholder.className = 'days_list';
      placeholder.style.backgroundColor = '#c3d8d2ff';
      placeholder.style.height = '10px';
      placeholder.style.padding = '20px';
      button.textContent ='  ';
      placeholder.appendChild(button);
      days.appendChild(placeholder);
    }
    
    for (i = 1; i <= days_of_months[month_index]; i++) {
      const list_element = document.createElement("li");
      const btn = document.createElement("button");
      list_element.className = "days_list";
      btn.className = "days_buttons";
      btn.value = i;
      btn.textContent = i;
      list_element.appendChild(btn);
      days.appendChild(list_element);
    }
    let dates_to_fill = 7-((weekday_offset+days_of_months[month_index]) % 7);
    if(dates_to_fill != 7){
      for(i=0;i<dates_to_fill;i++){
      const placeholder = document.createElement("li");
      const button = document.createElement("button");
      button.className = 'days_buttons';
      placeholder.className = 'days_list';
      placeholder.style.backgroundColor = '#c3d8d2ff';
      placeholder.style.height = '10px';
      placeholder.style.padding = '20px';
      button.textContent = '  ';
      placeholder.appendChild(button);
      days.appendChild(placeholder);
      }
    }
    days2 = document.querySelectorAll('.days_buttons');
    days2.forEach((day) => {
      if(day.textContent !== '  '){
        let date = current_year + "-" + (month_index+1) + "-" + day.textContent;
        date = new Date(date).toISOString().split('T')[0];
        if(bookedDates.includes(date)){
          list_item = day.closest('.days_list');
          list_item.style.backgroundColor = 'rgb(132, 180, 166)';
          day.style.backgroundColor = 'rgb(132, 180, 166)';
          day.style.color = 'white';
          day.disabled = true;
        }};
      });
  };

  function nextmonth(){
    if(month_index == 11){
        month.textContent = months[0];
        month_index = 0;
        year.textContent = Number(year.textContent) + 1;
    } else {
        month_index = month_index + 1;
        month.textContent = months[month_index];
    };
    if(dates_completed==true){
        cleardates();
    };
  };

  function prevmonth(){
    if(month_index == 0){
        month_index = 11;
        month.textContent = months[11];
        year.textContent = Number(year.textContent) - 1;
    } else {
        month_index = month_index -1;
        month.textContent = months[month_index];
    };
    if(dates_completed==true){
        cleardates();
    };
  };

  function nextyear(){
    integer_year = parseInt(year);
    let new_year = parseInt(year.textContent) + 1;
    year.textContent = new_year;
  };

  function prevyear(){
    integer_year = parseInt(year);
    let new_year = parseInt(year.textContent) - 1;
    year.textContent = new_year;
  };

  function cleardates(){
    const buttons = document.querySelectorAll(".days_buttons");
    const list_item = document.querySelectorAll(".days_list");

    buttons.forEach(btn =>{
        btn.style.backgroundColor = "";
    });
    list_item.forEach(li =>{
      if(li.textContent != '  '){
        li.style.backgroundColor = "";
      };
    });
    dates_completed = false;
    day_pressed = false;
    loadBookings();
  };
});