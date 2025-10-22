const pdf = require('pdf-parse');
async function extractTextFromPDF(buffer) {
    try {
        const data = await pdf(buffer);
        return data.text || '';
    } catch (err) {
        console.error('pdf extract error', err);
        return '';
    }
}
module.exports = { extractTextFromPDF };
