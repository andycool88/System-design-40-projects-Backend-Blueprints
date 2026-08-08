How to Test
Run: node index.js

Visit: http://localhost:3000/api/weather/london → returns JSON { tempC: 18, condition: "cloudy" }.

Visit: http://localhost:3000/api/weather/lagos → returns JSON { tempC: 30, condition: "sunny" }.

Try an unknown city → returns 404 City not found.