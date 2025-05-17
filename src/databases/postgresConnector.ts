import { Sequelize } from 'sequelize-typescript';
import { Environment } from '../models/environments';
import database from './database.config';

const postgresConnector : Sequelize = new Sequelize({
  dialect: 'postgres',
  database: database.postgresDatabase,
  host: database.postgresHostname,
  port: Number(database.postgresPort),
  username: database.postgresUsername,
  password: database.postgresPassword,
  models: [Environment],
  logging: false, 
});

postgresConnector.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
});


export default postgresConnector;
