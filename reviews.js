document.addEventListener('DOMContentLoaded', function () {
  const apiKey = "AIzaSyCXI572KRVMs95yaekkJXh2gNEYZIqJvTo";  // replace with your actual key
  const sheetId = "1qZnVLJ8FSZx_KYO8IpavepZxYI3-V-cD_4fAT6KT66I"; // your sheet ID
  const range = "'Pivot Table 1'!A1:O1000"; // pivot table range
  const tableBody = document.querySelector('#leaderboard-table tbody');

  function fetchAndUpdateLeaderboard() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(range)}?key=${apiKey}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        const rows = data.values;
        if (!rows || rows.length === 0) return;

        // First row is headers
        const headers = rows[0];
        const emailIndex = headers.indexOf("Email Address");
        const countIndex = headers.indexOf("COUNTA of Customer Trail ID");

        // Clear old rows
        tableBody.innerHTML = '';

        // Filter valid rows (skip empty + Grand Total)
        const filteredData = rows.slice(1).filter(r => r[emailIndex] && r[emailIndex] !== 'Grand Total');

        // Sort by count desc
        filteredData.sort((a, b) => parseInt(b[countIndex]) - parseInt(a[countIndex]));

        filteredData.forEach((row, index) => {
          const rank = index + 1;
          const email = row[emailIndex];
          const count = row[countIndex];

          let namePart = email.split('@')[0];
          let name = namePart.split(/[._\-]/).map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');

          const tr = document.createElement('tr');
          const rankCell = document.createElement('td');
          const nameCell = document.createElement('td');
          const countCell = document.createElement('td');

          // Medal for top 3
          if (rank === 1) {
            rankCell.textContent = `🥇 ${rank}`;
            tr.classList.add('first-place');
          } else if (rank === 2) {
            rankCell.textContent = `🥈 ${rank}`;
            tr.classList.add('second-place');
          } else if (rank === 3) {
            rankCell.textContent = `🥉 ${rank}`;
            tr.classList.add('third-place');
          } else {
            rankCell.textContent = rank;
          }

          nameCell.textContent = name;
          countCell.textContent = count;

          tr.appendChild(rankCell);
          tr.appendChild(nameCell);
          tr.appendChild(countCell);
          tableBody.appendChild(tr);
        });
      })
      .catch(err => console.error("Error fetching sheet data:", err));
  }

  // Initial load
  fetchAndUpdateLeaderboard();

  // Auto-refresh every 1 min
  setInterval(fetchAndUpdateLeaderboard, 60000);
});
