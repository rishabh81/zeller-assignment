import SQLite from 'react-native-sqlite-storage';
import { IZellerCustomer } from '../../types';
SQLite.enablePromise(true);
class DatabaseService {
    private db: SQLite.SQLiteDatabase | null = null;

    async init(): Promise<void> {
        try {
            this.db = await SQLite.openDatabase({
                name: 'zeller.db',
                location: 'default'
            });
            await this.createTables();

        } catch(e) {
            throw e;
        }
    }

    private async createTables(): Promise<void> {
        if(!this.db) throw new Error('DB not initialized');

        await this.db.executeSql(`
        CREATE TABLE IF NOT EXISTS customers(
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        role TEXT NOT NULL
        ) 
        `)
    }

    async getAllCustomers(): Promise<IZellerCustomer[]> {
        if(!this.db) throw new Error('DB not initialized');

        const [results] = await this.db.executeSql(`SELECT * FROM customers ORDER BY name`);
        const customers: IZellerCustomer[] = [];
        for(let i=0; i < results.rows.length; i++) {
            customers.push(results.rows.item(i));
        }
        return customers
    }

    async insertCustomers(customers: IZellerCustomer[]): Promise<void> {
        if(!this.db) throw new Error('DB not initialized');

        await this.db.transaction(tx => {
            customers.forEach(customer => {
                const {id, name, email, role} = customer;
                tx.executeSql('INSERT OR REPLACE INTO customers(id, name, email, role) VALUES(?, ?, ?, ?)',
                    [id, name, email, role]
                );
            });
        });

    }

    async addCustomer(customer: IZellerCustomer): Promise<void> {
        if(!this.db) throw new Error('DB not initialized');

        await this.db.transaction(tx => {
                const {id, name, email, role} = customer;
                tx.executeSql('INSERT OR REPLACE INTO customers(id, name, email, role) VALUES(?, ?, ?, ?)',
                    [id, name, email, role]
                );
        });

    }

    async updateCustomer(customer: IZellerCustomer): Promise<void> {
        if(!this.db) throw new Error('DB not initialized');
            const { name, email, role, id } = customer
        await this.db.executeSql('UPDATE customers SET name = ?, email = ?, role = ? WHERE id = ?',
            [name, email, role, id]
        )
    }

    async delteCustomer(id: string): Promise<void> {
        if(!this.db) throw new Error('DB not initialized');
        await this.db.executeSql('DELETE FROM customers WHERE id = ?', [id]);
    }

    async clearCustomer(): Promise<void> {
        if(!this.db) throw new Error('DB not initialized');

        await this.db.executeSql(`DELETE from customers`)

    }
}

export const databaseService = new DatabaseService();