const { NotAcceptable, InternalServerError } = require('rest-api-errors');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const locationSchema = require('../location/schema');
const valuationSchema = require('../valuation/schema');
const { Location } = require('../location');
const { Valuation } = require('../valuation');
const { im24, maps, hash } = require('../../utils');
const ObjectId = Schema.Types.ObjectId;

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
        required: true
    },
    siteArea: {
        type: Number,
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

schema.virtual('address').get(function () {
    return this.street + ", " + this.zip + ", " + this.city + ", " + this.country;
});

schema.virtual('id').get(function () {
    return hash.md5(this.address);
});

schema.virtual('users', {
    ref: 'UserProperty',
    localField: '_id',
    foreignField: 'propertyId'
});

module.exports = { schema };
