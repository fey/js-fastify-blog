// @ts-check

import fp from 'fastify-plugin';
// import sequelizeFastify from 'sequelize-fastify';
// import dbConfig from '../config/config.cjs';
import db from '../models/index.cjs';

export default fp(async (fastify) => {
  fastify.decorate('db', db.sequelize);
  fastify.addHook('onClose', async () => {
    await db.sequelize.close();
  });

  // NOTE: sequelize-fastify внутри использует колбеки
  // в результате сервер останавливается ранше чем соединение с БД
  // и в тестах выводится Jest did not exit one second after the test run has completed.
  // Также sequelize-fastify не загружает models и не добавляет их к инстансу
  // это приодится делать вручную с помощью генерируемого sequelize фала models/index.cjs
  // Таким образом открывается ещё одно соединение к БД.
  // В итоге вручную подключить sequelize проще и работает всё корректно.
  // Ниже закоментировано подключение с помощью sequelize-fastify

  // await fastify.register(sequelizeFastify, {
  //   instance: 'db',
  //   sequelizeOptions: dbConfig[fastify.mode],
  // });
  // // eslint-disable-next-line
  // fastify.db.models = db.sequelize.models;
});
