
export enum Category {
  SONY_ACCOUNTS = 'حسابات سوني',
  CONSOLES = 'أجهزة ألعاب',
  SONY_PARTS = 'قطع سوني (يد، سماعات...)',
  ACCESSORIES = 'إكسسوارات',
  OTHERS = 'أخرى'
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  category: Category;
  imageUrl: string;
  sellerName: string;
  location: string;
  createdAt: string;
  isPromoted?: boolean;
}
