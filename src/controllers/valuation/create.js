const { NotAcceptable } = require('rest-api-errors');
const { sendOne } = require('../../middleware');
const { im24, maps } = require('../../utils');
const _ = require('lodash');

const create = ({ Valuation }) => async (req, res, next) => {
  try {
    const valuation = new Valuation();
    _.extend(valuation, req.body);

    const address = valuation.street + ", " + valuation.zip + ", " + valuation.city;
    const geoResponse = await maps.getGeoLocation( address );

    if (geoResponse.data.results.length != 1) {
      throw new NotAcceptable('Geo Location unequal 1', geoResponse);
    }
    valuation.latitude = geoResponse.data.results[0].geometry.location.lat;
    valuation.longitude = geoResponse.data.results[0].geometry.location.lng;
    await valuation.save();

    const property = {
      "latitude": valuation.latitude,
      "longitude": valuation.longitude,
      "address": address,
      "realEstateTypeId": valuation.realEstateTypeId,
      "constructionYear": valuation.constructionYear,
      "roomCountId": valuation.roomCountId,
      "livingArea": valuation.livingArea,
      "siteArea": valuation.siteArea
    };
    const im24Response = await im24.getValuationBasic( property );
    return sendOne(res, im24Response.data);

  } catch (error) {
    next(error);
  }
};

module.exports = { create };
