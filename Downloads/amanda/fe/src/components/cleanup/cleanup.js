import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

async function cleanupTransactionTables() {
  try {
    console.log('Starting cleanup...');
    
    // Delete all records from TransactionLog first
    console.log('Deleting transaction logs...');
    await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 0;`;
    await prisma.$executeRaw`TRUNCATE TABLE trans_log;`;
    
    // Then delete all transactions
    console.log('Deleting transactions...');
    await prisma.$executeRaw`TRUNCATE TABLE transactions;`;
    await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 1;`;
    
    console.log('Successfully cleaned up transaction tables');
  } catch (error) {
    console.error('Error during cleanup:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the cleanup
cleanupTransactionTables();