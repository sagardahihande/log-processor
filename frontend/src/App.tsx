import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

function App() {
  const [stats, setStats] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    const socket = io('ws://localhost:5000');

    axios.get('http://localhost:5000/api/stats').then((res) => setStats(res.data));

    socket.on('message', (data) => {
      console.log('WebSocket message:', data);
      axios.get('http://localhost:5000/api/stats').then((res) => setStats(res.data));
    });

    return () => {
      socket.disconnect(); // Correct cleanup function
    };
  }, []);

  const uploadFile = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    await axios.post('http://localhost:5000/api/upload', formData);
  };

  return (
    <div className="App">
      <h1>Log Processor Dashboard</h1>
      <input type="file" onChange={(e) => setFile(e.target.files![0])} />
      <button onClick={uploadFile}>Upload Log</button>

      <table border={1}> {/* ✅ Fix: Use number instead of string */}
        <thead>
          <tr>
            <th>Errors</th>
            <th>Keywords</th>
            <th>Unique IPs</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((stat, index) => (
            <tr key={index}>
              <td>{stat.errors}</td>
              <td>{stat.keywords}</td>
              <td>{stat.unique_ips.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
