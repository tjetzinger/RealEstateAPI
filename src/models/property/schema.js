const { NotAcceptable, InternalServerError } = require('rest-api-errors');
const mongoose = require('mongoose');
const config = require('config');
const _ = require('lodash');
const Schema = mongoose.Schema;
const locationSchema = require('../location/schema');
const valuationSchema = require('../valuation/schema');
const { Location } = require('../location');
const { Valuation } = require('../valuation');
const { im24, maps, hash } = require('../../utils');
const ObjectId = Schema.Types.ObjectId;

Number.prototype.toCurrency = function(){
    return this.toLocaleString(config.locale.language, config.locale.currency).replace(',', '.');
};

const options = {
    timestamps: true,
    toJSON: { virtuals: true }
};

const schema = new Schema({
    _id: {
        type: String,
        required: true
    },
    street: {
        type: String,
        required: true,
        trim: true
    },
    zip: {
        type: String,
        required: true,
        trim: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    country: {
        type: String,
        required: true,
        trim: true
    },
    formatted_address: {
        type: String,
    },
    realEstateTypeId: {
        type: Number,
        required: true
    },
    constructionYearRangeId: {
        type: Number,
        required: true
    },
    roomCountId: {
        type: Number,
        required: true
    },
    livingArea: {
        type: Number,
        required: true,
        set: function (v) {
            return (v > 15) ? v : 15;
        }
    },
    siteArea: {
        type: Number,
        set: function (v) {
            return (v > 50) ? v : 50;
        }
    },
    location: { type: locationSchema, required: true, default: {} },
    valuation: { type: valuationSchema, required: true, default: {} }
}, options);

schema.pre('validate', function (next) {
    this._id = this.id;
    next();
});

schema.pre('save', async function(next) {
    try {
        await this.fetchLocation(next);
        await this.fetchValuation(next);
        next();
    } catch (err) {
        next(err);
    }
});

schema.methods.fetchLocation = async function(next) {
    if(typeof this.location == 'undefined' || typeof this.location._id == 'undefined') {
        const geoResponse = await maps.getGeoLocation(this.address);
        if (geoResponse.data.results.length !== 1)
            throw new NotAcceptable('Geo Location unequal 1', geoResponse);
        this.formatted_address = geoResponse.data.results[0].formatted_address;
        this.location = new Location(geoResponse.data.results[0].geometry.location);
    }
};

schema.methods.fetchValuation = async function(next) {
    if(typeof this.valuation == 'undefined' || typeof this.valuation._id == 'undefined') {
        const im24Property = {
            "latitude": this.location.latitude,
            "longitude": this.location.longitude,
            "address": this.address,
            "realEstateTypeId": this.realEstateTypeId,
            "constructionYearRangeId": this.constructionYearRangeId,
            "roomCountId": this.roomCountId,
            "livingArea": this.livingArea,
            "siteArea": this.siteArea
        };
        const im24Response = await im24.getValuationBasic(im24Property);
        this.valuation = new Valuation(im24Response.data);
    }
};

schema.virtual('id').get(function () {
    return hash.md5(this.address);
});

schema.virtual('address').get(function () {
    return this.street + ", " + this.zip + ", " + this.city + ", " + this.country;
});

schema.virtual('resultAbsolute').get(function () {
    return this.valuation.resultAbsolute.toCurrency();
});

schema.virtual('lowAbsolute').get(function () {
    return this.valuation.lowAbsolute.toCurrency();
});

schema.virtual('highAbsolute').get(function () {
    return this.valuation.highAbsolute.toCurrency();
});

schema.virtual('resultPerSqm').get(function () {
    return this.valuation.resultPerSqm.toCurrency();
});

schema.virtual('lowPerSqm').get(function () {
    return this.valuation.lowPerSqm.toCurrency();
});

schema.virtual('highPerSqm').get(function () {
    return this.valuation.highPerSqm.toCurrency();
});

schema.virtual('quickCheckLow').get(function () {
    return this.valuation.quickCheckLow.toCurrency();
});

schema.virtual('quickCheckHigh').get(function () {
    return this.valuation.quickCheckHigh.toCurrency();
});

schema.virtual('locationImage').get(function () {
    return encodeURI(config.gmaps.calls.staticImage.url + '?center=' + this.address + '&zoom=' + config.gmaps.calls.staticImage.requestsTypes[0].zoom + '&maptype=' + config.gmaps.calls.staticImage.requestsTypes[0].maptype + '&size=' + config.gmaps.calls.staticImage.requestsTypes[0].size + '&markers=' + this.location.latitude + ',' + this.location.longitude + '&key=' + config.gmaps.auth.key);
});

schema.virtual('propertyImage').get(function () {
    return encodeURI(config.gmaps.calls.staticImage.url + '?center=' + this.address + '&zoom=' + config.gmaps.calls.staticImage.requestsTypes[1].zoom + '&maptype=' + config.gmaps.calls.staticImage.requestsTypes[1].maptype + '&size=' + config.gmaps.calls.staticImage.requestsTypes[1].size + '&key=' + config.gmaps.auth.key);
});

schema.virtual('responseLocation').get(function () {
    let response = _.cloneDeep(config.messages.propertyValuation);
    response.content.messages[0].elements[0].title = this.formatted_address;
    response.content.messages[0].elements[0].image_url = this.locationImage;
    return response;
});

schema.virtual('responseValuation').get(function () {
    let response = _.cloneDeep(config.messages.propertyValuation);
    response.content.messages[0].elements[0].title = "Durchschnittlicher Gesamtwert für diese Immobilie: " + this.resultAbsolute;
    response.content.messages[0].elements[0].subtitle = "Wertspanne pro qm: " + this.lowPerSqm + " - " + this.highPerSqm;
    response.content.messages[0].elements[0].image_url = this.propertyImage;
    return response;
});

schema.virtual('users', {
    ref: 'UserProperty',
    localField: '_id',
    foreignField: 'propertyId'
});

module.exports = { schema };
