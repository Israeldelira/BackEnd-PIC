//Environment settings
'use strict';
require("dotenv").config();

module.exports={
    PORT:process.env.PORT || 3000,  //PORT
    MONGO_LOCAL:process.env.MONGO_LOCAL, //MONGO DATA
    JWT_SECRET:process.env.JWT_SECRET //JWT FIRM
};
