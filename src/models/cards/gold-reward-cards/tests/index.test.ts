import GoldRewardCard from "..";

describe("GoldRewardCard", () => {
  let goldRewardCard: GoldRewardCard;

  beforeEach(() => {
    goldRewardCard = new GoldRewardCard(2);
  });

  it("can be serialized", () => {
    expect(goldRewardCard.toJSON()).toMatchSnapshot();
  });
});
