"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userAuth_1 = require("../controller/userAuth");
const router = (0, express_1.Router)();
router.post('/signup', userAuth_1.signupAuth);
router.post('/login', userAuth_1.loginAuth);
exports.default = router;
