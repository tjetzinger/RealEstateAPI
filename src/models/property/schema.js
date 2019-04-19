const { NotAcceptable, InternalServerError } = require('rest-api-errors');
const mongoose = require('mongoose');
const config = require('config');
const _ = require('lodash');
const Schema = mongoose.Schema;
const { im24, maps, hash } = require('../../utils');


const options = {
    timestamps: true
};

const schemaLocation = new Schema({
    latitude: {
        type: Number,
        required: true,
        alias: 'lat'
    },
    longitude: {
        type: Number,
        required: true,
        alias: 'lng'
    }
}, { _id: false});

const schemaValuation = new Schema({
    resultAbsolute: {
        type: Number,
        required: true
    },
    lowAbsolute: {
        type: Number,
        required: true
    },
    highAbsolute: {
        type: Number,
        required: true
    },
    resultPerSqm: {
        type: Number,
        required: true
    },
    lowPerSqm: {
        type: Number,
        required: true
    },
    highPerSqm: {
        type: Number,
        required: true
    },
    quickCheckAvailable: {
        type: Boolean
    },
    quickCheckLow: {
        type: Number
    },
    quickCheckHigh: {
        type: Number
    }
}, { _id: false});

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
    location: {
        type: schemaLocation
    },
    valuation: {
        type: schemaValuation
    },
    users: [{
        type: Number,
        ref: 'User'
    }]
}, options);

schema.pre('validate', function (next) {
    if (! this._id) this._id = this.generateId(this);
    next();
});

schema.pre('save', async function(next) {
    try {
        await this.fetchLocation();
        await this.fetchValuation();
        next();
    } catch (err) {
        next(err);
    }
});

schema.methods.fetchLocation = async function() {
    if(!this.location) {
        const geoResponse = await maps.getGeoLocation(this.address, this.$reqId);
        if (geoResponse.data.results.length !== 1)
            throw new NotAcceptable(geoResponse.data.status, this.toJSON());
        this.formatted_address = geoResponse.data.results[0].formatted_address;
        this.location = geoResponse.data.results[0].geometry.location;
    }
};

schema.methods.fetchValuation = async function() {
    if(!this.valuation) {
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
        const im24Response = await im24.getValuationBasic(im24Property, this.$reqId);
        this.valuation = im24Response.data;
    }
};

schema.statics.generateId = function (property) {
    return hash.md5(property.street + property.zip + property.city + property.country);
};

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
    let response = _.cloneDeep(config.messages.propertyLocation);
    response.content.messages[1].elements[0].title = this.formatted_address;
    response.content.messages[1].elements[0].image_url = this.locationImage;
    return response;
});

schema.virtual('responseValuation').get(function () {
    let response = _.cloneDeep(config.messages.propertyValuation);
    response.content.messages[0].elements[0].title = "Durchschnittlicher Gesamtwert für diese Immobilie: " + this.resultAbsolute;
    response.content.messages[0].elements[0].subtitle = "Wertspanne pro qm: " + this.lowPerSqm + " - " + this.highPerSqm;
    response.content.messages[0].elements[0].image_url = this.propertyImage;
    return response;
});

module.exports = { schema };
