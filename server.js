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
  const data = fs.readFileSync('data.json');
  return JSON.parse(data);
};

const writeBookings = (data) => {
  fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
};

app.post('/data', (req, res) => {
  const { dates } = req.body;

  if (!Array.isArray(dates) || dates.length === 0) {
    return res.status(400).json({ message: 'No dates provided' });
  }

  const data = readBookings();

  const newBooking = {
    id: Date.now(),
    dates
  };

  data.bookings.push(newBooking);
  writeBookings(data);

  res.status(201).json({
    message: 'Booking saved',
    booking: 
    newBooking
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

