export const parseQuestions = (text)=> {
  const parts = text.split(/\d+\.\s/).filter(Boolean);
  const questions = parts.map(part => {
    const [questionAndRest, ..._] = part.split('A)');
    const question = questionAndRest.replace(/\n/g, '').trim();

    const optionsMatch = part.match(/A\)(.*?)B\)(.*?)C\)(.*?)D\)(.*?)(?:\n\n|Answer:)/s);
    let options = [];
    if (optionsMatch) {
      options = [
        `A)${optionsMatch[1].trim()}`,
        `B)${optionsMatch[2].trim()}`,
        `C)${optionsMatch[3].trim()}`,
        `D)${optionsMatch[4].trim()}`
      ];
    }

    const answerMatch = part.match(/Answer:\s*([^\n]+)/);
    const answer = answerMatch ? answerMatch[1].trim() : "";

    return {
      question,
      options,
      answer
    };
  });

  return questions;
}

