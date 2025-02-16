import {pool} from '../../config/database';

class BuyRepository {
  /**
   * Obtiene el cliente por código.
   * @param clientCode string
   * @returns Promise<{clientId: string}>
   */
  async getClientByCode(clientCode: string): Promise<{clientId: string}> {
    const result = await pool.query(`SELECT id AS "clientId" FROM clients WHERE code = $1`, [clientCode]);
    return result.rows[0];
  }

  /**
   * Verificar el último registro del cliente en la tabla rate_limits.
   * @param clientId string
   * @returns Promise<{rowCount: number, rows: {last_request: string}[]}>
   */
  async getRateLimitsByClientId(clientId: string): Promise<{rowCount: number, rows: {last_request: string}[]}> {
    const query = `SELECT last_request FROM rate_limits WHERE client_id = $1 AND deleted_at IS NULL;`;
    const result = await pool.query(query, [clientId]);
    return {rowCount: result.rowCount as number, rows: result.rows};
  }

  /**
   * Actualizar last_request y updated_at
   * @param clientId string
   * @returns Promise<void>
   */
  async updateLastRequest(clientId: string): Promise<void> {
    const updateQuery = `UPDATE rate_limits SET last_request = NOW(), updated_at = NOW() WHERE client_id = $1;`;
     await pool.query(updateQuery, [clientId]);
  }

  /**
   * Insertar nuevo registro si no existe
   * @param clientId string
   * @returns Promise<void>
   */
  async insertLastRequest(clientId: string): Promise<void> {
    const insertQuery = `INSERT INTO rate_limits (client_id, last_request, created_at, updated_at)VALUES ($1, NOW(), NOW(), NOW());`;
    await pool.query(insertQuery, [clientId]);
  }


  /**
   * Comprar maíz.
   * @param clientId
   * @returns Promise<void>
   */
  async buyCorn(clientId: string):Promise<void> {
    await pool.query(`INSERT INTO purchases (client_id, created_at, updated_at) VALUES ($1, NOW(),NOW())`, [clientId]);
  }
}

export default new BuyRepository();