const alcoholNegativeImpact = {
  // TODO >= Used from date, <= NOW
  Occurred: { presence: true, date: { requireDay: false } },
  Circumstances: { presence: true, hasValue: true },
  NegativeImpact: { presence: true, hasValue: true },
  // TODO >= DOB, <= NOW
  Used: { presence: true, daterange: true },
}

export default alcoholNegativeImpact
