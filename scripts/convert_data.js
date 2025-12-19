import fs from 'fs';
import path from 'path';

// Path to the markdown file (Absolute path as identified)
const MD_PATH = '/Users/mac/Downloads/인공지능/youtube-transcript-mcp/park_golf_edited.md';
const OUTPUT_PATH = path.join(process.cwd(), 'src/data/questions.json');

try {
  const content = fs.readFileSync(MD_PATH, 'utf-8');
  
  // Regex to match Questions: **Q1. Question text?**
  // And capture everything until the next Q or end of section
  const questionRegex = /\*\*Q(\d+)\.\s*(.*?)\*\*\n([\s\S]*?)(?=\*\*Q\d+\.|$|##)/g;
  
  const questions = [];
  let match;

  while ((match = questionRegex.exec(content)) !== null) {
    const id = parseInt(match[1]);
    const questionText = match[2].trim();
    let answerText = match[3].trim();

    // Clean up answer text
    // Remove leading bullet points or numbers if they are just formatting
    // But keep structure if it's multiple choice-ish
    // answerText = answerText.replace(/^\*+\s*/, '').replace(/^\d+\.\s*/, '');
    
    // Determine category based on ID ranges (Approximate based on book structure if known, otherwise 'General')
    let category = '일반';
    if (id <= 50) category = '파크골프 기초';
    else if (id <= 100) category = '장비 및 시설';
    else if (id <= 200) category = '경기 규칙';
    else category = '실전 기술';

    questions.push({
      id: id,
      category: category,
      question: questionText,
      answer: answerText
    });
  }

  console.log(`Found ${questions.length} questions.`);
  
  // Ensure strict valid JSON
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(questions, null, 2));
  console.log(`Successfully wrote to ${OUTPUT_PATH}`);

} catch (error) {
  console.error("Error converting file:", error);
}
