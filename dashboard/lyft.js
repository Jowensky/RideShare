
const { Lyft } = require('lyft-client');
const CLIENT_ID = process.env.Lyft_ID;
const CLIENT_SECRET = process.env.Lyft_Secret;
const lyft = new Lyft(CLIENT_ID, CLIENT_SECRET);

module.exports = lyft;