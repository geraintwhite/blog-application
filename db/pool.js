import {db} from '../config';
import {createPool} from 'mysql';


const pool = createPool(db);


export default pool;
