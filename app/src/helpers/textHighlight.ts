import { STOP_WORDS } from "../constants";

export const highlightText = (textArray: string[], textToHighlight: string): string => {
  const queryArr = textToHighlight.split(' ');
  const newPageTextArray = [];

  // loop through each sentence in pageText array
  textArray.forEach((sentence) => {
    const newWordsArray = [];
    let newSentence = '';
    // make array of each word in sentence
    const wordsArray = sentence.split(' ');
    // loop through each word in sentence
    wordsArray.forEach((word) => {
      let newWord = word;
      queryArr.forEach((term) => {
        const cleanTerm = term.trim().toLowerCase();
        // ignore stop words
        if (STOP_WORDS.indexOf(cleanTerm) > -1) return;
        // remove trailing periods, commas or spaces from word for more accurate comparison
        const cleanWord = word.replace(/\,/g, '').replace(/\./g, '').trim().toLowerCase();
        if (cleanWord === term.trim().toLowerCase()) {
          newWord = `<em>${word}</em>`
        }
      });
      newWordsArray.push(newWord);
    });
    // make new sentence from new words array
    newSentence = newWordsArray.join(' ');
    // add new sentence to new pageText array
    newPageTextArray.push(newSentence);
  });

  return newPageTextArray.join(',');
}