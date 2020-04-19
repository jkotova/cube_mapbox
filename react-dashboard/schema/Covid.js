cube(`Covid`, {
  sql: `SELECT * FROM public.covid`,

  joins: {
    Mapbox: {
      sql: `${CUBE}.countryterritorycode = ${Mapbox}.iso_a3`,
      relationship: `belongsTo`,
    },

    Mapbox__coords: {
      sql: `${CUBE}.countryterritorycode = ${Mapbox__coords}.iso_a3`,
      relationship: `belongsTo`,
    },
  },

  measures: {
    count: {
      sql: `id`,
      type: `count`,
    },

    totalCases: {
      sql: `cases`,
      type: `sum`,
    },

    totalDeaths: {
      sql: `deaths`,
      type: `sum`,
    },

    lastDate: {
      sql: `${dateNum}`,
      type: 'max',
    },

    firstDate: {
      sql: `${dateNum}`,
      type: 'min',
    },
  },

  dimensions: {
    date: {
      sql: `TO_TIMESTAMP(CONCAT_WS('-', ${CUBE}.year, ${CUBE}.month, ${CUBE}.day), 'YYYY-MM-DD')`,
      type: 'time',
    },

    dateNum: {
      sql: `date_part('epoch',${date})`,
      type: 'number',
    },

    countryterritorycode: {
      sql: `countryterritorycode`,
      type: `string`,
    },

    id: {
      sql: `${CUBE}.date || '-' || ${CUBE}.countryterritorycode`,
      type: `string`,
      primaryKey: true,
    },
  },
});
