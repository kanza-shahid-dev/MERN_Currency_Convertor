const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");
const rateLimit = require("express-rate-limit");

const app = express();
dotenv.config();
const API_URL = "https://v6.exchangerate-api.com/v6/";
const API_KEY = process.env.EXHANGE_RATE_API_KEY;

const apiLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
});

//middleware
app.use(express.json());
app.use(cors());
app.use(apiLimit);

//Conversion
app.post("/api/convert", async (req, res) => {
  try {
    const { amount, from, to } = req.body;
    const url = `${API_URL}${API_KEY}/pair/${from}/${to}/${amount}`;
    const response = await axios.get(url);
    if (response.data && response.data.conversion_result) {
      res.json({
        base: from,
        target: to,
        conversionRate: response.data.conversion_result,
        convertedAmount: response.data.conversion_result * amount,
      });
    } else {
      res.json({ error: "Invalid input", details: response.data });
    }
  } catch (err) {
    res.status(500).json({
      error: "An error occurred during conversion",
      details: err.message,
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server is -->running ${PORT}`));
