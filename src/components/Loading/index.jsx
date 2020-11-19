import React from 'react';

import '../../styles.css';

import './styles.css';

const Loading = () => {
  return (
    <section className='loading'>
      <div className='container'>
        <div className='bg'>
          <h3 className='h2 text-center'>Carregando, aguarde...</h3>
        </div>
      </div>
    </section>
  );
};

export default Loading;
