import { supabase } from '@/lib/supabase';
import { OrderItem } from '@/lib/types';

export async function createOrder(userId: string, items: OrderItem[], total: number) {
  // Start a Supabase transaction
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert([
      { user_id: userId, total, status: 'pending' }
    ])
    .select()
    .single();

  if (orderError) throw orderError;

  // Insert order items
  const orderItems = items.map(item => ({
    order_id: order.id,
    product_id: item.product.id,
    quantity: item.quantity,
    price: item.product.price
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);

  if (itemsError) throw itemsError;

  return order;
}

export async function getUserOrders(userId: string) {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        product:products (*)
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}