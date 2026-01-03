export type Category = {
id: string;
slug: 'painting' | 'decorative-panels' | 'epoxy-flooring';
name: string;
description: string;
heroImage: string;
}


export type Product = {
id: string;
slug: string;
categorySlug: Category['slug'];
name: string;
description: string;
images: string[];
price: number; // base price
unit: 'sqft' | 'unit';
attributes?: Record<string, string | number>;
arMeasureEnabled: boolean;
}


export type CartItem = {
productId: string;
name: string;
price: number;
quantity: number;
image: string;
}


export type ARMeasurement = {
wallId?: string;
widthM: number;
heightM: number;
areaSqM: number;
count?: number;
notes?: string;
}


export type QuoteRequest = {
productId: string;
productName: string;
surfaceType: 'plaster' | 'drywall' | 'concrete' | 'wood';
prepRequired: boolean;
areaSqM: number;
rooms?: number;
measurements?: ARMeasurement[];
customerEmail?: string;
}