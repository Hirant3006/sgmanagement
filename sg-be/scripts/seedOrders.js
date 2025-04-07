const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const db = new sqlite3.Database(path.join(__dirname, '../family_business.db'));

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

// Sample machine types data
const machineTypes = [
    { name: 'Siêu sạch' },
    { name: 'Thường' }
];

// Sample machine subtypes data
const machineSubtypes = [
    { name: '1 cây' },
    { name: '2 cây/12 bạc đạn' },
    { name: '1m' }
];

// Sample machines data
const machines = [
    { name: 'Xe' }
];

// Orders data
const orders = [
    {
        date: '2025-01-01',
        machine_name: 'Xe',
        machine_type_name: 'Siêu sạch',
        machine_subtype_name: '1 cây',
        quantity: 1,
        source: 'Tây',
        payment_type: 'Toàn bộ',
        note: '',
        price: 9500000,
        cost_of_good: 6700000,
        purchase_location: 'Cù Lao Dung',
        shipping_cost: null
    },
    {
        date: '2025-01-01',
        machine_name: 'Xe',
        machine_type_name: 'Siêu sạch',
        machine_subtype_name: '2 cây/12 bạc đạn',
        quantity: 1,
        source: '',
        payment_type: 'Toàn bộ',
        note: '',
        price: 11300000,
        cost_of_good: 7700000,
        purchase_location: 'Kế Sách',
        shipping_cost: null
    },
    {
        date: '2025-01-02',
        machine_name: 'Xe',
        machine_type_name: 'Thường',
        machine_subtype_name: '1m',
        quantity: 1,
        source: '',
        payment_type: 'Toàn bộ',
        note: 'Không mô tơ',
        price: 7200000,
        cost_of_good: 6000000,
        purchase_location: 'Vĩnh Châu',
        shipping_cost: null
    }
];

// Insert machine types
const insertMachineTypes = () => {
    const stmt = db.prepare('INSERT INTO machine_types (name) VALUES (?)');
    machineTypes.forEach(type => {
        stmt.run(type.name);
    });
    stmt.finalize();
};

// Insert machine subtypes
const insertMachineSubtypes = () => {
    const stmt = db.prepare('INSERT INTO machine_subtypes (name) VALUES (?)');
    machineSubtypes.forEach(subtype => {
        stmt.run(subtype.name);
    });
    stmt.finalize();
};

// Insert machines
const insertMachines = () => {
    const stmt = db.prepare('INSERT INTO machines (name) VALUES (?)');
    machines.forEach(machine => {
        stmt.run(machine.name);
    });
    stmt.finalize();
};

// Insert orders
const insertOrders = () => {
    const stmt = db.prepare(`
        INSERT INTO orders (
            date,
            machine_id,
            machine_type_id,
            machine_subtype_id,
            source,
            price,
            cost_of_good,
            shipping_cost,
            purchase_location,
            note
        )
        VALUES (?, 
            (SELECT id FROM machines WHERE name = ?),
            (SELECT id FROM machine_types WHERE name = ?),
            (SELECT id FROM machine_subtypes WHERE name = ?),
            ?, ?, ?, ?, ?, ?
        )
    `);

    orders.forEach(order => {
        stmt.run(
            order.date,
            order.machine_name,
            order.machine_type_name,
            order.machine_subtype_name,
            order.source,
            order.price,
            order.cost_of_good,
            order.shipping_cost,
            order.purchase_location,
            order.note
        );
    });
    stmt.finalize();
};

// Run the seed process
const seedData = async () => {
    try {
        // Insert reference data first
        insertMachineTypes();
        insertMachineSubtypes();
        insertMachines();

        // Wait a bit for the reference data to be inserted
        setTimeout(() => {
            // Then insert orders that depend on the reference data
            insertOrders();
            console.log('Seed data inserted successfully');
        }, 1000);
    } catch (error) {
        console.error('Error seeding data:', error);
    }
};

// Run the seeding
seedData(); 