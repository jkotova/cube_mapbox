import React from 'react';
import { colors } from './variables';
import { Table, Statistic } from 'antd';
import { Source, Layer } from 'react-map-gl';

export const chartsRenderer = {
  number: ({ resultSet }) => {
    if (!resultSet) {
      return null;
    }

    return (
      <React.Fragment>
        {resultSet.seriesNames().map((s, i) => (
          <Statistic
            key={i}
            value={resultSet.totalRow()[s.key]}
            precision={0}
            valueStyle={{ color: colors.red }}
            groupSeparator={' '}
          />
        ))}
      </React.Fragment>
    );
  },
  list: ({ resultSet }) => {
    if (!resultSet) {
      return null;
    }

    return (
      <Table
        pagination={false}
        scroll={{ y: 445 }}
        columns={[
          {
            title: 'Country',
            dataIndex: 'name',
          },
          {
            title: 'Total cases',
            dataIndex: 'total',
            render: (num) =>
              num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' '),
            className: 'text-center',
          },
        ]}
        dataSource={resultSet.tablePivot().map((s) => {
          return {
            name: s['Mapbox.name'],
            total: s['Covid.totalCases'],
          };
        })}
      />
    );
  },
  mapbox: ({ resultSet }) => {
    if (!resultSet) {
      return null;
    }

    let data = {
      type: 'FeatureCollection',
      features: [],
    };

    resultSet.tablePivot().map((s, i) => {
      if (s['Mapbox__coords.coordinates']) {
        data.features.push({
          type: 'Feature',
          properties: {
            name: s['Mapbox.name'],
            cases: parseInt(s['Covid.totalCases']),
          },
          geometry: {
            type: 'Polygon',
            coordinates: [
              s['Mapbox__coords.coordinates']
                .split(';')
                .map((item) => item.split(',')),
            ],
          },
        });
      }
    });

    return (
      <Source type='geojson' data={data}>
        <Layer
          beforeId='country-label'
          id='countries'
          type='fill'
          paint={{
            'fill-color': {
              property: 'cases',
              stops: colors.levels,
            },
          }}
        />
      </Source>
    );
  },
};
