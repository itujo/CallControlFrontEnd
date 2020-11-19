/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import InputMask from 'react-input-mask';
import Select from 'react-select';

import PropTypes from 'prop-types';

import { Modal, Button } from 'react-bootstrap';

import api from '../../../services/api';

import HomeBtn from '../../../components/HomeBtn';

import '../../../styles.css';
import './styles.css';

const EditCall = (props) => {
  const [showModal, setShowModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [baseSelect, setBaseSelect] = useState('');
  const [optionsSelect, setOptionsSelect] = useState({});
  const [call, setCall] = useState({});
  const [label, setLabel] = useState('l');
  const [value, setValue] = useState('v');

  const handleClose = () => {
    setShowModal(false);
    setShowErrorModal(false);
  };

  const { register, handleSubmit, control, errors, reset } = useForm();
  const loadCall = async (param) => {
    const response = await api.get(`/calls/${param}`);
    setCall(response.data);

    if (response.data.base) {
      setLabel(response.data.base.name);
      setValue(response.data.base._id);
    }
  };

  const getOptions = async () => {
    const res = await api.get('/bases');

    const { data } = res;

    const options = data.map((d) => ({
      value: d._id,
      label: d.name,
    }));
    setOptionsSelect(options);
  };

  const { match } = props;

  useEffect(() => {
    loadCall(match.params.id);
    getOptions();
  }, [match.params]);

  const onSubmit = async (data, e) => {
    try {
      const formatData = await JSON.parse(
        JSON.stringify(data).replace(/"\s+|\s+"/g, '"')
      );
      formatData.base = baseSelect.value;

      await api.post('/calls', formatData);

      reset({
        resPhone: '',
        comercialPhone: '',
        cellPhone: '',
        cellPhone2: '',
      });
      e.target.reset();
      e.target[0].focus();

      setShowModal(true);
    } catch (err) {
      setShowErrorModal(true);
    }
  };

  if (!call || !value || !label) return <>carregando</>;
  return (
    <div className='update-product'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='form-row'>
          <div className='form-group col-md-6'>
            <label htmlFor='callId'>Número do chamado</label>

            <input
              name='callId'
              id='callId'
              className='form-control'
              placeholder={call.callId}
              defaultValue={call.callId}
              ref={register({
                required: false,
                pattern: {
                  value: /[0-9]{9,}/g,
                  message:
                    "Verifique o numero do chamado, lembre-se de incluir os '0' (zeros)",
                },
              })}
            />
            {errors.callId && errors.callId.message}
          </div>
          <div className='form-group col-md-6'>
            <label htmlFor='callType'>Tipo do chamado</label>
            <span className='required'> *</span>

            <input
              name='callType'
              className='form-control'
              placeholder={call.callType}
              defaultValue={call.callType}
              ref={register({ required: true })}
            />
          </div>
        </div>
        <div className='form-row'>
          <div className='form-group col-md-9'>
            <label htmlFor='fullName'>Nome completo</label>
            <span className='required'> *</span>

            <input
              name='fullName'
              className='form-control'
              placeholder={call.fullName}
              defaultValue={call.fullName}
              ref={register({ required: true })}
            />
          </div>
        </div>

        <div className='form-row'>
          <div className='form-group col-md-6'>
            <label htmlFor='address'>Endereço</label>
            <span className='required'> *</span>

            <input
              name='address'
              type='address'
              className='form-control'
              placeholder={call.address}
              defaultValue={call.address}
              ref={register({ required: true })}
            />
          </div>
          <div className='form-group col-md-3'>
            <label htmlFor='cep'>CEP</label>
            <span className='required'> *</span>

            <input
              name='cep'
              control={control}
              placeholder={call.cep}
              defaultValue={call.cep}
              className='form-control'
              as={InputMask}
              mask='99999-999'
            />
            {errors.cep && errors.cep.message}
          </div>
          <div className='form-group col-md-3'>
            <label htmlFor='city'>Cidade</label>
            <span className='required'> *</span>

            <input
              name='city'
              placeholder={call.city}
              defaultValue={call.city}
              className='form-control'
              ref={register({ required: true })}
            />
          </div>
        </div>

        <div className='form-row'>
          <div className='form-group col-md-6'>
            <label htmlFor='resPhone'>Telefone residencial</label>
            <span className='required'> *</span>

            <input
              name='resPhone'
              control={control}
              className='form-control'
              placeholder={call.resPhone}
              defaultValue={call.resPhone}
              as={InputMask}
              mask='(99) 9999-9999'
            />
          </div>
          <div className='form-group col-md-6'>
            <label htmlFor='comercialPhone'>Telefone comercial</label>
            <input
              name='comercialPhone'
              control={control}
              placeholder={call.comercialPhone}
              defaultValue={call.comercialPhone}
              className='form-control'
              as={InputMask}
              mask='(99) 9999-9999'
            />
          </div>
        </div>
        <div className='form-row'>
          <div className='form-group col-md-6'>
            <label htmlFor='cellPhone'>Celular</label>
            <span className='required'> *</span>

            <input
              name='cellPhone'
              control={control}
              placeholder={call.cellPhone}
              defaultValue={call.cellPhone}
              as={InputMask}
              className='form-control'
              mask='(99) 99999-9999'
            />
          </div>
          <div className='form-group col-md-6'>
            <label htmlFor='cellPhone2'>Celular 2</label>
            <input
              name='cellPhone2'
              control={control}
              placeholder={call.cellPhone2}
              defaultValue={call.cellPhone2}
              as={InputMask}
              className='form-control'
              mask='(99) 99999-9999'
            />
          </div>
        </div>
        <div className='form-group'>
          <label htmlFor='email'>Email</label>
          <span className='required'> *</span>

          <input
            name='email'
            placeholder={call.email}
            defaultValue={call.email}
            type='email'
            className='form-control'
            ref={register({
              required: 'Required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Endereço de e-mail inválido',
              },
            })}
          />
          {errors.email && errors.email.message}

          <div className='form-row'>
            <div className='form-group col-md-6'>
              <label htmlFor='nfe'>NFE</label>
              <span className='required'> *</span>

              <input
                name='nfe'
                placeholder={call.nfe}
                defaultValue={call.nfe}
                className='form-control'
                ref={register({
                  required: true,
                  pattern: {
                    value: /[0-9]{9,}/g,
                    message:
                      "Verifique o numero da nota fiscal, lembre-se de incluir os '0' (zeros)",
                  },
                })}
              />
              {errors.nfe && errors.nfe.message}
            </div>
          </div>
          <div className='form-row'>
            <div className='form-group col-md-3'>
              <label htmlFor='romaneio'>Romaneio</label>
              <span className='required'> *</span>

              <input
                name='romaneio'
                placeholder={call.romaneio}
                defaultValue={call.romaneio}
                className='form-control'
                ref={register({
                  required: true,
                  pattern: {
                    value: /[0-9]{8,}/g,
                    message:
                      "Verifique o numero o romaneio, lembre-se de incluir os '0' (zeros)",
                  },
                })}
              />
              {errors.romaneio && errors.romaneio.message}
            </div>
            <div className='form-group col-md-9'>
              <label htmlFor='router'>Roteiro</label>

              <input
                name='router'
                placeholder={call.router}
                defaultValue={call.router}
                className='form-control'
                ref={register({ required: false })}
              />
            </div>
          </div>

          <div className='form-row'>
            <div className='form-group col-md-3'>
              <label htmlFor='sellType'>Tipo de venda</label>
              <span className='required'> *</span>
              <br />

              <select name='sellType' value={call.sellType} ref={register}>
                <option value='MENSAL'>MENSAL</option>
                <option value='TRIMESTRAL'>TRIMESTRAL</option>
                <option value='ANUAL'>ANUAL</option>
              </select>
              <br />
            </div>
          </div>

          <div className='form-group'>
            <label htmlFor='observation'>Observação</label>
            <input
              name='observation'
              placeholder='Observação'
              className='form-control'
              ref={register({ required: false })}
            />
          </div>
          <div>
            <label htmlFor='isOpen'>Status</label>
            <span className='required'> *</span>
            <br />

            <select name='isOpen' defaultValue={call.isOpen} ref={register}>
              <option value>Aberto</option>
              <option value={false}>Fechado</option>
            </select>
          </div>
          <div className='form-row'>
            <div className='form-group col-md-8'>
              <label htmlFor='base'>Base</label>
              <span className='required'> *</span>
              <br />

              <Select
                name='base'
                ref={register}
                options={optionsSelect}
                defaultValue={{ label, value }}
                placeholder='Selecione a base'
                onChange={(selected) => {
                  setBaseSelect(selected);
                }}
                theme={(theme) => ({
                  ...theme,
                  borderRadius: 5,
                  colors: {
                    ...theme.colors,
                    primary25: '#bdbdbd',
                    primary: '#343A40',
                  },
                })}
              />
            </div>
          </div>
        </div>

        <input type='submit' />
        <input type='reset' />

        <div>&nbsp;&nbsp;</div>

        <HomeBtn />
      </form>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Sucesso!</Modal.Title>
        </Modal.Header>
        <Modal.Body>Chamado cadastrado com sucesso!</Modal.Body>
        <Modal.Footer>
          <Button variant='dark' onClick={handleClose}>
            Ok
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showErrorModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Erro!</Modal.Title>
        </Modal.Header>
        <Modal.Body>Verifique todos os campos e tente novamente!</Modal.Body>
        <Modal.Footer>
          <Button variant='dark' onClick={handleClose}>
            Ok
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

EditCall.propTypes = {
  match: PropTypes.string.isRequired,
};

export default EditCall;
