import React from 'react';
import { NetInfo } from 'react-native';
import { Dialog } from '../components';
import { PrinterModule } from '../modules';

// export default NavListener = (willFocus) => WrappedComponent => class  extends BaseComponent {
// export default(willFocus) => WrappedComponent => class NavListener extends BaseComponent {
export default WrappedComponent =>
  class Listener extends React.PureComponent {
    constructor(props) {
      super(props);
      this.initSubscriptions();
    }

    componentWillUnmount() {
      if (this.subscriptions.length > 0) {
        this.subscriptions.forEach(subscription => {
          subscription.remove();
        });
      }
    }

    willFocus = () => {
      this.delay = setTimeout(() => {
        NetInfo.isConnected.fetch().done(connnected => {
          if (!connnected) {
            Dialog.showError('network');
          }
        });
      }, 1000);
      NetInfo.addEventListener('connectionChange', info => {
        if (info.type === 'none') {
          Dialog.showError('network');
        } else {
          Dialog.hide('network');
        }
      });
      PrinterModule.startListen();
      this.printerStatusListener = PrinterModule.addPrinterStatusChangeListener(result => {
        if (result && (result.code === 4 || result.code === 0)) {
          // 打印机卡纸或没有连接，隐藏弹窗
          Dialog.hide('printer');
        } else {
          Dialog.showError('printer');
        }
      });
    };

    willBlur = () => {
      this.delay && clearTimeout(this.delay);
      NetInfo.removeEventListener('connectionChange');
      PrinterModule.stopListen();
      PrinterModule.removePrinterStatusChangeListener(this.printerStatusListener);
    };

    initSubscriptions() {
      const { navigation } = this.props;
      this.subscriptions = [];
      const willFocus = navigation.addListener('willFocus', payload => this.willFocus(payload));
      this.subscriptions.push(willFocus);
      const didFocus = navigation.addListener('didFocus', payload => this.didFocus(payload));
      this.subscriptions.push(didFocus);
      const willBlur = navigation.addListener('willBlur', payload => this.willBlur(payload));
      this.subscriptions.push(willBlur);
      const didBlur = navigation.addListener('didBlur', payload => this.didBlur(payload));
      this.subscriptions.push(didBlur);
    }

    didFocus() {}

    didBlur() {}

    render() {
      return <WrappedComponent {...this.props} {...this.state} />;
    }
  };
