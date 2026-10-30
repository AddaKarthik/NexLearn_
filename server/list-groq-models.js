
require('dotenv').config();

const Groq = require('groq-sdk');

async function checkModels() {
  try {
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });

    const result = await groq.models.list();

    console.log('\nAvailable Groq Models:\n');

    result.data
      .filter(model => model.active)
      .forEach(model => console.log(model.id));

  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkModels();
