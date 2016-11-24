import express from 'express';
import AuthorAPI from '../lib/author';
import AuthorDB from '../db/author';
import pool from '../db/pool';


const authorAPI = new AuthorAPI(new AuthorDB(pool));
const router = express.Router();


export default router;
