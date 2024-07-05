import express from 'express';
import generateFile from '../compiler_codes/generateFile.js';
import executeCpp from '../compiler_codes/executeCpp.js';
import generateInputFile from '../compiler_codes/generateInputFile.js';

const router = express.Router();

router.post('/run', async (req, res) => {
  const { language = 'cpp', code, input } = req.body;

  if (code === undefined) {
    return res.status(400).json({
      success: false,
      message: "Empty code body",
    });
  }

  try {
    const filePath = await generateFile(language, code);
    const inputPath = await generateInputFile(input);
    const output = await executeCpp(filePath, inputPath);
    res.send({ filePath, output, inputPath });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error" + error.message,
    });
  }
});

export default router;
