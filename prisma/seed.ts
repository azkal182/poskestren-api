// Seeder for Prisma schema data

// Import PrismaClient
const { PrismaClient } = require('@prisma/client');

// Create an instance of PrismaClient
const prisma = new PrismaClient();

async function main() {
  const patients = [
    {
      name: 'John Doe',
      asrama: 'A1',
      hospitalizations: {
        create: {
          complaint: 'Fever and cough',
        },
      },
      checkUps: {
        create: {
          requirement: 'Regular checkup',
          payment_source: 'Insurance',
          payment_total: 150.0,
          payment: 0.0,
          status: 'Pending',
        },
      },
      borrowMoneyInCash: {
        create: {
          payment: 50.0,
          status: 'Pending',
          payment_date_time: new Date(),
          checkUp: { connect: { id: 1 } }
        },
      },
      hostel: {
      	create: {
      		name: "takhosus"
      	}
      }
    },
    // Add more patient data here if needed
  ];

  for (const patient of patients) {
    await prisma.patient.create({
      data: patient,
    });
  }
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    // Close the PrismaClient connection
    await prisma.$disconnect();
  });

