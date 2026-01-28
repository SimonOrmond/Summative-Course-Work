const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('Website'));


app.get('/', (req, res) => {
  res.send('Server is running');
});

const readBookings = () => {
  const data = fs.readFileSync('bookings.json');
  return JSON.parse(data);
};

const writeBookings = (data) => {
  fs.writeFileSync('bookings.json', JSON.stringify(data, null, 2));
};

app.get('/bookings', (req, res) => {
  const data = JSON.parse(fs.readFileSync('bookings.json', "utf8"));
  res.json(data.bookings);
});

app.get('/reviews', (req, res) => {
  const data = JSON.parse(fs.readFileSync('bookings.json', "utf8"));
  res.json(data.reviews);
});

app.post('/reviews', (req, res) => {
  const { rating, comment } = req.body;

  if (!rating||rating<1||rating>5) {
    return res.status(400).json({ message: 'Invalid rating' });
  }

  const data = readBookings();

  const newReview = {
    id: Date.now(),
    rating: Number(rating),
    comment: comment?.trim(),
    date: new Date().toISOString().split('T')[0]
  };

  data.reviews.push(newReview);

  writeBookings(data);

  res.status(201).json({
    message: 'Review saved',
    booking: data
  });
});


app.post('/bookings', (req, res) => {
  const booking = req.body;

  if (!booking.bookingData.firstName || !booking.bookingData.email || !booking.bookingData.booked_dates?.length) {
    return res.status(400).json({ error: "Invalid booking data" });
  };

  const data = readBookings();

  data.bookings.push({
    ...booking,
    createdAt: new Date().toISOString()
  });

  writeBookings(data);

  res.status(201).json({
    message: 'Booking saved',
    booking: data
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

//used chatGPT for below code when debugging why I got the error "app.address is not a function" when testing
module.exports = app;
