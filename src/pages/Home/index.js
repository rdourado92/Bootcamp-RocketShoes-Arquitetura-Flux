import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MdAddShoppingCart } from 'react-icons/md';
import { FaSpinner } from 'react-icons/fa';

import api from '../../services/api';
import { formatPrice } from '../../util/format';
import * as CartActions from '../../store/modules/cart/actions';

import { ProductList, LoadDisplay } from './styles';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const amount = useSelector(state =>
    state.cart.reduce((amount, product) => {
      amount[product.id] = product.amount;

      return amount;
    }, {})
  );
  const dispatch = useDispatch();
  const { addToCartRequest } = CartActions;

  async function loadData() {
    setLoading(true);
    const response = await api.get('/products');

    const data = response.data.map(product => ({
      ...product,
      priceFormatted: formatPrice(product.price),
    }));

    setProducts(data);
    setLoading(false);
  }

  function handleAddProduct(id) {
    dispatch(addToCartRequest(id));
  }

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <LoadDisplay>
        <FaSpinner size={64} color="#7159c1" />
      </LoadDisplay>
    );
  }

  return (
    <ProductList>
      {products.map(product => (
        <li key={product.id}>
          <img src={product.image} alt={product.title} />
          <strong>{product.title}</strong>
          <span>{product.priceFormatted}</span>
          <button type="button" onClick={e => handleAddProduct(product.id)}>
            <div>
              <MdAddShoppingCart size={16} color="#FFF" />
              {amount[product.id] || 0}
            </div>
            <span>ADICIONAR AO CARRINHO</span>
          </button>
        </li>
      ))}
    </ProductList>
  );
}
