const request = require('supertest');
const fs = require('fs');
const path = require('path');
const app = require('../server');

const dataPath = path.join(__dirname, '../data.json');


describe('Bookings API', () => {
  test('GET /bookings returns empty array initially', () => {
    return request(app)
      .get('/bookings')
      .expect(200)
  })
  test('POST /bookings succeeds with valid dates', () => {
    return request(app)
      .post('/bookings')
      .send({
        bookingData: {
        firstName: "Simon",
        lastName: "Ormond",
        email: "simonormond06@gmail.com",
        phone: "07484160084",
        booked_dates: [
          "2026-01-08",
          "2026-01-09",
          "2026-01-10"
        ]
      },
      })
      .expect(201)
  });
  test('POST /bookings fails when no dates were selected', () => {
    return request(app)
      .post('/bookings')
      .send({
        bookingData: {
        firstName: "Simon",
        lastName: "Ormond",
        email: "simonormond06@gmail.com",
        phone: "07484160084",
        booked_dates: []
      },
      })
      .expect(400)
  });
  test('GET /bookings returns JSON', () => {
        return request(app)
	    .get('/bookings')
	    .expect('Content-type', /json/);
    });
  test('GET /reviews returns JSON', () => {
        return request(app)
	    .get('/reviews')
	    .expect('Content-type', /json/);
    });
  test('GET /reviews returns empty array initially', () => {
    return request(app)
      .get('/reviews')
      .expect(200)
      .expect([]);
  });
  test('POST /reviews creates a new review', () => {
    return request(app)
      .post('/reviews')
      .send({
        rating: 5,
        comment: 'Amazing stay'
      })
      .expect(201)
  });
  test('POST /reviews fails with invalid rating', () => {
    return request(app)
      .post('/reviews')
      .send({
        rating: 10,
        comment: 'Nope'
      })
      .expect(400);
  });
});
