import React from 'react';
import { Link } from 'react-router-dom';

import { FiHome } from 'react-icons/fi';

import '../../styles.css';

import './styles.css';

const HomeBtn = () => {
  return (
    <Link id='button' to='/' style={{ textDecoration: 'none' }}>
      <FiHome />
      &nbsp;Voltar
    </Link>
  );
};

export default HomeBtn;
