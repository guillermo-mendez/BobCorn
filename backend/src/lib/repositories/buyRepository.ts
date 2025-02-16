import { pool } from '../../config/database';

class BuyRepository {
  async buyCorn(clientId: string) {
    await pool.query(`INSERT INTO purchases (client_id, created_at, updated_at) VALUES ($1, NOW(),NOW())`, [clientId]);
  }
}

export default new BuyRepository();