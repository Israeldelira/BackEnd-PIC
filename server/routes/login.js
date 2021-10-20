'use strict';
const express = require('express');
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const UserModel = require("../models/users");


router.post('/login-user', async (req, res) => {
    try { 
        await validation.userLogin(req.body,"USER",res);
    } catch (err) {
       console.log("ocurrio un error"+err);
    }
})
router.post('/login-superAdmin', async (req, res) => {
    try { 
        await validation.userRegister(req.body,"SUPERADMIN",res);
    } catch (err) {
       
    }
})
router.post('/login-admin', async (req, res) => {
    try { 
        await validation.userRegister(req.body,"ADMIN",res);
    } catch (err) {
       
    }
})

module.exports = router;