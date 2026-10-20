export const categories = [
  { id: '1', label: 'Papel', icon: 'file-document-outline', pointsPerItem: 5 },
  { id: '2', label: 'Plástico', icon: 'bottle-soda-outline', pointsPerItem: 10 },
  { id: '3', label: 'Vidro', icon: 'glass-fragile', pointsPerItem: 8 },
  { id: '4', label: 'Metal', icon: 'silverware-variant', pointsPerItem: 12 },
  { id: '5', label: 'Eletrônico', icon: 'cellphone', pointsPerItem: 20 },
  { id: '6', label: 'Outros', icon: 'recycle-variant', pointsPerItem: 5 },
];

export const collectionPoints = [
  {
    id: '1',
    name: 'Supermercado Verde Vida',
    address: 'Av. das Nações, 450 - Centro',
    distanceKm: 0.8,
    type: 'Supermercado',
    materials: ['Papel', 'Plástico', 'Vidro'],
  },
  {
    id: '2',
    name: 'EcoMart Jardins',
    address: 'Rua das Flores, 120 - Jardins',
    distanceKm: 1.4,
    type: 'Supermercado',
    materials: ['Metal', 'Eletrônico'],
  },
  {
    id: '3',
    name: 'Farmácia Bem Estar',
    address: 'Rua Sete de Setembro, 88 - Centro',
    distanceKm: 2.1,
    type: 'Farmácia',
    materials: ['Plástico', 'Eletrônico'],
  },
  {
    id: '4',
    name: 'Shopping Recicla+',
    address: 'Av. Principal, 900 - Zona Sul',
    distanceKm: 3.6,
    type: 'Shopping',
    materials: ['Papel', 'Vidro', 'Metal', 'Outros'],
  },
];

export const vouchers = [
  {
    id: '1',
    points: 150,
    partner: 'Supermercado Verde Vida',
    discount: '10% de desconto',
    validUntil: '30/09/2026',
    status: 'disponível',
  },
  {
    id: '2',
    points: 80,
    partner: 'Café Sustentável',
    discount: '1 café grátis',
    validUntil: '15/09/2026',
    status: 'disponível',
  },
  {
    id: '3',
    points: 200,
    partner: 'Loja EcoWear',
    discount: '15% de desconto',
    validUntil: '20/08/2026',
    status: 'usado',
  },
];

export const currentUser = {
  name: 'Ana Souza',
  totalPoints: 1240,
  itemsRecycled: 87,
};
