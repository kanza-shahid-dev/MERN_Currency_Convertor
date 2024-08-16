import { useState } from "react";
import axios from "axios";

function App() {
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    amount: "",
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const currencyCodes = [
    "USD",
    "EUR",
    "GBP",
    "GHS",
    "JPY",
    "CAD",
    "BSD",
    "PKR",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //Http Request
    try {
      const response = await axios.post(
        "http://localhost:5000/api/convert",
        formData
      );
      setResult(response?.data);
      setError("");
    } catch (error) {
      setError("Error", error ? error?.error : "Error");
    }
  };

  return (
    <div>
      <section className="hero">
        <h1>Global Currency Converter</h1>
      </section>
      <section className="converter">
        <form onSubmit={handleSubmit}>
          <select
            name="from"
            value={formData.from}
            onChange={handleChange}
            className="input"
          >
            <option value="">Select From Currency</option>
            {currencyCodes.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
          <select
            name="to"
            value={formData.to}
            onChange={handleChange}
            className="input"
          >
            <option value="">Select To Currency</option>
            {currencyCodes.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
          <input
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Amount"
            type="number"
            className="input"
          />
          <button type="submit" className="submit-btn">
            Convert
          </button>
        </form>
        {result && (
          <div className="result">
            <p>
              Converted Amount: {result.convertedAmount} {result.target}
            </p>
            <p>Conversion Rate: {result.conversionRate}</p>
          </div>
        )}
        {error && <p className="error">{error}</p>}
      </section>
    </div>
  );
}

export default App;
