import React from 'react';

import Navbar from 'react-bootstrap/Navbar';

import logo from '../../assets/logo_splog_1.png';

import '../../styles.css';

import './styles.css';

import 'bootstrap/dist/css/bootstrap.min.css';

const Header = () => (
  <Navbar bg='dark' variant='dark'>
    <div className='brand'>
      <Navbar.Brand href='/'>
        <img alt='' src={logo} height='30' id='logo' />
      </Navbar.Brand>
    </div>

    <Navbar.Collapse className='justify-center' id='text'>
      <Navbar.Text>Controle de chamados</Navbar.Text>
    </Navbar.Collapse>
  </Navbar>
);

export default Header;
