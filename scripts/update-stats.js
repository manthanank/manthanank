/**
 * Script to fetch and update WakaTime stats for the GitHub profile
 * This should be run via GitHub Actions to keep stats up-to-date
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuration
const WAKATIME_API_KEY = process.env.WAKATIME_API_KEY;
const OUTPUT_DIR = path.join(__dirname, '../public/data');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'wakastats.json');

// Create the output directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log(`Created directory: ${OUTPUT_DIR}`);
}

/**
 * Fetch stats from WakaTime API
 */
async function fetchWakaTimeStats() {
  if (!WAKATIME_API_KEY) {
    console.error('Error: WAKATIME_API_KEY is required as an environment variable');
    process.exit(1);
  }

  // Default to empty data structure if fetch fails
  const defaultData = {
    data: {
      languages: [],
      range: {
        end: new Date().toISOString(),
        start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
      },
    },
  };

  // Options for the API request
  const options = {
    hostname: 'wakatime.com',
    path: `/api/v1/users/current/stats/last_7_days?api_key=${WAKATIME_API_KEY}`,
    method: 'GET',
    headers: {
      'User-Agent': 'ManthanANK/Github-Profile',
    },
  };

  return new Promise(resolve => {
    console.log('Fetching WakaTime stats...');

    const req = https.request(options, res => {
      let data = '';

      res.on('data', chunk => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const parsedData = JSON.parse(data);
            resolve(parsedData);
          } catch (e) {
            console.error('Error parsing API response:', e);
            resolve(defaultData);
          }
        } else {
          console.error(`API request failed with status code ${res.statusCode}`);
          resolve(defaultData);
        }
      });
    });

    req.on('error', e => {
      console.error(`API request error: ${e.message}`);
      resolve(defaultData);
    });

    req.end();
  });
}

/**
 * Main function
 */
async function main() {
  try {
    console.log('Updating stats...');

    const stats = await fetchWakaTimeStats();

    // Write stats to JSON file
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(stats, null, 2));
    console.log(`Stats updated successfully: ${OUTPUT_FILE}`);

    // Log a sample of the data
    if (stats.data && stats.data.languages && stats.data.languages.length) {
      console.log('Top 3 languages of the last 7 days:');
      stats.data.languages.slice(0, 3).forEach((lang, i) => {
        console.log(`${i + 1}. ${lang.name}: ${lang.percent.toFixed(2)}%`);
      });
    }
  } catch (error) {
    console.error('Error updating stats:', error);
    process.exit(1);
  }
}

main();
