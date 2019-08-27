import en from './en';
import zhHans from './zh-Hans';
import zhHant from './zh-Hant';

enum I18NType {
  en,
  zhHans,
  zhHant
}

const I18N = {
  languages: I18NType,
  set(language: I18NType) {
    Object.assign(this, language);
  }
};

export default I18N;
