import React from 'react';
import HomeBtn from '../../components/HomeBtn';

import './styles.css';

const NotFoundPage = () => {
  return (
    <div className='col-sm-12 text-center'>
      <h1 className='a404'>404</h1>

      <div className='four_zero_four_bg' />

      <h3 className='h2'>Parece que você se perdeu!</h3>

      <p>a página que você esta procurado não foi encontrada!</p>

      <HomeBtn />
    </div>
  );
};
export default NotFoundPage;
