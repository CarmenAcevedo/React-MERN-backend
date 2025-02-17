const moment = require("moment");

const isDate = ( value, rest) => {

    // console.log(value);
    // console.log(rest);

    if ( !value ) {
        return false;
    }

    const fecha = moment( value );
    if ( fecha.isValid() ) {
        return true;
    } else {
        return false;
    }

}

module.exports = { isDate };