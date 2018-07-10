function logUpdate({ state, payload, blockInfo, context }) {
  console.info("State updated:\n", JSON.stringify(state, null, 2));
}

const effects = [
  {
    actionType: "blog::likepost",
    effect: logUpdate
  }
];

module.exports = effects;
