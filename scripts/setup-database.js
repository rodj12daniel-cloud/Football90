require('dotenv').config();

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

const connectionOptions = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: process.env.DB_SSL === 'true' ? {
    rejectUnauthorized: true,
    ...(process.env.DB_SSL_CA ? {
      ca: process.env.DB_SSL_CA.includes('BEGIN CERTIFICATE')
        ? process.env.DB_SSL_CA.replace(/\\n/g, '\n')
        : fs.readFileSync(path.resolve(process.env.DB_SSL_CA))
    } : {})
  } : undefined
};

const statements = [
  "CREATE TABLE IF NOT EXISTS orders (id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT, user_id INT UNSIGNED NOT NULL, name VARCHAR(100) NOT NULL, email VARCHAR(255) NOT NULL, phone VARCHAR(40) NOT NULL, address VARCHAR(255) NOT NULL, city VARCHAR(100) NOT NULL, province VARCHAR(100) NOT NULL, postal_code VARCHAR(30) NOT NULL, payment VARCHAR(50) NOT NULL, subtotal DECIMAL(10,2) NOT NULL DEFAULT 0, shipping DECIMAL(10,2) NOT NULL DEFAULT 0, total DECIMAL(10,2) NOT NULL DEFAULT 0, status VARCHAR(80) NOT NULL DEFAULT 'Order is being prepared', created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (id), KEY idx_orders_user_id (user_id), CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id))",
  "CREATE TABLE IF NOT EXISTS order_items (id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT, order_id BIGINT UNSIGNED NOT NULL, product_id INT NOT NULL, product_name VARCHAR(255) NOT NULL, size VARCHAR(20) NOT NULL, quantity INT UNSIGNED NOT NULL, price DECIMAL(10,2) NOT NULL, PRIMARY KEY (id), KEY idx_order_items_order_id (order_id), CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE)"
];

(async () => {
  const connection = await mysql.createConnection(connectionOptions);
  const [columns] = await connection.query("SELECT 1 FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'users' AND column_name = 'is_active'");
  if (!columns.length) await connection.execute('ALTER TABLE users ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT TRUE');
  for (const statement of statements) await connection.execute(statement);
  console.log('Aiven database schema is ready.');
  await connection.end();
})().catch((error) => {
  console.error(error.code || error.message);
  process.exitCode = 1;
});
