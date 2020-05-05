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
  customServerLabel: {
    id: 'changeserver.customServerLabel',
    defaultMessage: '!!!Custom server',
  },
  submit: {
    id: 'changeserver.submit',
    defaultMessage: '!!!Submit',
  },

});

export default @observer class ChangeServer extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    server: PropTypes.string.isRequired,
  };

  static contextTypes = {
    intl: intlShape,
  };

  ferdiServer='https://api.getferdi.com';

  franzServer='https://api.franzinfra.com';

  defaultServers=[this.franzServer, this.ferdiServer];

  form = new Form({
    fields: {
      server: {
        label: this.context.intl.formatMessage(messages.label),
        value: this.props.server,
        options: [{ value: this.ferdiServer, label: 'Ferdi' }, { value: this.franzServer, label: 'Franz' }, { value: this.defaultServers.includes(this.props.server) ? '' : this.props.server, label: 'Custom' }],
      },
      customServer: {
        label: this.context.intl.formatMessage(messages.customServerLabel),
        value: '',
      },
    },
  }, this.context.intl);

  componentDidMount() {
    if (this.defaultServers.includes(this.props.server)) {
      this.form.$('server').value = this.props.server;
    } else {
      this.form.$('server').value = '';
      this.form.$('customServer').value = this.props.server;
    }
  }

  isUrl(value) {
    try {
      const url = new URL(value);
      console.log(url);
      return true;
    } catch (err) {
      return false;
    }
  }

  submit(e) {
    e.preventDefault();
    this.form.submit({
      onSuccess: (form) => {
        if (form.values().server === '') {
          form.$('server').onChange(form.values().customServer);
          if (!this.isUrl(form.values().customServer)) {
            console.log('Not url');
          }
        }
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
          {!this.defaultServers.includes(form.$('server').value)
          && (
          <Input
            placeholder="Custom Server"
            onChange={e => this.submit(e)}
            field={form.$('customServer')}
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
