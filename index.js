const express = require('express');
const app = express();

app.use(express.json());
app.use(require('cors')())

const { flights } = require('./data')

app.all('/test', (req, res) => res.send({ message: 'every thing working just fine!' }))

app.post('/flights', (req, res) => {
   const flight = req.body;

   if (!flight.flightNumber || !flight.timeDepart || !flight.timeArrive ||
      !flight.cityDepart || !flight.cityArrive || !flight.gate)
      return res.status(400).json({ message: 'Missing required data' });


   const maxId = Math.max(...flights.map((f) => f.id));
   flight.id = maxId + 1;
   flights.push(flight);
   res.status(201).json(flight);
});

app.put('/flights/:id', (req, res) => {
   const id = parseInt(req.params.id);
   const flight = flights.find((f) => f.id === id);
   if (!flight) return res.status(404).json({ message: 'Flight not found' });
   const updatedData = req.body;
   Object.assign(flight, updatedData);
   res.json(flight);
});

app.get('/flights/:id', (req, res) => {
   const id = parseInt(req.params.id);
   const flight = flights.find((f) => f.id === id);
   if (!flight) return res.status(404).json({ message: 'Flight not found' });
   res.json(flight);
});

app.get('/flights', (req, res) => res.json(flights));

app.delete('/flights/:id', (req, res) => {
   const id = parseInt(req.params.id);
   const index = flights.findIndex((f) => f.id === id);
   if (index === -1) return res.status(404).json({ message: 'Flight not found' });
   flights.splice(index, 1);
   res.json({ message: 'Flight deleted' });
});

app.listen(4001, () => console.log('Server running on port 4001'));
