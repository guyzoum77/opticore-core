import express from "express";

export type KernelModuleType = [express.Router[], () => void];