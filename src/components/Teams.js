import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import './Teams.css';

function Teams() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch the CSV file (adjust the path as necessary)
    fetch('tttdataset.csv')
      .then(response => response.text())
      .then(csvData => {
        Papa.parse(csvData, {
          header: true, // Assuming your CSV has headers
          complete: (result) => {
            setData(result.data);
          },
        });
      })
      .catch(error => console.error('Error fetching CSV file:', error));
  }, []);

  return (
    <div className="teams">
      <h2>Teams and Players</h2>
      {data.length > 0 ? (
        <table>
          <thead>
            <tr>
              {Object.keys(data[0]).map((key, index) => (
                <th key={index}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {Object.values(row).map((value, colIndex) => (
                  <td key={colIndex}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
}

export default Teams;