import { db } from './index';
import { creditPackages } from './schema';

export async function seedPlans() {
  await db.insert(creditPackages).values([
    {
      name: 'Small Pack',
      credits: 50,
      price: '4.99',
      displayOrder: 1,
    },
    {
      name: 'Medium Pack',
      credits: 120,
      price: '9.99',
      displayOrder: 2,
    },
    {
      name: 'Large Pack',
      credits: 300,
      price: '19.99',
      displayOrder: 3,
    },
    {
      name: 'Mega Pack',
      credits: 1000,
      price: '49.99',
      displayOrder: 4,
    },
  ]);
}
