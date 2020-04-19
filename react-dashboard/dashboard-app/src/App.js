import React from 'react';
import './App.css';
import './body.css';
import 'antd/dist/antd.css';

import * as moment from 'moment';

import { ApolloProvider } from '@apollo/react-hooks';
import { Row, Col, Layout, Slider, PageHeader, Descriptions } from 'antd';

import cubejs from '@cubejs-client/core';
import { QueryRenderer } from '@cubejs-client/react';
import { CubeProvider } from '@cubejs-client/react';
import client from './graphql/client';
import MapGL from 'react-map-gl';

import Header from './components/Header';
import { chartsRenderer } from './helpers/helpers';

const API_URL = 'http://localhost:4000';

const CUBEJS_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1ODY2MTg3NDcsImV4cCI6MTU4NjcwNTE0N30.1M3LWja51cQJ8Hgoja8joBU-Z9o6vbhtqnV72WsTAic';

const cubejsApi = cubejs(CUBEJS_TOKEN, {
  apiUrl: `${API_URL}/cubejs-api/v1`,
});

class AppLayout extends React.Component {
  constructor() {
    super();
    this.state = {
      date: moment.unix(1586563200).format('DD/MM/YYYY'),
      dateQuery: moment.unix(1586563200).format('YYYY-MM-DD'),
    };
  }

  sliderRender = ({ resultSet }) => {
    if (!resultSet) {
      return null;
    }

    const formatter = (value) => {
      return moment.unix(value).format('DD/MM/YYYY');
    };

    return (
      <React.Fragment>
        <Slider
          step={86400} //слайдер перевела в timestamp, соответственно, шаг = 1 день в секундах
          defaultValue={resultSet.tablePivot()[0]['Covid.lastDate']}
          min={resultSet.tablePivot()[0]['Covid.firstDate']}
          max={resultSet.tablePivot()[0]['Covid.lastDate']}
          tipFormatter={formatter}
          onChange={this.onSliderChange}
          tooltipVisible
        />
      </React.Fragment>
    );
  };

  onSliderChange = (value) => {
    this.setState({
      date: moment.unix(value).format('DD/MM/YYYY'),
      dateQuery: moment.unix(value).format('YYYY-MM-DD'),
    });
  };

  render() {
    return (
      <Layout
        style={{
          height: '100%',
        }}
      >
        <Header />
        <Layout.Content style={{ padding: '24px' }}>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <PageHeader
                ghost={false}
                title='Date:'
                subTitle={this.state.date}
              >
                <Descriptions size='small' column={3}>
                  <Descriptions.Item label='Total cases'>
                    <QueryRenderer
                      key={1}
                      cubejsApi={cubejsApi}
                      render={chartsRenderer.number}
                      query={{
                        measures: ['Covid.totalCases'],
                        timeDimensions: [
                          {
                            dimension: 'Covid.date',
                            dateRange: ['2020-01-01', this.state.dateQuery],
                          },
                        ],
                      }}
                    />
                  </Descriptions.Item>
                  <Descriptions.Item label='Total deaths'>
                    <QueryRenderer
                      cubejsApi={cubejsApi}
                      render={chartsRenderer.number}
                      query={{
                        measures: ['Covid.totalDeaths'],
                        timeDimensions: [
                          {
                            dimension: 'Covid.date',
                            dateRange: ['2020-01-01', this.state.dateQuery],
                          },
                        ],
                      }}
                    />
                  </Descriptions.Item>
                </Descriptions>
              </PageHeader>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col span={16}>
              <div className='mapbox__container'>
                <MapGL
                  zoom={1}
                  latitude={34}
                  longitude={5}
                  width='100%'
                  height='500px'
                  mapStyle='mapbox://styles/kalipsik/ck9601tuk5ky81ik55yadcebu'
                  mapboxApiAccessToken='pk.eyJ1Ijoia2FsaXBzaWsiLCJhIjoiY2p3Z3JrdjQ4MDRjdDQzcGFyeXBlN3ZtZiJ9.miVaze_snePdEvitucFWSQ'
                >
                  <QueryRenderer
                    cubejsApi={cubejsApi}
                    render={chartsRenderer.mapbox}
                    query={{
                      measures: ['Covid.totalCases'],
                      dimensions: [
                        'Covid.countryterritorycode',
                        'Mapbox.name',
                        'Mapbox__coords.postal',
                        'Mapbox__coords.coordinates',
                      ],
                      timeDimensions: [
                        {
                          dimension: 'Covid.date',
                          dateRange: ['2020-01-01', this.state.dateQuery],
                        },
                      ],
                    }}
                  />
                </MapGL>
                {/**/}
              </div>
            </Col>
            <Col span={8}>
              <QueryRenderer
                cubejsApi={cubejsApi}
                render={chartsRenderer.list}
                query={{
                  measures: ['Covid.totalCases'],
                  dimensions: ['Mapbox.name'],
                  renewQuery: false,
                  timeDimensions: [
                    {
                      dimension: 'Covid.date',
                      dateRange: ['2020-01-01', this.state.dateQuery],
                    },
                  ],
                }}
              />
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={16}>
              <QueryRenderer
                key={1}
                cubejsApi={cubejsApi}
                render={this.sliderRender}
                query={{
                  measures: ['Covid.firstDate', 'Covid.lastDate'],
                  timeDimensions: [],
                }}
              />
            </Col>
          </Row>
        </Layout.Content>
      </Layout>
    );
  }
}

const App = ({ children }) => (
  <CubeProvider cubejsApi={cubejsApi}>
    <ApolloProvider client={client}>
      <AppLayout>{children}</AppLayout>
    </ApolloProvider>
  </CubeProvider>
);

export default App;
