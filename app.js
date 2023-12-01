const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const cors=require('cors')

const app = express();
const port = 5000;

const uri = 'mongodb+srv://mvsadmin:Welcome%40109@mvsdbcluster.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000';
const client = new MongoClient(uri);
app.use(express.json())
app.use(cors())




app.post('/api/authenticate', async (req, res) => {
  console.log(req.body)
  const { userid, password } = req.body;

  try {
    await client.connect();

    const database = client.db('mvsfinance');
    const collection = database.collection('users');

    // Check if the provided userid and password match a user in the collection
    const user = await collection.findOne({ userid, password });

    if (user) {
      // User found, authentication successful
      res.json({ success: true,user }).status(200);
    } else {
      // User not found, authentication failed
      res.status(401).json({ success: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await client.close();
  }
});


app.post('/api/getUserInfo', async (req, res) => {
  const { userid } = req.body;

  try {
    await client.connect();

    const database = client.db('mvsfinance');
    const collection = database.collection('users');

    // Find the user by userid and exclude the 'password' field from the result
    const user = await collection.findOne({ userid }, { projection: { password: 0 } });

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await client.close();
  }
});

app.post('/api/mavin/authenticate', async (req, res) => {
  console.log(req.body)
  const { emailaddress, password } = req.body;

  try {
    await client.connect();

    const database = client.db('mvsfinance');
    const collection = database.collection('users');

    // Check if the provided userid and password match a user in the collection
    const user = await collection.findOne({ emailaddress, password });

    if (user) {
      // User found, authentication successful
      res.json({ success: true,user }).status(200);
    } else {
      // User not found, authentication failed
      res.status(401).json({ success: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await client.close();
  }
});

app.get('/api/data', async (req, res) => {
  try {
    await client.connect();

    const database = client.db('mvsfinance');
    const collection = database.collection('users');

    // Retrieve all data from the collection
    const result = await collection.find({}).toArray();

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await client.close();
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
