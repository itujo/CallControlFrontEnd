/* eslint-disable no-underscore-dangle */
import React, { Component } from 'react';

import { Table, Alert } from 'react-bootstrap';

import { Link } from 'react-router-dom';

import {
  FiEdit,
  FiInfo,
  FiUserPlus,
  FiCheck,
  FiAlertTriangle,
} from 'react-icons/fi';

import { format, addDays, isAfter } from 'date-fns';

import './styles.css';
import '../../../styles.css';

import 'datatables.net-bs4/js/dataTables.bootstrap4';
import 'datatables.net-bs4/css/dataTables.bootstrap4.css';
import 'datatables.net-buttons/js/buttons.html5';
import 'datatables.net-buttons-bs4/js/buttons.bootstrap4';
import 'datatables.net-buttons-bs4/css/buttons.bootstrap4.css';

import pdfMake from 'pdfmake/build/pdfmake';
import vfsFonts from 'pdfmake/build/vfs_fonts';

import JSZip from 'jszip';

import $, { isEmptyObject } from 'jquery';
import Loading from '../../../components/Loading';
import api from '../../../services/api';

window.JSZip = JSZip;

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = { count: 0, late: false, calls: [], isLoading: true };
  }

  async componentDidMount() {
    await this.loadCalls();

    let aux;

    const trim = (str) => {
      aux = str.replace(/^\s+/, '');
      for (let i = str.length - 1; i >= 0; i -= 1) {
        if (/\S/.test(str.charAt(i))) {
          aux = str.substring(0, i + 1);
          break;
        }
      }
      return aux;
    };

    const dateHeight = (inputString) => {
      let result;

      if (trim(inputString) !== '') {
        const frDate = trim(inputString).split(' ');
        const frDateParts = frDate[0].split('/');
        const day = frDateParts[0] * 60 * 24;
        const month = frDateParts[1] * 60 * 24 * 31;
        const year = frDateParts[2] * 60 * 24 * 366;
        result = day + month + year;
      }

      return result;
    };

    $.fn.dataTableExt.oSort['date-euro-asc'] = (a, b) => {
      const x = dateHeight(a);
      const y = dateHeight(b);

      let z = 0;

      if (x < y) {
        z = -1;
      } else if (x > y) {
        z = 1;
      } else {
        z = 0;
      }

      return z;
    };

    $.fn.dataTableExt.oSort['date-euro-desc'] = (a, b) => {
      const x = dateHeight(a);
      const y = dateHeight(b);

      let z = 0;

      if (x < y) {
        z = 1;
      } else if (x > y) {
        z = -1;
      } else {
        z = 0;
      }
      return z;
    };

    $.fn.DataTable.ext.search.push((settings, data) => {
      const value = $('#isOpen').val();

      const colAberto = data[7] || 0;

      if (isEmptyObject(value) || value === colAberto || value === 'Todos') {
        return true;
      }
      return false;
    });

    $(() => {
      const { vfs } = vfsFonts.pdfMake;
      pdfMake.vfs = vfs;
      const table = $('#callTable').DataTable({
        dom: 'Bflr<t>ip',
        buttons: [
          {
            extend: 'copyHtml5',
            exportOptions: {
              columns: [0, 1, 2, 3, 4, 5, 6],
            },
            className: 'btn-dark',
          },
          {
            extend: 'excelHtml5',
            exportOptions: {
              columns: [0, 1, 2, 3, 4, 5, 6, 7],
            },
            className: 'btn-dark',
          },
          {
            extend: 'pdfHtml5',
            exportOptions: {
              columns: [0, 1, 2, 3, 4, 5, 6],
            },
            className: 'btn-dark',
          },
        ],
        pagingType: 'full_numbers',
        language: {
          url:
            'http://cdn.datatables.net/plug-ins/1.10.21/i18n/Portuguese-Brasil.json',
        },
        order: [
          [7, 'asc'],
          [6, 'asc'],
        ],
        columnDefs: [{ targets: 6, type: 'date-euro' }],
      });

      $('#isOpen').on('change', () => {
        table.draw();
      });
    });

    this.setState({
      isLoading: false,
    });
  }

  loadCalls = async () => {
    await api
      .get(`/calls`)
      .then((response) => {
        this.setState({
          calls: response.data.calls,
        });
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error);
      });

    let count = 0;
    const now = new Date();

    const { calls } = this.state;
    calls.map((call) => {
      const date = new Date(call.prevDate);
      const fdate = addDays(date, 1);

      if (isAfter(now, fdate) && call.isOpen) {
        count += 1;
        this.setState({ late: true });
      }
      this.setState({ count });
      return true;
    });
  };

  render() {
    const { calls, late, isLoading, count } = this.state;
    const now = new Date();

    if (isLoading) return <Loading />;

    if (calls.length === 0)
      return (
        <div id='fail'>
          <h3>Falha ao carregar chamados</h3>
          Entre em contato com o suporte
        </div>
      );

    return (
      <div className='call-list'>
        <Alert variant='success' show={!late}>
          <p>
            Não existem chamado em atraso!&nbsp;
            <FiCheck />
          </p>
        </Alert>

        <Alert variant='danger' show={late}>
          <Alert.Heading className='heading'>
            Existem chamados em atraso!&nbsp;
            <FiAlertTriangle />
          </Alert.Heading>
          <p>
            Total de chamados em atraso:&nbsp;
            <strong>{count}</strong>
          </p>
        </Alert>

        <div id='status'>
          <strong>Status: </strong>
          <select name='isOpen' id='isOpen'>
            <option value='Todos'>Todos</option>
            <option value='Aberto'>Aberto</option>
            <option value='Fechado'>Fechado</option>
          </select>
        </div>

        <Table id='callTable' responsive striped bordered hover>
          <thead>
            <tr>
              <th>Número do chamado</th>
              <th>Tipo</th>
              <th>Nome Completo</th>
              <th>Endereço</th>
              <th>Nota Fiscal</th>
              <th>Romaneio</th>
              <th>Previsão Retorno</th>
              <th>Status</th>
              <th>Detalhes</th>
              <th>Editar</th>
            </tr>
          </thead>
          <tbody>
            {calls.map((call) => {
              const date = new Date(call.prevDate);
              const fdate = addDays(date, 1);

              if (isAfter(now, fdate) && call.isOpen) {
                return (
                  <tr style={{ color: 'red' }} key={call._id}>
                    <td>{call.callId.substring(4)}</td>
                    <td>{call.callType}</td>
                    <td>{call.fullName}</td>
                    <td id='address'>{call.address}</td>
                    <td>{call.nfe.substring(3)}</td>
                    <td>{call.romaneio.substring(4)}</td>
                    <td>{format(fdate, 'dd/MM/yyyy')}</td>
                    <td>{call.isOpen ? 'Aberto' : 'Fechado'}</td>
                    <td id='fa'>
                      <Link to={`/call/${call._id}`}>
                        <FiInfo color='#343a40' size={28} />
                      </Link>
                    </td>
                    <td id='fa'>
                      <Link to={`/edit/${call._id}`}>
                        <FiEdit color='#343a40' size={28} />
                      </Link>
                    </td>
                  </tr>
                );
              }
              return (
                <tr key={call._id}>
                  <td>{call.callId.substring(4)}</td>
                  <td>{call.callType}</td>
                  <td>{call.fullName}</td>
                  <td id='address'>{call.address}</td>
                  <td>{call.nfe.substring(3)}</td>
                  <td>{call.romaneio.substring(4)}</td>
                  <td>{format(fdate, 'dd/MM/yyyy')}</td>
                  <td>{call.isOpen ? 'Aberto' : 'Fechado'}</td>
                  <td id='fa'>
                    <Link to={`/call/${call._id}`}>
                      &nbsp;
                      <FiInfo color='#343a40' size={28} />
                    </Link>
                  </td>
                  <td id='fa'>
                    <Link to={`/edit/${call._id}`}>
                      <FiEdit color='#343a40' size={28} />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>

        <br />

        <Link
          variant='dark'
          to='/insert'
          id='button'
          style={{ textDecoration: 'none' }}
        >
          <FiUserPlus size={26} />
          &nbsp; Cadastrar novo chamado
        </Link>
        <div>&nbsp;&nbsp;</div>
      </div>
    );
  }
}
