
import AWS from 'aws-sdk';

const spacesEndpoint = new AWS.Endpoint('https://sgp1.digitaloceanspaces.com'); // Replace 'your-space-endpoint' with your Space endpoint
const accessKeyId = 'DO00QAJXZ26W88NM7G2V'; // Replace 'your-access-key-id' with your Spaces access key
const secretAccessKey = '45/t7DydVQwNjJAXwmU9ZXBxQ9J+QQXva7OOP/c+Q7g'; // Replace 'your-secret-access-key' with your Spaces secret key

const spaces = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId,
  secretAccessKey,
});

export default spaces;