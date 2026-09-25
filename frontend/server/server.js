import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3001;

app.use(
  cors({
    origin: 'http://localhost:5173',
  })
);

app.use(express.json());


// ========================================
// HEALTH CHECK
// ========================================

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Leave Management backend is running',
  });
});


// ========================================
// GET SAP ACCESS TOKEN
// ========================================

async function getSapAccessToken() {
  const credentials = Buffer.from(
    `${process.env.SAP_CLIENT_ID}:${process.env.SAP_CLIENT_SECRET}`
  ).toString('base64');

  const tokenUrl = process.env.SAP_TOKEN_URL.endsWith('/oauth/token')
    ? process.env.SAP_TOKEN_URL
    : `${process.env.SAP_TOKEN_URL}/oauth/token`;

  console.log('Token URL:', tokenUrl);

  const response = await fetch(tokenUrl, {
    method: 'POST',

    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },

    body: 'grant_type=client_credentials',
  });

  console.log('Token response status:', response.status);

  if (!response.ok) {
    const errorText = await response.text();

    console.log('Token response:', errorText);

    throw new Error(
      `SAP authentication failed: ${response.status} ${errorText}`
    );
  }

  const data = await response.json();

  return data.access_token;
}


// ========================================
// GET LEAVE REQUESTS FROM SAP
// ========================================

app.get('/api/leave-requests', async (req, res) => {
  try {
    console.log('');
    console.log('========================================');
    console.log('Requesting SAP leave requests...');
    console.log('========================================');

    // Get OAuth access token
    const accessToken = await getSapAccessToken();

    console.log('SAP access token received successfully.');

    // SAP OData URL
    const sapUrl =
      `${process.env.SAP_ODATA_URL}LeaveRequests?sap-client=100`;

    console.log('SAP OData URL:', sapUrl);

    // Call SAP
    const response = await fetch(sapUrl, {
      method: 'GET',

      // IMPORTANT:
      // Do not automatically follow redirects.
      redirect: 'manual',

      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Show response information
    console.log('SAP OData status:', response.status);
    console.log(
      'SAP OData content type:',
      response.headers.get('content-type')
    );
    console.log(
      'SAP OData location:',
      response.headers.get('location')
    );

    // Read response as text first
    // This helps us see what SAP is actually returning.
    const responseText = await response.text();

    console.log('SAP response preview:');
    console.log(responseText.substring(0, 500));

    // Check HTTP status
    if (!response.ok) {
      throw new Error(
        `SAP OData request failed: ${response.status} ${responseText}`
      );
    }

    // Try converting SAP response to JSON
    let data;

    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      throw new Error(
        `SAP returned non-JSON response. Content-Type: ${
          response.headers.get('content-type')
        }. Response starts with: ${responseText.substring(0, 200)}`
      );
    }

    console.log('SAP leave requests loaded successfully.');

    res.json(data);

  } catch (error) {
    console.error('');
    console.error('========== SAP ERROR ==========');
    console.error(error);
    console.error('================================');

    res.status(500).json({
      error: 'Failed to load data from SAP',
      message: error.message,
    });
  }
});


// ========================================
// START SERVER
// ========================================

app.listen(PORT, () => {
  console.log('');
  console.log(
    `SAP Leave Management backend running at http://localhost:${PORT}`
  );
  console.log('');
});