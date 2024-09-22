import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [jsonInput, setJsonInput] = useState('');
  const [isValidJson, setIsValidJson] = useState(true);
  const [responseData, setResponseData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedFields, setSelectedFields] = useState([]);

  // Set document title to your roll number
  useEffect(() => {
    document.title = "AP21110011366";  
  }, []);

  // Function to validate JSON input
  const validateJsonInput = () => {
    try {
      JSON.parse(jsonInput);
      setIsValidJson(true);
      return true;
    } catch (error) {
      setIsValidJson(false);
      return false;
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateJsonInput()) {
      setErrorMessage('Invalid JSON input');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/bfhl', JSON.parse(jsonInput));

      setResponseData(response.data);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Error submitting the request');
    }
  };

  // Handle field selection from dropdown
  const handleFieldSelection = (e) => {
    const value = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedFields(value);
  };

  // Render the selected fields from response
  const renderSelectedResponse = () => {
    if (!responseData) return null;

    const renderedData = {};
    if (selectedFields.includes('Alphabets')) renderedData.alphabets = responseData.alphabets;
    if (selectedFields.includes('Numbers')) renderedData.numbers = responseData.numbers;
    if (selectedFields.includes('Highest Lowercase Alphabet')) renderedData.highest_lowercase_alphabet = responseData.highest_lowercase_alphabet;

    return (
      <div>
        <h3>Selected Response Data</h3>
        <pre>{JSON.stringify(renderedData, null, 2)}</pre>
      </div>
    );
  };

  return (
    <div>
      <h1>BFHL Frontend</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Enter JSON Data:</label>
          <textarea 
            rows="5" 
            cols="50" 
            value={jsonInput} 
            onChange={(e) => setJsonInput(e.target.value)} 
          />
        </div>
        {!isValidJson && <p style={{color: 'red'}}>Invalid JSON input</p>}
        <button type="submit">Submit</button>
      </form>

      {responseData && (
        <div>
          <h2>API Response</h2>
          <pre>{JSON.stringify(responseData, null, 2)}</pre>

          <label>Select fields to display:</label>
          <select multiple onChange={handleFieldSelection}>
            <option value="Alphabets">Alphabets</option>
            <option value="Numbers">Numbers</option>
            <option value="Highest Lowercase Alphabet">Highest Lowercase Alphabet</option>
          </select>

          {renderSelectedResponse()}
        </div>
      )}

      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
}

export default App;

