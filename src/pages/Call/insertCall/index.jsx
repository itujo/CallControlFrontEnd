/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import InputMask from 'react-input-mask';
import Select from 'react-select';

import { Modal, Button } from 'react-bootstrap';

import api from '../../../services/api';

import HomeBtn from '../../../components/HomeBtn';

import '../../../styles.css';
import './styles.css';

const Insert = () => {
  const [showModal, setShowModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [textErrorModal, setTextErrorModal] = useState('');
  const [selectInput, setSelectInput] = useState({ value: 'MENSAL' });
  const [baseSelect, setBaseSelect] = useState('');
  const [optionsSelect, setOptionsSelect] = useState();
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setShowModal(false);
    setShowErrorModal(false);
    setTextErrorModal('');
  };

  const { register, handleSubmit, control, errors, reset } = useForm();

  const options2 = [
    { value: 'MENSAL', label: 'MENSAL' },
    { value: 'AVULSO', label: 'AVULSO' },
  ];

  const isOpenOptions = [
    {
      value: true,
      label: 'ABERTO',
    },
    {
      value: false,
      label: 'FECHADO',
    },
  ];

  useEffect(() => {
    const getOptions = async () => {
      const res = await api.get('bases');

      const { data } = res;

      const options = data.map((d) => ({
        value: d._id,
        label: d.name,
      }));
      setOptionsSelect(options);
    };

    getOptions();
  }, []);

  const onSubmit = async (data, e) => {
    const formatData = await JSON.parse(
      JSON.stringify(data).replace(/"\s+|\s+"/g, '"')
    );

    formatData.sellType = selectInput.value;
    formatData.base = baseSelect.value;
    formatData.isOpen = isOpen.value;

    await api
      .post('/calls', formatData)
      .then(() => {
        reset({
          resPhone: '',
          comercialPhone: '',
          cellPhone: '',
          cellPhone2: '',
        });
        e.target.reset();
        e.target[0].focus();
        setBaseSelect(baseSelect);

        setShowModal(true);
      })
      .catch((error) => {
        if (error.response) {
          const erros = error.response.data.errors;
          let str = '';

          if (Object.keys(erros).length > 1) {
            str = str.concat('Os seguintes campos não podem ficar vazios: ');
            Object.keys(erros).forEach((item) => {
              if (item === Object.keys(erros)[Object.keys(erros).length - 1]) {
                str = str.concat(erros[item].message, '.');
              } else {
                str = str.concat(erros[item].message, ', ');
              }
            });
          } else if (
            erros[Object.keys(erros)].message ===
            'Número de chamado já cadastrado'
          ) {
            str = str.concat(erros[Object.keys(erros)].message, '!');
          } else {
            str = str.concat('O seguinte campo não pode ficar vazio: ');

            str = str.concat(erros[Object.keys(erros)].message, '!');
          }

          setShowErrorModal(true);
          setTextErrorModal(str);
        } else if (error.request) {
          setShowErrorModal(true);
          setTextErrorModal('Erro na requisição!');
        } else {
          setShowErrorModal(true);
          setTextErrorModal(error.message);
        }
      });
  };

  return (
    <div className='insert-product'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='form-row'>
          <div className='form-group col-md-6'>
            <label htmlFor='callId'>Número do chamado</label>
            <span className='required'> *</span>

            <input
              name='callId'
              className='form-control'
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              placeholder='Número do chamado'
              ref={register({
                required: true,
                pattern: {
                  value: /[0-9]{9,}/g,
                  message:
                    "Verifique o número do chamado, lembre-se de incluir os '0' (zeros)",
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
              placeholder='Tipo do chamado'
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
              placeholder='Nome completo'
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
              placeholder='Endereço'
              ref={register({ required: true })}
            />
          </div>
          <div className='form-group col-md-3'>
            <label htmlFor='cep'>CEP</label>
            <span className='required'> *</span>

            <Controller
              name='cep'
              control={control}
              defaultValue=''
              placeholder='99999-999'
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
              placeholder='Cidade'
              className='form-control'
              ref={register({ required: true })}
            />
          </div>
        </div>

        <div className='form-row'>
          <div className='form-group col-md-6'>
            <label htmlFor='resPhone'>Telefone residencial</label>
            <span className='required'> *</span>

            <Controller
              name='resPhone'
              control={control}
              defaultValue=''
              className='form-control'
              placeholder='(99) 9999-9999'
              as={InputMask}
              mask='(99) 9999-9999'
            />
          </div>
          <div className='form-group col-md-6'>
            <label htmlFor='comercialPhone'>Telefone comercial</label>
            <Controller
              name='comercialPhone'
              control={control}
              defaultValue=''
              className='form-control'
              placeholder='(99) 9999-9999'
              as={InputMask}
              mask='(99) 9999-9999'
            />
          </div>
        </div>
        <div className='form-row'>
          <div className='form-group col-md-6'>
            <label htmlFor='cellPhone'>Celular</label>
            <span className='required'> *</span>

            <Controller
              name='cellPhone'
              control={control}
              defaultValue=''
              placeholder='(99) 99999-9999'
              as={InputMask}
              className='form-control'
              mask='(99) 99999-9999'
            />
          </div>
          <div className='form-group col-md-6'>
            <label htmlFor='cellPhone2'>Celular 2</label>
            <Controller
              name='cellPhone2'
              control={control}
              defaultValue=''
              placeholder='(99) 99999-9999'
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
            placeholder='E-mail'
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
                placeholder='NFE'
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
            <div className='form-group col-md-6'>
              <label htmlFor='nfeEmiss'>Data de emissão NFE</label>
              <span className='required'> *</span>

              <input
                name='nfeEmiss'
                type='date'
                className='form-control'
                placeholder='Data emissão NFE'
                ref={register({ required: true })}
              />
            </div>
          </div>
          <div className='form-row'>
            <div className='form-group col-md-3'>
              <label htmlFor='romaneio'>Romaneio</label>
              <span className='required'> *</span>

              <input
                name='romaneio'
                placeholder='Romaneio'
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
                placeholder='Roteiro'
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

              <Select
                name='sellType'
                ref={register}
                options={options2}
                placeholder='Tipo de venda'
                onChange={(selected) => {
                  setSelectInput(selected);
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
            <div className='form-group col-md-9'>
              <label htmlFor='prevDate'>Previsão de retorno</label>
              <span className='required'> *</span>

              <input
                name='prevDate'
                type='date'
                className='form-control'
                placeholder='Previsão de retorno'
                ref={register({ required: true })}
              />
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

            <Select
              name='isOpen'
              ref={register}
              options={isOpenOptions}
              placeholder='Status'
              onChange={(selected) => {
                setIsOpen(selected);
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
          <div className='form-row'>
            <div className='form-group col-md-8'>
              <label htmlFor='base'>Base</label>
              <span className='required'> *</span>
              <br />

              <Select
                name='base'
                ref={register}
                options={optionsSelect}
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
          <Modal.Title>Erro</Modal.Title>
        </Modal.Header>
        <Modal.Body>{textErrorModal}</Modal.Body>
        <Modal.Footer>
          <Button variant='dark' onClick={handleClose}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Insert;
