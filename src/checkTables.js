import sequelize from "../src/config/db.js";

const [tables] = await sequelize.query("SHOW TABLES");
console.log(tables);

const [constraints] = await sequelize.query(`
SELECT
  CONSTRAINT_NAME,
  TABLE_NAME
FROM information_schema.TABLE_CONSTRAINTS
WHERE TABLE_SCHEMA = DATABASE()
AND CONSTRAINT_TYPE = 'FOREIGN KEY';
`);

console.log(constraints);

process.exit();