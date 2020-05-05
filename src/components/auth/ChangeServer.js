import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';
import { Badge } from '@meetfranz/ui';
import Form from '../../lib/Form';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

const messages = defineMessages({
  headline: {
    id: 'changeserver.headline',
    defaultMessage: '!!!Change server',
  },
  label: {
    id: 'changeserver.label',
    defaultMessage: '!!!Server',
  },
  warning: {
    id: 'changeserver.warning',
    defaultMessage: '!!!Some settings offered by Ferdi will not be saved',
  },

  submit: {
    id: 'changeserver.submit',
    defaultMessage: '!!!Submit',
  },
});

export default @observer class ChangeServer extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    //server: PropTypes.string.isRequired,
  };

  static contextTypes = {
    intl: intlShape,
  };

  ferdiServer='api.getferdi.com';

  franzServer='this.props.server';

  form = new Form({
    fields: {
      server: {
        label: this.context.intl.formatMessage(messages.label),
        value: this.ferdiServer,
        options: [{ value: this.ferdiServer, label: 'Ferdi server (Default)' }, { value: this.franzServer, label: 'Franz server' }, { value: '', label: 'Custom server' }],
      },
    },
  }, this.context.intl);

  componentDidMount() {
    // this.form.$('server').value = this.props.server;
  }

  submit(e) {
    e.preventDefault();
    this.form.submit({
      onSuccess: (form) => {
        this.props.onSubmit(form.values());
      },
      onError: () => { },
    });
  }

  render() {
    const { form } = this;
    const { intl } = this.context;

    return (
      <div className="auth__container">
        <form className="franz-form auth__form" onSubmit={e => this.submit(e)}>
          <h1>{intl.formatMessage(messages.headline)}</h1>
          <Select field={form.$('server')} />
          {![this.ferdiServer, this.franzServer].includes(form.$('server').value)
          && (
          <Input
            field={form.$('server')}
            focus
          />
          )}
          {form.$('server').value === this.franzServer
          && (
          <Badge type="warning">
            {intl.formatMessage(messages.warning)}
          </Badge>
          )}
          <Button
            type="submit"
            className="auth__button"
            label={intl.formatMessage(messages.submit)}
          />
        </form>
      </div>
    );
  }
}
