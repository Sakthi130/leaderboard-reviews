document.addEventListener('DOMContentLoaded', function() {
  const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTaYVCNVbwusD3ykt6zDrfNQuNTVmk9W2CVxodvOvvNbOL2qH5FPFEW6jJ-Ld6JXkt7m8b2lqKlZMfv/pub?output=csv';
  
  Papa.parse(csvUrl, {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: function(results) {
      const emailKey = 'Email Address';
      const countKey = 'COUNTA of Customer Trail ID';
      // Filter out any empty or total rows
      const filteredData = results.data.filter(row => row[emailKey] && row[emailKey] !== 'Grand Total');
      // Sort by review count descending
      filteredData.sort((a, b) => parseInt(b[countKey]) - parseInt(a[countKey]));

      const tableBody = document.querySelector('#leaderboard-table tbody');
      filteredData.forEach((row, index) => {
        const rank = index + 1;
        const email = row[emailKey];
        // Convert email to "Firstname Lastname"
        let namePart = email.split('@')[0];
        let name = namePart.split(/[._\-]/).map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');

        const tr = document.createElement('tr');
        const rankCell = document.createElement('td');
        const nameCell = document.createElement('td');
        const countCell = document.createElement('td');

        // Add medal emoji for top 3 ranks
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
        countCell.textContent = row[countKey];

        tr.appendChild(rankCell);
        tr.appendChild(nameCell);
        tr.appendChild(countCell);
        tableBody.appendChild(tr);
      });
    }
  });
});