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

export type ItemInDb = {
  id: number;
  item_id: string;
  name: string;
  type: string;
  source: string;
  sourcePrice: number | null;
  lastUpdated: Date;
  undercutPrice: number;
  undercutPercentage: number;
  undercutByPriceOrPercentage: string;
  priceRangeMin: number | null;
  priceRangeMax: number | null;
  priceRangePercentage: number | null;
  whenNoOneToUndercutListUsing: string | null;
  botSuccess: boolean;
  message: string;
  floatCondition: number | null;
  currentPrice: number;
};

export type Item = {
  item_id: number;
  icon_url: string;
  name: string;
  type: string;
  active: string;
  steam_price: object;
};

export type Inventory = {
  count: number;
  success: boolean;
  items: Array<Item>;
};

export type ActiveItem = {
  item_id: number;
};

export type MyInventoryProps = {
  activeItems: Array<ActiveItem>;
};

export type AddSelectedItemsProps = {
  setShowSelectedItems: React.Dispatch<React.SetStateAction<boolean>>;
  selectedItems: Array<Item>;
};

export type EditItemModalProps = {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  selectedItem: SelectedItem;
};

export type WaxPeerSearchItemResult = {
  name: string;
  price: number;
  image: string;
  item_id: string;
};

export interface UpdatedItemsType extends WaxPeerSearchItemResult {
  newPrice: number;
}

export type ListItem = {
  item_id: string;
  price: number;
};

export type PriceRange = {
  id: number;
  settingsId: number;
  sourcePriceMin: number;
  sourcePriceMax: number;
  priceRangeMin: number;
  priceRangeMax: number;
  priceRangePercentage: number;
  whenNoOneToUndercutListUsing: string;
};

export type PrimsaUpdateArgumnt = {
  where: object;
  data: object;
};
