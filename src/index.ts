import express from "express";
import Validator from "validatorjs";
import jsonWebToken from "jsonwebtoken";
import corsOrigin from "cors";
import cookieParser from "cookie-parser";
import mySQL from "mysql";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import fs from "fs";
import { createLogger, transports } from "winston";
import path from "path";
import appRoot from "app-root-path";
import passport, {Strategy} from "passport";
import {Strategy as JwtStr, StrategyOptions, ExtractJwt} from 'passport-jwt';
import {Strategy as LocalStrategy, VerifyFunction, IStrategyOptions} from "passport-local";
import randToken from "rand-token";
import crypto from "crypto";
import { PrismaClient } from '@prisma/client';
import {injectable} from "inversify"; // For dependency injection
const winston = require('winston');
import {format} from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import DateDiff from "date-diff";


import Exception from "./application/exceptions/messages.exception";
import CheckerDatabaseConnectionService from "./application/services/checkerDatabaseConnection.service";
import {BaseRouterConfig} from "./core/config/baseRouter.config";
import CorsOptionsConfig from "./core/config/corsOptions.config";
import DbConnexionConfig from "./core/config/dbConnexion.config";
import {ServerEnvConfig} from "./core/config/serverEnv.config";
import AppExceptionHandlerError from "./core/errors/appExceptionHandler.error";
import RegisterRoute from "./core/router/register.route";
import LoggerFormat from "./core/utils/logs/logger.utils";
import {LogLevelEnum} from "./domain/enums/logLevel.enum";
import {RoleEnum} from "./domain/enums/role.enum";
import ExceptionHandlerError from "./core/errors/appExceptionHandler.error";
import {AccessEnv} from "./domain/env/access.env";
import {HttpStatusCodesConstant} from "./domain/constants/httpStatusCodes.constant";
import {LoggerComponent} from "./presentation/components/logger.component";
import {RSAKeyDecryption} from "./core/utils/cryptography/decryption/rsaKey.decryption";
import {RSAKeyEncryption} from "./core/utils/cryptography/encryption/rsaKey.encryption";
import {ValidatePasswordUtils} from "./core/utils/password/validatePassword.utils";
import {HashPasswordUtils} from "./core/utils/password/hashPassword.utils";


export type { IStrategyOptions, VerifyFunction } from "passport-local";
export {
    express, Validator, jsonWebToken, corsOrigin, cookieParser, mySQL, createLogger, format, transports, bcrypt, fs,
    dotenv, LoggerFormat, ServerEnvConfig, passport, Strategy, crypto, ExtractJwt, randToken,
    appRoot, path, ExceptionHandlerError, AccessEnv, PrismaClient, LocalStrategy, JwtStr, injectable,
    winston, DailyRotateFile, DateDiff, HttpStatusCodesConstant, LoggerComponent, RSAKeyDecryption, RSAKeyEncryption,
    ValidatePasswordUtils, HashPasswordUtils, RegisterRoute, Exception, CheckerDatabaseConnectionService, BaseRouterConfig,
    CorsOptionsConfig, DbConnexionConfig, AppExceptionHandlerError, LogLevelEnum, RoleEnum
};

