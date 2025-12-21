import SQLite from 'react-native-sqlite-storage';
import { ZellerCustomer } from '../../types';
SQLite.enablePromise(true);
class DatabaseService {
    private db: SQLite.SQLiteDatabase | null = null;

    async init(): Promise<void> {
        try {
            this.db = await SQLite.openDatabase({
                name: 'zeller.db',
                location: 'default'
            });
            console.log('before creating table')
            await this.createTables();
            console.log('after creating table')

        } catch(e) {
            console.log('DB initialization failed', e);
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

    async getAllCustomers(): Promise<ZellerCustomer[]> {
        if(!this.db) throw new Error('DB not initialized');

        const [results] = await this.db.executeSql(`SELECT * FROM customers ORDER BY name`);
        const customers: ZellerCustomer[] = [];
        for(let i=0; i < results.rows.length; i++) {
            customers.push(results.rows.item(i));
        }
        return customers
    }

    async insertCustomers(customers: ZellerCustomer[]): Promise<void> {
        if(!this.db) throw new Error('DB not initialized');

        await this.db.transaction(tx => {
            customers.forEach(customer => {
                const {id, name, email, role} = customer;
                console.log(id)
                tx.executeSql('INSERT OR REPLACE INTO customers(id, name, email, role) VALUES(?, ?, ?, ?)',
                    [id, name, email, role]
                );
            });
        });

    }

    async addCustomer(customer: ZellerCustomer): Promise<void> {

    }

    async updateCustomer(customer: ZellerCustomer): Promise<void> {

    }

    async delteCustomer(id: string): Promise<void> {

    }

    async clearCustomer(): Promise<void> {
        if(!this.db) throw new Error('DB not initialized');

        await this.db.executeSql(`DELETE from customers`)

    }
}

export const databaseService = new DatabaseService();