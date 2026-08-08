// Import the Express framework
const express = require("express");

// Create an Express application
const app = express();

// Define the port number where the server will run
const PORT = 3000;

// Mock weather data stored in an object
const weatherData = {
  london: { tempC: 18, condition: "cloudy" },
  lagos: { tempC: 30, condition: "sunny" }
};

// Define a GET endpoint to fetch weather by city
app.get("/api/weather/:city", (req, res) => {
  // Extract the city parameter from the request URL
  const city = req.params.city.toLowerCase();

  // Check if the city exists in our mock data
  if (weatherData[city]) {
    // If found, return the weather data as JSON
    res.json(weatherData[city]);
  } else {
    // If not found, return a 404 Not Found error
    res.status(404).json({ error: "City not found" });
  }
});

// Start the server and listen on the defined port
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
