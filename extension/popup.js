document.getElementById('auditBtn').addEventListener('click', async () => {
  const statusDiv = document.getElementById('status');
  statusDiv.innerText = "Grabbing active tab location data...";

  // Query Chrome to find the current active web address path
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  if (!tab || !tab.url) {
    statusDiv.innerText = "Error: Invalid checkout page trace window.";
    return;
  }

  statusDiv.innerText = "Connecting to AltSpend internal crawling worker...";

  try {
    const response = await fetch('http://127.0.0.1:8000/api/v1/audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: tab.url })
    });

    const data = await response.json();
    if (data.success) {
      statusDiv.innerHTML = `
        <div style="margin-top:10px; border-top:1px solid #334155; pt:10px;">
          <p><b>Sticker Price:</b> ₹${data.sticker_price.toLocaleString('en-IN')}</p>
          <p style="color:#a3e635;">Options audited successfully! Check web portal dashboard for full structural matrix logs.</p>
        </div>
      `;
    } else {
      statusDiv.innerText = "Scraper calculation loop returned an error payload.";
    }
  } catch (err) {
    statusDiv.innerText = `Connection Failed: ${err.message}`;
  }
});