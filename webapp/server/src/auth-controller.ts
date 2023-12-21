import express from "express";
import jwt from 'jsonwebtoken';
import { Connection, RowDataPacket } from "mysql2";
import * as bcrypt from 'bcryptjs';

export class AuthController {

  private jwtSecret: string = "";

  private readonly sessionTimeInMinutes = 100; // in minutes

  // Help: 1 min = 60000 Ms
  private readonly JWT_TOKEN_EXPIRATION = this.sessionTimeInMinutes * 60; // in seconds, providing for 30 minutes
  private readonly COOKIE_EXPIRATION = this.sessionTimeInMinutes * 60 * 1000; // in milliseconds, providing for 30 minutes

  constructor(private router: express.Router, private db: Connection) {
    const secret = (process.env.JWT_SECRET as string) || null;
    if (!secret) {
      throw new Error("JWT secret is not provided!");
    }
    // secret is not null
    this.jwtSecret = (secret as string);
  }

  public registerEndpoints() {
    this.router.post("/login", this.login.bind(this));
    this.router.get("/logout", this.logout.bind(this)); //  this.authGuard.bind(this)
  }

  private login(req: express.Request, res: express.Response) {
    // console.log('login');
    const email = req.body.data.email as string;
    const password = req.body.data.password as string;

    try {
      this.db.query<RowDataPacket[]>(`SELECT member_id, member_name, email, isAdmin, passwordHash FROM Members WHERE email = "${email}" Limit 1`, (err, results) => {
        if (err) {
          res.status(401).json({ message: 'Error occured.' });
        } else {
          const user = results[0];

          if ( user && bcrypt.compareSync(password, user.passwordHash)) {
            this.generateTokenIntoCookie(res, user.member_id);
            res.status(200).json({
              user: {
                id: user.member_id,
                name: user.member_name,
                email: user.email,
                isAdmin: user.isAdmin === 1
              }
            });
          }else {
            res.status(401).json({ message: 'Incorrect email or password' });
          }
        }
      });
    }
    catch (err: unknown) {
      return res.status(401).json({
        message: 'Login has failed'
      });
    }
  }

  private logout(req: express.Request, res: express.Response) {
    return res
      .clearCookie('jwt')
      .cookie('jwt', '', { expires: new Date(0) })
      .status(200).json({
        data: {
          message: 'Logged out.'
        }
      });
  }

  /**
   * AuthGuard middleware
   */
  public async authGuard(req: express.Request, res: express.Response, next: express.NextFunction) {
    const token = req.cookies.jwt;

    if (token) {
      try {
        const decoded = await jwt.verify(token, this.jwtSecret);

        // optionally query user from database and set in req
        // req.user = await User.findById(decoded.userId).select('-password');

        next();
      } catch (error) {
        console.error(error);
        return res.status(401).json({ message: 'Not authorized, token failed.' });
      }
    } else {
      return res.status(401).json({ message: 'Not authorized, no token.' });
    }
  }

  private generateTokenIntoCookie(res: express.Response, userId: string): void {
    const token = jwt.sign({ userId }, this.jwtSecret, {
      expiresIn: this.JWT_TOKEN_EXPIRATION,
    });

    const cookieExpires = new Date(Date.now() + this.COOKIE_EXPIRATION);

    res.cookie('jwt', token, {
      httpOnly: true, // frontend scripts can not read
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      sameSite: 'strict', // Prevent CSRF attacks
      expires: cookieExpires, // IE compatible
      // maxAge: this.COOKIE_EXPIRATION
    });
  }

  public get Router(): express.Router {
    return this.router;
  }
}