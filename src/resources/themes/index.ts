import defau from './default';

enum ThemeSupportType {
  default
}

const Theme = {
  ...defau,
  support: ThemeSupportType,
  set(themes: object) {
    Object.assign(this, themes);
  }
};

export default Theme;
