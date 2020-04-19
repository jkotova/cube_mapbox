cube(`Mapbox`, {
  sql: `SELECT * FROM public.mapbox`,

  joins: {},

  measures: {},

  dimensions: {
    name: {
      sql: 'name',
      type: 'string',
    },

    postal: {
      sql: 'postal',
      type: 'string',
      primaryKey: true,
    },

    geometry: {
      sql: 'geometry',
      type: 'string',
    },
  },
});
