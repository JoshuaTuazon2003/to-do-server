import pkg from 'pg'
const {Pool} = pkg;
configDotenv.config();

let newPool;

console.log(process.env.NODE_ENV);

if (process.env.NODE_ENV ==='development') {
    const {DB_HOST,DB_NAME_DB_USER_DB_PASSWORD_DB_PORT} = process.env;

    newPool = new Pool({
        host:DB_HOST,
        user:DB_USER,
        password:DB_PASSWORD,
        database:DB_NAME,
        port:DB_PORT,

    });
} else {
    const {PROD_DB_HOST,PROD_DB_NAME,PROD_USER,PROD_DB_PASSWORD,PROD_DB_PORT,PROD_ENDPOINT_ID} =process.env;
    
    newPool = new Pool({
        host:PROD_DB_HOST,
        user:PROD_DB_USER,
        password:PROD_DB_PASSWORD,
        database:PROD_DB_NAME,
        port:PROD_DB_PORT,
        ssl:{
           rejectUnauthorized:false,
        },
        connectionString:
        'postgres://${PROD_DB_USER}:${PROD_DB_PASWWORD}@${PROD_DB_HOST}:5432/${PROD_DB_NAME}?OPTION=project=${PROD_ENDPOINT_ID}',
    });
}

const db =newPool;
db.connect()
.then(() =>console.log('Connected to PostgresSQL'))
.catch(err => console.error('Conection error', err.stack));

export default db;