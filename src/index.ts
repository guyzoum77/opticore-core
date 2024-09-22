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

import CheckerMySqlDatabaseConnectionService from "./application/services/checkerMySqlDatabaseConnection.service";
import {BaseRouterConfig} from "./core/config/baseRouter.config";
import {EnvConfig} from "./core/config/env.config";
import StackTraceError from "./core/handlers/errors/base/stackTraceError";
import LoggerFormat from "./core/utils/logs/logger.utils";
import {LogLevelConstant} from "./domain/constants/logLevel.constant";
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
import {jsonBodyParserType} from "./core/types/json.type";
import {rawBodyParserType} from "./core/types/raw.type";
import {textBodyParserType} from "./core/types/text.type";
import {urlencodedBodyParserType} from "./core/types/urlencoded.type";
import {LogMessageUtils} from "./core/utils/logMessage.utils";
import {ResponseHttp} from "./application/http/response.http";
import {getEnvVariable} from "./domain/env/access.env";
import {dateTimeFormattedUtils} from "./core/utils/dateTimeFormatted.utils";
import {CoreApplication} from "./core/core";
import {MessagesException as Exception} from "./application/exceptions/messages.exception";
import {mySqlCheckerDatabase} from "./core/database/mySqlChecker.database";
import {mongoCheckerDatabase} from "./core/database/mongoChecker.database";
import {postgresCheckerDatabase} from "./core/database/postgresChecker.database";
import {optionalArgumentConnectionUtil as optionalArgumentConnection} from "./core/utils/connection/optionalArgumentConnection.util";
import {expressRouterUtils as routerApp} from "./core/utils/expressRouter.utils";
import {eventNameErrorConstant as eventName} from "./core/utils/constants/eventNameError.constant";
import {EventConstant as event} from "./core/utils/constants/event.constant";
import {eventProcessHandler} from "./core/handlers/eventProcess.handler";
import {ServerListenEventError as eventErrorOnListeningServer} from "./errors/serverListen.event.error";
import {requestCallsEvent} from "./core/events/requestCalls.event";
import {modulesLoadedUtils} from "./core/utils/modulesLoaded.utils";



export type { PoolClient, PoolConfig, CustomTypesConfig, ConnectionConfig };
export {
    colors,
    fs,
    crypto,
    appRoot,
    winston,
    jsonWebToken,
    mySQL,
    format,
    transports,
    bcrypt,
    routerApp,
    dotenv,
    eventName,
    event,
    optionalArgumentConnection,
    dateTimeFormattedUtils,
    Validator,
    randToken,
    passport,
    path,
    stream,
    getEnvVariable,
    PrismaClient,
    DailyRotateFile,
    LogLevelConstant,
    express,
    corsOrigin,
    cookieParser,
    Client,
    injectable,
    DateDiff,
    Pool,
    createLogger,
    LoggerFormat,
    LoggerComponent,
    EnvConfig,
    BaseRouterConfig,
    Db,
    MongoClient,
    mySqlCheckerDatabase,
    mongoCheckerDatabase,
    postgresCheckerDatabase,
    ExceptionHandlerError,
    StackTraceError,
    RSAKeyDecryption,
    RSAKeyEncryption,
    CoreApplication,
    Exception,
    ValidatePasswordUtils,
    ExpressRoutesUtils,
    HashPasswordUtils,
    UtilityUtils,
    requestsStoredUtils,
    modulesLoadedUtils,
    LogMessageUtils,
    jsonBodyParserType,
    rawBodyParserType,
    textBodyParserType,
    urlencodedBodyParserType,
    AsymmetricCryptionDataWithPrivateRSAKeyService,
    AsymmetricCryptionDataWithPublicRSAKeyService,
    CheckerMySqlDatabaseConnectionService,
    ResponseHttp,
    eventProcessHandler,
    eventErrorOnListeningServer,
    requestCallsEvent,
    HttpStatusCodesConstant,
};

