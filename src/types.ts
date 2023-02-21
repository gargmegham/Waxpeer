export type SourcePrice = {
  sourcePrice: number;
};

export type SourcePrices = {
  [key: string]: SourcePrice;
};

export type SelectedItem = {
  item_id: number;
  icon_url: string;
  name: string;
  type: string;
  steam_price: object;
  source: string;
  sourcePrice: number;
  prices: SourcePrices;
  lastUpdated: Date;
  undercutPrice: number;
  undercutPercentage: number;
  undercutByPriceOrPercentage: string;
  priceRangeMin: number;
  priceRangeMax: number;
  priceRangePercentage: number;
  whenNoOneToUndercutListUsing: string;
};
