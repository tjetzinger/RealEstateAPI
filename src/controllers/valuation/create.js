const { NotAcceptable } = require('rest-api-errors');
const { sendOne } = require('../../middleware');
const { im24, maps } = require('../../utils');
const _ = require('lodash');

const create = ({ Property }) => async (req, res, next) => {
  try {
    const property = new Property();
    _.extend(property, req.body);

    const address = property.street + ", " + property.zip + ", " + property.city;
    const geoResponse = await maps.getGeoLocation( address );

    if (geoResponse.data.results.length != 1) {
      throw new NotAcceptable('Geo Location unequal 1', geoResponse);
    }
    property.latitude = geoResponse.data.results[0].geometry.location.lat;
    property.longitude = geoResponse.data.results[0].geometry.location.lng;
    await property.save();

    const property_json = {
      "latitude": property.latitude,
      "longitude": property.longitude,
      "address": address,
      "realEstateTypeId": property.realEstateTypeId,
      "constructionYear": property.constructionYear,
      "roomCountId": property.roomCountId,
      "livingArea": property.livingArea,
      "siteArea": property.siteArea
    };
    const im24Response = await im24.getValuationBasic( property_json );
    return sendOne(res, im24Response.data);

  } catch (error) {
    next(error);
  }
};

module.exports = { create };
