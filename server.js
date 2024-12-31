import express from 'express';
import fs from 'fs/promises';
import cors from 'cors';
import morgan from 'morgan';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.post('/submit-application', async (req, res) => {
  try {
    const formData = req.body;
    
    // Read existing data
    let data = [];
    try {
      const fileContent = await fs.readFile('data.json', 'utf-8');
      data = JSON.parse(fileContent);
    } catch (error) {
      // If file doesn't exist or is empty, we'll start with an empty array
    }
    
    // Add new submission
    data.push(formData);
    
    // Write updated data back to file
    await fs.writeFile('data.json', JSON.stringify(data, null, 2));
    
    console.log('New application saved:', formData);
    res.json({ message: 'Application submitted successfully!' });
  } catch (error) {
    console.error('Error saving application:', error);
    res.status(500).json({ message: 'An error occurred while saving your application.' });
  }
});


// app.get('/get-applications', async (req, res) => {
//   try {
//     const fileContent = await fs.readFile('data.json', 'utf-8');
//     const data = JSON.parse(fileContent);
//     res.json(data);
//   } catch (error) {
//     console.error('Error reading applications:', error);
//     res.status(500).json({ message: 'An error occurred while retrieving applications.' });
//   }
// });

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});