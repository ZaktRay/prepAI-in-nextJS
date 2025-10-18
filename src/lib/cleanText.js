export function cleanPdfText(rawText) {
  return rawText
    .replace(/\r?\n|\r/g, " ")       
    .replace(/\s+/g, " ")           
    .replace(/-\s+/g, "")            
    .trim();               
}