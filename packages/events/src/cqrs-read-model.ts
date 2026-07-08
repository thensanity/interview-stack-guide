/** CQRS read model demo — interview: separate write model from optimized reads */
export interface ProductReadModel {
  id: string;
  name: string;
  price: number;
  category: string;
  searchText: string;
}

const readModels = new Map<string, ProductReadModel>();

export function projectProductCreated(event: { productId: string; name: string; price: number; category: string }) {
  readModels.set(event.productId, {
    id: event.productId,
    name: event.name,
    price: event.price,
    category: event.category,
    searchText: `${event.name} ${event.category}`.toLowerCase(),
  });
}

export function queryReadModel(category?: string): ProductReadModel[] {
  const all = [...readModels.values()];
  return category ? all.filter((p) => p.category === category) : all;
}
