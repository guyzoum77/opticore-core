import express from "express";
import Validator from 'validatorjs';
import jsonWebToken from "jsonwebtoken";
import corsOrigin from "cors";
import cookieParser from "cookie-parser";
import mySQL from "mysql";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import colors from "ansi-colors";
import fs from "fs";
import passport from "passport";
import { createLogger, transports } from "winston";
import path from "path";
import appRoot from "app-root-path";
import randToken from "rand-token";
import crypto from "crypto";
import { PrismaClient } from '@prisma/client';
import {injectable} from "inversify"; // For dependency injection
import {ExpressRoutesUtils} from "./core/utils/expressRoutes.utils"
import {Db, MongoClient} from 'mongodb';
import winston from 'winston';
import {format} from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import DateDiff from "date-diff";
import stream from "stream";
import {Client, Pool, PoolClient, PoolConfig, CustomTypesConfig, ConnectionConfig} from "pg";

import Exception from "./application/exceptions/messages.exception";
import CheckerMySqlDatabaseConnectionService from "./application/services/checkerMySqlDatabaseConnection.service";
import {BaseRouterConfig} from "./core/config/baseRouter.config";
import CorsOptionsConfig from "./core/config/corsOptions.config";
import DbConnexionConfig from "./core/config/dbConnexion.config";
import {ServerEnvConfig} from "./core/config/serverEnv.config";
import StackTraceError from "./core/handlers/errors/base/stackTraceError";
import RegisterRoute from "./core/router/register.route";
import LoggerFormat from "./core/utils/logs/logger.utils";
import {LogLevelEnum} from "./domain/enums/logLevel.enum";
import {RoleEnum} from "./domain/enums/role.enum";
import ExceptionHandlerError from "./core/handlers/errors/base/stackTraceError";
import {HttpStatusCodesConstant} from "./domain/constants/httpStatusCodes.constant";
import {LoggerComponent} from "./presentation/components/logger.component";
import {RSAKeyDecryption} from "./core/utils/cryptography/decryption/rsaKey.decryption";
import {RSAKeyEncryption} from "./core/utils/cryptography/encryption/rsaKey.encryption";
import {ValidatePasswordUtils} from "./core/utils/password/validatePassword.utils";
import {HashPasswordUtils} from "./core/utils/password/hashPassword.utils";
import AsymmetricCryptionDataWithPrivateRSAKeyService from "./application/services/asymmetricCryptionDataWithPrivateRSAKey.service";
import AsymmetricCryptionDataWithPublicRSAKeyService from "./application/services/asymmetricCryptionDataWithPublicRSAKey.service";
import {UtilityUtils} from "./core/utils/utility.utils";
import {requestsStoredUtils} from "./core/utils/requestsStored.utils";
import {ServerListenUtils as serverListen} from "./core/utils/serverListen.Utils";
import {jsonBodyParserType} from "./core/types/json.type";
import {rawBodyParserType} from "./core/types/raw.type";
import {textBodyParserType} from "./core/types/text.type";
import {urlencodedBodyParserType} from "./core/types/urlencoded.type";
import {LogMessageUtils} from "./core/utils/logMessage.utils";
import {ResponseHttp} from "./application/http/response.http";
import {getAccessEnv} from "./domain/env/access.env";
import {dateTimeFormattedUtils} from "./core/utils/dateTimeFormatted.utils";
import {database} from "opticore-database";
import {serverParams} from "./core/utils/serverParams.utils";
import {setupServerConfig} from "./core/config/setupServer.config";


export type { PoolClient, PoolConfig, CustomTypesConfig, ConnectionConfig };
export {
    colors,
    express,
    jsonWebToken,
    corsOrigin,
    cookieParser,
    mySQL,
    database,
    serverParams,
    setupServerConfig,
    Client,
    createLogger,
    format,
    transports,
    bcrypt,
    fs,
    Db,
    MongoClient,
    dotenv,
    LoggerFormat,
    ServerEnvConfig,
    dateTimeFormattedUtils,
    Validator,
    crypto,
    randToken,
    passport,
    appRoot,
    path,
    stream,
    getAccessEnv,
    ExceptionHandlerError,
    PrismaClient,
    injectable,
    winston, DailyRotateFile,
    DateDiff,
    Pool,
    HttpStatusCodesConstant,
    LoggerComponent,
    RSAKeyDecryption,
    RSAKeyEncryption,
    ValidatePasswordUtils,
    ExpressRoutesUtils,
    HashPasswordUtils,
    UtilityUtils,
    requestsStoredUtils,
    serverListen,
    LogMessageUtils,
    jsonBodyParserType,
    rawBodyParserType,
    textBodyParserType,
    urlencodedBodyParserType,
    RegisterRoute,
    Exception,
    CheckerMySqlDatabaseConnectionService,
    BaseRouterConfig,
    CorsOptionsConfig,
    DbConnexionConfig,
    StackTraceError,
    LogLevelEnum,
    RoleEnum,
    AsymmetricCryptionDataWithPrivateRSAKeyService,
    AsymmetricCryptionDataWithPublicRSAKeyService,
    ResponseHttp
};

