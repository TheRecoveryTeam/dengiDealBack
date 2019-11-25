const QUESTIONS_IN_BLOCK = {
  0: 11,
  1: 10,
  2: 11,
  3: 12,
  4: 11,
};

const resetIds = [
  '21211661', // Валерия Оганесян
  '135643041', // Виталий Чекров
  '23803395', // Игорь Латкин
  '120279256', // Фёдор Биличенко
  '61227517', // Виктория Синельникова
  '246800876', // Алиева Довлат
  '184406615', //
];

module.exports = {
  getQuestionIndex: (blockId, questionId) => {
    blockId = +blockId;
    let currentIndex = 0;
    for (let i = 0; i < blockId; i++) {
      currentIndex += QUESTIONS_IN_BLOCK[i]
    }
    return currentIndex + +questionId;
  },

  canResetProgress: (userId) => resetIds.includes(`${userId}`)
};
