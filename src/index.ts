import express, {
    Express,
    NextFunction,
    Application,
    Router,
    Response,
    CookieOptions,
    Errback,
    ErrorRequestHandler,
    Send,
    Request,
    Handler,
    IRoute,
    IRouterHandler,
    IRouterMatcher,
    RouterOptions,
    MediaType
} from "express";
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
import path from "path";
import appRoot from "app-root-path";
import randToken from "rand-token";
import crypto from "crypto";
import { PrismaClient } from '@prisma/client';
import {injectable} from "inversify"; // For dependency injection
import {Strategy as JwtStr, ExtractJwt} from 'passport-jwt';

import {ExpressRoutesUtils} from "./core/utils/expressRoutes.utils"
import {Db, MongoClient} from 'mongodb';
import DateDiff from "date-diff";
import stream from "stream";
import {Client, Pool, PoolClient, PoolConfig, CustomTypesConfig, ConnectionConfig} from "pg";


import CheckerMySqlDatabaseConnectionService from "./application/services/checkerMySqlDatabaseConnection.service";
import {BaseRouterConfig} from "./core/config/baseRouter.config";
import {EnvConfig} from "./core/config/env.config";
import StackTraceError from "./core/handlers/errors/base/stackTraceError";
import {LogLevelConstant} from "./domain/constants/logLevel.constant";
import ExceptionHandlerError from "./core/handlers/errors/base/stackTraceError";
import {HttpStatusCodesConstant} from "./domain/constants/httpStatusCodes.constant";
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
import {dateTimeFormattedUtils as currentDate} from "./core/utils/dateTimeFormatted.utils";
import {CoreApplication} from "./core/core";
import {MessagesException as Exception} from "./application/exceptions/messages.exception";
import {mySqlCheckerDatabase} from "./core/database/mySqlChecker.database";
import {mongoCheckerDatabase} from "./core/database/mongoChecker.database";
import {postgresCheckerDatabase} from "./core/database/postgresChecker.database";
import {optionalArgumentConnectionUtil as optionalArgumentConnection} from "./core/utils/connection/optionalArgumentConnection.util";
import {eventNameErrorConstant as eventName} from "./core/utils/constants/eventNameError.constant";
import {EventConstant as event} from "./core/utils/constants/event.constant";
import {eventProcessHandler} from "./core/handlers/eventProcess.handler";
import {ServerListenEventError as eventErrorOnListeningServer} from "./errors/serverListen.event.error";
import {requestCallsEvent} from "./core/events/requestCalls.event";
import {modulesLoadedUtils} from "./core/utils/modulesLoaded.utils";
import {LoggerCore as Logger} from "opticore-logger";
import {EnvironmentUtils as env} from "./core/utils/environment.utils";
import {KernelModuleInterface} from "./core/interfaces/kernelModule.interface";
import {KernelModuleType} from "./core/types/kernelModule.type";
import {YamlParsing} from "@/core/utils/parsingYaml.utils";
import {OpticoreRouter, OpticoreRegisterRouters, OPTRouters, OPTRouter, RoutersAppCore} from "opticore-router";

import { type IAuthPassportOptions } from "@/core/interfaces/authPassportOptions";
import { type StrategyOptions } from "passport-jwt";
import { passportUseGuard } from "@/core/middleware/guard/passportGuard.middleware";
import { type IRouteDefinition } from "@/core/interfaces/routeDefinition.interface";
import { type ICustomContext } from "opticore-router";

export { type PoolClient, type PoolConfig, type CustomTypesConfig, type ConnectionConfig } from "pg";
export { type LogLevelType } from "./core/types/logLevel.type";
export { type KernelModuleInterface } from "./core/interfaces/kernelModule.interface";
export { type KernelModuleType } from "./core/types/kernelModule.type";

export {
    type Router,
    type Express,
    type NextFunction,
    type Application,
    type Response,
    type CookieOptions,
    type Errback,
    type ErrorRequestHandler,
    type Send,
    type Request,
    type Handler,
    type IRoute,
    type IRouterHandler,
    type IRouterMatcher,
    type RouterOptions,
    type MediaType
} from "express";

export {
    appRoot,
    colors,
    crypto,
    fs,
    IAuthPassportOptions,
    IRouteDefinition,
    ExtractJwt,
    StrategyOptions,
    ICustomContext,
    jsonWebToken,
    mySQL,
    bcrypt,
    dotenv,
    eventName,
    event,
    optionalArgumentConnection,
    currentDate,
    Validator,
    randToken,
    passport,
    path,
    stream,
    getEnvVariable,
    PrismaClient,
    LogLevelConstant,
    env,
    express,
    corsOrigin,
    cookieParser,
    Client,
    injectable,
    DateDiff,
    Pool,
    Logger,
    EnvConfig,
    BaseRouterConfig,
    Db,
    MongoClient,
    mySqlCheckerDatabase,
    mongoCheckerDatabase,
    postgresCheckerDatabase,
    ExceptionHandlerError,
    CoreApplication,
    Exception,
    eventProcessHandler,
    eventErrorOnListeningServer,
    ValidatePasswordUtils,
    ExpressRoutesUtils,
    HashPasswordUtils,
    HttpStatusCodesConstant,
    UtilityUtils,
    requestsStoredUtils,
    modulesLoadedUtils,
    LogMessageUtils,
    jsonBodyParserType,
    JwtStr,
    rawBodyParserType,
    textBodyParserType,
    urlencodedBodyParserType,
    AsymmetricCryptionDataWithPrivateRSAKeyService,
    AsymmetricCryptionDataWithPublicRSAKeyService,
    CheckerMySqlDatabaseConnectionService,
    OpticoreRouter,
    OpticoreRegisterRouters,
    OPTRouters,
    OPTRouter,
    RoutersAppCore,
    passportUseGuard,
    ResponseHttp,
    requestCallsEvent,
    RSAKeyDecryption,
    RSAKeyEncryption,
    StackTraceError,
    YamlParsing
};

