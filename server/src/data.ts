import * as fs from "fs";

const pdf = require('pdf-parse');


// Define structure of the extracted data
interface ExtractedData {
    date: string;
    verse_of_day: string;
}

// Function to extract data from text
function extractDataFromText(text: string): ExtractedData[] {
    const results: ExtractedData[] = [];
    const lines = text.split('\n');
    console.log(lines)

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        let date: string | undefined;

        // Match lines with the date pattern
        const dateMatch = line.match(/^([A-Za-z]+ \d+) - PROMISE #\d+/);
        if (dateMatch) {
            date = dateMatch[1];
            console.log(`Matched date: ${date}`);

        }

        // Look for the next line containing verse details
        // If we have a date, try to extract the verse which is the third line after the date
        if (date && i + 4 < lines.length) {
            const verseLine = lines[i + 4].trim();
            console.log("hello", verseLine)
// Verse is always 3 lines after the date line


            // Match the verse pattern, e.g., Psalm 103:8
            const verseMatch = verseLine.match(/([A-Za-z]+ \d+:\d+)/); // Match format like Psalm 103:8
            if (verseMatch) {
                results.push({
                    date: date, // Push the date and verse
                    verse_of_day: verseMatch[1], // The verse itself
                });
            }
        }
    }
    console.log(`Matched date: ${results}`);

    return results;
}

// Function to save data as a JSON file
function saveDataAsJSON(data: ExtractedData[], outputFilePath: string): void {
    fs.writeFileSync(outputFilePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`Data saved to ${outputFilePath}`);
}

// Load and process the PDF file
async function processPDF(filePath: string, outputFilePath: string): Promise<void> {
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdf(dataBuffer);

    const extractedData =  extractDataFromText(pdfData.text);
    console.log(`Matched date: ${extractedData}`);

    saveDataAsJSON(extractedData, outputFilePath);
}

// Replace 'example.pdf' with the path to your PDF file and 'output.json' with the desired JSON output path
const inputPDF = '365Promises.pdf';
const outputJSON = 'data.json';

processPDF(inputPDF, outputJSON).catch(console.error);
