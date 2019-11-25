const { getQuestionIndex, canResetProgress } = require('./utils');

const Store = require('./base');


class StatesStore extends Store {
  get collection() {
    return this.ctx.db.collection('users');
  }

  async save(userId, { blockId, questionId, answerId }) {
    const questionIndex = getQuestionIndex(blockId, questionId);

    await this.collection.updateOne({
      userId
    },
      {
        $set: {
          blockId,
          questionId,
          [`answers.${questionIndex}`]: answerId
        },
    });
  }

  async getProgress(userId) {
    return await this.collection.findOne(
      { userId },
      {
        projection: { answers: 1, _id: 0 }
      }
      );
  }

  async resetProgress(userId) {
    if (!canResetProgress(userId)) {
      return;
    }

    await this.collection.updateOne(
      { userId },
      {
        $set: {
          blockId: null,
          questionId: null,
          answers: []
        }
      }
    )
  }

  async getState(userId) {
    return await this.collection.findOne(
      { userId },
      {
        projection: { blockId: 1, questionId: 1, _id: 0 }
      }
      );
  }

  async getStats() {
    return await this.collection
        .find({})
        .project({userId: 1, answers: 1, _id: 0})
        .toArray();
  }
}

module.exports = StatesStore;
