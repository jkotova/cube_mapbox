import React from 'react';
import { Layout, Menu } from 'antd';

const Header = () => (
  <Layout.Header
    style={{
      padding: '0 32px',
    }}
  >
    <div
      style={{
        float: 'left',
      }}
    >
      <h2
        style={{
          color: '#fff',
          margin: 0,
          marginRight: '1em',
          display: 'inline',
          width: 100,
          lineHeight: '54px',
        }}
      >
        Mapbox example
      </h2>
    </div>
    <Menu
      theme='dark'
      mode='horizontal'
      style={{
        lineHeight: '64px',
      }}
    ></Menu>
  </Layout.Header>
);

export default Header;
