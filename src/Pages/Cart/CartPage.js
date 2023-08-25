import React from 'react'
import classes from './cartPage.module.css';
import { useCart } from '../../hooks/useCarts';

export default function CartPage() {
    const { cart } = useCart();
  
    return <div>{cart.items.length}</div>;
}