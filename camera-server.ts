import 'dotenv/config'; // Import dotenv configuration
import https from 'https';
import fs from 'fs';
import path from 'path';
import express from 'express';
import cors from 'cors';

import categoryRoutes from './routes/category-routes'; // Import the routes

const app = express();
const port = process.env.PORT || 3001;

// Path to SSL certificates
const certPath = "/etc/letsencrypt/live/rexlee.space/";

const options = {
  key: fs.readFileSync(path.join(certPath, "privkey.pem")),
  cert: fs.readFileSync(path.join(certPath, "cert.pem")),
  ca: fs.readFileSync(path.join(certPath, "chain.pem")),
};

//app.use(cors(corsOptions));

app.use(cors());
app.use(express.json());

// Mounting routes
app.use("/category", categoryRoutes);


//Create an HTTPS server
https.createServer(options, app).listen(444, () => {
  console.log("HTTPS server running on port 444");
});

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });
