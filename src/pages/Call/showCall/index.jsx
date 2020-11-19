/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from 'react';

import { Button, Modal, Alert } from 'react-bootstrap';

import { FiEdit, FiTrash2, FiShuffle } from 'react-icons/fi';

import { Link } from 'react-router-dom';
import { format, addDays } from 'date-fns';

import PropTypes from 'prop-types';

import api from '../../../services/api';

import './styles.css';
import '../../../styles.css';

import HomeBtn from '../../../components/HomeBtn';

const ShowCall = (props) => {
  const [call, setCall] = useState({});
  const [dataForm, setDataForm] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEditConfirm, setShowEditConfirm] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const fetchData = async (param) => {
    const { id } = param;
    const response = await api.get(`/calls/${id}`);

    const date = new Date(response.data.prevDate);
    const fdate = addDays(date, 1);

    const cdataForm = format(fdate, 'dd/MM/yyyy');

    setCall(response.data);
    setDataForm(cdataForm);
  };

  const { match } = props;

  useEffect(() => {
    fetchData(match.params);
  }, [match.params]);

  const handleClose = () => {
    setShowEditConfirm(false);
    setShowEditModal(false);
    setConfirmDelete(false);
    // setDeleted(false);
  };

  const handleShow = () => setShowEditModal(true);

  const handleEdit = async () => {
    const { id } = match.params;

    if (call.isOpen) {
      await api.patch(`/calls/${id}`, {
        isOpen: false,
      });
    } else if (!call.isOpen) {
      await api.patch(`/calls/${id}`, {
        isOpen: true,
      });
    }
    const response = await api.get(`/calls/${id}`);

    setCall(response.data);
    setShowEditModal(false);
    setShowEditConfirm(true);
  };

  const handleDeleteClick = async () => {
    const { id } = match.params;

    await api
      .delete(`/calls/${id}`)
      .then(setDeleted(true))
      .catch((error) => error);
  };

  return (
    <>
      <div className='call-info'>
        <Modal
          show={showEditModal}
          onHide={handleClose}
          backdrop='static'
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Alterar status do chamado</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Você tem certeza que deseja alterar o status do chamado?
          </Modal.Body>
          <Modal.Footer>
            <Button variant='dark' onClick={handleClose}>
              Não
            </Button>
            <Button variant='dark' onClick={handleEdit}>
              Sim
            </Button>
          </Modal.Footer>
        </Modal>

        {/* DELETAR CHAMADO */}
        <Modal
          show={confirmDelete}
          onHide={handleClose}
          backdrop='static'
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Deletar chamado?</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Você tem certeza que deseja deletar o chamado&nbsp;
            {call.callId}
            ?
          </Modal.Body>
          <Modal.Footer>
            <Button variant='dark' onClick={handleClose}>
              Não
            </Button>
            <Button variant='danger' onClick={handleDeleteClick}>
              Sim
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={deleted}
          // onHide={}
          backdrop='static'
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Sucesso!</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Chamado:
            {` ${call.callId}`}
            &nbsp;deletado com sucesso!
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant='dark'
              onClick={() => {
                window.location.href = '/';
              }}
            >
              Ok
            </Button>
          </Modal.Footer>
        </Modal>

        <Alert show={showEditConfirm} variant='success' autoFocus>
          <Alert.Heading>Sucesso!</Alert.Heading>
          <p>
            Status do chamado alterado para:&nbsp;
            {call.isOpen ? 'Aberto' : 'Fechado'}
          </p>
          <hr />
        </Alert>

        <h1>
          <strong>Chamado: </strong>
          {call.callId}
        </h1>
        <p>
          <strong>Tipo: </strong>
          {call.callType}
        </p>
        <p>
          <strong>Nome Completo: </strong>
          {call.fullName}
        </p>
        <p>
          <strong>CPF: </strong>
          {call.cpf ? call.cpf : '-'}
        </p>
        <p>
          <strong>Endereço: </strong>
          {call.address}
        </p>
        <p>
          <strong>CEP: </strong>
          {call.cep}
        </p>
        <p>
          <strong>Observação: </strong>
          {call.observation ? call.observation : '-'}
        </p>
        <p>
          <strong>Cidade: </strong>
          {call.city}
        </p>
        <p>
          <strong>Telefone residencial: </strong>
          {call.resPhone ? call.resPhone : '-'}
        </p>
        <p>
          <strong>Telefone comercial: </strong>
          {call.comercialPhone ? call.comercialPhone : '-'}
        </p>
        <p>
          <strong>Celular: </strong>
          {call.cellPhone}
        </p>
        <p>
          <strong>Celular 2: </strong>
          {call.cellPhone2 ? call.cellPhone2 : '-'}
        </p>
        <p>
          <strong>E-mail: </strong>
          {call.email}
        </p>
        <p>
          <strong>NFE: </strong>
          {call.nfe}
        </p>
        <p>
          <strong>Romaneio: </strong>
          {call.romaneio}
        </p>
        <p>
          <strong>Roteiro: </strong>
          {call.router ? call.router : '-'}
        </p>
        <p>
          <strong>Tipo de venda: </strong>
          {call.sellType}
        </p>
        <p>
          <strong>Previsão retorno: </strong>
          {dataForm}
        </p>
        <p>
          <strong>Status: </strong>
          {call.isOpen ? 'Aberto' : 'Fechado'}
        </p>
        <p>
          <strong>Base: </strong>
          {call.base ? call.base.name : 'preencher'}
        </p>
        <p>
          <strong>Usuario que cadastrou: </strong>
          {call.user ? call.user.login : 'preencher'}
        </p>

        <br />

        <Link id='update' to={`/edit/${call._id}`}>
          <FiEdit size={26} />
          &nbsp;Editar chamado
        </Link>
        <>&nbsp;</>

        <Button variant='dark' className='btn' onClick={handleShow}>
          <FiShuffle size={26} />
          &nbsp;Alterar status chamado
        </Button>
        <>&nbsp;</>

        <Button
          id='delete'
          variant='danger'
          className='btn'
          onClick={() => {
            setConfirmDelete(true);
          }}
        >
          <FiTrash2 size={26} />
          &nbsp;Deletar chamado
        </Button>
        <div>&nbsp;</div>
        <HomeBtn />
      </div>
    </>
  );
};

ShowCall.propTypes = {
  match: PropTypes.string.isRequired,
};

export default ShowCall;
