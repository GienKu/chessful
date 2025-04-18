// @deno-types="@types/passport"
import passport from 'passport';
import { Application } from 'express';
import { verifyJwtFromHeader } from './strategies/verifyJwtFromHeader';
import verifyJwtFromUrl from './strategies/verifyJwtFromUrl';

export const passportConfig = (app: Application) => {
  try {
    app.use(passport.initialize());
    passport.use('jwt-header', verifyJwtFromHeader());
    passport.use('jwt-url', verifyJwtFromUrl());
  } catch (error: any) {
    console.error('Error in passportConfig', error);
  }
};
