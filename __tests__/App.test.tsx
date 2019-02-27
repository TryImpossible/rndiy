import React from 'react';
import renderer from 'react-test-renderer';

import App from '../App';

it('renders correctly with defaults', () => {
  const compoent = renderer.create(<App />);
  let tree = compoent.toJSON();
  expect(tree).toMatchSnapshot();

  tree.children[3].props.onPress(); // 触发点击事件
  tree = compoent.toJSON();
  expect(tree).toMatchSnapshot();
});
